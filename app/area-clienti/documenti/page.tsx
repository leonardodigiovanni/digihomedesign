import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Documenti' }

type Documento = {
  id: number
  cliente_id: number | null
  cliente_nome: string
  titolo: string
  tipo: string
  filename: string
  note: string | null
  visibile_cliente: number
  created_at: string
}

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

async function getData(role: string, username: string): Promise<{ documenti: Documento[]; isStaff: boolean }> {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS documenti_cliente (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id       INT           NULL,
        titolo           VARCHAR(200)  NOT NULL,
        tipo             VARCHAR(50)   NOT NULL DEFAULT 'generico',
        filename         VARCHAR(255)  NOT NULL,
        note             TEXT          NULL,
        visibile_cliente TINYINT(1)    NOT NULL DEFAULT 1,
        created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `)

    const isStaff = role === 'admin' || role === 'dipendente'
    let rows: Record<string, unknown>[]

    if (isStaff) {
      const [r] = await conn.query(`
        SELECT d.*, COALESCE(c.ragione_sociale, CONCAT(c.cognome, ' ', c.nome), '') AS cliente_nome
        FROM documenti_cliente d LEFT JOIN clienti c ON c.id = d.cliente_id
        ORDER BY d.created_at DESC
      `)
      rows = r as Record<string, unknown>[]
    } else {
      const [userRows] = await conn.execute('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const email = userRows[0]?.email ?? ''
      if (!email) return { documenti: [], isStaff: false }
      const [r] = await conn.query(`
        SELECT d.*, '' AS cliente_nome FROM documenti_cliente d
        INNER JOIN clienti c ON c.id = d.cliente_id AND c.email = ?
        WHERE d.visibile_cliente = 1
        ORDER BY d.created_at DESC
      `, [email])
      rows = r as Record<string, unknown>[]
    }

    const documenti = rows.map(r => ({ ...r, created_at: dateToLocal(r.created_at) })) as Documento[]
    return { documenti, isStaff }
  } catch { return { documenti: [], isStaff: false } }
  finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role    = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const { documenti, isStaff } = await getData(role, username)

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
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Documenti</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>
          {isStaff ? 'Tutti i documenti caricati.' : 'I documenti condivisi con te.'}
        </p>
      </div>

      {documenti.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun documento disponibile.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8 }}>
            <thead>
              <tr>
                {isStaff && <th style={thStyle}>Cliente</th>}
                <th style={thStyle}>Titolo</th>
                <th style={thStyle}>Tipo</th>
                <th style={thStyle}>File</th>
                <th style={thStyle}>Data</th>
                {isStaff && <th style={{ ...thStyle, textAlign: 'center' }}>Visibile</th>}
              </tr>
            </thead>
            <tbody>
              {documenti.map(d => (
                <tr key={d.id}>
                  {isStaff && <td style={tdStyle}>{d.cliente_nome || '—'}</td>}
                  <td style={tdStyle}>{d.titolo}</td>
                  <td style={tdStyle}>{d.tipo}</td>
                  <td style={tdStyle}>
                    <a href={`/uploads/${d.filename}`} target="_blank" rel="noopener noreferrer"
                       style={{ color: '#c8960c', textDecoration: 'underline' }}>
                      {d.filename}
                    </a>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{d.created_at}</td>
                  {isStaff && (
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: d.visibile_cliente ? '#276749' : '#c00' }}>
                        {d.visibile_cliente ? 'Sì' : 'No'}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
