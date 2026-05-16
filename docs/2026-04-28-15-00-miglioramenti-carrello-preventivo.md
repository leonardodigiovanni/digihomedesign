# Miglioramenti Carrello Preventivo e Form Articoli

**Stato:** completato  
**Data:** 2026-04-28

## Interventi effettuati

### Form preventivo (`clienti/preventivi/[id]`)
- Rimosso riquadro "Allestimento / Accessori" per i clienti (`isStaff` guard)
- Tutti i campi del form resi obbligatori (`required` + `reportValidity()` per validazione nativa browser)
- Colore: `required`, prima option cambiata in "— Seleziona colore —"
- Tipo vetro: `required`, prima option cambiata in "— Seleziona vetro —"
- Modello: validato via JS (`if (!listinoId)`) poiché il select non ha `name`
- `disabled` del bottone Salva aggiornato: `!tipo || !marca || !listinoId`
- Rimosso bottone "⚡ Genera preventivo" — il calcolo avviene ora in `aggiungiArticolo`

### Calcolo prezzo automatico in `aggiungiArticolo` (`clienti/preventivi/actions.ts`)
- `aggiungiArticolo` ora calcola `prezzo_totale` al momento dell'inserimento con formula:
  - `pz`: `prezzo_base × quantità`
  - `ml`: `prezzo_base × (larghezza_cm/100) × quantità`
  - `m²`: `prezzo_base × (larghezza_cm/100) × (altezza_cm/100) × quantità`
- Aggiorna `preventivi.importo` come somma di tutti gli articoli dopo ogni inserimento

### Stessa logica in `salvaCarrelloComePreventivo` (`brand/cataloghi/actions.ts`)
- Aggiunto calcolo `prezzo_totale` per ogni articolo del carrello con la stessa formula
- Aggiunto aggiornamento `preventivi.importo` dopo l'inserimento di tutti gli articoli

### Form `AggiungiArticoloForm` (`components/aggiungi-articolo-form.tsx`)
- Aggiunti campi: **Colore** (select required, lista COLORI), **Note** (textarea facoltativa)
- Ordine griglia: Larghezza | Altezza (stessa riga), poi N° ante | Quantità
- Tutti i campi obbligatori (tranne Note) con `required` HTML
- Cookie esteso con `colore` e `note` in `CartItem`

### Carrello preventivo UI (`area-clienti/carrello-preventivo`)
- Aggiunto bottone **"Svuota carrello"** (stile spazzolato rosso scuro, con `confirm()`)
- `svuotaCarrello` action in `brand/cataloghi/actions.ts`
- Bottoni sulla stessa riga, `height: 38`, `display: inline-flex`
- "Salva come preventivo": stile spazzolato verde coerente con `.btn-green`
- Testo info adattivo: messaggio diverso per utente loggato vs non registrato
- **Calcolo prezzi corretto**: `calcolaPrezzo()` usa formula m²/ml/pz anche nell'UI
- Colonna "Prezzo unit." mostra l'unità (`€200/m²`)

### PDF carrello provvisorio (`area-clienti/carrello-preventivo/stampa/page.tsx`)
- `ArtRow` esteso con `larghezza_cm` e `altezza_cm`
- Cart type aggiornato a `{ id, q, l?, h? }`
- `calcolaPrezzo()` usata in `articoloHTML` e nel totale finale
- Path loghi corretti: `/images/volantino/dg-t.png`, `/images/volantino/nome_tr.png`
- Normalizzazione path al volo anche per template caricati da DB

### Path immagini loghi (`dg-t.png`, `nome_tr.png`)
- Aggiornati in tutti i file che li referenziavano con il vecchio path `/images/`:
  - `app/amministrazione/templates/page.tsx`
  - `app/area-clienti/preventivi/[id]/stampa/page.tsx`
  - `app/area-clienti/carrello-preventivo/stampa/page.tsx`
  - `app/disegno/disegno-client.tsx`
- Normalizzazione runtime nel `getHeaderTemplate` del carrello stampa
