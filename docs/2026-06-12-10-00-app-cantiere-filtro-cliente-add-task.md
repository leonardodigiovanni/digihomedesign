# App cantiere dipendente: filtro cliente + crea task

**Data:** 2026-06-12  
**Stato:** proposta

## Obiettivo

Migliorare la vista cantieri nell'app per i dipendenti:
1. **Filtro cliente** — input testo sulla lista cantieri per trovare rapidamente il cantiere giusto
2. **+Task** — bottone per creare un nuovo task direttamente dall'app senza dover aprire l'area-lavoro desktop

## Modifiche previste

### 1. Filtro cliente — `app/app/cantiere/page.tsx`

La query staff attuale usa `NULL AS cliente_nome`. Sostituire con JOIN reale:
```sql
SELECT c.*,
  NULLIF(TRIM(COALESCE(NULLIF(ak.ragione_sociale,''), CONCAT_WS(' ', ak.cognome, ak.nome))), '') AS cliente_nome
FROM cantieri c
LEFT JOIN clienti ak ON ak.id = c.cliente_id
ORDER BY c.id DESC
```

### 2. Filtro cliente — `cantieri-cliente-client.tsx` → `CantiereGrid`

Quando `isDipendente`, mostrare un input di ricerca sopra la tabella.
Filtra client-side su `cantiere.titolo` + `cantiere.cliente_nome`.

### 3. +Task — `cantieri-cliente-client.tsx` → `TaskGrid`

Quando `isDipendente`, aggiungere un bottone **+ Nuovo task** in fondo alla lista.
Click → apre un form inline (non modale) con:
- Descrizione (obbligatoria)
- Data inizio (opzionale)
- Data fine (opzionale)
- Stato (select, default `da_fare`)

Chiama `addTask` da `area-lavoro/cantieri/actions.ts`, poi `router.refresh()`.

## File coinvolti

| File | Modifica |
|------|----------|
| `app/app/cantiere/page.tsx` | Query JOIN per cliente_nome su staff |
| `app/area-clienti/cantieri/cantieri-cliente-client.tsx` | Filtro in CantiereGrid + form +Task in TaskGrid |
