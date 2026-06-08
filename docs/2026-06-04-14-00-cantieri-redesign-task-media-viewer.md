# Redesign Cantieri — Task + Media Viewer per Cliente

**Data:** 2026-06-04  
**Stato:** completato

---

## Obiettivo

Riprogettare il modulo cantieri su tre livelli:

1. **DB** — cantiere senza cliente obbligatorio, `cantieri_lavori` diventa task con campi operativi, `cantieri_media` si sposta dal cantiere al task e acquista il flag `visto`.
2. **Staff (area-lavoro)** — il cantiere si crea senza cliente, il cliente si associa in seguito tramite lookup. I task hanno nuovi campi. I media si caricano sul task. Si vede quale media ha visto il cliente.
3. **Cliente (area-clienti)** — navigazione a tre livelli: griglia cantieri → griglia task → viewer foto/video con scroll stile PDF. La visualizzazione di un media imposta `visto = 1`.

---

## Modifiche DB

### `cantieri`
- `cliente_id` rimane `INT NULL` — nessuna modifica strutturale.
- Rimozione della validazione obbligatoria nel server action `addCantiere` (attualmente restituisce errore se manca).

### `cantieri_lavori` (→ task)
Colonne da **rimuovere**: `qta`, `unita`, `prezzo_unit`, `sconto_pct`, `totale`, `visibile_cliente`  
Colonne da **aggiungere**: `data_inizio DATE NULL`, `data_fine DATE NULL`, `note TEXT NULL`, `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`  
Eseguito tramite `ALTER TABLE` con `try/catch` (idempotente).

### `cantieri_media`
Colonne da **rimuovere**: `cantiere_id`, `visibile_cliente`  
Colonna da **rinominare/aggiungere**: `task_id INT NOT NULL` (FK → `cantieri_lavori.id ON DELETE CASCADE`)  
Colonna da **aggiungere**: `visto TINYINT(1) NOT NULL DEFAULT 0`  
> ⚠️ I media esistenti non hanno un task associato: verranno eliminati o migrati con task_id=0 (da gestire a mano sul DB se ci sono dati reali).

---

## File coinvolti

| File | Cosa cambia |
|------|-------------|
| `app/area-lavoro/cantieri/actions.ts` | `ensureTables` aggiornato; `addCantiere` senza cliente obbligatorio; `addAssignCliente` nuovo; `addLavoro`/`deleteLavoro` con nuovi campi; `addMedia`/`deleteMedia` con task_id; nuovo `markVisto` |
| `app/area-lavoro/cantieri/page.tsx` | query aggiornata |
| `app/area-lavoro/cantieri/cantieri-client.tsx` | UI: form cantiere senza cliente obbligatorio + pulsante lookup; form task con nuovi campi; media su task; badge "visto/non visto" per staff |
| `app/area-clienti/cantieri/page.tsx` | query corretta (usa `users.cliente_id`); carica cantieri → task → media |
| `app/area-clienti/cantieri/cantieri-cliente-client.tsx` | **nuovo** — griglia cantieri → griglia task → viewer multimediale |

---

## UX cliente — navigazione a tre livelli

```
[Griglia cantieri]
  → click su un cantiere
[Griglia task del cantiere]
  → click su un task
[Viewer multimediale]
  → scorrimento verticale foto/video (come PDF reader)
  → ogni item: al mount/scroll in view → chiama markVisto(media.id)
  → frecce prev/next per navigare tra i task
```

## UX staff — assegnazione cliente

Il form di creazione cantiere ha il campo cliente opzionale (cerca per nome/ragione sociale, lookup inline).  
Nel dettaglio cantiere, se `cliente_id` è null, appare pulsante "Associa cliente" che apre lo stesso lookup.

---

## Query corretta per il cliente

```sql
SELECT c.*, NULL AS cliente_nome
FROM cantieri c
INNER JOIN users u ON u.cliente_id = c.cliente_id
WHERE u.username = ?
  AND c.visibile_cliente = 1
ORDER BY c.created_at DESC
```

---

## Passi di implementazione

1. Aggiornare `ensureTables` in `actions.ts` (area-lavoro) con le migrazioni ALTER TABLE.
2. Aggiornare `addCantiere`: cliente_id opzionale.
3. Aggiungere action `assignClienteToCantiere`.
4. Riscrivere actions lavori: nuovi campi, rimozione campi commerciali.
5. Riscrivere actions media: task_id, visto.
6. Aggiungere action `markVisto`.
7. Aggiornare `cantieri-client.tsx` lato staff.
8. Riscrivere `app/area-clienti/cantieri/page.tsx` (query + data loading).
9. Creare `cantieri-cliente-client.tsx` con navigazione tre livelli + viewer.
