# Brand Cataloghi — Pagine Pubbliche

**Data:** 2026-04-16  
**Stato:** completato

## Obiettivo

Rendere i cataloghi caricati dallo staff visibili al pubblico su `/brand/cataloghi`, organizzati per categoria.

## Struttura URL

- `/brand/cataloghi` — griglia di categorie (tile cliccabili)
- `/brand/cataloghi/[id]` — griglia dei cataloghi PDF di quella categoria

## Fonte dati

Tabelle MySQL già esistenti (gestite da area-lavoro/cataloghi):
- `catalogo_categorie` (id, nome, ordine)
- `catalogo_voci` (id, categoria_id, nome, pdf_filename, pdf_label)
- PDF fisici in `public/uploads/cataloghi/`

## File da creare/modificare

1. `app/brand/cataloghi/page.tsx` — aggiornato: legge categorie da DB, mostra tile
2. `app/brand/cataloghi/[id]/page.tsx` — nuovo: legge voci per categoria, mostra PDF scaricabili

## Note tecniche

- Pagine server component (no 'use client')
- Nessun login richiesto (area pubblica)
- Il link PDF usa `/uploads/cataloghi/[pdf_filename]` con `download`
- Se la categoria non esiste → notFound()
