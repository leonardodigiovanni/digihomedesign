# App cantieri dipendente: aggiungi cantiere

**Data:** 2026-06-12  
**Stato:** proposta

## Obiettivo

Bottone **+ Aggiungi cantiere** nella lista cantieri dell'app, visibile solo ai dipendenti.
Apre un form inline con i campi essenziali, incluso il lookup cliente.

## Campi del form

| Campo | Tipo | Note |
|-------|------|------|
| Titolo | text | obbligatorio |
| Cliente | select | dropdown dalla lista clienti |
| Indirizzo | text | opzionale |
| Stato | select | default `in_corso` |
| Inizio lavori | date | opzionale |
| Fine lavori | date | opzionale |

## Implementazione

### `app/app/cantiere/page.tsx`
- Caricare lista clienti dal DB quando `isStaff` (come già fatto per l'upload-cantiere)
- Passare `clienti` al componente client

### `app/area-clienti/cantieri/cantieri-cliente-client.tsx`
- Aggiungere prop `clienti: { id: number; label: string }[]`
- Aggiungere `AddCantiereForm` component (analogo ad `AddTaskForm`)
- Mostrare il bottone **+ Aggiungi cantiere** sopra la tabella cantieri (solo `isDipendente`)
- Chiama `addCantiere` da `area-lavoro/cantieri/actions.ts`, poi `router.refresh()`
