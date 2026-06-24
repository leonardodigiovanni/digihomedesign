# Custom Select Lookup — componente riutilizzabile

**Stato**: in pianificazione

## Obiettivo

Sostituire tutti i `<select>` nativi del sito (escluso `/app`) con un componente custom che:
- Ha sfondo bianco garantito su tutti i browser (Firefox incluso)
- Supporta filtro testuale mentre si digita
- Ha aspetto visivo coerente con lo stile esistente

## Componente

**File**: `components/select-lookup.tsx`

**Props**:
```ts
type SelectLookupProps = {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  style?: React.CSSProperties
  disabled?: boolean
}
```

**Comportamento**:
- Campo input testuale che mostra la label dell'opzione selezionata
- Al click/focus mostra un div assoluto con la lista filtrata
- Mentre si digita, filtra le opzioni per label (case-insensitive, match parziale)
- Click su un'opzione → seleziona e chiude
- Click fuori → chiude senza modificare
- Tasto Escape → chiude senza modificare
- Pulsante ✕ a destra per deselezionare (se value != '')
- Freccia ▾ a destra (nascosta quando c'è ✕)
- Max-height 240px con overflow-y:auto sul dropdown
- z-index 9999 per stare sopra tutto

**Stile**:
- Input: `background:#fff`, `border:1px solid #ccc`, `borderRadius:5`, `padding:5px 8px`, `fontSize:13`
- Dropdown: `background:#fff`, `border:1px solid #ccc`, `borderRadius:5`, `boxShadow:0 4px 16px rgba(0,0,0,0.12)`
- Ogni riga opzione: `padding:6px 10px`, hover `background:#f0f0f0`
- Riga selezionata: `background:#e8f0fe`
- Riga "Nessun risultato": testo grigio, non cliccabile

## Test

Prima pagina: `/clienti/preventivi/[id]` — `ClienteSelector` in `preventivo-client.tsx`
- Sostituisce il `<select>` a riga 328 con `<SelectLookup>`
- Le option attuali diventano `options={[{ value: '', label: '— Nessun cliente —' }, ...clienti.map(c => ({ value: String(c.id), label: c.label }))]}`

## Estensione massiva (dopo test)

Cercare tutti i `<select>` del sito fuori da `/app/` e sostituirli con `<SelectLookup>`.
File da escludere: qualsiasi file sotto `app/area-app/`, `app/app-*`, o con percorso che inizia con `app/app`.

## File coinvolti

1. `components/select-lookup.tsx` — nuovo componente (da creare)
2. `app/clienti/preventivi/[id]/preventivo-client.tsx` — prima integrazione di test
3. (fase 2) tutti gli altri file del sito con `<select>`

## Scelte tecniche

- Componente `'use client'` puro, nessuna dipendenza esterna
- Gestione chiusura al click esterno via `useEffect` + `mousedown` su `document`
- Posizionamento dropdown: `position:absolute` relativo al wrapper `position:relative`
- Il wrapper ha `display:inline-block` con larghezza ereditata dall'esterno via `style` prop
- Niente Portals — il z-index 9999 è sufficiente per i casi d'uso attuali
