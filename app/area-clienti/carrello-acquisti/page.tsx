import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'
import CarrelloAcquistiClient, { type ArticoloCarrelloAcquisti } from './carrello-acquisti-client'

export const metadata: Metadata = { title: 'Carrello Acquisti' }

type CartItem = { id: number; q: number; ante?: number; l?: number; h?: number; colore?: string; note?: string }

async function getArticoliDaCookie(cart: CartItem[]) {
  if (cart.length === 0) return []
  const ids = cart.map(i => i.id)
  const db = await getConnection()
  try {
    const ph = ids.map(() => '?').join(',')
    const [rows] = await db.query(
      `SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita FROM listini WHERE id IN (${ph})`,
      ids
    ) as [{ id: number; categoria: string; produttore: string; descrizione: string; unita: string; prezzo_vendita: number }[], unknown]

    return cart.map((item, index) => {
      const art = rows.find(r => r.id === item.id)
      if (!art) return null
      return {
        index,
        listino_id: art.id,
        categoria: art.categoria,
        produttore: art.produttore,
        descrizione: art.descrizione,
        unita: art.unita,
        prezzo_vendita: Number(art.prezzo_vendita),
        quantita: item.q,
        ante: item.ante,
        larghezza_cm: item.l,
        altezza_cm: item.h,
        colore: item.colore,
        note: item.note,
      }
    }).filter(x => x !== null)
  } catch { return [] }
  finally { await db.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  const digiCartAcquisti = cookieStore.get('digi_cart_acquisti')?.value ?? ''

  let cart: CartItem[] = []
  try { cart = digiCartAcquisti ? JSON.parse(digiCartAcquisti) : [] } catch {}

  const articoli = await getArticoliDaCookie(cart)
  const isLoggedIn = !!username

  return (
    <div style={{ maxWidth: 980, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 12, color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link>
        {' / '}Carrello acquisti
      </p>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 20 }}>
        Il tuo carrello acquisti
      </h1>
      <CarrelloAcquistiClient articoli={articoli} isLoggedIn={isLoggedIn} />
    </div>
  )
}
