# Uniformare stampa PDF preventivi salvati con carrello

**Data:** 2026-05-24  
**Stato:** completato

## Obiettivo

Allineare `app/area-clienti/preventivi/[id]/stampa/page.tsx` al carrello-preventivo stampa:

- Stesse funzioni di disegno (TC/TA con `disegnoTcTa`, `disegnoSVGAbbr` classico, `disegnoSVG`)
- Estrazione colore media (`extractAvgColor`) per gli articoli TC/TA → stessa colorazione barre
- Paginazione A4 multipagina (stesso algoritmo del carrello)
- Print tramite iframe (stesso metodo del carrello, elimina il bug del PDF troncato)
- **Conservare** tutto quello che i preventivi salvati hanno in più rispetto al carrello:
  - Sconti e maggiorazioni per singolo articolo (riga barrata + %)
  - Sconto personalizzato cliente sul totale
  - Dicitura: Preventivo Provvisorio (bozza/richiesto) vs Preventivo Ufficiale (altri stati)
  - Oggetto testuale diverso per stato
  - Note del preventivo
  - Campi extra: colore, tipo vetro, accessori, n_ante

## File coinvolti

1. `app/area-clienti/preventivi/[id]/stampa/page.tsx` — riscrittura quasi completa
2. `app/area-clienti/preventivi/[id]/stampa/stampa-client.tsx` — aggiungere iframe print

## Passi principali

### 1. Funzioni di disegno
Copiare da `carrello-preventivo/stampa/page.tsx`:
- `computeSVGDims`
- `disegnoSVG`
- `disegnoTcTa` (con anta/ribalta parser, drawAnta, pushFermavetri)
- `disegnoSVGAbbr` (che instrada a disegnoTcTa per TC/TA)

Eliminare le vecchie `disegnoSVG` / `disegnoSVGAbbr` esistenti (più semplici, senza TC/TA).

### 2. Estrazione colore
Aggiungere `import { extractAvgColor } from '@/lib/extract-color'`.  
Nel `loadData`, per ogni articolo radice con abbr TC/TA: cercare tra i figli quello con foto colore → `extractAvgColor` → passare `barColor` a `articoloBlockHTML`.

### 3. articoloBlockHTML adattato
Mantenere i campi DB correnti (`tipo_prodotto`, `marca`, `modello`, `colore`, `tipo_vetro`, `accessori`, `altezza_cm`, `larghezza_cm`, `n_ante`, `prezzo_totale`, `prezzo_pre_sconto`, `sconto_articolo_pct`, `foto_url`, `abbr`, `profilo_mm`).  
Aggiungere il parametro `barColor` opzionale passato a `disegnoSVGAbbr`.

### 4. caratteristicheHTML
Invariato (già gestisce sconto % e maggiorazione % su padre).

### 5. estimaAltezzaBlock
Stessa formula del carrello, adattata ai figli DB (usa `parent_id`).

### 6. buildPages per preventivi salvati
Stesso algoritmo del carrello (pageGroups, header1/headerN, footer con n. pagina).  
Differenze rispetto al carrello:
- Template: `preventivo_provvisorio` se stato ∈ {bozza, richiesto}, altrimenti `preventivo`
- `scontoBlock` sul totale cliente (come ora, con subtotale e sconto personalizzato)
- `noteBlock`
- Header1 usa il testo corretto per stato (provvisorio vs ufficiale)
- `oggetto` textuale passato a header1

### 7. stampa-client.tsx
Aggiungere la stessa logica `handlePrint` con iframe (come `carrello-preventivo/stampa/stampa-client.tsx`), sostituendo `window.print()`.

### 8. loadData
Restituire `string[]` (array di pagine) invece di `string[]` (già array, solo ora paginate).  
La chiamata a `buildPages` avverrà dentro `loadData` con la connessione già aperta (passata come parametro).

## Scelte tecniche

- **Colore barre TC/TA**: per i preventivi salvati, si cerca tra le caratteristiche figlie quella con `foto_url` non vuoto e categoria/descrizione che contiene "color"; altrimenti prima figlia con foto. Stesso criterio del carrello.
- **HEADER1_H** (spazio header pagina 1): rimane 220px come nel carrello, a meno che il template DB non lo gestisca diversamente.
- **Tipo template**: `preventivo_provvisorio` → per bozza/richiesto; `preventivo` → per confermato/approvato. Query: `AND attivo = 1 ORDER BY id DESC`.
