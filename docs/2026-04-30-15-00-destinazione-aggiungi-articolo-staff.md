# Destinazione articolo per dipendenti — Aggiungi articolo al preventivo

**Stato**: completato  
**Data**: 2026-04-30

## Obiettivo

Quando un dipendente/admin usa il form "Aggiungi articolo al preventivo" (componente `AggiungiArticoloForm` nelle pagine catalogo/serramenti), la destinazione dell'articolo aggiunto dipende dallo stato del carrello:

- **Carrello non vuoto** → aggiunge sempre al carrello cookie (comportamento attuale, nessun selettore)
- **Carrello vuoto** → mostra una tendina di destinazione con:
  - `Nuovo carrello` (opzione default se nessuna scelta precedente valida)
  - Lista preventivi in stato `bozza` o `richiesto`, ordinata con l'ultima scelta per prima

L'ultima scelta è persistita in `localStorage` (`digi_prev_dest`). Al prossimo apertura del form, se il preventivo scelto non è più in bozza/richiesto, la tendina torna a `Nuovo carrello` in prima posizione.

## File coinvolti

1. **`app/brand/cataloghi/actions.ts`** — nuova action `aggiungiAlPreventivoDaCatalogo` che, dato un `preventivo_id` e i dati del form, recupera il listino e inserisce in `preventivo_articoli`, poi ricalcola l'importo del preventivo
2. **`components/aggiungi-articolo-form.tsx`** — aggiunta prop `preventiviBozza?: {id:number; label:string}[]` e `cartNonVuoto?: boolean`; logica tendina destinazione; submit biforcato (cart vs preventivo)
3. **`app/brand/cataloghi/[id]/page.tsx`** — se staff: legge cookie carrello + fetchs preventivi bozza/richiesto, li passa al form
4. **`app/serramenti/infissi-in-alluminio/page.tsx`** — stesso

## Passi principali

1. Nuova action `aggiungiAlPreventivoDaCatalogo(_,fd)`:
   - Legge `preventivo_id`, `listino_id`, `larghezza`, `altezza`, `ante`, `quantita`, `colore`, `note`
   - Query listino per `categoria`, `produttore`, `descrizione`, `unita`, `prezzo_vendita`, `sconto_articolo`
   - INSERT in `preventivo_articoli`
   - Ricalcola e aggiorna `importo` su `preventivi`

2. Nuova funzione helper `getPreventiviBozza()` nelle pagine server che fetch preventivi `bozza` o `richiesto` con label `"N° - NomeCliente - Descrizione"`

3. Nel form (`AggiungiArticoloForm`):
   - Se `cartNonVuoto` o non staff → nessun selettore (comportamento attuale)
   - Se staff e cart vuoto → mostra `<select>` sopra i filtri con `Nuovo carrello` + preventivi; ordina mettendo `lastDest` per primo se ancora valido
   - `lastDest` letto/scritto in `localStorage` al momento del submit
   - Submit: se dest=`cart` → `aggiungiAlCarrello`; se dest=ID numerico → `aggiungiAlPreventivoDaCatalogo`

## Scelte tecniche

- `localStorage` per la persistenza dell'ultima scelta (client-side, nessun cookie aggiuntivo)
- La tendina destinazione non appare se cart non vuoto → nessun cambio UX per il caso più comune
- `aggiungiAlPreventivoDaCatalogo` è una nuova action standalone, non riutilizza `aggiungiArticolo` (diverso shape del FormData)

## Note implementazione

- Stati lavorabili usati: `'bozza'` e `'inviato'` (non 'richiesto' come scritto nel piano iniziale — corretto su indicazione utente)
- `useActionState` rimosso e sostituito con `useTransition` + `useState<CartResult | null>` per gestire il submit biforcato
- `CartResult` esteso con `preventivoId?: number` per portare l'ID al messaggio di successo
- La tendina destinazione appare **solo se** `isStaff && !cartNonVuoto && preventiviBozza.length > 0`; in caso contrario il comportamento è identico al precedente
- Il testo del pulsante cambia in "Aggiungi al preventivo" quando la destinazione è un preventivo esistente
