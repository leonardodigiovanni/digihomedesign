# Cantieri — permessi per ruolo e toggle per-cliente

**Data:** 2026-04-11  
**Stato:** completato

---

## Obiettivo

Implementare la logica corretta di visibilità per le due voci di navigazione cantieri:

| Ruolo       | Vede "Cantieri" (id 28) | Vede "I Miei Cantieri" (id 31) |
|-------------|-------------------------|---------------------------------|
| admin       | ✓ (sempre)              | ✗ (mai — vede già tutto)        |
| dipendente  | ✓ (se abilitato nei rolePermissions, es. aggiungendo 28) | ✗ (mai) |
| cliente     | ✗ (mai)                 | ✓ solo se admin ha abilitato questo specifico utente |

In più, l'admin può **abilitare/disabilitare "I Miei Cantieri" per ogni singolo utente** con ruolo `cliente`, dalla pagina Gestione Utenti.

---

## Problemi attuali

1. **Admin vede page 31**: `visibleInternalPages` restituisce tutti gli internalPages per admin, incluso id 31. Da escludere.
2. **Visibilità page 31 solo a livello di ruolo**: attualmente se il ruolo `cliente` ha 31 nei suoi permessi, lo vedono TUTTI i clienti. Non c'è granularità per-utente.
3. **Page 28 per dipendenti**: già configurabile via `rolePermissions['dipendente']` in settings (basta che l'admin aggiunga 28) — nessuna modifica al codice necessaria per questo.

---

## Soluzione

### 1. DB — nuova colonna `users.cantieri_visibili`

```sql
ALTER TABLE users ADD COLUMN cantieri_visibili TINYINT(1) NOT NULL DEFAULT 1
```

- Default `1`: i clienti già esistenti continuano a vedere "I Miei Cantieri"
- L'admin può impostarlo a `0` per nascondere la voce a uno specifico cliente

### 2. `lib/nav-config.ts`

`visibleInternalPages`: aggiungere esclusione page 31 per admin:
```ts
if (role === 'admin') return internalPages.filter(p => p.id !== 31)
```

### 3. `app/layout.tsx`

Se l'utente loggato è un `cliente`, fare una query DB per leggere `cantieri_visibili`. Se `= 0`, rimuovere page 31 dall'elenco dei permessi prima di passarli a Navbar.

Non si aggiunge nessuna prop nuova alla Navbar: il layout manipola il `rolePermissions` già esistente prima di passarlo.

```ts
// Se cliente con cantieri_visibili = 0 → rimuove 31 da rolePermissions['cliente']
if (role === 'cliente' && !cantieriVisibili) {
  adjustedPermissions.cliente = (rolePermissions.cliente ?? []).filter(id => id !== 31)
}
```

### 4. `app/gestione-utenti/page.tsx`

Aggiungere `cantieri_visibili` alla SELECT degli utenti.

### 5. `app/gestione-utenti/gestione-utenti-client.tsx`

Per gli utenti con `role === 'cliente'`, aggiungere una colonna "I Miei Cantieri" con badge on/off e pulsante toggle. La colonna è visibile solo quando si vede almeno un utente cliente.

### 6. `app/gestione-utenti/actions.ts`

Nuova action `toggleCantieriCliente(username)` che fa `UPDATE users SET cantieri_visibili = 1 - cantieri_visibili WHERE username = ?`.

---

## File coinvolti

| File | Modifica |
|---|---|
| `lib/nav-config.ts` | Escludi page 31 da admin |
| `app/layout.tsx` | Leggi `cantieri_visibili` per utente cliente; aggiusta rolePermissions |
| `app/gestione-utenti/page.tsx` | Aggiungi `cantieri_visibili` alla SELECT |
| `app/gestione-utenti/gestione-utenti-client.tsx` | Colonna toggle "I Miei Cantieri" per clienti |
| `app/gestione-utenti/actions.ts` | Action `toggleCantieriCliente` |

---

## Note

- La colonna `cantieri_visibili` ha default `1` quindi nessun cliente perde accesso senza azione esplicita dell'admin.
- La route `/cantieri` resta unica: page 28 e page 31 puntano entrambi lì, il contenuto è differenziato dal ruolo come già implementato.
- Non serve modificare `app/cantieri/page.tsx` o `cantieri-client.tsx`.
