# Modal selezione articolo condivisa

**Data:** 2026-06-28  
**Stato:** proposta

---

## Obiettivo

Estrarre la logica di selezione articolo (filtri a cascata, linguette, thumbnail, lookup descrizione) in un unico componente `components/modal-selezione-articolo.tsx` riutilizzato sia da `preventivo-client.tsx` sia da `carrello-client.tsx`.

---

## Problema attuale

Esistono due implementazioni parallele della stessa modale:
- `app/clienti/preventivi/[id]/preventivo-client.tsx` — modale inline `AggiungiModale`
- `app/area-clienti/carrello-preventivo/carrello-client.tsx` — blocco `type: 'aggiungi'` in `renderModal()`

Ogni fix (thumbnail toggle, listiniPerTipo su tipo vuoto, Conferma/Annulla, gridTemplateColumns, ecc.) va applicato due volte. Le due implementazioni stanno già divergendo.

---

## Soluzione proposta

### Nuovo componente: `components/modal-selezione-articolo.tsx`

Props:
```typescript
type Props = {
  listini: ListinoItem[]          // tutti gli articoli disponibili
  isStaff?: boolean
  isLoggedIn?: boolean
  onClose: () => void
  onConfirm: (data: ConfirmData) => Promise<{ ok: boolean; error?: string }>
}

type ConfirmData = {
  listinoId: number
  larghezza?: number
  altezza?: number
  quantita?: number
  piano?: number
  km?: number
  peso?: number
  colore?: string
  note?: string
}
```

Il componente gestisce internamente:
- Tutta la cascata filtri (tipo → sottocategoria → fase → materiale → tipologia → ambiente → fascia → marca → serie)
- Linguette (filtro_1–4)
- Griglia thumbnail con toggle
- Lookup Descrizione
- Campi extra dinamici basati su `richiede_*` dell'articolo selezionato
- Bottoni Conferma (disabilitato finché `listinoId` non è impostato) e Annulla (rosso)
- Layout: `maxWidth: 720`, `gridTemplateColumns: 'minmax(0, 1fr)'`

### Adattamento preventivo

`AggiungiModale` in `preventivo-client.tsx` viene sostituita con `<ModaleSelezioneArticolo>`. L'`onConfirm` chiama la server action `aggiungiArticolo` passando `preventivo_id`, `parent_id` (se presente) e i dati della modale.

### Adattamento carrello

Il blocco `type: 'aggiungi'` in `carrello-client.tsx` viene sostituito con `<ModaleSelezioneArticolo>`. L'`onConfirm` chiama `aggiungiArticoloAlCarrello`.

---

## File coinvolti

| File | Operazione |
|------|-----------|
| `components/modal-selezione-articolo.tsx` | **Nuovo** — componente condiviso |
| `app/clienti/preventivi/[id]/preventivo-client.tsx` | Rimuovere `AggiungiModale`, usare il componente condiviso |
| `app/area-clienti/carrello-preventivo/carrello-client.tsx` | Rimuovere blocco `type: 'aggiungi'`, usare il componente condiviso |

Il tipo `ListinoItem` già esportato da `carrello-client.tsx` può diventare il tipo condiviso (spostato nel nuovo file o in `lib/types.ts`).

---

## Note

- La modale preventivo ha più campi `richiede_*` (quantita, piano, km, peso) rispetto al carrello (larghezza, altezza, colore, note). Il componente condiviso li mostra tutti dinamicamente; l'`onConfirm` riceve solo quelli compilati.
- `isCaratteristicaMode` e `altriParentIds` (logica "Applica a tutti") restano specifici del preventivo — possono essere props opzionali.
