# Upload foto/video cantiere da app mobile (dipendente)

**Data:** 2026-06-11  
**Stato:** proposta

## Obiettivo

Permettere a un dipendente loggato nella `/app/` di scattare foto o girare video direttamente dal telefono e caricarli su un task del cantiere, senza usare l'area-lavoro desktop.

## Flusso utente

1. `/app/cantiere` → lista cantieri (dipendente vede tutti, non solo il suo)
2. Click su un cantiere → lista task
3. Su ogni riga task appare un bottone **"📷 Upload"**
4. Click → si apre l'input nativo del telefono: scelta tra **Fotocamera** o **Video** (o galleria)
5. File selezionato → upload a `/api/upload-cantiere` con `task_id`
6. Media appare nella lista del task

## File coinvolti

| File | Modifica |
|------|----------|
| `app/app/cantiere/page.tsx` | Passare `role` al componente client |
| `app/area-clienti/cantieri/cantieri-cliente-client.tsx` | Aggiungere prop `isDipendente`, bottone upload in `TaskGrid` |
| `app/area-clienti/cantieri/apri-task-btn.tsx` | Solo lettura, non toccato |
| `app/area-lavoro/cantieri/actions.ts` | Riutilizzare `addMedia` esistente |

## Scelte tecniche

- `<input type="file" accept="image/*,video/*">` senza `capture`: apre il selettore nativo (fotocamera + galleria) — più flessibile
- Upload via `fetch('/api/upload-cantiere', ...)` come già fa `cantieri-client.tsx`
- Dopo upload: `router.refresh()` per aggiornare la lista media senza ricaricare la pagina
- Per i dipendenti la pagina `/app/cantiere` carica **tutti i cantieri** (non filtrati per cliente)
- Il bottone Upload è visibile **solo se `isDipendente === true`** — i clienti non lo vedono
- Feedback visivo: spinner durante upload, messaggio errore inline

## Passi di implementazione

1. `page.tsx` — leggere `session_role`, se dipendente/admin caricare tutti i cantieri (query senza filtro `cliente_id`), passare `isDipendente={true}` al client
2. `cantieri-cliente-client.tsx` — aggiungere prop `isDipendente`, in `TaskGrid` aggiungere colonna/bottone upload, gestire stato `uploading`
