# Header — username toggle con dropdown Esci

**Data:** 2026-06-11  
**Stato:** completato

## Obiettivo

Per l'utente loggato: sostituire il bottone "Esci" visibile sempre con un toggle testo `nomeutente ▾` che apre un dropdown contenente il link "Esci". Fase da sloggato invariata.

## Situazione attuale

- `components/header.tsx` riga 124–128: username mostrato in piccolo `top:4 right:8`, `pointerEvents:none`, solo decorativo
- `components/header-auth.tsx` riga 166–179: bottone `btn-orange` "Esci" sempre visibile

## Modifiche

### `components/header.tsx`
Rimuovere il blocco username decorativo (righe 124–128) — il nome utente si sposta nel toggle dell'header-auth.

### `components/header-auth.tsx`
Blocco loggato (riga 166–179) → nuova struttura:
- `<div ref={wrapperRef}>` con click-outside già presente
- Toggle: `nomeutente ▾` / `nomeutente ▴` — testo linkabile (stile bianco, monospace, fontSize 10, opacity 0.75, cursor pointer), stessa resa del nome decorativo attuale
- Dropdown (quando aperto): riquadro bianco con il bottone `btn-orange` "Esci" (identico a quello attuale, semplicemente spostato dentro il dropdown)

## File coinvolti
- `components/header.tsx`
- `components/header-auth.tsx`
