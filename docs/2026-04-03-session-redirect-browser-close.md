# Sessione: redirect su non autorizzato + scadenza alla chiusura browser

**Data:** 2026-04-03  
**Stato:** completato

---

## Obiettivo

1. **Redirect alla home su sessione scaduta** — quando un'azione server fallisce per mancanza di autorizzazione (sessione scaduta mentre l'utente era sulla pagina), invece di mostrare "Non autorizzato." si reindirizza subito alla home `/`.

2. **Cookie di sessione (niente maxAge)** — attualmente i cookie `session_user` e `session_role` hanno `maxAge: 8h` e sopravvivono alla chiusura del browser. Rimuovendo `maxAge` diventano *session cookie*: il browser li cancella automaticamente alla chiusura. Alla riapertura l'utente risulta disconnesso e deve fare il login.

---

## File coinvolti

| File | Modifica |
|------|----------|
| `app/actions.ts` | Rimuovere `maxAge` da `COOKIE_OPTS` |
| `app/anagrafica-clienti/actions.ts` | `return { ok: false, error: 'Non autorizzato.' }` → `redirect('/')` |
| `app/anagrafica-fornitori/actions.ts` | idem |
| `app/archivio/actions.ts` | idem |
| `app/email/actions.ts` | idem |
| `app/facsimili/actions.ts` | idem |
| `app/gestione-utenti/actions.ts` | idem |
| `app/magazzino/actions.ts` | idem |
| `app/ordini-fornitori/actions.ts` | idem |
| `app/ordini-ricevuti/actions.ts` | idem |
| `app/settings/actions.ts` | idem |

---

## Dettaglio

### Cookie di sessione

```ts
// Prima
const COOKIE_OPTS = { httpOnly: true, path: '/', maxAge: 60 * 60 * 8 } as const

// Dopo
const COOKIE_OPTS = { httpOnly: true, path: '/' } as const
```

`refreshSession` continua a rinnovare i cookie sull'attività — ma solo durante la sessione browser aperta. Alla chiusura del browser tutto sparisce.

### Redirect su non autorizzato

In ogni file di actions, aggiungere `import { redirect } from 'next/navigation'` e sostituire:

```ts
// Prima
return { ok: false, error: 'Non autorizzato.' }

// Dopo
redirect('/')
```

`redirect()` in un server action lancia un'eccezione interna che Next.js gestisce inviando al client un redirect 307 verso `/`. Nessuna modifica ai componenti client necessaria.

---

## Note

- Il comportamento *within-session* (timer inattività + countdown) rimane invariato, gestito da `InactivityGuard`.
- Alcuni browser con "ripristina sessione alla riapertura" possono conservare i session cookie — è comportamento del browser, non controllabile lato server.

