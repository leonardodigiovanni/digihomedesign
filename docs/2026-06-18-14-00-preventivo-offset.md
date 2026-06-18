# Preventivo — Campo Prezzo Forfait

**Data:** 2026-06-18  
**Stato:** completato

---

## Obiettivo

Aggiungere un campo `prezzo_forfait` (numerico, può essere negativo) alla tabella `preventivi`. Il valore viene sommato al totale calcolato dagli articoli senza essere mostrato al cliente come voce separata. Utile per preventivi a forfait o aggiustamenti di prezzo "dietro le quinte".

**Esempi:**
- articoli = 0€, prezzo_forfait = 5000 → totale 5000€
- articoli = 10000€, prezzo_forfait = -2000 → totale 8000€

---

## File coinvolti

1. **Database** — `ALTER TABLE preventivi ADD COLUMN prezzo_forfait DECIMAL(10,2) NOT NULL DEFAULT 0`
2. **`app/area-clienti/preventivi/[id]/page.tsx`** — legge `preventivo.prezzo_forfait` e lo passa al client
3. **`app/area-clienti/preventivi/[id]/preventivo-client.tsx`** — mostra campo input `prezzo_forfait` visibile solo a dipendenti/admin; chiama server action per salvare
4. **`app/area-clienti/preventivi/[id]/actions.ts`** — server action `aggiornaPrezzoForfait(prevId, val)`
5. **`app/area-clienti/preventivi/[id]/stampa/page.tsx`** — somma `prezzo_forfait` al totale nel `totaleBoxHtml`
6. **Tipo `Preventivo`** — aggiunge campo `prezzo_forfait: number`

---

## Passi principali

1. Migrare DB: aggiungere colonna `offset DECIMAL(10,2) NOT NULL DEFAULT 0` con `ALTER TABLE` idempotente (già pattern usato nel progetto con `.catch(() => {})`)
2. Leggere `offset` nella query del preventivo e passarlo al client
3. UI staff: input numerico "Offset €" nel pannello di modifica preventivo (visibile solo a `isStaff`), con salvataggio via server action
4. Stampa: `totale` passato alla stampa viene aumentato di `offset` prima di essere usato nei calcoli

---

## Scelte tecniche

- `offset` può essere positivo (maggiorazione) o negativo (sconto aggiuntivo)
- Non appare come riga separata nel preventivo stampato — è invisibile al cliente
- Solo dipendenti e admin possono vederlo e modificarlo
- Il valore viene sommato al totale già calcolato dagli articoli nel campo `importo` del preventivo
