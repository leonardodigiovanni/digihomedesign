# Template Disegno PDF — Gestione in /amministrazione/templates

**Data:** 2026-04-23  
**Stato:** completato

---

## Obiettivo

Aggiungere alla pagina `/amministrazione/templates` una sezione **"Template Disegno"** con due template editabili (Portrait A4 e Landscape A4) che l'admin può personalizzare. Il template viene usato da `disegno-client.tsx` durante l'export PDF al posto del template hardcoded attuale.

---

## Struttura DB

Nuova tabella `disegno_templates`:

```sql
CREATE TABLE IF NOT EXISTS disegno_templates (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  orientamento  ENUM('portrait', 'landscape') NOT NULL,
  html          LONGTEXT NOT NULL,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

Una riga per orientamento (`portrait`, `landscape`). Se non esistono, vengono create automaticamente con il template default.

---

## Placeholder disponibili nel template HTML

| Placeholder | Sostituito con |
|-------------|----------------|
| `{{svg}}`   | `<img src="data:image/png;base64,..." style="max-width:100%;max-height:{{maxH}}px;display:block;border:1px solid #ccc;" />` |
| `{{data}}`  | Data corrente in formato `dd/mm/yyyy` |
| `{{W}}`     | Larghezza A4 in px (794 portrait / 1123 landscape) |
| `{{H}}`     | Altezza A4 in px (1123 portrait / 794 landscape) |

---

## Template default

HTML completo A4 con header (logo + HR + titolo + data), `{{svg}}` centrato, footer aziendale assoluto. Identico al template hardcoded attuale in `disegno-client.tsx`.

---

## File da creare/modificare

### 1. `app/amministrazione/templates/page.tsx`
- Aggiunta `CREATE TABLE IF NOT EXISTS disegno_templates`
- Inserimento righe default portrait/landscape se non esistono
- Carica e passa i due template al client come prop `disegnoTemplates`

### 2. `app/amministrazione/templates/templates-client.tsx`
- Aggiunta sezione "Template Disegno" sotto la sezione Preventivi
- Due righe (Portrait / Landscape) con bottone **Modifica**
- Stessa modal `TemplateEditor` esistente, con placeholder info aggiornati per `{{svg}}`, `{{data}}`, `{{W}}`, `{{H}}`

### 3. `app/amministrazione/templates/actions.ts`
- Aggiunta server action `salvaDisegnoTemplate(prevState, formData)`: update HTML per orientamento dato

### 4. `app/api/disegno-template/route.ts` *(nuovo)*
- `GET ?orientamento=portrait|landscape`
- Auth: cookie `session_role === 'admin'`
- Ritorna `{ html: string }` — il template HTML per quell'orientamento
- Usato da `disegno-client.tsx` in `handleExportPDF`

### 5. `app/disegno/disegno-client.tsx`
- `handleExportPDF` fetcha il template via `/api/disegno-template?orientamento=...`
- Sostituisce `{{svg}}`, `{{data}}`, `{{W}}`, `{{H}}` nel HTML
- Monta il div template con `dangerouslySetInnerHTML={{ __html: filledHtml }}`
- html2canvas cattura → jsPDF salva
- Rimuove il template hidden dopo il salvataggio

---

## Note tecniche

- `dangerouslySetInnerHTML` è sicuro qui perché il contenuto viene salvato solo da admin
- Le immagini `/images/dg-t.png` nel template vengono risolte da html2canvas via `useCORS: true`
- Fallback: se l'API fallisce, si usa il template hardcoded già presente
