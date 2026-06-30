# Percorsi categoria+sottocategoria — listini e catalogo_voci

**Data:** 2026-06-29  
**Stato:** completato

## Riepilogo implementazione

File toccati:
1. `lib/percorsi.ts` (nuovo) — `ensurePercorsiTables`, `syncListinoPercorsi`, `syncVocePercorsi`, server actions `addPercorsoListino/removePercorsoListino/addPercorsoVoce/removePercorsoVoce`
2. `lib/catalogo-matching.ts` — `matchArticoliPerVoce` usa percorsi JOIN
3. `app/brand/cataloghi/[slug]/page.tsx` — pool query usa `listini_percorsi`
4. `app/app/cataloghi/[slug]/page.tsx` — idem
5. `app/brand/cataloghi/[slug]/[voceSlug]/page.tsx` — 3 branch consolidati in 1 con percorsi JOIN su `voce.id`
6. `app/app/cataloghi/[slug]/[voceSlug]/page.tsx` — idem
7. `app/area-lavoro/listini/actions.ts` — sync percorsi in add/update/clone/delete
8. `app/area-lavoro/cataloghi/actions.ts` — sync percorsi in addVoce/updateListinoVoce/updateVoce/deleteVoce
9. `app/area-lavoro/listini/page.tsx` — carica `percorsiPerListino` e passa a client
10. `app/area-lavoro/listini/listini-client.tsx` — `PercorsiPanel` + pulsante "Percorsi" in ogni riga, sub-row espandibile
11. `app/area-lavoro/cataloghi/page.tsx` — carica `percorsiPerVoce` e passa a client
12. `app/area-lavoro/cataloghi/cataloghi-client.tsx` — `PercorsiVocePanel` sotto `ListinoVoceForm` in ogni voce

## Obiettivo

Normalizzare le coppie (categoria, sottocategoria) di listini e catalogo_voci in tabelle di raccordo dedicate. Ogni record può avere N coppie valide. La UI di front-end (modali, selezione articoli) resta invariata; il matching query usa le nuove tabelle.

## Nuove tabelle

### `listini_percorsi`
```sql
id          INT AUTO_INCREMENT PRIMARY KEY
listino_id  INT NOT NULL
categoria   VARCHAR(100) NOT NULL DEFAULT ''
sottocategoria VARCHAR(100) NOT NULL DEFAULT ''
UNIQUE KEY (listino_id, categoria, sottocategoria)
```

### `catalogo_voci_percorsi`
```sql
id          INT AUTO_INCREMENT PRIMARY KEY
voce_id     INT NOT NULL
categoria   VARCHAR(100) NOT NULL DEFAULT ''
sottocategoria VARCHAR(100) NOT NULL DEFAULT ''
UNIQUE KEY (voce_id, categoria, sottocategoria)
```

## Migrazione automatica (idempotente)

Eseguita ad ogni avvio delle pagine che usano il matching, via INSERT IGNORE:

```sql
-- listini_percorsi: un percorso per listino basato su categoria + sottocategoria correnti
INSERT IGNORE INTO listini_percorsi (listino_id, categoria, sottocategoria)
SELECT id, categoria, COALESCE(sottocategoria, '')
FROM listini
WHERE categoria IS NOT NULL AND categoria != ''

-- catalogo_voci_percorsi: un percorso per voce basato su listino_categoria + sottocategoria correnti
INSERT IGNORE INTO catalogo_voci_percorsi (voce_id, categoria, sottocategoria)
SELECT id, listino_categoria, COALESCE(sottocategoria, '')
FROM catalogo_voci
WHERE listino_categoria IS NOT NULL AND listino_categoria != ''
```

## UI admin per gestione coppie (richiesta dall'utente)

Nelle pagine admin di area-lavoro/listini e area-lavoro/cataloghi, aggiungere sotto ogni record un pannello "Percorsi" con:
- Lista delle coppie esistenti (categoria | sottocategoria | ✕ rimuovi)
- Form inline per aggiungere una nuova coppia (input categoria + input sottocategoria + Aggiungi)

La coppia singola esistente viene mostrata nel pannello percorsi come punto di partenza.

## Matching aggiornato

Un articolo listino viene mostrato per una voce se condividono almeno una coppia (categoria, sottocategoria):

```sql
SELECT DISTINCT l.<LISTINO_COLS>
FROM listini l
JOIN listini_percorsi lp ON lp.listino_id = l.id
WHERE l.disponibile = 1 AND l.preventivabile = 1 AND l.principale = 1
  AND EXISTS (
    SELECT 1 FROM catalogo_voci_percorsi vp
    WHERE vp.voce_id = :voce_id
      AND vp.categoria = lp.categoria
      AND vp.sottocategoria = lp.sottocategoria
  )
  -- filtri aggiuntivi (fase, materiale, ecc.) restano invariati
ORDER BY l.descrizione ASC
```

## Write path — sincronizzazione

Quando si salva un listino o una voce con nuovi valori di categoria/sottocategoria:
- INSERT nuovo record → INSERT IGNORE nella tabella percorsi corrispondente
- UPDATE record → DELETE percorso obsoleto + INSERT IGNORE del nuovo (oppure REPLACE INTO)
- DELETE record → DELETE a cascata dai percorsi (ON DELETE CASCADE oppure DELETE esplicita)

Per le azioni admin (aggiungi/rimuovi coppia singola dal pannello percorsi) si aggiungono due server action: `addPercorsoListino` / `removePercorsoListino` e `addPercorsoVoce` / `removePercorsoVoce`.

## File coinvolti

1. `lib/percorsi.ts` *(nuovo)* — `ensurePercorsiTables(db)`, migrate, sync helpers
2. `lib/catalogo-matching.ts` — aggiorna `matchArticoliPerVoce` (usa percorsi join)
3. `app/area-lavoro/listini/actions.ts` — `addArticolo`, `updateArticolo`, `cloneArticolo` + nuove action percorsi
4. `app/area-lavoro/cataloghi/actions.ts` — `addVoce`, `updateListinoVoce`, `updateVoce` + nuove action percorsi
5. `app/area-lavoro/listini/listini-client.tsx` — UI pannello percorsi per ogni articolo
6. `app/area-lavoro/cataloghi/cataloghi-client.tsx` — UI pannello percorsi per ogni voce
7. `app/brand/cataloghi/[slug]/[voceSlug]/page.tsx` — query listini usa percorsi join
8. `app/app/cataloghi/[slug]/[voceSlug]/page.tsx` — stessa fix

Modifiche identiche per versione sito e app.

## Note comportamentali

- Listini con sottocategoria=NULL migrano come percorso ('categoria', '')
- Voci con listino_categoria e sottocategoria=NULL migrano come ('listino_categoria', '')
- Il matching esatto (categoria E sottocategoria) è più preciso dell'attuale: una voce ('infissi','') trova solo listini con percorso ('infissi',''), non tutti gli infissi
- L'utente può aggiungere coppie aggiuntive dal pannello admin per ripristinare o ampliare il matching
