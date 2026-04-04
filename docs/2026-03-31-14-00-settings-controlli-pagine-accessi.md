# Settings — Controlli pagine, registrazioni e login

**Stato:** in pianificazione  
**Data:** 2026-03-31

---

## Obiettivo

Aggiungere nella pagina Settings tre nuovi pannelli di controllo per l'admin:

1. **Pannello pagine (2–15)**: checkbox per abilitare/disabilitare ciascuna delle 14 pagine cliente. Una pagina disabilitata non compare nei riquadri della home, nel nav e restituisce 404 se raggiunta direttamente.
2. **Pannello registrazioni**: singola checkbox per disabilitare le nuove registrazioni. Se disabilitata, il form di registrazione mostra un messaggio di blocco e non prosegue.
3. **Pannello accessi**: due checkbox indipendenti — una disabilita il login per i clienti (`role = 'cliente'`), una disabilita il login per i dipendenti (`role != 'admin' && role != 'cliente'`). Se il login è bloccato per quel ruolo, la server action di login restituisce un errore.

---

## File coinvolti

| File | Modifica |
|------|----------|
| `data/settings.json` | Aggiungere campi: `disabledPages: number[]`, `registrazioniDisabilitate: boolean`, `loginClientiDisabilitato: boolean`, `loginDipendentiDisabilitato: boolean` |
| `lib/settings.ts` | Estendere `AppSettings` con i nuovi campi e relativi default |
| `app/settings/actions.ts` | Aggiungere server action `saveAccessControls` |
| `app/settings/page.tsx` | Passare i nuovi valori al form |
| `app/settings/settings-form.tsx` | Aggiungere i tre pannelli con checkbox |
| `app/page.tsx` | Filtrare `clientPages` escludendo le pagine disabilitate |
| `app/pagine/[id]/page.tsx` | Se la pagina è disabilitata → `notFound()` |
| `app/actions.ts` | Nella server action `login`, controllare i flag di blocco login |
| `app/registrazione/` | Controllare il flag `registrazioniDisabilitate` al primo step |
| `components/nav.tsx` (o equivalente) | Escludere le pagine disabilitate dal nav |

---

## Passi principali

1. Estendere `AppSettings` e `settings.json` con i 4 nuovi campi.
2. Aggiungere la server action `saveAccessControls` in `app/settings/actions.ts`.
3. Aggiungere i tre pannelli in `settings-form.tsx` (client component con `useActionState`).
4. Nella home (`app/page.tsx`) filtrare i riquadri in base a `disabledPages`.
5. Nella route `app/pagine/[id]/page.tsx` restituire `notFound()` se la pagina è disabilitata.
6. Nel nav filtrare le pagine disabilitate (leggere settings lato server).
7. Nella server action login bloccare clienti/dipendenti se i rispettivi flag sono attivi.
8. Nel primo step della registrazione bloccare se `registrazioniDisabilitate` è true.

---

## Scelte tecniche

- I dati persistono in `data/settings.json` (coerente con l'architettura esistente, nessun DB per le settings).
- Le pagine disabilitate vengono controllate **lato server** (server components + server actions) per evitare bypass client-side.
- Il nav legge le settings tramite `readSettings()` al momento del render, senza cache statica.
- `disabledPages` è un array di ID numerici (es. `[3, 7, 12]`); assente o vuoto = tutte abilitate.

---

## Stato al completamento

**Stato:** completato — 2026-03-31

### File toccati
- `lib/settings.ts` — aggiunti 4 campi al tipo `AppSettings` e ai default
- `data/settings.json` — aggiornato con i nuovi campi
- `app/settings/actions.ts` — aggiunta server action `saveAccessControls`
- `app/settings/page.tsx` — passati i nuovi prop al form
- `app/settings/settings-form.tsx` — aggiunto componente `AccessControlPanel` con 3 pannelli
- `app/page.tsx` — riquadri filtrati in base a `disabledPages`
- `app/pagine/[id]/page.tsx` — restituisce 404 se la pagina è disabilitata
- `app/actions.ts` — login bloccato per ruolo se il rispettivo flag è attivo
- `app/registrazione/actions.ts` — step 1 bloccato se `registrazioniDisabilitate`
- `app/layout.tsx` — passa `disabledPages` al Navbar
- `components/navbar.tsx` — accetta `disabledPages` e filtra le voci nel menu

### Note
- I tre pannelli condividono un unico pulsante "Salva controlli accesso" (un'unica form action).
- Il blocco login non si applica mai agli admin.
