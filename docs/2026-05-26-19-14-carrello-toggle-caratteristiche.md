# Carrello — Toggle caratteristiche con bottone ingranaggio

**Data:** 2026-05-26  
**Stato:** completato

## Obiettivo

Nel carrello preventivo (`/area-clienti/carrello-preventivo`), le righe delle caratteristiche degli articoli principali (colore, vetro, montaggio...) e la riga con i bottoni `+Colore`, `+Vetro`, ecc. vengono nascoste/mostrate tramite un bottone toggle nella riga dell'articolo principale.

## Comportamento

- **Bottone ingranaggio (⚙)**: aggiunto ai bottoni di ogni articolo principale
  - **Verde** se ci sono ancora lacune aperte (articolo incompleto)
  - **Nero** se l'articolo è completo (nessuna lacuna)
  - Non compare se l'articolo non ha né caratteristiche né lacune
- **Toggle**: click → mostra/nasconde caratteristiche figlie + riga bottoni lacune
- **Stato iniziale**: tutto espanso (l'utente può collassare)

## Ordine bottoni nella riga

`✏ matita` · `⚙ ingranaggio` · `👁 occhio` · `✕ X`

(attuale: `✕ X` · `✏ matita` · `👁 occhio`)

## File coinvolti

- `app/area-clienti/carrello-preventivo/carrello-client.tsx`
  - Aggiunta stato `collapsedUIDs: Set<number>`
  - Aggiunta funzione `toggleExpand(uid)`
  - Refactor sezione `cg.groups.map(...)`: separare root da children, condizionare visibilità

## Scelte tecniche

- Stato locale `useState<Set<number>>(new Set())` — nessuna persistenza, reset a refresh
- Il `Set` contiene gli UID degli articoli collassati (default: nessuno = tutto espanso)
- I children e la riga lacune sono renderizzati condizionalmente su `!collapsedUIDs.has(root.uid)`
