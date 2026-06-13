import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import DocumentiClient from './documenti-client'
import InfoCard from '@/app/app/info-card'

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 3, marginRight: 3 }}>
      <InfoCard titolo="Documenti" corpo="Consulta fatture, contratti e tutta la documentazione legata ai tuoi interventi." />
      <DocumentiClient documenti={documenti} isStaff={isStaff} />
    </div>
  )
}

