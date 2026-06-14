# PWA: bottone installa app

**Data:** 2026-06-14  
**Stato:** completato

## Obiettivo

Mostrare nella topbar di `/app` un piccolo bottone "Installa app" che triggera il prompt nativo di installazione PWA, visibile solo quando il browser ha l'evento `beforeinstallprompt` disponibile (= app non ancora installata, browser compatibile).

## Comportamento

- **Visibile**: solo se il browser supporta l'installazione PWA e l'app non è già installata
- **Invisibile**: se già installata, o su browser non compatibili (Safari iOS usa un meccanismo diverso)
- **Al click**: mostra il prompt nativo del browser (la dialog "Aggiungi a schermata home")
- **Dopo l'installazione**: il bottone scompare automaticamente

## File coinvolti

| File | Modifica |
|------|----------|
| `app/app/install-btn.tsx` | Nuovo componente client con logica `beforeinstallprompt` |
| `app/app/layout.tsx` | Aggiungere `<InstallBtn />` nella topbar, tra logo e username |

## Posizione nella topbar

```
[ LOGO ]   [ installa ▼ ]   [ username / Accedi ]
```

Il bottone sarà piccolo (stile simile ad AccediBtn) e si nasconde da solo quando non serve.

## Implementazione

`install-btn.tsx` ('use client'):
1. `useState(null)` per `deferredPrompt`
2. `useEffect` → ascolta `beforeinstallprompt` → `e.preventDefault()` + salva evento in state
3. Ascolta anche `appinstalled` → svuota lo state (bottone sparisce)
4. Se `deferredPrompt === null` → `return null`
5. Al click → `deferredPrompt.prompt()` → svuota lo state

## Scelte tecniche

- `e.preventDefault()` sul `beforeinstallprompt` è necessario per impedire al browser di mostrare il prompt automaticamente e controllarlo manualmente
- Nessun cookie/localStorage: l'evento stesso è la fonte di verità
- Safari iOS non supporta `beforeinstallprompt` → il bottone non appare su Safari (comportamento corretto, non è un bug)
