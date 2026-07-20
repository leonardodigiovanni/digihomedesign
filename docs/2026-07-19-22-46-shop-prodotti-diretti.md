# Shop prodotti diretti — vetrina "tipo Amazon"

**Stato**: scartato — l'utente non vuole toccare le pagine vetrina esistenti (dropdown + form acquisto restano com'è). Sostituito da `docs/2026-07-19-22-50-ecommerce-test-standalone.md`.
**Data**: 2026-07-19

---

## Contesto

Il sito vende già prodotti "diretti" tramite il flag `acquistabile=1` nella tabella `listini` (es. categoria Quadri, sotto Arredi). Il pagamento è già completo e funzionante: carrello → `/area-clienti/carrello-acquisti/pagamento` → Stripe Checkout → webhook → ordine `paid` (vedi `docs/2026-04-30-10-00-stripe-checkout.md`). Non tocchiamo questa parte.

Quello che manca è l'esperienza di **navigazione e scelta del prodotto**: oggi, in ognuna delle 50 pagine vetrina (es. `app/arredi/quadri/page.tsx`), gli articoli acquistabili compaiono come un semplice **menu a tendina testuale** in fondo alla pagina (`components/aggiungi-articolo-acquisto-form.tsx`) — nessuna foto in elenco, nessuna scelta di colore, nessuna sensazione di "negozio".

Obiettivo: far sembrare quella sezione uno shop vero — griglia di prodotti con foto e prezzo, click per scegliere eventuali opzioni (colore/misure), aggiungi al carrello — riusando tutta l'infrastruttura di carrello/pagamento già esistente.

**Fuori scope per ora** (rimandato a una fase successiva, da definire quando serve): spese di spedizione come voce a parte nel pagamento, indirizzo di consegna dedicato, pagina di dettaglio prodotto con URL propria.

---

## Cosa cambia

### 1. `components/aggiungi-articolo-acquisto-form.tsx` (componente condiviso, un solo file)
Oggi: dropdown "Articolo" + bottone "+ Aggiungi ad acquisti" → step "detail" con campi quantità/misure.

Nuovo: griglia di card cliccabili (foto da `foto_url`, placeholder se assente, descrizione, produttore, prezzo) al posto del dropdown. Click su una card apre lo stesso step "detail" già esistente (quantità/misure adattive per unità pz/kg/t/ml/mq — logica invariata), con l'aggiunta di un campo **Colore** (testo libero, stesso pattern già usato nel form preventivi) mostrato solo se l'articolo ha `richiede_tipo_colore=1`.

Il componente resta client-side, stessa server action `aggiungiAlCarrelloAcquisti` (nessuna modifica lì): il valore colore verrà passato come campo `colore` nel FormData, già supportato dal cart cookie (`lib/cart-cookie.ts` ha già il campo `colore` in `CartItem`).

### 2. Tipo `ArticoloListinoAcquisto`
Aggiungo `foto_url: string | null` e `richiede_tipo_colore: boolean` ai campi già esistenti (`id, descrizione, produttore, serie, unita, prezzo_vendita, max_acquistabile`).

### 3. Query SQL nelle 50 pagine vetrina
Ogni pagina (es. `app/arredi/quadri/page.tsx:53-59`) ha una query quasi identica:
```sql
SELECT id, descrizione, produttore, serie, unita, prezzo_vendita, max_acquistabile
FROM listini WHERE disponibile = 1 AND acquistabile = 1 AND id IN (...)
```
Aggiungo `foto_url, richiede_tipo_colore` alla SELECT in tutte le 50 occorrenze (modifica meccanica, stesso pattern ovunque). Elenco file: tutte le pagine sotto `app/serramenti/`, `app/metallurgia/`, `app/legno/`, `app/tessuti/`, `app/arredi/` che includono `AggiungiArticoloAcquistoForm` (50 file trovati), più `app/brand/cataloghi/[slug]/page.tsx` e `app/app/cataloghi/[slug]/page.tsx` se usano lo stesso pattern.

### 4. `aggiungiAlCarrelloAcquisti` (`app/brand/cataloghi/actions.ts`)
Verifico che accetti già il campo `colore` dal FormData e lo scriva nel cart item (probabile, dato che il cart cookie lo supporta già per altri flussi) — se manca, aggiungo la lettura del campo, nessun'altra modifica.

---

## Cosa NON cambia
- Carrello (`carrello-acquisti-client.tsx`), pagina pagamento, Stripe checkout, webhook: invariati.
- Nessuna nuova tabella DB, nessuna nuova pagina/route.
- Nessuna gestione spedizione (resta com'è oggi: solo prodotto).

---

## Passi di implementazione
1. Aggiornare tipo `ArticoloListinoAcquisto` + query in tutte le pagine vetrina (foto_url, richiede_tipo_colore).
2. Riscrivere `aggiungi-articolo-acquisto-form.tsx`: griglia card al posto del dropdown, campo colore condizionale nello step detail.
3. Verificare/aggiornare `aggiungiAlCarrelloAcquisti` per il campo colore.
4. Test manuale su `/arredi/quadri` con almeno un articolo `acquistabile=1` (con e senza `richiede_tipo_colore`), verifica che finisca nel carrello con colore corretto e che il pagamento Stripe funzioni come prima.
