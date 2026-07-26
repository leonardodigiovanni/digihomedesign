# Cataloghi pubblici: URL /cataloghi + 3 livelli come shop

Stato: completato

## Obiettivo

1. L'URL pubblico dei cataloghi diventa `/cataloghi` (non più `/chi-siamo/cataloghi`) — coerente col fatto che la nav li tratta già come voce a sé (`standalonePages`, non sotto un dropdown "Chi Siamo").
2. La navigazione diventa a 3 livelli come `/shop`: hub (categorie) → categoria (sottocategorie) → sottocategoria (i cataloghi PDF veri e propri, quello che oggi si vede subito al 2° livello).

## Situazione attuale (confermata leggendo il codice)

- Cartella `app/brand/cataloghi` **non si tocca nel nome** (~130 file dipendono da `app/brand/...`, come già annotato nel commento di `next.config.ts`): resta così, cambia solo l'URL pubblico con cui ci si arriva.
- Oggi `/chi-siamo/cataloghi/*` arriva a `app/brand/cataloghi/*` tramite il rewrite generico già esistente `/chi-siamo/:path*` → `/brand/:path*`. Nessun rewrite dedicato ai cataloghi esiste oggi.
- `catalogo_voci_percorsi` (id, voce_id, categoria, sottocategoria) già supporta sottocategoria libera **e spesso vuota** (`''`): sia il default di colonna sia l'UI admin (`PercorsiInline` in `area-lavoro/cataloghi`) permettono di salvare solo la categoria, senza sottocategoria. Confermato dalla tua scelta: sottocategoria vuota → tile "Generale".
- Oggi il livello 2 (`[slug]/page.tsx`) mostra **direttamente** tutti i cataloghi PDF della categoria (sottocategoria è solo un dato per-voce, non un livello di navigazione) — `CatalogoWrapper` ha già una prop `fixedSottocat` pronta ma **inutilizzata per filtrare i PDF** (serve solo a bloccare il matching articoli); il vecchio dropdown "sottocategoria" nel filtro non esiste più nel JSX (probabilmente già tolto in una sessione precedente, il suo state è morto). Questo semplifica il lavoro: non c'è una UI da smontare, solo da ricollegare alla nuova route.
- Il livello 3 (`[voceSlug]/page.tsx`, singolo PDF) esiste già e fa matching articoli per **coppia esatta** categoria+sottocategoria — oggi però la sottocategoria del voce viene dedotta con `LIMIT 1` (un voce può avere più coppie), non passata dall'URL.

## Nuova struttura URL

```
/cataloghi                                  → hub, tile categorie (invariato nei contenuti, cambia solo il prefisso)
/cataloghi/[categoria]                      → NUOVO contenuto: tile sottocategorie (come /shop/[categoria]), sottocategoria vuota → tile "Generale"
/cataloghi/[categoria]/[sottocategoria]     → NUOVA pagina: galleria PDF + filtri + articoli acquistabili/preventivo, con voci/articoli filtrati sulla coppia ESATTA (oggi filtrati solo per categoria)
/cataloghi/[categoria]/[sottocategoria]/[voceSlug]  → spostato di un livello (oggi è [categoria]/[voceSlug])
```

## Modifiche previste

### Routing (`app/brand/cataloghi/**`)
- `[slug]/page.tsx`: riscritta per mostrare le tile sottocategoria (query `DISTINCT sottocategoria` per quella categoria, `''` → slug `generale` / etichetta "Generale"), stile identico a `/shop/[categoria]`.
- **Nuova** `[slug]/[sottoSlug]/page.tsx`: contenuto equivalente all'attuale `[slug]/page.tsx` (galleria voci, filtri, articoli acquistabili, pool preventivo), ma le query SQL diventano `WHERE categoria=? AND sottocategoria=?` (coppia esatta) invece di solo categoria. Passa `fixedCat` **e** `fixedSottocat` a `CatalogoWrapper` (prop già esistente, oggi non sfruttata per i PDF).
- **Spostata** `[slug]/[voceSlug]/**` → `[slug]/[sottoSlug]/[voceSlug]/**` (page.tsx, voce-viewer.tsx, voce-viewer-inner.tsx si spostano; breadcrumb/backHref guadagnano un livello; la query smette di dedurre la sottocategoria con `LIMIT 1` e la prende direttamente dall'URL).
- `catalogo-wrapper.tsx`: rimosso lo stato morto `formSottocat`/`sottocatOpt` (non aveva più una UI collegata).
- `catalogo-grid.tsx`: `basePath` default `/chi-siamo/cataloghi` → `/cataloghi`.
- `page.tsx` (hub): `canonical` aggiornato a `https://www.digi-home-design.com/cataloghi`.

### PWA (`app/app/cataloghi/**`)
Stessa ristrutturazione, duplicata (la pagina è già una copia indipendente che riusa `CatalogoWrapper`/`CatalogoGrid` da `brand/cataloghi`): `[slug]/page.tsx` → tile sottocategorie, nuova `[slug]/[sottoSlug]/page.tsx`, `[voceSlug]` spostato di un livello.

### Routing pubblico (`next.config.ts`)
- Nuovo rewrite: `/cataloghi` e `/cataloghi/:path*` → `/brand/cataloghi` e `/brand/cataloghi/:path*`.
- Nuovo redirect permanente (per continuità SEO, stesso pattern delle altre pagine rinominate): `/chi-siamo/cataloghi` e `/chi-siamo/cataloghi/:path*` → `/cataloghi` e `/cataloghi/:path*`. I redirect vengono valutati prima dei rewrite in Next.js, quindi questo continua a funzionare nonostante il rewrite generico `/chi-siamo/:path*` esistente.
- Effetto collaterale accettato: i vecchi link diretti a un singolo PDF (`/chi-siamo/cataloghi/[cat]/[voce]`, 2 segmenti) rediretti sulla nuova struttura non troveranno più un match a 2 segmenti (ora ne servono 3) e daranno 404 — ma quelle pagine hanno già `robots: { index: false }`, quindi nessun impatto SEO reale, solo un bookmark utente da rifare (torna alla home cataloghi e clicca di nuovo).
- I vecchi link alla categoria (`/chi-siamo/cataloghi/[cat]`, indicizzati) rediretteranno correttamente e mostreranno le tile sottocategoria invece della galleria diretta — un click in più, stesso comportamento già accettato per `/shop/[categoria]`.

### Immagini categorie (`lib/categoria-immagini.ts` + admin)
Il secondo livello dei cataloghi ora esiste per davvero (non più "in futuro chissà"): aggiungo `'cataloghi'` a `TipoConSottocategoria`, nuova tabella `categoria_immagini_cataloghi_sub` (stessa forma di shop/promo), e una 6ª griglia "Cataloghi → Sottocategorie" nella pagina admin `/amministrazione/immagini-categorie` (oggi ce ne sono 5: Shop Cat/Sub, Promo Cat/Sub, Cataloghi Cat).

### Link/riferimenti hardcoded da aggiornare
`/chi-siamo/cataloghi` compare come stringa letterale (nessuna costante condivisa) in: `app/aiuto/guida-preventivo/page.tsx`, `app/aiuto/guida-computometrico/page.tsx`, `components/main-wrapper.tsx` (`PUBLIC_FULL_WIDTH_PREFIXES`), `lib/nav-config.ts` (`standalonePages`, id 38), `app/page.tsx` (CTA home), `app/amministrazione/immagini-categorie/actions.ts` (`revalidatePath`), `app/brand/page.tsx` (tile "Cataloghi" nell'hub Chi Siamo — aggiorno solo l'href a `/cataloghi`, la tile resta lì: non l'hai chiesto di toglierla e la nav standalone è un canale separato). Tutti aggiornati a `/cataloghi`.

### Cosa NON cambia
- Le ~55 pagine vetrina (`app/serramenti/*`, `app/metallurgia/*`, `app/arredi/*`, ecc.) che leggono `catalogo_voci_percorsi` con una categoria hardcoded (es. `app/arredi/soprammobili/page.tsx`) sono indipendenti da questa ristrutturazione — non passano da `/cataloghi/[slug]`, quindi zero modifiche lì.
- `area-lavoro/cataloghi` (builder admin dove assegni i percorsi) — nessuna modifica, il modello dati è già quello giusto.
- `app/sitemap.ts` — non enumera oggi le pagine cataloghi, nessuna modifica necessaria.

Confermi che proceda con questa struttura?

## Riepilogo implementazione

Fatto esattamente come pianificato, con un dettaglio in più emerso in corso d'opera:

- `next.config.ts`: nuovo rewrite `/cataloghi(/*)` → `/brand/cataloghi(/*)`, nuovo redirect permanente `/chi-siamo/cataloghi(/*)` → `/cataloghi(/*)`.
- `app/brand/cataloghi/[slug]/page.tsx`: ora mostra le tile sottocategoria (query `GROUP BY sottocategoria`, `''` → "Generale"/slug `generale`).
- Nuova `app/brand/cataloghi/[slug]/[sottoSlug]/page.tsx`: contenuto ex-`[slug]/page.tsx`, filtrato sulla coppia esatta categoria+sottocategoria, `fixedCat`+`fixedSottocat` passati a `CatalogoWrapper`.
- `[slug]/[voceSlug]/**` spostata a `[slug]/[sottoSlug]/[voceSlug]/**` (voce-viewer incluso), risoluzione sottocategoria dall'URL invece che dedotta con `LIMIT 1`.
- `catalogo-wrapper.tsx`: rimosso lo stato morto `formSottocat`/`sottocatOpt` (nessuna UI lo usava già).
- `catalogo-grid.tsx` e canonical dell'hub aggiornati a `/cataloghi`.
- **PWA (`app/app/cataloghi/**`)**: stessa ristrutturazione completa, duplicata (era già una copia indipendente).
- **`lib/categoria-immagini.ts`**: `TipoConSottocategoria` ora include `'cataloghi'`; `getCoppieConImmagine` ha un nuovo parametro `includiVuota` (i cataloghi ammettono sottocategoria `''` = "Generale", shop/promo restano esclusi come prima).
- **Pagina admin**: sesta griglia "Cataloghi → Sottocategorie" aggiunta. Dettaglio non previsto nel piano iniziale: `ImmagineSlotBox` deduceva lo slot ("categoria" vs "sottocategoria") dalla presenza di una sottocategoria non vuota — per i cataloghi questo era sbagliato (la riga "Generale" ha sottocategoria `''` ma è comunque uno slot "sottocategoria"), quindi lo slot è ora passato esplicitamente invece che dedotto.
- **`components/category-tile.tsx`**: nuova prop `unita?: [string, string]` (singolare/plurale) per non forzare la dicitura "articolo/i" — i cataloghi usano `['catalogo', 'cataloghi']`.
- Tutti i riferimenti hardcoded a `/chi-siamo/cataloghi` (nav-config, main-wrapper, guide, home, hub Chi Siamo, banner carrello/ordini, revalidatePath) aggiornati a `/cataloghi`. Breadcrumb e "torna indietro" dell'hub cataloghi ora puntano a Home invece che a Chi Siamo, coerente con l'uscita dal gruppo.

`npx tsc --noEmit` e `npx eslint` puliti su tutti i file toccati (solo warning/errori preesistenti e non correlati rimangono, invariati).
