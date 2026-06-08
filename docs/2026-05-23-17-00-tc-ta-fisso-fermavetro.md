# F() — Fisso con fermavetri

**Data:** 2026-05-23  
**Stato:** completato

## Obiettivo

Aggiungere il tipo area `F()` alla sintassi TC/TA. Un fisso è un pannello vetrato fisso il cui perimetro è tenuto da 4 fermavetri (due orizzontali sopra/sotto, due verticali ai lati).

## Spessore fermavetro

Spessore = 1/3 del profilo_mm dell'articolo = `pX / 2` (dato che pX corrisponde già a 2/3 del profilo).

## Struttura grafica di F()

Data un'area rettangolare `(ax, ay, aw, ah)`:

- **Fermavetro superiore**: `rect(ax, ay, aw, fvPx)`
- **Fermavetro inferiore**: `rect(ax, ay+ah-fvPx, aw, fvPx)`
- **Fermavetro sinistro**: `rect(ax, ay+fvPx, fvPx, ah-2*fvPx)`
- **Fermavetro destro**: `rect(ax+aw-fvPx, ay+fvPx, fvPx, ah-2*fvPx)`
- **Vetro centrale**: trasparente (lo sfondo si vede attraverso il clip già esistente)

Tutti i fermavetri hanno il colore del telaio (`pc`/`bc`).

## Sintassi

`F()` è un token area variabile (come `X()`), quindi:
- partecipa equamente alla distribuzione dello spazio residuo
- può coesistere con `X()`, `120()`, `T`, `P`

Esempi:

| Abbreviazione | Descrizione |
|---|---|
| `TC(F())` | Telaio chiuso, unico pannello fisso |
| `TC(F()-T-F())` | Due fissi separati da una traversa |
| `TC(F()-P-F())` | Due fissi separati da un pilastrino |
| `TC(X()-T-F())` | Area aperta sopra, fisso sotto |
| `TC(F()-P-X()-P-F())` | Fisso-pilastrino-apertura-pilastrino-fisso |

## File coinvolti

1. `app/area-clienti/carrello-preventivo/stampa/page.tsx` — `disegnoTcTa`
2. `components/preview-infisso.tsx` — blocco TC/TA

## Passi principali

1. Parser token: riconoscere `F()` → `{ type:'area', cm:null, fisso:true }`
2. Calcolo dimensioni: `F()` vale come `X()` (variabile)
3. Loop T-divisori: se l'area corrente è fisso → disegna 4 `<rect>` fermavetro
4. Loop P-divisori: stessa cosa ma per aree verticali
5. Caso senza divisori (`TC(F())`): disegna i 4 fermavetri sull'intera area interna
