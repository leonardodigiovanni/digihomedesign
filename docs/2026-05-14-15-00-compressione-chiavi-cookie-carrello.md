# Compressione chiavi JSON cookie `digi_cart`

**Data:** 2026-05-14  
**Stato:** completato

## Problema

Il cookie `digi_cart` memorizza il carrello preventivo come JSON verboso.
Con 15+ articoli (padre/figlio, larghezza, altezza, colore, note) il valore supera 4096 byte
e il browser ignora silenziosamente il `Set-Cookie` — il carrello non viene aggiornato.

Esempio di item attuale (~80 char):
```
{"id":31,"q":1,"uid":39,"tipo":"articolo","ante":0,"l":111,"h":111}
```

## Obiettivo

Ridurre le chiavi JSON nel cookie usando nomi brevi, senza cambiare la logica applicativa.

## Mappatura chiavi

| Campo corrente | Chiave compressa | Risparmio per chiave |
|---|---|---|
| `tipo:"articolo"` | `t:1` | ~17 char |
| `tipo:"caratteristica"` | `t:2` | ~21 char |
| `uid` | `u` | 2 char |
| `parent` | `p` | 5 char |
| `ante` | `a` | 3 char |
| `colore` | `c` | 5 char |
| `note` | `n` | 3 char |
| `desc` | `d` | 3 char |

Risparmio stimato: ~35-50 char per item → con 15 item ≈ 525-750 char risparmiati.

## File coinvolti

- `app/brand/cataloghi/actions.ts`
  - `normalizeCart()` — deserializza (compressa → interna)
  - `saveCartCookie()` — serializza (interna → compressa)
  - Nessun'altra funzione cambia: lavorano sempre sulla struttura interna `CartItem`
  - Il ritorno `{ ok: true, newCart: JSON.stringify(cart) }` in `applicaCaratteristicaAlCarrello` va aggiornato per serializzare compresso
- `app/area-clienti/carrello-preventivo/carrello-client.tsx` riga 295
  - `document.cookie = \`digi_cart=${result.newCart}...\`` — già riceve `newCart` compresso dall'action

## Passi

1. Definire le funzioni `compress(cart)` e `decompress(raw)` in `actions.ts`
2. `saveCartCookie`: chiama `compress()` prima di `JSON.stringify`
3. `normalizeCart`: chiama `decompress()` dopo il parse
4. `applicaCaratteristicaAlCarrello`: restituisce `newCart` già compresso

## Note

- Compatibilità: il cookie esistente (non compresso) verrà letto correttamente perché `decompress` gestirà entrambi i formati (presenza di `"tipo"` = vecchio formato, presenza di `"t"` = nuovo)
- Nessun cambio alla struttura del DB né alle altre pagine
