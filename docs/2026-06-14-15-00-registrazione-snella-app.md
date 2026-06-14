# Registrazione snella app

**Data:** 2026-06-14  
**Stato:** completato

## Obiettivo

Creare un flusso di registrazione semplificato per `/app/registrazione`, separato dal flusso completo del sito vetrina. L'utente inserisce solo **username, cellulare, password** e riceve un **codice SMS** per completare la verifica. Nessuna email richiesta.

## Campi richiesti

- `username` — minimo 3 caratteri, solo lettere/numeri/underscore/punti/trattini
- `cellulare` — formato `+39...`
- `password` — minimo 8 caratteri
- (campo `password2` per conferma)

## Validazioni unicità

- Username già in uso → errore preciso
- Cellulare già in uso → errore preciso

## Flusso

1. **Step 1 — Form**: username + cellulare + password → server action `startAppRegistration`
   - Valida campi
   - Controlla unicità username e cellulare nella tabella `users`
   - Inserisce in `pending_registrations` con: `email_verified = 1` (skip email), `phone_code = OTP`, campi opzionali (nome/cognome/email/data_nascita/luogo_nascita) impostati a stringa vuota o default
   - Invia SMS con OTP
   - Ritorna `pendingId`

2. **Step 2 — Verifica SMS**: OTP a 6 cifre → server action `verifyAppPhone`
   - Recupera pending con `email_verified = 1 AND phone_verified = 0`
   - Verifica codice e scadenza
   - Crea utente in `users` (nome/cognome/email vuoti, `is_active = 0`)
   - Crea record in `clienti`
   - Login automatico (cookie `session_user` + `session_role`)
   - Notifica email a admin
   - Cancella pending

## File coinvolti

| File | Azione |
|------|--------|
| `app/app/registrazione/actions.ts` | NUOVO — `startAppRegistration`, `verifyAppPhone`, `resendAppPhoneCode` |
| `app/app/registrazione/app-registration-flow.tsx` | NUOVO — componente client a 2 step |
| `app/app/registrazione/page.tsx` | MODIFICA — usa `AppRegistrationFlow` invece di `RegistrationFlow` |

## Note tecniche

- `pending_registrations` già ha tutte le colonne necessarie; usiamo `email_verified = 1` subito per saltare step email
- I campi `nome`, `cognome`, `email`, `data_nascita`, `luogo_nascita` vengono salvati vuoti/default; l'admin potrà completarli dal pannello utenti
- La logica di `verifyAppPhone` ricalca `verifyPhone` esistente ma senza check `email_verified = 1` perché lo impostiamo già in inserimento
- Il componente app usa stile `isApp` (bottoni `btn-*-app`, font monospace)

## Riepilogo implementazione

Tutti e tre i file previsti sono stati creati/aggiornati senza deviazioni dal piano. TypeScript senza errori (`npx tsc --noEmit`). Il `verifyAppPhone` include anche:
- `ALTER TABLE` opzionali per aggiungere colonne mancanti (`.catch(() => {})`)
- Notifica email a `leonardodigiovanni@tiscali.it` + insert in `email_inbox` al completamento
- `is_active = 0` sull'utente creato (coerente col flusso standard)
