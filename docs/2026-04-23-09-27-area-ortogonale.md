# Area Ortogonale — Editor Disegno Infisso

**Data:** 2026-04-23  
**Stato:** pianificato

---

## Obiettivo

Aggiungere un elemento `+ Area Ortogonale` all'editor SVG che rappresenta in proiezione cavaliera (obliqua a 45°) una superficie perpendicolare al piano frontale, agganciata a un lato di una zona esistente.

---

## Descrizione visiva

Data una zona di ancoraggio con lato scelto, si disegna un parallelogramma con:

- **Lato vicino** = il lato scelto della zona (piena lunghezza, coincide con il bordo della zona)
- **Lato lontano** = parallelo al lato vicino, traslato di Δ = `larghezza_reale × 0.7 × drawScale` nella direzione a 45°
- **Spigoli** = linee a 45° che collegano i vertici del lato vicino a quelli del lato lontano

Direzione del vettore 45° in base al lato di ancoraggio:

| lato     | offset (dx, dy)  |
|----------|------------------|
| destra   | (+Δ, −Δ)         |
| sinistra | (−Δ, −Δ)         |
| alto     | (+Δ, −Δ)         |
| basso    | (+Δ, +Δ)         |

Esempio con `lato = 'destra'`, zona con angolo top-right = (rx, ry), h = altezza zona:

```
P1 = (rx, ry)               — top-right della zona
P2 = (rx+Δ, ry−Δ)           — P1 + offset 45°
P3 = (rx+Δ, ry+h−Δ)         — P4 + offset 45°
P4 = (rx, ry+h)             — bottom-right della zona
```

Poligono P1→P2→P3→P4 riempito con colore superficie laterale.

---

## Oclusione (coprente)

Gli elementi `OrtogonaleElem` vengono renderizzati **dopo tutti gli altri elementi** nel ciclo SVG, così si sovrappongono visivamente a tutto ciò che era già disegnato sotto di loro.

---

## Nuovo tipo TypeScript

```typescript
type OrtogonaleElem = {
  id: number
  type: 'ortogonale'
  zone: string                                   // zona di ancoraggio
  lato: 'sinistra' | 'destra' | 'alto' | 'basso'
  larghezza: number                              // mm reali
}
```

---

## File coinvolti

- `app/disegno/disegno-client.tsx` — unico file da modificare:
  1. Aggiunta tipo `OrtogonaleElem` e aggiornamento `DrawElem` union
  2. Aggiunta `ModalType` → `'ortogonale'`
  3. Nuovo component `OrtogonaleShape`
  4. State `ortForm` + `openModal` case
  5. Handler `handleAddOrtogonale`
  6. Rendering SVG: ortogonali renderizzati per ultimi
  7. Bottone `+ Area Ortogonale` nel pannello (dopo `+ Pannello`)
  8. Modal con campi: zona, lato, larghezza (cm)
  9. Undo: nessuna zona figlia → rimozione semplice dell'elemento

---

## Colore superficie

`#e0d9cc` — crema leggermente più scura del profilo (`#f5f2ee`) per indicare visivamente che è una faccia laterale, non frontale.

---

## Scelte tecniche

- Nessuna zona figlia generata (l'area ortogonale non crea zone logiche, è solo decorativa/grafica)
- Undo rimuove solo l'elemento dall'array `elems`, zero δ zone
- `larghezza` inserita in cm nel form, convertita in mm reali internamente (`× 10`) poi scalata con `drawScale`
- Il parallelogramma usa `<polygon>` SVG con stroke `#111`

---

## Riepilogo modifiche effettuate

**Stato:** completato

File modificato: `app/disegno/disegno-client.tsx`

- Aggiunto tipo `OrtogonaleElem` (zone, lato, larghezza in SVG mm)
- Aggiornate union `DrawElem` e `ModalType`
- Aggiunto component `OrtogonaleShape` (polygon SVG, fill `#e0d9cc`)
- Aggiunto state `ortForm` e case in `openModal`
- Aggiunto handler `handleAddOrtogonale` con validazione scala e larghezza
- Rendering SVG: elementi non-ortogonali prima, ortogonali per ultimi (oclusione)
- Aggiunto bottone `+ Area Ortogonale` nel pannello (dopo Pannello)
- Aggiunto modal con zona, lato (destra/sinistra/alto/basso), larghezza cm
- Aggiornato onClick del bottone Aggiungi
- Undo funziona senza modifiche: nessuna zona figlia da rimuovere
