import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import OrdiniRicevutiClient, { type OrdineRicevuto, type Nota, type Cliente } from '@/app/area-lavoro/ordini-ricevuti/client'
import MieiOrdiniClient, { type OrdineCliente } from '@/app/area-lavoro/miei-ordini/client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Ordini' }

async function getDataStaff(): Promise<{ ordini: OrdineRicevuto[]; clienti: Cliente[] }> {
  const conn = await getConnection()
  try {
    try { await conn.execute('ALTER TABLE ordini_ricevuti ADD COLUMN visibile_cliente TINYINT(1) NOT NULL DEFAULT 1') } catch { /* esiste già */ }
    try { await conn.execute('ALTER TABLE ordini_ricevuti ADD COLUMN cliente_id INT NULL') } catch { /* esiste già */ }

    const [ordiniRows] = await conn.execute(
      'SELECT id,numero_ordine,cliente,cliente_id,descrizione,stato,totale,data_ordine,created_at,visibile_cliente FROM ordini_ricevuti ORDER BY data_ordine DESC'
    ) as [Omit<OrdineRicevuto, 'note'>[], unknown]

    const [noteRows] = await conn.execute(
      'SELECT id,ordine_id,testo,autore,created_at FROM ordini_note ORDER BY created_at ASC'
    ) as [({ ordine_id: number } & Nota)[], unknown]

    const noteMap: Record<number, Nota[]> = {}
    for (const n of noteRows) {
      if (!noteMap[n.ordine_id]) noteMap[n.ordine_id] = []
      noteMap[n.ordine_id].push({ id: n.id, testo: n.testo, autore: n.autore, created_at: n.created_at })
    }

    let clienti: Cliente[] = []
    try {
      const [cRows] = await conn.execute('SELECT id, nome, cognome, ragione_sociale, email FROM clienti ORDER BY cognome ASC, ragione_sociale ASC')
      clienti = cRows as Cliente[]
    } catch { /* tabella non ancora creata */ }

    return { ordini: ordiniRows.map(o => ({ ...o, note: noteMap[o.id] ?? [] })), clienti }
  } finally { await conn.end() }
}

async function getDataCliente(username: string): Promise<OrdineCliente[]> {
  const conn = await getConnection()
  try {
    const [userRows] = await conn.execute('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
    const email = userRows[0]?.email ?? ''
    if (!email) return []
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
  const role    = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const isStaff = role === 'admin' || role === 'dipendente'

  if (isStaff) {
    const { ordini, clienti } = await getDataStaff()
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Ordini</h2>
          <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Tutti gli ordini ricevuti dai clienti</p>
        </div>
        <OrdiniRicevutiClient ordini={ordini} clienti={clienti} role={role} />
      </div>
    )
  }

  const ordini = await getDataCliente(username)
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
