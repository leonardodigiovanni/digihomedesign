# Rinomina pagina top-level /porte-corazzate → /porte-blindate

Stato: completato

## Obiettivo

L'URL pubblico `https://www.digi-home-design.com/porte-corazzate` deve diventare
`https://www.digi-home-design.com/porte-blindate`.

Nota: questa pagina è distinta dalle pagine di catalogo sotto `/metallurgia`
(`/metallurgia/porte-blindate` e `/metallurgia/porte-corazzate`, che restano
invariate — sono due sottocategorie diverse con cataloghi propri). Qui si parla
solo della pagina "vetrina" a livello radice, collegata dalla home e dalla
sitemap testuale del footer.

## File coinvolti

1. **`app/porte-corazzate/page.tsx` → `app/porte-blindate/page.tsx`**
   (rinomina cartella/file, `git mv`)
   - `metadata.title`: "Porte Corazzate a Palermo — Sicurezza e Blindature" → "Porte Blindate a Palermo — Sicurezza e Blindature"
   - `metadata.description`, `openGraph.title/description`: adeguati al nuovo nome
   - `alternates.canonical` e `openGraph.url`: `/porte-corazzate` → `/porte-blindate`
   - Breadcrumb "Home / Porte Corazzate" → "Home / Porte Blindate"
   - `<h1>` "Porte Corazzate a Palermo" → "Porte Blindate a Palermo"
   - Testo del corpo: già parla prevalentemente di "porte blindate", solo piccoli
     aggiustamenti dove dice "corazzate"

2. **`app/page.tsx`** (riga ~963, link attivo nel testo della home)
   - `href="/porte-corazzate"` → `href="/porte-blindate"`
   - `aria-label="porte-corazzate-a-palermo"` → `aria-label="porte-blindate-a-palermo"`
   - testo del link "porte corazzate" → "porte blindate"

3. **`components/sitemap-section.tsx`** (riga 8, elenco testuale in fondo al sito)
   - `label: 'Porte Corazzate'` → `'Porte Blindate'`
   - `href: '/porte-corazzate'` → `'/porte-blindate'`

4. **`next.config.ts`** — aggiungo un redirect permanente
   `/porte-corazzate` → `/porte-blindate` per non perdere backlink/indicizzazione
   Google sull'URL vecchio, dato che la pagina è online in produzione.

## Non tocco

- `app/metallurgia/porte-corazzate/` e `app/metallurgia/porte-blindate/` (pagine
  di catalogo, restano entrambe con i loro nomi attuali)
- `lib/nav-config.ts` (punta già a `/metallurgia/porte-corazzate`, non alla
  pagina root)
- `app/sitemap.ts` (la pagina root non è mai stata elencata lì)

## Riepilogo modifiche effettive

- `app/porte-corazzate/` rinominata in `app/porte-blindate/` (git mv), con
  title/description/canonical/breadcrumb/h1/testo aggiornati
- `app/page.tsx`: link home aggiornato a `/porte-blindate`
- `components/sitemap-section.tsx`: voce aggiornata a "Porte Blindate" / `/porte-blindate`
- `next.config.ts`: aggiunto redirect permanente `/porte-corazzate` → `/porte-blindate`
