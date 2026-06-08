# App — Cataloghi + Carrello Preventivo + Carrello Acquisti

**Data:** 2026-06-07  
**Stato:** in pianificazione

## Obiettivo

Replicare in `/app` tre sezioni del sito normale:
- `/app/cataloghi` — identico a `/brand/cataloghi` (con sotto-rami `[slug]` e `[slug]/[voceSlug]`)
- `/app/carrello-preventivo` — identico a `/area-clienti/carrello-preventivo`, accessibile anche da non loggato
- `/app/carrello-acquisti` — identico a `/area-clienti/carrello-acquisti`, accessibile anche da non loggato

---

## File coinvolti

### Nuovi file da creare
| File | Origine |
|------|---------|
| `app/app/cataloghi/page.tsx` | copia di `app/brand/cataloghi/page.tsx` |
| `app/app/cataloghi/[slug]/page.tsx` | copia di `app/brand/cataloghi/[slug]/page.tsx` |
| `app/app/cataloghi/[slug]/[voceSlug]/page.tsx` | copia di `app/brand/cataloghi/[slug]/[voceSlug]/page.tsx` |
| `app/app/carrello-preventivo/page.tsx` | copia di `app/area-clienti/carrello-preventivo/page.tsx` |
| `app/app/carrello-acquisti/page.tsx` | copia di `app/area-clienti/carrello-acquisti/page.tsx` |

### Componenti client riusati (import diretto, senza duplicazione)
- `CarrelloClient` da `@/app/area-clienti/carrello-preventivo/carrello-client`
- `CarrelloAcquistiClient` da `@/app/area-clienti/carrello-acquisti/carrello-acquisti-client`
- `CatalogoWrapper` da `@/app/brand/cataloghi/[slug]/catalogo-wrapper`
- `CatalogoGrid` da `@/app/brand/cataloghi/catalogo-grid`
- `AggiungiArticoloAcquisto` da `@/components/aggiungi-articolo-acquisto-form`

---

## Differenze rispetto agli originali

### Carrelli
- **Nessun redirect** per utenti non loggati (i carrelli funzionano via cookie anche senza login)
- La **StaffView** nel carrello-preventivo viene soppressa (non serve in `/app`)
- I redirect dopo azioni (es. checkout, conversione in preventivo) puntano a `/app/...` invece di `/area-clienti/...`

### Cataloghi
- I link "Torna ai Cataloghi" puntano a `/app/cataloghi` invece di `/brand/cataloghi`
- Il link "Vai al Carrello" punta a `/app/carrello-preventivo` o `/app/carrello-acquisti`
- I link interni tra slug e voceSlug rimangono coerenti con `/app/cataloghi/...`

### Navigazione carrelli → catalogo
- Nei client dei carrelli, il link "Aggiungi articoli" punta a `/app/cataloghi` invece di `/brand/cataloghi`
- Richiede aggiunta di prop `catalogoHref` (o simile) ai componenti client, oppure override con `basePath`

---

## Passi principali

1. Creare `app/app/carrello-preventivo/page.tsx` — data fetch identico all'originale, nessun redirect, no StaffView
2. Creare `app/app/carrello-acquisti/page.tsx` — data fetch identico, nessun redirect
3. Creare `app/app/cataloghi/page.tsx` — clone di `brand/cataloghi/page.tsx` con link corretti
4. Creare `app/app/cataloghi/[slug]/page.tsx` — clone con link a `/app/cataloghi` e `/app/carrello-*`
5. Creare `app/app/cataloghi/[slug]/[voceSlug]/page.tsx` — clone con link corretti
6. Aggiornare il bottom nav o aggiungere voci di menu in `/app` per raggiungere cataloghi e carrelli

---

## Scelte tecniche

- **Nessuna duplicazione dei componenti client** (CarrelloClient, CatalogoWrapper, ecc.): si importano direttamente dall'originale
- I componenti client che hanno link hardcoded a `/brand/...` o `/area-clienti/...` vanno verificati uno per uno; dove necessario si aggiunge una prop `basePath` o si usa un override tramite prop specifica
- Il bottom nav di `/app` non viene modificato in questo task (i carrelli e cataloghi sono raggiungibili dai link nel body delle pagine)
