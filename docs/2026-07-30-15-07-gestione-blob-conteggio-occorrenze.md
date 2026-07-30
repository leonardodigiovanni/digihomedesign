# Gestione Blob — conteggio occorrenze + copertura di tutte le sezioni

**Data:** 2026-07-30
**Stato:** completato

## Riepilogo implementazione

- `lib/blob-usage.ts` (nuovo): `SEZIONI` con la mappatura prefisso→colonne, `mappaOccorrenzeBlob(prefix)` — una query `GROUP BY` per colonna, sommata in una `Map<url, n>`.
- `app/api/blob/lista/route.ts`: aggiunto `occorrenze` a ogni blob nella risposta.
- `components/gestione-blob.tsx`: `BlobItem.occorrenze`, badge "(N occorrenze)" accanto al nome file, rosso/grassetto quando N=0.
- Montato `<GestioneBlob>` in: `area-lavoro/listini/page.tsx` (`listini/`), `clienti/documenti/page.tsx` (`documenti/`), `area-lavoro/marketing/page.tsx` (`marketing/`), `amministrazione/immagini-categorie/page.tsx` (`categoria-immagini/`).
- Cataloghi e Cantieri (già montati in precedenza) ereditano il conteggio senza modifiche.
- `tsc --noEmit` ed `eslint` sui file toccati: puliti.

## Obiettivo

Il componente `components/gestione-blob.tsx` (lista file di un prefisso Vercel Blob + bottone Elimina) oggi è montato solo in **Cataloghi** (`prefix="cataloghi/"`) e **Cantieri** (`prefix="cantieri/"`).

Va:
1. Montato anche nelle altre sezioni che caricano su Vercel Blob: **Listini**, **Documenti Clienti**, **Marketing**, **Immagini categorie**.
2. Esteso per mostrare, accanto a ogni file, **quante volte quell'URL è referenziato nel DB** — es. `divanogiallo.png (111 occorrenze)` — sommando tutte le colonne/tabelle in cui quella sezione può salvare l'URL (es. per le immagini categoria: 78 righe in "categoria" + 33 in "sottocategoria" = 111). Un file a **0 occorrenze** è un blob orfano, sicuro da eliminare.

## Mappatura sezione → colonne DB da controllare

| Prefisso Blob | Sezione | Tabella.colonna (dove può comparire l'URL) |
|---|---|---|
| `listini/` | Listini | `listini.foto_url`, `listini.schema_url`, `listini.logo_url` |
| `cataloghi/` | Cataloghi | `catalogo_voci.pdf_filename` |
| `cantieri/` | Cantieri | `cantieri_media.filename` |
| `documenti/` | Documenti Clienti | `documenti_cliente.filename` |
| `marketing/` | Marketing | `marketing.immagine`, `marketing.video` |
| `categoria-immagini/` | Immagini categorie | `categoria_immagini_shop_cat.immagine_url`, `categoria_immagini_promo_cat.immagine_url`, `categoria_immagini_cataloghi_cat.immagine_url`, `categoria_immagini_shop_sub.immagine_url`, `categoria_immagini_promo_sub.immagine_url`, `categoria_immagini_cataloghi_sub.immagine_url` |

## File coinvolti

### `lib/blob-usage.ts` (nuovo)
- Costante `SEZIONI: Record<string, { table: string; column: string }[]>` con la mappatura sopra.
- `mappaOccorrenzeBlob(prefix: string): Promise<Map<string, number>>`: per ogni `{table, column}` della sezione, esegue
  `SELECT <column> AS url, COUNT(*) AS n FROM <table> WHERE <column> IS NOT NULL AND <column> != '' GROUP BY <column>`
  e somma i conteggi nella stessa mappa (url → occorrenze totali). Una singola query raggruppata per colonna, non una query per blob — resta veloce anche con centinaia di file. Ogni query è avvolta in try/catch (tabella non ancora creata in un DB nuovo → conta 0, non errore).

### `app/api/blob/lista/route.ts`
- Dopo `list({ prefix })`, chiama `mappaOccorrenzeBlob(prefix)` e aggiunge `occorrenze: mappa.get(b.url) ?? 0` a ogni blob nella risposta JSON.

### `components/gestione-blob.tsx`
- `BlobItem` + campo `occorrenze: number`.
- Accanto al nome file: badge testuale `(N occorrenze)` — in rosso/grassetto quando `N === 0` per far risaltare subito i blob orfani, colore neutro altrimenti.

### Montaggio in 4 sezioni non ancora coperte
- `app/area-lavoro/listini/page.tsx` (server): `<GestioneBlob prefix="listini/" label="Gestione Blob — Listini" />` dopo `<ListiniClient ... />`.
- `app/clienti/documenti/page.tsx` (server, staff-only già con redirect admin/dipendente): `<GestioneBlob prefix="documenti/" label="Gestione Blob — Documenti Clienti" />`.
- `app/area-lavoro/marketing/page.tsx` (server): `<GestioneBlob prefix="marketing/" label="Gestione Blob — Marketing" />` dopo `<MarketingClient ... />`.
- `app/amministrazione/immagini-categorie/page.tsx` (server, admin-only): `<GestioneBlob prefix="categoria-immagini/" label="Gestione Blob — Immagini categorie" />`.

Cataloghi e Cantieri già hanno il componente montato: erediteranno il conteggio occorrenze automaticamente senza modifiche a quelle pagine.

## Nessun impatto su

- Le route di upload/eliminazione già esistenti per ciascuna sezione
- Il drag&drop e la casella di transito appena costruiti in Listini
- Permessi di accesso: ogni pagina mantiene il proprio controllo ruolo già presente; `GestioneBlob` resta un pannello in fondo, coerente con `cataloghi`/`cantieri`

## Da confermare prima di scrivere codice

Attendo conferma esplicita su questo documento prima di procedere con l'implementazione.
