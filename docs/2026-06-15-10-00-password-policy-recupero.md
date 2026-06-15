# Password policy + Recupero credenziali app

**Data:** 2026-06-15  
**Stato:** in pianificazione

---

## Obiettivo

1. **Password policy** — validazione lato client e server: minimo 8 caratteri, almeno una maiuscola, una minuscola, un numero, un simbolo.
2. **Recupero credenziali** — flow da `/app/login` via SMS OTP che permette di impostare una nuova password.

---

## Funzionalità 1 — Password policy

### Dove si applica
- `app/app/registrazione/app-registration-flow.tsx` — campo password nella registrazione app
- `app/registrazione/` — registrazione sito (se presente campo password)
- Form nuova password del recupero credenziali (nuovo)

### Implementazione
- Funzione `validatePassword(pw: string): string | null` in `lib/password.ts` — restituisce messaggio di errore o null se ok
- Validazione **server-side** nelle action (prima dell'INSERT/UPDATE)
- Validazione **client-side** inline sotto il campo per feedback immediato (stessa funzione importata)

---

## Funzionalità 2 — Recupero credenziali

### Entry point
Link sotto il form login in `app/app/login/page.tsx`:  
`"Non ricordi le credenziali? Recuperale"`

### Flow (3 fasi — stesso stile `/app/registrazione`)
1. **Fase cellulare** — input `+39` fisso + numero; hidden input invia valore completo; bottone "Invia codice"
2. **Fase OTP SMS** — input codice 6 cifre; bottone "Verifica"; link "Reinvia"
3. **Fase nuova password** — input "Nuova password" + "Ripeti password"; validazione policy; bottone "Salva"

### Tabella DB
```sql
CREATE TABLE IF NOT EXISTS recupero_password (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  phone_code CHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_username (username)
)
```

### Server actions — `app/app/recupero-password/actions.ts`
- `avviaRecupero(fd)` — cerca utente per cellulare, genera OTP, invia SMS, inserisce in `recupero_password`
- `verificaRecupero(pendingId, code)` — verifica OTP
- `salvaPassword(pendingId, nuovaPassword)` — valida policy, UPDATE users SET password = ?, DELETE riga recupero

### File coinvolti
- `lib/password.ts` — validazione policy (nuovo)
- `app/app/recupero-password/actions.ts` — server actions (nuovo)
- `app/app/recupero-password/recupero-form.tsx` — client form 3 fasi (nuovo)
- `app/app/recupero-password/page.tsx` — server page (nuovo)
- `app/app/login/page.tsx` — aggiunta link "Recupera"
- `app/app/registrazione/app-registration-flow.tsx` — applica validazione password
- `app/app/registrazione/actions.ts` — applica validazione password lato server

---

## Note tecniche
- Stile identico a `/app/registrazione`: `sfondo-riquadri-app`, `btn-green-app`, `btn-gray-app`, `btn-black-app`, font monospace
- In trial Twilio: SMS funziona solo verso numeri verificati
- La password viene salvata in plain text (come da architettura attuale)
