# UI: Responsive Header/Footer, Manutenzione Toggle, Navbar Gold/Silver

**Data:** 2026-04-12  
**Stato:** completato

## Obiettivo

Correzioni UI su più componenti: pannello manutenzione, layout responsive di header e footer, tema grafico navbar e subheader.

---

## Modifiche effettive

### `app/settings/manutenzione-toggle.tsx`
- Rimossa immagine decorativa (`manutenzione.png`)
- Rimosso testo descrittivo dal pannello
- Allineamento unificato a sinistra (come gli altri pannelli di Settings)
- Sfondo bianco `#fff`, bordo `1px solid #e0e0e0`, padding `24px 28px 28px` — identico agli altri pannelli
- Badge **ATTIVA** → rosso `#c04444`; badge **DISATTIVA** → grigio `#e0e0e0`
- Bottone **Attiva manutenzione** → `btn-red` (azione distruttiva)
- Bottone **Ripristina sito** → `btn-green`
- Icona `⊘` (U+2298) anteposta al testo del bottone rosso, allineata via `<span style={{ top: '-3px' }}>`

### `components/header.tsx`
- `height: 90` mantenuto fisso (no wrap interno)
- `<HeaderAuth>` avvolto in `<div className="header-auth-in-header">` nascosto a ≤720px via `<style>` con media query
- Return wrappato in fragment `<>` per contenere il tag `<style>`

### `components/footer.tsx`
- Rimosso `position: absolute` dalle icone social
- Layout riformulato: dati aziendali e icone social in flex row con `flexWrap: 'wrap'` e `justifyContent: 'space-between'`
- Su schermi stretti le icone social scendono sotto i dati aziendali
- Separatore spostato dopo il flex row
- Barra nera inferiore: aggiunto `flexWrap: 'wrap'`

### `app/layout.tsx`
- Aggiunto **subheader** (barra tra header e navbar): `className="header-auth-overflow-bar class_silver_D_safe"`, `height: 48px`, visibile solo a ≤720px via `display: none` + media query CSS iniettata via `<style>`
- La barra contiene `<HeaderAuth>` duplicato (istanza indipendente per il layout stretto)
- Aggiunto `<style>` tag con media query `@media (max-width: 720px)` che:
  - Mostra `.header-auth-overflow-bar`
  - Aumenta `padding-top` di `.main-content` di 48px per compensare la barra extra
- Aggiunto `className="main-content"` al `<main>`
- Import di `HeaderAuth` aggiunto

### `components/navbar.tsx`
- `<nav>` cambiato da `background: '#f8f8f8'` a `className="class_gold_D_safe"`
- Bordo inferiore aggiornato da `#e8e8e8` a `#c8960c` (oro)

### `data/settings.json`
- `pageBgMode` rimasto su `silver_d` (nessuna modifica netta)

---

## Schema visivo (stretto ≤720px)

```
┌─────────────────────────────────┐  ← header (90px, effetto headerBgMode)
│  [logo]                         │
├─────────────────────────────────┤  ← subheader (48px, silver_d)
│                    [auth/login] │
├─────────────────────────────────┤  ← navbar (42px, gold_d)
│  Home  Sezioni  ...             │
└─────────────────────────────────┘
```

## Schema visivo (largo >720px)

```
┌──────────────────────────────────────────┐  ← header (90px)
│  [logo]                      [auth/login]│
├──────────────────────────────────────────┤  ← navbar (42px, gold_d)
│  Home  Sezioni  ...                      │
└──────────────────────────────────────────┘
  (subheader non visibile)
```
