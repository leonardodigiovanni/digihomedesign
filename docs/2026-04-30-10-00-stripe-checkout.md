# Pagamento Stripe — Checkout Hosted

**Stato**: completato  
**Data**: 2026-04-30

---

## Obiettivo

Permettere all'utente loggato di pagare il carrello acquisti con carta di credito o PayPal tramite la **Checkout page hosted da Stripe** (l'utente viene reindirizzato a Stripe, nessun PCI compliance a carico del sito).

---

## Setup iniziale (una tantum, manuale)

1. Creare account su https://stripe.com (gratuito, poi % sulle transazioni)
2. Dal dashboard Stripe → Developers → API keys → copiare:
   - `STRIPE_SECRET_KEY` (sk_test_... per test, sk_live_... per produzione)
   - `STRIPE_PUBLISHABLE_KEY` (pk_test_...)
3. Dal dashboard → Developers → Webhooks → aggiungere endpoint `https://tuodominio.com/api/stripe/webhook`, evento `checkout.session.completed`
   - Copiare il **Webhook Signing Secret** (`whsec_...`)
4. Aggiungere al file `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## Tabella DB: `ordini_acquisti`

```sql
CREATE TABLE ordini_acquisti (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  stripe_session_id VARCHAR(200) NOT NULL UNIQUE,
  username          VARCHAR(100) NOT NULL,
  cliente_id        INT NULL,
  status            ENUM('pending','paid','cancelled','expired') NOT NULL DEFAULT 'pending',
  totale            DECIMAL(10,2) NOT NULL DEFAULT 0,
  articoli_json     TEXT NOT NULL,
  data              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  note              TEXT NULL
)
```

`articoli_json` è uno snapshot degli articoli al momento dell'acquisto (descrizzione, prezzi, quantità).

---

## Flusso

```
Utente loggato + carrello acquisti
        ↓
Click "Paga ora"
        ↓
Server action creaCheckoutSession()
  - legge cookie digi_cart_acquisti
  - carica articoli dal DB (prezzo, descrizione)
  - crea record ordini_acquisti (status='pending')
  - crea Stripe Checkout Session con line_items
  - salva stripe_session_id sull'ordine
  - redirect(session.url) → utente va su Stripe
        ↓
Utente paga su Stripe
        ↓
Stripe redirect → /area-clienti/ordini/successo?session_id=cs_xxx
        ↓
Success page (server):
  - verifica session con Stripe API
  - aggiorna ordine status='paid'
  - cancella cookie digi_cart_acquisti
  - mostra conferma ordine
        ↓
Webhook /api/stripe/webhook (affidabilità, se browser chiuso prima):
  - evento checkout.session.completed → status='paid'
  - evento checkout.session.expired  → status='expired'
```

---

## File coinvolti

### Nuovi
| File | Ruolo |
|------|-------|
| `lib/stripe.ts` | Singleton client Stripe |
| `app/area-clienti/carrello-acquisti/checkout-action.ts` | Server action `creaCheckoutSession` |
| `app/api/stripe/webhook/route.ts` | Webhook handler (raw body) |
| `app/area-clienti/ordini/successo/page.tsx` | Pagina di conferma post-pagamento |

### Modificati
| File | Modifica |
|------|----------|
| `app/area-clienti/carrello-acquisti/carrello-acquisti-client.tsx` | Aggiungere bottone "Paga ora" (visibile solo se `isLoggedIn`) |
| `app/area-clienti/ordini/page.tsx` | Aggiungere sezione ordini acquisti (accanto agli ordini ricevuti) |

---

## Dettagli tecnici

- **Valuta**: EUR
- **Metodi**: Stripe abilita automaticamente carta + PayPal se configurato nel dashboard
- **line_items**: per articoli `m²` e `ml` il prezzo è già calcolato (prezzo_vendita × dimensioni × qtà) e passato come importo fisso unitario con qtà=1
- **Idempotenza**: la success page controlla se l'ordine è già `paid` prima di aggiornare (nel caso il webhook arrivi prima del redirect)
- **Utente non loggato**: il bottone "Paga ora" non è visibile; si vede solo "Genera PDF" e "Svuota carrello" con invito al login

---

## Passi di implementazione

1. `npm install stripe`
2. `lib/stripe.ts` — singleton
3. DB migration `ordini_acquisti` nella checkout action
4. `checkout-action.ts` — `creaCheckoutSession`
5. `app/api/stripe/webhook/route.ts`
6. `app/area-clienti/ordini/successo/page.tsx`
7. `carrello-acquisti-client.tsx` — bottone "Paga ora"
8. `app/area-clienti/ordini/page.tsx` — sezione ordini acquisti per cliente e staff
