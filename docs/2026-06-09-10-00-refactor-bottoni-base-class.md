# Refactor bottoni — classe base CSS

**Data:** 2026-06-09  
**Stato:** completato

## Obiettivo

Centralizzare tutto il layout/sizing dei bottoni in CSS, lasciando inline solo le proprietà non standard. Attualmente `height: 42`, `borderRadius: 21`, `padding`, `display: inline-flex`, ecc. sono ripetuti inline in ~145 file.

## Problema rilevato

Le classi `btn-*` esistenti in globals.css dichiarano `height: 33px; border-radius: 7px` — i componenti le sovrascrivono sempre inline con 42px/21px. Il CSS e il codice sono disallineati.

## Modifiche CSS (globals.css)

### Regola condivisa espansa
Sostituire la regola condivisa `font-size/font-family` con tutte le proprietà layout:
- `display: inline-flex`, `align-items/justify-content: center`
- `height: 42px`, `min-width: 42px`, `padding: 0 20px`
- `border-radius: 21px`
- `font-size: 13px`, `font-weight: 700`, `font-family: monospace`
- `white-space: nowrap`, `text-decoration: none`, `box-sizing: border-box`
- `position: relative`, `overflow: hidden`, `cursor: pointer`, `transition: filter 0.15s`

### Classi colore — rimuovere i duplicati
Da ogni `btn-green/red/orange/...` rimuovere: `border-radius`, `height`, `box-sizing`, `padding-top/bottom`, `position`, `overflow`, `cursor`, `transition`.
Restano solo: `background`, `color`, `border`, `box-shadow` (+ `hover`).

### Nuova classe `.btn-icon`
Per bottoni circolari (icone nei preventivi):
```css
.btn-icon { width: 42px !important; padding: 0 !important; }
```
Uso: `className="btn-red btn-icon"` invece di `btn-red` + inline `width/padding`.

## Modifiche componenti

Per ogni elemento con `className="btn-*"`:
- Rimuovere inline: `height`, `borderRadius`, `padding` (se = 0 20px), `display`, `alignItems`, `justifyContent`, `whiteSpace`, `fontWeight`, `fontFamily`, `cursor`, `borderRadius`
- Bottoni circolari: aggiungere `btn-icon` alla className e rimuovere `width: 42, padding: 0` inline

## File coinvolti

- `app/globals.css` — modifica CSS
- ~145 file TSX — pulizia stili inline ridondanti
