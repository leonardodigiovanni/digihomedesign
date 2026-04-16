import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import FattureClient, { type Fattura, type Pagamento } from '@/app/area-lavoro/fatture/fatture-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Fatture' }

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

async function getData(role: string, username: string): Promise<{ fatture: Fattura[]; pagamenti: Pagamento[] }> {
  const conn = await getConnection()
  try {
    // Migration: aggiungi cliente_id se non esiste
    try { await conn.execute('ALTER TABLE fatture ADD COLUMN cliente_id INT NULL') } catch { /* esiste già */ }

    const isStaff = role === 'admin' || role === 'dipendente'
    let fattureRows: Record<string, unknown>[]

    if (isStaff) {
      const [rows] = await conn.query('SELECT * FROM fatture ORDER BY data DESC, id DESC')
      fattureRows = rows as Record<string, unknown>[]
    } else {
      // Trova email del cliente loggato e filtra
      const [userRows] = await conn.execute('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const email = userRows[0]?.email ?? ''
      if (!email) return { fatture: [], pagamenti: [] }
      const [rows] = await conn.query(`
        SELECT f.* FROM fatture f
        INNER JOIN clienti c ON c.id = f.cliente_id AND c.email = ?
        ORDER BY f.data DESC, f.id DESC
      `, [email])
      fattureRows = rows as Record<string, unknown>[]
    }

    const [pagamentiRows] = await conn.query('SELECT * FROM pagamenti_fattura ORDER BY data ASC')

    const fatture = fattureRows.map(r => ({ ...r, data: dateToLocal(r.data) })) as Fattura[]
    const pagamenti = (pagamentiRows as Record<string, unknown>[]).map(r => ({ ...r, data: dateToLocal(r.data) })) as Pagamento[]

    return { fatture, pagamenti }
  } catch { return { fatture: [], pagamenti: [] } }
  finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role    = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const { fatture, pagamenti } = await getData(role, username)
  const isStaff = role === 'admin' || role === 'dipendente'

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Fatture</h2>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
        {isStaff ? 'Tutte le fatture — gestione completa.' : 'Le fatture associate al tuo account.'}
      </p>
      <FattureClient fatture={fatture} pagamenti={pagamenti} />
    </div>
  )
}
