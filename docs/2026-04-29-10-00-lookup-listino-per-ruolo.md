# Lookup listino per ruolo nel preventivo

**Data:** 2026-04-29  
**Stato:** approvato

## Obiettivo

Nel form "Aggiungi articolo" del preventivo, la lookup "Modello / Profilo" si comporta diversamente in base al ruolo:

| Ruolo | Deduplicazione | Prezzo | Fornitore |
|-------|---------------|--------|-----------|
| cliente / non loggato | Sì — un solo item per (categoria+produttore+descrizione) | Nascosto | Nascosto |
| dipendente / admin | No — tutti gli item anche duplicati | Visibile | Visibile |

- **Deduplicazione**: tra più righe con stesso prodotto, si mostra solo quella con margine maggiore `(prezzo_vendita - prezzo_acquisto)` → il `listino_id` salvato punta già alla voce ottimale
- **Staff**: nella `<option>` si vede `descrizione (unità — €prezzo · fornitore)`
- **Non-staff**: nella `<option>` si vede `descrizione (unità)` senza prezzo né fornitore

## File coinvolti

| File | Modifica |
|------|----------|
| `app/clienti/preventivi/[id]/preventivo-client.tsx` | Aggiunge `fornitore_nome?` a `ListinoItem`; condiziona testo option |
| `app/area-clienti/preventivi/[id]/page.tsx` | Query con JOIN fornitori; deduplica in JS per non-staff; azzera prezzo_vendita per non-staff |
| `app/clienti/preventivi/[id]/page.tsx` | Query con JOIN fornitori (sempre staff) |

## Note tecniche

- Deduplicazione avviene server-side in JS: raggruppa per chiave `categoria||produttore||descrizione`, tiene la riga col margine più alto
- `prezzo_vendita` viene azzerato (= 0) per non-staff prima di passare al client → il `fd.set('prezzo_base', ...)` salverà 0, poi lo staff aggiusterà manualmente se necessario; oppure si può non azzerarlo e usare il prezzo della voce best-margin anche per il cliente (più sensato)
- Scelta: si passa comunque il `prezzo_vendita` corretto al motore di calcolo — è la riga col margine migliore, che è anche quella ottimale per la vendita. Solo il testo dell'option nasconde il numero al cliente.
