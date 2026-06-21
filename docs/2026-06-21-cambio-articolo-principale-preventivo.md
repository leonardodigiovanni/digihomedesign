# Cambio articolo principale con cascade caratteristiche

**Data:** 2026-06-21  
**Stato:** completato

## Obiettivo

Nella modale di modifica di un articolo principale (root), permettere di cambiare anche il prodotto del listino (tipo → marca → modello) mantenendo misure e quantità, e gestendo automaticamente le caratteristiche figlie già associate:

- **Eliminare** le caratteristiche che il nuovo articolo non supporta (es. il nuovo non richiede montaggio → il figlio "montaggio" sparisce)
- **Mantenere** le caratteristiche compatibili con entrambi (es. entrambi richiedono colore → il figlio colore resta)
- **Ricalcolare** i prezzi dei figli rimasti in base al nuovo prezzo base del root

## Caso d'uso

Infisso 2 ante → si vuole sostituire con 1 anta fissa + 1 mobile (stesso tipo, altra marca/modello). Stesse misure, stesso colore, stesso vetro. Con una sola operazione si aggiorna tutto.

## File coinvolti

- `app/clienti/preventivi/[id]/preventivo-client.tsx` — `ModificaArticoloModal` + chiamata al componente
- `app/clienti/preventivi/actions.ts` — `modificaArticolo`

## Logica compatibilità caratteristiche

Le caratteristiche nel listino hanno `produttore = marca`: "Vetro Schüco" è diverso da "Vetro Aluk".

Un figlio è **compatibile** (si mantiene) solo se valgono **entrambe** le condizioni:

1. `listino_figlio.produttore === nuova_marca_root` (stessa marca)
2. Il flag del figlio è supportato dal nuovo root listino

| Caso | Risultato |
|---|---|
| Stesso tipo + stessa marca + modello diverso | Si mantengono i figli i cui flag sono supportati dal nuovo listino |
| Stesso tipo + marca diversa | Si eliminano **tutti** i figli (caratteristiche sono marca-specifiche) |
| Tipo diverso | Si eliminano tutti i figli |

**Dettaglio flag per caso "stessa marca":**

| Flag del figlio (da `listini`) | Compatibile se il nuovo root listino ha |
|---|---|
| `richiede_tipo_colore = 1` | `richiede_tipo_colore = 1` |
| `richiede_tipo_colore_acc = 1` | `richiede_tipo_colore_acc = 1` |
| `richiede_tipo_vetro = 1` | `richiede_tipo_vetro = 1` |
| `richiede_tipo_montaggio = 1` | `richiede_tipo_montaggio = 1` |
| nessun flag (opzionale) | il tipo_prodotto non cambia |

## Passi implementativi

### 1. `ModificaArticoloModal` — solo per articoli root, solo per staff

- Aggiungere prop `children: Articolo[]` (figli dell'articolo root, passati dal componente padre)
- Aggiungere sezione "Cambia articolo" con selettori tipo → marca → modello (filtrati `principale=1`)
- Preview client-side: mostrare elenco caratteristiche che verranno **mantenute** (verde) e **eliminate** (rosso)
- Se si seleziona un nuovo listino, aggiungere campo hidden `nuovo_listino_id` al form

### 2. Chiamata al componente (riga 1868)

- Passare `children={articoli.filter(a => a.parent_id === editArticolo.id)}`

### 3. `modificaArticolo` in `actions.ts`

- Leggere `nuovo_listino_id` dal FormData (opzionale)
- Se presente:
  - Caricare il nuovo listino (tipo_prodotto, marca, modello, prezzo_base, unita, flags)
  - Caricare i figli correnti con i loro listini
  - Per ogni figlio: calcolare compatibilità → DELETE se non compatibile
  - UPDATE root: listino_id, tipo_prodotto, marca, modello, prezzo_base, unita
- Il ricalcolo prezzi figli esistente (`childRows` loop) rimane invariato

## Scelte tecniche

- La selezione del nuovo articolo è opzionale: se non si cambia il listino, tutto funziona come prima
- Il preview di eliminazione è solo lato client (usa i `listini` già passati alla pagina)
- La cascata di eliminazione avviene server-side in un'unica transazione prima del ricalcolo

## Note

- Solo staff vede la sezione "Cambia articolo" (il cliente non può cambiare l'articolo)
- Se il nuovo listino ha unità diversa (es. da m² a pz) l'utente è responsabile di verificare le misure: le misure/quantità rimangono quelle inserite prima
