# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Architecture

**Next.js 16.2.1 App Router** — all pages are async server components unless marked `'use client'`. Read `node_modules/next/dist/docs/` before touching any Next.js API; this version has breaking changes vs older training data.

**Database**: MySQL via `mysql2/promise`. Each request opens and closes its own connection via `getConnection()` in `lib/db.ts` (reads from `.env.local`). Credentials: DB `mef`, user `root`.

**Authentication**: Two HTTP-only cookies set on login/registration:
- `session_user` — username string
- `session_role` — role string (`cliente` | `dipendente` | `admin`)

Both cookies have 8-hour TTL, refreshed on activity via the `refreshSession()` server action. Passwords are stored and compared in plain text (no hashing).

**Route protection**: Each protected page reads cookies and calls `redirect('/')` if the role check fails. There is no middleware. Pattern:
```typescript
const role = cookieStore.get('session_role')?.value ?? ''
if (role !== 'admin') redirect('/')
```

**Roles and page visibility**:
- `cliente` (default): home + client pages 2–15
- `dipendente`: above + Magazzino/Fatture/Bilancio (pages 16–18)
- `admin`: everything including Settings/Gestione Utenti (pages 19–20)

Nav visibility is controlled in `lib/nav-config.ts` via `visibleAdminPages(role)`. Client pages 2–15 are public (sito vetrina, no login required).

**Registration flow** (`app/registrazione/`): 3-step — form data → email OTP → SMS OTP. Pending data lives in `pending_registrations` MySQL table (expires in 15 min). On completion the user is created in `users` with `role='cliente'` and both `email_verificata=1`, `cellulare_verificato=1`.

**Server Actions**: All form submissions use server actions with `useActionState`. Actions live either in `app/actions.ts` (global: login/logout/refreshSession) or co-located in the relevant route folder.

**Inactivity guard** (`components/inactivity-guard.tsx`): Client component mounted in the root layout for logged-in users. Receives `inactivityMs` and `countdownSec` props from the layout (which reads `data/settings.json`). Uses `useRef` for the timeout values so stale closures are avoided when props change.

**File-based settings** (`data/settings.json`): Admin-configurable inactivity timeout and countdown duration. Read via `lib/settings.ts` on every layout render (synchronous `fs.readFileSync`). Written by the `saveSettings` server action in `app/settings/actions.ts`.

**Email/SMS**: `lib/email.ts` wraps Nodemailer; `lib/sms.ts` wraps Twilio REST API (no SDK). Both fall back to `console.log` when the respective env vars are not set — OTP codes appear in the `npm run dev` terminal output as `📧 EMAIL` and `📱 SMS` lines.

## Workflow: nuove funzionalità

Prima di implementare qualsiasi nuova funzionalità o implementazione richiesta dall'utente:

1. **Controlla la data e ora corrente** (usa il contesto `currentDate` o il sistema).
2. **Crea un documento di progetto** in `/docs/` con nome nel formato `YYYY-MM-DD-HH-mm-nome-funzione.md`.
3. **Descrivi nel documento** cosa verrà implementato: obiettivo, file coinvolti, passi principali, eventuali scelte tecniche.
4. **Attendi la conferma esplicita dell'utente** prima di scrivere qualsiasi codice.

Non procedere con lo sviluppo finché l'utente non approva il documento.

Al termine dell'implementazione:

5. **Aggiorna il documento di progetto** corrispondente in `/docs/`: cambia lo stato in `completato`, aggiungi un riepilogo delle modifiche effettive (file toccati, scelte cambiate rispetto al piano, eventuali note).

## Key conventions

- Page names and navigation structure live in `lib/nav-config.ts` — change labels/slugs there, not in individual files.
- Client pages 2–15 use the dynamic route `app/pagine/[id]/page.tsx`.
- Admin pages 16–20 each have their own directory under `app/`.
- Inline styles are used throughout (no Tailwind classes in current code despite Tailwind being installed).
- All UI text is in Italian.
