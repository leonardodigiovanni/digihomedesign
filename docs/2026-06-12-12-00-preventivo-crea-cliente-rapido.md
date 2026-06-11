# Preventivo — Crea cliente rapido inline

**Data:** 2026-06-12  
**Stato:** completato

## Obiettivo

Nel pannello "Assegna cliente" del preventivo (visibile solo allo staff), aggiungere un bottone **+ Nuovo cliente** che apre un mini-form inline per creare un cliente al volo senza uscire dal preventivo.

## Campi del form

| Campo | Tipo | Note |
|-------|------|------|
| Nome | text | obbligatorio |
| Cognome | text | facoltativo |
| Cellulare | text | facoltativo |

## Implementazione

### `app/area-lavoro/clienti/actions.ts` (o file actions esistente)
- Nuova server action `creaClienteRapido(nome, cognome, cellulare)` che fa `INSERT INTO clienti` con i 3 campi e restituisce l'id del nuovo record.

### `app/clienti/preventivi/[id]/preventivo-client.tsx`
- Nel componente `AssegnaCliente` (quello con la select + bottone Assegna):
  - Aggiungere stato `mostraForm: boolean`
  - Aggiungere bottone **+ Nuovo cliente** (`btn-black-app`) affianco alla select
  - Quando `mostraForm` è true: mostrare 3 input (Nome *, Cognome, Cellulare) + bottone **Crea** (`btn-black-app`) + bottone **Annulla** (`btn-gray-app`)
  - Al click Crea: chiama `creaClienteRapido`, il nuovo cliente viene aggiunto alla lista `clienti` in locale e selezionato automaticamente, poi chiude il form
  - Il genitore riceve `clienti` come prop — serve aggiornare la lista locale o fare `router.refresh()` dopo la creazione

### `app/app/preventivo/[id]/page.tsx`
- Nessuna modifica: carica già la lista clienti quando isStaff

## Note tecniche
- La lista clienti è passata come prop al componente — dopo la creazione aggiorniamo la lista locale con `useState` (aggiunta ottimistica) per non perdere il contesto della pagina
- La nuova action va in un file actions esistente o in `app/clienti/preventivi/[id]/actions.ts`
