# Nuova pagina: Tessuti / Tappeti

**Stato**: completato

## Obiettivo

Aggiungere la pagina "Tappeti" come terza voce della sezione Tessuti (dopo Divani e Tendaggi), seguendo esattamente lo stesso pattern delle altre pagine vetrina di categoria (fototesto + catalogo + form acquisto).

Le due immagini sono già presenti in `public/images/tessuti/tappeti/`:
- `beige.webp` — tappeto beige elegante in salotto classico
- `persiano.webp` — tappeto persiano/orientale

## File coinvolti

1. **`lib/nav-config.ts`** — aggiungere `{ id: 273, label: 'Tappeti', href: '/tessuti/tappeti' }` in coda all'array `pages` del gruppo `tessuti` (dopo Tendaggi, id 268). L'id 273 è il primo libero dopo Servizi (269–272).
2. **`app/tessuti/tappeti/page.tsx`** (nuovo file) — copia strutturale di `app/tessuti/tendaggi/page.tsx`:
   - `CERCA = 'Tappeti'`, breadcrumb "Tessuti / Tappeti"
   - `getCategoryGroupNeighbors('tessuti', 273, disabledPages)`
   - Titolo H1 "Tappeti a Palermo"
   - Metadata SEO (title/description/canonical `/tessuti/tappeti`/OG) sul modello delle altre pagine
   - 2 card foto: `beige.webp` ("Beige") e `persiano.webp` ("Persiano")
   - Testo descrittivo breve: "Vendiamo e installiamo tappeti su misura."
   - Sticky bottom bar: ← Tessuti, ← Tendaggi (prev, automatico), CTA Preventivo, CTA Cantiere, → Servizi (fallback dropdown, automatico)
   - Riga IsDebug finale identica alle altre pagine

## Effetto collaterale automatico

Aggiungendo Tappeti alla lista `pages` di `tessuti`, la pagina Tendaggi (che calcola `next` dinamicamente tramite `getCategoryGroupNeighbors`) mostrerà automaticamente "Tappeti →" nella sticky bar al posto del fallback "Servizi →". Nessuna modifica manuale necessaria a `tendaggi/page.tsx`.

## Scelte tecniche

- Nessuna nuova componente: riuso di `CatalogoWrapper`, `AggiungiArticoloAcquistoForm`, `StickyBottomBarContent`, `CtaPreventivo`, `CtaCantiere`, `NavDropdownTriggerButton`.
- Il catalogo DB (`catalogo_voci`/`listini` con categoria "tappeti") probabilmente non ha ancora voci: la pagina gestisce già il caso vuoto (le sezioni catalogo/acquisto non vengono renderizzate se non ci sono dati).

## Riepilogo implementazione

Eseguito come da piano, nessuna scelta cambiata:
- `lib/nav-config.ts`: aggiunta `{ id: 273, label: 'Tappeti', href: '/tessuti/tappeti' }` in coda al gruppo `tessuti`.
- `app/tessuti/tappeti/page.tsx` (nuovo): copia strutturale di `tendaggi/page.tsx` con `CERCA='Tappeti'`, id 273, foto `beige.webp`/"Beige" e `persiano.webp`/"Persiano", testo "Vendiamo e installiamo tappeti su misura.".
- Fallback sticky bar: `← Arredi` (prev, cat-arredi) se non c'è pagina precedente in tessuti; `Servizi →` (next, cat-servizi) essendo ora l'ultima pagina della sezione — pattern ripreso identico da `divani/page.tsx` e dal vecchio `tendaggi/page.tsx`.
- `tendaggi/page.tsx` non è stato toccato: il suo pulsante "successivo" ora punta automaticamente a Tappeti grazie al calcolo dinamico di `getCategoryGroupNeighbors`.
- Type-check (`tsc --noEmit`) pulito sui nuovi file; unico errore residuo preesistente e non correlato (cache `.next` della vecchia rotta `pagine/[id]`).
