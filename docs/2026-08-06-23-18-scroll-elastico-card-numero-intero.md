# Scroll orizzontale card home — larghezza elastica a numero intero + snap dopo l'azione

Stato: **completato**

## Riepilogo implementazione

- `lib/use-elastic-card-scroll.ts` (nuovo): hook riusabile come da piano. `computeWidth()` prova `N = round((containerWidth+gap)/(targetWidth+gap))`, poi `N-1`/`N+1` se fuori tolleranza ±15%, poi fallback "singola card = larghezza schermo" se nemmeno N=1 rientra. Scrive `--card-w` sul container via `el.style.setProperty`, ricalcola con `ResizeObserver`. Snap: un solo listener `scroll` (passive) che ridà `setTimeout(200ms)` ad ogni evento — quindi resta "silenzioso" anche durante lo scroll-momentum del touch, non solo dopo il rilascio del dito — poi arrotonda `scrollLeft` al multiplo più vicino di `cardWidth+gap` e ci scrolla con `behavior:'smooth'`, clampato a `[0, maxScroll]`.
- `components/hero-cards-scroll.tsx`: agganciato `elasticRef` al `mergeRefs` del container esistente, `targetWidth:576, gap:16` (stesso gap già impostato inline sul flex). Nessun'altra modifica: la mini-mappa sotto legge `offsetLeft` reale delle card, si adatta da sola alla nuova larghezza dinamica.
- `app/globals.css`: `.home-hero-cards .page-card` da `576px !important` fisso a `var(--card-w, 576px) !important` (fallback 576 prima che l'effect scriva la variabile). Rimossa `scroll-snap-align: start` — avrebbe creato un secondo meccanismo di snap in conflitto con quello JS a 200ms.
- Type-check e lint puliti.
- Non toccato `hero-cta-scroll.tsx`: l'hook è pronto per essere agganciato lì quando richiesto.

## Bug trovato dopo il primo giro: `mergeRefs` inline rimontava il timer di snap

Lo snap non scattava mai: `mergeRefs(...)` era chiamato inline dentro il JSX, quindi produceva una funzione nuova ad ogni render. React tratta un cambio di identità della prop `ref` come un ref "cambiato": chiama cleanup (con `null`) sul vecchio e riattacco sul nuovo, ad ogni render — e il componente ri-renderizza ad ogni evento di scroll nativo (per lo state della mini-mappa sotto). Per gli altri due hook (mask/frecce, auto-scroll bordo) è innocuo, ricalcolano solo qualcosa di economico ad ogni riattacco; per `useElasticCardScroll`, che tiene un `setTimeout` di 200ms come stato persistente nella closure del ref, ogni rimontaggio lo cancellava (`cleanupRef.current()` chiama `clearTimeout`) prima che potesse mai scadere indisturbato.

Fix in `components/hero-cards-scroll.tsx`: `combinedRef = useMemo(() => mergeRefs(...), [...])` — l'identità della funzione ref resta stabile tra i render, i ref combinati vengono attaccati una volta sola. Type-check e lint puliti.

## Obiettivo

Cambiare il comportamento dello scroll orizzontale delle card in home (`components/hero-cards-scroll.tsx`), che oggi hanno larghezza fissa (576px `!important`). Due cose nuove:

1. **Larghezza elastica a numero intero**: la larghezza della card si adatta (dentro un margine di elasticità attorno ai 576px attuali) in modo che lo schermo ne contenga sempre un numero **intero** (1, 2, 3, 4...), mai una card parziale ai bordi. Se lo schermo è più piccolo della card minima consentita, una sola card riempie esattamente lo schermo.
2. **Snap dopo l'azione, non durante**: lo scroll libero (dito, barra, hover sulle frecce) resta libero e senza vincoli come oggi. Solo quando l'azione finisce e passano ~200ms senza nuovi eventi di scroll (per non litigare con un dito che sta ancora scorrendo), la pagina guarda quale card è più "significativa" (quella con più area visibile) e ci si allinea con una transizione animata, spingendo fuori dallo spazio utile la card minoritaria. A fine corsa e nei punti già allineati non serve nessuna transizione (il calcolo a numero intero garantisce che le posizioni di riposo coincidano già con i bordi delle card).

**Nota per dopo**: l'utente ha chiesto che, una volta pronto l'algoritmo, venga riusato anche per le CTA (`components/hero-cta-scroll.tsx`). Per questo la logica va scritta come hook riusabile, non incollata dentro `hero-cards-scroll.tsx`.

## File coinvolti

### Nuovo: `lib/use-elastic-card-scroll.ts`
Hook riusabile (pensato per essere applicato sia alle card sia, in un secondo momento, alle CTA) che fa due cose sullo stesso container ref:

- **Calcolo larghezza**: dato `targetWidth` (576 per le card), un margine di elasticità (es. ±15%) e il gap tra le card, calcola `N = round(containerWidth / (targetWidth + gap))` (minimo 1), poi risolve `cardWidth` dall'equazione `N·cardWidth + (N-1)·gap = containerWidth`. Se il risultato esce dal margine di elasticità intorno a `targetWidth`, si prova `N-1` o `N+1` finché non rientra; se anche con `N=1` la card risultante supera lo schermo (schermo più piccolo della card minima), si forza `cardWidth = containerWidth` (una sola card, riempie lo schermo). Il valore calcolato viene scritto come CSS custom property sul container (es. `--card-w`), letta dalla regola CSS della card invece del valore fisso. Ricalcolato con `ResizeObserver` sul container (cambio finestra/rotazione schermo).
- **Snap dopo l'azione**: ascolta gli eventi `scroll` nativi del container, tiene un timer che si resetta ad ogni evento; dopo ~200ms di silenzio, se non c'è un drag/tap attivo né l'auto-scroll-su-hover in corso, calcola lo scroll "arrotondato" al multiplo più vicino di `cardWidth + gap` (equivalente a "quale card ha più area visibile vince") e ci scrolla con `behavior: 'smooth'`.

L'hook ritorna il ref da agganciare al container scrollabile (stesso pattern di `useEdgeAutoScroll`/`useScrollEdgeMask`, componibile con `mergeRefs`).

### `components/hero-cards-scroll.tsx`
- Aggancia il nuovo hook al container insieme a quelli già presenti (`useEdgeAutoScroll`, `useScrollEdgeMask`).
- La mini-mappa sotto (miniature + riquadro che segue la porzione visibile) non cambia struttura: continua a leggere `scroll.left`/`clientWidth` come oggi, funziona automaticamente con la nuova larghezza dinamica.

### `app/globals.css`
`.home-hero-cards .page-card`: da `width/flex-basis/max-width: 576px !important` a `var(--card-w, 576px)` (fallback 576px se la variabile non è ancora stata scritta, es. primissimo render prima dell'effect). Rimossa `scroll-snap-align: start` — lo snap ora è gestito via JS (con il ritardo di ~200ms e la logica "card più significativa"), tenere anche lo snap nativo CSS creerebbe due meccanismi che si accavallano/litigano.

## Cosa NON cambia
- Sbiadimento ai bordi + doppie frecce (`useScrollEdgeMask`) — nessuna modifica.
- Auto-scroll avvicinando il mouse al bordo (`useEdgeAutoScroll`, già disattivato su touch) — nessuna modifica, resta compatibile con lo snap (lo snap parte solo a scroll fermo).
- Altezza delle card (356px), contenuto interno, mini-mappa.
- `hero-cta-scroll.tsx` — non toccato in questo giro, ma pensato per riuso immediato quando richiesto.

## Da confermare prima di scrivere codice
Attendo conferma esplicita su questo documento (in particolare il margine di elasticità ±15% e il ritardo di 200ms, che sono scelte mie ragionevoli ma arbitrarie — dimmi se preferisci valori diversi) prima di procedere con l'implementazione.
