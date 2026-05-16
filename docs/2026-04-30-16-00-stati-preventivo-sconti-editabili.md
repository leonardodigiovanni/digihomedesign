# Stati preventivo + sconti editabili per stato

**Stato**: da confermare
**Data**: 2026-04-30

---

## Problema immediato

Gli sconti impostati in anagrafica-clienti (`sconto_pct`) e in listini (`sconto_articolo`) non si vedono nel preventivo corrente perché **devono essere applicati cliccando "Genera"** sul preventivo. Il tasto Genera rilegge i valori dal DB e aggiorna `prezzo_totale` per riga + `importo` totale con sconto. Se il preventivo non è stato rigenerato dopo aver impostato i valori, i campi snapshot restano a 0.

---

## Nuovo stato macchina

| Stato | Etichetta visiva | Chi può cambiarlo | Comportamento sconti |
|-------|-----------------|-------------------|----------------------|
| `bozza` | Bozza | staff | Genera rilegge sconto da DB (clienti + listini) |
| `richiesto` | Richiesto dal cliente | staff/cliente | Genera usa snapshot già salvati; staff può modificare `sconto_cliente_pct` e `sconto_articolo_pct` manualmente |
| `presentato` | Presentato al cliente | staff | Preventivo bloccato — nessuna modifica possibile |
| `accettato` | Accettato | staff/cliente | Finale |
| `rifiutato` | Rifiutato | staff/cliente | Finale |
| `scaduto` | Scaduto | automatico | Finale (data + validita_giorni < oggi) |

L'attuale stato `inviato` viene rimpiazzato da `presentato`. Migrazione: `UPDATE preventivi SET stato='presentato' WHERE stato='inviato'`.

---

## Regole per stato

### `bozza`
- Genera → rilegge `clienti.sconto_pct` e `listini.sconto_articolo`, applica e salva snapshot
- Tutto editabile (aggiungi/rimuovi articoli, descrizione, cliente, note)
- Bottone avanzamento: "Segna come richiesto dal cliente" → passa a `richiesto`

### `richiesto`
- Genera → usa snapshot (`sconto_articolo_pct` per riga, `sconto_cliente_pct` sul preventivo)
- Tutto editabile come in bozza
- **In più**: staff può sovrascrivere `sconto_cliente_pct` direttamente sul preventivo (campo inline)
- **In più**: staff può sovrascrivere `sconto_articolo_pct` per ogni articolo (campo inline per riga)
- Bottone avanzamento: "Presenta al cliente" → passa a `presentato`

### `presentato`
- **Sola lettura** — nessun bottone di aggiunta/rimozione articoli
- Bottoni avanzamento: "Accetta" → `accettato` | "Rifiuta" → `rifiutato`
- Stampa/PDF disponibile

### `accettato` / `rifiutato` / `scaduto`
- Sola lettura
- Stampa/PDF disponibile

### Auto-`scaduto`
- Al caricamento della pagina del preventivo: se stato non è `accettato`/`rifiutato`/`scaduto` e `data + validita_giorni < oggi` → aggiorna automaticamente a `scaduto`

---

## Modifiche DB

```sql
-- Cambia ENUM aggiungendo i nuovi valori
ALTER TABLE preventivi MODIFY COLUMN stato
  ENUM('bozza','richiesto','presentato','inviato','accettato','rifiutato','scaduto')
  NOT NULL DEFAULT 'bozza';

-- Migra inviato → presentato (retrocompatibilità)
UPDATE preventivi SET stato = 'presentato' WHERE stato = 'inviato';

-- Poi puoi anche togliere 'inviato' dall'ENUM in un secondo momento (opzionale)
```

---

## File coinvolti

| File | Modifica |
|------|----------|
| `app/clienti/preventivi/actions.ts` | `generaPreventivo` usa DB-read in `bozza`, snapshot in `richiesto`; nuova action `cambiaStato`; action `aggiornaSconto` per override manuale; auto-scaduto check |
| `app/clienti/preventivi/[id]/preventivo-client.tsx` | Blocco editing in `presentato`+; bottoni avanzamento stato; campo sconto cliente editabile in `richiesto`; sconto per riga editabile in `richiesto` |
| `app/clienti/preventivi/[id]/page.tsx` | Chiama auto-scaduto check prima di rendere la pagina |
| `app/area-clienti/preventivi/[id]/page.tsx` | Idem |
| Tutti i file che mostrano stato | Aggiornare colori/label per i nuovi stati |

---

## Colori stati

| Stato | Testo | Sfondo |
|-------|-------|--------|
| bozza | `#000` | `transparent` |
| richiesto | `#1a5276` | `#d6eaf8` |
| presentato | `#4a235a` | `#f5eef8` |
| accettato | `#276749` | `#f0fff4` |
| rifiutato | `#c00` | `#fff5f5` |
| scaduto | `#8a6d3b` | `#fffbeb` |
