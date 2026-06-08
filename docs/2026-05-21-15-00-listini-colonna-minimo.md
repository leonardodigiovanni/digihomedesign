# Listini — colonna "minimo"

**Data:** 2026-05-21  
**Stato:** completato

## Obiettivo

Aggiungere una colonna `minimo` (DECIMAL) alla tabella `listini` che rappresenta il valore minimo dell'unità di misura da considerare nel calcolo del prezzo.

**Esempio:** infisso con unità `m²` e minimo `2`. Se le dimensioni reali danno 1,8 m², il prezzo viene calcolato su 2 m².

## File coinvolti

1. **`app/area-lavoro/listini/actions.ts`** — `ensureTable`: aggiunge `ALTER TABLE listini ADD COLUMN minimo DECIMAL(10,4) NULL DEFAULT NULL`
2. **`app/area-lavoro/listini/listini-client.tsx`** — aggiunge la colonna "Minimo" nella tabella admin (visualizzazione + campo di edit), posizionata subito dopo "Unità"
3. **`app/clienti/preventivi/actions.ts`** — `aggiungiArticolo`: applica il minimo al calcolo `prezzoLordo` (per unità m², ml, pz) quando `parent_id` è null
4. **`app/area-clienti/carrello-preventivo/carrello-client.tsx`** — `calcolaPrezzo`: applica il minimo nella funzione di calcolo lato client del carrello
5. **`app/area-clienti/carrello-preventivo/page.tsx`** — aggiunge `minimo` alla SELECT e al mapping degli articoli
6. **`app/clienti/preventivi/[id]/page.tsx`** — aggiunge `minimo` alla SELECT dei listini (già caricati)
7. **`app/clienti/preventivi/[id]/preventivo-client.tsx`** — aggiunge `minimo` al tipo `ListinoItem` (usato nel ricalcolo visualizzato)

## Logica

```
valoreEffettivo = max(valoreCalcolato, minimo ?? 0)
```

Applicato solo agli **articoli primari** (non caratteristiche figlio, che ereditano le dimensioni dal padre).  
Per gli articoli figlio (vetro, montaggio) il minimo non si applica: il padre ha già applicato il suo minimo, e il figlio usa le dimensioni/quantità del padre già corrette.

## Passi

1. `ensureTable` → `ALTER TABLE` idempotente
2. Admin listini: aggiunge colonna con input numerico nullable (blank = nessun minimo)
3. Action `aggiungiArticolo`: prima di calcolare `prezzoLordo`, calcola `valoreMq = h*l*q` e confronta con `minimo`
4. Carrello client: identica logica in `calcolaPrezzo` (usa `a.minimo` già caricato dalla pagina)

## Modifiche effettive

- `app/area-lavoro/listini/actions.ts`: ALTER TABLE + `minimo` in INSERT/UPDATE
- `app/area-lavoro/listini/listini-client.tsx`: tipo `Articolo` + colonna th/td/input
- `app/area-lavoro/listini/page.tsx`: ALTER TABLE + SELECT + mapping
- `app/clienti/preventivi/actions.ts`: carica `minimo` da listino in `aggiungiArticolo` e `modificaArticolo`; applica `Math.max(h*l, minimo)` per m² e `Math.max(l, minimo)` per ml, solo articoli primari (parent_id null)
- `app/area-clienti/carrello-preventivo/page.tsx`: SELECT + mapping `minimo`
- `app/area-clienti/carrello-preventivo/carrello-client.tsx`: tipo `ArticoloCarrello` + logica `calcolaPrezzo`
- `app/clienti/preventivi/[id]/page.tsx`: ALTER TABLE + SELECT + mapping `minimo` nei listini
- `app/clienti/preventivi/[id]/preventivo-client.tsx`: tipo `ListinoItem` + campo `minimo`
- Nota: vetro (figlio) usa dimensioni reali del padre senza applicare il minimo (condizione `a.parent == null`)
