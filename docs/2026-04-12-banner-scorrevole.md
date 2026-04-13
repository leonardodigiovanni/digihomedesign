# Banner scorrevole nel subheader

**Data:** 2026-04-12  
**Stato:** in attesa di conferma

## Obiettivo

Trasformare il subheader (barra `class_silver_D_safe` tra header e navbar) in un banner scorrevole configurabile dall'admin tramite un nuovo pannello in Settings.

---

## Funzionamento

- **Banner abilitato**: il subheader diventa visibile e fa scorrere il testo salvato (animazione CSS marquee/scrolling)
- **Banner disabilitato**: il subheader è nascosto (come se non esistesse, senza occupare spazio)

---

## File coinvolti

### 1. `data/settings.json`
Aggiungere due nuovi campi:
```json
"bannerAbilitato": false,
"bannerTesto": ""
```

### 2. `lib/settings.ts`
Aggiungere `bannerAbilitato: boolean` e `bannerTesto: string` al tipo `Settings` e al `readSettings()`.

### 3. `app/settings/actions.ts`
Nuova server action `saveBanner(formData)` che salva `bannerAbilitato` e `bannerTesto` in `settings.json`.

### 4. `app/settings/banner-panel.tsx` (nuovo componente)
Pannello admin con:
- Checkbox o toggle ON/OFF per abilitare il banner
- `<textarea>` o `<input>` per editare il testo
- Bottone salva
- Preview del testo corrente

### 5. `app/settings/page.tsx`
Aggiungere `<BannerPanel>` sopra o sotto `<ManutenzioneToggle>`.

### 6. `app/layout.tsx`
- Leggere `bannerAbilitato` e `bannerTesto` da `readSettings()`
- Se abilitato: rimuovere `display: none` dal subheader e iniettare il testo scorrevole
- Il `paddingTop` del main e la media query CSS cambiano solo se il banner è attivo

### 7. `components/subheader-banner.tsx` (nuovo, client component opzionale)
Oppure gestire tutto server-side con CSS inline — il testo scorrevole può essere realizzato con pura animazione CSS (`@keyframes marquee`) senza JS.

---

## Scelte tecniche

- **Animazione**: CSS `@keyframes` con `translateX` da `100%` a `-100%` — nessun JS, performante
- **Velocità**: fissa (es. 18s loop) o calcolabile in base alla lunghezza del testo
- **Visibilità subheader**: controllata server-side nel layout (non via CSS media query ma via rendering condizionale)
- **Breakpoint subheader**: rimane visibile a ≤720px solo se abilitato (o potrebbe essere sempre visibile quando abilitato, a prescindere dalla larghezza)

---

## Note

- Il pannello Banner in Settings segue lo stile degli altri pannelli (`background: #fff`, `border: 1px solid #e0e0e0`, `borderRadius: 10`)
- Il `paddingTop` del `<main>` va aumentato di 48px quando il banner è attivo (per compensare l'altezza del subheader)
