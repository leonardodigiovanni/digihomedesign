# Rendering Tc() e Ta() — Regole geometriche base

**Data:** 2026-05-22  
**Stato:** bozza — in attesa di conferma

## Obiettivo

Creare un sistema di rendering SVG per telai di infissi basato su una grammatica di abbreviazioni.  
Prima iterazione: solo `Tc()` (telaio chiuso) e `Ta()` (telaio aperto), senza contenuto interno.

## Regole geometriche

### Tc() — Telaio Chiuso
4 barre (sopra, destra, sotto, sinistra) con giunzioni a 45° in tutti e 4 gli angoli.

Dati: origine `(ox, oy)`, larghezza `W`, altezza `H`, spessore profilo `P`.

| Barra   | Poligono (senso orario)                                                  |
|---------|--------------------------------------------------------------------------|
| Sopra   | `(ox,oy)` → `(ox+W,oy)` → `(ox+W-P,oy+P)` → `(ox+P,oy+P)`            |
| Destra  | `(ox+W,oy)` → `(ox+W,oy+H)` → `(ox+W-P,oy+H-P)` → `(ox+W-P,oy+P)`  |
| Sotto   | `(ox,oy+H)` → `(ox+W,oy+H)` → `(ox+W-P,oy+H-P)` → `(ox+P,oy+H-P)`  |
| Sinistra| `(ox,oy)` → `(ox+P,oy+P)` → `(ox+P,oy+H-P)` → `(ox,oy+H)`           |

### Ta() — Telaio Aperto (nessuna barra in basso)
3 barre (sopra, destra, sinistra). Gli angoli in alto sono a 45°; il fondo è taglio retto.

| Barra   | Poligono                                                                 |
|---------|--------------------------------------------------------------------------|
| Sopra   | identico a Tc                                                            |
| Destra  | `(ox+W,oy)` → `(ox+W,oy+H)` → `(ox+W-P,oy+H)` → `(ox+W-P,oy+P)`     |
| Sinistra| `(ox,oy)` → `(ox+P,oy+P)` → `(ox+P,oy+H)` → `(ox,oy+H)`              |

## File coinvolti

- **Nuovo**: `components/preview-infisso.tsx` — aggiungere funzioni `renderTc()` e `renderTa()` con le geometrie sopra
- **Nuovo**: `app/test-telai/page.tsx` — pagina demo (solo admin) per vedere i due telai affiancati a varie dimensioni

## Piano

1. Aggiungere in `preview-infisso.tsx` le funzioni SVG per Tc e Ta
2. Creare `app/test-telai/page.tsx` con griglia di esempi (varie L×H e spessore profilo)
3. Utente testa e dà feedback → iterazione successiva (aggiungere contenuto interno F, A, ecc.)

## Note

- Spessore profilo `P`: valore fisso per ora (es. 7% della dimensione minore), poi letto dalla scheda tecnica
- Colore profilo: crema `#f5f2ee` stroke `#111` come da convenzioni esistenti
