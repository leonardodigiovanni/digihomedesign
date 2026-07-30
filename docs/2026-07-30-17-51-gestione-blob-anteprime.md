# Gestione Blob — anteprime nell'elenco

**Data:** 2026-07-30
**Stato:** completato

## Riepilogo implementazione

`components/gestione-blob.tsx`: nuovo componente locale `BlobThumb` (40×40) — `<img>` per jpg/jpeg/png/webp/gif, `<Document><Page pageNumber={1}></Document>` di `react-pdf` per i PDF (fallback icona 📄 se il rendering fallisce), icona 🎬 per video, 📦 per il resto. Inserito prima del nome file in ogni riga. `tsc --noEmit` pulito.

## Obiettivo

Nell'elenco di `components/gestione-blob.tsx` (montato in Listini, Cataloghi, Cantieri, Documenti Clienti, Marketing, Immagini categorie) ogni riga oggi mostra solo nome + occorrenze + link "Apri". Aggiungere una piccola anteprima (40×40) per riconoscere il file senza doverlo aprire uno a uno:
- **Immagini** (jpg/jpeg/png/webp/gif): thumbnail diretta.
- **PDF**: miniatura della prima pagina, con `react-pdf` (già dipendenza del progetto, usato in `app/brand/cataloghi/[slug]/catalogo-client.tsx` per lo stesso scopo — stesso pattern `<Document><Page pageNumber={1}></Document>`, worker caricato da CDN unpkg).
- **Altro** (video, ecc.): icona generica per estensione, nessun tentativo di estrarre un frame (fuori scope).

## File coinvolti

### `components/gestione-blob.tsx`
- Import `Document, Page, pdfjs` da `react-pdf` + set `pdfjs.GlobalWorkerOptions.workerSrc` dal CDN (stesso codice di `catalogo-client.tsx`).
- Nuovo componente locale `BlobThumb({ url, nome })`: determina l'estensione dal nome file, rende `<img>` per le immagini, `<Document><Page pageNumber={1} width={40}></Document>` per i PDF (con fallback a icona 📄 se il rendering fallisce), icona 🎬/📦 per gli altri tipi.
- Inserito prima del nome file in ogni riga dell'elenco.

## Nessun impatto su

- Conteggio occorrenze, bottoni Apri/Elimina — invariati
- Le pagine che montano `GestioneBlob` — nessuna modifica, il componente resta drop-in

## Da confermare prima di scrivere codice

Attendo conferma esplicita su questo documento prima di procedere con l'implementazione.
