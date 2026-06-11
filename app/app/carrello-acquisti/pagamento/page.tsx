import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import { decompressCart } from '@/lib/cart-cookie'
import { creaCheckoutSessionApp } from '../checkout-action'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Pagamento' }

function calcolaSubtotale(prezzo: number, unita: string, h: number, l: number, q: number): number {
  if (unita === 'mÂ²') return Math.round(prezzo * (h / 100) * (l / 100) * q * 100) / 100
  if (unita === 'ml') return Math.round(prezzo * (l / 100) * q * 100) / 100
  return Math.round(prezzo * q * 100) / 100
}

function fmt(n: number): string {
  const [int, dec] = n.toFixed(2).split('.')
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec
}

export default async function Page() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!username) redirect('/app/login')

  const cartRaw = cookieStore.get('digi_cart_acquisti')?.value ?? ''
  const cart = decompressCart(cartRaw)
    .filter(i => i.id > 0 && i.tipo !== 'caratteristica')
    .map(i => ({ id: i.id, q: i.q, l: i.l ?? 0, h: i.h ?? 0, colore: i.colore ?? '', note: i.note ?? '' }))
  if (cart.length === 0) redirect('/app/carrello-acquisti')

  const db = await getConnection()
  type ArtRow = { id: number; categoria: string; produttore: string; descrizione: string; unita: string; prezzo_vendita: number }
  let rows: ArtRow[] = []
  let clienteNome = username

  try {
    const ids = cart.map(i => i.id)
    const ph = ids.map(() => '?').join(',')
    const [r] = await db.query(
      `SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita FROM listini WHERE id IN (${ph})`,
      ids
    ) as [ArtRow[], unknown]
    rows = r

    const [uRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
    const email = uRows[0]?.email ?? ''
    if (email) {
      const [cRows] = await db.query(
        'SELECT nome, cognome, ragione_sociale FROM clienti WHERE email = ? LIMIT 1', [email]
      ) as [{ nome: string; cognome: string; ragione_sociale: string }[], unknown]
      if (cRows[0]) {
        const c = cRows[0]
        clienteNome = String(c.ragione_sociale || '').trim() || `${String(c.cognome ?? '')} ${String(c.nome ?? '')}`.trim() || username
      }
    }
  } finally {
    await db.end()
  }

  const articoli = cart.map(item => {
    const r = rows.find(x => x.id === item.id)
    if (!r) return null
    const sub = calcolaSubtotale(Number(r.prezzo_vendita), r.unita, item.h, item.l, item.q)
    return { ...r, prezzo_vendita: Number(r.prezzo_vendita), quantita: item.q, larghezza_cm: item.l, altezza_cm: item.h, colore: item.colore, note: item.note, sub }
  }).filter(x => x !== null)

  if (articoli.length === 0) redirect('/app/carrello-acquisti')

  const totale = articoli.reduce((s, a) => s + a!.sub, 0)

  return (
    <div className="page-content-wrapper" style={{ margin: '8px 0', padding: '0 0 8px', fontSize: 15, lineHeight: 1.8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 640 }}>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px 20px' }}>
          <p style={{ margin: '0 0 2px', fontSize: 11, color: '#888', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Riepilogo ordine</p>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, fontFamily: 'monospace' }}>{clienteNome}</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, overflow: 'hidden' }}>
          {articoli.map((a, i) => {
            if (!a) return null
            const dims: string[] = []
            if (a.larghezza_cm) dims.push(`L: ${a.larghezza_cm} cm`)
            if (a.altezza_cm)   dims.push(`H: ${a.altezza_cm} cm`)
            if (a.colore)       dims.push(a.colore)
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '10px 16px', borderBottom: i < articoli.length - 1 ? '1px solid #f0e0a0' : 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace', color: '#1a1a1a' }}>
                    {a.produttore ? `${a.produttore} â€” ` : ''}{a.descrizione}
                  </div>
                  <div style={{ fontSize: 11, color: '#888', fontFamily: 'monospace', marginTop: 1 }}>
                    {[`${a.quantita} ${a.unita}`, ...dims].join(' Â· ')}
                  </div>
                  {a.note && <div style={{ fontSize: 11, color: '#aaa', fontFamily: 'monospace', fontStyle: 'italic' }}>{a.note}</div>}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', color: '#1a1a1a' }}>
                  â‚¬ {fmt(a.sub)}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ background: '#fff', border: '1px solid #c9a84c', borderRadius: 10, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: '#1a1a1a' }}>Totale</span>
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: '#1a1a1a' }}>â‚¬ {fmt(totale)}</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 11, color: '#888', margin: 0, fontFamily: 'monospace' }}>
            Pagamenti sicuri gestiti da Stripe. I tuoi dati di pagamento non vengono mai memorizzati sul nostro sito.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <form action={creaCheckoutSessionApp} style={{ flex: 1, minWidth: 140 }}>
              <button type="submit"
                className="btn-green-app"
                style={{ width: '100%', padding: '0 8px' }}>
                Paga ora
              </button>
            </form>
            <a href="/app/carrello-acquisti" className="btn-black-app"
              style={{ flex: 1, minWidth: 140, padding: '0 8px' }}>
              â† Torna al carrello
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

