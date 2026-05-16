# Stato "Richiesto" preventivo — bottone Inoltra richiesta

**Stato**: completato
**Data**: 2026-04-30

---

## Obiettivo

Il cliente, dalla pagina del proprio preventivo in stato `bozza`, può cliccare "Inoltra richiesta". Si apre una modale di conferma; all'invio lo stato diventa `richiesto` e i bottoni di modifica scompaiono.

---

## Flusso

1. Preventivo in `bozza` + utente non-staff → bottone **"Inoltra richiesta"** visibile
2. Click → modale con:
   - **Email** (pre-compilata, modificabile)
   - **Cellulare** (pre-compilato, modificabile)
   - **N° preventivo** (sola lettura)
   - **Note** (textarea libera)
   - Bottoni **"Inoltra"** e **"Annulla"**
3. Click "Inoltra" → server action `inoltroRichiesta`:
   - Verifica che il preventivo appartenga al cliente loggato
   - `UPDATE preventivi SET stato = 'richiesto' WHERE id = ?`
   - Salva le note aggiuntive se compilate (append a `preventivi.note`)
4. Dopo l'invio → `router.refresh()`; lo stato diventa `richiesto`, i bottoni "Aggiungi articolo" e "Articolo del tipo precedente" non sono più visibili

---

## Stato macchina aggiornato (solo lato cliente)

| Stato | Bottone "Inoltra" | Bottoni aggiungi articolo |
|-------|-------------------|--------------------------|
| `bozza` | Visibile | Visibili |
| `richiesto` | Nascosto | Nascosti |
| altri | Nascosto | Nascosti |

---

## File coinvolti

| File | Modifica |
|------|----------|
| `app/clienti/preventivi/actions.ts` | Nuova action `inoltroRichiesta`; migrazione ENUM stato se necessario |
| `app/clienti/preventivi/[id]/preventivo-client.tsx` | Tipo `Preventivo.stato` aggiunge `'richiesto'`; nuove props `clienteEmail`/`clienteCellulare`; modale + bottone |
| `app/clienti/preventivi/[id]/page.tsx` | Fetch email+cellulare dal cliente associato; passa props |
| `app/area-clienti/preventivi/[id]/page.tsx` | Fetch email+cellulare dall'utente loggato; passa props |

---

## Note tecniche

- `stato` nella tabella `preventivi` è attualmente gestito come stringa; aggiungere migrazione `ALTER TABLE preventivi MODIFY COLUMN stato ENUM(...)` oppure lasciare VARCHAR e aggiungere solo la validazione in codice (più semplice, già funzionante).
- Email e cellulare vengono letti da `clienti` (se il preventivo ha `cliente_id`) o da `users` (tramite `session_user` → email).
- Al momento dell'inoltro, la action inserisce anche un record in `email_inbox`:
  - `tipo`: `'richiesta_preventivo'`
  - `oggetto`: `Richiesta preventivo N° {numero}`
  - `corpo`: note del cliente, n° preventivo, email, cellulare (testo semplice)
  - `letto`: 0
  Questo fa apparire il messaggio nella sezione `/area-lavoro/email` dei dipendenti.
- Nessuna email/SMS reale per ora — solo la inbox interna.
