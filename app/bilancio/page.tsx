import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import BilancioClient, { type Movimento } from './bilancio-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bilancio',
}

async function ensureTable() {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS movimenti_contabili (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        data        DATE NOT NULL,
        anno        INT NOT NULL,
        tipo        ENUM('entrata','uscita') NOT NULL,
        sezione_ce  VARCHAR(100) NOT NULL,
        sezione_sp  VARCHAR(100) NOT NULL,
        descrizione TEXT,
        importo     DECIMAL(10,2) NOT NULL,
        created_by  VARCHAR(100) NOT NULL DEFAULT '',
        created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
  } finally {
    await conn.end()
  }
}

async function getMovimenti(anno: number): Promise<Movimento[]> {
  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(
      'SELECT * FROM movimenti_contabili WHERE anno = ? ORDER BY data DESC, id DESC',
      [anno]
    ) as [Movimento[], unknown]
    return rows
  } finally {
    await conn.end()
  }
}

async function getAnni(): Promise<number[]> {
  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(
      'SELECT DISTINCT anno FROM movimenti_contabili ORDER BY anno DESC'
    ) as [{ anno: number }[], unknown]
    return rows.map(r => r.anno)
  } catch {
    return []
  } finally {
    await conn.end()
  }
}

export default async function Page({ searchParams }: { searchParams: Promise<{ anno?: string }> }) {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 18, settings)) redirect('/')

  await ensureTable()

  const params      = await searchParams
  const currentYear = new Date().getFullYear()
  const anno        = params.anno ? parseInt(params.anno) : currentYear

  const [movimenti, anniDB] = await Promise.all([
    getMovimenti(anno),
    getAnni(),
  ])

  // Garantisce che l'anno selezionato sia sempre nel selettore
  const anni = [...new Set([anno, ...anniDB, currentYear])].sort((a, b) => b - a)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Bilancio</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Conto economico e stato patrimoniale</p>
      </div>
      <BilancioClient movimenti={movimenti} anno={anno} anni={anni} role={role} />
    </div>
  )
}
