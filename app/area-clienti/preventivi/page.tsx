import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Preventivi' }

type Preventivo = {
  id: number
  numero: string
  cliente_id: number | null
  cliente_nome: string
  descrizione: string
  stato: 'bozza' | 'inviato' | 'accettato' | 'rifiutato' | 'scaduto'
  importo: number
  data: string
  validita_giorni: number
  note: string | null
  visibile_cliente: number
  created_at: string
}

const STATO_COLORS: Record<string, [string, string]> = {
  bozza:     ['#666', '#f5f5f5'],
  inviato:   ['#2b6cb0', '#ebf8ff'],
  accettato: ['#276749', '#f0fff4'],
  rifiutato: ['#c00', '#fff5f5'],
  scaduto:   ['#8a6d3b', '#fffbeb'],
}

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

async function getData(role: string, username: string): Promise<{ preventivi: Preventivo[]; isStaff: boolean }> {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS preventivi (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        numero           VARCHAR(50)   NOT NULL DEFAULT '',
        cliente_id       INT           NULL,
        descrizione      TEXT          NOT NULL DEFAULT '',
        stato            ENUM('bozza','inviato','accettato','rifiutato','scaduto') NOT NULL DEFAULT 'bozza',
        importo          DECIMAL(10,2) NOT NULL DEFAULT 0,
        data             DATE          NOT NULL,
        validita_giorni  INT           NOT NULL DEFAULT 30,
        note             TEXT          NULL,
        visibile_cliente TINYINT(1)    NOT NULL DEFAULT 1,
        created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const isStaff = role === 'admin' || role === 'dipendente'
    let rows: Record<string, unknown>[]

    if (isStaff) {
      const [r] = await conn.query(`
        SELECT p.*, COALESCE(c.ragione_sociale, CONCAT(c.cognome, ' ', c.nome), '') AS cliente_nome
        FROM preventivi p LEFT JOIN clienti c ON c.id = p.cliente_id
        ORDER BY p.data DESC, p.id DESC
      `)
      rows = r as Record<string, unknown>[]
    } else {
      const [userRows] = await conn.execute('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const email = userRows[0]?.email ?? ''
      if (!email) return { preventivi: [], isStaff: false }
      const [r] = await conn.query(`
        SELECT p.*, '' AS cliente_nome FROM preventivi p
        INNER JOIN clienti c ON c.id = p.cliente_id AND c.email = ?
        WHERE p.visibile_cliente = 1
        ORDER BY p.data DESC, p.id DESC
      `, [email])
      rows = r as Record<string, unknown>[]
    }

    const preventivi = rows.map(r => ({ ...r, data: dateToLocal(r.data), created_at: dateToLocal(r.created_at) })) as Preventivo[]
    return { preventivi, isStaff }
  } catch { return { preventivi: [], isStaff: false } }
  finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role    = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const { preventivi, isStaff } = await getData(role, username)

  const thStyle: React.CSSProperties = {
    padding: '9px 14px', fontSize: 11, fontWeight: 600, color: '#888',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fafafa', borderBottom: '1px solid #e8e8e8', whiteSpace: 'nowrap',
  }
  const tdStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: 13, color: '#333',
    borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Preventivi</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>
          {isStaff ? 'Tutti i preventivi emessi.' : 'I preventivi associati al tuo account.'}
        </p>
      </div>

      {preventivi.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun preventivo trovato.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8 }}>
            <thead>
              <tr>
                <th style={thStyle}>N°</th>
                {isStaff && <th style={thStyle}>Cliente</th>}
                <th style={thStyle}>Descrizione</th>
                <th style={thStyle}>Data</th>
                <th style={thStyle}>Importo</th>
                <th style={thStyle}>Validità</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Stato</th>
              </tr>
            </thead>
            <tbody>
              {preventivi.map(p => {
                const [color, bg] = STATO_COLORS[p.stato] ?? ['#666', '#f5f5f5']
                return (
                  <tr key={p.id}>
                    <td style={tdStyle}>{p.numero || `#${p.id}`}</td>
                    {isStaff && <td style={tdStyle}>{p.cliente_nome || '—'}</td>}
                    <td style={tdStyle}>{p.descrizione}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{p.data}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>€ {Number(p.importo).toFixed(2)}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{p.validita_giorni} gg</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
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
