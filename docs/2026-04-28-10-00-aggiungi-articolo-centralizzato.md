# Form Aggiungi Articolo — Centralizzato con ante/misure/quantità

**Stato:** completato  
**Data:** 2026-04-28

## Obiettivo

Sostituire il form attuale (dropdown + quantità inline) con un flusso a due step centralizzato, riusabile in:
- `app/brand/cataloghi/[id]` — scheda catalogo
- `app/serramenti/infissi-in-alluminio` (e altre pagine prodotto)
- area personale preventivo (`area-clienti/preventivi/[id]`) — da valutare separatamente

## Flusso UI

**Step 1** — Selezione articolo:
```
[ Dropdown articoli ▾ ]   [ Aggiungi → ]
```

**Step 2** — Form dettagli (appare inline dopo il click su Aggiungi):
```
┌─────────────────────────────────────────┐
│ Articolo selezionato: [nome]            │
│                                         │
│ N° ante: [ 1 ]                          │
│ Larghezza (cm): [ ___ ]                 │
│ Altezza (cm):   [ ___ ]                 │
│ Quantità:       [ 1  ]                  │
│                                         │
│ [Annulla]  [Aggiungi al carrello]       │
└─────────────────────────────────────────┘
```

## Modifiche effettive

### 1. Nuovo componente centralizzato
`components/aggiungi-articolo-form.tsx` — client component `'use client'`
- Definisce anche il tipo `ArticoloListino`
- Due step con stato locale (`useState`) e `useEffect` per reset post-submit
- Import di `aggiungiAlCarrello` da `@/app/brand/cataloghi/actions`

### 2. `app/brand/cataloghi/[id]/aggiungi-articolo.tsx`
Ora re-esporta semplicemente dal nuovo componente centralizzato:
```ts
export type { ArticoloListino } from '@/components/aggiungi-articolo-form'
export { default } from '@/components/aggiungi-articolo-form'
```
Tutti i file che importavano da qui continuano a funzionare senza modifiche.

### 3. `app/brand/cataloghi/actions.ts`
- Tipo `CartItem` esteso: `{ id, q, ante?, l?, h? }`
- `aggiungiAlCarrello`: legge `ante`, `larghezza`, `altezza` da FormData; sempre push (mai merge per id) così ogni riga può avere misure diverse
- `salvaCarrelloComePreventivo`: usa `item.ante ?? 1`, `item.l ?? 0`, `item.h ?? 0` per `preventivo_articoli`

### 4. `app/area-clienti/carrello-preventivo/page.tsx`
- Tipo `CartItem` locale con i campi opzionali `ante`, `l`, `h`
- `getArticoliDaCookie` passa questi valori all'`ArticoloCarrello`

### 5. `app/area-clienti/carrello-preventivo/carrello-client.tsx`
- `ArticoloCarrello` esteso con `ante?`, `larghezza_cm?`, `altezza_cm?`
- Mostra una riga grigia sotto la descrizione con i valori se presenti: `2 ante · L: 120 cm · H: 210 cm`

## Note
- Ante, larghezza e altezza sono opzionali: se non compilati non vengono salvati nel cookie (ante=1 non viene salvato, larghezza/altezza=0 non vengono salvati)
- Il dropdown mostra solo descrizione e produttore, senza prezzo né quantità
- Ogni aggiunta crea sempre una nuova riga nel carrello (no merge per id identico), così dimensioni diverse dello stesso articolo restano separate
