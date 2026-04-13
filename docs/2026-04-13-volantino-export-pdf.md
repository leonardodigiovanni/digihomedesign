# Volantino — Esportazione PDF

**Data:** 2026-04-13  
**Stato:** completato

## Obiettivo

Aggiungere un pulsante "Esporta PDF A4" nella pagina volantino, affiancato all'esistente "Esporta JPG A4".

## Approccio tecnico

Usare **jsPDF** insieme all'already-installed **html2canvas**:

1. `html2canvas` cattura il `div` del volantino → `canvas` (stessa logica dell'export JPG già funzionante)
2. `jsPDF` crea un documento A4 in modalità portrait
3. Il canvas viene convertito in immagine JPEG e inserito nel PDF a tutta pagina (210 × 297 mm)
4. Il PDF viene scaricato come `volantino_A4.pdf`

## File coinvolti

- `app/volantino/volantino-client.tsx` — aggiunta funzione `handleExportPDF` e relativo pulsante
- `package.json` — aggiunta dipendenza `jspdf`

## Passi principali

1. `npm install jspdf`
2. Aggiungere `handleExportPDF` in `VolantinoClient` (import dinamico di `jspdf`, stessa logica html2canvas del JPG)
3. Aggiungere pulsante `btn-green` "Esporta PDF A4" accanto all'esistente

## Note

- `jsPDF` viene importato dinamicamente (come html2canvas) per non appesantire il bundle
- Risoluzione del canvas: stessa usata per il JPG (300 DPI, scale 300/96)
- Il PDF sarà a singola pagina A4
