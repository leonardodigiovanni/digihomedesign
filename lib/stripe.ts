// Lazy Stripe client — si inizializza solo alla prima chiamata.
// Variabili richieste in .env.local:
//   STRIPE_SECRET_KEY=sk_test_...   (Stripe Dashboard → Developers → API keys)
//   STRIPE_WEBHOOK_SECRET=whsec_... (Stripe Dashboard → Developers → Webhooks)
import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY mancante in .env.local')
    _stripe = new Stripe(key, { apiVersion: '2025-03-31.basil' })
  }
  return _stripe
}
