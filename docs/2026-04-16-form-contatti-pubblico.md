# Form Contatti Pubblico → Email Dipendenti

**Data:** 2026-04-16  
**Stato:** completato

## Obiettivo

Aggiungere un form di contatto su `/brand/contatti` che inserisce un messaggio in `email_inbox` con `tipo='contatto'`, visibile nella sezione Email dei dipendenti.

## Campi del form

- Nome * (testo)
- Cognome (testo, opzionale)
- Email * (email)
- Telefono (testo, opzionale)
- Messaggio * (textarea)

## Struttura dati

Inserimento in `email_inbox`:
- `tipo` = `'contatto'`
- `oggetto` = `"Richiesta contatto: [Nome Cognome] ([email])"`
- `corpo` = HTML con tutti i dati del form
- `letto` = 0

La tabella `email_inbox` viene creata se non esiste (già gestita altrove, ma la action la crea in sicurezza).

## File da creare/modificare

1. `app/brand/contatti/actions.ts` — server action `inviaContatto`
2. `app/brand/contatti/contatto-form.tsx` — client component con form + `useActionState`
3. `app/brand/contatti/page.tsx` — aggiornato per includere il form

## Note

- Nessun login richiesto (form pubblico)
- Dopo invio: messaggio di conferma, form resettato
- Validazione: nome, email, messaggio obbligatori
