# Riorganizzazione Home Page

**Data:** 2026-05-05  
**Stato:** in attesa di conferma

## Obiettivo

Cambiare il layout della home page da 2 colonne (testo | CTA, con carousel commentato) a 3 colonne:

- **Sinistra:** testo descrittivo aziendale (attuale `home-hero-text`)
- **Centro:** riquadri card per linkare le pagine prodotto (attualmente sotto la griglia come flex-wrap)
- **Destra:** CTA (Preventivo, Cantiere, App — attuale `home-hero-cta`)

## File coinvolti

- `app/page.tsx` — restructuring JSX
- `app/globals.css` — aggiornamento griglia `.home-hero` (attuale: `carousel | text | cta` → nuova: `text | cards | cta`)

## Passi principali

1. Aggiornare `.home-hero` in globals.css: nuovi `grid-template-columns` e `grid-template-areas: "text cards cta"`
2. Aggiungere area `home-hero-cards` come terzo elemento grid al posto del carousel
3. Spostare il `<div>` con le page-card inside `home-hero-cards`, mantenendo scroll verticale se necessario
4. Rimuovere il tag del carousel commentato
5. Adattare responsive: su ≤1200px colonne text+cards, cta sotto; su ≤960px tutto in colonna

## Proporzioni griglia suggerite

- Large (>1200px): `1.2fr 2.5fr 0.8fr`
- Medium (≤1200px): `1.4fr 1.6fr` + cta in riga sotto
- Narrow (≤960px): 1 colonna
