# Sconti automatici su aggiungi/rimuovi + stati preventivo

**Stato**: completato (fase 1)
**Data**: 2026-04-30

---

## Problema attuale

`aggiungiArticolo` e `rimuoviArticolo` ricalcolano il totale con un semplice `SUM(prezzo_totale)` senza applicare sconti. `generaPreventivo` esiste nel codice ma non è richiamato da nessun bottone nella UI — quindi gli sconti non vengono mai applicati nel flusso normale.

---

## Obiettivo

### 1. Sconti applicati in automatico ad ogni aggiunta/rimozione articolo

Quando un articolo viene aggiunto o rimosso, il sistema:

1. Legge `listini.sconto_articolo` per l'articolo (se ha `listino_id`)
2. Applica al `prezzo_totale` del singolo articolo — salva snapshot `sconto_articolo_pct`
3. Somma tutti i `prezzo_totale` (imponibile post-sconto-articolo)
4. Legge `clienti.sconto_pct` dal cliente associato al preventivo (se presente)
5. Applica al totale — salva snapshot `sconto_cliente_pct` + aggiorna `preventivi.importo`

Questo sostituisce l'approccio "genera manualmente". Il campo `importo` è sempre aggiornato.

### 2. UI utente loggato (cliente con sconto)

Nel preventivo detail (area-clienti e area staff), il blocco totale mostra:
- Subtotale: € X
- Sconto cliente (Y%): − € Z
- **Totale: € W**

se `sconto_cliente_pct > 0`, altrimenti mostra solo il totale.

Articoli con `sconto_articolo_pct > 0` mostrano la percentuale in colore arancio.

### 3. Messaggio invoglio registrazione (utente non loggato o senza sconto)

Nel carrello preventivo (`/area-clienti/carrello-preventivo`), se l'utente **non è loggato** oppure è loggato ma non ha ancora sconto assegnato:

> "Registrati o accedi — i nostri clienti registrati ricevono sconti esclusivi sulle loro offerte."

Con un bottone "Accedi / Registrati" → `/login` o `/registrazione`.

---

## Nuovo stato macchina (da doc precedente, semplifcato)

| Stato | Label | Editabile | Sconti |
|-------|-------|-----------|--------|
| `bozza` | Bozza | Sì | Auto da DB ad ogni modifica |
| `richiesto` | Richiesto dal cliente | Sì (+ override sconto manuale) | Usa snapshot salvato, staff può rettificare |
| `presentato` | Presentato al cliente | No (sola lettura) | Definitivi |
| `accettato` | Accettato | No | — |
| `rifiutato` | Rifiutato | No | — |
| `scaduto` | Scaduto | No | — |

La migrazione ENUM aggiunge `richiesto` e `presentato`; `inviato` rimane per retrocompatibilità e viene trattato come `presentato`.

**I bottoni di avanzamento stato e il blocco editing in `presentato`+ sono un secondo passo** — possono essere implementati dopo.

---

## File coinvolti (fase 1 — sconti automatici)

| File | Modifica |
|------|----------|
| `app/clienti/preventivi/actions.ts` | Helper `ricalcolaTotaleConSconti`; aggiornare `aggiungiArticolo` e `rimuoviArticolo` per usarlo; aggiornare `sconto_articolo_pct` al momento dell'insert |
| `app/brand/cataloghi/actions.ts` — `salvaCarrelloComePreventivo` | Applicare `sconto_articolo` per riga e `sconto_pct` cliente al salvataggio del carrello |
| `app/area-clienti/carrello-preventivo/carrello-client.tsx` | Banner "registrati per sconti" se utente non loggato / senza sconto |

La UI di visualizzazione sconti (breakdown totale + colonna Sc.art.%) è già implementata dal doc precedente.
