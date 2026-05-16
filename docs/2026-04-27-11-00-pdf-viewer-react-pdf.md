# PDF Viewer con react-pdf — Cataloghi

**Stato:** completato  
**Data:** 2026-04-27

## Obiettivo

Sostituire l'`<iframe>` nel viewer dei cataloghi con `react-pdf`, che renderizza ogni pagina come canvas — funziona su tutti i browser incluso Safari mobile.

## Passi

1. `npm install react-pdf` — aggiunge `react-pdf` e `pdfjs-dist` come dipendenza
2. Worker PDF.js: configurare `pdfjs.GlobalWorkerOptions.workerSrc` puntando al CDN `unpkg.com` (evita di copiare il file nella cartella public)
3. Riscrivere `catalogo-client.tsx`:
   - `<Document>` carica il PDF, `<Page>` renderizza ogni pagina
   - Navigazione pagine: bottoni ‹ Prev / Next › con contatore "Pagina X di Y"
   - Zoom: bottoni + / – (width del canvas scalato)
   - Bottone Scarica (download) e ✕ Chiudi invariati
   - Spinner durante il caricamento del documento

## File coinvolti

- `app/brand/cataloghi/[id]/catalogo-client.tsx` — riscrittura completa
- `package.json` — aggiunta dipendenza react-pdf

## Note

- `react-pdf` richiede `'use client'` — già presente nel componente
- Il worker viene caricato dal CDN per non appesantire il bundle
- `<Page width={...}>` si adatta alla larghezza del contenitore tramite `useRef` + `ResizeObserver`
