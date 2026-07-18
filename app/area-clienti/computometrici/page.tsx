import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = { title: 'Computi Metrici' }

type Computometrico = {
  id: number
  numero: string
  cliente_id: number | null
  cliente_nome: string
  descrizione: string
  stato: 'bozza' | 'calcolato' | 'archiviato'
  importo_stimato: number
  data: string
  note: string | null
  visibile_cliente: number
}

const STATO_COLORS: Record<string, [string, string]> = {
  bozza:     ['#000',    'transparent'],
  calcolato: ['#276749', '#f0fff4'],
  archiviato:['#666',    '#f5f5f5'],
}

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

async function getData(role: string, username: string): Promise<{ items: Computometrico[]; isStaff: boolean }> {
  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS computometrici (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        numero           VARCHAR(50)   NOT NULL DEFAULT '',
        cliente_id       INT           NULL,
        creato_da        VARCHAR(100)  NULL DEFAULT NULL,
        descrizione      TEXT          NULL,
        stato            ENUM('bozza','calcolato','archiviato') NOT NULL DEFAULT 'bozza',
        importo_stimato  DECIMAL(12,2) NOT NULL DEFAULT 0,
        data             DATE          NOT NULL,
        note             TEXT          NULL,
        visibile_cliente TINYINT(1)    NOT NULL DEFAULT 1,
        created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const isStaff = role === 'admin' || role === 'dipendente'
    let rows: Record<string, unknown>[]

    if (isStaff) {
      const [r] = await db.query(`
        SELECT c.*, CASE WHEN cl.id IS NULL THEN '' WHEN cl.ragione_sociale != '' THEN cl.ragione_sociale ELSE CONCAT(TRIM(cl.cognome),' ',TRIM(cl.nome)) END AS cliente_nome
        FROM computometrici c LEFT JOIN clienti cl ON cl.id = c.cliente_id
        ORDER BY c.data DESC, c.id DESC
      `)
      rows = r as Record<string, unknown>[]
    } else {
      const [uRows] = await db.execute('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]) as [{ cliente_id: number | null }[], unknown]
      const clienteId = uRows[0]?.cliente_id ?? null
      const [r] = await db.query(`
        SELECT c.*, '' AS cliente_nome FROM computometrici c
        WHERE c.visibile_cliente = 1
          AND (c.cliente_id = ? OR (c.creato_da = ? AND c.cliente_id IS NULL))
        ORDER BY c.data DESC, c.id DESC
      `, [clienteId, username])
      rows = r as Record<string, unknown>[]
    }

    const items = rows.map(r => ({
      id:              Number(r.id),
      numero:          String(r.numero ?? ''),
      cliente_id:      r.cliente_id != null ? Number(r.cliente_id) : null,
      cliente_nome:    String(r.cliente_nome ?? ''),
      descrizione:     String(r.descrizione ?? ''),
      stato:           (r.stato as Computometrico['stato']) ?? 'bozza',
      importo_stimato: Number(r.importo_stimato ?? 0),
      data:            dateToLocal(r.data),
      note:            r.note != null ? String(r.note) : null,
      visibile_cliente: Number(r.visibile_cliente ?? 1),
    }))
    return { items, isStaff }
  } catch { return { items: [], isStaff: false } }
  finally { await db.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const { items, isStaff } = await getData(role, username)

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="effetto-3d" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Computi Metrici<ShortcutStar href="/area-clienti/computometrici" small /></h2>
          <p style={{ color: '#000', fontSize: 14, margin: '4px 0 0' }}>
            {isStaff ? 'Tutti i computi metrici emessi.' : 'Le stime dei computi metrici associate al tuo account.'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="/area-clienti/carrello-computometrico" className="btn-green" style={{ padding: '0 24px' }}>
            + Nuova stima
          </a>
        </div>
      </div>

      {items.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun computo metrico trovato.</p>
      ) : (
        <div style={{
          overflowX: 'auto', overflowY: 'hidden', borderRadius: '8px 8px 0 0',
          border: '1px solid #c8960c',
          boxShadow: '0 4px 24px rgba(200,150,12,0.18), inset 0 1px 0 rgba(255,250,200,0.5)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={thStyle}>N°</th>
                {isStaff && <th style={thStyle}>Cliente</th>}
                <th style={thStyle}>Descrizione</th>
                <th style={thStyle}>Data</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Stima</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Stato</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p, i) => {
                const [color, bg] = STATO_COLORS[p.stato] ?? ['#666', '#f5f5f5']
                const td = i === items.length - 1 ? { ...tdStyle, borderBottom: 'none' } : tdStyle
                return (
                  <tr key={p.id} style={{ height: 80 }}>
                    <td style={td}>
                      <a href={`/area-clienti/computometrici/${p.id}`}
                        style={{ fontWeight: 700, color: '#7a6000', textDecoration: 'none', fontSize: 15 }}>
                        {p.numero || `#${p.id}`}
                      </a>
                    </td>
                    {isStaff && <td style={{ ...td, maxWidth: 120, whiteSpace: 'normal', wordBreak: 'break-word' }}>{p.cliente_nome || '—'}</td>}
                    <td style={{ ...td, maxWidth: 180, whiteSpace: 'normal', wordBreak: 'break-word' }}>{p.descrizione}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{p.data}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap', textAlign: 'right', fontWeight: 700 }}>
                      {p.importo_stimato > 0 ? `€ ${Number(p.importo_stimato).toLocaleString('it-IT', { minimumFractionDigits: 2 })}` : '—'}
                    </td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <span style={{ background: bg, color, padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                        {p.stato}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
