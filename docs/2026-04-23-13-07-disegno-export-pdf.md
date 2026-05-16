# Export PDF — Editor Disegno Infisso

**Data:** 2026-04-23  
**Stato:** completato

---

## Obiettivo

Aggiungere un pulsante **"Esporta PDF"** nell'editor disegno che genera un PDF A4 (portrait o landscape, a seconda dell'orientamento corrente) con template aziendale: header con logo + titolo, disegno SVG centrato, footer con dati azienda.

---

## Approccio tecnico

Stesso stack dei preventivi: **jsPDF + html2canvas** (già installati).  
Tutto client-side, nessuna route separata — il disegno vive in stato React.

### Flusso export

1. `serializeSvgToPng()` — serializza il `<svg>` DOM in PNG via Canvas API (compatibile con html2canvas)
2. `printPngUrl` state — contiene il data URL del PNG; quando valorizzato, il template hidden viene montato nel DOM
3. `handleExportPDF()`:
   - serializza SVG → PNG
   - aspetta il render del template
   - html2canvas cattura il `printTemplateRef`
   - crea jsPDF con orientamento corretto
   - salva `disegno-infisso.pdf`

---

## Template A4

**Dimensioni:** portrait 794×1123 px · landscape 1123×794 px (96 DPI)  
**Posizionamento:** `position: fixed; top: -9999px; left: -9999px` (off-screen, nel DOM solo durante export)

### Header (~60px)
- Logo `/images/dg-t.png` a sinistra, logo `/images/nome_tr.png` a destra
- Linea separatrice blu `#1a3a5c`
- Titolo **"Disegno Infisso"** + data corrente

### Corpo
- SVG PNG scalato al massimo spazio disponibile, centrato, bordo sottile `#aaa`

### Footer (assoluto in fondo)
- Dati azienda: `Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824`
- Linea separatrice

---

## File coinvolti

- `app/disegno/disegno-client.tsx` — unico file da modificare:
  1. `useRef` per `svgRef` (sul `<svg>`) e `printTemplateRef` (sul template hidden)
  2. State `printPngUrl: string`
  3. Helper `serializeSvgToPng(svgEl)`
  4. Handler `handleExportPDF()`
  5. Template hidden div (renderizzato solo quando `printPngUrl` è valorizzato)
  6. Bottone `Esporta PDF` nel pannello bottoni (sezione Modifica o nuova sezione Export)

---

## Note

- Il bottone è disabilitato se `elems.length === 0` (canvas vuoto)
- Lo stato di loading `loadingPdf` mostra testo "Generazione..." sul bottone
- Nessuna modifica al database, nessuna route nuova
