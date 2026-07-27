# Carrello computometrico: uso anonimo + vista "a carrello" dei salvati

Stato: completato

## Obiettivo

Due richieste, uniformare `/area-clienti/carrello-computometrico` agli altri due carrelli (carrello-preventivo, carrello-acquisti):

1. Non deve richiedere login per essere usato — solo per salvare (come gli altri due). Oggi invece la pagina fa `redirect('/login')` se non sei loggato, per questo "sparisce" al logout: non è un problema di dati persi (restano nel DB, tornano riloggando con lo stesso utente), è che la pagina stessa ti caccia via.
2. I computometrici già salvati (qualsiasi stato, non solo bozza) devono essere visualizzati con lo stesso stile "a carrello" (ambienti→voci raggruppati) invece della tabella piatta attuale — anche se non più modificabili.

## Perché serve un cambio di storage (non solo togliere il redirect)

Gli altri due carrelli vivono in un cookie (`digi_cart`/`digi_cart_acquisti`, `lib/cart-cookie.ts`), indipendente dal login. Il carrello computometrico invece vive nella tabella `computometrici_carrello`, indicizzata per `username` — senza login non esiste nessuna riga a cui appoggiarsi. Per funzionare da anonimo deve diventare anch'esso un cookie.

## Soluzione

### 1. Nuovo cookie `digi_cart_computo`
- Nuovo file `lib/computo-cart-cookie.ts`: tipo `ComputoCartItem` (stesso contenuto di `RigaCarrello` oggi in DB: uid, parentUid, listino_id, categoria, produttore, serie, descrizione, unita, quantita, misure, base_calcolo, colore, note, prezzo_unitario, totale_riga) + `compressComputoCart`/`decompressComputoCart` (chiavi corte come già fa `cart-cookie.ts`, per stare sotto il limite dei 4KB).
- `app/area-clienti/carrello-computometrico/actions.ts`: `addRigaCarrello`, `addRigheCarrello`, `removeRigaCarrello`, `updateRigaCarrello`, `clearCarrelloComputometrico` riscritte per leggere/scrivere il cookie invece della tabella DB (stessa firma, cambia solo l'interno — nessuna modifica al componente client). Gli `uid` non sono più id autoincrementali DB ma generati lato server al momento dell'inserimento (timestamp + contatore per gli inserimenti multipli nello stesso batch).
- `app/area-clienti/carrello-computometrico/page.tsx`: tolto il redirect a `/login`; `getCarrelloRighe()` legge dal cookie. Il controllo permessi già esistente (`rolePermissions['cliente']` per la pagina 54) resta invariato e copre automaticamente sia gli anonimi che i clienti loggati, essendo già la stessa identica condizione.
- `salvaComputometrico` e `riprendiComputometrico` restano gate-ate su login (richiedono un `username` per essere associate a un cliente/creato_da) — coerente: puoi costruire il computo da anonimo, ma per salvarlo o riprendere un salvato devi accedere (stessa UX già presente: bottone "Accedi per salvare" quando non loggato).
- La vecchia tabella `computometrici_carrello` resta nel DB (non la cancelliamo), semplicemente non viene più letta/scritta dal carrello live. Eventuali carrelli in corso proprio ora andranno reinseriti manualmente (nessuna migrazione automatica, sito in sviluppo).

### 2. Vista "a carrello" per i computometrici salvati
- `app/area-clienti/computometrici/[id]/page.tsx`: le righe vengono raggruppate per `parent_id` (ambiente → voci figlie) invece di essere mostrate come lista piatta, con lo stesso stile a tabelle-per-gruppo del carrello live (`carrello-client.tsx`), tutto sempre visibile (niente espandi/comprimi, è una vista di consultazione/stampa).
- Allineamento alla regola già esistente nel wizard: il prezzo per riga si vede solo se `isStaff` (oggi nella vista salvata il prezzo per riga era visibile a chiunque, incoerente con la stessa regola già applicata nel carrello live) — resta sempre visibile il totale finale.

## Cosa NON cambia
- Il meccanismo di calcolo prezzi (`calcolaTotale`/`base_calcolo`), il salvataggio (`salvaComputometrico`) e la tabella admin `/clienti/computometrici` restano come sono, solo la sorgente dati del carrello live cambia da DB a cookie.

## Riepilogo implementazione

Fatto come pianificato, più il bottone "Svuota carrello" mancante:

- **Svuota carrello**: bottone in `carrello-client.tsx` (stesso pattern "Svuota carrello" di preventivo/acquisti), chiama `clearCarrelloComputometrico()` (già esistente, prima usata solo internamente dopo il salvataggio).
- **`lib/computo-cart-cookie.ts`** (nuovo): `ComputoCartItem`, `compressComputoCart`/`decompressComputoCart` (chiavi corte), `COMPUTO_CART_COOKIE = 'digi_cart_computo'`.
- **`app/area-clienti/carrello-computometrico/actions.ts`**: `addRigaCarrello`, `addRigheCarrello`, `removeRigaCarrello`, `updateRigaCarrello`, `clearCarrelloComputometrico` riscritte per leggere/scrivere il cookie invece della tabella `computometrici_carrello` (rimossa `ensureCarrelloTable`, non più usata). `uid` generati lato server da `Date.now()` + offset invece di autoincrement DB. `riprendiComputometrico` scrive le righe riprese nel cookie invece che nella vecchia tabella.
- **`app/area-clienti/carrello-computometrico/page.tsx`**: rimosso il redirect a `/login`; il carrello iniziale viene letto dal cookie. Il controllo dei permessi pagina (già esistente, basato su `rolePermissions['cliente']`) copre automaticamente sia gli anonimi che i clienti loggati senza modifiche.
- **`app/area-clienti/computometrici/[id]/page.tsx`**: righe raggruppate per ambiente (radice + voci figlie, stesso raggruppamento categoria/produttore/serie del carrello live), sempre espanse; prezzo per riga visibile solo se `isStaff` (allineato alla stessa regola già in vigore nel carrello live — prima era visibile a chiunque, incoerenza corretta); il totale finale resta sempre visibile.
- La vecchia tabella DB `computometrici_carrello` non viene toccata/cancellata, semplicemente non è più letta né scritta.

`npx tsc --noEmit` pulito. `npx eslint` sui file toccati: un errore `no-html-link-for-pages` e un warning `no-unused-expressions`, entrambi pre-esistenti e non toccati da questa modifica (verificati con `git diff`).

Non testato in browser (nessun accesso a Chrome/screenshot in questa sessione) — da verificare manualmente: aggiungere un ambiente da anonimo, disconnettersi/riconnettersi, svuotare il carrello, salvare e riprendere un computo.
