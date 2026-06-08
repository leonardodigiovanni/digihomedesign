# Lookup filtro per immagini articoli

**Data:** 2026-05-25  
**Stato:** completato

## Obiettivo

In "Aggiungi articolo al preventivo da elenco" mostrare le foto degli articoli (`foto_url`) come filtro visuale cliccabile — così l'utente sceglie prima il prodotto dall'immagine, poi eventualmente lo affina con i filtri testuali.

## Come funziona ora

- La form riceve `articoli: ArticoloListino[]`
- I filtri sono: produttore (select), serie (select), ricerca testuale, poi dropdown articolo
- `foto_url` non è incluso nella query né nel tipo `ArticoloListino`

## Cosa cambia

### 1. `app/brand/cataloghi/[slug]/page.tsx`
- Aggiungere `foto_url` a `COLS` (la stringa SELECT)

### 2. `components/aggiungi-articolo-form.tsx` + tipo `ArticoloListino`
- Aggiungere `foto_url?: string | null` al tipo
- Sopra i filtri testuali: griglia di thumbnail cliccabili (solo articoli con `foto_url`)
- Click su thumbnail → imposta un nuovo stato `fotoFiltro` (la url selezionata)
- `artFiltrati` si aggiorna tenendo conto di `fotoFiltro`
- Thumbnail selezionata: bordo evidenziato + click = deseleziona (toggle)
- Thumbnail ignorate se nessun articolo visibile ha `foto_url`

### UX dettaglio
- Ogni thumbnail: ~90×70px, `object-fit:contain`, bordo sottile
- Cliccando su una thumbnail che corrisponde a UN solo articolo → seleziona direttamente quell'articolo + avanza a step 'detail'
- Cliccando su una thumbnail con più articoli → filtra il dropdown a quegli articoli
- Se tutti gli articoli filtrati non hanno foto: sezione thumbnail nascosta
- Thumbnail ordinate per numero di articoli associati (più frequente prima)

## File coinvolti

- `components/aggiungi-articolo-form.tsx` (logica filtro + render thumbnail)
- `app/brand/cataloghi/[slug]/page.tsx` (aggiunta `foto_url` ai COLS)

## Note tecniche

- `foto_url` già nella tabella (`VARCHAR(500) NULL`, aggiunta in `ensureTable`)
- Path file: `/listini/{nome-file}` — già serviti come static asset da Next.js
- Nessuna modifica al DB né alle server action
