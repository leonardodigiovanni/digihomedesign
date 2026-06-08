# Area Clienti — Ordini

**Data:** 2026-06-05  
**Stato:** completato

---

## Obiettivo

Creare la sezione `/area-clienti/ordini` che raccoglie in sola lettura tutti gli ordini del cliente, generati automaticamente da:
- Preventivo accettato
- Acquisto con pagamento completato (carrello-acquisti)

I valori degli ordini sono **freezati** al momento della creazione — nessun JOIN verso listini, prodotti o sconti attuali.

---

## DB

### `ordini`
```sql
id              INT AUTO_INCREMENT PRIMARY KEY
numero          VARCHAR(50) NOT NULL DEFAULT ''
tipo            ENUM('preventivo','acquisto') NOT NULL DEFAULT 'preventivo'
cliente_id      INT NULL
data_ordine     DATE NOT NULL
importo_totale  DECIMAL(10,2) NOT NULL DEFAULT 0
sconto_pct      DECIMAL(5,2) NOT NULL DEFAULT 0
stato           ENUM('confermato','in_lavorazione','spedito','consegnato','annullato') DEFAULT 'confermato'
source_id       INT NULL  -- preventivo.id o acquisto/carrello id
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### `ordini_articoli`
```sql
id           INT AUTO_INCREMENT PRIMARY KEY
ordine_id    INT NOT NULL  -- FK ordini(id) ON DELETE CASCADE
parent_id    INT NULL      -- per caratteristiche figlie
tipo_riga    ENUM('articolo','caratteristica') DEFAULT 'articolo'
categoria    VARCHAR(100) NOT NULL DEFAULT ''
produttore   VARCHAR(100) NOT NULL DEFAULT ''
serie        VARCHAR(100) NOT NULL DEFAULT ''
descrizione  TEXT NOT NULL
unita        VARCHAR(20) NOT NULL DEFAULT 'cad'
quantita     DECIMAL(10,2) NOT NULL DEFAULT 1
prezzo_unit  DECIMAL(10,2) NOT NULL DEFAULT 0
sconto_pct   DECIMAL(5,2) NOT NULL DEFAULT 0
totale       DECIMAL(10,2) NOT NULL DEFAULT 0
```

---

## Trigger automatici

### Preventivo accettato (`accettaPreventivo` in `app/clienti/preventivi/actions.ts`)
Dopo `UPDATE preventivi SET stato = 'accettato'`:
1. Leggi `preventivo_articoli` con JOIN `listini` (categoria, produttore, serie, descrizione, unita, prezzo_vendita, sconto_articolo)
2. Inserisci in `ordini` con `tipo='preventivo'`, `source_id=preventivo.id`
3. Inserisci in `ordini_articoli` tutti gli articoli con valori freezati

### Acquisto completato (`app/area-clienti/carrello-acquisti/checkout-action.ts`)
Dopo pagamento confermato:
1. Inserisci in `ordini` con `tipo='acquisto'`
2. Inserisci in `ordini_articoli` gli articoli del carrello con valori freezati

---

## Pagine

### `app/area-clienti/ordini/page.tsx`
- Griglia ordini (stile gold: bordo 1px `#c8960c`, radius 8, altezza righe 80px, header `#7a6000`)
- Colonne: N° ordine, Tipo, Data, Importo, Stato
- Click riga → dettaglio ordine

### `app/area-clienti/ordini/[id]/page.tsx`
- Header ordine (numero, data, tipo, stato, importo)
- Tabella articoli read-only (stile preventivo/carrello): categoria·produttore·serie, descrizione, qtà, prezzo, sconto, totale
- Caratteristiche indentate sotto l'articolo padre
- Nessun bottone modifica/elimina
- Bottone "Torna agli ordini" (nero 42px radius 21)

---

## File coinvolti

| File | Modifica |
|------|----------|
| `app/clienti/preventivi/actions.ts` | `accettaPreventivo`: aggiunge clone in ordini |
| `app/area-clienti/carrello-acquisti/checkout-action.ts` | dopo pagamento: aggiunge clone in ordini |
| `app/area-clienti/ordini/page.tsx` | nuova pagina lista ordini |
| `app/area-clienti/ordini/[id]/page.tsx` | nuova pagina dettaglio ordine |
| `app/area-clienti/ordini/[id]/ordine-client.tsx` | componente client read-only |
