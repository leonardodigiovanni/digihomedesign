# Carrello Computometrico — filiera completa

**Data:** 2026-07-03  
**Stato:** in pianificazione

## Obiettivo

Replicare la filiera dei preventivi (`/area-clienti/preventivi`) per i computometrici, con la differenza che gli articoli disponibili sono solo quelli con `computabile = 1` nella tabella `listini`.

## Filiera preventivi (da replicare)

1. `/area-clienti/preventivi` — lista preventivi (già implementato come `/area-clienti/computometrici`)
2. `/area-clienti/carrello-preventivo` — form per aggiungere articoli a un preventivo in bozza
3. `/area-clienti/preventivi/[id]` — dettaglio preventivo (view/modifica)

## Filiera computometrici (da creare)

1. `/area-clienti/computometrici` — lista computometrici ✅ già fatta
2. `/area-clienti/carrello-computometrico` — form per aggiungere articoli a un computometrico in bozza
3. `/area-clienti/computometrici/[id]` — dettaglio computometrico (view/modifica)

## Differenze chiave rispetto ai preventivi

- Articoli filtrati: solo `computabile = 1` in `listini`
- Tabella dati: `computometrici` + `computometrico_articoli` (da creare, simile a `preventivo_articoli`)
- Label "Computometrico N°" invece di "Preventivo N°"
- CTA home: se loggato → `/area-clienti/computometrici`; non loggato → `/area-clienti/carrello-computometrico`

## File coinvolti

| File | Azione |
|------|--------|
| `app/area-clienti/carrello-computometrico/page.tsx` | Nuovo — replicato da `carrello-preventivo/page.tsx` |
| `app/area-clienti/carrello-computometrico/carrello-client.tsx` | Nuovo — replicato da `carrello-preventivo/carrello-client.tsx` |
| `app/area-clienti/computometrici/[id]/page.tsx` | Nuovo — dettaglio computometrico |
| `app/page.tsx` | Aggiunta CTA computometrico |
| DB | Nuova tabella `computometrico_articoli` |

## Passi principali

1. Creare tabella `computometrico_articoli` (simile a `preventivo_articoli`)
2. Creare `/area-clienti/carrello-computometrico/page.tsx` + `carrello-client.tsx`
   - Filtra articoli con `computabile=1`
   - Crea/aggiorna computometrico in stato `bozza`
3. Creare `/area-clienti/computometrici/[id]/page.tsx`
   - Mostra articoli aggiunti, importo stimato, stato
4. Aggiungere CTA sulla home

## Note tecniche

- Leggere il carrello-preventivo esistente per struttura esatta prima di replicare
- La tabella `computometrico_articoli` avrà: id, computometrico_id, listino_id, percorso, larghezza, altezza, quantita, note, prezzo_unitario, totale
