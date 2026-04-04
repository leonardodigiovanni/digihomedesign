import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import OrdiniRicevutiClient, { type OrdineRicevuto, type Nota } from './client'

async function initTables(conn: Awaited<ReturnType<typeof import('@/lib/db').getConnection>>) {
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
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS ordini_note (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      ordine_id  INT          NOT NULL,
      testo      TEXT         NOT NULL,
      autore     VARCHAR(100) NOT NULL,
      created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

async function getOrdini(): Promise<OrdineRicevuto[]> {
  const conn = await getConnection()
  try {
    await initTables(conn)
    const [ordini] = await conn.execute(
      'SELECT id,numero_ordine,cliente,descrizione,stato,totale,data_ordine,created_at FROM ordini_ricevuti ORDER BY data_ordine DESC'
    ) as [Omit<OrdineRicevuto,'note'>[], unknown]
    const [note] = await conn.execute(
      'SELECT id,ordine_id,testo,autore,created_at FROM ordini_note ORDER BY created_at ASC'
    ) as [({ ordine_id: number } & Nota)[], unknown]

    const noteMap: Record<number, Nota[]> = {}
    for (const n of note) {
      if (!noteMap[n.ordine_id]) noteMap[n.ordine_id] = []
      noteMap[n.ordine_id].push({ id: n.id, testo: n.testo, autore: n.autore, created_at: n.created_at })
    }
    return ordini.map(o => ({ ...o, note: noteMap[o.id] ?? [] }))
  } finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 35, settings)) redirect('/')

  const ordini = await getOrdini()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Ordini Ricevuti</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Ordini ricevuti dai clienti — clicca una riga per le note interne</p>
      </div>
      <OrdiniRicevutiClient ordini={ordini} role={role} />
    </div>
  )
}
