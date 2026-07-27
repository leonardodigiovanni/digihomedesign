# Wizard "computometrico ristrutturazione": ambienti + voci a crocette

Stato: completato

## Obiettivo

Estendere `/area-clienti/carrello-computometrico` (oggi vuoto e single-select) perché un cliente possa, senza assistenza, costruire un preventivo di massima di una ristrutturazione: aggiungere ambienti uno alla volta, per ognuno crocettare le lavorazioni da fare, e alla fine ottenere **un solo numero totale** — senza mai vedere i prezzi delle singole voci. Lo stesso strumento, usato da un dipendente, mostra invece ogni riga col suo prezzo e permette di correggerlo a mano.

**Non è un sistema nuovo**: si appoggia sul meccanismo principale/secondario già esistente nel computometrico (corretto in questa stessa sessione), lo estende con selezione multipla e visibilità prezzi per ruolo.

## Situazione attuale (verificata leggendo il codice)

- `listini` con `computabile=1`: `principale=1` = ambiente, `principale=0` = voce di lavorazione, ciascuna con `prezzo_vendita` e `unita` (mq/pz/ml/kg/t).
- "+Ambiente" (bottone verde) → pool `principale=1`. "+" su riga espansa (bottone rosa) → pool `principale=0`. Filtro oggi: solo per `principale`, nessun match categoria/sottocategoria ambiente↔voce.
- Selezione sempre **singola** (`AggiungiArticoloForm`, step select→detail→submit), mostra sempre il prezzo.
- Salvataggio in tabella propria `computometrici_carrello` (snapshot: descrizione, prezzo_unitario, totale_riga — non dipende più da `listini` una volta salvata).
- `percorsiPerListino` (coppie categoria/sottocategoria) già caricato in `page.tsx` e passato al client, ma non ancora usato per abbinare voci ad ambienti.
- Il matching "sottocategoria vuota = jolly, sottocategoria piena = match esatto" esiste già come funzione `matchesPercorsi`, ma **duplicata** in due file (`carrello-preventivo/carrello-client.tsx` e `clienti/preventivi/[id]/preventivo-client.tsx`) — nessuna versione condivisa in `lib/`.

## Decisioni prese in discussione

1. **Percorsi ambiente**: ogni ambiente (principale) ha percorso `categoria="ambiente", sottocategoria=<tipo stanza>` (es. `bagno`, `camera-da-letto`, `salone`). Ogni voce (secondario) ha percorso `categoria="ambiente"` e:
   - `sottocategoria=""` → voce universale, proposta per qualunque ambiente (es. tinteggiatura pareti).
   - `sottocategoria="bagno"` → voce specifica, proposta solo per ambienti di quel tipo (es. sostituzione sanitari).
   Stessa identica regola già implementata in `matchesPercorsi`, riusata as-is.
2. **Spazi esterni** non è un meccanismo a parte: è un'altra sottocategoria ambiente (`giardino`, `terrazza`, `balcone`...) con le sue voci specifiche. Stesso flusso "+Ambiente" → "+Voce".
3. **Differenziazione prezzo per "classe" immobile** (rendita catastale, quartiere, ecc.): **scartata**. La differenza di prezzo passa dal catalogo (voci/marche diverse per la stessa lavorazione, es. "pavimentazione piastrelle A" €50/mq vs "pavimentazione piastrelle B" €200/mq), scelta dal cliente stesso crocettando; eventuali aggiustamenti caso per caso restano a discrezione del dipendente (punto 6).
4. **Ereditarietà misure dal padre**: una voce a `unita=mq` sotto un ambiente eredita automaticamente larghezza/altezza (quindi i mq) dall'ambiente padre — non le richiede di nuovo. Stesso precedente parziale già presente in `carrello-preventivo` (eredità per `richiede_tipo_vetro`), da generalizzare. Voci `unita=pz` "a forfait" (es. passaggio cavi) restano quantità fissa 1, nessuna misura richiesta.
5. **Selezione voci = ibrido crocette + applica-a-tutti**: il bottone "+Voce" apre una lista/ricerca con **checkbox multiple** (non singola come oggi); un bottone "Applica" inserisce tutte le voci spuntate nell'ambiente corrente in un colpo solo; un secondo bottone "Applica a tutti gli ambienti" ripete la stessa selezione multipla su ogni ambiente esistente **compatibile** (una voce con sottocategoria specifica viene saltata sugli ambienti di tipo diverso, senza errore).
6. **Prezzi per ruolo**: `cliente` non vede mai un prezzo per riga, solo il totale finale dopo "Salva". `admin`/`dipendente` vedono ogni riga col proprio prezzo e possono **modificarlo** per quel computo specifico (il campo `prezzo_unitario` esiste già in `computometrici_carrello` come snapshot per riga — diventa editabile invece che sola-lettura per lo staff, ricalcolando `totale_riga` di conseguenza; nessuna nuova colonna DB necessaria).
7. **Dati generali casa** (mq totali, piani, condominio/villa): opzionali, solo per l'intestazione del preventivo salvato — estensione del campo "Descrizione stima" già esistente, non uno step bloccante prima di poter aggiungere ambienti.

## Modifiche previste (per quando si passerà al codice)

### `lib/percorsi-match.ts` (o nuovo file condiviso)
Estrarre `matchesPercorsi` dalla sua attuale duplicazione (`carrello-preventivo`/`clienti/preventivi/[id]`) in una funzione condivisa, cosi il computometrico la importa invece di duplicarla una terza volta.

### `app/area-clienti/carrello-computometrico/page.tsx`
Nessuna modifica alla query principale (già seleziona `principale`, `percorsiPerListino` già presente) — verificare solo che `categoria`/`sottocategoria` risolte lato SQL corrispondano alla convenzione `ambiente/<tipo-stanza>` una volta popolato il catalogo.

### `app/area-clienti/carrello-computometrico/carrello-client.tsx`
- Nuovo componente modale multi-select con checkbox (sostituisce l'uso di `AggiungiArticoloForm` per il pool `principale=0`; `AggiungiArticoloForm` resta invariato e usato altrove per la selezione singola dell'ambiente).
- Filtro voci-per-ambiente tramite `matchesPercorsi` (categoria/sottocategoria del padre vs voce).
- "Applica" (ambiente corrente) e "Applica a tutti gli ambienti" (ciclo su tutti gli ambienti compatibili).
- Ereditarietà larghezza/altezza dal padre quando si applicano voci a `unita=mq`.
- Vista prezzi condizionata al ruolo (prop `isStaff`, già disponibile lato server da `page.tsx`): riga con prezzo + input editabile se staff, nessun prezzo per riga se cliente — solo il totale finale sempre visibile a entrambi.

### `app/area-clienti/carrello-computometrico/actions.ts`
- `addRigaCarrello` esteso per accettare più righe in un colpo solo (batch, per "Applica"/"Applica a tutti") invece di una chiamata per voce.
- Nuova azione (o estensione di editing esistente) per permettere allo staff di sovrascrivere `prezzo_unitario` di una riga già salvata, ricalcolando `totale_riga`.

### Catalogo (lavoro dati, non codice)
Popolare `listini` (via pannello admin già esistente) con:
- Ambienti (`principale=1`, `computabile=1`) con percorso `ambiente/<tipo-stanza>`.
- Voci di lavorazione (`principale=0`, `computabile=1`) con prezzo €/mq o forfait, percorso `ambiente/` (vuoto = universale) o `ambiente/<tipo-stanza>` (specifica).

## Cosa NON cambia

- Il meccanismo di base principale/secondario, il salvataggio come snapshot in `computometrici_carrello`, e tutto il resto del sito restano come sono — nessuna cancellazione, solo aggiunte sopra quanto già esiste.
- `AggiungiArticoloForm` (selezione singola con dettaglio misure) resta lo strumento per scegliere l'ambiente; cambia solo lo strumento per le voci secondarie.

Confermi che proceda con questa struttura quando deciderai di passare al codice?

## Riepilogo implementazione

Fatto esattamente come pianificato:

- `lib/percorsi-match.ts`: aggiunta `matchesPercorsi` (estratta dalla duplicazione in `carrello-preventivo/carrello-client.tsx` e `clienti/preventivi/[id]/preventivo-client.tsx`, che ora la importano da qui invece di ridefinirla).
- `app/area-clienti/carrello-computometrico/carrello-client.tsx`:
  - Nuovo tipo di modale `voci` (checkbox multiple, ricerca testuale, sostituisce l'uso di `AggiungiArticoloForm` per le voci secondarie — `AggiungiArticoloForm` resta usato solo per scegliere l'ambiente).
  - Pool voci filtrato con `matchesPercorsi(voce, ambiente)`.
  - Bottoni "Applica" (ambiente corrente) e "Applica a tutti gli ambienti" (comparso solo se esiste più di un ambiente; una voce incompatibile con un ambiente viene saltata silenziosamente).
  - Ereditarietà larghezza/altezza dall'ambiente padre per voci `m²`/`ml`, quantità fissa 1 per le altre.
  - Prezzi nascosti per `cliente` (per riga, in tabella e nella modale voci), sempre visibili e modificabili per `admin`/`dipendente` (prop `isStaff`, calcolata in `page.tsx`); il totale finale resta sempre visibile a entrambi.
  - Modale "Modifica articolo" estesa con campo quantità (tutti) e prezzo unitario (solo staff), ricalcola il totale riga al salvataggio.
- `app/area-clienti/carrello-computometrico/actions.ts`: nuova `addRigheCarrello` (batch insert), `updateNoteCarrello` generalizzata in `updateRigaCarrello` (note/quantità/prezzo/totale).
- `app/area-clienti/carrello-computometrico/page.tsx`: passa `isStaff` (già calcolato) al client.

Non incluso in questo giro (lavoro dati, non codice): popolare `listini` con gli ambienti e le voci di lavorazione vere, con i percorsi `ambiente/<tipo-stanza>` — senza questi dati il flusso è pronto ma la modale voci risulterà vuota finché non si crea almeno un ambiente e delle voci `computabile=1, principale=0` con percorso coerente.

`npx tsc --noEmit` e `npx eslint` puliti su tutti i file toccati (solo errori preesistenti e non correlati rimangono, verificati riga per riga).
