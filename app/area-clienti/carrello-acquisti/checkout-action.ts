'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { getStripe } from '@/lib/stripe'

type CartItem = { id: number; q: number; l?: number; h?: number; ante?: number; colore?: string; note?: string }

export type ArticoloSnapshot = {
  listino_id: number
  categoria: string
  produttore: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  quantita: number
  larghezza_cm: number
  altezza_cm: number
  colore: string
  note: string
  subtotale: number
}

function calcolaSubtotale(prezzo: number, unita: string, h: number, l: number, q: number): number {
  if (unita === 'm²') return Math.round(prezzo * (h / 100) * (l / 100) * q * 100) / 100
  if (unita === 'ml') return Math.round(prezzo * (l / 100) * q * 100) / 100
  return Math.round(prezzo * q * 100) / 100
}

async function ensureTable(db: Awaited<ReturnType<typeof getConnection>>) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ordini_acquisti (
      id                INT AUTO_INCREMENT PRIMARY KEY,
      stripe_session_id VARCHAR(200) NOT NULL DEFAULT '',
      username          VARCHAR(100) NOT NULL,
      cliente_id        INT NULL,
      status            ENUM('pending','paid','cancelled','expired') NOT NULL DEFAULT 'pending',
      totale            DECIMAL(10,2) NOT NULL DEFAULT 0,
      articoli_json     TEXT NOT NULL,
      data              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      note              TEXT NULL,
      UNIQUE KEY uq_session (stripe_session_id)
    )
  `)
  await db.execute(`ALTER TABLE ordini_acquisti ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(200) NOT NULL DEFAULT ''`).catch(() => {})
}

export async function creaCheckoutSession(): Promise<void> {
  const cookieStore = await cookies()
  const username  = cookieStore.get('session_user')?.value ?? ''
  const cartRaw   = cookieStore.get('digi_cart_acquisti')?.value ?? ''

  if (!username) redirect('/login')

  let cart: CartItem[] = []
  try { cart = cartRaw ? JSON.parse(cartRaw) : [] } catch {}
  if (cart.length === 0) redirect('/area-clienti/carrello-acquisti')

  const db = await getConnection()
  let articoli: ArticoloSnapshot[] = []
  let clienteId: number | null = null

  try {
    await ensureTable(db)

    const ids = cart.map(i => i.id)
    const ph  = ids.map(() => '?').join(',')
    const [rows] = await db.query(
      `SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita FROM listini WHERE id IN (${ph})`,
      ids
    ) as [{ id: number; categoria: string; produttore: string; descrizione: string; unita: string; prezzo_vendita: number }[], unknown]

    articoli = cart.map(item => {
      const r = rows.find(x => x.id === item.id)
      if (!r) return null
      const sub = calcolaSubtotale(Number(r.prezzo_vendita), r.unita, item.h ?? 0, item.l ?? 0, item.q)
      return {
        listino_id: r.id,
        categoria: r.categoria,
        produttore: r.produttore,
        descrizione: r.descrizione,
        unita: r.unita,
        prezzo_vendita: Number(r.prezzo_vendita),
        quantita: item.q,
        larghezza_cm: item.l ?? 0,
        altezza_cm: item.h ?? 0,
        colore: item.colore ?? '',
        note: item.note ?? '',
        subtotale: sub,
      } satisfies ArticoloSnapshot
    }).filter((x): x is ArticoloSnapshot => x !== null)

    if (articoli.length === 0) redirect('/area-clienti/carrello-acquisti')

    const totale = articoli.reduce((s, a) => s + a.subtotale, 0)

    // Cerca cliente_id dalla email dell'utente
    const [uRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
    const email = uRows[0]?.email ?? ''
    if (email) {
      const [cRows] = await db.query('SELECT id FROM clienti WHERE email = ? LIMIT 1', [email]) as [{ id: number }[], unknown]
      clienteId = cRows[0]?.id ?? null
    }

    // Crea ordine pending
    const [res] = await db.execute(
      'INSERT INTO ordini_acquisti (username, cliente_id, status, totale, articoli_json) VALUES (?,?,?,?,?)',
      [username, clienteId, 'pending', totale, JSON.stringify(articoli)]
    ) as [{ insertId: number }, unknown]
    const ordineId = res.insertId

    // Crea Stripe Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    // Per articoli con prezzo variabile (m², ml) il subtotale è già calcolato → passiamo come importo fisso con qty=1
    const lineItems = articoli.map(a => {
      const dimNote: string[] = []
      if (a.larghezza_cm) dimNote.push(`L: ${a.larghezza_cm} cm`)
      if (a.altezza_cm) dimNote.push(`H: ${a.altezza_cm} cm`)
      if (a.colore) dimNote.push(a.colore)
      const desc = dimNote.length > 0 ? dimNote.join(' · ') : undefined

      const usaSubtotale = a.unita === 'm²' || a.unita === 'ml'
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${a.descrizione}${a.produttore ? ' — ' + a.produttore : ''}`,
            ...(desc ? { description: desc } : {}),
          },
          unit_amount: Math.round((usaSubtotale ? a.subtotale : a.prezzo_vendita * a.quantita) * 100),
        },
        quantity: usaSubtotale ? 1 : a.quantita,
      }
    })

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/area-clienti/ordini/successo?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/area-clienti/carrello-acquisti`,
      metadata: { ordine_id: String(ordineId), username },
      customer_email: email || undefined,
    })

    // Salva stripe_session_id sull'ordine
    await db.execute('UPDATE ordini_acquisti SET stripe_session_id=? WHERE id=?', [session.id, ordineId])

    redirect(session.url!)
  } finally {
    await db.end()
  }
}
