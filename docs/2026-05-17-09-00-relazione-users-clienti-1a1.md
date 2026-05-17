# Relazione 1:1 users ↔ clienti

**Data:** 2026-05-17  
**Stato:** in attesa di conferma

## Obiettivo

Stabilire una relazione 1:1 bidirezionale tra `users` e `clienti`:

- `users.cliente_id` → punta a `clienti.id`
- `clienti.utente_id` → punta a `users.id`

Alla registrazione si inserisce in entrambe le tabelle e si fanno puntare i record l'uno all'altro.  
Tutte le pagine area-clienti useranno `users.cliente_id` per trovare i dati del cliente — niente più lookup per email.

## Modifiche DB (via ALTER TABLE al volo)

```sql
ALTER TABLE users   ADD COLUMN cliente_id INT NULL DEFAULT NULL;
ALTER TABLE clienti ADD COLUMN utente_id  INT NULL DEFAULT NULL;
```

## Flusso registrazione (`app/registrazione/actions.ts` — `verifyPhone`)

1. INSERT in `clienti` con i dati del form (nome, cognome, email, cellulare come telefono, sconto_pct=5, tipo='privato') → ottieni `clienteId = insertId`
2. INSERT in `users` con `cliente_id = clienteId` → ottieni `userId = insertId`
3. UPDATE `clienti SET utente_id = userId WHERE id = clienteId`

## Refactor lookup cliente nelle pagine

Ovunque si fa:
```typescript
SELECT email FROM users WHERE username = ?
SELECT id FROM clienti WHERE email = ?
```
si sostituisce con:
```typescript
SELECT cliente_id FROM users WHERE username = ?
```
e si usa direttamente `cliente_id` come `clienti.id`.

## File coinvolti

- `app/registrazione/actions.ts` — doppia INSERT + UPDATE
- `app/area-clienti/preventivi/page.tsx` — lookup cliente_id
- `app/area-clienti/preventivi/[id]/page.tsx` — ownership check via cliente_id
- `app/area-clienti/preventivi/[id]/stampa/page.tsx` — ownership check
- `app/area-clienti/carrello-preventivo/page.tsx` — sconto cliente
- `app/brand/cataloghi/actions.ts` — sconto cliente in salvaCarrelloComePreventivo
- `app/layout.tsx` — nessuna modifica necessaria (usa username/email per altri scopi)

## Cosa NON cambia

- Il flusso di login e i cookie (`session_user`, `session_role`) restano invariati
- Le pagine staff/admin che cercano per email restano invariate
- `is_active` rimane il flag di abilitazione admin
- Il controllo `ownedByUsername` (preventivi dal carrello con `creato_da`) rimane come fallback per i preventivi già esistenti senza `cliente_id`
