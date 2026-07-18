import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import Link from 'next/link'
import OrdiniRicevutiClient, { type OrdineRicevuto, type Nota, type Cliente } from '@/app/area-lavoro/ordini-ricevuti/client'
import ApriOrdineBtn from './apri-btn'
import type { Metadata } from 'next'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = { title: 'Ordini' }

// ─── Staff ────────────────────────────────────────────────────────────────────

async function getDataStaff(): Promise<{ ordini: OrdineRicevuto[]; clienti: Cliente[] }> {
  const conn = await getConnection()
  try {
    try { await conn.execute('ALTER TABLE ordini_ricevuti ADD COLUMN visibile_cliente TINYINT(1) NOT NULL DEFAULT 1') } catch {}
    try { await conn.execute('ALTER TABLE ordini_ricevuti ADD COLUMN cliente_id INT NULL') } catch {}

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
    } catch {}

    return { ordini: ordiniRows.map(o => ({ ...o, note: noteMap[o.id] ?? [] })), clienti }
  } finally { await conn.end() }
}

// ─── Cliente ──────────────────────────────────────────────────────────────────

type OrdineCliente = {
  id: number; numero: string; tipo: 'preventivo' | 'acquisto'
  data_ordine: string; importo_totale: number; created_at: string
}

async function getOrdiniCliente(username: string): Promise<OrdineCliente[]> {
  const conn = await getConnection()
  try {
    const [uRows] = await conn.query('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]) as [{ cliente_id: number | null }[], unknown]
    const clienteId = uRows[0]?.cliente_id ?? null
    if (!clienteId) return []

    const [rows] = await conn.query(
      `SELECT id, numero, tipo,
              DATE_FORMAT(data_ordine,'%Y-%m-%d') AS data_ordine,
              importo_totale,
              DATE_FORMAT(created_at,'%Y-%m-%d') AS created_at
       FROM ordini_clienti
       WHERE cliente_id = ? AND visibile_cliente = 1
       ORDER BY created_at DESC`,
      [clienteId]
    ) as [OrdineCliente[], unknown]
    return rows
  } catch { return [] }
  finally { await conn.end() }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Page() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  if (role === 'cliente') {
    const db = await getConnection()
    const [uRows] = await db.query('SELECT is_active FROM users WHERE username = ? LIMIT 1', [username]) as [{ is_active: number }[], unknown]
    await db.end()
    if ((uRows[0]?.is_active ?? 0) === 0) redirect('/area-clienti/preventivi')
  }

  const isStaff = role === 'admin' || role === 'dipendente'

  if (isStaff) {
    const { ordini, clienti } = await getDataStaff()
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Ordini<ShortcutStar href="/area-clienti/ordini" small /></h2>
          <p style={{ color: '#000', fontSize: 14, margin: '4px 0 0' }}>Tutti gli ordini ricevuti dai clienti</p>
        </div>
        <OrdiniRicevutiClient ordini={ordini} clienti={clienti} role={role} />
        <div className="IsDebug fs-11" style={{ marginTop: 8 }}>pagina revisionata</div>
      </div>
    )
  }

  // ─── Vista cliente ─────────────────────────────────────────────────────────
  const ordini = await getOrdiniCliente(username)

  const thStyle: React.CSSProperties = {
    padding: '9px 14px', fontSize: 12, fontWeight: 700, color: '#7a6000',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fff', borderBottom: '1px solid #c8960c', whiteSpace: 'nowrap',
  }
  const tdStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: 13, color: '#333',
    borderBottom: '1px solid #c8960c', verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 className="effetto-3d" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>I miei ordini<ShortcutStar href="/area-clienti/ordini" small /></h2>
        <p style={{ color: '#555', fontSize: 14, margin: '4px 0 0' }}>
          Preventivi accettati e acquisti completati.
        </p>
      </div>

      {ordini.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun ordine presente.</p>
      ) : (
        <div style={{
          overflowX: 'auto', overflowY: 'hidden', borderRadius: '8px 8px 0 0', border: '1px solid #c8960c',
          boxShadow: '0 4px 24px rgba(200,150,12,0.18), inset 0 1px 0 rgba(255,250,200,0.5)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={thStyle}>N° Ordine</th>
                <th style={thStyle}>Tipo</th>
                <th style={thStyle}>Data</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Importo</th>
              </tr>
            </thead>
            <tbody>
              {ordini.map((o, i) => {
                const isLast = i === ordini.length - 1
                const td = isLast ? { ...tdStyle, borderBottom: 'none' } : tdStyle
                return (
                  <tr key={o.id} style={{ height: 80 }}>
                    <td style={td}>
                      <ApriOrdineBtn id={o.id} numero={o.numero} />
                    </td>
                    <td style={td}>
                      <span style={{
                        background: o.tipo === 'preventivo' ? '#e3f2fd' : '#f0fff4',
                        color:      o.tipo === 'preventivo' ? '#1565c0' : '#276749',
                        padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                      }}>
                        {o.tipo === 'preventivo' ? 'Preventivo' : 'Acquisto'}
                      </span>
                    </td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{o.data_ordine}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      €&nbsp;{Number(o.importo_totale).toFixed(2)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="IsDebug fs-11" style={{ marginTop: 8 }}>pagina revisionata</div>
    </div>
  )
}
