# isApp prop — classi btn-*-app nei componenti condivisi

**Data:** 2026-06-11  
**Stato:** in corso

## Obiettivo

I componenti condivisi usati sia dal sito normale che da /app devono usare la classe btn-* corretta in base al contesto. Pattern: prop `isApp?: boolean` + helper `b('btn-green', isApp)`.

## Helper

`lib/btn.ts` — `export const b = (cls: string, isApp?: boolean) => isApp ? \`${cls}-app\` : cls`

## Componenti da aggiornare (btn-* presenti)

| Componente | Usato da /app via |
|---|---|
| `area-clienti/cantieri/cantieri-cliente-client.tsx` | `app/app/cantiere/page.tsx` |
| `area-clienti/avvisi/avvisi-client.tsx` | `app/app/avvisi/page.tsx` |
| `area-clienti/carrello-acquisti/carrello-acquisti-client.tsx` | `app/app/carrello-acquisti/page.tsx` |
| `area-clienti/carrello-acquisti/stampa/stampa-client.tsx` | `app/app/carrello-acquisti/stampa/page.tsx` |
| `area-clienti/carrello-preventivo/carrello-client.tsx` | `app/app/carrello-preventivo/page.tsx` |
| `area-clienti/documenti/delete-button.tsx` | `app/app/documenti/page.tsx` |
| `area-clienti/documenti/upload-form.tsx` | `app/app/documenti/page.tsx` |
| `brand/cataloghi/catalogo-grid.tsx` | `app/app/cataloghi/page.tsx` |
| `components/aggiungi-articolo-acquisto-form.tsx` | `app/app/cataloghi/[slug]/page.tsx` |

## Sub-componenti da verificare
- `area-clienti/cantieri/apri-btn.tsx`
- `area-clienti/cantieri/apri-task-btn.tsx`
- `brand/cataloghi/[slug]/aggiungi-articolo.tsx`
- `brand/cataloghi/[slug]/voce-viewer` e inner
