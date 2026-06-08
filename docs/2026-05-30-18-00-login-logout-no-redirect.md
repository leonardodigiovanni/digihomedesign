# Login e logout senza cambio pagina

**Data:** 2026-05-30 18:00  
**Stato:** completato

## Obiettivo

Login e logout non devono navigare l'utente verso un'altra pagina. La pagina corrente rimane visibile e si aggiorna per riflettere il nuovo stato (loggato / sloggato).

## Comportamento attuale

- `login` → `redirect(redirectTo)` (default `/`)
- `logout` → `redirect('/')`

## Comportamento nuovo

- `logout` → elimina i cookie, non chiama `redirect()`. Next.js App Router esegue automaticamente un soft refresh della route corrente dopo una server action, aggiornando i server component (incluso l'header con username).
- `login` → stessa logica ma solo se `redirect_to` è valorizzato chiama `redirect(redirectTo)` (es. dopo "Paga ora" nel carrello acquisti). Se `redirect_to` è assente o vuoto, non redirige.

## File coinvolti

1. **`app/actions.ts`**
   - `logout`: rimuovere `redirect('/')`
   - `login`: condizionare il redirect — solo se `redirect_to` è presente, altrimenti non redirigere

## Scelte tecniche

- Next.js App Router: dopo una server action senza `redirect()`, il router fa automaticamente un soft refresh della pagina corrente, re-renderizzando i server component con i nuovi cookie. Questo aggiorna l'header (logged-in / logged-out) senza navigazione visibile.
- Il `redirect_to` per il carrello acquisti viene preservato: se presente, il login redirige comunque alla destinazione.
