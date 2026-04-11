# Ordini a Fornitori — refactoring completo

**Data:** 2026-04-11  
**Stato:** completato ✓

---

## Obiettivo

Rifacimento completo della sezione esistente `/ordini-fornitori` (id 26).  
La tabella DB attuale viene mantenuta e migrata con ALTER TABLE.  
Il client viene riscritto per supportare tutti i nuovi campi.

---

## Struttura DB — migrazioni su `ordini_fornitori`

Campi esistenti mantenuti: `id`, `numero_ordine`, `fornitore`, `descrizione`, `data_ordine`, `created_by`, `created_at`, `updated_at`.  
Campo `stato` (bozza/inviato…) rimosso dalla logica visiva — sostituito dai nuovi stati specifici.

Colonne aggiunte via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` (con `.catch()` per idempotenza):

| Colonna              | Tipo                    | Note                                          |
|----------------------|-------------------------|-----------------------------------------------|
| `qta`                | DECIMAL(10,3) DEFAULT 1 | Quantità                                      |
| `prezzo_unitario`    | DECIMAL(10,2) DEFAULT 0 | Prezzo unitario (€)                           |
| `aliq_sconto`        | DECIMAL(5,2) DEFAULT 0  | % sconto fornitore (es. 15.00)                |
| `aliq_iva`           | DECIMAL(5,2) DEFAULT 22 | % IVA (es. 4, 10, 22)                         |
| `totale`             | DECIMAL(10,2) DEFAULT 0 | Calcolato: qta × p.unit × (1-sc%) × (1+iva%) |
| `fatturato`          | TINYINT(1) DEFAULT 0    |                                               |
| `pagato`             | TINYINT(1) DEFAULT 0    |                                               |
| `stato_consegna`     | VARCHAR(30) DEFAULT 'non_consegnato' | non_consegnato / parziale / consegnato |
| `data_consegna_stimata` | DATE NULL             | Data stimata di consegna                      |
| `data_consegna`      | DATE NULL               | Data consegna effettiva                       |
| `ultimo_sollecito`   | DATETIME NULL           | Timestamp ultimo sollecito inviato            |
| `note`               | TEXT NULL               |                                               |
| `email_fornitore`    | VARCHAR(255) DEFAULT '' | Email per solleciti                           |

---

## Calcolo totale

`imponibile = qta × prezzo_unitario × (1 - aliq_sconto/100)`  
`totale = imponibile × (1 + aliq_iva/100)`  

Il totale viene calcolato lato client in tempo reale nel form e salvato anche su DB.

---

## UI

### Tabella principale
Colonne: N°Ordine · Fornitore · Descrizione · Qtà · P.Unit · Sconto% · IVA% · Totale · Fatturato · Pagato · Stato consegna · Data stim. · Data cons. · Ultimo soll. · Note · Azioni

Badge colorati:
- **Stato consegna**: rosso (non consegnato) / arancio (parziale) / verde (consegnato)
- **Fatturato**: verde ✓ / grigio ✗
- **Pagato**: verde ✓ / grigio ✗

### Filtri
- Testo (fornitore, descrizione, numero)
- Stato consegna
- Fatturato (tutti / sì / no)
- Pagato (tutti / sì / no)

### Form nuovo ordine
Modal con tutti i campi. Totale calcolato in tempo reale mentre si digitano qtà, prezzo, sconto, IVA.

### Toggle rapidi (senza aprire form)
- Fatturato ✓/✗ — click diretto sulla cella
- Pagato ✓/✗ — click diretto sulla cella
- Stato consegna — select inline nella riga

### Sollecita fornitore
Pulsante "Sollecita" per ogni riga → modal con:
- Email fornitore (precompilata se già inserita, altrimenti campo vuoto)
- Testo sollecito precompilato (oggetto: "Sollecito ordine N°XXX", corpo con dati ordine)
- Invio via `lib/email.ts`
- Al successo: `ultimo_sollecito` aggiornato, badge "soll. GG/MM/YYYY" visibile nella riga

---

## File coinvolti

| File | Azione |
|---|---|
| `app/ordini-fornitori/page.tsx` | Riscritto — nuovi campi nel SELECT |
| `app/ordini-fornitori/client.tsx` | Riscritto completamente |
| `app/ordini-fornitori/actions.ts` | Aggiornato — nuovi campi, toggle, sollecito |
