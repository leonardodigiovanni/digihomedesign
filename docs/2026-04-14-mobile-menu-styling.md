# Mobile menu — Stile e hover

**Data:** 2026-04-14  
**Stato:** completato

## Obiettivo

Dare al menu mobile (hamburger) una veste visiva simile alla navbar desktop: sfondo gold spazzolato per gli items attivi, effetto al tocco per gli inattivi, separatori stilizzati tra le sezioni.

## Approccio

- Aggiungere classi CSS `.nav-mobile-link` e `.nav-mobile-link-active` in `globals.css`
- Aggiornare il componente `MobileLink` in `navbar.tsx` per usare le classi
- Aggiornare i separatori di sezione (Sezioni / Area Lavoro / Amministrazione)

## Design

| Elemento | Stile |
|---|---|
| Item attivo | Sfondo gold-D spazzolato 135deg, testo scuro `#3a2000`, grassetto |
| Item inattivo (touch/hover) | Flash gold leggero su `:active` / `:hover` |
| Item inattivo (riposo) | Sfondo trasparente, testo `#333` |
| Separatori di sezione | Testo uppercase piccolo + barra gold sinistra |
| Contenitore menu | Sfondo bianco caldo `#fdfcf8` invece di bianco puro |

## File coinvolti

- `app/globals.css` — nuove classi `.nav-mobile-link`, `.nav-mobile-link-active`
- `components/navbar.tsx` — `MobileLink` usa le classi; separatori di sezione riscritti
