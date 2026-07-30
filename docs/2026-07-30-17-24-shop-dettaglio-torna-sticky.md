# Shop dettaglio — bottone "Torna a" nello sticky bottom bar

**Data:** 2026-07-30
**Stato:** completato

## Riepilogo implementazione

`app/shop/[categoria]/[sottocategoria]/[id]/page.tsx`: il Link "← Torna a {sottocategoria}" è stato spostato dal fondo pagina dentro `<StickyBottomBarContent>`, stesso stile invariato. `tsc --noEmit` pulito.

## Obiettivo

Nella pagina `/shop/[categoria]/[sottocategoria]/[id]` (es. `/shop/quadri/riproduzioni/47`) il bottone "← Torna a {sottocategoria}" è oggi in fondo al contenuto della pagina, in mezzo al flusso (`app/shop/[categoria]/[sottocategoria]/[id]/page.tsx` righe 71-75). Va spostato nello sticky bottom bar già esistente nel sito (`components/sticky-bottom-bar-content.tsx`), come già fatto per `/brand/storia` ("← Torna a Brand").

## File coinvolti

### `app/shop/[categoria]/[sottocategoria]/[id]/page.tsx`
- Rimuovere il blocco `<p style={{ marginTop: 16 }}>...</p>` con il `Link` "Torna a".
- Aggiungere `import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'`.
- Inserire lo stesso `Link` (stesso stile `btn-black`, stesso testo) dentro `<StickyBottomBarContent>`, così appare fisso in fondo allo schermo invece che in coda alla pagina.

## Nessun impatto su

- Breadcrumb in cima alla pagina (`Shop On Line / categoria / sottocategoria / descrizione`) — resta dov'è
- `ProdottoDettaglio`, altre pagine shop (`/shop`, `/shop/[categoria]`, `/shop/[categoria]/[sottocategoria]`)
- Altre pagine che già usano lo sticky bar (`/brand/storia`)

## Da confermare prima di scrivere codice

Attendo conferma esplicita su questo documento prima di procedere con l'implementazione.
