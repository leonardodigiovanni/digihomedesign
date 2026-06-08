# Tabella preventivo: colonne e bottoni come il carrello

**Stato**: completato  
**Data**: 2026-06-01

---

## Obiettivo

Allineare completamente la tabella articoli di `preventivo-client.tsx` alla struttura del carrello-preventivo.

---

## Struttura colonne (nuovo ordine)

| Col | Width | Header | Cella root | Cella child |
|---|---|---|---|---|
| 1 | 58px | eye + hamburger icone | btn 👁 (preview) + btn hamburger (expand) | foto thumbnail |
| 2 | 72px | Q.tà / Rif# | N°qty sopra / Rif#001 sotto | — |
| 3 | flex | Articolo | descrizione + dettagli | ↳ descrizione + contributo prezzo |
| 4 | 80px | Prezzo € | prezzo formattato con fmt() | +/− contributo |
| 5 | 58px | ✏ + ✕ icone | btn ✏ (staff) + btn ✕ | btn ✏ (staff) + btn ✕ |

---

## Altre modifiche

- **Expand/collapse figli**: stato `expandedIds: Set<number>` — bottone hamburger mostra/nasconde le righe figlie
- **Bottone hamburger**: btn-red se l'articolo ha lacune (caratteristiche mancanti), btn-black altrimenti
- **Bottone 👁**: btn-gray disabilitato se ha lacune, btn-black altrimenti
- **Formato prezzi**: funzione `fmt(n)` → separatore migliaia `.` e decimali `,` (es. `1.234,56`)
- **Sconti**: rimangono visibili nella colonna prezzo della riga root

---

## File coinvolti

| File | Modifica |
|---|---|
| `app/clienti/preventivi/[id]/preventivo-client.tsx` | Aggiunta `fmt`, stato `expandedIds`, riscrittura sezione tabella |
