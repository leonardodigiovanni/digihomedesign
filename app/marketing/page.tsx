import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import MarketingClient, { type Record_ } from './marketing-client'

async function getData(): Promise<Record_[]> {
  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS marketing (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        tipo       VARCHAR(100) NOT NULL,
        titolo     VARCHAR(200) NOT NULL,
        periodo    VARCHAR(100) NOT NULL DEFAULT '',
        immagine   VARCHAR(255) NULL,
        video      VARCHAR(255) NULL,
        note       TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    const [rows] = await db.query(
      'SELECT id, tipo, titolo, periodo, immagine, video, note, created_at FROM marketing ORDER BY created_at DESC'
    )
    return (rows as Record<string, unknown>[]).map(r => ({
      ...r,
      created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? ''),
    })) as Record_[]
  } finally {
    await db.end()
  }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''

  if (!role) redirect('/')
  const settings = readSettings()
  if (!hasPageAccess(role, 29, settings)) redirect('/')

  const records = await getData()

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Marketing</h2>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
        Registro delle campagne e azioni di marketing.
      </p>
      <MarketingClient records={records} />
    </div>
  )
}
