# btn-*-app — classi bottone separate per area /app

**Data:** 2026-06-11  
**Stato:** completato

## Obiettivo

Separare lo stile dei bottoni nell'area `/app` (PWA mobile) da quelli del sito principale, creando classi `btn-*-app` speculari alle `btn-*` esistenti.

## Cosa verrà implementato

### 1. `app/globals.css`
Aggiungere le classi duplicate per tutte e 8 le varianti:
- `.btn-green-app`
- `.btn-red-app`
- `.btn-orange-app`
- `.btn-rgb-c-app`
- `.btn-blue-app`
- `.btn-black-app`
- `.btn-gold-app`
- `.btn-gray-app`

Inizialmente identiche alle originali — pronte per personalizzazioni future.

### 2. File sotto `app/app/` — sostituzione classi

Classi trovate in uso:

| Classe attuale | Occorrenze | File |
|---|---|---|
| `btn-black` | 8 | vari |
| `btn-green` | 3 | vari |
| `btn-gold` | 2 | vari |
| `btn-orange` | 1 | vari |

Tutti i `btn-X` → `btn-X-app` nei file sotto `app/app/`.

## File coinvolti
- `app/globals.css` — aggiunta classi
- File `*.tsx` sotto `app/app/` — sostituzione className
