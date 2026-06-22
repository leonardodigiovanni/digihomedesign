# Filtri toggle per pagine catalogo

**Data:** 2026-06-22  
**Stato:** completato

## Obiettivo

Aggiungere bottoni toggle di filtro (es. "A battente", "Scorrevole", "Taglio termico", "Taglio freddo", "Economico", "Fascia alta") nelle pagine `/brand/cataloghi/[slug]`, posizionati tra il testo "Sfoglia i cataloghi disponibili:" e il selezionatore di catalogo.

Ogni catalogo (`catalogo_voci`) avrà 6 flag booleani che lo staff imposta in area-lavoro. I filtri attivi riducono le voci visibili (e di conseguenza gli articoli mostrati).

## File coinvolti

- `app/area-lavoro/cataloghi/actions.ts` — `ensureTables` + `updateVoce`
- `app/area-lavoro/cataloghi/cataloghi-client.tsx` — tipo `Voce` + `VoceEditForm`
- `app/brand/cataloghi/[slug]/page.tsx` — query SELECT con nuove colonne + tipo voci
- `app/brand/cataloghi/[slug]/catalogo-wrapper.tsx` — stato filtri + bottoni UI + filtraggio voci
- `app/brand/cataloghi/[slug]/catalogo-client.tsx` — tipo `Voce` con flag booleani

## DB

6 colonne booleane su `catalogo_voci` (default 0):

| Colonna | Label UI |
|---|---|
| `filtro_battente` | A battente |
| `filtro_scorrevole` | Scorrevole |
| `filtro_taglio_termico` | Taglio termico |
| `filtro_taglio_freddo` | Taglio freddo |
| `filtro_economico` | Economico |
| `filtro_fascia_alta` | Fascia alta |

Aggiunta via `ALTER TABLE ... ADD COLUMN ... TINYINT(1) NOT NULL DEFAULT 0` con catch (già esistente).

## UI area-lavoro

In `VoceEditForm`: sezione checkbox "Filtri" con 6 toggle, mostrati in grid 3 colonne. Inviati come `filtro_battente=on` → 1/0.

## UI pubblica

In `CatalogoWrapper`:
1. Raccogliere tutti i tag presenti nelle voci della categoria (solo quelli con almeno una voce = 1)
2. Mostrarli come bottoni toggle (attivo = sfondo dorato, inattivo = bordo dorato)
3. Filtro: se nessun filtro attivo → mostra tutte le voci; se uno o più filtri attivi → mostra solo voci che hanno ALMENO UNO dei filtri selezionati attivo (OR logic)
4. La sezione filtri è visibile solo se ci sono tag disponibili

## Scelte tecniche

- Logica OR: selezionare "A battente" + "Scorrevole" mostra tutto ciò che è battente OR scorrevole
- Se tutti i filtri attivi → nessun risultato → messaggio "Nessun catalogo corrisponde ai filtri selezionati"
- I filtri appaiono SOLO se almeno un tag è presente tra tutte le voci (non si mostra la sezione se tutti i flag sono 0)
