# Click nella zona sbiadita = avanza di una card, non il link

Stato: **completato**

## Riepilogo implementazione

- `lib/use-elastic-card-scroll.ts`: nuova opzione `edgeClickZone`. Listener `click` in fase di cattura (`{ capture: true }`, così intercetta prima che il click arrivi al `<Link>` figlio) sul container: se il click è a meno di `edgeClickZone` px dal bordo sinistro/destro **e** c'è margine di scroll in quella direzione, `preventDefault()` + `stopPropagation()` e `scrollTo` di un `cardStride` (lo stesso valore usato dallo snap) con transizione smooth; altrimenti il click prosegue normale verso il `<Link>`.
- `components/hero-cards-scroll.tsx`: passato `edgeClickZone: 40`, stesso valore del `useScrollEdgeMask(40)` già presente nello stesso componente.
- Type-check e lint puliti.

Nota non richiesta: sugli utenti mouse, l'auto-scroll a deriva per hover (`useEdgeAutoScroll`, attivo solo con hover reale) e questo click-per-pagina convivono nella stessa fascia di bordo — un click mentre si sta già "derivando" per hover produrrà entrambi gli effetti insieme. Non è un conflitto di codice, solo una sovrapposizione di comportamento non esplicitamente coperta dalla richiesta; non l'ho toccata.

## Bug trovato dopo: resize finestra non riallineava lo scroll

Segnalato dall'utente: allargando la finestra del browser di poco, spuntava uno spicchio di card adiacente e la pagina non si riposizionava — violava la regola "sempre un numero intero di card".

Causa: `computeWidth()` (richiamato dal `ResizeObserver` ad ogni resize) ricalcolava correttamente la nuova larghezza card, ma non chiamava mai `scheduleSnap()` — quello scattava solo dall'evento nativo `scroll`, che un resize non genera. Risultato: le card cambiavano dimensione ma `scrollLeft` restava quello di prima, non più multiplo esatto del nuovo `cardStride`.

Fix in `lib/use-elastic-card-scroll.ts`: `computeWidth()` ora chiama `scheduleSnap()` alla fine (riallineamento con transizione smooth, stesso meccanismo dello snap dopo lo scroll). Spostata la dichiarazione di `scheduleSnap`/`settleTimer` prima di `computeWidth` nel codice, altrimenti la primissima chiamata sincrona a `computeWidth()` (al mount) avrebbe acceduto a `settleTimer` prima della sua inizializzazione (temporal dead zone di `let`). Type-check e lint puliti.

## Obiettivo

Nelle card home (e poi CTA), un click/tap **dentro la fascia sbiadita ai bordi** (la stessa zona del fade + frecce, oggi 40px) non deve attivare il link della card, ma far scorrere il contenitore esattamente di una card nella direzione di quel bordo (stessa distanza dello snap: `cardWidth + gap`, transizione smooth). Se il bordo in quella direzione non ha altro da mostrare (es. sei già all'inizio e clicchi a sinistra), il click semplicemente non fa nulla — niente scroll, niente link.

Un click **fuori** dalla fascia sbiadita (nel corpo della card) si comporta come oggi: se la card è un `<Link>`, naviga.

Esempio guida: cellulare stretto, un'unica card visibile (per l'algoritmo a numero intero già fatto). Toccare vicino al bordo destro (nella striscia sbiadita) scorre di precisione alla card successiva invece di aprire il link di quella attuale.

## File coinvolti

### `lib/use-elastic-card-scroll.ts`
Nuova opzione `edgeClickZone` (px, default disattivato se non passato). Aggiunge un listener `click` **in fase di cattura** (capture: true) sul container:
- calcola la posizione X del click relativa al container;
- se è a meno di `edgeClickZone` px dal bordo sinistro **e** c'è dello scroll disponibile a sinistra (`scrollLeft > 0`): `preventDefault()` + `stopPropagation()` sul click (blocca la navigazione del `<Link>` sottostante) e scrolla a sinistra di un `cardStride` (smooth);
- stessa cosa speculare a destra;
- altrimenti non fa nulla, il click prosegue normale (arriva al `<Link>`).

Il valore passato a `edgeClickZone` deve combaciare con il `fadePx` passato a `useScrollEdgeMask` nello stesso componente (oggi 40), così la zona "cliccabile per avanzare" coincide esattamente con quella visivamente sbiadita — nessuna sorpresa per chi clicca guardando il fade.

### `components/hero-cards-scroll.tsx`
Passa `edgeClickZone: 40` (stesso valore del `useScrollEdgeMask(40)` già presente) alla chiamata di `useElasticCardScroll`.

## Cosa NON cambia
- Click nel corpo della card: comportamento identico ad oggi (naviga se è un `<Link>`).
- Tastiera/screen reader: l'intercettazione si basa sulla posizione X del click del puntatore, non tocca la navigazione da tastiera (Tab+Invio su un `<Link>` non passa da qui) — nessun impatto sull'accessibilità.
- `hero-cta-scroll.tsx`: non toccato in questo giro (nessuno snap/elastic-scroll agganciato lì ancora).

## Da confermare
Il valore 40px (uguale al fade) mi sembra la scelta più coerente e priva di sorprese — dimmi se vuoi una zona di click diversa dalla zona di fade.
