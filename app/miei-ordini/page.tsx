import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import MieiOrdiniClient, { type OrdineCliente } from './client'

async function getMieiOrdini(username: string): Promise<OrdineCliente[]> {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS ordini_ricevuti (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        numero_ordine  VARCHAR(50)   NOT NULL DEFAULT '',
        cliente        VARCHAR(100)  NOT NULL,
        descrizione    TEXT          NOT NULL,
        stato          VARCHAR(20)   NOT NULL DEFAULT 'nuovo',
        totale         DECIMAL(10,2) NOT NULL DEFAULT 0,
        data_ordine    DATE          NOT NULL,
        created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    const [rows] = await conn.execute(
      'SELECT id,numero_ordine,cliente,descrizione,stato,totale,data_ordine,created_at FROM ordini_ricevuti WHERE cliente=? ORDER BY data_ordine DESC',
      [username]
    ) as [OrdineCliente[], unknown]
    return rows
  } finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 30, settings)) redirect('/')

  const ordini = await getMieiOrdini(username)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>I Miei Ordini</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Riepilogo degli ordini associati al tuo account</p>
      </div>
      <MieiOrdiniClient ordini={ordini} />
    </div>
  )
}
