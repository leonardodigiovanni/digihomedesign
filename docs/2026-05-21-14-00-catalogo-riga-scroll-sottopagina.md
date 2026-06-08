# Catalogo: riga scrollabile + sotto-pagina per voce

**Data:** 2026-05-21  
**Stato:** completato

## Obiettivo

Cambiare la pagina `/brand/cataloghi/[slug]` (es. `infissi-in-alluminio`) in modo che:
1. I cataloghi siano in **una riga orizzontale scrollabile** (touch su mobile, frecce ‹ › su desktop).
2. Cliccando un catalogo si naviga a `/brand/cataloghi/infissi-in-alluminio/sistema-3g` (nuova sotto-pagina).
3. Sulla **sotto-pagina** ci sono:
   - AggiungiArticolo per il listino di quella voce (sopra)
   - Visualizzatore/sfogliatore PDF (sotto)
   - Bottone "← Torna indietro" (in fondo)
4. Se non si seleziona nessun catalogo (sulla pagina categoria), la sezione "Articoli da preventivare" continua a mostrare l'union di tutti i listini.

## Slug della voce

Generato lato JS con la stessa `toSlug()` già usata per le categorie:
- `"Sistema 3G"` → `sistema-3g`
- URL: `/brand/cataloghi/infissi-in-alluminio/sistema-3g`

## File coinvolti

| File | Tipo di modifica |
|------|-----------------|
| `app/brand/cataloghi/[slug]/catalogo-client.tsx` | Riga scroll orizzontale con frecce; clic → navigazione se `categorySlug` passato |
| `app/brand/cataloghi/[slug]/catalogo-wrapper.tsx` | Aggiunge prop `categorySlug` passato a `CatalogoClient` |
| `app/brand/cataloghi/[slug]/page.tsx` | Passa `slug` come `categorySlug` al wrapper |
| `app/brand/cataloghi/[slug]/[voceSlug]/page.tsx` | **Nuovo** — server component: carica voce+articoli, renderizza la sotto-pagina |
| `app/brand/cataloghi/[slug]/[voceSlug]/voce-viewer.tsx` | **Nuovo** — wrapper `'use client'` con `dynamic(() => import('./voce-viewer-inner'), { ssr: false })` |
| `app/brand/cataloghi/[slug]/[voceSlug]/voce-viewer-inner.tsx` | **Nuovo** — PDF viewer (copia di PdfViewer senza bottone ✕, solo Scarica) |

## Comportamento riga scroll

- Layout: `display: flex; overflow-x: auto; scroll-snap-type: x mandatory`
- Frecce ‹ › sempre visibili (funzionano sia da desktop che mobile)
- Ogni card: `flex: 0 0 160px; scroll-snap-align: start`
- Clic → `<Link href={/brand/cataloghi/${categorySlug}/${toSlug(v.nome)}>` (con `categorySlug`)
- Fallback senza `categorySlug` (pagina serramenti): comportamento inline attuale invariato

## Sotto-pagina (`[voceSlug]/page.tsx`)

- Breadcrumb: Brand / Cataloghi / Infissi in Alluminio / Sistema 3G
- `h1`: nome voce
- AggiungiArticolo (se la voce ha `listino_categoria` e ci sono articoli)
- VoceViewer (PDF — no SSR, react-pdf)
- Link "← Torna ai cataloghi di [categoria]"

## Note

- `categorySlug` è opzionale in `CatalogoWrapper` e `CatalogoClient` — la pagina serramenti non lo passa e mantiene il comportamento inline attuale
- `robots: { index: false }` sulla sotto-pagina (non necessario indicizzarla)
- La pagina categoria mostra sempre la union degli articoli (nessun voce selezionata = union)
