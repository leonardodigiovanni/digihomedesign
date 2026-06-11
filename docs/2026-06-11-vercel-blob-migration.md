# Migrazione upload a Vercel Blob

**Data:** 2026-06-11  
**Stato:** in pianificazione

## Obiettivo

Sostituire tutti i `writeFile` su filesystem locale con **Vercel Blob** (`@vercel/blob`),
in modo che gli upload funzionino anche su Vercel (filesystem read-only).

## File coinvolti

### Route API da migrare
| File | Cartella attuale | Cosa cambia |
|---|---|---|
| `app/api/upload-catalogo/route.ts` | `public/uploads/cataloghi/` | `put()` → ritorna URL blob |
| `app/api/upload-cantiere/route.ts` | `public/uploads/cantieri/tasks/{id}/` | `put()` → ritorna URL blob |
| `app/api/upload-documento/route.ts` | `public/uploads/documenti/` | `put()` → ritorna URL blob |
| `app/api/upload-marketing/route.ts` | `public/uploads/marketing/` | `put()` → ritorna URL blob |
| `app/api/listini/foto/route.ts` | `public/listini/` | `put()` → salva URL in DB |

### Actions con `unlink` da migrare
| File | Operazione |
|---|---|
| `app/area-lavoro/cataloghi/actions.ts` | `unlink` → `del(url)` |
| Eventuali altri actions con delete file |

## Cambiamenti al DB

Tutti i campi che prima salvavano un **filename** (es. `pdf_filename`) ora salveranno
il **full URL** del blob (es. `https://xxxx.public.blob.vercel-storage.com/...`).

I record esistenti in locale continuano a funzionare localmente (puntano a `public/`),
ma in produzione i nuovi upload useranno l'URL blob.

## Passi principali

1. `npm install @vercel/blob`
2. Aggiungere `BLOB_READ_WRITE_TOKEN` alle env vars su Vercel (Dashboard → Settings → Environment Variables)
3. Migrare le 5 route API: `put(pathname, stream, { access: 'public' })` → `return { url }`
4. Migrare i delete: `del(url)` al posto di `unlink(path)`
5. In locale: `@vercel/blob` usa un mock automatico se `BLOB_READ_WRITE_TOKEN` non è impostato → continua a scrivere su filesystem locale (via `@vercel/blob/mock` o variabile `VERCEL_BLOB_MOCK`)

## Note tecniche

- `put()` ritorna `{ url }` — url pubblico permanente
- `del(url)` cancella per URL (non per path)
- I file esistenti su `public/` continuano a essere serviti normalmente
- Nessuna modifica alle colonne DB necessaria (VARCHAR già sufficientemente lungo per URL)
