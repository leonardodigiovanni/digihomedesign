# Rimozione rotta legacy /pagine/[id]

**Data:** 2026-08-11
**Stato:** completato

## Contesto

Google Search Console segnala tra i motivi di mancata indicizzazione:
- "Pagina duplicata senza URL canonico selezionato dall'utente": 1
- "Non trovata (404)": 14

Indagine sul codice: `app/pagine/[id]/page.tsx` è una dynamic route legacy, residuo
della primissima versione del sito, quando `clientPages` in `lib/nav-config.ts`
aveva voci con `href: '/pagine/2'` … `'/pagine/15'` (14 pagine: Chi Siamo, Prodotti,
Servizi, Preventivi, Galleria, Cantieri, Materiali, Installazioni, Ristrutturazioni,
Fornitori, News, FAQ, Documenti, Contatti — vedi git log di `lib/nav-config.ts`).
Google le ha scansionate e indicizzate allora.

Oggi nessun link del sito punta più a `/pagine/N` (tutte le pagine reali usano URL
"a parole", es. `/chi-siamo/galleria`), ma il file di rotta è rimasto. La lookup
interna (`clientPages.find(p => p.id === Number(id))`) usa il campo `id` numerico,
che è tuttora un campo vivo di ogni voce di `clientPages` (serve al sistema
permessi/`disabledPages`, non alla rotta `/pagine/`) — per puro effetto collaterale:

- 12 vecchi id (2,3,4,5,7,8,9,10,11,12,13,14) non matchano più nessuna voce →
  `notFound()` → 404 reale. Spiega il bucket "Non trovata (404): 14".
- 2 vecchi id (6=Galleria, 15=Contatti) coincidono ancora per caso con id di voci
  reali odierne (riassegnati mantenendo lo stesso `id` per continuità dei permessi
  admin) → la rotta risponde 200 con un contenuto placeholder
  ("Pagina N — contenuto in costruzione."), senza alcun `canonical`/`robots` in
  `generateMetadata`. Google lo vede come quasi-duplicato della vera pagina
  Galleria/Contatti → spiega "Pagina duplicata senza URL canonico
  selezionato dall'utente: 1".

## Decisione

Eliminare del tutto la rotta `app/pagine/[id]/page.tsx`. Nessun link nel sito la
referenzia (verificato via grep — solo doc e CLAUDE.md la citavano). Tutti e 14 gli
URL diventeranno 404 reale (anche i 2 che oggi rispondono 200); Google li rimuoverà
dall'indice dopo la prossima scansione.

## File coinvolti

- `app/pagine/[id]/page.tsx` — eliminato (intera cartella `app/pagine/` rimossa)
- `CLAUDE.md` — sostituito il riferimento a "Client pages 2–15 use the dynamic route
  app/pagine/[id]/page.tsx" (informazione ormai falsa/obsoleta) con una nota che punta
  a questo documento

## Verifica

- Nessun link nel codice puntava a `/pagine/N` (unici riferimenti: due doc storici e
  CLAUDE.md, nessun `<Link>`/`href` attivo).
- `next.config.ts` (redirects/rewrites) e `app/sitemap.ts` non menzionano `/pagine/`,
  quindi nessun'altra modifica necessaria lì.
- Dopo la prossima build, `/pagine/2` … `/pagine/15` risulteranno 404 nativi di
  Next.js (nessuna pagina corrisponde più a quel path).

## Note

Restano da verificare separatamente (richiedono l'export degli URL da Search
Console, non deducibili dal solo codice): "Pagina con reindirizzamento" (2),
"Esclusa in base al tag noindex" (1), "Bloccata da robots.txt" (1), "Soft 404".
