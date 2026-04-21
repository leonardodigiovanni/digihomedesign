# Disegno proporzionale infisso nel preventivo

**Data:** 2026-04-21  
**Stato:** completato

## Obiettivo

Migliorare il disegno SVG che appare nella colonna destra di ogni articolo nel PDF/stampa del preventivo, rendendolo:

1. **Proporzionato alle misure reali** — se la finestra è 120×210 cm (portrait), il disegno sarà più alto che largo; se è 200×100 cm (landscape), sarà più largo che alto.
2. **Con le ante visibili** — le divisioni verticali (montanti) rappresentano il numero di ante; ogni pannello mostra una X leggera (tratteggio incrociato) per indicare il vetro.
3. **Con le maniglie** — piccoli rettangolini sul bordo interno di ogni anta.
4. **Con le quote** — le dimensioni (larghezza e altezza in cm) rimangono come testo sui lati.

## File coinvolti

- `app/area-clienti/preventivi/[id]/stampa/page.tsx`
  - Funzione `disegnoSVG` (riga 10–26): redesign completo
  - Funzione `estimaAltezzaArticolo` (riga 70–86): aggiornare `svgAreaH` in base all'altezza reale del SVG proporzionato
  - Nuova helper `computeSVGDims(larghezza, altezza)` condivisa tra le due

## Dettaglio tecnico

### Proporzionamento

```
MAX_W = 172px, MAX_H = 160px (spazio disponibile nella colonna 196px)
se ratio = larghezza/altezza ≥ MAX_W/MAX_H  →  W = MAX_W, H = round(MAX_W / ratio)
altrimenti                                  →  H = MAX_H, W = round(MAX_H * ratio)
Minimo: W ≥ 50, H ≥ 40
```

### Struttura SVG

- **Telaio**: rect con stroke-width = 8px, colore `#1a3a5c`
- **Pannelli vetro**: fill `#ddeeff`, con due diagonali incrociate in `#9bbcda`
- **Montanti** (mullion tra ante): rect `5px` di larghezza, fill `#c8c0b0`
- **Maniglie**: rect `4×14px`, posizionate sul bordo interno di ogni anta
- **Quote**: testo `9px` in corsivo, larghezza cm in basso centrato, altezza cm a sinistra ruotato

### Aggiornamento paginazione

`estimaAltezzaArticolo` usa `svgAreaH = svgH + 16` (derivato da `computeSVGDims`) invece del valore fisso 156.

## Nessun impatto su

- DB / actions / route — nessuna modifica
- Lista articoli nella pagina di editing (`preventivo-client.tsx`) — il disegno esiste solo nella stampa
