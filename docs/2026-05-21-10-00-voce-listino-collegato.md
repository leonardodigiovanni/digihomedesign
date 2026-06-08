# Collegamento listino a livello di voce (non categoria)

**Data:** 2026-05-21  
**Stato:** proposta

## Obiettivo

Ogni voce catalogo (`catalogo_voci`) avrà il proprio campo `listino_categoria` con una tendina di selezione visibile direttamente nella riga della voce (senza aprire "Modifica"). La categoria non ha più il collegamento listino.

## Modifiche DB

```sql
ALTER TABLE catalogo_voci ADD COLUMN listino_categoria VARCHAR(100) NULL DEFAULT NULL;
```

Colonna già presente su `catalogo_categorie` — rimane invariata per ora (si può rimuovere in seguito).

## File coinvolti

| File | Modifica |
|------|----------|
| `page.tsx` | Migrazione colonna + SELECT + mapping `listino_categoria` su voci |
| `actions.ts` | Migrazione + nuova action `updateListinoVoce` + aggiornamento `addVoce`/`updateVoce` |
| `cataloghi-client.tsx` | `Voce` type: aggiunta `listino_categoria`; nuovo `ListinoVoceForm` in `VoceRow`; `listiniCategorie` passato a `VoceRow` |

## UI

Ogni `VoceRow` mostrerà nella parte sinistra (sotto nome/serie) oppure nella parte destra una riga compatta con:

```
Listino: [ — nessuno — ▼ ]  [Salva]
```

Stessa UI del `ListinoCategoriaForm` già esistente, ma applicata a ogni singola voce.

## Note

- `listiniCategorie` è già caricato nel page.tsx e passato fino a `CategoriaAccordion` — va esteso fino a `VoceRow`
- Non viene rimosso il collegamento categoria→listino (si decide dopo)
