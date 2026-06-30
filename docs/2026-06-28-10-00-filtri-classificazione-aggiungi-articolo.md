# Filtri classificazione nel form aggiungi articolo (preventivo)

**Data:** 2026-06-28  
**Stato:** completato

## Obiettivo

Aggiungere nel modale "Aggiungi articolo" del preventivo i nuovi campi di classificazione come selettori a cascata, che guidano l'utente alla selezione finale del modello.

## Ordine UI previsto

categoria → sottocategoria → fase → materiale → tipologia → ambiente → [linguette/schemi] → fascia → marca → modello

## File coinvolti

- `app/clienti/preventivi/[id]/page.tsx` — ALTER TABLE + SELECT + mapping per 6 nuovi campi
- `app/clienti/preventivi/[id]/preventivo-client.tsx` — tipo ListinoItem, state, useMemo cascata, JSX
