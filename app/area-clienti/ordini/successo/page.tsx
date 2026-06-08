import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { getStripe } from '@/lib/stripe'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { ArticoloSnapshot } from '@/app/area-clienti/carrello-acquisti/checkout-action'

export const metadata: Metadata = { title: 'Ordine confermato' }

type Props = { searchParams: Promise<{ session_id?: string }> }

export default async function Page({ searchParams }: Props) {
  const { session_id } = await searchParams
  if (!session_id) redirect('/area-clienti/carrello-acquisti')

  const cookieStore = await cookies()

  // Verifica la sessione con Stripe
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let session: any = null
  try {
    session = await getStripe().checkout.sessions.retrieve(session_id)
  } catch {
    redirect('/area-clienti/carrello-acquisti')
  }

  if (!session || session.payment_status !== 'paid') {
    redirect('/area-clienti/carrello-acquisti')
  }

  // Aggiorna ordine in DB (idempotente — il webhook potrebbe averlo già fatto)
  const db = await getConnection()
  let articoli: ArticoloSnapshot[] = []
  let ordineId: number | null = null
  let totale = 0

  try {
    const [rows] = await db.query(
      'SELECT id, articoli_json, totale FROM ordini_acquisti WHERE stripe_session_id = ? LIMIT 1',
      [session_id]
    ) as [{ id: number; articoli_json: string; totale: number }[], unknown]

    if (rows[0]) {
      ordineId = rows[0].id
      totale   = Number(rows[0].totale)
      try { articoli = JSON.parse(rows[0].articoli_json) } catch {}
      await db.execute(
        'UPDATE ordini_acquisti SET status=? WHERE stripe_session_id=? AND status != ?',
        ['paid', session_id, 'paid']
      )
      // Clona come ordine freezato
      if (ordineId) {
        const { clonaAcquistoComeOrdine } = await import('@/app/area-clienti/ordini/actions')
        await clonaAcquistoComeOrdine(ordineId).catch(() => {})
      }
    }
  } finally {
    await db.end()
  }

  // Svuota il carrello acquisti
  cookieStore.delete('digi_cart_acquisti')

  const tdS: React.CSSProperties = {
    padding: '10px 14px', fontSize: 13, color: '#333',
    borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle',
  }
  const thS: React.CSSProperties = {
    padding: '8px 14px', fontSize: 11, fontWeight: 600, color: '#888',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fafafa', borderBottom: '1px solid #e8e8e8', whiteSpace: 'nowrap',
  }

  return (
    <div style={{ maxWidth: 720, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>

      {/* Intestazione conferma */}
      <div style={{
        background: 'linear-gradient(135deg,#1b4d1b,#2e7d32)',
        borderRadius: 12, padding: '28px 32px', marginBottom: 32,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <span style={{ fontSize: 48, lineHeight: 1 }}>✓</span>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#fff' }}>
            Pagamento confermato!
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#c8f0c8' }}>
            {ordineId ? `Ordine #${ordineId}` : ''} — Totale: € {totale.toFixed(2)}
          </p>
        </div>
      </div>

      <p style={{ fontSize: 14, color: '#555', marginBottom: 24 }}>
        Grazie per il tuo acquisto. Riceverai una email di conferma da Stripe con il riepilogo del pagamento.
        Il tuo ordine è stato ricevuto e verrà elaborato al più presto.
      </p>

      {/* Riepilogo articoli */}
      {articoli.length > 0 && (
        <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, overflow: 'hidden', marginBottom: 28 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thS}>Articolo</th>
                <th style={{ ...thS, textAlign: 'center' }}>Qtà</th>
                <th style={{ ...thS, textAlign: 'right' }}>Subtotale</th>
              </tr>
            </thead>
            <tbody>
              {articoli.map((a, i) => {
                const dims: string[] = []
                if (a.larghezza_cm) dims.push(`L: ${a.larghezza_cm} cm`)
                if (a.altezza_cm) dims.push(`H: ${a.altezza_cm} cm`)
                if (a.colore) dims.push(a.colore)
                return (
                  <tr key={i}>
                    <td style={tdS}>
                      <div style={{ fontWeight: 500 }}>{a.descrizione}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{a.produttore}</div>
                      {dims.length > 0 && <div style={{ fontSize: 11, color: '#aaa' }}>{dims.join(' · ')}</div>}
                    </td>
                    <td style={{ ...tdS, textAlign: 'center' }}>{a.quantita} {a.unita}</td>
                    <td style={{ ...tdS, textAlign: 'right', fontWeight: 600 }}>€ {a.subtotale.toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#fafafa', borderTop: '2px solid #e8e8e8' }}>
                <td colSpan={2} style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, textAlign: 'right' }}>Totale pagato</td>
                <td style={{ padding: '10px 14px', fontSize: 15, fontWeight: 700, textAlign: 'right', color: '#2e7d32' }}>€ {totale.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/area-clienti/ordini" style={{
          padding: '10px 22px', fontSize: 13, fontWeight: 600, borderRadius: 6,
          background: '#1a4a8a', color: '#fff', textDecoration: 'none',
        }}>
          I miei ordini →
        </Link>
        <Link href="/brand/cataloghi" style={{
          padding: '10px 22px', fontSize: 13, fontWeight: 600, borderRadius: 6,
          background: '#f0f0f0', color: '#444', textDecoration: 'none',
        }}>
          Continua a sfogliare
        </Link>
      </div>
    </div>
  )
}
