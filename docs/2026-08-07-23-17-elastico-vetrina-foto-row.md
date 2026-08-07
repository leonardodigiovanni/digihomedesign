# Larghezza elastica + snap anche per le card fuori dalla home (`.vetrina-foto-row`)

Stato: **completato**

## Riepilogo implementazione

- `lib/use-elastic-card-scroll.ts`: estratta la logica di attach/calcolo/snap/click in una funzione standalone esportata `attachElasticCardScroll(el, options): () => void` (prima viveva solo dentro il `useCallback` del ref). `useElasticCardScroll` ora è un wrapper sottile che la chiama — nessun cambio di comportamento per `hero-cards-scroll.tsx`, che continua a usarlo com'era.
- `lib/use-elastic-card-scroll-selector.ts` (nuovo): `useElasticCardScrollForSelector(selector, options)`, stesso pattern `MutationObserver` + `Map<HTMLElement, cleanup>` di `use-scroll-edge-mask-selector.ts`/`use-edge-auto-scroll-selector.ts` già esistenti, riusa `attachElasticCardScroll` per ogni elemento trovato — zero duplicazione della logica di calcolo/snap.
- `components/vetrina-auto-scroll.tsx`: aggiunta `useElasticCardScrollForSelector('.vetrina-foto-row', { targetWidth: 300, gap: 8, edgeClickZone: 40 })` accanto alle chiamate già presenti.
- `app/globals.css`: `.vetrina-foto-row .page-card` da `300px !important` fisso a `var(--card-w, 300px) !important`.
- Type-check e lint puliti. Un solo cambio, effetto su tutte le ~105 pagine che usano `.vetrina-foto-row`.

## Bug trovato dopo (screenshot utente): freccia rimane accesa a torto dopo resize

Segnalato con screenshot prima/dopo: con 2 card entrambe visibili per intero, allargando la finestra a volte restava accesa la freccia destra anche se non c'era più nulla da scrollare.

Prima ipotesi (sbagliata, "cavolate" per citare l'utente): arrotondamento sub-pixel di `cardWidth` — ho comunque lasciato il fix (`Math.floor`), è corretto in sé ma non era la causa di questo bug specifico.

Causa reale, trovata dallo screenshot: `useScrollEdgeMaskForSelector` osserva lo **stesso elemento** `.vetrina-foto-row` con un proprio `ResizeObserver` **indipendente** da quello di `useElasticCardScrollForSelector`, per decidere se accendere frecce/sbiaditura leggendo `el.scrollWidth`. Due `ResizeObserver` distinti sullo stesso elemento non hanno un ordine di esecuzione garantito tra loro nella stessa tornata di resize: se quello del mask scatta **prima** del nostro, legge lo `scrollWidth` calcolato sulla `--card-w` VECCHIA (prima del nostro aggiornamento) e decide di mostrare la freccia sulla base di una larghezza non più vera. Quel hook si aggiorna solo al proprio `ResizeObserver` o a un evento `scroll` reale — se il resize si ferma lì, la freccia resta sbagliata (accesa anche se le card ora ci stanno tutte).

Fix in `lib/use-elastic-card-scroll.ts` (`attachElasticCardScroll`): dopo aver scritto la nuova `--card-w`, un `requestAnimationFrame` (aspetta che il browser abbia applicato il nuovo layout) spara uno `scroll` sintetico su `el` — evento che `useScrollEdgeMask(ForSelector)` già ascolta nativamente — forzandolo a ricalcolare con lo `scrollWidth` finalmente corretto, senza dover toccare quell'hook né dipendere dall'ordine (non garantito) tra i due `ResizeObserver`. Type-check e lint puliti.

## Obiettivo

Estendere alle card foto in cima alle pagine categoria/prodotto (`.vetrina-foto-row`, es. `/serramenti/box-doccia`) lo stesso comportamento già fatto per le card home: larghezza elastica a numero intero (schermo piccolo → 1 card = larghezza schermo) + snap dopo l'azione verso la card più significativa + click nella fascia sbiadita ai bordi = avanza di una card.

`.vetrina-foto-row` è usata in **105 file** (quasi tutte le pagine categoria), montata globalmente una volta sola via `components/vetrina-auto-scroll.tsx` (nel layout root) con un selettore CSS, non wrappando ogni pagina singolarmente — a differenza delle card home (`hero-cards-scroll.tsx`, un componente dedicato con un ref singolo).

## File coinvolti

### Nuovo: `lib/use-elastic-card-scroll-selector.ts`
Variante "per selettore" di `lib/use-elastic-card-scroll.ts` (stesso principio di `use-scroll-edge-mask-selector.ts`/`use-edge-auto-scroll-selector.ts` già esistenti): un `MutationObserver` sul `document.body` trova tutti gli elementi che matchano il selettore (oggi in pratica una sola `.vetrina-foto-row` per pagina, ma robusto anche per più istanze), applicando ad ognuno indipendentemente la stessa logica già scritta per la home (calcolo larghezza elastica → CSS custom property sul container, snap dopo 200ms di silenzio sullo scroll, click nella fascia bordo = avanza di una card). Nessuna duplicazione di logica: la funzione di calcolo/snap interna viene condivisa (estratta se serve) tra la versione a singolo ref e quella a selettore, sul modello degli altri hook già "gemellati" in questo modo.

### `components/vetrina-auto-scroll.tsx`
Aggiunge la chiamata:
```ts
useElasticCardScrollForSelector('.vetrina-foto-row', { targetWidth: 300, gap: 8, edgeClickZone: 40 })
```
accanto alle chiamate già presenti (`useEdgeAutoScrollForSelector`, `useScrollEdgeMaskForSelector('.vetrina-foto-row', 40)`) — stesso `edgeClickZone` del fade esistente (40px), `targetWidth`/`gap` presi dalla regola CSS attuale.

### `app/globals.css`
`.vetrina-foto-row .page-card`: da `width/flex/max-width: 300px !important` a `var(--card-w, 300px) !important` (fallback 300px prima che l'effect scriva la variabile) — stesso trattamento già fatto per `.home-hero-cards .page-card`.

## Cosa NON cambia
- `.filtri-scroll-row` e `.sitemap-scroll` (altri due selettori gestiti da `vetrina-auto-scroll.tsx`): non sono file di "card" (sono chip filtro / link indice), restano com'erano — solo fade+arrows, nessuna larghezza elastica.
- Le card home (`hero-cards-scroll.tsx`) — già a posto, non toccate.
- Altezza delle foto/card, contenuto interno.

## Da confermare
Procedo con questa impostazione (stesso identico comportamento della home, riapplicato a `.vetrina-foto-row` con targetWidth 300/gap 8)?
