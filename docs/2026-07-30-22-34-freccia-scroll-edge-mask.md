# Freccia direzionale nella fascia sbiadita di scroll orizzontale

**Data:** 2026-07-30
**Stato:** completato

## Riepilogo implementazione

- `lib/scroll-edge-arrows.ts` (nuovo): `attachScrollArrows(el)` crea due triangoli CSS (freccia sx/dx), li aggancia al genitore di `el` (`position: relative` impostato solo se il genitore era `static`), `pointer-events: none`. Espone `setVisible(showLeft, showRight)` e `cleanup()`.
- `lib/use-scroll-edge-mask.ts` e `lib/use-scroll-edge-mask-selector.ts`: chiamano `attachScrollArrows` all'attach, `arrows.setVisible(fadeLeft, fadeRight)` a ogni ricalcolo del mask (stessi trigger: scroll/resize/ResizeObserver), `arrows.cleanup()` nella cleanup esistente.
- Nessuna modifica ai componenti consumatori — freccia attiva automaticamente ovunque questi due hook siano già in uso.
- `tsc --noEmit` ed `eslint` puliti.

Da verificare a vista: posizionamento (assume che l'elemento scrollabile occupi tutta la larghezza del genitore) e leggibilità del colore su sfondi diversi (card oro, foto vetrina, ecc.).

## Obiettivo

I contenitori con scroll orizzontale "solo hover" (auto-scroll avvicinando il mouse al bordo) hanno già una fascia sbiadita (`useScrollEdgeMask`/`useScrollEdgeMaskForSelector`, `lib/use-scroll-edge-mask*.ts`) che si accende solo sul lato dove c'è altro contenuto da scrollare. Manca un'indicazione visiva chiara: una **freccia**, centrata verticalmente, dentro quella stessa fascia, rivolta nella direzione in cui si può scrollare.

Va aggiunta **nell'hook condiviso**, non nei singoli componenti che lo usano — così tutti i punti del sito che già usano questi due hook la ottengono automaticamente:

- `components/hero-cards-scroll.tsx` (card homepage)
- `components/hero-cta-scroll.tsx` (CTA homepage)
- `components/sticky-bottom-bar.tsx` (barra fissa in fondo)
- `components/vetrina-auto-scroll.tsx` → `.vetrina-foto-row`, `.filtri-scroll-row`, `.sitemap-scroll` (via selettore, potenzialmente più istanze per pagina)

## Approccio tecnico

- Le frecce sono elementi DOM creati/aggiornati **imperativamente** (stesso stile già usato per il `mask-image`), non componenti React — gli hook non sono componenti e vengono chiamati anche in contesti "selector" senza JSX proprio.
- Vengono agganciate al **genitore** dell'elemento scrollabile (non dentro di esso), con `position: absolute; top: 50%; transform: translateY(-50%)`, `left: 0` o `right: 0`, `pointer-events: none` (non devono intercettare click/drag sul contenuto sotto). Il genitore riceve `position: relative` se non ce l'ha già (senza toccarlo se ha già un posizionamento esplicito).
- Si evita di appenderle dentro l'elemento scrollabile stesso per non alterarne `scrollWidth`/i figli flex (che romperebbe il calcolo `fadeLeft`/`fadeRight` già esistente) e per non farle scorrere via insieme al contenuto.
- Forma: triangolo via CSS border (stessa tecnica già usata per il play-button dei video in `app/page.tsx`), nessuna dipendenza SVG/icona esterna.
- Visibilità aggiornata negli stessi punti in cui oggi si ricalcola il mask (`scroll`, `ResizeObserver`, `resize`), stessa logica `fadeLeft`/`fadeRight` già calcolata.
- Rimozione degli elementi nella cleanup esistente di ciascun hook.

## File coinvolti

- `lib/use-scroll-edge-mask.ts` — versione a singolo ref
- `lib/use-scroll-edge-mask-selector.ts` — versione a selettore (più istanze)

Nessuna modifica ai componenti che li usano.

## Assunzione da segnalare

Le frecce vengono posizionate a `left:0`/`right:0` rispetto al **genitore diretto** dell'elemento scrollabile, assumendo che quest'ultimo occupi tutta la larghezza del genitore (vero per tutti gli usi attuali). Se in futuro un contenitore scrollabile avesse un genitore più largo con padding/altri figli accanto, la freccia potrebbe non essere perfettamente allineata al bordo — da verificare a vista una volta implementato.

## Da confermare prima di scrivere codice

Attendo conferma esplicita su questo documento prima di procedere con l'implementazione.
