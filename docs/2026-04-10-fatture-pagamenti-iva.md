# Fatture — Pagamenti a tranches e aliquote IVA predefinite

**Data:** 2026-04-10  
**Stato:** in attesa di approvazione

---

## Obiettivo

1. **Pagamenti a tranches** — ogni fattura può essere saldata in più rate. Si registra ogni pagamento singolarmente con data e importo. Lo stato della fattura diventa derivato: Non pagata / Parziale / Saldata.
2. **Aliquote IVA da lookup** — il campo IVA diventa una `<select>` con valori fissi: Esente (0%), 10%, 22%.

---

## Modifiche DB

### Tabella `fatture`
- Rimuovere colonna `pagata` (rimpiazzata dallo stato derivato)
- Aggiungere colonna `importo_pagato DECIMAL(10,2) DEFAULT 0` (aggiornata ad ogni nuovo pagamento)

### Nuova tabella `pagamenti_fattura`
| Colonna        | Tipo           | Note                    |
|----------------|----------------|-------------------------|
| `id`           | INT PK AUTO    |                         |
| `fattura_id`   | INT FK         | → fatture.id            |
| `data`         | DATE           | Data del pagamento      |
| `importo`      | DECIMAL(10,2)  | Importo ricevuto/versato|
| `note`         | VARCHAR(200)   | Facoltativo             |
| `created_at`   | TIMESTAMP      |                         |

---

## Stato fattura (derivato)

| Condizione                          | Stato        | Colore  |
|-------------------------------------|--------------|---------|
| `importo_pagato = 0`                | Non pagata   | Rosso   |
| `0 < importo_pagato < totale`       | Parziale     | Arancio |
| `importo_pagato >= totale`          | Saldata      | Verde   |

---

## Aliquote IVA

Select con opzioni fisse:
- **Esente** → 0%
- **10%** → 10
- **22%** → 22

---

## UI

- In tabella: colonna "Stato" con badge colorato + colonna "Pagato €" che mostra `importo_pagato / totale`
- Pulsante **"+ Pagamento"** per ogni riga → apre form inline con data, importo, note
- Lista pagamenti registrati visibile espandendo la riga (o sotto la riga)
- Eliminazione singolo pagamento (con ricalcolo `importo_pagato`)

---

## File coinvolti

| File | Azione |
|---|---|
| `app/fatture/page.tsx` | Fetch fatture + pagamenti aggregati |
| `app/fatture/fatture-client.tsx` | UI aggiornata: stato derivato, form pagamento, IVA select |
| `app/fatture/actions.ts` | Nuove actions: `addPagamento`, `deletePagamento`; modifica `addFattura` |
