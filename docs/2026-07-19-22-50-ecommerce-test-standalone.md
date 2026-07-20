# Pagina "e-commerce" — prototipo standalone

**Stato**: completato
**Data**: 2026-07-19

## Riepilogo implementazione

File creati esattamente come da piano, nessun file esistente toccato:
- `app/e-commerce/page.tsx` — server component, query `listini` (`disponibile=1 AND acquistabile=1`), pagina non indicizzata (`robots: noindex`) e non collegata da nessun menu.
- `components/ecommerce-shop.tsx` — client component nuovo: griglia card (foto/placeholder, descrizione, produttore, prezzo, badge "Esaurito"), click → step dettaglio con campi adattivi per unità (pz/kg/t/ml/mq) + colore libero se `richiede_tipo_colore=1`, submit su `aggiungiAlCarrelloAcquisti` (invariata, leggeva già il campo colore).

Verificato con `npm run dev`: `GET /e-commerce` → 200, card renderizzate con dati reali già presenti a DB (prezzi €0,10 / €1,00). `tsc --noEmit` ed `eslint` puliti sui due file nuovi.

Raggiungibile solo su `https://localhost:3000/e-commerce` (o dominio prod) digitando l'URL — nessuna voce di menu aggiunta.

## Estensione: pagina prodotto con URL proprio (2026-07-19, stessa sera)

Su richiesta esplicita ("come fa Amazon"), il click su una card non apre più un dettaglio in-page (stato client), ma naviga a una vera pagina con URL dedicato — link cliccabile, condivisibile, indicizzabile, back del browser funzionante.

File aggiunti/modificati:
- `app/e-commerce/[id]/page.tsx` (nuovo) — route dinamica, server component, `notFound()` se il prodotto non è acquistabile/disponibile.
- `components/ecommerce-add-to-cart-form.tsx` (nuovo) — estratta la parte interattiva (quantità/misure/colore/submit) dal vecchio step "dettaglio", ora usata dalla pagina dedicata.
- `components/ecommerce-shop.tsx` — semplificato: solo griglia con `<Link href="/e-commerce/[id]">`, rimossa la logica di stato "select/detail" e la dipendenza da `aggiungiAlCarrelloAcquisti` (spostata nel nuovo form component).

Verificato con dev server pulito: `/e-commerce` → 200 (griglia con link), `/e-commerce/47` → 200 (titolo, prezzo, form), `/e-commerce/999999` → 404. `tsc`/`eslint` puliti.

Nota infrastrutturale (non di codice): durante il test un `npm run dev` avviato in una sessione precedente non era stato terminato correttamente (TaskStop non uccide sempre il processo Windows sottostante), e un secondo `npm run dev` lanciato in parallelo ha causato crash temporanei dei worker. Risolto uccidendo il processo orfano per PID e riavviando un singolo server pulito.

## Estensione: pagina categoria (2026-07-20)

Su richiesta ("fammi vedere anche una pagina categoria tipo Amazon"), aggiunta una seconda dimensione di navigazione: reparto/categoria con URL proprio, come le sezioni di Amazon.

File aggiunti/modificati:
- `lib/ecommerce.ts` (nuovo) — `toEcommerceSlug()`, stessa logica di slug già usata in `app/brand/cataloghi/[slug]/page.tsx`.
- `app/e-commerce/categoria/[categoria]/page.tsx` (nuovo) — route dinamica, filtra gli articoli acquistabili per `listini.categoria` (slug-matched), `notFound()` se nessun prodotto nella categoria, riusa `EcommerceShop` per la griglia.
- `app/e-commerce/page.tsx` — aggiunta riga di chip cliccabili "per categoria" sopra la griglia (calcolate dalle categorie distinte presenti tra i prodotti acquistabili).

Verificato: `/e-commerce` mostra il chip "Quadri" → `/e-commerce/categoria/quadri` (200, titolo + griglia filtrata), categoria inesistente → 404. `tsc`/`eslint` puliti. Al momento esiste una sola categoria di test (Quadri, 3 articoli) — il pattern regge comunque per quando se ne aggiungeranno altre.

## Bug corretto: chip categoria invisibili (2026-07-20)

I chip usavano `className="testo-articoli"` (che disegna il testo con `background-clip:text` + `text-fill-color:transparent`, effetto "spazzolato" del sito) insieme a uno sfondo bianco inline — risultato: testo bianco su sfondo bianco, invisibile. Rimossa la classe dal chip, colore esplicito `#222` con `WebkitTextFillColor` impostato di conseguenza.

## Estensione: ricerca + filtri sidebar stile Amazon (2026-07-20)

Richiesta esplicita di avvicinarsi all'esperienza Amazon: barra di ricerca, filtri a sinistra per marca/categoria, fascia di prezzo. Non è stato possibile replicare i filtri per "caratteristiche" (es. colore) perché il DB non ha attributi strutturati per prodotto — solo flag sì/no (`richiede_tipo_colore`), non un elenco di valori. Filtri realizzati con dati reali: categoria, marca (`produttore`), prezzo.

File aggiunti/modificati:
- `components/ecommerce-catalog.tsx` (nuovo, client) — barra ricerca (descrizione+produttore), sidebar con checkbox categoria (nascosta su `/e-commerce/categoria/[x]` dove la categoria è già fissata dall'URL) e marca (nascosta se c'è una sola marca), due slider nativi min/max per il prezzo (range calcolato dai dati), pulsante "Cancella filtri", contatore risultati. Filtraggio client-side istantaneo, riusa `EcommerceShop` per la griglia.
- `app/e-commerce/page.tsx` — sostituita la sola griglia con `<EcommerceCatalog articoli={articoli} />` (filtro categoria attivo).
- `app/e-commerce/categoria/[categoria]/page.tsx` — usa `<EcommerceCatalog ... showCategoryFilter={false} />`.

Verificato con dati reali (5 articoli test, 2 categorie Quadri/Divani, marca unica Monet, prezzi €0,10–€1,00): filtri categoria e prezzo renderizzati correttamente, marca correttamente nascosta (una sola marca), contatore "5 prodotti" corretto. `tsc`/`eslint` puliti.

## Restyle "come Amazon" (2026-07-20)

L'utente ha condiviso uno screenshot (Amazon.it affiancato al nostro `/e-commerce`) e chiesto di avvicinare il comportamento a quello osservato. Modifiche:

1. **Card prodotto**: solo l'immagine è cliccabile (link al dettaglio); descrizione/produttore/prezzo sono testo non cliccabile; bottone "Aggiungi al carrello" separato che apre una modale con lo stesso form di quantità/misure/colore già usato nella pagina di dettaglio (niente navigazione).
2. **Immagini formato Amazon**: box quadrato 1:1, `objectFit:'contain'` su sfondo chiaro (si vede il prodotto intero, non ritagliato) invece del vecchio `height:140 objectFit:cover`. Stessa cosa applicata all'immagine della pagina di dettaglio.
3. **Prezzo stile Amazon**: nuovo componente `PrezzoAmazon` — simbolo € piccolo, parte intera grande e in grassetto, centesimi piccoli in apice, usato sia in griglia che nel dettaglio.
4. **Font**: titolo prodotto troncato a 2 righe (`WebkitLineClamp`), niente stelline/recensioni (non esiste un sistema recensioni sul sito, per scelta esplicita).
5. **Filtri come overlay**: la sidebar fissa è stata sostituita da un bottone "☰ Filtri" che apre un pannello verticale sovrapposto (overlay con sfondo scurito, chiudibile cliccando fuori o sulla ✕), invece di occupare permanentemente spazio orizzontale — replica il pattern del toggle-filtri di Amazon.
6. **Griglia a colonne larghezza fissa**: da `grid-template-columns: repeat(auto-fill, minmax(180px,1fr))` (fluido, le card si allargano) a `repeat(auto-fill, 220px)` con `overflow-x:auto` sul contenitore — le card restano larghezza fissa, lo spazio residuo a destra di una riga incompleta resta vuoto invece di stirare le card, e in caso di finestra molto stretta compare scroll orizzontale invece di restringere le card sotto la soglia minima. Replica il comportamento osservato nello screenshot Amazon (scrollbar orizzontale "a metà").

File toccati: `lib/ecommerce.ts` (centralizzati tipo `ArticoloEcommerce`, `getUnitaMode`, `formatPrezzo` — eliminata la duplicazione tra i componenti), `components/ecommerce-shop.tsx` (riscritto: card Amazon-style, modale quick-add, `PrezzoAmazon`), `components/ecommerce-catalog.tsx` (overlay filtri al posto della sidebar), `components/ecommerce-add-to-cart-form.tsx` (import dal lib condiviso), `app/e-commerce/[id]/page.tsx` (immagine quadrata + `PrezzoAmazon`).

Verificato con dev server: griglia e dettaglio 200, 5 bottoni "Aggiungi al carrello" (uno per card), prezzo Amazon-style renderizzato (es. parte intera "1" in font-size 24 grassetto), toggle "☰ Filtri" presente. `tsc`/`eslint` puliti.

Non replicato (assente nei dati): filtri per caratteristiche prodotto (colore, materiale) — il DB non ha attributi strutturati per prodotto, solo flag sì/no.

## Due correzioni (2026-07-20, stessa sera)

1. **Virgola mancante nel prezzo**: `PrezzoAmazon` mostrava "€100" invece di "€1,00" (intero e centesimi accostati senza separatore). Aggiunto uno span "," tra le due parti.
2. **Posizione toggle Filtri**: spostato a sinistra dei chip categoria, sulla stessa riga. I chip categoria (che prima erano hardcoded in `app/e-commerce/page.tsx`) sono stati spostati dentro `components/ecommerce-catalog.tsx` (che già calcolava l'elenco categorie per il filtro) così da poterli affiancare al bottone Filtri nello stesso componente.

Verificato via HTML renderizzato: bottone "☰ Filtri" precede i chip "Divani"/"Quadri" nel markup, prezzo mostra "1" + "," + "00" come span separati. `tsc`/`eslint` puliti.

## Slider prezzo a doppia maniglia (2026-07-20, stessa sera)

Sostituiti i due slider separati (Minimo/Massimo) con un'unica barra a doppia maniglia, come richiesto. Tecnica: due `input[type="range"]` nativi sovrapposti sulla stessa traccia (mai un div custom con drag manuale/`setPointerCapture` — vedi [[feedback_slider_touch]], rompe il touch sugli elementi vicini), con CSS in `app/globals.css` (classe `.ecommerce-range-track`) che rende trasparenti track nativi e mostra solo i thumb, più due `<div>` assoluti sotto per il segmento colorato selezionato. z-index dei due thumb calcolato dinamicamente in `ecommerce-catalog.tsx` (`zMin`) così quello più vicino al centro resta sopra e resta draggabile quando le due maniglie si sovrappongono.

Etichette: sopra la barra "Da € X a € Y" (valori scelti), sotto la barra "€ min" / "€ max" (fondo scala) ai due estremi.

Non verificabile via curl (il pannello filtri è dietro il toggle, stato client non presente nell'HTML iniziale) — verificato solo per `tsc`/`eslint` puliti e correttezza strutturale; da provare manualmente in browser.

## Gerarchia hub → sezione → prodotto (2026-07-20, stessa sera)

Su richiesta, `/e-commerce` non è più il catalogo diretto ma un **hub** con dei riquadri (per ora uno solo, "Arredi") pensati per rappresentare in futuro categorie merceologiche, offerte, black friday, combo, ecc. — il vero criterio di categorizzazione non è ancora deciso ("poi la correggiamo").

Nuova struttura URL:
- `/e-commerce` — hub, card verso le macro-sezioni (`lib/ecommerce.ts` → `ECOMMERCE_MACRO_SEZIONI`, per ora `[{slug:'arredi', nome:'Arredi'}]`)
- `/e-commerce/arredi` — quello che prima era il catalogo su `/e-commerce`: ricerca, filtri (categoria/marca/prezzo), griglia. Per ora mostra *tutti* i prodotti acquistabili (unica macro-sezione esistente); le sottocategorie (Divani, Quadri) restano filtri nel pannello, non route proprie
- `/e-commerce/arredi/[id]` — dettaglio prodotto (era `/e-commerce/[id]`)

Rimosso: `/e-commerce/[id]` (flat) e `/e-commerce/categoria/[categoria]` — sostituiti dalla gerarchia sopra. Il chip-collegamento diretto alle sottocategorie è stato tolto dalla riga filtri (puntava alla route eliminata); restano selezionabili come checkbox nel pannello "Filtri".

File: `lib/ecommerce.ts` (+`ECOMMERCE_MACRO_SEZIONI`, `getMacroSezione`), `app/e-commerce/page.tsx` (riscritto, hub), `app/e-commerce/[macro]/page.tsx` (nuovo, ex root), `app/e-commerce/[macro]/[id]/page.tsx` (nuovo, ex `[id]`), `components/ecommerce-shop.tsx`/`ecommerce-catalog.tsx` (prop `macro` per costruire i link corretti).

Verificato: hub mostra il tile "Arredi" → `/e-commerce/arredi` (200, 5 prodotti, link a `/e-commerce/arredi/[id]`) → dettaglio (200). Sezione inesistente (`/e-commerce/999`, `/e-commerce/id`) → 404 corretto. `tsc`/`eslint` puliti.

## Hub con stesso look del catalogo (2026-07-20, stessa sera)

L'hub aveva un layout diverso (tile testuali larghi) dalla pagina catalogo (card con foto+titolo). Uniformato: nuovo `components/ecommerce-hub.tsx` con la stessa impostazione visiva di `ecommerce-shop.tsx` — barra di ricerca in cima (filtra per nome/descrizione sezione), griglia di card quadrate (per ora senza foto reale, placeholder col nome) larghezza fissa 220px, contatore risultati. Le card qui sono interamente cliccabili (niente bottone "aggiungi", non serve per una categoria) e portano a `/e-commerce/{slug}`. `app/e-commerce/page.tsx` ora renderizza `<EcommerceHub sezioni={ECOMMERCE_MACRO_SEZIONI} />` invece dei tile precedenti.

Verificato: `/e-commerce` mostra ricerca + card "Arredi" (link a `/e-commerce/arredi`). `tsc`/`eslint` puliti.

## Bottone Filtri anche sull'hub (2026-07-20, stessa sera)

Avevo omesso il pannello "☰ Filtri" sull'hub (nessun facet tipo marca/prezzo per una categoria) ma l'utente lo vuole comunque presente, per coerenza visiva con `/e-commerce/arredi`. Aggiunto in `components/ecommerce-hub.tsx`: stesso bottone/overlay del catalogo prodotti, con dentro un ordinamento reale (Nome A→Z / Z→A) invece di facet inventati — l'unico criterio che ha senso finché esiste una sola macro-sezione.

Verificato: bottone "☰ Filtri" presente nell'HTML di `/e-commerce`. `tsc`/`eslint` puliti.

## Bug: slider che non scorreva (2026-07-20, stessa sera)

Causa reale: `prezzoMinAssoluto`/`prezzoMaxAssoluto` arrotondavano ai soli euro interi (`Math.floor`/`Math.ceil` senza decimali). Con i prezzi di test (€0,10–€1,00) il range diventava "0–1" e senza `step` esplicito l'`input[type=range]` usa il default `step=1` — quindi la barra aveva solo 2 posizioni possibili (0 e 1), di fatto un interruttore, non uno slider: sembrava non rispondere al trascinamento.

Fix in `components/ecommerce-catalog.tsx`: arrotondamento a 2 decimali (centesimi) invece che a euro interi, `step={0.01}` esplicito su entrambi gli input range, testo "Da €/a €" e fondo scala formattati con `.toFixed(2)`. Non era un bug del CSS/tecnica a doppio thumb (quella resta la stessa, corretta), ma di granularità dei dati.

---

## Obiettivo

Prototipo isolato di vetrina "tipo Amazon" per i prodotti acquistabili (`listini.acquistabile=1`), da testare senza toccare nulla dell'esistente. Niente viene modificato nelle 50 pagine categoria attuali né nel form a tendina condiviso (`aggiungi-articolo-acquisto-form.tsx`): restano intatti, così com'è il flusso preventivi/cataloghi. Quando il prototipo piacerà, si deciderà come integrarlo/estenderlo (o si scarterà senza aver rotto niente).

## Dove va

Nuova route pubblica **`/e-commerce`**, non collegata da nessun menu (le tendine di navbar sono tutte categorie merceologiche specifiche — Serramenti, Arredi, ecc. — e non c'è una voce adatta per un test generico). Si raggiunge solo digitando l'URL. Nessuna modifica a `lib/nav-config.ts` o `components/navbar.tsx` in questa fase.

## Cosa mostra

Query semplice: tutti gli articoli con `disponibile=1 AND acquistabile=1` in `listini` (tutte le categorie insieme, per avere subito qualcosa da testare — es. i Quadri se già flaggati acquistabili). Griglia di card: foto (`foto_url`, placeholder se assente), descrizione, produttore, prezzo. Click su una card apre inline la scelta di quantità/misure (stessa logica adattiva per unità pz/kg/t/ml/mq già collaudata) + colore (testo libero, mostrato se `richiede_tipo_colore=1`).

## Cosa riusa (nessuna modifica)

- Server action `aggiungiAlCarrelloAcquisti` (`app/brand/cataloghi/actions.ts:281`) — già legge/salva il campo `colore`, non serve toccarla.
- Cart cookie (`lib/cart-cookie.ts`), pagina carrello, pagina pagamento, Stripe checkout — tutta la catena post-"aggiungi al carrello" è quella già esistente e funzionante.

## File nuovi

| File | Ruolo |
|------|-------|
| `app/e-commerce/page.tsx` | Server component: query listini acquistabili, render griglia |
| `components/ecommerce-shop.tsx` | Client component nuovo (non riusa/non modifica `aggiungi-articolo-acquisto-form.tsx`): card grid + step "dettaglio" con quantità/misure/colore, submit su `aggiungiAlCarrelloAcquisti` |

## Fuori scope

Spese di spedizione, indirizzo di consegna, pagina prodotto con URL propria, voce di menu definitiva: rimandato a dopo, quando il prototipo sarà approvato.
