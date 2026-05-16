# Editor Disegno Infisso — `/disegno`

**Data:** 2026-04-21  
**Stato:** completato

## Obiettivo

Pagina interattiva accessibile solo ad admin (`/disegno`) con un editor SVG per comporre il disegno tecnico di un infisso/serramento per zone. Il canvas rappresenta il foglio A1 (scala 1:N); le zone sono denominate A1, A2, A3… in rosso tratteggiato (costruttive, rimovibili).

## File coinvolti

| File | Operazione |
|------|------------|
| `app/disegno/page.tsx` | NUOVO — server component, auth admin, monta `<DisegnoClient />` |
| `app/disegno/disegno-client.tsx` | NUOVO — editor SVG interattivo (client component) |
| `lib/nav-config.ts` | Aggiunge voce "Editor Disegno" in `adminPages` (id 63) |

## Architettura interna

### Sistema di coordinate
- Unità interne: **mm** (reali)
- A1 nasce quando si aggiunge il primo telaio (le sue dimensioni esterne definiscono A1)
- Tutte le zone e gli elementi usano coordinate **assolute** in mm
- SVG `viewBox = "0 0 A1.w A1.h"` — il CSS scala per il display

### Zone
```
Zone { name, x, y, w, h }   // mm assoluti
```
- A1 = canvas radice (definito dal primo telaio)
- A2 = area interna del telaio (dopo lo spessore profilo)
- A3…An = zone figlie da divisioni o telai annidati

### Elementi
```
FrameElem { id, type:'telaio'|'laterale_fisso', zone, x,y,w,h, spessore, aperto, innerZone? }
DivElem   { id, type:'divisione', zone, nAnte, childZones[] }
```

### Bottoni toolbar
| Bottone | Dati richiesti | Effetto |
|---------|---------------|---------|
| Aggiungi Telaio | dove, modo (centrato/coords), H cm, L cm, spessore mm, chiuso/aperto | Disegna frame + crea zona interna |
| Dividi in Ante | zona, n_ante | Crea N zone figlie uguali + linee divisorie |
| Laterale Fisso | zona, spessore mm | Riempie la zona con profilo + vetro (no cerniere/maniglia) |
| Nascondi/Mostra Zone | — | Toggle etichette rosse costruttive |
| Annulla | — | Rimuove ultimo elemento + relative zone |
| Reset | — | Cancella tutto |

### Rendering SVG
- **Telaio**: rect crema (profilo) + linee 45° agli angoli
- **Laterale fisso**: rect crema + linee 45° + rect vetro celestino interno
- **Divisione**: linee verticali tra zone
- **Zone labels**: bordi tratteggiati rossi + testo rosso (on top)

## Nessun impatto su
- DB / actions
- Altre pagine
- Routing esistente
