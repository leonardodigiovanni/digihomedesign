# Stampa Preventivo con Pubblicità

**Data:** 2026-06-17  
**Stato:** in pianificazione

---

## Obiettivo

Aggiungere un secondo tasto di stampa "Stampa con pubblicità" visibile solo a `dipendente` e `admin` nella pagina stampa preventivo (`/area-clienti/preventivi/[id]/stampa`).

Quando scelto, il PDF/stampa includerà **2 pagine A4 pubblicitarie** prima del preventivo vero e proprio:
- **Pagina 1**: Riproduzione del volantino aziendale (identico a `/volantino`)
- **Pagina 2**: Slogan ad effetto + 4 screenshot app + elenco esclusività

La stampa classica rimane invariata.

---

## File coinvolti

| File | Modifica |
|------|----------|
| `app/area-clienti/preventivi/[id]/stampa/stampa-client.tsx` | Aggiunge `coverPages?: string[]` a `StampaData`, prepend cover pages nella paginazione, bottone "Stampa con pubblicità" |
| `app/area-clienti/preventivi/[id]/stampa/page.tsx` | Legge `searchParams.pub`, se `pub=1` e isStaff genera i 2 HTML cover, passa `showPubBtn` al client |

---

## Passi principali

### 1. `StampaData` — nuovo campo
```ts
coverPages?: string[]  // HTML stringhe pagine intere (794×1123), no header/footer sistema
```

### 2. `StampaClient` — nuovi props
```ts
showPubBtn?: boolean   // mostra il tasto "Stampa con pubblicità" (link a ?pub=1)
```
In `paginate()`: prepend le cover pages come pagine complete senza header/footer/padding del sistema.

### 3. `page.tsx` — searchParams
```ts
export default async function Page({ params, searchParams })
```
- Se `(await searchParams).pub === '1'` e `isStaff`: chiama `buildCoverPages()` e aggiunge a `stampaData.coverPages`
- Passa `showPubBtn={isStaff}` a `StampaClient`

### 4. `buildVolantinoCoverHtml()` — pagina 1
HTML 794×1123 che replica il volantino:
- Header con `chiave.png` + logo `DIGI-HOME-DESIGN-APP.png` + `nome_tr.png`
- Banda bordeaux "CHIAVI IN MANO"
- Corpo 3 colonne servizi
- Footer con `mano-t.png` + `app.png`
- Zona nera con contatti
- Legge le impostazioni pagina/footer da `readSettings()` per i colori del corpo

### 5. `buildAppCoverHtml()` — pagina 2
HTML 794×1123:
- Header scuro con slogan ad effetto
- 4 screenshot app in griglia 2×2 con label
- Lista esclusività (app, preventivi online, foto/video cantiere, avvisi, documenti/fatture)
- Footer con logo + QR code (immagine statica `/images/cta/digi-home-design-srl-app.png`)

---

## Scelte tecniche

- Le cover pages bypassano il sistema header/footer/padding del paginator
- I colori del corpo volantino vengono letti da `readSettings()` lato server
- Per i modi `gold`/`silver` vengono usate le classi CSS già presenti nel global stylesheet (funzionano sia nell'anteprima DOM che in html2canvas)
- Nessuna modifica alla stampa classica o al percorso `/app/preventivo/[id]/stampa`

---

## Stato
- [x] **Completato** — 2026-06-17

## Riepilogo modifiche

| File | Modifica effettiva |
|------|--------------------|
| `app/area-clienti/preventivi/[id]/stampa/stampa-client.tsx` | Aggiunto `usePathname`, `coverPages?: string[]` a `StampaData`, `showPubBtn?: boolean` prop, prepend coverPages in `paginate()`, bottoni "Stampa con pubblicità" (oro) e "Stampa classica" (nero) |
| `app/area-clienti/preventivi/[id]/stampa/page.tsx` | Aggiunto import `readSettings`/bg-utils, funzioni `bgInlineCss`, `volantinoSubBg`, `buildVolantinoCoverHtml`, `buildAppCoverHtml`, gestione `searchParams.pub` nella `Page`, passaggio `showPubBtn={isStaff}` |
