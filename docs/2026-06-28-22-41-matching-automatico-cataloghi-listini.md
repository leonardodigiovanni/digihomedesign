# Matching automatico cataloghi → listini + UX brand catalogo

**Data:** 2026-06-28  
**Stato:** completato

---

## Obiettivo

1. **Filtri a cascata** sul lato brand (`CatalogoWrapper`) per i campi di classificazione delle voci PDF
2. **Auto-fill** filtri al click su un PDF (i dropdown si agganciano ai valori del PDF selezionato)
3. **✕ ripristina** lo stato dei filtri precedente la selezione del PDF
4. **Matching automatico** articoli ↔ voci in base ai campi di classificazione (senza più `listino_categoria`)

---

## UX brand catalog (flusso completo)

1. La pagina si apre → tutte le lookup vuote → tutti i PDF della categoria visibili
2. L'utente seleziona un valore da un dropdown (es. Sottocategoria) → la lista PDF si riduce; le opzioni del dropdown successivo si aggiornano (cascade)
3. L'utente fa clic su un PDF →
   - Il PDF si apre/mostra (comportamento attuale)
   - Tutti i dropdown si agganciano ai valori del PDF (auto-fill)
   - La lista articoli mostra quelli che matchano quel PDF (matching automatico)
4. L'utente fa clic su ✕ → il PDF si chiude e i dropdown tornano allo stato precedente al click

---

## Logica di matching articoli → voce

Per ogni voce del catalogo, articoli inclusi se soddisfano **tutte** le condizioni attive:

| Campo voce | Condizione SQL |
|---|---|
| `sottocategoria` (non null) | `listini.sottocategoria = ?` |
| `fase` (non null) | `listini.fase = ?` |
| `materiale` (non null) | `listini.materiale = ?` |
| `tipologia` (non null) | `listini.tipologia = ?` |
| `ambiente` (non null) | `listini.ambiente = ?` |
| `fascia` (non null) | `listini.fascia = ?` |
| `filtro_1 = 1` | `Filtro_1 = 1` |
| `filtro_2 = 1` | `Filtro_2 = 1` |
| `filtro_3 = 1` | `Filtro_3 = 1` |
| `filtro_4 = 1` | `Filtro_4 = 1` |

Sempre presenti: `disponibile = 1`, `preventivabile = 1`, `principale = 1`.  
Voce senza nessun campo impostato → lista vuota.  
La chiave in `articoliPerListino` diventa `String(voce.id)` anziché `listino_categoria`.

---

## File coinvolti

### Nuovo file
| File | Scopo |
|---|---|
| `lib/catalogo-matching.ts` | Helper condiviso: data lista voci + db, restituisce `Record<string, ArticoloListino[]>` keyed by `String(voce.id)` |

### File modificati
| File | Modifica |
|---|---|
| `app/brand/cataloghi/[slug]/catalogo-wrapper.tsx` | Aggiunge tipo classificazione alla `Voce`, cascade filter state, filter bar, `selectVoce()` con auto-fill, `closeVoce()` con ripristino, lookup per voce.id |
| `app/brand/cataloghi/[slug]/page.tsx` | Aggiunge campi classificazione al SELECT voci, sostituisce `allListiniSet` con helper |
| tutti e 15 `app/serramenti/*/page.tsx` | Stessa modifica: SELECT + helper |

---

## Dettaglio CatalogoWrapper

**Nuovi campi in `type Voce`:**  
`sottocategoria`, `fase`, `materiale`, `tipologia`, `ambiente`, `fascia`, `filtro_1`, `filtro_2`, `filtro_3`, `filtro_4`

**Nuovi state:**  
`sottocatSel`, `faseSel`, `materialeSel`, `tipologiaSel`, `ambienteSel`, `fasciaSel`, `filtriModello: Set<number>`, `savedFilters`

**Filter bar** (sopra la griglia PDF): dropdown cascata + chip filtri modello (visibili solo se almeno una voce ha quel valore)

**`selectVoce(voce)`**: salva i filtri correnti in `savedFilters`, auto-fill dai campi della voce, chiama `setSelectedVoce(voce)`

**`closeVoce()`**: `setSelectedVoce(null)`, ripristina `savedFilters`

---

## Note
- I vecchi `FILTRI_CATALOGO` (battente/scorrevole/ecc.) vengono **rimossi** dalla filter bar — sostituiti dai nuovi dropdown di classificazione
- `articoliAcquisto` continua a usare il pattern attuale (non impattato dal matching)
- `mostraFiltri` prop non serve più (la filter bar appare sempre se almeno una voce ha dati di classificazione)

---

## Riepilogo implementazione

**File nuovi:**
- `lib/catalogo-matching.ts` — helper `matchArticoliPerVoce()`, tipi `VoceForMatching`/`MatchOpts`, costante `LISTINO_COLS`

**File modificati:**
- `app/brand/cataloghi/[slug]/catalogo-wrapper.tsx` — riscrittura completa: cascade filter, `selectVoce()`, `savedFilters`, lookup per `String(voce.id)`
- `app/brand/cataloghi/[slug]/page.tsx` — ALTER TABLE catalogo_voci, SELECT aggiornato, blocco allListiniSet sostituito con `matchArticoliPerVoce`
- `app/serramenti/infissi-in-alluminio/page.tsx` — stessa modifica (aveva pattern più complesso)
- tutti e 14 `app/serramenti/*/page.tsx` (avvolgibili, box-doccia, imbotti, infissi-in-pvc, lucernai, persiane, tapparelle-manuali, tapparelle-motorizzate, veneziane, verande, verande-in-alluminio, verande-in-pvc, vetrine, zanzariere) — import aggiunto, ALTER TABLE catalogo_voci, SELECT aggiornato, blocco sostituito
- `app/area-lavoro/cataloghi/cataloghi-client.tsx` — cascade filter in CategoriaAccordion
- `app/area-lavoro/cataloghi/actions.ts` — `ensureTables()` e `updateVoce()` aggiornati
- `app/area-lavoro/cataloghi/page.tsx` — ALTER TABLE e SELECT aggiornati
