# Drag & Drop percorsi tra voci listino

**Data:** 2026-07-02  
**Stato:** completato

## Obiettivo

In `/area-lavoro/listini`, ogni voce mostra le sue coppie percorso (categoria + sottocategoria) nel `PercorsiPanel`. L'utente vuole poter trascinare una coppia da una voce a un'altra, equivalente a chiamare `addPercorsoListino(destinazioneId, categoria, sottocategoria)`.

## File coinvolti

- `app/area-lavoro/listini/listini-client.tsx` — unico file da modificare
  - `PercorsiPanel` (riga ~801): aggiunta `draggable` sui chip coppia + `onDragStart`
  - `PercorsiPanel` (riga ~828): aggiunta `onDrop` / `onDragOver` sul container drop zone
  - Stile visivo: highlight drop zone durante il drag

## Approccio tecnico

**HTML5 Drag & Drop API** con `dataTransfer` — nessuno stato globale aggiuntivo, tutto passa via `dataTransfer.setData/getData`.

### Drag source (chip coppia)

Ogni chip coppia diventa `draggable`:
```tsx
<span draggable onDragStart={e => {
  e.dataTransfer.setData('percorso', JSON.stringify({ categoria: p.categoria, sottocategoria: p.sottocategoria }))
  e.dataTransfer.effectAllowed = 'copy'
}} style={{ cursor: 'grab', ... }}>
```

### Drop target (PercorsiPanel)

Il container del pannello diventa drop zone:
```tsx
<div
  onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
  onDragLeave={() => setIsDragOver(false)}
  onDrop={async e => {
    e.preventDefault(); setIsDragOver(false)
    const { categoria, sottocategoria } = JSON.parse(e.dataTransfer.getData('percorso'))
    setDropping(true)
    await addPercorsoListino(listinoId, categoria, sottocategoria)
    router.refresh()
    setDropping(false)
  }}
  style={{ ..., background: isDragOver ? '#fffde7' : undefined, outline: isDragOver ? '2px dashed #f9a825' : undefined }}
>
```

### Stato locale aggiunto a PercorsiPanel

- `isDragOver: boolean` — per highlight visivo
- `dropping: boolean` — spinner/feedback durante il salvataggio

## Note

- Se si trascina una coppia sullo stesso pannello sorgente, `addPercorsoListino` gestisce i duplicati (non crea doppioni)
- Il chip deve avere `cursor: grab` a riposo, `cursor: grabbing` durante il drag (tramite CSS)
- Nessuna modifica a server actions o DB — si riusa `addPercorsoListino` già esistente
- Nessuna modifica alle pagine app o brand
