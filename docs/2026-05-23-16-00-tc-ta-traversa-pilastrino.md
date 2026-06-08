# TC/TA — Traversa (T) e Pilastrino (P) interni

**Data:** 2026-05-23  
**Stato:** completato

## Obiettivo

Estendere il disegno TC/TA (sia nella preview che nel PDF stampa) per rappresentare:

- **T (Traversa)**: elemento orizzontale che divide l'area interna
- **P (Pilastrino)**: elemento verticale che divide l'area interna

Spessore T/P = 2/3 del profilo_mm dell'articolo (uguale ai lati del telaio).

## Formato abbreviazione

`TC(elem1-elem2-elem3...)`

Gli elementi alternano **aree** e **divisori**:
- `X()` = area a dimensione variabile (divide lo spazio rimanente in parti uguali)
- `120()` = area con dimensione fissa 120 cm
- `T` = traversa orizzontale
- `P` = pilastrino verticale

Ordine: da sinistra a destra = dall'alto al basso (per T) o da sinistra a destra (per P).

### Esempi

| Abbreviazione | Descrizione |
|---|---|
| `TC(X())` | Telaio senza divisori (un'area) |
| `TC(X()-T-X())` | Traversa centrale, due aree uguali |
| `TC(X()-P-X())` | Pilastrino centrale, due aree uguali |
| `TC(X()-T-120())` | Traversa, area sotto 120cm, area sopra rimanente |
| `TC(X()-T-X()-T-120())` | Due traverse, area sotto 120cm, poi due aree uguali |

## File coinvolti

1. `app/area-clienti/carrello-preventivo/stampa/page.tsx` — funzione `disegnoTcTa`
2. `components/preview-infisso.tsx` — blocco rendering TC/TA

## Passi principali

1. Estrarre il contenuto tra parentesi: `TC(...)` → parse di `...`
2. Splitting per `-` → token alternati area/divisore
3. Calcolare posizione in pixel di ciascun T/P
4. Aggiungere `<rect>` per ogni T/P nel SVG

## Calcolo posizioni T (verticale)

- `innerH` = altezza interna al telaio
- Area fissa: `(cm / altezza_cm) * innerH`
- Area variabile: `(innerH - somma_fisse - n_divisori * pX) / n_variabili`
- T posizionato subito dopo ogni area, spessore = `pX`

## Calcolo posizioni P (orizzontale)

- `innerW` = larghezza interna al telaio
- Area fissa: `(cm / larghezza_cm) * innerW`
- Area variabile: `(innerW - somma_fisse - n_divisori * pX) / n_variabili`
- P posizionato subito dopo ogni area, spessore = `pX`
