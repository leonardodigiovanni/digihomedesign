import React from 'react'
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

type OrdineAcquisto = {
  id: number
  status: string
  totale: number
  data: string
  articoli_json: string
}

async function getOrdiniAcquisti(username: string): Promise<OrdineAcquisto[]> {
  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(
      `SELECT id, status, totale, DATE_FORMAT(data,'%Y-%m-%d') AS data, articoli_json
       FROM ordini_acquisti WHERE username = ? AND status = 'paid' ORDER BY data DESC`,
      [username]
    ) as [OrdineAcquisto[], unknown]
    return rows
  } catch { return [] }
  finally { await conn.end() }
}

async function getOrdiniAcquistiStaff(): Promise<(OrdineAcquisto & { username: string })[]> {
  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(
      `SELECT id, username, status, totale, DATE_FORMAT(data,'%Y-%m-%d') AS data, articoli_json
       FROM ordini_acquisti WHERE status = 'paid' ORDER BY data DESC`
    ) as [(OrdineAcquisto & { username: string })[], unknown]
    return rows
  } catch { return [] }
  finally { await conn.end() }
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

function SezioneOrdiniAcquisti({ ordini, showUsername }: { ordini: (OrdineAcquisto & { username?: string })[]; showUsername?: boolean }) {
  if (ordini.length === 0) return null
  const th: React.CSSProperties = {
    padding: '8px 14px', fontSize: 11, fontWeight: 600, color: '#888',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fafafa', borderBottom: '1px solid #e8e8e8', whiteSpace: 'nowrap',
  }
  const td: React.CSSProperties = {
    padding: '10px 14px', fontSize: 13, color: '#333',
    borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle',
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#4a0080' }}>Ordini acquisto online</h3>
        <p style={{ fontSize: 13, color: '#888', margin: '2px 0 0' }}>Pagamenti completati tramite Stripe</p>
      </div>
      <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>#</th>
              {showUsername && <th style={th}>Utente</th>}
              <th style={th}>Data</th>
              <th style={{ ...th, textAlign: 'right' }}>Totale</th>
              <th style={th}>Articoli</th>
            </tr>
          </thead>
          <tbody>
            {ordini.map(o => {
              let arts: { descrizione: string; quantita: number; unita: string }[] = []
              try { arts = JSON.parse(o.articoli_json) } catch {}
              return (
                <tr key={o.id}>
                  <td style={{ ...td, color: '#aaa' }}>#{o.id}</td>
                  {showUsername && <td style={{ ...td, color: '#555' }}>{(o as OrdineAcquisto & { username?: string }).username}</td>}
                  <td style={td}>{o.data}</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: '#2e7d32' }}>€ {Number(o.totale).toFixed(2)}</td>
                  <td style={{ ...td, color: '#666', fontSize: 12 }}>
                    {arts.slice(0, 3).map((a, i) => <div key={i}>{a.descrizione} × {a.quantita} {a.unita}</div>)}
                    {arts.length > 3 && <div style={{ color: '#aaa' }}>+ altri {arts.length - 3}</div>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default async function Page() {
  const cookieStore = await cookies()
  const role    = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const isStaff = role === 'admin' || role === 'dipendente'

  if (role === 'cliente') {
    const db = await getConnection()
    const [uRows] = await db.query('SELECT is_active FROM users WHERE username = ? LIMIT 1', [username]) as [{ is_active: number }[], unknown]
    await db.end()
    if ((uRows[0]?.is_active ?? 0) === 0) redirect('/area-clienti/preventivi')
  }

  if (isStaff) {
    const [{ ordini, clienti }, ordiniAcquisti] = await Promise.all([
      getDataStaff(),
      getOrdiniAcquistiStaff(),
    ])
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Ordini</h2>
          <p style={{ color: '#000', fontSize: 14, margin: '4px 0 0' }}>Tutti gli ordini ricevuti dai clienti</p>
        </div>
        <OrdiniRicevutiClient ordini={ordini} clienti={clienti} role={role} />
        <SezioneOrdiniAcquisti ordini={ordiniAcquisti} showUsername />
      </div>
    )
  }

  const [ordini, ordiniAcquisti] = await Promise.all([
    getDataCliente(username),
    getOrdiniAcquisti(username),
  ])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>I Miei Ordini</h2>
        <p style={{ color: '#000', fontSize: 14, margin: '4px 0 0' }}>Riepilogo degli ordini associati al tuo account</p>
      </div>
      <MieiOrdiniClient ordini={ordini} />
      <SezioneOrdiniAcquisti ordini={ordiniAcquisti} />
    </div>
  )
}
