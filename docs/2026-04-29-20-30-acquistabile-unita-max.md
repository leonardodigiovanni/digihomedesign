# Carrello Acquisti — Campi adattivi per unità di misura + max acquistabile

**Stato**: completato  
**Data**: 2026-04-29

---

## Obiettivo

1. Il form "Aggiungi articolo al carrello acquisti" mostra campi diversi in base all'unità di misura dell'articolo.
2. Si aggiunge la colonna `max_acquistabile` alla tabella `listini` per indicare la disponibilità massima. Per ora il dato è visibile all'utente ma non vincola il form.

---

## Logica campi per unità di misura

| Unità | Campi mostrati |
|-------|---------------|
| `pz`, `h`, `corpo` e qualsiasi non mappata | Solo quantità |
| `kg` | Peso in kg (al posto della quantità classica, o campo "Quantità (kg)") |
| `m²` | Larghezza (cm) + Altezza (cm) + Quantità |
| `ml` | Lunghezza (cm o ml) + Quantità |
| `t` | Peso in tonnellate + Quantità |

*Per ora le quantità sono libere (nessun blocco lato server). Il blocco sul `max_acquistabile` verrà implementato in futuro.*

---

## Colonna DB: `max_acquistabile`

```sql
ALTER TABLE listini ADD COLUMN max_acquistabile INT NULL DEFAULT NULL;
```

**Semantica**:
- `NULL` → illimitato (nessun limite indicato)
- `0` → esaurito
- `1..n` → massimo n pezzi acquistabili

---

## File coinvolti

### 1. `app/area-lavoro/listini/page.tsx` + `actions.ts`
- `ensureTable`: aggiungere `ALTER TABLE ... ADD COLUMN max_acquistabile INT NULL DEFAULT NULL`.
- Query SELECT: includere `max_acquistabile`.
- Mapping: `max_acquistabile: r.max_acquistabile != null ? Number(r.max_acquistabile) : null`.

### 2. `app/area-lavoro/listini/listini-client.tsx`
- Tipo `Articolo`: aggiungere `max_acquistabile: number | null`.
- `NuovoArticoloForm`: campo "Max acquistabile" (input number, placeholder "vuoto = illimitato, 0 = esaurito").
- `RigaEdit`: campo max_acquistabile modificabile.
- `RigaNormale`: mostrare il valore (badge piccolo: "Esaurito" / "Max N" / vuoto).
- `addArticolo` / `updateArticolo`: salvare `max_acquistabile`.

### 3. `components/aggiungi-articolo-acquisto-form.tsx`
- Tipo `ArticoloListinoAcquisto`: aggiungere `max_acquistabile: number | null`.
- Logica adattiva in base a `unita`:
  - `pz`, `h`, `corpo`, altre: solo campo "Quantità"
  - `kg`: campo "Quantità (kg)"
  - `t`: campo "Quantità (t)"
  - `ml`: campo "Lunghezza (cm)" + "Quantità"
  - `m²`: "Larghezza (cm)" + "Altezza (cm)" + "Quantità"
- Se `max_acquistabile === 0`: mostrare "Esaurito" e disabilitare il bottone.
- Se `max_acquistabile > 0`: mostrare piccola nota "Max disponibili: N".
- Se `null`: nessuna nota.

### 4. `app/brand/cataloghi/[id]/page.tsx`
- Query articoli acquistabili: aggiungere `max_acquistabile` al SELECT.

### 5. `app/brand/cataloghi/actions.ts` (`aggiungiAlCarrelloAcquisti`)
- Leggere anche i campi dimensionali dal formData (già presenti — verificare).
- Nessuna modifica necessaria se i campi sono già letti da `fd`.

---

## Note tecniche

- Il cookie `digi_cart_acquisti` mantiene già `l` (larghezza), `h` (altezza) e `q` (quantità) — nessuna modifica alla struttura del cookie.
- Per `kg` / `t` il "peso" viene mappato al campo `q` (quantità) senza larghezza/altezza.
- `max_acquistabile` **non** viene salvato nel cookie e **non** viene validato lato server per ora — è solo UI.

---

## Passi

1. DB migration + page.tsx listini (ensureTable + query + mapping)
2. actions.ts listini (add/update includono max_acquistabile)
3. listini-client.tsx (tipo, form nuovo, riga edit, riga normale)
4. aggiungi-articolo-acquisto-form.tsx (campi adattivi + max_acquistabile)
5. brand/cataloghi/[id]/page.tsx (query aggiornata)
