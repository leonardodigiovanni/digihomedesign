# Split "Infissi in Alluminio" in Taglio Termico / Freddo

Stato: **completato** (2026-07-25)

## Riepilogo modifiche effettive

Confermato con: testo "freddo" minimale (scritto da me), immagini riusate as-is, redirect verso taglio-termico, ricategorizzazione catalogo a carico dell'utente, card home → taglio-termico, etichetta nav "Infissi in Alluminio a Taglio Termico".

- `lib/nav-config.ts`: entry id 201 (`categoryGroups.serramenti`) trasformata da "Infissi in Alluminio" → "Infissi in Alluminio a Freddo" (`/serramenti/infissi-in-alluminio-freddo`); entry id 290 (`prodottiPages`, sottogruppo "Infissi Isolanti Termoacustici") da "Alluminio" (pagina segnaposto) → "Infissi in Alluminio a Taglio Termico" (`/serramenti/infissi-in-alluminio-taglio-termico`).
- 2 nuove pagine `app/serramenti/infissi-in-alluminio-{taglio-termico,freddo}/page.tsx`, stessa struttura tecnica della pagina originale (stesse query, stessi ALTER TABLE idempotenti, stesso `CatalogoWrapper`), `fixedSottocat` distinto per ciascuna. Taglio termico riusa il testo originale (già scritto per quel prodotto); Freddo ha un testo nuovo minimale, da rivedere. Immagini riusate da `/images/serramenti/infissi-in-alluminio/` per entrambe (nessuna nuova fornita).
- Eliminata la vecchia pagina `app/serramenti/infissi-in-alluminio/`.
- Eliminata la pagina segnaposto orfana `app/riqualificazione-energetica/infissi-isolanti-termoacustici/alluminio/` (non più linkata da nessuna parte).
- Aggiunto redirect permanente in `next.config.ts`: `/serramenti/infissi-in-alluminio` → `/serramenti/infissi-in-alluminio-taglio-termico`.
- Aggiornati i riferimenti alla vecchia voce singola in `app/page.tsx` (card home → taglio-termico), `app/serramenti/page.tsx` (hub categoria, ora 2 righe) e `app/sitemap.ts` (2 path invece di 1).
- Non toccato: `app/brand/cataloghi/[slug]/page.tsx` (flag `mostraFiltri` legato allo slug `infissi-in-alluminio`) — la ricategorizzazione del catalogo/DB la gestisce l'utente.

## ⚠️ Nota che resta valida

Stesso limite già visto con le porte blindate: gli articoli/listini già categorizzati con sottocategoria `infissi-in-alluminio` nel database **non compaiono automaticamente** in nessuna delle 2 nuove pagine, perché il valore `fixedSottocat` è cambiato in entrambe. Vanno ricategorizzati manualmente (taglio-termico / freddo) dal pannello admin — a carico dell'utente per sua scelta esplicita.
