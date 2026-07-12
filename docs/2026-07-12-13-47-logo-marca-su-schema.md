# Logo marca sovrapposto allo schema nelle modali "Aggiungi articolo"

Stato: **completato**

## Riepilogo implementazione

Realizzato secondo il piano, con alcuni aggiustamenti emersi dal test in localhost:

- Colonna `listini.logo_url` + picker loghi (da `public/images/brand/partners/`) nella scheda tecnica di `area-lavoro/listini`.
- `logo_url` propagato in tutte le query lato server delle modali "Aggiungi articolo" (preventivi, carrelli, cataloghi), tramite `LISTINO_COLS` condivisa dove possibile.
- Badge logo in `thumbnailsData` (entrambi i componenti modale), mostrato solo se il gruppo di schema condivisi appartiene a una marca sola.
- **Layout rivisto rispetto al piano iniziale**: invece di sovrapporre il logo con `position:absolute` sopra lo schema (tagliava il disegno), schema e logo sono impilati in colonna nello stesso riquadro — il logo occupa una fascia dedicata di 24px sotto lo schema, centrato, entrambi su sfondo bianco puro senza separazione visibile tra le due sezioni.
- **Aggiunta non pianificata inizialmente**: colonna "Logo" nella tabella admin di `area-lavoro/listini` (dopo Marca), con miniatura e rimozione rapida, su richiesta esplicita durante il test.

## Obiettivo

Quando due marche diverse condividono lo stesso disegno `schema_url` (es. Marca1 e Marca2 hanno entrambe uno schema "2 ante" graficamente identico), l'utente nelle modali "Aggiungi articolo" non riesce a distinguerle a colpo d'occhio. Si vuole sovrapporre un piccolo badge col logo della marca in basso sull'immagine schema, ovunque essa venga mostrata nelle griglie di miniature di quelle modali (**solo UI, nessuna modifica ai PDF di stampa** — confermato esplicitamente fuori scope).

## Come si associa il logo (scelta tecnica)

- **Niente matching automatico** tra `listini.produttore` (testo libero, autocomplete via `<datalist>`, non normalizzato — es. "Schüco" vs `SCHUCO.png`, maiuscole/trattini incoerenti tra i 65 file in `public/images/brand/partners/`) e i nomi dei file logo. Sarebbe fragile.
- **Niente upload libero**: si riusa il repository statico già esistente `public/images/brand/partners/*.png` (65 loghi), proponendo allo staff un **picker** (griglia di miniature cliccabili) invece di un upload.
- **Associazione manuale, per riga di listino**: nuova colonna `listini.logo_url` (VARCHAR(500) NULL, path tipo `/images/brand/partners/FINSTRAL.png`), valorizzata dallo staff nella scheda tecnica del singolo articolo/listino — stesso punto dove oggi si carica `schema_url`/`foto_url`. Se la stessa marca compare su più righe di listino, va riassociata su ciascuna riga (nessuna tabella marche/produttori normalizzata oggi in DB, quindi niente riuso automatico — coerente con come già funziona `produttore` testo libero).

## File coinvolti e modifiche

**Persistenza + scheda tecnica (area-lavoro/listini)**
- `app/area-lavoro/listini/actions.ts`: `ensureTable()` → `ALTER TABLE listini ADD COLUMN logo_url VARCHAR(500) NULL` (stesso pattern di `schema_url`, riga 47). `updateSchedaTecnica()` → salva anche `logo_url` nella UPDATE.
- `app/area-lavoro/listini/page.tsx`: SELECT esteso con `logo_url`; nuova funzione che elenca i file in `public/images/brand/partners` via `fs.readdirSync` (server-side) e li passa come prop al client per popolare il picker.
- `app/area-lavoro/listini/listini-client.tsx`: `SchedaTecnicaModal` → nuovo blocco "Logo marca" tra il blocco "Schema" (riga 587-598) e la griglia dei campi numerici (riga 602): griglia di miniature dei loghi disponibili + opzione "Nessuno", stato locale + hidden input nel form. Tipo `Articolo` esteso con `logo_url`.

**Propagazione `logo_url` fino alle modali "Aggiungi articolo"**
Stesso set di query già toccato nel giro di fix dei filtri F1-F10 (che seleziona già `schema_url`), da estendere con `logo_url`:
- `app/clienti/preventivi/[id]/page.tsx`, `app/area-clienti/preventivi/[id]/page.tsx`, `app/app/preventivo/[id]/page.tsx`
- `app/area-clienti/carrello-preventivo/page.tsx`, `app/app/carrello-preventivo/page.tsx`
- `app/area-clienti/carrello-computometrico/page.tsx`
- `app/brand/cataloghi/[slug]/page.tsx`, `app/serramenti/infissi-in-alluminio/page.tsx` (e eventuale `app/app/cataloghi/[slug]/page.tsx`)

**Tipi**
- `ListinoItem` in `app/clienti/preventivi/[id]/preventivo-client.tsx` e le sue copie/derivate nei `carrello-client.tsx`: campo `logo_url?: string | null`.
- `ArticoloListino` in `components/aggiungi-articolo-form.tsx`: campo `logo_url?: string | null`.

**Logica di raggruppamento e overlay (le due modali "Aggiungi articolo")**
- `components/aggiungi-articolo-form.tsx` (`thumbnailsData`, righe 237-249) e `app/clienti/preventivi/[id]/preventivo-client.tsx` (`thumbnailsData`, righe ~584-599): per ogni gruppo di `schema_url`, verificare se tutte le righe che lo condividono hanno lo **stesso `produttore`**.
  - Se sì e almeno una ha `logo_url` valorizzato → badge visibile.
  - Se il gruppo mescola marche diverse → nessun badge (ambiguo per definizione, comportamento invariato rispetto a oggi).
- Overlay grafico: badge `position:absolute` in basso nel contenitore della miniatura (già dimensioni fisse + `overflow:hidden`), stesso pattern già usato nel progetto per badge simili (es. bollino "ESCLUSO" nei PDF, qui riadattato per la UI). Dimensione contenuta (indicativamente un riquadro basso, non tutta l'immagine) per non coprire il disegno schema.

## Non tocca

- PDF di stampa preventivi (nessuna modifica, confermato esplicitamente).
- Tabella `fornitori` (resta un'entità diversa da `listini.produttore` testo libero).
- Pagine catalogo `/serramenti/*` non ancora migrate al sistema filtri unificato (fuori scope, tracciato a parte).

## Passi implementativi

1. Colonna DB + salvataggio scheda tecnica (`actions.ts`, `page.tsx`, `listini-client.tsx`).
2. Propagazione `logo_url` nelle ~8 query lato server che alimentano le modali "Aggiungi articolo".
3. Estensione tipi (`ListinoItem`, `ArticoloListino`).
4. Logica di badge in `thumbnailsData` + rendering overlay in entrambi i componenti modale.
5. Verifica visiva in localhost su un caso reale con due marche che condividono lo stesso schema.
