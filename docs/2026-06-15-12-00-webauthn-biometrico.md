# WebAuthn — Accesso con impronta / Face ID

**Data:** 2026-06-15  
**Stato:** completato

## Obiettivo

Permettere all'utente di accedere all'app con impronta digitale o Face ID invece di digitare la password, usando lo standard WebAuthn (Passkeys).

## Compatibilità

- Android Chrome → impronta digitale
- iPhone Safari 16.4+ → Face ID / Touch ID (solo se PWA installata)
- Desktop Chrome/Edge → Windows Hello, TouchID Mac
- Browser senza supporto → il pulsante non appare

## Flusso

### Registrazione (una tantum, dopo login con password)
1. Utente si logga normalmente con password
2. Se il dispositivo supporta WebAuthn → compare banner "Vuoi accedere più velocemente? Usa l'impronta"
3. Utente clicca → il dispositivo mostra il prompt biometrico
4. Il browser genera una coppia di chiavi: la chiave privata resta sul dispositivo, la pubblica va al server
5. Il server salva la chiave pubblica nel DB

### Accesso biometrico (accessi successivi)
1. Nella pagina login compare il pulsante "Accedi con impronta"
2. Utente clicca → server invia una challenge → dispositivo firma con la chiave privata
3. Il server verifica la firma con la chiave pubblica salvata
4. Se ok → cookie sessione 30gg → utente loggato

## Dipendenze

```bash
npm install @simplewebauthn/server @simplewebauthn/browser
```

Le librerie gestiscono tutta la crittografia. Sono le più usate per WebAuthn in Node.js.

## Tabelle DB

```sql
CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  credential_id VARCHAR(500) NOT NULL,
  public_key TEXT NOT NULL,
  sign_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cred (credential_id)
);

CREATE TABLE IF NOT EXISTS webauthn_challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_id VARCHAR(100) NOT NULL UNIQUE,
  challenge VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL
);
```

## File coinvolti

- `app/app/login/page.tsx` — pulsante "Accedi con impronta" + banner "Registra impronta" post-login
- `app/app/login/webauthn-login.tsx` — client component per il flusso biometrico
- `app/app/login/webauthn-register.tsx` — client component per la registrazione dell'impronta
- `app/app/login/webauthn-actions.ts` — server actions: genera/verifica challenge registrazione e autenticazione

## File effettivi creati/modificati

- `app/app/webauthn/actions.ts` — server actions: ensureTables, storeChallenge, consumeChallenge, getWebAuthnRegOptions, verifyWebAuthnReg, getWebAuthnAuthOptions, verifyWebAuthnAuth, hasWebAuthnCredential, removeWebAuthnCredential
- `app/app/webauthn/login-btn.tsx` — pulsante "Accedi con impronta" (client, condizionale su supporto browser)
- `app/app/webauthn/register-prompt.tsx` — banner "Registra impronta" post-login (client, dismettibile per sessione)
- `app/app/login/page.tsx` — aggiunto `<WebAuthnLoginBtn />`
- `app/app/page.tsx` — aggiunto `<WebAuthnRegisterPrompt />` con check `hasCredential` server-side

## Note

- Le tabelle vengono create automaticamente con `CREATE TABLE IF NOT EXISTS` alla prima chiamata — non serve SQL manuale
- Richiede HTTPS (funziona su localhost solo con Chrome con flag apposito)
- iOS: solo se l'app è installata come PWA (Add to Home Screen)
- La chiave privata non lascia mai il dispositivo — sicurezza elevata
- L'utente può avere più credenziali (più dispositivi)
- In produzione funziona subito (il sito ha HTTPS)
- Il prompt di registrazione si sopprime per sessione via sessionStorage (`wa_prompt_dismissed_<username>`)
