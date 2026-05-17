# Registrazione cliente → tabella clienti + accesso condizionato

**Data:** 2026-05-17  
**Stato:** completato

## Obiettivo

Al momento della registrazione, il nuovo utente viene inserito solo in `users` (con `is_active=0`).  
Si vuole:

1. **All'atto della registrazione** → inserire anche in `clienti` con `sconto_pct = 5` (sconto di benvenuto).
2. **Prima che l'admin abiliti l'utente** (`is_active = 0`) → il cliente loggato può accedere **solo** a `/area-clienti/preventivi`.
3. **Dopo l'abilitazione** (`is_active = 1`) → il cliente può accedere a **tutte** le pagine `areaClientiPages` (Ordini, Cantieri, Preventivi, Documenti, Fatture).

## File coinvolti

### 1. `app/registrazione/actions.ts` — `verifyPhone`
Dopo l'INSERT in `users` (riga 196-199), aggiungere un INSERT in `clienti`:
```sql
INSERT INTO clienti (tipo, nome, cognome, ragione_sociale, email, telefono, sconto_pct)
VALUES ('privato', ?, ?, '', ?, ?, 5)
ON DUPLICATE KEY UPDATE sconto_pct = IF(sconto_pct = 0, 5, sconto_pct)
```
Usa `ON DUPLICATE KEY` perché potrebbe già esistere (email univoca su `clienti`).

### 2. Protezione pagine area-clienti non-Preventivi
Le pagine:
- `app/area-clienti/ordini/page.tsx`
- `app/area-clienti/cantieri/page.tsx`
- `app/area-clienti/documenti/page.tsx`
- `app/area-clienti/fatture/page.tsx`

Ognuna già legge i cookies per il ruolo. Aggiungere: se `role === 'cliente'` e `is_active = 0` in DB → `redirect('/area-clienti/preventivi')`.  
Query: `SELECT is_active FROM users WHERE username = ? LIMIT 1`.

### 3. Navigazione — mostrare/nascondere voci area-clienti
Nel layout root (`app/layout.tsx`) o nel componente `Navbar`, leggere `is_active` dall'utente loggato e passarlo alla navbar per filtrare le voci area-clienti.  
Strategia: aggiungere `clienteAbilitato: boolean` come prop alla navbar; se `false`, mostrare solo la voce Preventivi nell'area-clienti.

## Scelte tecniche
- Nessuna nuova colonna DB: `is_active` in `users` è già il flag di abilitazione.
- `clienti.sconto_pct` già esiste (ALTER TABLE con catch già presente in altri punti).
- Il controllo `is_active` viene fatto a livello di singola page (server component), non middleware — coerente con il pattern esistente.

## Note
- `is_active = 0` è lo stato di default al momento della registrazione (già impostato: `VALUES (?, ?, 'cliente', 0, ...)`).
- Quando l'admin clicca "Attiva" in Gestione Utenti, `is_active` diventa 1 → il cliente ottiene accesso completo senza ulteriori modifiche.
