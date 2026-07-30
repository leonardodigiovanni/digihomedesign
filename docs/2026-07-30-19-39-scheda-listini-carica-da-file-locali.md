# Scheda tecnica Listini — "Da file" (immagini legacy in public/listini)

**Data:** 2026-07-30
**Stato:** completato

## Riepilogo implementazione

- `scripts/generate-listini-file-locali.mjs` (nuovo): scansiona `public/listini/`, genera `lib/listini-file-locali.ts` (70 file trovati). Wired in `predev`/`prebuild` di `package.json` accanto al generatore loghi partner. Eseguito una volta per generare il file iniziale.
- `app/api/listini/file-locali/route.ts` (nuovo): stessa forma JSON di `/api/blob/lista`, occorrenze via `mappaOccorrenzeBlob('listini/')` riusata cosi' com'e'.
- `app/area-lavoro/listini/listini-client.tsx`: `BlobPickerModal` → `ImmaginePickerModal` (generico, prop `apiUrl`/`titolo`); `ImgUploadRow` con terzo bottone "📁 Da file"; `SchedaTecnicaModal` con nuovo stato `filePickerFor` e `pickFromBlob` rinominata `pickFromUrl` (riusata identica per entrambe le fonti); renderizza entrambi i picker.
- `tsc --noEmit` ed `eslint` sui file toccati: puliti (nessun errore/warning nuovo).

## Obiettivo

Terzo bottone nella Scheda tecnica (Foto/Schema), accanto a "Scegli file…" e "📂 Da Blob": **"📁 Da file"**, che apre una finestra **identica** al picker "Da Blob" (stesso componente, stesso layout: thumbnail + nome file + occorrenze, click per selezionare) ma con l'elenco delle immagini "vecchio stile" già presenti in `public/listini/` (committate in git, non su Vercel Blob — vedi la conversazione precedente: 70 file, referenziati da molti articoli esistenti). Mostrare il nome file è già previsto (come nel picker Blob) — utile perché l'utente sa già che ci saranno doppioni da individuare ed eliminare a mano in seguito.

Alla selezione, stesso comportamento del picker Blob: scrive l'URL scelto (qui un path relativo tipo `/listini/34-foto-1779604282187.png`) in `foto_url`/`schema_url` tramite `impostaImmagineUrl` — nessuna differenza di trattamento rispetto a un URL Blob, e resta trascinabile come tutte le altre caselle nella griglia principale (il drag&drop tra caselle non fa distinzioni sullo schema dell'URL, copia sempre e solo la stringa).

## Vincolo tecnico importante

`public/**` è **escluso dal bundle serverless su Vercel** — un `fs.readdirSync` fatto a runtime dentro una API route funzionerebbe in locale ma tornerebbe vuoto (o fallirebbe) in produzione. Il progetto ha già risolto lo stesso problema per `lib/loghi-partners.ts`: uno script (`scripts/generate-loghi-partners.mjs`) rigenera un file statico prima di ogni `dev`/`build` (`predev`/`prebuild` in `package.json`). Si replica lo stesso pattern per `public/listini/`.

## File coinvolti

### `scripts/generate-listini-file-locali.mjs` (nuovo)
- Scansiona `public/listini/`, filtra le estensioni immagine, genera `lib/listini-file-locali.ts` con `export const LISTINI_FILE_LOCALI: string[]` (path tipo `/listini/<file>`), stesso stile del generatore loghi partners.

### `package.json`
- Aggiunge lo script alla catena `predev`/`prebuild` (accanto a `generate-loghi-partners.mjs`).

### `app/api/listini/file-locali/route.ts` (nuovo)
- GET, stesso controllo accesso delle altre route `/api/listini`.
- Legge `LISTINI_FILE_LOCALI`, calcola le occorrenze riusando `mappaOccorrenzeBlob('listini/')` (la funzione raggruppa già i valori delle colonne `foto_url`/`schema_url`/`logo_url` indipendentemente dal fatto che siano URL Blob o path locali — nessuna modifica necessaria a `lib/blob-usage.ts`).
- Risponde con la **stessa forma JSON** di `/api/blob/lista` (`{ blobs: [{ url, nome, occorrenze }] }`), così il componente picker resta identico e riutilizzabile senza rami condizionali.

### `app/area-lavoro/listini/listini-client.tsx`
- `BlobPickerModal` generalizzato in `ImmaginePickerModal({ apiUrl, titolo, onSelect, onClose })` — stesso identico markup, ora riceve l'URL dell'API e il titolo da fuori invece di costruirli da un `prefix` fisso.
- `ImgUploadRow`: nuovo prop `onFileClick`, nuovo bottone "📁 Da file" accanto agli altri due (riga a 3 bottoni invece di 2).
- `SchedaTecnicaModal`: nuovo stato `filePickerFor: 'foto' | 'schema' | null`; `pickFromBlob` rinominata `pickFromUrl` (già scheme-agnostic, riusata identica per entrambe le fonti). Renderizza entrambi i picker (`ImmaginePickerModal` per Blob con `apiUrl="/api/blob/lista?prefix=listini/"`, e per i file locali con `apiUrl="/api/listini/file-locali"`).

## Nessun impatto su

- Upload da file, Ctrl+V, "Da Blob" — restano come sono, questo è un quarto/terzo modo aggiuntivo
- Drag&drop tra caselle della griglia principale — nessuna modifica, già scheme-agnostic
- Logo marca (lista fissa separata, non toccata)

## Da confermare prima di scrivere codice

Attendo conferma esplicita su questo documento prima di procedere con l'implementazione.
