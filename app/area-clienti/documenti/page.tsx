import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import { DeleteDocumentoButton } from './delete-button'
import { documentoSrc } from '@/lib/media-src'
import { UploadDocumentoForm } from './upload-form'
import ShortcutStar from '@/components/shortcut-star'

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

type ClienteOption = { id: number; label: string }

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

async function getData(role: string, username: string): Promise<{
  documenti: Documento[]
  isStaff: boolean
  clienti: ClienteOption[]
}> {
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
        `SELECT id, COALESCE(NULLIF(ragione_sociale, ''), CONCAT(cognome, ' ', nome)) AS label
         FROM clienti ORDER BY label`
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

  const { documenti, isStaff, clienti } = await getData(role, username)

  const thStyle: React.CSSProperties = {
    padding: '9px 14px', fontSize: 11, fontWeight: 700, color: '#7a6000',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fff', borderBottom: '1px solid #c8960c', whiteSpace: 'nowrap',
    }
  const tdStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: 13, color: '#333',
    borderBottom: '1px solid #c8960c', verticalAlign: 'middle',
    }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 className="effetto-3d" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Documenti<ShortcutStar href="/area-clienti/documenti" small /></h2>
        <p style={{ color: '#000', fontSize: 14, margin: '4px 0 0' }}>
          {isStaff ? 'Tutti i documenti caricati.' : 'I documenti condivisi con te.'}
        </p>
      </div>

      {/* ── FORM UPLOAD (solo staff) ── */}
      {isStaff && <UploadDocumentoForm clienti={clienti} />}

      {/* ── TABELLA ── */}
      {documenti.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun documento disponibile.</p>
      ) : (
        <div style={{
          overflowX: 'auto', overflowY: 'hidden', borderRadius: '8px 8px 0 0', border: '1px solid #c8960c',
          boxShadow: '0 4px 24px rgba(200,150,12,0.18), inset 0 1px 0 rgba(255,250,200,0.5)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={thStyle}>File</th>
                {isStaff && <th style={thStyle}>Cliente</th>}
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
                <tr key={d.id} style={{ height: 60 }}>
                  <td style={td}>
                    <a href={documentoSrc(d.filename)} target="_blank" rel="noopener noreferrer"
                       className="btn-gold"
                       style={{ padding: '0 14px' }}>
                      {d.filename.replace(/^\d+_/, '')}
                    </a>
                  </td>
                  {isStaff && <td style={td}>{d.cliente_nome || '—'}</td>}
                  <td style={td}>{d.titolo}</td>
                  <td style={td}>{d.tipo}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>{d.created_at}</td>
                  {isStaff && (
                    <td style={{ ...td, textAlign: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: d.visibile_cliente ? '#276749' : '#c00' }}>
                        {d.visibile_cliente ? 'Sì' : 'No'}
                      </span>
                    </td>
                  )}
                  {isStaff && (
                    <td style={{ ...td, textAlign: 'center' }}>
                      <DeleteDocumentoButton id={d.id} filename={d.filename} titolo={d.titolo} />
                    </td>
                  )}
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="IsDebug fs-11" style={{marginTop:8 }}>pagina revisionata</div>
    </div>
  )
}
