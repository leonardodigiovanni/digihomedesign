---
nome: carrello-acquisti-sconti-cliente-loggato
stato: completato
data: 2026-06-03
---

## Obiettivo

Quando un cliente è loggato, il carrello acquisti deve mostrare i prezzi con gli sconti applicati (sconto articolo + sconto cliente), esattamente come fa il preventivo salvato. Se non è loggato, il comportamento rimane invariato (prezzi pieni, nessuna modifica).

## Logica di business

- **Carrello preventivo** → sconti applicati (già funziona)
- **Carrello acquisti + cliente loggato** → sconti applicati (da implementare)
- **Carrello acquisti + non loggato** → nessuno sconto (invariato)

## File coinvolti

| File | Modifica |
|------|----------|
| `app/area-clienti/carrello-acquisti/page.tsx` | Caricare `scontoClientePct` da `users.cliente_id` → `clienti.sconto_pct` quando loggato |
| `app/area-clienti/carrello-acquisti/carrello-acquisti-client.tsx` | Aggiungere prop `scontoClientePct`, applicare sconti in `calcolaPrezzo`, mostrare breakdown nel totale |
| `app/area-clienti/carrello-acquisti/checkout-action.ts` | Applicare sconto articolo + sconto cliente al totale inviato a Stripe |

## Passi principali

### 1. page.tsx
Aggiungere query DB (come in `carrello-preventivo/page.tsx` righe 291–303):
```ts
let scontoClientePct = 0
if (username) {
  const [uRows] = await db.query('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username])
  const clienteId = uRows[0]?.cliente_id
  if (clienteId) {
    const [cRows] = await db.query('SELECT sconto_pct FROM clienti WHERE id = ? LIMIT 1', [clienteId])
    scontoClientePct = Number(cRows[0]?.sconto_pct ?? 0)
  }
}
```
Passare `scontoClientePct` al componente client.

### 2. carrello-acquisti-client.tsx — calcolaPrezzo
Aggiungere funzione `calcolaPrezzoLordo` (prezzo senza sconto articolo) e modificare `calcolaPrezzo` per applicare `sconto_articolo` (valori positivi = sconto %) sugli articoli principali quando loggato:
- `prezzo_scontato = prezzo_vendita * (1 - sconto_articolo/100)`
- Child con sc < 0 e pb = 0: rimangono calcolati come % del padre (già corretto, la % si applica al prezzo già scontato del padre)

### 3. carrello-acquisti-client.tsx — sezione Totale
Mostrare il breakdown come nel preventivo salvato (preventivo-client.tsx righe 1589–1620):
- **Listino:** lordo (somma dei prezzi pieni)
- **Sconti promozionali:** `lordo − subtotale` (solo se > 0)
- **Subtotale:** dopo sconti articoli
- **Sconto riservato al cliente (X%):** `subtotale × scontoClientePct / 100` (solo se > 0)
- **Totale:** importo finale

Quando non loggato → rimane solo "Totale: €..." come ora.

### 4. checkout-action.ts
- Caricare `sconto_articolo` per ogni articolo (già nella query? da verificare — attualmente query include `prezzo_vendita` senza `sconto_articolo`)
- Caricare `scontoClientePct` dal cliente
- Applicare entrambi al totale inviato a Stripe
- Salvare i dati di sconto nell'`ordini_acquisti` (aggiungere colonne o campi nel JSON)

## Scelte tecniche

- La colonna `sconto_articolo` è già caricata in `page.tsx` dalla tabella `listini`, ma non viene passata al `checkout-action.ts` — da aggiungere alla query dell'action.
- Il breakdown del totale appare solo quando `isLoggedIn && (hasScontiPromo || scontoClientePct > 0)`, altrimenti si mostra il totale semplice come ora.
- Lo `sconto_articolo` positivo su articoli principali (non figli) = sconto promozionale su quell'articolo. Negativo su figli = maggiorazione calcolata come % del padre.
