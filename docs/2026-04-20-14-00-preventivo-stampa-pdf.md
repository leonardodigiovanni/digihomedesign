# Preventivo — Stampa PDF con template carta intestata

**Data:** 2026-04-20  
**Stato:** completato

## Obiettivo
Generare un PDF del preventivo usando un template HTML a carta intestata salvato nel DB, con placeholder per dati cliente/preventivo/articoli.

## Template DB
Nuova tabella `preventivo_templates` (LONGTEXT html). Seed automatico del primo template al primo avvio.

## Placeholder
`{{data}}`, `{{numero}}`, `{{cliente_nome}}`, `{{cliente_indirizzo}}`, `{{articoli}}` (loop), `{{totale}}`, `{{note_block}}`

## Per articolo
- Info: tipo, marca, modello, colore, vetro, accessori, dimensioni, n_ante, quantità, prezzo
- SVG disegno: rettangolo diviso in n_ante pannelli con quote (larghezza × altezza)

## Route
`/area-clienti/preventivi/[id]/stampa` — accessibile a tutti i ruoli autenticati

## PDF export
html2canvas + jsPDF (già installati) — stessa tecnica del volantino
