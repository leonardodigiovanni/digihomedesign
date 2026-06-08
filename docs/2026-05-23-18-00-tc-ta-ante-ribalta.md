# A/R — Ante e Ribalta dentro TC/TA

**Data:** 2026-05-23  
**Stato:** completato

## Obiettivo

Aggiungere i token `A` (anta) e `R` (ribalta) alla sintassi TC/TA.  
Le ante si spartiscono equamente lo spazio disponibile (come `X()`), senza bisogno di `P` espliciti tra loro.

## Formato token

| Token | Tipo | Cerniera | Maniglia |
|---|---|---|---|
| `cA()` | Anta | sinistra | assente |
| `Ac()` | Anta | destra | assente |
| `cAm()` | Anta | sinistra | destra |
| `mAc()` | Anta | destra | sinistra |
| `cRm()` | Ribalta | sinistra | destra |
| `mRc()` | Ribalta | destra | sinistra |

Regola: carattere **prima** di A/R = bordo sinistro, carattere **dopo** = bordo destro.  
`c` = cerniera, `m` = maniglia.

## Disegno anta (A)

- **Telaio anta**: 4 barre trapezoidali (come TC), spessore = pX (= 2/3 profilo_mm)
- **Indicatore apertura**: 2 linee dal bordo libero ai due angoli del bordo cerniera (V che punta alla cerniera)
- **Cerniere**: 2 rettangoli verticali su barra cerniera
  - Dimensioni: 15mm × 120mm (scalate con pxPerCmX)
  - Posizione: in alto e in basso nella barra verticale, centrati orizzontalmente in essa
- **Maniglia** (se presente): 1 rettangolo con radius, su barra maniglia
  - Dimensioni: 25mm × 120mm
  - Altezza dal basso: 35 cm (finestre, altezza < 200 cm) / 135 cm (porte, altezza ≥ 200 cm)
  - Centrato simmetricamente nella barra verticale
- **Colore accessori**: viola `#7B2BE2` (temporaneo, in futuro da caratteristica colore-accessori)

## Disegno ribalta (R)

Come l'anta, più secondo indicatore di apertura ribalta:
- Linee dai 2 angoli in basso del vetro al centro in alto (tilt)

## File coinvolti

1. `app/area-clienti/carrello-preventivo/stampa/page.tsx` — `disegnoTcTa`
2. `components/preview-infisso.tsx` — blocco TC/TA

## Passi principali

1. Parser token: riconoscere `[c|m]?[A|R][c|m]?()` → `{ kind:'anta'|'ribalta', hingeLeft, handleLeft, handleRight }`
2. Calcolo dimensioni: ogni anta/ribalta token vale come `X()` (variabile)
3. Per ogni anta/ribalta area: disegnare frame, indicatori, cerniere, eventuale maniglia
4. Supporto misto: `TC(X(F())-P-cAm()-Ac())` deve funzionare
