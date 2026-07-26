# Shop + Promozioni: categorizzazione a percorsi multipli (sostituisce il piano precedente)

Stato: **completato** (2026-07-25)

## Riepilogo modifiche effettive

Implementato secondo il piano, con un dettaglio deciso in corso d'opera: il **canonical della pagina prodotto in `/promozioni`** preferisce il percorso Shop quando esiste (ricade sul percorso Promo solo se l'articolo non è mai stato messo in vendita nello Shop normale) — evita contenuto duplicato tra le due sezioni per lo stesso articolo. Confermata anche la validazione **404 se il path nell'URL non corrisponde a un percorso reale** dell'articolo (nessuna risposta esplicita era arrivata su questo punto, ho applicato la mia raccomandazione).

- `lib/shop-percorsi.ts` — **nuovo**: tabella `shop_percorsi` (mirror di `listini_percorsi`), `addPercorsoShop`/`removePercorsoShop`.
- `lib/promo.ts` — **riscritto**: tabella `promo_percorsi` (stesso schema), `addPercorsoPromo`/`removePercorsoPromo`, `listinoHaPercorsiPromo` (helper di validazione), colonna `listini.fine_promozione DATE NULL`. Rimossa la vecchia logica `promo_gruppi`/nome libero.
- `lib/categorie-percorsi.ts` — **nuovo**: helper condivisi Shop/Promo (`getCategorieTopLevel`, `resolveCategoria`, `getSottocategorie`, `resolveSottocategoria`, `percorsoValido`, `primoPercorso`), parametrizzati sulla tabella (`shop_percorsi` o `promo_percorsi`) per non duplicare le query nelle 6 route (3 livelli × 2 sezioni).
- `app/area-lavoro/listini/actions.ts` — `fine_promozione` in add/update; **validazione**: se un listino ha già percorsi promo, `updateArticolo` rifiuta modifiche che lascino `prezzo_promo` nullo o ≥ `prezzo_vendita`.
- `app/area-lavoro/listini/listini-client.tsx` — colonna "Gruppi Promo" sostituita da due colonne **"Shop"** e **"Promo"** (drag&drop, componente generico condiviso `PercorsiGenericPanel`), errori di validazione mostrati inline nel pannello Promo; campo `fine_promozione` (date) editabile accanto a `prezzo_promo`.
- `app/area-lavoro/listini/page.tsx` — carica `shopPercorsiPerListino` e `promoPercorsiPerListino`.
- **Route riscritte** a 3 livelli, identiche per struttura:
  - `/shop` → `/shop/[categoria]` → `/shop/[categoria]/[sottocategoria]` → `/shop/[categoria]/[sottocategoria]/[id]`
  - `/promozioni` → `/promozioni/[categoria]` → `/promozioni/[categoria]/[sottocategoria]` → `/promozioni/[categoria]/[sottocategoria]/[id]` (con filtro `fine_promozione` scaduta)
- `components/prodotto-dettaglio.tsx` — **nuovo**, componente condiviso dettaglio prodotto, usato da entrambe le sezioni.
- Rimossi come non più usati: vecchie route `/shop/[macro]/*`, `components/ecommerce-hub.tsx`, `components/ecommerce-catalog.tsx`, `ECOMMERCE_MACRO_SEZIONI`/`getMacroSezione`/`MacroSezione` in `lib/ecommerce.ts`.

## ⚠️ Note che restano valide

- **Checkout**: come già segnalato nel piano precedente, il carrello/checkout continua ad addebitare `prezzo_vendita` (+ `sconto_articolo` %), non ancora `prezzo_promo` — resta solo mostrato/comparato.
- **Rename categorie**: rinominare una categoria/sottocategoria in `listini` (colonna "Shop" o "Promo") cambia da subito quale slug risponde in produzione, senza deploy — il vecchio slug smette di rispondere (404) nello stesso istante, salvo altri articoli che tengano ancora il vecchio valore (comportamento discusso ed esplicitamente accettato).
- **Bulk update** (`updateMassivo`, riga "valori" in listini): non applica la validazione prezzo_promo/percorsi promo riga per riga — resta un'operazione da fare con attenzione se usata su articoli già in promo.

---


Questo documento **sostituisce** `docs/2026-07-25-sezione-promozioni.md` per la parte di categorizzazione: la tabella `promo_gruppi`/`promo_gruppi_articoli` costruita in quella fase (non ancora committata) viene scartata e rifatta con lo schema qui descritto.

## Obiettivo

Sia Shop che Promozioni hanno bisogno di una gerarchia a 2 livelli (categoria/sottocategoria) per organizzare gli articoli acquistabili di `listini`, **senza toccare `listini.categoria`/`sottocategoria`** (già usati altrove, es. nei carrelli — non vanno mischiati). Un articolo può avere **più percorsi contemporaneamente** per ciascun uso (stessa lampada raggiungibile da `shop/luce/lampade` *e* `shop/arredamento/illuminazione`; da `promo/casa/lampade` *e* `promo/natale/regali`).

## Decisioni prese in discussione

1. **Tre relazioni molti-a-molti parallele**, stessa forma di `listini_percorsi` (già esistente e collaudata):
   - `listini_percorsi` (esistente, **invariata**) → preventivi/catalogo, uso già consolidato.
   - `shop_percorsi` (**nuova**) → navigazione Shop.
   - `promo_percorsi` (**nuova**) → navigazione Promozioni.

   Tutte e tre: `(id, listino_id, categoria, sottocategoria)`, `UNIQUE(listino_id, categoria, sottocategoria)`, FK cascade su `listini`.

2. **Regola prezzo promo obbligatoria**: se un listino ha ≥1 riga in `promo_percorsi`, allora `prezzo_promo` **deve** essere impostato e **deve** essere `< prezzo_vendita`. Validata sia quando si aggiunge un percorso promo (se il prezzo non è ancora valido, l'aggiunta viene rifiutata con errore) sia quando si modifica `prezzo_promo` o `prezzo_vendita` di un articolo che ha già percorsi promo (se il nuovo valore rompe la regola, l'update viene rifiutato).

3. **`fine_promozione`** (nuovo campo `DATE NULL` su `listini`): opzionale. Se impostata e nel passato, l'articolo **esce automaticamente** dalle pagine `/promozioni/*` (query con `fine_promozione IS NULL OR fine_promozione >= CURDATE()`) — resta comunque nello Shop normale, resta comunque coi suoi `promo_percorsi` in DB (non li cancelliamo), semplicemente non viene più mostrato come "in corso". Nessun cron necessario: è un filtro a lettura, si autoregola ad ogni richiesta.

4. **Routing dinamico, URL segue la navigazione** (non canonico fisso): `categoria`/`sottocategoria` nell'URL sono **slug calcolati a runtime** dal testo salvato in `shop_percorsi`/`promo_percorsi` in quel momento (stessa funzione `toEcommerceSlug` già in `lib/ecommerce.ts`). Rinominare un valore in admin cambia immediatamente quale slug risponde, senza deploy; il vecchio slug smette di rispondere (404) nello stesso istante — a meno che almeno un altro articolo tenga ancora quel valore, nel qual caso quella pagina resta viva (comportamento "naturale", nessuna gestione esplicita necessaria).

5. **Canonical SEO**: la pagina prodotto imposta `<link rel="canonical">` sul *primo* percorso disponibile per quell'articolo (es. ordinato per id crescente della riga percorso), ricalcolato ad ogni richiesta — se quel percorso viene cancellato, al render successivo il canonical si sposta automaticamente sul prossimo rimasto.

## Struttura route

- `/shop` → hub, elenco categorie di primo livello (valori distinti di `shop_percorsi.categoria`)
- `/shop/[categoria]` → elenco sottocategorie sotto quella categoria
- `/shop/[categoria]/[sottocategoria]` → griglia articoli (join `shop_percorsi` → `listini`, `disponibile=1 AND acquistabile=1`)
- `/shop/[categoria]/[sottocategoria]/[id]` → dettaglio prodotto (foto, prezzo — doppio se in promo, form aggiungi al carrello)

Stessa identica struttura per Promozioni, tabella `promo_percorsi` al posto di `shop_percorsi`:
- `/promozioni` → hub categorie promo di primo livello
- `/promozioni/[categoria]` → sottocategorie
- `/promozioni/[categoria]/[sottocategoria]` → griglia articoli in promo (con filtro `fine_promozione` scaduta)
- `/promozioni/[categoria]/[sottocategoria]/[id]` → dettaglio prodotto

Il **markup del dettaglio prodotto** (foto, prezzo doppio, form carrello) viene estratto in un componente condiviso (es. `components/prodotto-dettaglio.tsx`) usato da entrambe le route `/shop/.../[id]` e `/promozioni/.../[id]`, per non duplicare la logica — sono due file di route diversi (richiesto da Next.js) ma stesso componente di rendering, stessa query base su `listini`.

## File coinvolti

- SQL: nuove tabelle `shop_percorsi`, `promo_percorsi` (stesso schema di `listini_percorsi`); nuova colonna `listini.fine_promozione DATE NULL`. **Non creare più** `promo_gruppi`/`promo_gruppi_articoli` (da rimuovere quanto già scritto in questa sessione, non committato).
- `lib/shop-percorsi.ts` — **nuovo**, mirror di `lib/percorsi.ts`: `addPercorsoShop`/`removePercorsoShop`.
- `lib/promo.ts` — **riscritto**: `addPercorsoPromo`/`removePercorsoPromo` con la validazione prezzo_promo obbligatorio/inferiore descritta sopra; rimossa la logica di gruppi con nome libero e slug auto-generato.
- `app/area-lavoro/listini/actions.ts` — validazione prezzo_promo/promo_percorsi in `updateArticolo`; nuovo campo `fine_promozione`.
- `app/area-lavoro/listini/listini-client.tsx` — **sostituita** la colonna "Gruppi Promo" con due colonne distinte "Shop" e "Promo" (drag&drop identico a "Percorsi", uno per tabella), più campo `fine_promozione` editabile accanto a `prezzo_promo`.
- `app/shop/page.tsx`, `app/shop/[categoria]/page.tsx`, `app/shop/[categoria]/[sottocategoria]/page.tsx`, `app/shop/[categoria]/[sottocategoria]/[id]/page.tsx` — **riscritte** (sostituiscono l'attuale `/shop/[macro]` a macro-sezione unica finta).
- `app/promozioni/page.tsx`, `app/promozioni/[categoria]/page.tsx`, `app/promozioni/[categoria]/[sottocategoria]/page.tsx`, `app/promozioni/[categoria]/[sottocategoria]/[id]/page.tsx` — **riscritte** (sostituiscono l'hub/griglia flat scritti nella sessione precedente).
- `components/prodotto-dettaglio.tsx` — **nuovo**, componente condiviso dettaglio prodotto.
- `lib/ecommerce.ts` — rimane per `toEcommerceSlug`/`getUnitaMode`/`ArticoloEcommerce`; rimosso `ECOMMERCE_MACRO_SEZIONI`/`getMacroSezione` (non più necessari, sostituiti dalle categorie reali).

## Punti assunti (correggimi se sbaglio)

- Promozioni ottiene una route a 3 livelli propria (non un semplice link verso `/shop/...`): stessa struttura di Shop, stesso criterio, come descritto sopra — la pagina dettaglio è condivisa a livello di componente ma resta un file di route separato sotto `/promozioni/...`.
- Le vecchie route `/shop/[macro]` (con l'unica macro finta "arredi") vengono sostituite, non mantenute in parallelo.

In attesa di conferma esplicita prima di scrivere codice.
