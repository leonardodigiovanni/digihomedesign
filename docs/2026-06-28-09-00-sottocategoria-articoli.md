# Nuovi campi classificazione articoli

**Data:** 2026-06-28  
**Stato:** completato

## Obiettivo

Aggiungere 6 nuovi campi di classificazione alla tabella `listini`. Tutti opzionali (NULL di default). La migration viene eseguita automaticamente da `ensureTable()` al primo accesso.

## Nuovi campi DB

| Campo | Tipo | Default |
|---|---|---|
| sottocategoria | VARCHAR(100) | NULL |
| fase | VARCHAR(100) | NULL |
| materiale | VARCHAR(100) | NULL |
| tipologia | VARCHAR(100) | NULL |
| ambiente | VARCHAR(100) | NULL |
| fascia | VARCHAR(100) | NULL |

## Ordine colonne UI

| # | Campo | Chiave COL_KEYS | Note |
|---|---|---|---|
| 1 | Categoria | `cat` | esistente |
| 2 | Sottocategoria | `sottocat` | nuovo |
| 3 | Fase | `fase` | nuovo |
| 4 | Materiale | `mat` | nuovo |
| 5 | Tipologia | `tipo` | nuovo |
| 6 | Ambiente | `amb` | nuovo |
| 7 | Descrizione | `descr` | esistente |
| 8 | Fascia | `fascia` | nuovo |
| 9 | Marca (= Produttore) | `prod` | esistente |
| 10 | Serie | `serie` | esistente |
| 11 | Fornitore | `forn` | esistente |
| … | resto invariato | | |

## File coinvolti

| File | Modifica |
|---|---|
| `app/area-lavoro/listini/actions.ts` | `ensureTable()`: 6 ALTER TABLE; `addArticolo` e `updateArticolo`: parsing + INSERT/UPDATE |
| `app/area-lavoro/listini/listini-client.tsx` | Tipo `Articolo`, `COL_KEYS`, `COL_LABELS`, `COL_DEFAULT`, thead, riga dati, riga edit inline |
| `app/area-lavoro/listini/page.tsx` | SELECT: aggiungere i 6 nuovi campi |

## Passi implementativi

1. **`ensureTable()`** — aggiungere 6 righe `.catch(()=>{})` per i nuovi campi.
2. **`addArticolo`** — parsing dei 6 campi da FormData + inclusione nell'INSERT.
3. **`updateArticolo`** — idem per UPDATE.
4. **`page.tsx`** — aggiungere i 6 campi al SELECT.
5. **Tipo `Articolo`** — aggiungere `sottocategoria/fase/materiale/tipologia/ambiente/fascia: string | null`.
6. **`COL_KEYS`** — inserire `'sottocat','fase','mat','tipo','amb','fascia'` nelle posizioni corrette.
7. **`COL_LABELS` / `COL_DEFAULT`** — etichette e visibilità default (tutti visibili di default).
8. **`thead`** — 6 nuovi `<th>` nell'ordine stabilito.
9. **Riga dati** — 6 nuovi `<td>` con badge stile simile a categoria (sfondo tenue).
10. **Riga edit inline** — 6 nuovi `<td>` con `<input>`.
11. **Form nuovo articolo** — 6 campi opzionali aggiunti dopo categoria.
