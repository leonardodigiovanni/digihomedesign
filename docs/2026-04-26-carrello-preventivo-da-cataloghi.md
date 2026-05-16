# Carrello preventivo da cataloghi

**Data**: 2026-04-26  
**Stato**: completato

---

## Obiettivo

Mentre l'utente sfoglia una categoria di cataloghi (`/brand/cataloghi/[id]`), se esiste un listino con articoli della stessa categoria, appare un pannello "Aggiungi articolo al preventivo". Gli articoli aggiunti confluiscono in un preventivo in stato `bozza` dell'utente; visitando `/area-clienti/preventivi` l'utente trova tutto ciò che ha aggiunto.

---

## Modello dati — modifiche necessarie

### 1. Nuova colonna `catalogo_categorie.listino_categoria`

```sql
ALTER TABLE catalogo_categorie
  ADD COLUMN listino_categoria VARCHAR(100) NULL DEFAULT NULL;
```

Permette all'admin di collegare una categoria catalogo a una categoria listino. Se `NULL`, nessun listino è associato e il pannello non appare.

Gestione admin: nella pagina `/area-lavoro/cataloghi` aggiungo un campo select per scegliere la `listino_categoria` tra quelle presenti in `listini`.

### 2. Nessuna nuova tabella

Il "carrello" usa la tabella `preventivo_articoli` già esistente, appesa a un preventivo `bozza` dell'utente. Se l'utente non ha ancora un preventivo in bozza, ne viene creato uno automaticamente con `descrizione = 'Carrello'`.

---

## Flusso utente

1. Utente (loggato) naviga su `/brand/cataloghi/[id]` → es. "Marmi"
2. Il server legge `catalogo_categorie.listino_categoria` → es. `"Marmi"`
3. Carica da `listini` tutti gli articoli con `categoria = 'Marmi' AND disponibile = 1 AND preventivabile = 1`
4. Appare sotto l'elenco PDF un pannello "**Aggiungi articolo al preventivo**" con:
   - Select dell'articolo (descrizione + produttore + unità + prezzo)
   - Campo quantità (default 1)
   - Bottone "Aggiungi"
5. Server action `aggiungiAlCarrello(formData)`:
   - Legge il `cliente_id` dall'utente loggato
   - Cerca un preventivo `stato = 'bozza'` del cliente; se non esiste lo crea
   - Inserisce la riga in `preventivo_articoli`
6. Feedback inline: "✓ Articolo aggiunto al tuo preventivo"
7. Utente visita `/area-clienti/preventivi` → vede il preventivo bozza con tutti gli articoli

**Utenti non loggati**: il pannello appare e funziona esattamente come per i loggati. Il carrello viene salvato in un cookie `digi_cart` (JSON `[{id, q}]`, TTL 30 gg). Quando l'utente si logga, gli articoli del cookie vengono importati nel suo preventivo bozza DB e il cookie viene cancellato.

---

## File coinvolti

| File | Modifica |
|------|----------|
| `app/brand/cataloghi/[id]/page.tsx` | Legge `listino_categoria`, carica articoli listino, renderizza pannello |
| `app/brand/cataloghi/[id]/aggiungi-form.tsx` | Nuovo — `'use client'` form con select articolo + quantità |
| `app/brand/cataloghi/actions.ts` | Nuovo — server action `aggiungiAlCarrello` |
| `app/area-lavoro/cataloghi/page.tsx` (o client) | Aggiunge campo select `listino_categoria` nella gestione categorie |
| `app/area-lavoro/cataloghi/actions.ts` | Aggiunge `updateListinoCategoria()` |

---

## Riepilogo implementazione

**File creati:**
- `app/brand/cataloghi/actions.ts` — `aggiungiAlCarrello` e `importaCarrello` server actions
- `app/brand/cataloghi/[id]/aggiungi-articolo.tsx` — form client con select articolo + quantità
- `app/area-clienti/preventivi/importa-carrello.tsx` — client component che importa il cookie al login

**File modificati:**
- `app/area-lavoro/cataloghi/actions.ts` — `ensureTables` aggiunge colonna `listino_categoria`, nuova action `updateListinoCategoria`
- `app/area-lavoro/cataloghi/cataloghi-client.tsx` — tipo `Categoria` aggiornato, form "Listino collegato" nell'accordion
- `app/area-lavoro/cataloghi/page.tsx` — query include `listino_categoria`, passa `listiniCategorie` al client
- `app/brand/cataloghi/[id]/page.tsx` — legge `listino_categoria`, carica articoli listino, renderizza `AggiungiArticolo`
- `app/area-clienti/preventivi/page.tsx` — renderizza `ImportaCarrello` se `digi_cart` cookie presente

**Note:**
- La colonna `listino_categoria` viene aggiunta con `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` (idempotente)
- Utenti anonimi: cookie `digi_cart` (JSON `[{id,q}]`, TTL 30 gg)
- Utenti loggati senza record in `clienti`: fallback su cookie
- Al primo accesso a `/area-clienti/preventivi`, il cookie viene importato nel preventivo bozza "Carrello" e cancellato

---

## Scelte tecniche

- **Nessuna nuova tabella**: riuso `preventivi` + `preventivo_articoli` già esistenti
- **Un solo preventivo bozza per utente**: la logica "trova o crea bozza" è centralizzata nella action
- **Il prezzo viene copiato dal listino** al momento dell'aggiunta (come già fa `aggiungiArticolo` esistente) — non è ricalcolato automaticamente
- **Il campo quantità** è intero, min 1
- **Non serve misura** (altezza/larghezza) in questa fase: si imposta a 0 e l'utente può modificarla nel preventivo
- **`aggiungiAlCarrello`** può essere chiamata più volte per lo stesso articolo (aggiunge righe separate)
