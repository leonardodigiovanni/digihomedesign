import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { DeleteDocumentoButton } from '@/app/area-clienti/documenti/delete-button'
import { UploadDocumentoForm } from '@/app/area-clienti/documenti/upload-form'
import { documentoSrc } from '@/lib/media-src'

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

type ClienteOption = { id: number; label: string }

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

async function getData(role: string, username: string): Promise<{ documenti: Documento[]; isStaff: boolean; clienti: ClienteOption[] }> {
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
    let clienti: ClienteOption[] = []

    if (isStaff) {
      const [r] = await conn.query(`
        SELECT d.*, COALESCE(NULLIF(c.ragione_sociale, ''), CONCAT(c.cognome, ' ', c.nome), '') AS cliente_nome
        FROM documenti_cliente d LEFT JOIN clienti c ON c.id = d.cliente_id
        ORDER BY d.created_at DESC
      `)
      rows = r as Record<string, unknown>[]
      const [cr] = await conn.query(
        `SELECT id, COALESCE(NULLIF(ragione_sociale, ''), CONCAT(cognome, ' ', nome)) AS label FROM clienti ORDER BY label`
      )
      clienti = (cr as { id: number; label: string }[]).map(c => ({ id: c.id, label: c.label }))
    } else {
      const [userRows] = await conn.execute('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const email = userRows[0]?.email ?? ''
      if (!email) return { documenti: [], isStaff: false, clienti: [] }
      const [r] = await conn.query(`
        SELECT d.*, '' AS cliente_nome FROM documenti_cliente d
        INNER JOIN clienti c ON c.id = d.cliente_id AND c.email = ?
        WHERE d.visibile_cliente = 1
        ORDER BY d.created_at DESC
      `, [email])
      rows = r as Record<string, unknown>[]
    }

    const documenti = rows.map(r => ({ ...r, created_at: dateToLocal(r.created_at) })) as Documento[]
    return { documenti, isStaff, clienti }
  } catch { return { documenti: [], isStaff: false, clienti: [] } }
  finally { await conn.end() }
}

export default async function AppDocumentiPage() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!username) redirect('/app/login')

  const { documenti, isStaff, clienti } = await getData(role, username)

  const brushed = 'repeating-linear-gradient(90deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 3px),linear-gradient(160deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)'
  const thStyle: React.CSSProperties = {
    padding: '9px 14px', fontSize: 14, fontWeight: 700, color: '#1a1a1a',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    borderBottom: '1px solid #333', whiteSpace: 'nowrap', fontFamily: 'monospace',
  }
  const tdStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: 14, color: '#333',
    borderBottom: '1px solid #333', verticalAlign: 'middle', fontFamily: 'monospace',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 3, marginRight: 3 }}>
      <div style={{ background: brushed, border: '1px solid #222', borderRadius: 12, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.5)' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' }}>Documenti</p>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: 0 }}>
          {isStaff ? 'Tutti i documenti caricati.' : 'I documenti condivisi con te.'}
        </p>
      </div>

      {isStaff && <UploadDocumentoForm clienti={clienti} isApp={true} />}

      {documenti.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14, fontFamily: 'monospace' }}>Nessun documento disponibile.</p>
      ) : (
        <div style={{ overflowX: 'auto', overflowY: 'hidden', borderRadius: 8, border: '1px solid #222', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: brushed }}>
                <th style={thStyle}>File</th>
                {isStaff && <th style={{ ...thStyle, minWidth: 160 }}>Cliente</th>}
                <th style={thStyle}>Titolo</th>
                <th style={thStyle}>Tipo</th>
                <th style={thStyle}>Data</th>
                {isStaff && <th style={{ ...thStyle, textAlign: 'center' }}>Visibile</th>}
                {isStaff && <th style={{ ...thStyle, textAlign: 'center' }}></th>}
              </tr>
            </thead>
            <tbody>
              {documenti.map((d, idx) => {
                const td = idx === documenti.length - 1 ? { ...tdStyle, borderBottom: 'none' } : tdStyle
                return (
                  <tr key={d.id} style={{ height: 84, background: brushed }}>
                    <td style={td}>
                      <a href={documentoSrc(d.filename)} target="_blank" rel="noopener noreferrer"
                         className="btn-gold-app" style={{ padding: '0 14px', width: '100%' }}>
                        {d.filename.replace(/^\d+_/, '')}
                      </a>
                    </td>
                    {isStaff && <td style={{ ...td, minWidth: 160 }}>{d.cliente_nome || '—'}</td>}
                    <td style={td}>{d.titolo}</td>
                    <td style={td}>{d.tipo}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{d.created_at}</td>
                    {isStaff && (
                      <td style={{ ...td, textAlign: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: d.visibile_cliente ? '#276749' : '#c00' }}>
                          {d.visibile_cliente ? 'SÃ¬' : 'No'}
                        </span>
                      </td>
                    )}
                    {isStaff && (
                      <td style={{ ...td, textAlign: 'center' }}>
                        <DeleteDocumentoButton id={d.id} filename={d.filename} titolo={d.titolo} isApp={true} />
                      </td>
                    )}
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

