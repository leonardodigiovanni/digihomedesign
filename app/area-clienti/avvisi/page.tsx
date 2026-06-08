import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import { NuovoAvvisoForm, AvvisiStaff, AvvisiCliente, type Avviso } from './avvisi-client'

export const metadata: Metadata = { title: 'Avvisi' }

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export default async function Page() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const isStaff = role === 'admin' || role === 'dipendente'

  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS avvisi (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT NOT NULL,
        oggetto    VARCHAR(200) NOT NULL DEFAULT '',
        testo      TEXT NOT NULL,
        letto      TINYINT(1) NOT NULL DEFAULT 0,
        cestinato  TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await db.execute(`ALTER TABLE avvisi ADD COLUMN oggetto VARCHAR(200) NOT NULL DEFAULT ''`).catch(() => {})

    let avvisi: Avviso[] = []

    if (isStaff) {
      const [rows] = await db.query(`
        SELECT a.id, a.cliente_id, a.oggetto, a.testo, a.letto, a.cestinato, a.created_at, COALESCE(NULLIF(c.ragione_sociale,''), CONCAT(c.cognome,' ',c.nome)) AS cliente_nome
        FROM avvisi a LEFT JOIN clienti c ON c.id = a.cliente_id
        ORDER BY a.created_at DESC
      `) as [Record<string, unknown>[], unknown]
      avvisi = (rows as Record<string, unknown>[]).map(r => ({ ...r, created_at: dateToLocal(r.created_at) })) as Avviso[]
    } else {
      const [uRows] = await db.execute('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const email = uRows[0]?.email ?? ''
      if (!email) return <p>Utente non trovato.</p>
      const [cRows] = await db.execute('SELECT id FROM clienti WHERE email = ? LIMIT 1', [email]) as [{ id: number }[], unknown]
      const clienteId = cRows[0]?.id ?? null
      if (clienteId) {
        const [rows] = await db.query(
          `SELECT a.*, '' AS cliente_nome FROM avvisi a WHERE a.cliente_id = ? AND a.cestinato = 0 ORDER BY a.created_at DESC`,
          [clienteId]
        ) as [Record<string, unknown>[], unknown]
        avvisi = (rows as Record<string, unknown>[]).map(r => ({ ...r, created_at: dateToLocal(r.created_at) })) as Avviso[]
      }
    }

    const clienti = isStaff ? await (async () => {
      const [cr] = await db.query(
        `SELECT id, COALESCE(NULLIF(ragione_sociale,''), CONCAT(cognome,' ',nome)) AS label FROM clienti ORDER BY label`
      ) as [{ id: number; label: string }[], unknown]
      return (cr as { id: number; label: string }[]).map(c => ({ id: c.id, label: c.label }))
    })() : []

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <h2 className="effetto-3d" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Avvisi</h2>
          {isStaff && (
            <p style={{ color: '#000', fontSize: 14, margin: '4px 0 0' }}>Tutti gli avvisi inviati ai clienti.</p>
          )}
        </div>

        {isStaff && <NuovoAvvisoForm clienti={clienti} />}
        {isStaff
          ? <AvvisiStaff avvisi={avvisi} clienti={clienti} />
          : <AvvisiCliente avvisi={avvisi} />
        }
        <div className="IsDebug fs-11" style={{marginTop:8}}>pagina revisionata</div>
      </div>
    )
  } finally {
    await db.end()
  }
}
