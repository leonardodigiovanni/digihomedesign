# Ingrandimento card home + immagini reali

**Data**: 2026-03-31  
**Stato**: completato

## Obiettivo

Ingrandire i riquadri della home page e sostituire i placeholder colorati con le immagini reali presenti in `/public/images/`.

## Stato attuale

- Grid: `minmax(200px, 1fr)` → card piccole (~200px larghezza minima)
- Altezza immagine: `120px` con sfondo colorato e numero pagina
- 14 card totali (pagine 2–15)

## Modifiche proposte

### `app/page.tsx`

1. **Layout grid**: passare a `minmax(300px, 1fr)` per card più larghe.
2. **Altezza immagine**: da `120px` → `220px`, con `object-fit: cover`.
3. **Immagini reali**: usare le 8 foto `casa-ristrutturata-{1-8}.jpg` ciclandole sulle 14 card (indice `i % 8 + 1`). Componente `<img>` con `style={{ objectFit: 'cover' }}` (oppure `next/image` con `fill`).
4. **Label**: font leggermente più grande (15px → 16px), padding aumentato.

### `app/globals.css`

- Nessuna modifica necessaria: `.page-card` è già corretto, basta agire sullo stile inline in `page.tsx`.

## File coinvolti

| File | Tipo di modifica |
|------|-----------------|
| `app/page.tsx` | Grid più larga, immagini reali, altezza aumentata |

## Scelte tecniche

- `<img>` standard con `width: '100%'` e `height: 220px` + `objectFit: 'cover'` — semplice e senza configurazione extra Next.js.
- Le immagini cicleranno: card 1→img1, card 2→img2, …, card 9→img1, ecc.
- Non tocco `nav-config.ts` né `globals.css`.

## Riepilogo implementazione

- **File modificato**: `app/page.tsx` (unico file toccato, come pianificato)
- **Rimosso**: import `cardColors` da `nav-config.ts` (non più necessario)
- **Nessuno scostamento** rispetto al piano approvato
