# Filtri catalogo e articolo — linguette con scroll orizzontale

**Data:** 2026-06-23  
**Stato:** in corso

## Obiettivo

Trasformare i filtri catalogo in righe orizzontali con scroll, e aggiungere una seconda riga "Filtri articolo".

## Struttura target

```
[ Filtri catalogo ] [✕]  |  [A battente] [Scorrevole] [Taglio termico] …  ← scroll
──────────────────────────
  [CatalogoClient — card cataloghi filtrati]
──────────────────────────
[ Filtri articolo ]      |  [1 Anta] [2 Ante] [3+ Ante] [Sopraluce]       ← scroll (non funzionali per ora)
──────────────────────────
  [AggiungiArticolo — lista articoli]
```

## File coinvolti

- `app/brand/cataloghi/[slug]/catalogo-wrapper.tsx` — unico file da modificare

## Dettagli tecnici

- `FiltroToggle` (toggle switch) → sostituito con chip `Linguetta` (pill button)
- Contenitore riga: `display:flex`, label fisso a sx (`flexShrink:0`), separatore verticale 1px, area chip `overflow-x:auto`
- X button: visibile solo se `nAttivi > 0`, chiama `clearAll`, stile `btn-red` piccolo
- "Filtri articolo": stato separato `filtriArticoloAttivi`, toggle visivo ma non filtra (logica non implementata)
- Chip attiva: background `#c8960c`, testo bianco; inattiva: bordo `#888`, testo `#666`

## Stato

- [ ] Implementazione
- [ ] Verifica visiva
