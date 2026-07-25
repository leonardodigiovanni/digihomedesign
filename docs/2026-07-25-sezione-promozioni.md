# Sezione "Promozioni" (nav tra Shop On Line e Cataloghi)

Stato: **in attesa di conferma**

## Obiettivo

Nuova voce di nav "Promozioni" tra "Shop On Line" e "Cataloghi". Riusa gli stessi articoli/categorie di Shop, ma organizzati in **gruppi promozionali** trasversali e liberi: un singolo articolo può stare in più gruppi promo contemporaneamente (es. una lampada può essere sia in "Lampade in Promozione" sia in "Estate 2026" sia in "Fuori Tutto"), e un gruppo promo tipicamente contiene solo un **sottoinsieme** degli articoli della categoria reale (es. 2 lampade su 10). Serve anche un prezzo promo fisso da affiancare al prezzo normale (non lo sconto % già esistente, che è un meccanismo diverso).

## Stato attuale (da ricerca sul codice)

- `/shop` → `/shop/[macro]` → `/shop/[macro]/[id]`. Le "macro-categorie" sono un array hardcoded in `lib/ecommerce.ts` (oggi una sola voce, "arredi"); `/shop/[macro]` **non filtra nemmeno per quella macro** — mostra tutti gli articoli `acquistabile=1 AND disponibile=1` di `listini`. Il vero filtro per categoria è un checkbox client-side sul campo libero `listini.categoria`.
- Nessuna tabella categorie/gruppi dedicata allo shop esiste nel DB.
- Esiste già un pattern di relazione articolo↔(categoria,sottocategoria) **molti-a-molti** nel codice: `listini_percorsi` (junction table con `UNIQUE(listino_id, categoria, sottocategoria)`, gestita da `lib/percorsi.ts`), usato però per tutt'altro scopo (abbinamento articoli-voce di catalogo nei preventivi). È il precedente più vicino nel repo a "un articolo appartiene a più gruppi".
- Esiste già `listini.sconto_articolo` (DECIMAL, **percentuale**, non prezzo fisso), applicato solo per clienti loggati nel carrello acquisti/checkout Stripe. Non è quello che serve qui: tu vuoi un **prezzo_promo fisso** che coesista col prezzo normale, indipendente da questo sconto %.
- `standalonePages` in `lib/nav-config.ts` è l'unico punto da toccare per la nav (desktop, mobile, e pannello admin "Pagine visibili" lo leggono già genericamente) — banale aggiungere una voce lì.

## Decisioni finali (piano pronto per l'implementazione)

1. **Struttura articoli+gruppi** confermata: tabella `promo_gruppi` + junction `promo_gruppi_articoli`, nessun flag su categoria intera.
2. **`prezzo_promo` nullable, nessuna validazione**: quando è `NULL`, la UI lo tratta semplicemente come uguale al prezzo esistente (`prezzo_promo ?? prezzo_vendita`) — nessun prezzo doppio mostrato, nessun blocco per aggiungerlo a un gruppo senza prezzo promo impostato. Il doppio prezzo (barrato + evidenziato) compare solo quando `prezzo_promo` è impostato **e diverso** da `prezzo_vendita`.
3. **Pagina prodotto: riuso quella di shop** (`/shop/[macro]/[id]`) — l'articolo è lo stesso ovunque ci si arrivi, e il prezzo promo (se impostato) prevale ovunque venga mostrato il prezzo di quell'articolo, sia dentro `/promozioni` sia dentro `/shop`. Le card di `/promozioni/[gruppo]` linkano quindi direttamente a `/shop/[macro]/[id]` invece che a una pagina dettaglio propria. **Nota**: oggi `/shop` ha una sola macro-categoria hardcoded (`arredi`, non ancora usata per filtrare), quindi il link sarà `/shop/arredi/[id]` per tutti gli articoli finché quel sistema non verrà completato — stesso limite già presente in shop, non lo aggravo né lo risolvo qui.
4. **Gestione admin dentro `listini`, non una pagina nuova**: niente `area-lavoro/promozioni`. Si aggiunge una colonna **"Gruppi Promo"** nella tabella di `app/area-lavoro/listini` (`listini-client.tsx`), con lo stesso identico meccanismo già usato per la colonna "Percorsi" (`PercorsiPanel`, righe 1004-1093):
   - chip trascinabili (drag&drop) per copiare l'assegnazione da una riga a un'altra;
   - input di testo libero + bottone "+" per assegnare/creare un gruppo per nome (se il nome non esiste ancora tra i `promo_gruppi`, viene creato al volo con slug auto-generato — stessa filosofia della categoria libera, nessuna schermata di gestione gruppi separata);
   - "✕" per rimuovere l'assegnazione dalla riga.

   Il campo `prezzo_promo` diventa una colonna editabile in più nella stessa tabella, accanto a `prezzo_vendita`.
5. **Dati di partenza**: DB vuoto, 0 gruppi — li create voi dal pannello `listini` digitando il nome del primo gruppo su un articolo.

## File coinvolti (riepilogo implementazione)

- SQL: nuove tabelle `promo_gruppi` (id, nome, slug, attivo, ordine, timestamps), `promo_gruppi_articoli` (junction, `UNIQUE(gruppo_id, listino_id)`, FK cascade); `ALTER TABLE listini ADD COLUMN prezzo_promo DECIMAL(10,2) NULL`.
- `lib/promo.ts` — **nuovo**, mirror di `lib/percorsi.ts`: `addGruppoPromoListino(listinoId, nomeGruppo)` (crea il gruppo se non esiste, poi collega), `removeGruppoPromoListino(id)`, tipo `GruppoPromo = { id, gruppoId, nome, slug }`.
- `app/area-lavoro/listini/listini-client.tsx` — nuova colonna "Gruppi Promo" (nuovo componente `GruppiPromoPanel`, mirror di `PercorsiPanel`), nuovo campo editabile `prezzo_promo` accanto a `prezzo_vendita`. `app/area-lavoro/listini/page.tsx` — query aggiuntiva per caricare `gruppiPromoPerListino: Record<number, GruppoPromo[]>` da passare al client, stesso schema di `percorsiPerListino`.
- `lib/nav-config.ts` — nuova entry in `standalonePages` ("Promozioni", tra Shop On Line id 41 e Cataloghi id 38). Nessuna voce nuova in `internalPages` (niente pagina admin dedicata).
- `app/promozioni/page.tsx` — **nuovo**, hub pubblico: lista `promo_gruppi` attivi (card, stile simile a `EcommerceHub`/`components/ecommerce-hub.tsx`).
- `app/promozioni/[gruppo]/page.tsx` — **nuovo**, risolve il gruppo per slug, lista i suoi articoli (join `promo_gruppi_articoli` → `listini`), card con prezzo normale barrato + prezzo promo quando presente, link a `/shop/arredi/[id]` per il dettaglio.
- `lib/ecommerce.ts` / `ArticoloEcommerce` — aggiungere `prezzo_promo` al tipo e alle query di `app/shop/[macro]/page.tsx` e `app/shop/[macro]/[id]/page.tsx`.
- `components/ecommerce-shop.tsx` — `PrezzoAmazon` (righe 13-28) aggiornato per mostrare prezzo barrato + prezzo promo quando `prezzo_promo` è impostato e diverso da `prezzo_vendita`, altrimenti invariato (comportamento attuale).

Stato: **pronto, in attesa del tuo via libera per iniziare a scrivere codice.**
