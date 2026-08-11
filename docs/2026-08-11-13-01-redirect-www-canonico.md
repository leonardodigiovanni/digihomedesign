# Redirect permanente verso www (host canonico)

**Data:** 2026-08-11
**Stato:** completato

## Contesto

Search Console segnala "Pagina duplicata senza URL canonico selezionato dall'utente"
per `https://digi-home-design.com/docs/condizioni-generali-del-preventivo.pdf`
(nota: senza `www`).

Il file esiste davvero in `public/docs/Condizioni-generali-del-preventivo.pdf`. Tutte
le pagine dichiarano canonical su `https://www.digi-home-design.com` (`BASE_URL` in
`app/layout.tsx`), ma **non esisteva nessun redirect che imponesse l'host `www`** —
verificato in `middleware.ts` e `next.config.ts` (redirects/rewrites), nessuno dei due
lo fa. Il sito risulta quindi raggiungibile due volte, su `digi-home-design.com` e
`www.digi-home-design.com`.

Per le pagine HTML il `<link rel="canonical">` mitiga il problema (Google capisce che
l'originale è su `www` — probabile causa del bucket, non un errore, "Pagina
alternativa con tag canonical appropriato: 19"). Ma i file statici in `public/`
(PDF, immagini, `.odg`...) non hanno un `<head>` HTML: è strutturalmente impossibile
dichiarare un canonical su di essi. Stesso file raggiungibile su due host, nessun
segnale su quale sia l'originale → "duplicata senza canonical selezionato".

## Fix

Redirect 301 permanente a livello di hostname in `next.config.ts`, usando il matcher
`has: [{ type: 'host', value: '...' }]` documentato in
`node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md`.
I redirect di Next.js sono valutati prima del filesystem/`public/` (stessa doc), quindi
copre anche i file statici, non solo le pagine HTML.

## File coinvolti

- `next.config.ts` — aggiunto redirect `digi-home-design.com` → `www.digi-home-design.com`
  in cima all'array `redirects()`

## Note

Risolve alla radice non solo il PDF segnalato ma qualunque futuro asset statico che
finirebbe nello stesso problema di doppio hostname.
