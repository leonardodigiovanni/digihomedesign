# Preview Infisso — Anteprima visiva articolo

**Data:** 2026-05-22  
**Stato:** completato

## Obiettivo

Generare un'anteprima visiva realistica di un infisso (finestra o porta) sovrapposto a una foto di stanza, proporzionale alle misure dell'articolo, con profili nel colore specificato e vetri che mostrano uno sfondo esterno continuo.

## Approccio a strati (SVG)

```
Layer 1 — Stanza:      immagine foto interna con parete frontale
Layer 2 — Sfondo:      paesaggio/esterno, clippato esattamente sulle zone vetro
Layer 3 — Telaio:      profili SVG disegnati sopra, colore da articolo.colore
```

Il background esterno è **uno solo** posizionato sull'intera area dell'infisso, poi rivelato solo nelle zone vetro tramite `clipPath`. Così attraverso ante, pilastrini e traverse lo sfondo risulta continuo e realistico.

## Asset da creare in `public/images/preview/`

| File | Contenuto | Formato |
|------|-----------|---------|
| `stanza.svg` | Interno stanza, parete chiara frontale, pavimento legno, soffitto | SVG |
| `sfondo-finestra.svg` | Cielo blu, colline verdi, campagna | SVG |
| `sfondo-porta.svg` | Vialetto, giardino, cielo | SVG |

Tutti SVG con gradients e forme geometriche semplici ma credibili. L'utente potrà sostituirli con foto reali senza toccare il codice.

## Componente React

**File:** `components/preview-infisso.tsx`  
**Props:**
```ts
{
  larghezza_cm: number
  altezza_cm: number
  colore: string          // es. "Bianco", "Antracite", "Legno noce"
  tipo_prodotto: string   // es. "Finestra", "Porta finestra", "Porta"
  n_ante: number
  haVetro?: boolean
  haTraversa?: boolean    // da decidere se serve flag o logica automatica
}
```

**Canvas:** 800×550px SVG responsive (`viewBox`, `width: 100%`)

## Logica geometrica

### Scaling
- La parete nel disegno stanza occupa ~400×420px del canvas
- L'infisso viene scalato per stare al massimo dentro la parete mantenendo le proporzioni reali (larghezza/altezza)
- Centrato sulla parete

### Profili
- Spessore profilo esterno: ~5% della larghezza infisso (minimo 6px)
- Spessore traversa/pilastrino: ~3.5%
- Colore mappato da stringa: "Bianco"→`#f5f5f0`, "Antracite"→`#3a3a3a`, "Legno noce"→`#7b4f2e`, ecc.

### Ante (n_ante)
- 1 anta → unico pannello vetro
- 2 ante → due pannelli affiancati (pilastrino centrale)
- 3 ante → tre pannelli (2 pilastrini)
- 0 → finestra fissa (nessuna maniglia)

### Tipo prodotto
- "Porta" / "Porta finestra" → altezza > larghezza, pannello inferiore cieco (anta porta)
- "Finestra" / altri → tutto vetro

## Dove si usa

Nella pagina preventivo (`/clienti/preventivi/[id]` e `/area-clienti/preventivi/[id]`) e nel carrello (`/area-clienti/carrello-preventivo`): sotto ogni articolo primario viene mostrata la preview (collassabile).

## Passi di implementazione

1. Creare cartella `public/images/preview/` con i 3 SVG
2. Creare `components/preview-infisso.tsx`
3. Integrare nella tabella articoli di `preventivo-client.tsx` (riga espandibile sotto ogni root)
4. Integrare in `carrello-client.tsx` (identico)

## Note

- La preview è puramente visiva/decorativa, non influenza calcoli
- In stampa PDF la preview non compare (classe `no-print` o esclusa dalla generazione server-side)
- L'utente può sostituire i 3 SVG con JPEG/PNG reali: basta aggiornare l'estensione nei path
