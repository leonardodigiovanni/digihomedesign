# Split "Porte Blindate" in 3 sottocategorie (Ferro e Acciaio)

Stato: **completato** (2026-07-22)

## Riepilogo modifiche effettive

Approvato con i default proposti. Implementato così:

- `lib/nav-config.ts`: rimossa l'entry id 212 (`Porte Blindate`) da `categoryGroups.metallurgia`, sostituita con 3 entry (id 2124/2125/2126) — Porte Blindate Riv. Legno/Alluminio/PVC, href `/metallurgia/porte-blindate-{legno,alluminio,pvc}`. Aggiornata anche `antintrusioneSicurezzaPages` che riusava lo stesso id/href (stesso pattern delle altre voci "flat" di quel file).
- 3 nuove pagine `app/metallurgia/porte-blindate-{legno,alluminio,pvc}/page.tsx`, stessa struttura della pagina originale, ciascuna con `CERCA` distinto (`'Porte Blindate Legno'` / `'Porte Blindate Alluminio'` / `'Porte Blindate PVC'`), metadata/H1/breadcrumb dedicati, paragrafo descrittivo adattato al rivestimento. Immagini riusate dalla cartella esistente `/images/metallurgia/porte-blindate/` (nessuna nuova immagine fornita).
- Eliminata la vecchia pagina `app/metallurgia/porte-blindate/`.
- Aggiunto redirect permanente in `next.config.ts`: `/metallurgia/porte-blindate` → `/metallurgia/porte-blindate-legno` (default scelto per non perdere l'indicizzazione SEO della vecchia URL).
- Aggiornati i riferimenti alla vecchia voce singola in `app/metallurgia/page.tsx` (hub category) e `app/sitemap.ts`.
- Non toccato: il blocco commentato in `app/page.tsx` (card home per Porte Blindate, già disattivata) e gli script one-off in `/scripts`.

## ⚠️ Nota che resta valida

Gli articoli/listini già categorizzati come "Porte Blindate" nel database (tabelle `listini_percorsi` / `catalogo_voci_percorsi`) **non compaiono automaticamente** in nessuna delle 3 nuove pagine, perché il valore `CERCA` è cambiato. Vanno ricategorizzati manualmente per rivestimento (legno/alluminio/pvc) dal pannello admin.

## Obiettivo

Dentro il gruppo nav "Ferro e Acciaio" (id `metallurgia`), sostituire l'unica voce **Porte Blindate** (id 212, `/metallurgia/porte-blindate`) con **3 voci distinte**, in base al rivestimento:

1. Porte Blindate Riv. Legno
2. Porte Blindate Riv. Alluminio
3. Porte Blindate Riv. PVC

## File coinvolti

- `lib/nav-config.ts` — sostituire l'entry id 212 con 3 nuove entry (nuovi id, nuovi href).
- `app/metallurgia/porte-blindate/page.tsx` — pagina attuale, da smontare in 3 pagine.
- `app/metallurgia/porte-blindate-legno/page.tsx` — **nuova**
- `app/metallurgia/porte-blindate-alluminio/page.tsx` — **nuova**
- `app/metallurgia/porte-blindate-pvc/page.tsx` — **nuova**
- `app/sitemap.ts` — se enumera le pagine di categoria singolarmente (da verificare).

## Passi principali

1. **nav-config.ts**: rimuovere `{ id: 212, label: 'Porte Blindate', href: '/metallurgia/porte-blindate' }` e aggiungere 3 voci al suo posto, es.:
   ```
   { id: 2124, label: 'Porte Blindate Riv. Legno',      href: '/metallurgia/porte-blindate-legno'      },
   { id: 2125, label: 'Porte Blindate Riv. Alluminio',  href: '/metallurgia/porte-blindate-alluminio'  },
   { id: 2126, label: 'Porte Blindate Riv. PVC',        href: '/metallurgia/porte-blindate-pvc'        },
   ```
2. **3 nuove pagine**: stessa struttura di `porte-blindate/page.tsx` (fototesto + catalogo + carrello), ciascuna con:
   - breadcrumb / H1 / metadata dedicati (es. "Porte Blindate Rivestimento Legno a Palermo")
   - **`CERCA`** distinto per il matching su `listini_percorsi` / `catalogo_voci_percorsi` (es. `'Porte Blindate Legno'`, `'Porte Blindate Alluminio'`, `'Porte Blindate PVC'`)
3. **Vecchia pagina** `app/metallurgia/porte-blindate/`: da eliminare (o trasformare in redirect verso una delle 3 — da decidere, vedi punto sotto).

## ⚠️ Punto critico — dati esistenti nel catalogo

Il `CERCA` attuale (`'Porte Blindate'`) è la chiave con cui la pagina pesca articoli/listini dal database (tabelle `listini_percorsi` e `catalogo_voci_percorsi`, colonna `categoria`). Se creo 3 pagine con `CERCA` diversi, **gli articoli già categorizzati come "Porte Blindate" nel gestionale non compariranno automaticamente in nessuna delle 3 nuove pagine** — bisognerà ri-categorizzare manualmente ogni articolo/voce catalogo con la nuova sottocategoria (legno/alluminio/pvc) da pannello admin, altrimenti le pagine risultano vuote (nessun articolo, nessuna voce catalogo).

## Domande da confermare prima di procedere

1. **URL delle 3 pagine**: vanno bene `/metallurgia/porte-blindate-legno`, `-alluminio`, `-pvc`?
2. **Vecchia URL `/metallurgia/porte-blindate`**: la elimino e basta, o serve un redirect (es. verso `-legno`) per non rompere link già indicizzati da Google?
3. **Contenuto testuale** delle 3 pagine: riuso lo stesso testo attuale adattato per rivestimento, o l'utente fornisce testi specifici?
4. **Ordine** nel menu: le 3 voci restano al posto dell'unica attuale (subito dopo Porte Corazzate, prima di Porte Antincendio)?

In attesa di conferma esplicita prima di scrivere codice.
