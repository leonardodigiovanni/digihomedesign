# Drag & Drop tra caselle immagine — Immagini categorie

**Data:** 2026-07-30
**Stato:** completato

## Riepilogo implementazione

- `app/amministrazione/immagini-categorie/actions.ts`: aggiunta `copiaImmagineCategoria(...)`, ritorna anche l'URL copiato per aggiornare subito l'anteprima.
- `app/amministrazione/immagini-categorie/immagini-categorie-client.tsx`: `ImmagineSlotBox` ora drag source (immagine `draggable`) + drop target sempre attivo, con evidenziazione bordo tratteggiato durante il drag-over. Nessun vincolo di tipo/categoria/sottocategoria sulla destinazione.
- `tsc --noEmit` pulito.

## Obiettivo

Stesso problema già risolto in Listini: in `/amministrazione/immagini-categorie` ogni casella (`ImmagineSlotBox`, una per categoria/sottocategoria di shop/promo/cataloghi) fa un upload su Vercel Blob a ogni Ctrl+V/Carica — incollare la stessa immagine in 20 caselle produce 20 blob duplicati. Serve poter trascinare una casella già valorizzata su un'altra casella (stessa o diversa categoria/sottocategoria/tipo) per copiarci dentro lo stesso URL, senza nuovo upload — esattamente come `ImgCell`/`copiaImmagine` in Listini.

## File coinvolti

### `app/amministrazione/immagini-categorie/actions.ts`
- Nuova funzione esportata `copiaImmagineCategoria(sourceTipo, sourceCategoria, sourceSottocategoria, sourceSlot, destTipo, destCategoria, destSottocategoria, destSlot)`:
  - `checkAdmin()`
  - Legge l'URL sorgente con `getImmagineCategoria`/`getImmagineSottocategoria` (già in `lib/categoria-immagini.ts`) a seconda di `sourceSlot`
  - Se assente → `{ ok: false, error: 'Immagine sorgente non trovata.' }`
  - Scrive con `upsertImmagineCategoria`/`upsertImmagineSottocategoria` a seconda di `destSlot` (insert se vuota, update se già presente)
  - `revalidatePath` sulle stesse pagine già invalidate da `rimuoviImmagineCategoria`
  - Ritorna anche l'URL copiato, per aggiornare subito l'anteprima lato client senza aspettare un reload

### `app/amministrazione/immagini-categorie/immagini-categorie-client.tsx`
- `ImmagineSlotBox` diventa drag source (se ha `url`, il contenitore è `draggable`, `onDragStart` scrive in `dataTransfer` `{ tipo, categoria, sottocategoria, slot }`) e drop target sempre attivo (anche su casella vuota, per l'insert; nessun vincolo — si può trascinare tra tipi/categorie/sottocategorie diverse, come già deciso per Listini)
- `onDrop`: legge il payload, se identico alla casella stessa ignora, altrimenti chiama `copiaImmagineCategoria(...)` e aggiorna `url` locale con quello ritornato
- Evidenziazione bordo tratteggiato durante il drag-over, stesso stile già usato altrove

## Nessun impatto su

- Ctrl+V / bottone "Carica" esistenti — restano il modo per portare una **nuova** immagine dentro il sistema
- Bottone "✕" di rimozione
- Altre pagine (Listini, Cataloghi, ecc.)

## Da confermare prima di scrivere codice

Attendo conferma esplicita su questo documento prima di procedere con l'implementazione.
