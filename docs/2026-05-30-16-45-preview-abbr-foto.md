# Preview articoli: abbr → PreviewInfisso, no abbr → foto fullscreen

**Data:** 2026-05-30 16:45  
**Stato:** completato

## Obiettivo

Uniformare il comportamento della preview (bottone occhio) in entrambi i carrelli:

- **Articolo con `abbr` valorizzato** → `PreviewInfisso` fullscreen (comportamento già esistente nel preventivo, invariato)
- **Articolo senza `abbr`** → immagine `foto_url` fullscreen, più grande possibile nel viewport, click per chiudere

## Modifiche per carrello PREVENTIVO

**`app/area-clienti/carrello-preventivo/carrello-client.tsx`**  
- Nel blocco preview (riga ~1009): aggiungere condizione
  - se `previewArt.abbr` non vuoto → `PreviewInfisso` (invariato)
  - se `previewArt.abbr` vuoto/null → `<img>` fullscreen con `previewArt.foto_url`, `objectFit:'contain'`, `width:'100%'`, `height:'100%'`
  - se né abbr né foto → niente (bottone occhio già disabilitato o nascosto in quel caso)

## Modifiche per carrello ACQUISTI

**`app/area-clienti/carrello-acquisti/page.tsx`**  
- Aggiungere `abbr`, `profilo_frontale_mm` alla query DB del listino
- Calcolare `bar_color` e `bar_color_acc` dai figli (stesso pattern di `carrello-preventivo/page.tsx` con `extractAvgColor`)
- Passare i campi agli articoli

**`app/area-clienti/carrello-acquisti/carrello-acquisti-client.tsx`**  
- Aggiungere `abbr`, `profilo_mm`, `bar_color`, `bar_color_acc` al tipo `ArticoloCarrelloAcquisti`
- Aggiungere import `PreviewInfisso`
- Sostituire il modal testuale con:
  - se `abbr` → fullscreen `PreviewInfisso` (stesso stile del preventivo: `position:fixed, inset:0, bg:#fff, click per chiudere`)
  - se no `abbr` + `foto_url` → fullscreen `<img objectFit:'contain'>`
  - se nessuno dei due → bottone occhio disabilitato/nascosto

## Scelte tecniche

- Stessa struttura CSS del preventivo per il fullscreen (position fixed, inset 0, bg #fff, zIndex 1000)
- Il bottone occhio nel carrello acquisti è visibile solo se `abbr` oppure `foto_url` esiste sull'articolo principale (non sui figli/caratteristiche)
