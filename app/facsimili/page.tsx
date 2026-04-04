import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import FacsimiliClient, { type Documento } from './facsimili-client'

async function getFacsimili(): Promise<Documento[]> {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS documenti_interni (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        sezione      VARCHAR(20)  NOT NULL,
        nome         VARCHAR(255) NOT NULL,
        categoria    VARCHAR(100) NOT NULL DEFAULT '',
        filename     VARCHAR(255) NOT NULL,
        mime_type    VARCHAR(100) NOT NULL DEFAULT '',
        size_bytes   INT          NOT NULL DEFAULT 0,
        uploaded_by  VARCHAR(100) NOT NULL DEFAULT '',
        created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    const [rows] = await conn.execute(
      `SELECT id, nome, categoria, filename, mime_type, size_bytes, uploaded_by, created_at
       FROM documenti_interni WHERE sezione = 'facsimile' ORDER BY categoria ASC, nome ASC`
    ) as [Documento[], unknown]
    return rows
  } finally {
    await conn.end()
  }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 34, settings)) redirect('/')

  const documenti = await getFacsimili()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Facsimili</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Modelli e template scaricabili</p>
      </div>
      <FacsimiliClient documenti={documenti} role={role} />
    </div>
  )
}
