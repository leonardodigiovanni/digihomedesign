# Architettura SSE — Aggiornamenti real-time DB → UI

**Data:** 2026-04-01  
**Stato:** pianificato — da implementare quando le funzionalità principali saranno stabili  
**Priorità:** alta (impatta tutta l'app)

---

## Principio guida

Ogni scrittura sul DB deve propagarsi automaticamente alle UI dei client connessi, senza che l'utente debba fare refresh manuale. La tecnologia scelta è **Server-Sent Events (SSE)**, adatta a un server Node.js singolo (VPS/Docker).

Questo documento va considerato **prima di ogni nuova funzionalità** che coinvolge lettura/scrittura su DB: il developer deve già pensare a quale evento SSE verrà emesso a completamento.

---

## File da creare al momento dell'implementazione

```
lib/sse-emitter.ts           ← bus eventi in memoria (singleton)
app/api/events/route.ts      ← endpoint SSE (GET, connessione persistente)
components/sse-listener.tsx  ← client component nel root layout
```

---

## `lib/sse-emitter.ts`

```ts
const clients = new Set<ReadableStreamDefaultController>()

export function addClient(ctrl: ReadableStreamDefaultController) {
  clients.add(ctrl)
}
export function removeClient(ctrl: ReadableStreamDefaultController) {
  clients.delete(ctrl)
}
export function emitEvent(type: string, payload?: unknown) {
  const data = `event: ${type}\ndata: ${JSON.stringify(payload ?? {})}\n\n`
  for (const ctrl of clients) {
    try { ctrl.enqueue(data) } catch { clients.delete(ctrl) }
  }
}
```

**Regola:** importare `emitEvent` in ogni server action che scrive sul DB.  
**Posizione della chiamata:** dopo il commit DB, prima del `return`.

---

## `app/api/events/route.ts`

```ts
export const dynamic = 'force-dynamic'

export async function GET() {
  let ctrl: ReadableStreamDefaultController
  const stream = new ReadableStream({
    start(c) {
      ctrl = c
      addClient(ctrl)
      ctrl.enqueue(': keep-alive\n\n')
    },
    cancel() { removeClient(ctrl) },
  })
  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    },
  })
}
```

---

## `components/sse-listener.tsx`

Client component montato nel root layout accanto a `InactivityGuard`.  
Riceve `username` e `role` dal layout (già disponibili dai cookie).  
Gestisce tutti gli event type con la logica appropriata.

Pattern di reazione:
- **`router.refresh()`** — ricarica i dati server della pagina corrente (usato per aggiornare liste, nav, permessi)
- **`logout()`** — per disconnessione forzata
- **notifica toast** — per avvisare senza interrompere (es. nuovo contenuto disponibile)
- **nessuna azione** — se l'evento non riguarda la pagina corrente o il ruolo dell'utente

---

## Catalogo eventi — stato attuale e futuro

Questo catalogo va aggiornato ad ogni nuova funzionalità.

### Utenti e sessioni
| Evento | Payload | Trigger | Reazione client |
|--------|---------|---------|-----------------|
| `user-status-changed` | `{ username, is_active }` | `toggleUserActive` | Se `username === me` e `is_active=0` → logout forzato |
| `user-role-changed` | `{ username, role }` | `changeUserRole` | Se `username === me` → `router.refresh()` (aggiorna nav) |

### Registrazioni e email
| Evento | Payload | Trigger | Reazione client |
|--------|---------|---------|-----------------|
| `new-email` | `{ tipo }` | `verifyPhone` (nuova reg.), form contatti | Se path === `/email` → `router.refresh()` |

### Navigazione e permessi
| Evento | Payload | Trigger | Reazione client |
|--------|---------|---------|-----------------|
| `permissions-changed` | `{ role, pages }` | `saveRolePermissions` | Se `role === mioRuolo` → `router.refresh()` |
| `pages-changed` | `{ disabledPages }` | `saveDisabledPages` | Tutti → `router.refresh()` |

### Contenuti (da implementare)
| Evento | Payload | Trigger | Reazione client |
|--------|---------|---------|-----------------|
| `cantiere-updated` | `{ cantiere_id }` | upload media/aggiornamento cantiere | Se path contiene `cantiere_id` → toast + `router.refresh()` |
| `settings-changed` | `{}` | `saveSettings`, `saveHeaderBg`, ecc. | Tutti → `router.refresh()` |

> **Regola di aggiornamento:** ogni volta che si implementa una nuova server action con scrittura DB, aggiungere la riga corrispondente in questo catalogo.

---

## Impatto sullo sviluppo corrente

Fino all'implementazione SSE, le server action usano già `router.refresh()` dopo ogni modifica — questo copre il caso "l'utente che fa l'azione vede il risultato". Il gap rimasto è "gli altri utenti connessi non vedono i cambiamenti altrui".

**Cosa fare già ora** durante lo sviluppo di nuove funzionalità:

1. Strutturare le server action con un punto finale chiaro dopo il commit DB (posto naturale per `emitEvent`)
2. Non usare stato client per "simulare" dati DB — affidarsi sempre a `router.refresh()` + dati server
3. Evitare cache aggressiva sui dati che cambiano frequentemente (`export const dynamic = 'force-dynamic'` nelle pagine con dati live)
4. Quando si scrive una nuova action, aggiungere un commento `// TODO SSE: emitEvent('nome-evento', payload)` nel punto esatto dove andrà la chiamata

---

## Quando implementare

Implementare SSE come sprint dedicato **dopo** che:
- Le funzionalità principali (magazzino, fatture, bilancio, cantieri, email) sono stabili
- Lo schema DB è assestato (poche ALTER TABLE residue)
- C'è almeno uno scenario live testabile end-to-end

L'implementazione è modulare: si parte da `lib/sse-emitter.ts` + endpoint + listener vuoto, poi si aggiungono gli event type uno alla volta seguendo il catalogo sopra.

---

## Limitazione architetturale

SSE con `Set` in memoria funziona su **un singolo processo Node.js** (VPS, Docker singolo container). Se in futuro il deploy dovesse scalare su più istanze o diventare serverless, il bus va sostituito con **Redis Pub/Sub** — la struttura del codice resterebbe identica, cambia solo l'implementazione di `emitEvent`/`addClient`.
