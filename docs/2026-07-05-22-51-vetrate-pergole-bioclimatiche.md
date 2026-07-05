# Rinomina "Vetrine" → "Vetrate" + nuova sottocategoria "Pergole Bioclimatiche"

Stato: **completato**

## Riepilogo modifiche effettive

- `lib/nav-config.ts`, `app/serramenti/page.tsx`, `app/sitemap.ts` aggiornati.
- `app/serramenti/vetrine/page.tsx` → rinominata in `app/serramenti/vetrate/page.tsx` (testi, canonical, `fixedSottocat`, query DB).
- `app/serramenti/pergole-bioclimatiche/page.tsx` creata da zero, stesso pattern delle altre pagine categoria (DB al momento senza voci, come previsto — categoria nuova).
- `app/page.tsx`: card "Vetrate" e "Pergole Bioclimatiche" attivate/aggiunte prima di "Box Doccia"; rimosso il vecchio blocco commentato "Vetrine".
- `public/images/serramenti/vetrine/` → `vetrate/` (era vuota); creata `pergole-bioclimatiche/`.
- Nessun UPDATE necessario su DB: la sottocategoria "Vetrine" era ancora vuota (confermato dall'utente).
- Foto delle due nuove card in home sono placeholder (`casa-ristrutturata-2.jpg`/`-3.jpg`), da sostituire quando disponibili.

## Obiettivo

1. Rinominare la sottocategoria Serramenti "Vetrine" in "Vetrate" (label, slug/route, testi).
2. Creare una nuova sottocategoria Serramenti "Pergole Bioclimatiche", posizionata subito dopo "Vetrate" e prima di "Lucernai" nel menu/indice.
3. In home, aggiungere due card visibili (attualmente non presenti) "Vetrate" e "Pergole Bioclimatiche", posizionate subito prima della card "Box Doccia".

## File coinvolti

- `lib/nav-config.ts` — id 208 `Vetrine`/`/serramenti/vetrine` → `Vetrate`/`/serramenti/vetrate`; nuova voce `Pergole Bioclimatiche`/`/serramenti/pergole-bioclimatiche` inserita tra Vetrate (208) e Lucernai (209).
- `app/serramenti/page.tsx` — array `subcategories`: rinominare voce vetrine→vetrate, aggiungere voce pergole bioclimatiche nella stessa posizione (dopo vetrate, prima di lucernai).
- `app/serramenti/vetrine/page.tsx` → **spostata/rinominata** in `app/serramenti/vetrate/page.tsx`: testi "Vetrine"→"Vetrate", breadcrumb, title/description/canonical, `fixedSottocat="vetrine"` → `"vetrate"`, chiamata `getCatalogoData('serramenti', 'vetrine')` → `'vetrate'`.
- `app/serramenti/pergole-bioclimatiche/page.tsx` — **nuovo file**, stessa struttura delle altre pagine sottocategoria (testo descrittivo + card fotografiche placeholder + integrazione catalogo/carrello con `fixedSottocat="pergole-bioclimatiche"`).
- `app/sitemap.ts` — sostituire `/serramenti/vetrine` con `/serramenti/vetrate`, aggiungere `/serramenti/pergole-bioclimatiche`.
- `app/page.tsx` (home) — la card "Vetrine" esiste già ma è commentata (non visibile); verrà **riattivata, rinominata "Vetrate"** e spostata subito prima della card "Box Doccia" (dopo "Zanzariere"). Aggiunta nuova card "Pergole Bioclimatiche" nella stessa posizione. La card "Lucernai" resta commentata/non toccata (non richiesto).
- `public/images/serramenti/vetrine/` (vuota) → rinominata in `vetrate/`; creata nuova cartella `public/images/serramenti/pergole-bioclimatiche/` per foto future.

## Foto per le nuove card in home

Non sono state fornite foto per "Vetrate" e "Pergole Bioclimatiche": verranno usate immagini placeholder generiche già presenti nel progetto (es. `casa-ristrutturata-X.jpg`), da sostituire in seguito quando fornirai le foto reali — stesso pattern già usato per le altre card non ancora fotografate.

## Punto tecnico da confermare

Le pagine categoria interrogano MySQL (`catalogo_voci_percorsi`, `listini_percorsi`) filtrando per stringa `sottocategoria` (es. `'vetrine'`). Se in questi giorni sono già stati caricati articoli/voci di catalogo con `sottocategoria = 'vetrine'`, dopo la rinomina in `'vetrate'` quelle righe DB smetterebbero di comparire nella pagina, finché non vengono aggiornate anche loro (`UPDATE ... SET sottocategoria='vetrate' WHERE sottocategoria='vetrine'`).

**Domanda**: la sottocategoria "Vetrine" ha già voci/listini associati a DB, oppure è ancora vuota? Se ha già dati, eseguo anche l'UPDATE sul DB come parte di questa modifica.

---

In attesa di conferma prima di scrivere codice.
