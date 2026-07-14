'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { getStripe } from '@/lib/stripe'
import { decompressCart } from '@/lib/cart-cookie'

export async function svuotaCarrelloAcquisti(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('digi_cart_acquisti')
}

type CartItem = { id: number; q: number; l?: number; h?: number; ante?: number; colore?: string; note?: string }

export type ArticoloSnapshot = {
  listino_id: number
  categoria: string
  produttore: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  sconto_articolo: number
  quantita: number
  larghezza_cm: number
  altezza_cm: number
  colore: string
  note: string
  prezzo_pre_sconto: number
  subtotale: number
  sconto_cliente_pct: number
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
      stripe_session_id VARCHAR(200) NULL DEFAULT NULL,
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
  await db.execute(`ALTER TABLE ordini_acquisti ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(200) NULL DEFAULT NULL`).catch(() => {})
  // Migrazione da schema precedente (NOT NULL DEFAULT ''): righe pending con stripe_session_id=''
  // violavano il vincolo UNIQUE ad ogni nuovo checkout. NULL non collide mai con NULL.
  await db.execute(`ALTER TABLE ordini_acquisti MODIFY COLUMN stripe_session_id VARCHAR(200) NULL DEFAULT NULL`).catch(() => {})
}

export async function creaCheckoutSession(): Promise<void> {
  const cookieStore = await cookies()
  const username  = cookieStore.get('session_user')?.value ?? ''
  const cartRaw   = cookieStore.get('digi_cart_acquisti')?.value ?? ''

  if (!username) redirect('/login')

  const cart: CartItem[] = decompressCart(cartRaw)
    .filter(i => i.id > 0 && i.tipo !== 'caratteristica')
    .map(i => ({ id: i.id, q: i.q, l: i.l, h: i.h, ante: i.ante, colore: i.colore, note: i.note }))
  if (cart.length === 0) redirect('/area-clienti/carrello-acquisti')

  const db = await getConnection()
  db.on('error', err => console.error('[creaCheckoutSession] errore connessione MySQL:', err))
  let articoli: ArticoloSnapshot[] = []
  let clienteId: number | null = null

  try {
    await ensureTable(db)

    const ids = cart.map(i => i.id)
    const ph  = ids.map(() => '?').join(',')
    const [rows] = await db.query(
      `SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita, sconto_articolo FROM listini WHERE id IN (${ph})`,
      ids
    ) as [{ id: number; categoria: string; produttore: string; descrizione: string; unita: string; prezzo_vendita: number; sconto_articolo: number }[], unknown]

    // Cerca cliente_id e sconto dalla email dell'utente
    const [uRows] = await db.query('SELECT email, cliente_id FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string; cliente_id: number | null }[], unknown]
    const email = uRows[0]?.email ?? ''
    clienteId = uRows[0]?.cliente_id ?? null

    let scontoClientePct = 0
    if (clienteId) {
      const [cRows] = await db.query('SELECT sconto_pct FROM clienti WHERE id = ? LIMIT 1', [clienteId]) as [{ sconto_pct: number }[], unknown]
      scontoClientePct = Number(cRows[0]?.sconto_pct ?? 0)
    }

    const factorCliente = scontoClientePct > 0 ? (1 - scontoClientePct / 100) : 1

    articoli = cart.map(item => {
      const r = rows.find(x => x.id === item.id)
      if (!r) return null
      const pv = Number(r.prezzo_vendita)
      const sc = Number(r.sconto_articolo ?? 0)
      const pvScontato = sc > 0 ? pv * (1 - sc / 100) : pv
      const lordo   = calcolaSubtotale(pv,        r.unita, item.h ?? 0, item.l ?? 0, item.q)
      const subArt  = calcolaSubtotale(pvScontato, r.unita, item.h ?? 0, item.l ?? 0, item.q)
      const sub     = Math.round(subArt * factorCliente * 100) / 100
      return {
        listino_id: r.id,
        categoria: r.categoria,
        produttore: r.produttore,
        descrizione: r.descrizione,
        unita: r.unita,
        prezzo_vendita: pv,
        sconto_articolo: sc,
        quantita: item.q,
        larghezza_cm: item.l ?? 0,
        altezza_cm: item.h ?? 0,
        colore: item.colore ?? '',
        note: item.note ?? '',
        prezzo_pre_sconto: lordo,
        subtotale: sub,
        sconto_cliente_pct: scontoClientePct,
      } satisfies ArticoloSnapshot
    }).filter((x): x is ArticoloSnapshot => x !== null)

    if (articoli.length === 0) redirect('/area-clienti/carrello-acquisti')

    const totale = articoli.reduce((s, a) => s + a.subtotale, 0)

    // Crea ordine pending
    const [res] = await db.execute(
      'INSERT INTO ordini_acquisti (username, cliente_id, status, totale, articoli_json) VALUES (?,?,?,?,?)',
      [username, clienteId, 'pending', totale, JSON.stringify(articoli)]
    ) as [{ insertId: number }, unknown]
    const ordineId = res.insertId

    // Crea Stripe Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    // Per ogni articolo usiamo il subtotale già scontato (sconto articolo + sconto cliente)
    const lineItems = articoli.map(a => {
      const dimNote: string[] = []
      if (a.larghezza_cm) dimNote.push(`L: ${a.larghezza_cm} cm`)
      if (a.altezza_cm) dimNote.push(`H: ${a.altezza_cm} cm`)
      if (a.colore) dimNote.push(a.colore)
      const desc = dimNote.length > 0 ? dimNote.join(' · ') : undefined

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${a.descrizione}${a.produttore ? ' — ' + a.produttore : ''}`,
            ...(desc ? { description: desc } : {}),
          },
          unit_amount: Math.round(a.subtotale * 100),
        },
        quantity: 1,
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
  } catch (err) {
    const isRedirect = typeof err === 'object' && err !== null && 'digest' in err
      && typeof (err as { digest?: unknown }).digest === 'string'
      && (err as { digest: string }).digest.startsWith('NEXT_REDIRECT')
    if (!isRedirect) console.error('[creaCheckoutSession] errore:', err)
    throw err
  } finally {
    await db.end()
  }
}
