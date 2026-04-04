import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import MagazzinoClient, { type Materiale } from './magazzino-client'

async function getMateriali(): Promise<Materiale[]> {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS magazzino (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        descrizione     VARCHAR(255) NOT NULL,
        produttore      VARCHAR(100) NOT NULL,
        modello         VARCHAR(100) NOT NULL,
        costo_unitario  DECIMAL(10,2) NOT NULL,
        tipo_unita      VARCHAR(50)  NOT NULL,
        colore          VARCHAR(100) NOT NULL DEFAULT '',
        giacenza        DECIMAL(10,2) NOT NULL DEFAULT 0,
        totale_caricato DECIMAL(10,2) NOT NULL DEFAULT 0,
        created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    // migrazione: aggiunge colore se la tabella esisteva già senza (compatibile MySQL 5.7+)
    const [cols] = await conn.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'magazzino' AND COLUMN_NAME = 'colore'`
    ) as [{ COLUMN_NAME: string }[], unknown]
    if (cols.length === 0) {
      await conn.execute(`ALTER TABLE magazzino ADD COLUMN colore VARCHAR(100) NOT NULL DEFAULT ''`)
    }
    const [rows] = await conn.execute(
      'SELECT id, descrizione, produttore, modello, costo_unitario, tipo_unita, colore, giacenza, totale_caricato, created_at FROM magazzino ORDER BY descrizione ASC'
    ) as [Materiale[], unknown]
    return rows
  } finally {
    await conn.end()
  }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 16, settings)) redirect('/')

  const materiali = await getMateriali()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Magazzino</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Gestione materiali e giacenze</p>
      </div>
      <MagazzinoClient materiali={materiali} role={role} />
    </div>
  )
}
