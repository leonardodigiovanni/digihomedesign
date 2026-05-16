import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getConnection } from '@/lib/db'

// Il webhook riceve il body grezzo — Next.js non deve parsarlo
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Webhook secret non configurato' }, { status: 500 })

  const body      = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret)
  } catch {
    return NextResponse.json({ error: 'Firma webhook non valida' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { id: string; payment_status: string }
    if (session.payment_status === 'paid') {
      await aggiornaOrdine(session.id, 'paid')
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as { id: string }
    await aggiornaOrdine(session.id, 'expired')
  }

  return NextResponse.json({ received: true })
}

async function aggiornaOrdine(stripeSessionId: string, status: 'paid' | 'expired') {
  const db = await getConnection()
  try {
    await db.execute(
      'UPDATE ordini_acquisti SET status=? WHERE stripe_session_id=? AND status != ?',
      [status, stripeSessionId, status]
    )
  } catch { /* tabella non ancora creata — ignora */ }
  finally { await db.end() }
}
