# Allineamento visivo preventivo-detail → carrello-preventivo

**Stato**: completato  
**Data**: 2026-06-01

---

## Obiettivo

Rendere `/area-clienti/preventivi/[id]` (componente `preventivo-client.tsx`) visivamente coerente con `/area-clienti/carrello-preventivo` nelle parti strutturalmente equivalenti.

---

## Differenze rilevate e interventi previsti

### 1. Numerazione articoli: `1` → `Rif#001`
- Colonna `#` della tabella: sostituire il numero intero con `Rif#001`, `Rif#002`, ecc. (stesso formato già adottato nelle stampe)
- Intestazione colonna: `#` → `Rif#`

### 2. Bottoni barra azioni: `padding 9px` → `height:42 borderRadius:21`
- Tutti i bottoni nel pannello azioni (Aggiungi articolo, Ripeti articolo, Stampa/PDF, Inoltra richiesta, Invia al cliente, Accetta, Rifiuta, Annulla preventivo)
- Stessa convenzione già applicata nelle pagine stampa

### 3. Bottoni nella tabella (Elimina ✕, Modifica ✏, Preview 👁): `width:28` → `height:42 width:42 borderRadius:21`
- Allineamento con i bottoni circolari del carrello

### 4. Colonna azioni tabella: aggiungere colonna hamburger come nel carrello
- Nel carrello la prima colonna mostra l'icona hamburger (con pallini) come header e il numero `Rif#001` nella riga
- Nel preventivo la prima colonna mostra `#` come header e il numero nella riga
- Uniformare: header `Rif#` → icona hamburger, celle → `Rif#001`

### 5. Tabella: header colonne
- Colonna eye+gear → eye+hamburger (già fatto nel carrello, portare coerenza visiva nell'header `#`)

---

## File coinvolti

| File | Modifica |
|---|---|
| `app/clienti/preventivi/[id]/preventivo-client.tsx` | Tutti gli interventi sopra — è il componente condiviso usato da entrambe le route staff e cliente |

---

## Note

- Il componente è condiviso tra `/clienti/preventivi/[id]` (staff) e `/area-clienti/preventivi/[id]` (cliente) — le modifiche si propagano automaticamente su entrambi
- Non viene toccata la logica, solo lo stile
