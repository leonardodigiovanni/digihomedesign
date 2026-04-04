# Gestione Utenti: flag attivo, notifica registrazione, sezione email, sort/filter

**Data:** 2026-04-01  
**Stato:** completato

---

## Obiettivo

Quattro funzionalità collegate alla gestione utenti:

1. Flag attivo/non attivo — nuovi utenti nascono non attivi, l'admin li attiva manualmente
2. Email di notifica — alla completamento della registrazione, invia email a `leonardodigiovanni@tiscali.it` e salva il messaggio nel DB (sezione email dell'app)
3. Sezione email — nuova pagina che mostra le notifiche in entrata (nuove registrazioni + future richieste di contatto); accessibile a ruolo `email` e a `admin`
4. Gestione Utenti UI — ordinamento colonne asc/desc, filtro per ruolo, mostra stato attivo/non attivo con toggle

---

## File coinvolti

| File | Modifica |
|------|----------|
| `app/registrazione/actions.ts` | `verifyPhone`: `is_active = 0`, niente auto-login, invia email notifica, salva in DB |
| `app/gestione-utenti/actions.ts` | Aggiunge server action `toggleUserActive` |
| `app/gestione-utenti/gestione-utenti-client.tsx` | Colonna stato + toggle, sort colonne, filtro ruolo |
| `app/gestione-utenti/page.tsx` | Nessuna modifica prevista |
| `app/email/page.tsx` | **NUOVO** — server component, legge messaggi da DB |
| `app/email/email-client.tsx` | **NUOVO** — client component, tabella messaggi |
| `app/email/actions.ts` | **NUOVO** — action `markRead` |
| `lib/nav-config.ts` | Aggiunge pagina Email (id 32) in `internalPages` |
| `data/settings.json` | Aggiunge id 32 a `rolePermissions.email` |
| **MySQL** | `CREATE TABLE email_inbox` (vedi sotto) |

---

## Dettagli implementativi

### 1. Nuovi utenti non attivi

In `verifyPhone` (`app/registrazione/actions.ts`):
- Cambia `is_active = 1` → `is_active = 0` nell'INSERT
- Rimuove auto-login dopo la registrazione (no `cookies().set` + no `redirect('/')`)
- Restituisce `{ ok: true }` e il flow mostra uno step finale: *"Registrazione completata! Il tuo account è in attesa di attivazione da parte dell'amministratore."*

### 2. Email di notifica + salvataggio DB

Ancora in `verifyPhone`, dopo l'INSERT dell'utente:
```
sendEmail(
  'leonardodigiovanni@tiscali.it',
  'Nuovo utente registrato — MEF',
  html con nome, cognome, username, email, data registrazione
)
```
E inserisce una riga nella nuova tabella `email_inbox`:
```sql
INSERT INTO email_inbox (tipo, oggetto, corpo, letto, created_at)
VALUES ('nuova_registrazione', 'Nuovo utente: {username}', '...', 0, NOW())
```

### 3. Tabella `email_inbox`

```sql
CREATE TABLE email_inbox (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  tipo        VARCHAR(50)  NOT NULL,   -- 'nuova_registrazione' | 'contatto'
  oggetto     VARCHAR(255) NOT NULL,
  corpo       TEXT         NOT NULL,
  letto       TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Pagina Email (`app/email/`)

- Route: `/email`
- Guard: `session_role === 'email' || session_role === 'admin'`
- Tabella con colonne: Tipo, Oggetto, Data, Stato (letto/non letto)
- Click su riga → espande il corpo del messaggio + chiama `markRead`
- Badge "non letto" su messaggi con `letto = 0`

Nav: aggiunge in `internalPages`:
```ts
{ id: 32, label: 'Email', href: '/email' }
```
E in `data/settings.json`:
```json
"email": [32]
```
L'admin vede tutte le internalPages, quindi non serve modifica per lui.

### 5. Gestione Utenti — toggle attivo/non attivo

- Nuova colonna **Stato** nella tabella (badge verde "Attivo" / grigio "Non attivo")
- Pulsante toggle inline: chiama `toggleUserActive(username)`
- Server action: `UPDATE users SET is_active = 1 - is_active WHERE username = ?`
- `router.refresh()` dopo successo

### 6. Gestione Utenti — sort colonne e filtro ruolo

**Sort:**
- Stato `sortCol: 'username'|'nome'|'email'|'role'|'is_active'` + `sortDir: 'asc'|'desc'`
- Click sull'intestazione colonna → cambia sort/dir
- Icone ▲▼ nell'header attivo

**Filtro ruolo:**
- Dropdown select accanto al campo testo: "Tutti i ruoli" + lista ruoli
- Filtra la lista in aggiunta al filtro testo esistente

---

## Scelte tecniche

- La sezione email è una nuova route dedicata (non `/interno/32`) per semplicità di guard e routing diretto
- `email_inbox` è una tabella separata; non si mischia con `users` né con `pending_registrations`
- Nessuna dipendenza da librerie nuove

---

## Riepilogo modifiche effettive

- `app/registrazione/actions.ts` — `is_active = 0`, rimosso auto-login, aggiunta email notifica + insert `email_inbox`
- `app/registrazione/registration-flow.tsx` — aggiunto `step === 3` (schermata completamento), `Step3` ora riceve `onSuccess`
- `app/gestione-utenti/actions.ts` — aggiunta `toggleUserActive`
- `app/gestione-utenti/gestione-utenti-client.tsx` — riscritto: colonna Stato + toggle, sort colonne, filtro ruolo dropdown
- `app/email/page.tsx` — NUOVO: guard `email|admin`, legge da `email_inbox`
- `app/email/email-client.tsx` — NUOVO: tabella messaggi espandibile, segna letto
- `app/email/actions.ts` — NUOVO: `markRead`
- `lib/nav-config.ts` — pagina id 32 `Email` in `internalPages`
- `data/settings.json` — `"email": [32]`

**Ancora da fare (manuale):** eseguire il CREATE TABLE su MySQL (vedi script SQL nel documento).

---

## Note aperte

- La pagina "Contatti" (id 15) è attualmente un placeholder. Quando verrà implementato il form di contatto, dovrà inserire righe in `email_inbox` con `tipo='contatto'`. Non fa parte di questo task.
- Il ruolo `email` della nav-config va abilitato per accedere alla pagina 32 in `data/settings.json`. Attualmente `"email": []`.
