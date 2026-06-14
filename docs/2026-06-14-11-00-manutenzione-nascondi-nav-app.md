# Manutenzione: nascondere nav-bottom-app e bottone simulazione per sloggati

**Data:** 2026-06-14  
**Stato:** completato

## Obiettivo

Quando un admin attiva la modalità manutenzione (`manutenzione: true` in settings), per gli utenti **non loggati** che accedono a `/app`:
- La **nav-bottom-app** non deve essere visibile
- Il bottone **"+ Nuova simulazione preventivo"** nella pagina `/app/preventivo` non deve essere visibile

## Contesto tecnico

Il `app/app/layout.tsx` attuale non fa controllo di ruolo: renderizza `AppBottomNav` per tutti, inclusi gli utenti sloggati (`username = null`, `role = ''`). Gli utenti sloggati vedono un bottone "Accedi" nella topbar ma comunque la nav-bottom e, se accedono a `/app/preventivo`, il bottone simulazione.

## File coinvolti

| File | Modifica |
|------|----------|
| `app/app/layout.tsx` | Leggere `manutenzione` da `readSettings()`; passarlo ad `AppBottomNav`; se manutenzione + utente sloggato, non renderizzare la nav |
| `app/app/app-bottom-nav.tsx` | Ricevere prop `manutenzione?: boolean`; se true e utente non loggato, `return null` |
| `app/app/preventivo/page.tsx` | Leggere `manutenzione` da `readSettings()`; se manutenzione + utente sloggato, nascondere il bottone "+ Nuova simulazione preventivo" |

## Logica condizionale

```
manutenzione=true AND utente sloggato (username=null)
  → nav-bottom-app: non renderizzata
  → bottone "Nuova simulazione": nascosto
```

Gli utenti loggati (cliente, dipendente, admin) non sono influenzati da questa modifica.

## Passi principali

1. **`app/app/layout.tsx`**: aggiungere `const { manutenzione } = await readSettings()` e passare `manutenzione` e `username` ad `AppBottomNav` (username è già passato).
2. **`app/app/app-bottom-nav.tsx`**: aggiungere prop `manutenzione?: boolean`; aggiungere controllo `if (manutenzione && !username) return null` prima del render.
3. **`app/app/preventivo/page.tsx`**: aggiungere `const { manutenzione } = await readSettings()` e wrappare il bottone con `{!(manutenzione && !username) && ...}`.

## Scelte tecniche

- `readSettings()` è già disponibile in `lib/settings.ts` — nessuna nuova infrastruttura.
- La nav scompare completamente (`return null`) per non lasciare spazio vuoto nel layout.
- Non si modifica il comportamento per utenti loggati.

## Riepilogo modifiche effettive

- `app/app/layout.tsx`: aggiunto `import { readSettings }`, `const { manutenzione } = await readSettings()`, prop `manutenzione={manutenzione}` su `AppBottomNav`.
- `app/app/app-bottom-nav.tsx`: aggiunta prop `manutenzione?: boolean`; aggiunto `if (manutenzione && !username) return null` dopo il check `/app/login`.
- `app/app/preventivo/page.tsx`: aggiunto `import { readSettings }`, `const { manutenzione } = await readSettings()`, condizione `!(manutenzione && !username)` attorno al bottone "Nuova simulazione preventivo". (La pagina già redirige i sloggati a `/app/login`, quindi la condizione è difensiva.)
