# Migrazione link di fine pagina nello sticky bar + uniformità bottoni + stellina scorciatoia

Stato: completato

## Contesto

Quasi ogni pagina vetrina/prodotto del sito termina con una riga di link di
navigazione ("← Torna a Metallurgia", "Calcola preventivo", "Segui
cantiere", "← Home", "Chiedi info", ecc.), renderizzata inline nel corpo
della pagina, appena prima del paragrafo di debug. Vogliamo spostare questi
link nella sticky bottom bar già esistente (`StickyBottomBarContent`),
uniformando anche lo stile: tutti bottoni neri (`btn-black fs-12`), nessun
link testuale sottolineato.

Ho fatto una ricognizione su tutte le pagine (`app/**/page.tsx`) che
contengono link di questo tipo. Risultato:

- **~121 pagine**: il blocco di fine pagina è già
  `<div style={{ display:'flex', gap:8 }}>` con dentro dei
  `<Link className="btn-black fs-12" style={{ flex:1 }}>` (e talvolta
  `<CtaPreventivo />` / `<CtaCantiere />`) — già bottoni, serve solo
  spostarli nello sticky bar. Include: tutte le pagine categoria di
  Metallurgia/Serramenti/Edilizia/Legno/Elettricità/Termodinamica/Arredi/Tessuti/Servizi,
  tutte le pagine hub (`/serramenti`, `/metallurgia`, ecc.), tutte le pagine
  Aiuto, le pagine Prodotti top-level (`/porte-blindate`, `/infissi`, ecc.),
  `/brand/cataloghi` e le sue sotto-pagine, `/brand/storia` (già fatta,
  riferimento), `/brand/contatti`, `/brand/condizioni-di-vendita`,
  `/brand/templates-documenti`, `/app-download`.
- **5 pagine con link testuali veri e propri**, da convertire in bottone
  E spostare:
  - `app/privacy-policy/page.tsx` — `← Torna alla home` sottolineato
  - `app/app/privacy-policy/page.tsx` — stesso, mirror PWA (vedi nota sotto)
  - `app/brand/page.tsx` — `← Torna alla home` sottolineato (hub Brand)
  - `app/area-clienti/ordini/successo/page.tsx` — due link con colori
    custom (blu/grigio), non `btn-black`
  - `app/app/ordini/successo/page.tsx` — stesso, mirror PWA
- **~10 pagine senza alcun link di fine pagina** da spostare (es.
  `area-clienti/carrello-preventivo`, `clienti/computometrici`,
  `clienti/preventivi` — hanno solo un bottone in testa alla pagina, non a
  fine pagina: fuori scope, non li tocco).
- **Famiglia `app/app/*` (PWA)**: usa un meccanismo diverso
  (`SetActionBar`, classe `btn-black-app`), non `StickyBottomBarContent`.
  **Fuori scope per questa fase** — la sticky bar di cui parliamo è "solo
  sito", coerente con tutte le altre funzionalità sticky già realizzate. Le
  2 pagine PWA nell'elenco sopra (privacy-policy, ordini/successo) le
  sistemo comunque nello stile (bottone nero) ma **restano dov'erano**,
  senza spostarle in un componente sticky — un domani, se vorrai
  uniformare anche `/app`, sarà un documento a parte.

## Obiettivo

1. Per le ~121 pagine "già bottoni": spostare il contenuto del blocco di
   fine pagina dentro `<StickyBottomBarContent>...</StickyBottomBarContent>`
   (import da `@/components/sticky-bottom-bar-content`), eliminando il
   `<div style={{ display:'flex', gap:8 }}>` che li conteneva (la sticky
   bar ha già il proprio `display:flex, gap:16` — non serve un wrapper) e
   il `flex:1` per-bottone (nella sticky bar i bottoni sono a larghezza
   naturale, non si espandono — stesso comportamento già in uso per Storia,
   Home, popup, ecc., non per bottoni affiancati a larghezza fissa).
2. `components/cta-preventivo.tsx` e `components/cta-cantiere.tsx` (usati
   da quasi tutte queste pagine): rimuovo il `flex: 1` dal loro stile
   inline, per lo stesso motivo — da ora vivono sempre dentro la sticky
   bar.
3. Per le 3 pagine sito (privacy-policy, brand hub, ordini/successo
   sito): converto il/i link in `btn-black fs-12` E li sposto nello sticky
   bar.
4. Per le 2 pagine PWA (`app/app/privacy-policy`, `app/app/ordini/successo`):
   converto solo lo stile in coerenza con `btn-black-app` (bottone nero
   coerente con la PWA), **senza** spostarli in nessun componente sticky —
   restano dove sono nel corpo pagina.
5. Nessuna modifica alle pagine senza link di fine pagina, né alla
   famiglia `app/app/*` più ampia (cataloghi, carrello-preventivo, ecc.).
6. **Stellina verde "pagina preferita"**: su ogni pagina che ha il
   breadcrumb in testa ("Home / Categoria" o simile), se la pagina corrente
   è già una scorciatoia salvata, mostrare una stellina verde ★ accanto al
   testo del breadcrumb. Sulle pagine senza breadcrumb, mostrare comunque
   solo la stellina (da sola), nella stessa posizione in cui il breadcrumb
   starebbe normalmente. Applicato allo stesso insieme di pagine di questo
   documento (quelle con blocco di fine pagina) — un'estensione a pagine
   diverse (Aiuto già incluso, ma aree interne/PWA) la valutiamo *dopo*,
   come detto.

## Stellina "pagina preferita" — dettaglio

Nuovo componente **`components/shortcut-star.tsx`** (`'use client'`):

```tsx
'use client'
import { usePathname } from 'next/navigation'
import { useHomeShortcuts } from '@/lib/home-shortcuts-context'

export default function ShortcutStar() {
  const pathname = usePathname()
  const { isShortcut } = useHomeShortcuts()
  if (!isShortcut(pathname)) return null
  return <span title="Pagina tra le tue scorciatoie" style={{ color: '#2e7d32', marginLeft: 6 }}>★</span>
}
```

Non serve passare `href`: legge da solo il pathname corrente e lo stato del
Context già montato nel layout. Ritorna `null` (nessun elemento nel DOM)
quando la pagina non è una scorciatoia — nessuno spazio vuoto residuo.

Inserimento:
- **Pagine con breadcrumb** (il pattern
  `<p className="fs-12" style={{ color:'#000', marginBottom:8, ... }}>` con
  dentro un `<Link>` seguito da `/ NomePagina`): `<ShortcutStar />` aggiunta
  subito dopo il testo, dentro lo stesso `<p>`.
- **Pagine senza breadcrumb**: `<ShortcutStar />` da sola, prima dell'`h1`,
  senza wrapper aggiuntivo (dato che ritorna `null` quando non applicabile,
  non lascia spazio vuoto).

Lo stesso script di migrazione (`scripts/migrate-end-nav-to-sticky.js`) fa
anche questo inserimento in un secondo passaggio, sullo stesso insieme di
file già letti per i link di fine pagina.

## Scelta tecnica

### Script per le ~121 pagine (bulk, automatico)

Nuovo script one-shot **`scripts/migrate-end-nav-to-sticky.js`** (stesso
spirito di `scripts/transform-vetrina.js`, già usato in questo progetto per
trasformazioni di massa sulle pagine vetrina):

- Trova il blocco `<div style={{ display: 'flex', gap: 8 }}>...</div>`
  (o varianti con `flexWrap`/marginTop per le pagine brand a link singolo)
  che precede immediatamente il paragrafo `IsDebug` di fine pagina.
- Estrae i figli (Link/CtaPreventivo/CtaCantiere), rimuove `flex: 1` dai
  loro `style`, li reindenta dentro un nuovo blocco
  `<StickyBottomBarContent>...</StickyBottomBarContent>`.
- Aggiunge l'import `StickyBottomBarContent` se mancante (dopo l'ultimo
  import esistente).
- Salta (segnala in output, non tocca) qualunque file che non combacia
  esattamente col pattern atteso, per non rischiare trasformazioni errate
  — questi li guardo a mano.
- Va eseguito una volta, il codice generato viene revisionato (lint +
  build) prima di qualunque commit.

### Le 5 pagine eccezione (manuali, una per una)

Modifica diretta: stesso pattern (bottone `btn-black fs-12` dentro
`StickyBottomBarContent`) applicato a mano, dato che ciascuna ha una
struttura leggermente diversa (non vale la pena generalizzare lo script per
5 casi unici). Per le 2 mirror PWA, solo restyling del bottone (nessun
`StickyBottomBarContent`, che è specifico del sito).

### Verifica

Dopo lo script + le modifiche manuali: `npm run lint` e `npx tsc --noEmit`
su tutto il progetto (non file per file, viste le dimensioni), più un
controllo a campione visivo su almeno 3-4 pagine di categorie diverse
(catalogo, hub, brand, Aiuto) prima di considerare il lavoro concluso.

## Non tocco

- Famiglia `app/app/*` più ampia (cataloghi, carrello-preventivo,
  preventivo, carrello-acquisti/pagamento): restano su `SetActionBar` /
  `btn-black-app`, nessuna modifica.
- Le ~10 pagine senza link di fine pagina (hanno solo bottoni in testa,
  fuori scope).
- Breadcrumb in testa alla pagina ("Home / Categoria ..."): restano testo
  sottolineato come sono ora, ci aggiungiamo solo la stellina accanto,
  nessun altro cambiamento di stile.
- Stellina non estesa oltre l'insieme di pagine di questo documento (aree
  interne, PWA, pagine senza fine-pagina): rimandato a valutazione futura,
  come da richiesta esplicita ("poi ci ragioniamo").

## Riepilogo modifiche effettive

**Correzione dopo un controllo incrociato finale**: ricostruito da zero
l'elenco completo delle pagine con pattern "Torna/Vai/←/→" (136 file,
sito) e confrontato con l'elenco effettivamente modificato. Trovate 3
pagine dimenticate durante il primo giro (non avevano il paragrafo
`IsDebug` usato come anchor dallo script, quindi non erano mai state
candidate né segnalate come skip): `app/brand/partners/page.tsx`,
`app/brand/galleria/page.tsx`, `app/app-download/page.tsx`. Sistemate a
mano con lo stesso pattern delle altre. Verificate una per una anche tutte
le rimanenti pagine "non modificate" (18 file) — confermato per ciascuna
che è correttamente fuori scope (elenco dettagliato sotto).

- **`scripts/migrate-end-nav-to-sticky.js`** (nuovo): codemod one-shot,
  eseguito una volta. 106 pagine migrate automaticamente (bottoni spostati
  in `StickyBottomBarContent`, `flex: 1` rimosso, stellina aggiunta al
  breadcrumb). Due bug trovati e corretti durante lo sviluppo dello script
  (verificati via `git diff` prima di considerarli buoni):
  - l'indentazione della riga di apertura veniva raddoppiata (il prefisso
    originale non tagliato + un nuovo indent aggiunto);
  - l'anchor di fine pagina cercava `className="IsDebug` invece di
    `<p className="IsDebug`, includendo per errore l'inizio del tag `<p`
    nel controllo "solo whitespace tra i blocchi".
- **`components/cta-preventivo.tsx`, `components/cta-cantiere.tsx`**:
  rimosso `flex: 1` dallo stile inline (vivono sempre nello sticky bar ora).
- **`components/shortcut-star.tsx`** (nuovo): stellina oro `#c8960c` (non
  verde come da bozza iniziale, per coerenza col resto del sito).
- **16 pagine gestite a mano** (fuori portata dello script, pattern diversi
  o assenti):
  - `app/brand/storia/page.tsx`: già migrata in precedenza, aggiunta solo
    la stellina mancante.
  - `app/brand/condizioni-di-vendita`, `contatti`, `templates-documenti`:
    pattern "singolo Link con `marginTop: 32`", convertiti a mano.
  - `app/brand/cataloghi/[slug]/page.tsx`: IsDebug posizionato PRIMA del
    blocco nav (ordine invertito rispetto al resto) — gestito a mano.
  - `app/brand/cataloghi/[slug]/[voceSlug]/page.tsx`: nessun anchor IsDebug
    nel file, non era tra i candidati dello script — trovato e sistemato
    a mano.
  - `app/privacy-policy/page.tsx`, `app/brand/page.tsx`,
    `app/area-clienti/ordini/successo/page.tsx`: le 3 vere eccezioni
    testuali previste dal piano, convertite in `btn-black fs-12` e spostate
    in `StickyBottomBarContent`.
  - `app/app/privacy-policy/page.tsx`, `app/app/ordini/successo/page.tsx`:
    mirror PWA, solo restyling `btn-black-app` come da piano, **non**
    spostati in nessun componente sticky (restano nel corpo pagina).
  - Le restanti pagine segnalate come "skip" dallo script (8 pagine
    `area-clienti`/`area-lavoro`/`clienti` con `<div className="IsDebug">`
    invece di `<p className="IsDebug">`, più `carrello-preventivo` e
    `carrello-acquisti`): verificate una per una, nessuna ha un link di
    fine pagina da spostare — nessuna modifica, come da "Non tocco".
- **Verifica**: `npm run lint` e `npx tsc --noEmit` sull'intero progetto
  dopo tutte le modifiche — nessun errore/warning nuovo introdotto (solo
  problemi pre-esistenti già presenti prima di questo lavoro, verificati
  confrontando con `git show HEAD` dove c'era dubbio).
- Famiglia `app/app/*` più ampia: confermato non toccata (`git status` non
  mostra alcun file sotto `app/app/*` oltre ai 2 restyling previsti).

## Verifica finale — le 18 pagine rimaste "non modificate" (motivo per ciascuna)

- `app/area-clienti/carrello-acquisti/pagamento/page.tsx` e mirror PWA:
  **decisione esplicita di non toccare** — "← Torna al carrello" è
  accoppiato nella stessa riga d'azione col bottone "Paga ora" di un form
  di checkout; spostarlo da solo nello sticky bar separerebbe due azioni
  che devono restare insieme. Lasciato come bottone `btn-black`/`btn-black-app`
  esistente, nessuna modifica.
- `app/area-clienti/carrello-preventivo/page.tsx`, `stampa/page.tsx`: nessun
  link di fine pagina (UI del carrello in un componente client separato /
  pagina di stampa PDF senza nav).
- `app/area-clienti/computometrici/[id]/page.tsx`: "← Elenco" è
  nell'header del documento (in alto, accanto allo stato), non a fine
  pagina.
- `app/area-clienti/preventivi/page.tsx`, `app/clienti/preventivi/page.tsx`,
  `app/clienti/computometrici/page.tsx`: pagine tabellari, nessun link di
  fine pagina (solo "Apri →" per riga verso il dettaglio, e un bottone in
  testa pagina).
- `app/page.tsx`: home page, match originale era un falso positivo (freccia
  dentro un commento JSX) — nessuna scorciatoia verso sé stessa, corretto.
- `app/test-rgb/page.tsx`, `app/test-telai/page.tsx`: pagine di test senza
  alcun `Link`/`<a>` — falsi positivi dell'grep iniziale.
- `app/app/*` (8 file: cataloghi, cataloghi/[slug], cataloghi/[slug]/[voceSlug],
  carrello-preventivo, preventivo, carrello-acquisti/pagamento, privacy-policy,
  ordini/successo): famiglia PWA, fuori scope per design (le ultime due
  comunque restilizzate, vedi sopra).
