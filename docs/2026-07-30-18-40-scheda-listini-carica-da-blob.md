# Scheda tecnica Listini — "Carica da Blob" per Foto e Schema

**Data:** 2026-07-30
**Stato:** completato

## Riepilogo implementazione

`app/area-lavoro/listini/listini-client.tsx`: aggiunto `BlobPickerModal` (griglia thumbnail + occorrenze da `/api/blob/lista?prefix=listini/`), nuovo prop `onBlobClick` su `ImgUploadRow` con bottone "📂 Da Blob" accanto a "Scegli file…", nuovo stato `blobPickerFor` e `pickFromBlob()` in `SchedaTecnicaModal` (chiama `impostaImmagineUrl`, aggiorna preview). `tsc --noEmit` pulito.

## Obiettivo

Nella modale "Scheda tecnica" (`SchedaTecnicaModal`), righe Foto prodotto e Schema, oltre a "Scegli file…" (upload) e Ctrl+V, aggiungere un terzo modo: **"Da Blob"** — apre un elenco dei file già presenti su Vercel Blob sotto il prefisso `listini/` (stessa API `/api/blob/lista` già usata da `GestioneBlob`), con anteprima e conteggio occorrenze, click per selezionare. Nessun nuovo upload: si riusa `impostaImmagineUrl` (già esistente, creata per la casella di transito) per scrivere l'URL scelto in `foto_url`/`schema_url`.

## File coinvolti

### `app/area-lavoro/listini/listini-client.tsx`
- Nuovo componente `BlobPickerModal({ prefix, onSelect, onClose })`: overlay con griglia di miniature (fetch `/api/blob/lista?prefix=listini/`), ogni riquadro mostra thumbnail + nome + occorrenze (rosso se 0, come in `GestioneBlob`), click chiama `onSelect(url)`.
- `ImgUploadRow`: nuovo prop `onBlobClick: () => void`, nuovo bottone "📂 Da Blob" accanto a "Scegli file…".
- `SchedaTecnicaModal`: nuovo stato `blobPickerFor: 'foto' | 'schema' | null`; `pickFromBlob(url, tipo)` chiama `impostaImmagineUrl(art.id, tipo, url)` e aggiorna `preview`/`previewSchema` — stesso effetto immediato di `uploadFile`, senza upload. Renderizza `<BlobPickerModal>` quando `blobPickerFor` è valorizzato.

## Nessun impatto su

- Upload da file e Ctrl+V esistenti — restano invariati, è un terzo modo aggiuntivo
- Logo marca (già una selezione da lista fissa, non toccato)
- `GestioneBlob`, drag&drop tra caselle della griglia — invariati

## Da confermare prima di scrivere codice

Attendo conferma esplicita su questo documento prima di procedere con l'implementazione.
