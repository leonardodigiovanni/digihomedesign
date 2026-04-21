# Preventivo — profilo reale da scheda tecnica listino

**Data:** 2026-04-21  
**Stato:** completato

## Obiettivo

Collegare il disegno SVG del preventivo ai valori reali della scheda tecnica del listino:
- `profilo_frontale_mm` → sostituisce il valore fisso 7 cm nel telaio e nelle ante
- Fallback a 7 cm se l'articolo non ha `listino_id` o il listino non ha la scheda compilata

## File coinvolti

### `app/area-clienti/preventivi/[id]/stampa/page.tsx`

**`loadData`**: modifica alla query degli articoli — da `SELECT * FROM preventivo_articoli` a un LEFT JOIN con `listini`:

```sql
SELECT pa.*, l.profilo_frontale_mm AS profilo_mm
FROM preventivo_articoli pa
LEFT JOIN listini l ON pa.listino_id = l.id
WHERE pa.preventivo_id = ?
ORDER BY pa.id ASC
```

**`disegnoSVG`**: aggiunge parametro `profiloMm` (default 7):
```typescript
function disegnoSVG(larghezza, altezza, nAnte, profiloMm = 7)
```
Il `PROFILE_CM` interno diventa `profiloMm / 10`.

**`articoloHTML`**: legge `profilo_mm` dall'articolo e lo passa a `disegnoSVG`.

**`estimaAltezzaArticolo`**: nessuna modifica (non dipende dal profilo).

## Nessun impatto su

- DB / actions / form preventivo
- Listini / scheda tecnica
- Altre pagine
