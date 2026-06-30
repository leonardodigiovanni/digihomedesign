# Fix: app/cataloghi/[slug] — allineamento completo alla versione brand

**Data:** 2026-06-29  
**Stato:** completato

## File modificati
- `app/app/cataloghi/[slug]/page.tsx` — riscrittura completa
- `app/app/cataloghi/[slug]/[voceSlug]/page.tsx` — LISTINO_COLS + staff query
- `app/brand/cataloghi/[slug]/[voceSlug]/page.tsx` — stessa fix COLS (era identicamente indietro)

## Problema

La pagina `/app/cataloghi/[slug]` (es. infissi-in-alluminio) nella versione app PWA manca di quasi tutte le funzionalità rispetto a `/brand/cataloghi/[slug]`:
- Nessun filtro sottocategoria / fase / materiale / tipologia / ambiente / fascia
- Nessuna linguetta PDF (Battente, Scorrevole, T. Termico, ecc.)
- Nessuna griglia thumbnail / filtri modello nel form AggiungiArticolo
- Staff vede solo i propri preventivi invece di tutti

## Causa

`app/app/cataloghi/[slug]/page.tsx` è rimasto indietro rispetto alla versione brand:
1. `getData`: non esegue ALTER TABLE né SELECT delle colonne filtro su `catalogo_voci`
2. Query listini: usa stringa `COLS` hardcoded che non include le colonne classificazione
3. Preventivi bozza: sempre query non-staff anche per admin/dipendente

## File coinvolti

- `app/app/cataloghi/[slug]/page.tsx` — riscrittura completa

## Modifiche

1. Importare `LISTINO_COLS` da `@/lib/catalogo-matching`
2. Aggiungere in `getData` tutti gli ALTER TABLE per colonne filtro voci
3. Aggiornare SELECT voci con tutte le colonne filtro
4. Aggiornare type cast voci
5. Aggiungere ALTER TABLE listini per colonne classificazione
6. Sostituire la stringa `COLS` hardcoded con `LISTINO_COLS`
7. Allineare logica query preventiviBozza (staff vs non-staff)
8. Allineare logica pool articoli alla versione brand (singola query con possibleCats)
