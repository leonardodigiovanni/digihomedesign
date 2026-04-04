import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import OrdiniForniClient, { type OrdineFornitore } from './client'

async function getOrdini(): Promise<OrdineFornitore[]> {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS ordini_fornitori (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        numero_ordine  VARCHAR(50)   NOT NULL DEFAULT '',
        fornitore      VARCHAR(255)  NOT NULL,
        descrizione    TEXT          NOT NULL,
        stato          VARCHAR(20)   NOT NULL DEFAULT 'bozza',
        totale         DECIMAL(10,2) NOT NULL DEFAULT 0,
        data_ordine    DATE          NOT NULL,
        created_by     VARCHAR(100)  NOT NULL DEFAULT '',
        created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    const [rows] = await conn.execute(
      'SELECT id,numero_ordine,fornitore,descrizione,stato,totale,data_ordine,created_by,created_at FROM ordini_fornitori ORDER BY data_ordine DESC'
    ) as [OrdineFornitore[], unknown]
    return rows
  } finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 26, settings)) redirect('/')

  const ordini = await getOrdini()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Ordini a Fornitori</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Gestione ordini inviati ai fornitori</p>
      </div>
      <OrdiniForniClient ordini={ordini} role={role} />
    </div>
  )
}
