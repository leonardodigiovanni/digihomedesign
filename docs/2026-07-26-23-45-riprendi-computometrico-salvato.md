# Riprendi in carrello un computometrico salvato (come i preventivi)

Stato: completato

## Obiettivo

Il cliente titolare di un computometrico salvato (o lo staff) deve poter riaprirlo e continuare a modificarlo, come già avviene per i preventivi.

## Perché oggi non si può (root cause)

- **Preventivi**: `/area-clienti/preventivi/[id]` monta lo stesso componente interattivo usato dallo staff (`PreventivoClient`), e le azioni di modifica sono autorizzate anche per il cliente proprietario. Il preventivo salvato **è già** l'oggetto editabile, non serve "ricaricarlo" da nessuna parte.
- **Computometrici**: `/area-clienti/computometrici/[id]` è solo una vista di sola lettura, nessuna azione di modifica esiste su `computometrico_articoli`. In più, `handleSalva()` nel carrello scrive righe **appiattite** (`listino_id, categoria, descrizione, unita, quantita, prezzo_unitario, totale_riga, note`): perde `parent_id` (gerarchia ambiente→voce) e le misure (`larghezza_cm/altezza_cm/altezza3d_cm/base_calcolo`). Oggi quindi l'informazione per ricostruire lo stato del wizard non esiste più una volta salvato.

## Soluzione

1. **Non appiattire più al salvataggio**: `computometrico_articoli` guadagna le colonne che oggi mancano (`parent_id`, `produttore`, `serie`, `larghezza_cm`, `altezza_cm`, `altezza3d_cm`, `base_calcolo`, `colore`), popolate da `salvaComputometrico` con un inserimento a due passate (prima le righe padre per ottenere il nuovo id, poi le righe figlie con `parent_id` rimappato) — stesso pattern già usato per clonare i preventivi.
2. **Azione "Riprendi in carrello"** (`riprendiComputometrico`, in `app/area-clienti/carrello-computometrico/actions.ts` accanto a `salvaComputometrico`/`clearCarrelloComputometrico`):
   - Consentita solo se il computometrico è in stato **bozza** (non ha senso riprendere un computo già calcolato/archiviato).
   - Autorizzata per il cliente titolare (stessa verifica proprietà già usata in `/area-clienti/computometrici/[id]/page.tsx`) o per lo staff.
   - Svuota il carrello corrente dell'utente (con conferma lato client, per non perdere un lavoro in corso non salvato), ricopia le righe salvate in `computometrici_carrello` (due passate per rimappare `parent_id`), poi **cancella** il computometrico originale (`computometrici` + `computometrico_articoli`) — è una ripresa, non un duplicato.
   - Redirect a `/area-clienti/carrello-computometrico` per continuare con lo stesso wizard a crocette.
3. **Bottone "Riprendi in carrello"** in `/area-clienti/computometrici/[id]`, visibile solo se stato bozza e (proprietario o staff).

## Nota sull'associazione cliente per lo staff

Se lo staff riprende un computometrico di un cliente, il carrello va nella sessione dello staff: al nuovo salvataggio il `cliente_id` verrà risolto sullo staff stesso (probabilmente nessuno). Non aggiungiamo un meccanismo di "cliente_id override" nel carrello per questo — dopo il salvataggio lo staff può semplicemente riassegnare il cliente corretto con il selettore già presente in `/clienti/computometrici` (feature appena aggiunta). Nessuna perdita di dati, solo un click in più.

## File coinvolti

- `app/area-clienti/carrello-computometrico/actions.ts`: schema `computometrico_articoli` esteso; `RigaComputometrico` esteso; `salvaComputometrico` riscritta a due passate; nuova `riprendiComputometrico`.
- `app/area-clienti/carrello-computometrico/carrello-client.tsx`: `handleSalva()` invia la riga completa (non più appiattita).
- `app/area-clienti/computometrici/[id]/page.tsx`: calcola `canResume`, passa i dati al nuovo bottone.
- `app/area-clienti/computometrici/[id]/riprendi-btn.tsx` (nuovo): client component con conferma + redirect.

## Riepilogo implementazione

Fatto esattamente come pianificato:

- `computometrico_articoli`: aggiunte (self-healing) `parent_id`, `produttore`, `serie`, `larghezza_cm`, `altezza_cm`, `altezza3d_cm`, `base_calcolo`, `colore`.
- `RigaComputometrico` esteso con `uid`/`parentUid` e tutti i nuovi campi; `salvaComputometrico` riscritta a due passate (padri prima, poi figli con `parent_id` rimappato tramite una `Map` da vecchio uid a nuovo id) — stesso pattern usato per il clone dei preventivi.
- `carrello-client.tsx`: `handleSalva()` invia la riga completa invece di appiattirla.
- Nuova `riprendiComputometrico(id)`: consentita solo se stato bozza, autorizzata per il cliente titolare o lo staff (stesso controllo proprietà della pagina di dettaglio); svuota il carrello corrente, ricopia le righe salvate in `computometrici_carrello` (due passate per rimappare `parent_id`), poi cancella il computometrico originale.
- `/area-clienti/computometrici/[id]/page.tsx`: calcola `canResume`, mostra `produttore — descrizione` in tabella (ripristina il prefisso perso appiattendo in passato), monta `<RiprendiBtn>` quando applicabile.
- Nuovo `riprendi-btn.tsx`: conferma (avvisa che sovrascrive un carrello in corso), chiama l'azione, poi redirect a `/area-clienti/carrello-computometrico`.

Come discusso, nessun meccanismo di "cliente_id override" per lo staff: se lo staff riprende un computo di un cliente e lo risalva, può riassegnare il cliente corretto con il selettore già presente in `/clienti/computometrici`.

`npx tsc --noEmit` pulito. `npx eslint` sui file toccati: un errore `no-html-link-for-pages` e un warning `no-unused-expressions` risultano entrambi pre-esistenti (verificati con `git diff`, righe non toccate da questa modifica).
