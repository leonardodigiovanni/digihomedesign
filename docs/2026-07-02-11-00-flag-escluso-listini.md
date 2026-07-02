# Flag "escluso" su voci listino + overlay foto

**Data:** 2026-07-02  
**Stato:** completato

## Obiettivo

Aggiungere un flag booleano `escluso` alle voci del listino. Quando attivo:
- In UI (`/area-lavoro/listini`): la foto diventa semi-trasparente (opacity 0.35) con sovrapposta `escluso.png` a piena nitidezza nelle stesse dimensioni del riquadro
- In stampa PDF (carrello-preventivo/stampa): stesso effetto nell'HTML che viene stampato

## File coinvolti

### DB / server
- `app/area-lavoro/listini/page.tsx` — ALTER TABLE + SELECT + map
- `app/area-lavoro/listini/actions.ts` — ALTER TABLE in ensureTable() + `toggleEscluso` action

### UI listini
- `app/area-lavoro/listini/listini-client.tsx`
  - Tipo `Articolo`: aggiungere `escluso: number`
  - `COL_KEYS`: aggiungere `'escluso'` dopo `'foto'`
  - `COL_LABELS/COL_DEFAULTS_VISIBLE`: idem
  - `ImgCell`: prop `escluso?: boolean` → overlay assoluto
  - `RigaNormale`: colonna escluso con toggle button (stesso pattern degli altri flag)
  - Import `toggleEscluso` da actions

### Stampa PDF
- `app/area-clienti/carrello-preventivo/stampa/page.tsx`
  - SELECT listini: aggiungere `escluso`
  - Tipo `ArtRow`: aggiungere `escluso?: number`
  - `articoloBlockHTML`: foto cell → div relativo con overlay se `escluso=1`
  - `caratteristicheHTML`: stesso trattamento sulla foto 40×28

## Rendering overlay

**UI (React):**
```tsx
// container già position:relative, height:90
<img src={url} style={{ opacity: escluso ? 0.35 : 1, ... }} />
{escluso && (
  <img src="/images/app/escluso.png"
    style={{ position:'absolute', inset:0, width:'100%', height:'100%',
             objectFit:'contain', pointerEvents:'none' }} />
)}
```

**HTML stampa (inline string):**
```html
<div style="position:relative;width:100%;height:124px;">
  <img src="..." style="...;opacity:0.35;" />
  <img src="/images/app/escluso.png"
    style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;" />
</div>
```
