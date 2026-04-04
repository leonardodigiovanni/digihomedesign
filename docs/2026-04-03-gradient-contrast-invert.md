# Gradiente metallico: meno contrasto + flag inversione

**Data:** 2026-04-03  
**Stato:** completato

---

## Obiettivo

Due modifiche alle classi CSS degli effetti oro/argento:

1. **Meno contrasto** — rendere i fermi scuri meno scuri, riducendo la differenza percepita tra la zona scura e quella chiara del gradiente.
2. **Flag di inversione** — aggiungere varianti `_inv` che invertono il pattern da `scuro→chiaro→scuro` a `chiaro→scuro→chiaro`.

---

## File coinvolti

| File | Modifica |
|------|----------|
| `app/globals.css` | Schiarire i colori scuri esistenti; aggiungere classi `_inv` per oro e argento |
| `lib/settings.ts` | Aggiungere ai tipi `BgMode`: `gold_a_inv`, `gold_b_inv`, `gold_c_inv`, `silver_a_inv`, `silver_b_inv`, `silver_c_inv` |
| `app/layout.tsx` | Aggiungere mapping `PAGE_EFFECT_CLASS`, `PAGE_SHIMMER`, `PAGE_RADIAL` per le varianti `_inv` |
| `components/header.tsx` | Aggiungere mapping per le varianti `_inv` |
| `components/footer.tsx` | Aggiungere mapping per le varianti `_inv` |
| `app/settings/page.tsx` | Aggiungere pulsanti `Oro A inv / B inv / C inv` e `Arg A inv / B inv / C inv` |

---

## Passi principali

### 1 — Meno contrasto (`globals.css`)

Schiarire i fermi scuri in tutte le classi esistenti (A, B, C, B_safe, C_safe) di oro e argento:

| Colore | Da | A |
|--------|----|---|
| Gold dark | `#a07820` | `#b89030` |
| Silver dark | `#5a5a5a` | `#787878` |

I fermi medi e chiari (`#c8960c`, `#f5d060`, `#fffacd` per oro; `#8a8a8a`, `#cccccc`, `#f2f2f2` per argento) restano invariati.

### 2 — Classi invertite (`globals.css`)

Per ogni classe esistente, aggiungere la variante `_inv` con i colori degli stop invertiti (chiaro agli estremi, scuro al centro):

- `class_gold_A_inv`, `class_gold_B_inv`, `class_gold_C_inv`
- `class_gold_B_inv_safe`, `class_gold_C_inv_safe`
- `class_silver_A_inv`, `class_silver_B_inv`, `class_silver_C_inv`
- `class_silver_B_inv_safe`, `class_silver_C_inv_safe`

Lo shimmer e il radiale restano identici alle varianti non-inv (stessi wrapper `gold-shimmer-wrap` / `silver-shimmer-wrap`).

### 3 — Tipi e mapping (`lib/settings.ts`, `layout.tsx`, `header.tsx`, `footer.tsx`)

- Aggiungere i 6 nuovi valori a `BgMode`
- Aggiungere entry nei dizionari `PAGE_EFFECT_CLASS`, `PAGE_SHIMMER`, `PAGE_RADIAL` (e equivalenti in header/footer)

### 4 — Pulsanti Settings (`app/settings/page.tsx`)

Aggiungere nella sezione oro e argento un secondo gruppo di 3 pulsanti "A inv / B inv / C inv".

---

## Scelte tecniche

- Le varianti `_inv` usano gli stessi shimmer e radiale dell'originale → zero duplicazione di animazioni
- Il campo `_inv` in settings è modellato come nuovi valori di `BgMode` (non un boolean separato) → coerente con il sistema attuale
- Nessuna modifica alla struttura HTML dei pannelli esistenti

