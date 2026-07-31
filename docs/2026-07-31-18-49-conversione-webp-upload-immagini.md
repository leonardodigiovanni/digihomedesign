# Conversione automatica in WebP degli upload immagine

**Data:** 2026-07-31
**Stato:** completato

## Riepilogo implementazione

- `lib/image-convert.ts` (nuovo): `isConvertibleImageExt(ext)` (jpg/jpeg/png/webp, esclude gif), `toWebpFile(file, opts?)` — legge il file via stream (mai `arrayBuffer()`, tronca i binari in questa versione di Next.js), lo passa a `sharp` con resize `fit:'inside'` (max 2000px, `withoutEnlargement`) e ricodifica in WebP qualità 82.
- `app/api/categoria-immagini/route.ts`, `app/api/listini/foto/route.ts`, `app/api/listini/transito/route.ts`: prima dell'upload su Vercel Blob, se l'estensione è convertibile passano il file per `toWebpFile()` e caricano `.webp` invece dell'originale.
- GIF esclusi (animazioni, non convertibili senza perdere i frame).

## Obiettivo

Qualsiasi immagine nuova caricata su Blob (paste da clipboard, "Carica" da file locale, casella di transito) viene compressa una volta sola lato server prima del salvataggio, invece di affidarsi a `next/image` che alleggerisce solo in fase di richiesta lasciando comunque l'originale pesante su storage.

## Nessun impatto su

- Scelta di un'immagine già esistente (blob picker "Scegli da Blob"/"da file locali", drag&drop cella→cella, casella di transito trascinata su altra riga): questi percorsi riusano un URL già presente in DB, nessun nuovo upload, nessuna conversione — l'immagine resta identica all'originale già caricato in precedenza.
- Cancellazione dei blob vecchi: invariata per ciascuna route (vedi codice esistente).
