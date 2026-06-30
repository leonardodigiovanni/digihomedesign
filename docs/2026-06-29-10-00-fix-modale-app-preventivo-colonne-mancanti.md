# Fix: Modale "Aggiungi articolo" mancante di elementi in versione app

**Data:** 2026-06-29  
**Stato:** completato

## Problema

In `/app/preventivo/[id]` (versione app PWA), la modale "Aggiungi articolo" non mostra:
- I filtri di classificazione: Sottocategoria, Fase, Materiale, Tipologia, Ambiente, Fascia
- Le linguette modello (1 Anta, 2 Ante, 3+ Ante, Sopraluce)
- La griglia thumbnail dei disegni infisso

## Causa

Il file `app/app/preventivo/[id]/page.tsx` esegue una query SQL sui listini che **non include** le colonne:
- `sottocategoria`, `fase`, `materiale`, `tipologia`, `ambiente`, `fascia`
- `Filtro_1`, `Filtro_2`, `Filtro_3`, `Filtro_4`
- `schema_url`

Al confronto, la versione staff `app/clienti/preventivi/[id]/page.tsx` le include tutte.

## File coinvolti

- `app/app/preventivo/[id]/page.tsx` — unico file da modificare

## Modifiche

1. Aggiungere alla query SQL le colonne mancanti (stessa lista della versione staff)
2. Aggiungere i campi al tipo `RawListino` locale
3. Aggiornare il mapping `allListini` per includere i nuovi campi
4. Aggiornare il mapping del path non-staff per includere i nuovi campi
5. Aggiungere le `ALTER TABLE` per le colonne nuove (già presenti nella versione staff)

## Impatto

Solo `app/app/preventivo/[id]/page.tsx`. Nessun impatto su altri file.
