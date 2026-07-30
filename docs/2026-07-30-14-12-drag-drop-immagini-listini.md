# Drag & Drop immagini tra caselle listino

**Data:** 2026-07-30
**Stato:** completato

## Riepilogo implementazione

- `app/area-lavoro/listini/actions.ts`: aggiunta `colonnaImmagine(tipo)` (helper whitelist colonna) e `copiaImmagine(sourceId, sourceTipo, destId, destTipo)` — legge l'URL dalla colonna sorgente e lo scrive (INSERT/UPDATE) nella colonna di destinazione, senza toccare la riga sorgente.
- `app/area-lavoro/listini/listini-client.tsx`: `ImgCell` ora è drag source (immagine `draggable` con `onDragStart` che serializza `{ artId, tipo }`) e drop target sempre attivo (evidenziazione bordo tratteggiato durante il drag-over, overlay di attesa durante il salvataggio). Al drop chiama `copiaImmagine` e poi `router.refresh()`.
- Nessuna modifica a `SchedaTecnicaModal`, al bottone "Scheda", all'upload manuale via file o al bottone "×" di rimozione.
- Type-check (`tsc --noEmit`) pulito.

## Obiettivo

In `/area-lavoro/listini`, la griglia ha 3 colonne immagine (Logo, Schema, Foto), ciascuna renderizzata da `ImgCell`. L'utente vuole trascinare col mouse un'immagine da una qualsiasi casella a una qualsiasi altra casella (anche di colonna diversa) e ottenere l'insert/update di quella stessa immagine (stesso URL) nella casella di arrivo.

Comportamento confermato dall'utente:
- **Copia**, non sposta: l'immagine resta nella casella di origine e viene anche impostata (insert se vuota, update/sovrascrittura se già presente) nella casella di destinazione.
- **Nessun vincolo di colonna**: si può trascinare foto→schema, schema→logo, logo→foto, ecc. — è sempre e solo la scrittura di un URL in un campo (`foto_url`/`schema_url`/`logo_url`), la destinazione decide quale colonna viene scritta in base a dove viene rilasciata.
- Vale su tutte e 3 le colonne (logo/schema/foto).
- Non tocca in alcun modo i metodi esistenti di apertura della "Scheda" (bottone/modale `SchedaTecnicaModal`) né l'upload manuale via file — è solo un'aggiunta.

## File coinvolti

### `app/area-lavoro/listini/actions.ts`
- Nuova funzione esportata `copiaImmagine(sourceId: number, sourceTipo: 'schema' | 'foto' | 'logo', destId: number, destTipo: 'schema' | 'foto' | 'logo'): Promise<MutResult>`:
  - `checkAccess()`
  - Se `sourceId === destId && sourceTipo === destTipo` → no-op, `{ ok: true }`
  - Mappa `sourceTipo`/`destTipo` → colonna (`schema_url` / `foto_url` / `logo_url`), stesso pattern di `clearImmagine`
  - `SELECT <colSource> FROM listini WHERE id=?` sulla sorgente; se NULL/assente → `{ ok:false, error: 'Immagine sorgente non trovata.' }`
  - `UPDATE listini SET <colDest>=? WHERE id=?` sulla destinazione (sovrascrive se già presente) — nessuna modifica alla riga sorgente
  - `revalidatePath('/area-lavoro/listini')`
  - Chiamata direttamente dal client (come già fa `addPercorsoListino` nel drag&drop dei percorsi), non tramite `useActionState`/FormData

### `app/area-lavoro/listini/listini-client.tsx`
- `ImgCell` (riga ~1008): diventa sia drag source che drop target, riceve anche `artId`/`tipo` già come props esistenti
  - **Drag source**: se `url` presente, il contenitore diventa `draggable`; `onDragStart` scrive in `dataTransfer` `{ artId, tipo: <tipo della cella sorgente> }` (JSON, chiave `immagine-listino`), `effectAllowed = 'copy'`
  - **Drop target**: sempre attivo (anche su casella vuota, per l'insert; anche su colonna diversa dalla sorgente)
    - `onDragOver` → `preventDefault()` + evidenzia (bordo tratteggiato/sfondo, stesso stile della drop zone di `PercorsiPanel`)
    - `onDrop` → legge il payload `{ artId: sourceArtId, tipo: sourceTipo }`; se `sourceArtId === artId && sourceTipo === tipo` (drop sulla stessa identica casella) ignora; altrimenti chiama `copiaImmagine(sourceArtId, sourceTipo, artId, tipo)` in `useTransition` (dove `tipo` è il tipo/colonna della cella di **arrivo**) e poi `router.refresh()`
  - Nuovo stato locale in `ImgCell`: `isDragOver`, `saving` (per feedback visivo durante il drop)
  - Nessuna modifica al bottone "×" di rimozione né alla logica di `escluso`

## Approccio tecnico

HTML5 Drag & Drop API con `dataTransfer`, stesso pattern già usato e collaudato in `PercorsiPanel` (doc `2026-07-02-10-00-drag-drop-percorsi-listini.md`). Nessuno stato globale, nessuna nuova tabella.

## Nessun impatto su

- Bottone/modale "Scheda" (`SchedaTecnicaModal`, apertura tramite `onScheda`) — resta invariato
- Upload manuale da file (`/api/...` usato per `foto`/`schema`/`logo`)
- Colonna `escluso`, badge ESCLUSO
- Altre pagine o moduli (preventivi, carrello, ecc.)

## Da confermare prima di scrivere codice

Attendo conferma esplicita su questo documento prima di procedere con l'implementazione, come da workflow del progetto.
