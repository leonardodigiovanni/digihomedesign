# Settings: sfondo RGBA + pannelli footer e pagina

**Data**: 2026-03-31  
**Stato**: completato

## Obiettivo

1. Aggiungere il canale **alpha (trasparenza)** al colore dello sfondo header.
2. Aggiungere due nuovi pannelli identici per **sfondo footer** e **sfondo pagina**.
3. Propagare i nuovi valori ai componenti `Header`, `Footer` e al `<main>`.

---

## Valore alpha

- Salvato in JSON come intero **0–100** (percentuale, user-friendly).
- Convertito in CSS con `rgba(r, g, b, a/100)`.
- Slider e input numerico identici agli altri canali (range 0–100).

---

## Modifiche per file

### `lib/settings.ts`
- Rinominare tipo `Rgb` → `Rgba`, aggiungere campo `a: number`.
- Aggiungere `footerBg: Rgba` e `pageBg: Rgba` a `AppSettings`.
- Aggiornare i default (`a: 100` = completamente opaco).

### `data/settings.json`
- Aggiungere `"a": 100` a `headerBg` esistente.
- Aggiungere `footerBg` e `pageBg` con valori default:
  - `footerBg`: `{ r:255, g:255, b:255, a:100 }` (bianco opaco, come attuale)
  - `pageBg`: `{ r:245, g:245, b:245, a:100 }` (grigio chiaro, come attuale `#f5f5f5`)

### `app/settings/actions.ts`
- Aggiornare `SaveBgResult` per usare `Rgba`.
- Aggiornare `saveHeaderBg` per leggere e salvare anche `a`.
- Aggiungere `saveFooterBg` e `savePageBg` (stessa struttura).

### `app/settings/settings-form.tsx`
- Aggiungere canale `A` (0–100) al pannello header esistente.
- Aggiungere `<BgColorPanel>` (componente interno) per evitare triplicazione: accetta `title`, `savedColor`, `action`, risultato.
- Replicare il pannello per footer e pagina.
- Aggiornare `Props` con `footerBg: Rgba` e `pageBg: Rgba`.

### `app/settings/page.tsx`
- Passare `footerBg` e `pageBg` dal `readSettings()` al form.

### `components/header.tsx`
- Cambiare `rgb(...)` → `rgba(r, g, b, a/100)`.
- Aggiornare tipo prop da `Rgb` → `Rgba`.

### `components/footer.tsx`
- Accettare prop `footerBg: Rgba`, applicare `rgba(...)` al `background`.
- Default: `{ r:255, g:255, b:255, a:100 }`.

### `app/layout.tsx`
- Passare `footerBg` al componente `<Footer>`.
- Applicare `pageBg` come `background` inline su `<main>`.

---

## Scelte tecniche

- Nessun nuovo file creato: tutto dentro i file esistenti.
- `BgColorPanel` è un componente funzionale interno a `settings-form.tsx` (non esportato), giustificato dalla triplicazione esatta.
- `Rgb` viene rinominato `Rgba` in `lib/settings.ts`; tutti i riferimenti aggiornati di conseguenza.

## Riepilogo implementazione

- **File modificati**: `lib/settings.ts`, `data/settings.json`, `app/settings/actions.ts`, `app/settings/settings-form.tsx`, `app/settings/page.tsx`, `components/header.tsx`, `components/footer.tsx`, `app/layout.tsx`
- **Nessuno scostamento** rispetto al piano approvato
- `saveHeaderBg` ora restituisce `{ ok: true; color: Rgba }` (era `headerBg: Rgba`) — unificato con gli altri due per usare il campo `color` in `BgColorPanel`
- `pageBg` applicato al `background` del `<main>` nel layout (non al `<body>`, per non coprire header/footer)
