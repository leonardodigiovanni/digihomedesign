import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import MieiOrdiniClient, { type OrdineCliente } from './client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'I Miei Ordini',
}

async function getMieiOrdini(username: string): Promise<OrdineCliente[]> {
  const conn = await getConnection()
  try {
    // Migrations
    try { await conn.execute('ALTER TABLE ordini_ricevuti ADD COLUMN visibile_cliente TINYINT(1) NOT NULL DEFAULT 1') } catch { /* esiste già */ }
    try { await conn.execute('ALTER TABLE ordini_ricevuti ADD COLUMN cliente_id INT NULL') } catch { /* esiste già */ }

    // Cerca email dell'utente loggato
    const [userRows] = await conn.execute(
      'SELECT email FROM users WHERE username = ? LIMIT 1', [username]
    ) as [{ email: string }[], unknown]
    const email = userRows[0]?.email ?? ''
    if (!email) return []

    // JOIN su clienti.email per trovare gli ordini del cliente
    const [rows] = await conn.execute(`
      SELECT o.id, o.numero_ordine, o.cliente, o.descrizione, o.stato, o.totale, o.data_ordine, o.created_at
      FROM ordini_ricevuti o
      INNER JOIN clienti c ON c.id = o.cliente_id AND c.email = ?
      WHERE o.visibile_cliente = 1
      ORDER BY o.data_ordine DESC
    `, [email]) as [OrdineCliente[], unknown]
    return rows
  } catch { return [] }
  finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 30, settings)) redirect('/')

  const ordini = await getMieiOrdini(username)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>I Miei Ordini</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Riepilogo degli ordini associati al tuo account</p>
      </div>
      <MieiOrdiniClient ordini={ordini} />
    </div>
  )
}
