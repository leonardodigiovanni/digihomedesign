# Cantieri — toggle visibilità per-cantiere al cliente

**Data:** 2026-04-11  
**Stato:** completato

---

## Obiettivo

Aggiungere un controllo per-cantiere che permette a dipendenti/admin di bloccare o sbloccare la visibilità di un singolo cantiere al cliente. Il cliente non vede nulla di questo meccanismo: semplicemente non gli appare il cantiere se è nascosto.

---

## Comportamento atteso

| Utente     | Cosa vede |
|------------|-----------|
| dipendente/admin | Tutti i cantieri + badge "Visibile al cliente / Nascosto al cliente" + pulsante toggle per riga |
| cliente    | Solo cantieri dove `visibile_cliente = 1` |

---

## Modifiche

### 1. DB — nuova colonna `cantieri.visibile_cliente`

```sql
ALTER TABLE cantieri ADD COLUMN visibile_cliente TINYINT(1) NOT NULL DEFAULT 1
```

Default `1`: i cantieri esistenti rimangono visibili. La migration viene eseguita via try/catch in `ensureTables()` dentro `actions.ts`.

### 2. `app/cantieri/actions.ts`

- `ensureTables()`: aggiungere try/catch migration per `visibile_cliente`
- Nuova action `toggleVisibileCantiere(_: unknown, formData: FormData)`: riceve `id`, fa `UPDATE cantieri SET visibile_cliente = 1 - visibile_cliente WHERE id = ?`, poi `revalidatePath('/cantieri')`

### 3. `app/cantieri/cantieri-client.tsx`

- Tipo `Cantiere`: aggiungere `visibile_cliente: number`
- `CardCantiere` (riga tabella): nella colonna Azioni, aggiungere — solo se `isStaff` — un pulsante toggle che chiama `toggleVisibileCantiere`. Il pulsante mostra un badge visivo (es. occhio aperto/chiuso o verde/grigio) con label "Visibile" / "Nascosto"
- Il cliente non vede questa colonna né questo controllo

### 4. `app/cantieri/page.tsx`

- Nel branch `else` (utente cliente): aggiungere `AND c.visibile_cliente = 1` alla query per filtrare i cantieri nascosti

---

## File coinvolti

| File | Modifica |
|---|---|
| `app/cantieri/actions.ts` | Migration + action `toggleVisibileCantiere` |
| `app/cantieri/cantieri-client.tsx` | Campo `visibile_cliente` nel tipo + pulsante toggle nella riga staff |
| `app/cantieri/page.tsx` | Filtro `visibile_cliente = 1` nella query cliente |
