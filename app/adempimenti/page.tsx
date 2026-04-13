import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import AdempimentiClient, { type Adempimento } from './adempimenti-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adempimenti',
}

async function getAdempimenti(): Promise<Adempimento[]> {
  try {
    const db = await getConnection()
    await db.execute(`
      CREATE TABLE IF NOT EXISTS adempimenti (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        descrizione  VARCHAR(300) NOT NULL,
        ente         VARCHAR(150) NOT NULL DEFAULT '',
        periodo      VARCHAR(100) NOT NULL DEFAULT '',
        data_scadenza DATE NULL,
        incaricato   VARCHAR(100) NOT NULL DEFAULT '',
        stato        ENUM('da_fare','in_corso','completato','n_a') NOT NULL DEFAULT 'da_fare',
        anno         SMALLINT NOT NULL,
        ricorrente   TINYINT(1) NOT NULL DEFAULT 1,
        note         TEXT NULL,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    const [rows] = await db.query('SELECT * FROM adempimenti ORDER BY anno DESC, data_scadenza ASC, id ASC')
    await db.end()

    return (rows as Record<string, unknown>[]).map(r => ({
      ...r,
      data_scadenza: r.data_scadenza instanceof Date
        ? (() => {
            const d = r.data_scadenza as Date
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
          })()
        : (r.data_scadenza ? String(r.data_scadenza) : null),
    })) as Adempimento[]
  } catch {
    return []
  }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 22, settings)) redirect('/')

  const adempimenti = await getAdempimenti()

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Adempimenti</h2>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
        Scadenze fiscali e amministrative della SRL — promemoria ricorrente.
      </p>
      <AdempimentiClient adempimenti={adempimenti} />
    </div>
  )
}
