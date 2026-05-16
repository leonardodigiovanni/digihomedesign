# PDF Viewer inline — sottopagine Cataloghi

**Stato:** completato  
**Data:** 2026-04-27

## Obiettivo

Permettere all'utente di sfogliare un PDF direttamente nella pagina `/brand/cataloghi/[id]`, senza dover scaricare il file.

## Approccio scelto: `<iframe>` con click-to-open

- Le card PDF attuali mantengono il loro aspetto
- Al click su una card, anziché scaricare, appare un `<iframe>` in-page che mostra il PDF tramite il visualizzatore nativo del browser
- Sopra l'iframe: nome del catalogo, bottone **Scarica** (download) e bottone **✕ Chiudi**
- Nessuna dipendenza esterna (zero npm install)
- Funziona su Chrome, Edge, Firefox desktop; su Safari mobile non supportato — in quel caso si mostra un link di fallback "Apri in una nuova scheda"

## File coinvolti

- `app/brand/cataloghi/[id]/page.tsx` — diventa server component puro che passa i dati a un client component
- `app/brand/cataloghi/[id]/catalogo-client.tsx` — **nuovo** client component che gestisce la selezione + visualizzazione iframe

## UI

```
[ Card 1 ] [ Card 2 ] [ Card 3 ]   ← griglia card invariata

--- se una card è selezionata ---

┌─────────────────────────────────────────────────────┐
│ Nome catalogo                  [Scarica] [✕ Chiudi] │
│                                                     │
│  <iframe src="/uploads/cataloghi/file.pdf"          │
│          height="700px" width="100%">               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Note tecniche

- `<iframe>` con `src` puntato direttamente al file statico in `/uploads/cataloghi/`
- Altezza fissa 700px su desktop, 500px su mobile (media query CSS inline)
- La card selezionata riceve un bordo blu per indicare la selezione attiva
