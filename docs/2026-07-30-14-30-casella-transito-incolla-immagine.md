# Casella di transito — incolla immagine (Ctrl+V) e trascinala nella griglia

**Data:** 2026-07-30
**Stato:** completato

## Riepilogo implementazione

- `app/api/listini/transito/route.ts` (nuovo): solo `POST`, riceve il file, valida formato/dimensione, upload su Vercel Blob (`listini/transito-<timestamp>.<ext>`), risponde `{ ok, url }`. Nessun DELETE.
- `app/area-lavoro/listini/actions.ts`: aggiunta `impostaImmagineUrl(destId, destTipo, url)`.
- `app/area-lavoro/listini/listini-client.tsx`:
  - `TransitoCtx` (context) + hook `useImmagineTransito()`: gestisce `previewUrl` (object URL, RAM) finché non c'è mai stato un drop; al primo `resolveUrl()` fa l'unico upload, mette in cache `uploadedUrl` e libera la RAM (`revokeObjectURL` + `fileRef` azzerato). Le chiamate successive a `resolveUrl()` ritornano subito la cache, zero rischio di upload ripetuti anche trascinando la stessa immagine su tutti gli articoli.
  - `ImmagineTransitoBox`: casella 90×60 accanto a "+ Nuovo articolo"/"+ Ripeti articolo", click per attivare + Ctrl+V, anteprima draggable, bottone "×" che svuota solo lo stato locale (mai un blob già creato/in uso).
  - `ImgCell.handleDrop`: riconosce payload `{ staging: true }` → chiama `resolveUrl()` dal context poi `impostaImmagineUrl`; payload `{ artId, tipo }` invariato (`copiaImmagine`, mai upload).
  - `TransitoCtx.Provider` avvolge la griglia (tabella), reso disponibile a tutte le `ImgCell`.
- `tsc --noEmit` e `npm run lint` puliti (nessun errore/warning nuovo introdotto).

## Obiettivo

In `/area-lavoro/listini` l'utente vuole una casellina "di transito", non legata a nessun articolo, dove:
1. Clicca sulla casella per attivarla
2. Preme Ctrl+V dopo aver copiato un'immagine (es. da un sito web, "copia immagine" del browser)
3. L'immagine resta **in RAM** (object URL locale, nessuna chiamata di rete) e viene mostrata come anteprima
4. Da lì può trascinarla (drag&drop già implementato) su una qualsiasi casella immagine (logo/schema/foto) di un articolo

## Comportamento upload (lazy, una sola volta)

- **Al paste**: nessun upload. Il file resta solo in memoria del browser (`URL.createObjectURL`).
- **Al primo trascinamento** su una casella reale: a quel punto (e solo a quel punto) il file viene caricato su Vercel Blob una volta sola; l'URL risultante viene messo in cache nel componente della casellina e usato per scrivere la colonna di destinazione.
- **Trascinamenti successivi** della stessa immagine "in transito" su altri articoli: riusano l'URL già in cache, **nessun nuovo upload** — anche trascinandola su 1000 articoli si crea **un solo blob**.
- **Trascinamenti tra caselle della griglia** (`ImgCell` → `ImgCell`, funzionalità già implementata in precedenza): restano sempre e solo copie di URL già presenti in DB (`copiaImmagine`), non toccano mai Blob.
- Dopo il primo upload, l'oggetto locale (object URL / File) viene rilasciato (`URL.revokeObjectURL` + riferimento al `File` azzerato) — la RAM viene liberata perché da quel momento si riusa l'URL persistito.
- **Nessun endpoint di cancellazione blob**: una volta creato, il blob può essere referenziato da N articoli diversi, quindi la casellina di transito non lo cancella mai. Il bottone "×" sulla casellina svuota solo lo stato locale (permette di incollarne una nuova), senza toccare eventuali blob già creati e già in uso da articoli.

## File coinvolti

### `app/api/listini/transito/route.ts` (nuovo)
- `POST` soltanto: accetta FormData con file `foto` (nessun `id` articolo), valida estensione/dimensione (stesse regole di `/api/listini/foto`: jpg/png/webp/gif, max 5MB), carica su Vercel Blob (`put('listini/transito-<timestamp>.<ext>', ...)`), risponde `{ ok: true, url }`. Non tocca il DB.
- Stesso controllo di accesso (`hasPageAccess(role, 25, settings)`) delle altre route di `/api/listini`.

### `app/area-lavoro/listini/actions.ts`
- Nuova funzione esportata `impostaImmagineUrl(destId: number, destTipo: string, url: string): Promise<MutResult>`: scrive direttamente l'URL passato nella colonna di destinazione (`UPDATE listini SET <col>=? WHERE id=?`). Riusa l'helper `colonnaImmagine` già introdotto per `copiaImmagine`.

### `app/area-lavoro/listini/listini-client.tsx`
- Nuovo hook `useImmagineTransito()`: gestisce `file` (in RAM), `previewUrl` (object URL), `uploadedUrl` (cache dopo il primo upload), `active` (casella cliccata/in ascolto), e `resolveUrl()` — funzione che restituisce l'URL da usare: se già in cache la ritorna subito, altrimenti fa l'upload una volta, salva in cache e libera la RAM.
- Nuovo componente presentazionale `ImmagineTransitoBox`: casella 90×60 "dashed", click per attivare, listener `document.addEventListener('paste', ...)` mentre attiva (stesso pattern già usato in `SchedaTecnicaModal`/`ImgUploadRow`), anteprima trascinabile (`draggable` + `onDragStart` scrive nel `dataTransfer` `{ staging: true }`, chiave `immagine-listino`), bottone "×" per svuotare lo stato locale.
- Nuovo `React.Context` (es. `TransitoCtx`) che espone `resolveUrl` ai componenti `ImgCell` sparsi nella griglia, evitando prop-drilling attraverso `RigaNormale`.
- Renderizzata accanto ai pulsanti "+ Nuovo articolo" / "+ Ripeti articolo" (riga toolbar sopra la griglia); il `Context.Provider` avvolge la tabella/griglia sottostante.
- `ImgCell.handleDrop`: esteso per riconoscere due forme di payload nello stesso campo `dataTransfer`:
  - `{ artId, tipo }` → comportamento attuale, chiama `copiaImmagine` (mai upload)
  - `{ staging: true }` → nuovo: chiama `resolveUrl()` dal context (upload solo se non già in cache) poi `impostaImmagineUrl(artId, tipo, url)`

## Nessun impatto su

- Drag&drop tra caselle già esistenti (`copiaImmagine`) — resta invariato
- `SchedaTecnicaModal`, upload manuale, bottone "×" di rimozione delle caselle esistenti
- Altre pagine/moduli

## Addendum 2026-07-30 — bottone "Carica" da file locale (completato)

Oltre a Ctrl+V, la casellina di transito ha un bottone "Carica…" con `<input type="file" accept="image/*">` nascosto: selezionando un file dal PC entra nello stesso stato RAM (`previewUrl`/`fileRef`) della clipboard — drag&drop e upload lazy al primo drop identici in entrambi i casi.

- `useImmagineTransito()`: estratta `setLocalFile(f: File)` condivisa tra il listener `paste` e il nuovo `onChange` dell'input file.
- `ImmagineTransitoBox`: aggiunto `<input type="file" ref={fileRef} hidden>` + bottone "Carica…" (`btn-gray`) accanto alla casella.
- `tsc --noEmit` pulito.
