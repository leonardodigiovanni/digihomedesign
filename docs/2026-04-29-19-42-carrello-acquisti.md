# Carrello Acquisti — Listini di tipo "acquistabile"

**Stato**: completato  
**Data**: 2026-04-29

---

## Obiettivo

Aggiungere un secondo tipo di listino — articoli **direttamente acquistabili** — che si affianca al tipo esistente "preventivabile". Gli articoli acquistabili devono avere un proprio carrello acquisti, separato dal carrello preventivo.

---

## Modifiche al DB

**Tabella `listini`** — aggiungere colonna:
```sql
ALTER TABLE listini ADD COLUMN acquistabile TINYINT(1) NOT NULL DEFAULT 0;
```

Semantica:
- `preventivabile=1` → l'articolo va nel carrello preventivo (comportamento attuale)
- `acquistabile=1` → l'articolo va nel carrello acquisti (nuovo)
- I due flag sono indipendenti; un articolo può avere entrambi a 1 o nessuno

---

## File coinvolti

### 1. DB migration
- Aggiungere colonna `acquistabile` via `ALTER TABLE` (eseguita una volta manualmente o come migration).

### 2. `app/area-lavoro/listini/page.tsx` + `listini-client.tsx` + `actions.ts`
- Mostrare colonna `acquistabile` nella tabella listini (admin).
- Aggiungere toggle/checkbox per impostare `acquistabile` al momento della creazione/modifica di un articolo.

### 3. `app/brand/cataloghi/[id]/page.tsx`
- Query attuale: `WHERE categoria=? AND preventivabile=1`
- Nuova logica: eseguire due query separate:
  - `articoliPreventivo`: `WHERE categoria=? AND preventivabile=1`
  - `articoliAcquisto`: `WHERE categoria=? AND acquistabile=1`
- Mostrare due sezioni distinte nella pagina:
  - **"Articoli da preventivare"** — con form `AggiungiArticolo` che usa il carrello preventivo
  - **"Articoli acquistabili"** — con form `AggiungiArticoloAcquisto` che usa il carrello acquisti
- Se una sezione è vuota, non mostrarla.

### 4. `app/brand/cataloghi/actions.ts`
- Aggiungere tre nuove azioni per il carrello acquisti (sul cookie `digi_cart_acquisti`):
  - `aggiungiAlCarrelloAcquisti(formData)`
  - `rimuoviDaCarrelloAcquisti(index)`
  - `svuotaCarrelloAcquisti()`
- Struttura item identica al carrello preventivo.

### 5. `components/aggiungi-articolo-form.tsx`
- Aggiungere una prop `cartType: 'preventivo' | 'acquisto'` (o duplicare il componente come `aggiungi-articolo-acquisto-form.tsx`).
- In base a `cartType` chiama l'action corretta.

### 6. `app/area-clienti/carrello-acquisti/` (nuova directory)
- Duplicare la struttura di `area-clienti/carrello-preventivo/`:
  - `page.tsx` — legge cookie `digi_cart_acquisti`, stessa logica di accesso per ruolo
  - `carrello-acquisti-client.tsx` — tabella articoli, totale, azioni
  - `stampa/page.tsx` — PDF stampa carrello acquisti
- Differenza rispetto al carrello preventivo: il pulsante finale è **"Conferma ordine"** anziché "Salva come preventivo" (in futuro potrà collegarsi agli ordini; per ora può salvare come ordine bozza).

### 7. `app/layout.tsx`
- Leggere anche il cookie `digi_cart_acquisti` e calcolare `cartAcquistiCount`.
- Passare `cartAcquistiCount` alla Navbar.

### 8. `components/navbar.tsx`
- Aggiungere secondo bottone carrello (icona + badge) per carrello acquisti, visibile quando `cartAcquistiCount > 0`.
- Link: `/area-clienti/carrello-acquisti`
- Usare un'icona / immagine diversa dal carrello preventivo per distinguerli visivamente.

---

## Scelte tecniche

- **Cookie separato** `digi_cart_acquisti`: stessa struttura di `digi_cart`, nessuna interferenza tra i due carrelli.
- **Nessuna modifica al carrello preventivo** esistente: tutto rimane invariato per gli articoli `preventivabile=1`.
- **Pagina catalogo** mostra le due sezioni solo se hanno articoli: se un catalogo ha solo articoli preventivabili, vede solo quella sezione (e viceversa).
- **Flag indipendenti**: un articolo può tecnicamente essere sia preventivabile che acquistabile (appare in entrambe le sezioni), oppure nessuno dei due (non appare nelle sezioni articoli).

---

## Riepilogo modifiche effettive

- `app/area-lavoro/listini/page.tsx` — `ALTER TABLE acquistabile`, mapping colonna, `acquistabile` nel tipo
- `app/area-lavoro/listini/listini-client.tsx` — tipo `Articolo.acquistabile`, `ToggleAcquistabileBtn`, bottone viola in riga
- `app/area-lavoro/listini/actions.ts` — `ensureTable acquistabile`, `toggleAcquistabile` export
- `app/brand/cataloghi/actions.ts` — `aggiungiAlCarrelloAcquisti`, `svuotaCarrelloAcquisti`, `rimuoviDaCarrelloAcquisti` sul cookie `digi_cart_acquisti`; `importaCarrello` (fix pre-esistente)
- `components/aggiungi-articolo-acquisto-form.tsx` — nuovo componente client (viola)
- `app/brand/cataloghi/[id]/page.tsx` — doppia query + doppia sezione nella pagina
- `app/area-clienti/carrello-acquisti/page.tsx` — nuova pagina carrello
- `app/area-clienti/carrello-acquisti/carrello-acquisti-client.tsx` — nuovo client component
- `app/area-clienti/carrello-acquisti/stampa/page.tsx` — PDF stampa acquisti (viola, senza SVG infissi)
- `app/area-clienti/carrello-acquisti/stampa/stampa-client.tsx` — client per PDF
- `app/layout.tsx` — lettura cookie `digi_cart_acquisti`, `cartAcquistiCount` passato a Navbar
- `components/navbar.tsx` — prop `cartAcquistiCount`, secondo bottone carrello (filtro viola) desktop + mobile
- Fix collaterale: `app/area-clienti/carrello-preventivo/page.tsx` — rimossa annotazione di tipo esplicita che causava errore TS pre-esistente
