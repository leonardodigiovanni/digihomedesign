# RGB invertito + angolo shimmer uguale al gradiente

**Data:** 2026-04-03  
**Stato:** completato

---

## Obiettivo

1. **Varianti invertite RGB** — aggiungere `rgb_a_inv`, `rgb_b_inv`, `rgb_c_inv` che generano il gradiente metallico calcolato dal colore scelto in modalità chiaro→scuro→chiaro (speculare rispetto alle varianti normali).
2. **Angolo shimmer** — l'onda luminosa animata (shimmer) è attualmente inclinata a ~15°, mentre il gradiente di sfondo è a 135°. Portare lo shimmer a 45° di skew (`skewX(-45deg)`) così che la sua banda sia perpendicolare alle righe del gradiente, rendendola visivamente coerente.

---

## File coinvolti

| File | Modifica |
|------|----------|
| `lib/bg-utils.ts` | Aggiungere `rgbGradientInv` e `rgbBrushedBackgroundInv` |
| `lib/settings.ts` | Aggiungere `'rgb_a_inv' \| 'rgb_b_inv' \| 'rgb_c_inv'` a `BgMode` |
| `app/globals.css` | Cambiare `skewX(-15deg)` → `skewX(-45deg)` nei keyframes `gold-shimmer` e `silver-shimmer` |
| `app/layout.tsx` | Gestire i nuovi modi nel calcolo di `pageRgbStyle`, `pageShimmer`, `pageRadial` |
| `components/header.tsx` | Aggiornare `buildHeaderStyle`, `SHIMMER_WRAP`, `RADIAL_BG` per i modi inv RGB; cambiare `isRgbEffect` a `startsWith('rgb_')` |
| `components/footer.tsx` | Stesse estensioni di header per footer |
| `app/settings/settings-form.tsx` | Aggiungere 3 pulsanti "RGB A inv / B inv / C inv" con preview del gradiente invertito; importare `rgbGradientInv` |

---

## Passi principali

### 1 — Angolo shimmer (`globals.css`)

```
@keyframes gold-shimmer / silver-shimmer
  skewX(-15deg)  →  skewX(-45deg)
```

45° di skew rende la banda parallela alle diagonali del gradiente a 135°.

### 2 — Funzioni invertite (`lib/bg-utils.ts`)

`rgbGradientInv(r,g,b)` — stessi stop di `rgbGradient` ma con ordine invertito:  
`vLight 0%, light 18%, base 35%, mid 45%, dark 50%, mid 55%, base 65%, light 82%, vLight 100%`

`rgbBrushedBackgroundInv(r,g,b)` — brushed texture + `rgbGradientInv`.

### 3 — Nuovi tipi e routing dei modi (`settings.ts`, `layout.tsx`, `header.tsx`, `footer.tsx`)

- `rgb_a_inv` → stile statico invertito (no shimmer)
- `rgb_b_inv` → stile invertito + shimmer (usa `gold-shimmer-wrap`)
- `rgb_c_inv` → stile brushed invertito + radiale + shimmer

Le condizioni `startsWith('rgb_')` catturano già i nuovi modi per shimmer, radiale, e colori testo.

### 4 — UI Settings (`settings-form.tsx`)

Aggiungere gruppo "RGB A inv / B inv / C inv" accanto ai pulsanti RGB normali (dopo il separatore o inline). Il background del pulsante mostra `rgbGradientInv` in tempo reale.

---

## Note tecniche

- Il testo del pulsante inv usa la stessa logica luminanza del colore base (invariata).
- La modifica dell'angolo shimmer è globale: si applica a tutte le varianti gold, silver, rgb (B e C, incluse le inv).

