# Separazione pulsanti: Scarica / Stampa / Condividi

**Data:** 2026-05-26  
**Stato:** bozza — in attesa di conferma

## Obiettivo

Sostituire il singolo pulsante "Scarica / Stampa PDF" con azioni distinte:

| Contesto | Pulsanti |
|----------|----------|
| Desktop  | **Scarica** (nei Download, senza dialogo) + **Stampa** (dialogo stampante) |
| Mobile   | **Scarica** (nei Download) + **Condividi** (Web Share API: WhatsApp, email, ecc.) |

---

## Vincoli browser

Il browser **non permette** di salvare un file PDF silenziosamente nella cartella Download senza che passi da un dialogo — a meno che il file venga generato server-side e inviato come `Content-Disposition: attachment`.

---

## Opzioni tecniche per "Scarica"

### Opzione A — Server-side PDF (puppeteer/playwright)
- Nuova API route `/api/stampa/preventivo/[id]/pdf`
- Il server apre Chromium headless, naviga la pagina stampa e restituisce un vero `.pdf`
- Download diretto nei Download del browser, nessun dialogo
- **Pro:** qualità perfetta, nessuna interazione utente
- **Contro:** aggiunge dipendenza pesante (puppeteer ~300MB + Chromium)

### Opzione B — Client-side con html2pdf.js (npm)
- Genera PDF da HTML direttamente nel browser (usa html2canvas + jsPDF internamente)
- Download diretto via `<a download="preventivo.pdf">`
- **Pro:** nessun server, download diretto
- **Contro:** il rendering è una screenshot canvas → testo non selezionabile nel PDF, SVG (disegni infisso) potrebbero perdere qualità

### Opzione C — Download HTML (nessuna dipendenza)
- Scarica il documento come file `.html` con tutti gli stili inline
- Il file si apre nel browser e si stampa perfettamente in A4
- **Pro:** zero dipendenze, qualità identica all'anteprima attuale
- **Contro:** il file è `.html`, non `.pdf` — l'utente deve aprirlo + stampare

### Opzione D — "Scarica" apre il dialogo print ottimizzato (no dipendenze)
- "Scarica" apre `window.open` + `win.print()` (identico a Stampa) ma con un banner interno che dice "Seleziona 'Salva come PDF' come destinazione → il file va nei Download"
- "Stampa" apre lo stesso dialogo senza banner
- **Pro:** zero dipendenze, funziona già
- **Contro:** richiede ancora un'azione manuale all'utente

---

## ⚠️ Scoperta chiave

`/volantino` usa già **`html2canvas` + `jsPDF`** (dinamicamente importati) con lo stesso pattern:  
- `html2canvas` cattura il DOM → canvas  
- `jsPDF` converte in PDF e chiama `pdf.save()`  
- `navigator.share` con file per mobile  

Le dipendenze sono **già installate** nel progetto. Nessun `npm install` necessario.

## Proposta raccomandata (Opzione B adattata)

Stessa logica del volantino, applicata alle pagine preventivo già renderizzate nel DOM:

**Desktop:**
- **Scarica PDF**: `html2canvas` su ogni `.page-div` → `jsPDF` → `pdf.save('preventivo.pdf')` (download diretto)
- **Stampa**: `window.open` + `win.print()` + `onafterprint` (già esistente)

**Mobile** (rilevato via `window.innerWidth < 768` o `navigator.maxTouchPoints > 0`):
- **Scarica PDF**: stessa generazione jsPDF → download
- **Condividi**: stessa generazione → Blob → `navigator.share({ files: [file] })`

**Nota qualità:** `html2canvas` cattura il DOM come immagine (testo non selezionabile nel PDF risultante, SVG dei disegni infisso incluso come raster). Per preventivi tecnici con SVG potrebbe non essere accettabile.

---

## File coinvolti (stima)

- `app/area-clienti/preventivi/[id]/stampa/stampa-client.tsx`
- `app/area-clienti/carrello-preventivo/stampa/stampa-client.tsx`
- Eventuale `app/api/stampa/[...]/route.ts` (solo opzione A)
- `package.json` (solo opzione A o B)
