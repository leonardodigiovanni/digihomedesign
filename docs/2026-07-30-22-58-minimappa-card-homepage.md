# Mini-mappa cliccabile per le card homepage

**Data:** 2026-07-30
**Stato:** completato

## Riepilogo implementazione

`components/hero-cards-scroll.tsx`: aggiunto `containerRef`, `useEffect` che legge `.page-card` figlie dirette dal DOM dopo il mount (rieseguito quando cambiano i `children`) ed estrae `{el, src, label}`; sotto la riga principale, striscia `flexWrap` di bottoni 32×24 con l'immagine, click → `el.scrollIntoView({ inline: 'center' })` sulla card reale. `tsc --noEmit` ed `eslint` puliti.

## Obiettivo

Solo per la riga scrollabile delle card homepage (`HeroCardsScroll`, `.home-hero-cards` — prevista con molte card in futuro), aggiungere sotto la riga principale una striscia di miniature piccole, una per ogni card (comprese quelle non ancora visibili scrollando). Click su una miniatura → la card corrispondente scorre e si centra nella riga principale. Evita di dover scrollare a lungo per raggiungere una card lontana (es. dalla 1 alla 20).

Solo per questa sezione — le altre righe scrollabili (sticky-bottom-bar, vetrina, filtri, sitemap, CTA) restano come sono, non ne hanno bisogno.

## Approccio tecnico

- `HeroCardsScroll` resta un wrapper generico (`children` liberi, come oggi — nessuna modifica a `page.tsx` e alla sua lunga lista di card).
- Dopo il mount, legge dal DOM i figli `.page-card` effettivamente renderizzati dentro il contenitore scrollabile (`querySelectorAll(':scope > .page-card')`), estraendo per ciascuno: elemento reale (per lo scroll-to), `src` dell'`<img>` (letto da `.src`, non `.currentSrc`, perché le immagini fuori schermo sono lazy-load e `currentSrc` sarebbe vuoto finché non caricate) e testo label (`.testo-articoli`).
- Mini-mappa: striscia di bottoni 32×24px con l'immagine della card, sotto la riga principale, `flexWrap` così non serve un secondo scroll orizzontale annidato.
- Click su una miniatura → `cardEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })` sulla card reale corrispondente.
- Nessuna nuova richiesta di immagini "ridotte": la miniatura riusa lo stesso URL già usato dalla card grande (stesso file, solo scalato via CSS a 32×24 — leggero sovraccarico di banda per card, accettabile per l'ordine di grandezza di card previsto).

## File coinvolti

- `components/hero-cards-scroll.tsx` — unico file toccato

## Addendum 2026-07-30 — finestra scorrevole + indicatore viewport (proposto)

Invece di comprimere tutte le miniature su una riga sola (illeggibili con tante card), si mostra solo una **finestra** di N miniature a grandezza fissa (N = quante ne entrano nello spazio disponibile, calcolato a runtime). A sinistra/destra della finestra, se ci sono altre card fuori, un badge "+N" col conteggio di quelle non mostrate. Sopra la finestra scorre un rettangolo bianco che indica quali di queste N miniature corrispondono alle card attualmente visibili nella riga principale. Quando lo scroll principale si avvicina al bordo della finestra corrente, la finestra si ricentra su un nuovo intervallo (es. da "card 1..18" a "card 11..29", coi badge che si aggiornano di conseguenza) — le miniature restano sempre alla stessa dimensione, non si comprimono mai.

### Meccanismo

- `visibleCount`: quante miniature entrano nella riga, ricalcolato via `ResizeObserver` sul contenitore della mini-mappa (larghezza disponibile / larghezza-slot-miniatura).
- `IntersectionObserver` sulla riga principale (root = il contenitore scrollabile), osserva ogni `.page-card` per sapere quali indici sono attualmente visibili (`visibleRange.min`/`.max`).
- `windowStart`: indice della prima miniatura mostrata. Si ricalcola (ricentrando su `visibleRange`) solo quando gli indici visibili si avvicinano troppo al bordo della finestra corrente (piccolo margine per evitare "sfarfallio"), altrimenti resta fermo.
- Rettangolo bianco: posizione/larghezza calcolate dalla porzione di `visibleRange` che ricade dentro la finestra corrente (`(indice - windowStart) * larghezza-slot`).
- Badge "+N" a sinistra (`windowStart` card nascoste prima) e a destra (`totale - windowStart - visibleCount` nascoste dopo), mostrati solo se > 0 — **cliccabili**: click destro → `scrollIntoView({ inline: 'end' })` sull'ultima card della lista (salta in fondo, il badge destro diventa 0); click sinistro → `scrollIntoView({ inline: 'start' })` sulla prima (salta all'inizio). Nessuna logica di "salto finestra" separata: lo scroll reale della riga principale fa scattare l'IntersectionObserver, che ricentra la finestra e sposta il rettangolo di conseguenza, esattamente come per il click su una miniatura singola.

### Riepilogo implementazione

`components/hero-cards-scroll.tsx` riscritto: `visibleCount` (ResizeObserver sulla riga mini-mappa), `visibleRange` (IntersectionObserver sulla riga principale, soglia 0.6, Set di indici mantenuto tra i batch di callback), `windowStart` ricentrato con lo stesso pattern "adjust state during render" di React (non `useEffect`+`setState`, per evitare l'errore lint `set-state-in-effect` e un giro di render extra) quando gli indici visibili si avvicinano al bordo della finestra (buffer di 1). Badge "+N" cliccabili (scrollIntoView `start`/`end` sulla prima/ultima card) mostrati solo se ci sono card nascoste — con poche card (tutte visibili) non compaiono mai e il rettangolo scorre semplicemente sopra tutte le miniature, come richiesto per il caso semplice. `tsc --noEmit` ed `eslint` puliti.

### Addendum 2026-07-30 (2) — rettangolo in scala reale, non a card intere

Il rettangolo ora rispecchia esattamente (in scala) la porzione di riga principale visibile, comprese le percentuali parziali sulle card ai bordi (es. card 3 al 20% + card 4 al 100% + card 5 al 50% → rettangolo che copre esattamente quelle proporzioni, non "da 4 a 5" arrotondato). Sostituito l'`IntersectionObserver` con un calcolo diretto su `scrollLeft`/`clientWidth` della riga principale + `cardStride` (distanza reale tra una card e la successiva, letta da `offsetLeft`, card homepage tutte della stessa larghezza) — mappatura lineare `scala = SLOT/cardStride` dalle coordinate reali a quelle della mini-mappa, niente più snapping a bordo-card. Thumbnail ingrandite (64×40, prima 32×24) e barra centrata orizzontalmente (`justifyContent:'center'`, mini-riga non più `flex:1` ma larga quanto il suo contenuto). `tsc --noEmit` ed `eslint` puliti.
