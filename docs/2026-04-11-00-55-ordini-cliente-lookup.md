# Ordini ricevuti — lookup clienti nel form

**Data:** 2026-04-11  
**Stato:** completato

---

## Obiettivo

Il form "Nuovo ordine ricevuto" deve mostrare una select popolata dai clienti della tabella `clienti`, non un campo testo libero.

---

## Modifiche

### 1. DB — colonna `cliente_id` su `ordini_ricevuti`

```sql
ALTER TABLE ordini_ricevuti ADD COLUMN cliente_id INT NULL
```

Migration via try/catch nella page. Il campo `cliente` VARCHAR esistente viene mantenuto e popolato automaticamente al salvataggio con il display name del cliente (ragione_sociale o cognome+nome), così la tabella rimane leggibile senza JOIN obbligatorio.

### 2. `app/ordini-ricevuti/page.tsx`

- Aggiunge migration per `cliente_id`
- Fetch clienti da tabella `clienti` (try/catch se non esiste)
- Passa `clienti` al client component

### 3. `app/ordini-ricevuti/client.tsx`

- Tipo `OrdineRicevuto`: aggiunge `cliente_id: number | null`
- `AddModal` riceve prop `clienti: Cliente[]`
- Sostituisce il campo testo `cliente` con `<select>` popolato dai clienti
- `OrdiniRicevutiClient` riceve e passa `clienti` ad `AddModal`

### 4. `app/ordini-ricevuti/actions.ts`

- `addOrdineRicevuto`: legge `cliente_id` (INT) dalla form; fetch nome cliente dal DB per popolare il campo `cliente` (display name); salva entrambi

### 5. `app/miei-ordini/page.tsx`

- Aggiorna la query: invece di `WHERE cliente = username`, fa JOIN su `clienti.email = users.email` (stesso pattern di `/cantieri`) così gli ordini sono legati al cliente anche se il dipendente li ha creati selezionando dalla lookup

---

## Tipo `Cliente` (condiviso)

```ts
type Cliente = { id: number; nome: string; cognome: string; ragione_sociale: string; email: string }
```

---

## File coinvolti

| File | Modifica |
|---|---|
| `app/ordini-ricevuti/page.tsx` | Migration + fetch clienti |
| `app/ordini-ricevuti/client.tsx` | Select clienti in AddModal |
| `app/ordini-ricevuti/actions.ts` | Salva cliente_id + display name |
| `app/miei-ordini/page.tsx` | Query via clienti.email JOIN |
