# Redirect /serramenti/imbotti → /serramenti/monoblocchi

**Data:** 2026-08-11
**Stato:** completato

## Contesto

Search Console segnala "Soft 404" per `/serramenti/imbotti` (tra altri URL). Dal
`git log` risulta che il commit `226397b` ("rinomina imbotti in monoblocchi")
ha rinominato la cartella `app/serramenti/imbotti/` in `app/serramenti/monoblocchi/`,
senza aggiungere un redirect — a differenza dell'analogo rename
`/porte-corazzate → /porte-blindate`, che invece ha un redirect in
`next.config.ts` fin dal commit `4545da1`.

La pagina `/serramenti/imbotti` era reale e indicizzata da Google (ultima scansione
25 mag 2026); oggi non esiste più → 404. Google la mostra ancora come "soft 404"
nella cache non aggiornata.

## Fix

Aggiunta una riga in `next.config.ts` → `redirects()`, stesso pattern già in uso
per `/porte-corazzate`:

```ts
{ source: '/serramenti/imbotti', destination: '/serramenti/monoblocchi', permanent: true },
```

## File coinvolti

- `next.config.ts`

## Note

Durante l'analisi del bucket "Soft 404" sono emerse altre due cause, non
risolvibili con una semplice modifica di codice — vedi conversazione:
- **55 pagine con placeholder "Fotografia da scegliere"** (immagine generica
  `sito_manutenzione.webp` ripetuta) invece di foto reali — lavoro editoriale,
  non di codice.
- **Sospetto DB non raggiungibile in produzione** per le pagine con catalogo da
  MySQL (`lib/db.ts` punta a `localhost` di default) — da verificare con l'utente
  la configurazione delle env var `DB_HOST`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` sul
  deploy di produzione.
