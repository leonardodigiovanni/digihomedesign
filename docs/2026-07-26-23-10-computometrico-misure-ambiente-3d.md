# Computometrico: misure ambiente a 3 parametri (L, H2D, H3D) + base di calcolo voci

Stato: completato

## Obiettivo

Estendere il wizard computometrico (`docs/2026-07-26-21-47-wizard-computometrico-ristrutturazione.md`) perché un ambiente possa avere 3 misure invece di 2, e ogni voce di lavorazione possa dichiarare quale formula usare per calcolare la quantità dall'ambiente padre.

## Problema (emerso in discussione)

Gli articoli (infissi) sono bidimensionali: larghezza × altezza. Gli ambienti invece servono per due tipi di lavorazione diversi:
- lavorazioni sul **pavimento/soffitto**: serve L1 × L2 (superficie del pavimento)
- lavorazioni sulle **pareti**: serve perimetro × altezza soffitto = 2×(L1+L2) × H
- lavorazioni **perimetrali** (es. zoccolino): serve solo il perimetro = 2×(L1+L2)

Mancava quindi un terzo parametro (l'altezza del soffitto) e un modo per dire, voce per voce, quale delle tre formule applicare.

## Convenzione nomi (decisa con l'utente)

- **Larghezza** → L (campo esistente `larghezza_cm`, invariato)
- **Altezza** → rinominata in UI **Altezza 2D** → H2D (stesso campo esistente `altezza_cm`, invariato)
- **Altezza 3D** → H3D, nuovo campo `altezza3d_cm` — richiesto solo per gli ambienti (flag `richiede_altezza3d` sul listino), rappresenta l'altezza del soffitto.

I nomi L/H2D/H3D compaiono nella UI solo dove serve la distinzione (form di creazione ambiente quando `richiede_altezza3d=1`, e nel carrello computometrico); altrove (infissi, altri prodotti) restano "Larghezza"/"Altezza" come oggi — nessun impatto sul resto del sito.

## Base di calcolo delle voci

Nuovo campo su `listini`, **`base_calcolo`**, impostabile dall'admin in `/area-lavoro/listini` con un menu a tendina chiuso (non testo libero, per evitare di dover interpretare formule arbitrarie):
- *(vuoto)* → **diretta**: comportamento di oggi, usa `unita` (m²=L×H2D, ml=L, altrimenti quantità fissa). Usato dagli infissi e da voci non legate a un ambiente.
- **pavimento** → superficie = L × H2D (le due misure del pavimento dell'ambiente)
- **pareti** → superficie = 2×(L+H2D) × H3D
- **perimetro** → lunghezza = 2×(L+H2D)

Esempio dell'utente: voce "Zoccoletto", `unita=ml`, `base_calcolo=perimetro` → prezzo unitario × 2×(L+H2D).

## Modifiche

### DB (self-healing `ALTER TABLE ... ADD COLUMN` come da convenzione già in uso)
- `listini`: `richiede_altezza3d TINYINT(1) DEFAULT 0`, `base_calcolo VARCHAR(20) NULL`.
- `computometrici_carrello`: `altezza3d_cm DECIMAL(10,2) NULL`, `base_calcolo VARCHAR(20) NULL` (snapshot al momento dell'inserimento riga, come già avviene per categoria/unita/ecc.).

### `app/area-lavoro/listini/` (actions.ts + listini-client.tsx)
- `richiede_altezza3d`: stesso meccanismo toggle dei `richiede_*` esistenti (`COLONNE_BOOL_ALLOWED`, `RICHIEDE_FIELDS`, colonna in tabella).
- `base_calcolo`: nuova colonna con select nel form di aggiunta e nella riga di modifica inline (stesso pattern di `unita`), badge nella vista di sola lettura.
- `cloneArticolo`: porta dietro anche questi due nuovi campi (come già corretto per `computabile`).

### `app/area-clienti/carrello-computometrico/`
- `actions.ts`: `RigaCarrello` esteso con `altezza3d_cm`/`base_calcolo`; `addRigaCarrello`/`addRigheCarrello` li salvano.
- `page.tsx`: query `getArticoli()`/`getCarrelloRighe()` estese con le nuove colonne.
- `carrello-client.tsx`:
  - `ArticoloComputabile` esteso con `richiede_altezza3d`, `base_calcolo`.
  - `calcolaTotale`/`calcolaTotaleRiga` ramificano su `base_calcolo` (nuove formule pareti/perimetro) prima di ricadere sul comportamento diretto attuale.
  - `handleApplicaVoci` eredita dall'ambiente padre solo le misure effettivamente usate dalla formula della voce.
  - Form ambiente (`AggiungiArticoloForm`) mostra il terzo campo H3D quando `richiede_altezza3d=1`, con etichette L/H2D/H3D solo in quel caso.
  - Etichette misure in tabella (`L:`/`H2D:`/`H3D:`) invece del generico `L:`/`H:` attuale.

### `components/aggiungi-articolo-form.tsx` (condiviso da molte altre pagine)
- `ArticoloListino`/`ConfirmData` estesi con `richiede_altezza3d?`/`altezza3d?` — campo opzionale, di default `undefined`/`0` per tutte le altre pagine che usano questo componente: nessun impatto su infissi o altri prodotti.

## Cosa NON cambia
- Tutto il resto del wizard computometrico (percorsi ambiente/voce, selezione a crocette, prezzi per ruolo, salvataggio) resta come da `docs/2026-07-26-21-47-...`.
- Nessuna modifica alle pagine che usano `AggiungiArticoloForm` per prodotti non-ambiente.

## Riepilogo implementazione

Fatto esattamente come pianificato:

- **DB** (self-healing `ALTER TABLE ADD COLUMN` come da convenzione esistente, applicato sia in `area-lavoro/listini` che in `area-clienti/carrello-computometrico`, che duplicano le migrazioni come già avveniva prima):
  - `listini.richiede_altezza3d` (TINYINT), `listini.base_calcolo` (VARCHAR 20, NULL).
  - `computometrici_carrello.altezza3d_cm` (DECIMAL), `computometrici_carrello.base_calcolo` (VARCHAR 20).
- **`app/area-lavoro/listini/actions.ts`**: `base_calcolo` letto dal form e incluso in `addArticolo`/`updateArticolo`; `richiede_altezza3d` aggiunto a `COLONNE_BOOL_ALLOWED` (stesso toggle degli altri `richiede_*`); entrambi aggiunti a `cloneArticolo` (INSERT+SELECT) e a `updateMassivo` (`CAMPI_TESTO`/`TESTO_NULLABLE` per base_calcolo, `CAMPI_BOOL` per richiede_altezza3d).
- **`app/area-lavoro/listini/listini-client.tsx`**: nuova colonna `basecalc` (select con le 4 opzioni: diretta/pavimento/pareti/perimetro) nel form di aggiunta, riga di modifica inline, vista di sola lettura, filtro colonna e riga valori massivi; `richiede_altezza3d` aggiunto a `RICHIEDE_FIELDS` (genera automaticamente filtro e riga valori) più cella toggle e header dedicati nella tabella.
- **`app/area-lavoro/listini/page.tsx`**: stessa estensione di query/migrazione/mapping per popolare la tabella admin.
- **`app/area-clienti/carrello-computometrico/actions.ts`**: `RigaCarrello` esteso con `altezza3d_cm`/`base_calcolo`; `addRigaCarrello`/`addRigheCarrello` li salvano.
- **`app/area-clienti/carrello-computometrico/page.tsx`**: `getArticoli()`/`getCarrelloRighe()` estese con le nuove colonne (select + migrazioni + mapping).
- **`app/area-clienti/carrello-computometrico/carrello-client.tsx`**:
  - `ArticoloComputabile` esteso con `richiede_altezza3d`, `base_calcolo`.
  - Nuova `misuraAmbiente(basi, unita, l, h2d, h3d)`: pavimento → L×H2D, pareti → 2×(L+H2D)×H3D, perimetro → 2×(L+H2D), altrimenti comportamento diretto di sempre (m²=L×H2D, ml=L). Usata sia da `calcolaTotale` che da `calcolaTotaleRiga`.
  - Nuova `misureUsate(basi, unita)`: dice a `handleApplicaVoci` quali delle 3 misure dell'ambiente padre copiare sulla riga della voce (solo quelle usate dalla sua formula).
  - `handleConfirm` (creazione ambiente) salva anche `altezza3d_cm`/`base_calcolo`; `handleEditSave` passa `base_calcolo`/`altezza3d_cm` a `calcolaTotaleRiga`.
  - Etichette misure in tabella: `L:`/`H2D:`/`H3D:` invece del precedente `L:`/`H:`.
- **`components/aggiungi-articolo-form.tsx`** (condiviso da molte altre pagine, impatto nullo altrove): `richiede_altezza3d?`/`altezza3d?` aggiunti ai tipi; terzo campo "Altezza 3D (H3D, cm)" mostrato solo quando `richiede_altezza3d=1`; in quel caso soltanto, le etichette di larghezza/altezza diventano "Larghezza (L, cm)"/"Altezza 2D (H2D, cm)" — altrove restano invariate.

`npx tsc --noEmit` pulito. `npx eslint` sui file toccati: nessun nuovo errore/warning introdotto (i 2 errori "set-state-in-effect" e "artFiltrati accessed before declared" e i vari warning residui erano già presenti prima di questa modifica, verificati riga per riga con `git diff`).

Non incluso in questo giro (lavoro dati, non codice): impostare `base_calcolo`/`richiede_altezza3d` sulle voci/ambienti reali quando verranno inseriti in catalogo.
