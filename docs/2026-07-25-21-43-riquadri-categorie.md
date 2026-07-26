# Riquadri immagine per categorie/sottocategorie (shop, promozioni, cataloghi)

Stato: completato (fase 1 + fase 2)

## Obiettivo

Sostituire gli attuali elenchi/bottoni cliccabili delle categorie e sottocategorie con dei riquadri (card) nello stesso stile delle card articolo (`ProductCard` in `components/ecommerce-shop.tsx`): immagine sopra + nome categoria sotto, ma **senza** prezzo e **senza** bottone "Aggiungi al carrello". L'immagine serve solo come anteprima esplicativa di cosa si trova scendendo di livello.

Pagine coinvolte:
- `/shop` (categorie di primo livello) e `/shop/[categoria]` (sottocategorie)
- `/promozioni` (categorie di primo livello) e `/promozioni/[categoria]` (sottocategorie)
- `/chi-siamo/cataloghi` (categorie cataloghi — oggi bottoni `.btn-gold` in `catalogo-grid.tsx`)

## Nodo da sciogliere: da dove viene l'immagine?

Categorie e sottocategorie sono valori testuali liberi (raggruppati per nome da `shop_percorsi`/`promo_percorsi`/`catalogo_voci_percorsi`), non hanno un'immagine propria assegnata da un admin. Non voglio inventare un nuovo sistema di gestione immagini-categoria (upload manuale, tabella dedicata, UI admin) se non richiesto esplicitamente.

Propongo di usare, come immagine "esplicativa" della categoria/sottocategoria, quella del **primo elemento contenuto** (per id crescente, stessa convenzione già usata per il canonical SEO in `primoPercorso`):

- **Shop/Promozioni**: `foto_url` dell'articolo con `listino_id` più basso tra quelli che hanno quella coppia categoria/sottocategoria.
- **Cataloghi**: prima pagina del PDF della prima voce (per id) di quella categoria — riusando il componente `PdfThumbnail` già presente in `catalogo-client.tsx` (va esportato/condiviso, oggi non è esportato dal modulo).

Se una categoria non ha ancora nessun articolo/voce con foto, il riquadro mostra un placeholder "Nessuna foto" (stesso comportamento già presente in `ProductCard`).

Questa scelta è automatica e dinamica (si aggiorna da sola se cambia il primo elemento), coerente con come già funziona il resto (nessun hardcoding, nessuna tabella nuova).

## Modifiche previste

1. **`lib/categorie-percorsi.ts`**: `getCategorieTopLevel` e `getSottocategorie` fanno una query aggiuntiva (JOIN con `listini` sul `MIN(listino_id)` per gruppo) per restituire anche `immagine: string | null` in `VoceCategoria`.
2. **Nuovo componente condiviso** `components/category-tile.tsx`: card 220px (stessa larghezza di `ProductCard`), immagine in alto (aspect 1:1, object-fit contain, placeholder se assente), nome sotto, tutto dentro un `<Link>` verso il livello successivo. Nessun prezzo, nessun bottone.
3. **`app/shop/page.tsx`, `app/shop/[categoria]/page.tsx`, `app/promozioni/page.tsx`, `app/promozioni/[categoria]/page.tsx`**: sostituiscono l'attuale griglia di riquadri testuali (bordo gold, sfondo `#fafafa`) con la nuova `CategoryTile`, in una griglia identica a quella degli articoli (`repeat(auto-fill, 220px)`).
4. **`app/brand/cataloghi/page.tsx`**: `getCategorie()` recupera anche il `pdf_filename` della prima voce per categoria; **`catalogo-grid.tsx`**: sostituisce i bottoni `.btn-gold` con la stessa `CategoryTile`, usando `PdfThumbnail` (esportato) come immagine al posto della `<img>` semplice.

## Cosa NON cambia

- Il conteggio articoli/voci per categoria (`numArticoli`) resta visibile sotto il nome, come oggi.
- Le pagine di dettaglio prodotto/voce non cambiano.
- Nessuna nuova tabella DB, nessuna nuova UI admin per gestire immagini di categoria.

## Fase 1 — fatta

Deciso dall'utente: niente immagine auto-derivata dal primo articolo per ora. Creato il componente condiviso `components/category-tile.tsx` (riquadro 220px, stessa larghezza delle card articolo: immagine 1:1 sopra, nome sotto, nessun prezzo/bottone) con immagine fissa placeholder `/images/manutenzione/sito_manutenzione.png` (la stessa già usata come "Fotografia da scegliere" in `/arredi/soprammobili`). Applicato a:
- `/shop` e `/shop/[categoria]`
- `/promozioni` e `/promozioni/[categoria]`
- `/chi-siamo/cataloghi` (`catalogo-grid.tsx`, al posto dei bottoni `.btn-gold`)

Il componente accetta già una prop `immagine` opzionale (usa il placeholder se assente) — pronta per la fase 2.

## Fase 2 — sezione admin "Immagini categorie e promo" (corretta, da confermare)

### Correzione rispetto alla prima stesura

Ogni coppia categoria/sottocategoria porta **due** immagini, non una:
- `immagine_categoria` — usata sul riquadro di primo livello (es. la tile "Inverno" nella griglia di `/shop`, per scegliere la categoria)
- `immagine_sottocategoria` — usata sul riquadro di secondo livello (es. la tile "Divani" nella griglia di `/shop/inverno`, per scegliere la sottocategoria)

Esempio concreto: `/shop/inverno/divani` → la tile "Inverno" su `/shop` mostra `immagine_categoria` della coppia, la tile "Divani" su `/shop/inverno` mostra `immagine_sottocategoria` della stessa coppia.

Se la stessa categoria compare in più coppie (es. inverno/divani e inverno/poltrone), la tile di primo livello "Inverno" usa la `immagine_categoria` della prima coppia (per id) che ce l'ha valorizzata — stessa convenzione "primo per id" già usata per il canonical SEO.

Anche i cataloghi diventano a coppie (categoria, sottocategoria — la sottocategoria esiste già come colonna in `catalogo_voci_percorsi`, oggi è solo un dato dei singoli PDF e non un livello di navigazione a sé). Decisione confermata: la seconda immagine dei cataloghi viene comunque salvata (stessa forma a coppie, coerente con shop/promo) ma **nessuna nuova pagina pubblica** la usa per ora — resta pronta per quando si deciderà di aggiungere un secondo livello di navigazione ai cataloghi.

### Tabelle nuove (idempotenti, stessa convenzione di `ensureShopPercorsiTables`/`ensurePromoTables`)

Stessa forma per tutte e tre (coerenza con `shop_percorsi`/`promo_percorsi`, tabelle fisiche distinte anziché una unica con colonna "tipo"):

- `categoria_immagini_shop` (id, categoria, sottocategoria, immagine_categoria_url, immagine_sottocategoria_url, UNIQUE(categoria, sottocategoria))
- `categoria_immagini_promo` (stessa forma)
- `categoria_immagini_cataloghi` (stessa forma)

### Pulizia automatica ("se la coppia muore, muore anche l'immagine")

Ad ogni caricamento della pagina admin (calcolo live, nessun trigger DB, stesso stile "ricalcolato ad ogni richiesta" già usato per il canonical SEO):
1. Si calcola l'insieme delle coppie categoria/sottocategoria attualmente esistenti in `shop_percorsi` / `promo_percorsi` / `catalogo_voci_percorsi`.
2. Ogni riga di `categoria_immagini_*` la cui coppia non è più in quell'insieme viene cancellata, cancellando anche entrambi i blob associati (stesso pattern di `del(oldUrl)` già usato in `app/api/listini/foto/route.ts`).

### Nuovo file `lib/categoria-immagini.ts`

- `ensureCategoriaImmaginiTables(db)`
- `pulisciOrfane(db)` — esegue la pulizia sopra sulle 3 tabelle
- Funzioni di lettura da agganciare a `getCategorieTopLevel`/`getSottocategorie` (`lib/categorie-percorsi.ts`, LEFT JOIN sulla tabella immagini corrispondente: `getCategorieTopLevel` legge `immagine_categoria_url` della prima coppia per id, `getSottocategorie` legge `immagine_sottocategoria_url` della coppia esatta) e a `getCategorie()` in `app/brand/cataloghi/page.tsx`, per popolare la prop `immagine` già presente in `CategoryTile`.

### Nuova route upload `app/api/categoria-immagini/route.ts`

Stesso pattern di `app/api/listini/foto/route.ts` (`@vercel/blob` `put()`/`del()`, max 5MB, jpg/png/webp/gif): riceve `{ tipo: 'shop'|'promo'|'cataloghi', categoria, sottocategoria, slot: 'categoria'|'sottocategoria', foto }`, cancella il vecchio blob dello slot se presente, upsert nella tabella giusta.

### Nuova pagina admin `app/amministrazione/immagini-categorie/page.tsx`

Solo `admin` (stesso controllo cookie `session_role` delle altre pagine sotto `/amministrazione`). Tre griglie, una per tabella, righe = coppie distinct categoria/sottocategoria:
1. `shop_percorsi`
2. `promo_percorsi`
3. `catalogo_voci_percorsi`

Ogni riga: nome coppia (categoria / sottocategoria), due slot immagine affiancati ("Immagine categoria" e "Immagine sottocategoria") ciascuno con anteprima attuale (o placeholder), bottone carica, bottone rimuovi. Aggiunta voce in `lib/nav-config.ts` → `adminPages`: `{ id: 68, label: 'Immagini Categorie e Promo', href: '/amministrazione/immagini-categorie', roles: ['admin'] }`.

## Fase 2 — riepilogo implementazione

File nuovi:
- `lib/categoria-immagini.ts` — tabelle, pulizia orfane, lettura/scrittura
- `app/api/categoria-immagini/route.ts` — upload (`@vercel/blob`, max 5MB, jpg/png/webp/gif)
- `app/amministrazione/immagini-categorie/page.tsx` + `immagini-categorie-client.tsx` + `actions.ts` — pagina admin, 3 griglie (Shop, Promozioni, Cataloghi con un solo slot immagine visibile)

File modificati:
- `lib/categorie-percorsi.ts` — `getCategorieTopLevel`/`getSottocategorie` ora restituiscono anche `immagine`
- `app/brand/cataloghi/page.tsx`, `app/app/cataloghi/page.tsx` — stessa aggiunta per i cataloghi (query duplicata in entrambe le pagine, stesso pattern)
- `app/brand/cataloghi/catalogo-grid.tsx`, `app/shop/page.tsx`, `app/shop/[categoria]/page.tsx`, `app/promozioni/page.tsx`, `app/promozioni/[categoria]/page.tsx` — passano `immagine` alla `CategoryTile`
- `components/category-tile.tsx` — passato da `next/image` a `<img>` semplice (i blob di Vercel sono host esterni non in whitelist `next.config.ts`; stessa convenzione già usata per `foto_url` in `ProductCard`)
- `lib/nav-config.ts` — nuova voce admin id 68

Nota: per i cataloghi la tabella `categoria_immagini_cataloghi` è comunque a coppie con 2 slot (stessa forma di shop/promo), ma solo `immagine_categoria_url` è agganciata a una pagina pubblica — `immagine_sottocategoria_url` resta salvabile dall'admin ma inutilizzata finché non esisterà un secondo livello di navigazione per i cataloghi.

`npx tsc --noEmit` e `npx eslint` puliti su tutti i file toccati.

## Fase 2 — correzione (bug: immagine categoria duplicata per coppia)

Segnalato dall'utente: con `shop_percorsi` contenente sia `inverno/divani` che `inverno/xxxxxxx`, il modello "una riga per coppia con 2 slot" creava **due** slot "Immagine categoria" indipendenti per la stessa categoria "Inverno" — potenzialmente in conflitto, e comunque ridondante (solo uno dei due viene davvero mostrato sulla tile di /shop).

Corretto separando i due concetti in tabelle diverse, con chiave diversa:
- `categoria_immagini_<tipo>_cat` (categoria PRIMARY KEY, immagine_url) — **una** immagine per ogni valore distinct di categoria, condivisa da tutte le coppie che la usano.
- `categoria_immagini_<tipo>_sub` (categoria, sottocategoria, immagine_url, UNIQUE su entrambe) — una immagine per coppia, invariato. Solo per shop/promo (i cataloghi non hanno secondo livello pubblico, quindi nessuna tabella `_sub` per loro).

Le vecchie tabelle a coppie con 2 colonne (`categoria_immagini_shop/promo/cataloghi`) sono state sostituite da queste nuove; non essendoci ancora immagini reali caricate, non serviva una migrazione dati.

Pagina admin aggiornata di conseguenza: 5 griglie invece di 3 — "Categorie" e "Sottocategorie" separate per Shop e Promozioni, "Categorie" per Cataloghi — ognuna con un solo slot immagine per riga (niente più duplicazione).

`npx tsc --noEmit` e `npx eslint` puliti su tutti i file toccati dopo la correzione.
