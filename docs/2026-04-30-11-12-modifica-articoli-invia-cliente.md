# Modifica articoli da staff + bottone "Invia al cliente"

**Stato**: completato
**Data**: 2026-04-30

---

## Obiettivo

Il dipendente apre un preventivo in stato `bozza` o `richiesto` e può:
1. Modificare ogni articolo esistente (misure, sconto articolo, prezzo base, quantità, ante)
2. Modificare lo sconto cliente sul preventivo
3. Aggiungere nuovi articoli (già funziona)
4. Cliccare "Invia al cliente" → stato diventa `inviato`, email al cliente

Il cliente non può mai modificare articoli né cliccare "Invia al cliente".

---

## UI — modifica articoli

Ogni riga della tabella articoli mostra, solo per staff, un'icona ✎ a destra (accanto alla ✕).  
Cliccando si apre una modale pre-compilata con i campi modificabili:
- **Altezza (cm)** / **Larghezza (cm)**
- **N° ante** / **Quantità**
- **Prezzo base** (€/unità, override manuale)
- **Sconto articolo %** (override manuale)
- **Note**

Al salvataggio il `prezzo_totale` viene ricalcolato e `ricalcolaTotaleConSconti` aggiorna l'importo del preventivo.

---

## UI — sconto cliente (override staff)

Nel blocco totale, accanto allo sconto cliente, uno staff vede un piccolo input numerico modificabile per cambiare `sconto_cliente_pct` direttamente. Il cambio aggiorna subito `preventivi.sconto_cliente_pct` e ricalcola `importo`.

---

## UI — bottone "Invia al cliente"

Visibile solo a staff, solo quando `stato === 'bozza' || stato === 'richiesto'`.  
Stile: btn-green con testo "Invia al cliente".

Al clic:
1. `stato` → `inviato`
2. Email al cliente (indirizzo da `clienti.email` tramite `cliente_id`) con testo:
   > "Il preventivo N° XXX che hai richiesto è pronto nella tua area personale. Accedi per visualizzarlo."
   Link: `/area-clienti/preventivi/{id}`
3. Inserisce anche riga in `email_inbox` tipo `preventivo_inviato` per tracciabilità interna.

---

## Nuove server actions

| Action | Descrizione |
|--------|-------------|
| `modificaArticolo` | Aggiorna i campi modificabili di un `preventivo_articoli`, ricalcola prezzo e totale |
| `aggiornaSconto` | Aggiorna `preventivi.sconto_cliente_pct` e ricalcola `importo` |
| `inviaAlCliente` | Cambia stato in `inviato`, invia email al cliente, inserisce in `email_inbox` |

---

## File coinvolti

| File | Modifica |
|------|----------|
| `app/clienti/preventivi/actions.ts` | Aggiunge `modificaArticolo`, `aggiornaSconto`, `inviaAlCliente` |
| `app/clienti/preventivi/[id]/preventivo-client.tsx` | Icona ✎ su ogni riga, modale modifica articolo, input sconto cliente, bottone "Invia al cliente" |
| `app/area-lavoro/email/email-client.tsx` | Aggiunge tipo `preventivo_inviato` in TIPO_LABELS/COLORS |
| `lib/email.ts` | Usato per inviare email al cliente |
