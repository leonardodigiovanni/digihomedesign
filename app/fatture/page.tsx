import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import FattureClient, { type Fattura, type Pagamento } from './fatture-client'

async function getData(): Promise<{ fatture: Fattura[]; pagamenti: Pagamento[] }> {
  try {
    const db = await getConnection()

    await db.execute(`
      CREATE TABLE IF NOT EXISTS fatture (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        tipo           ENUM('attiva','passiva') NOT NULL,
        numero         VARCHAR(50)   NOT NULL,
        data           DATE          NOT NULL,
        controparte    VARCHAR(200)  NOT NULL,
        importo        DECIMAL(10,2) NOT NULL DEFAULT 0,
        iva            DECIMAL(5,2)  NOT NULL DEFAULT 22,
        totale         DECIMAL(10,2) GENERATED ALWAYS AS (importo + importo * iva / 100) STORED,
        importo_pagato DECIMAL(10,2) NOT NULL DEFAULT 0,
        note           TEXT,
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    try { await db.execute('ALTER TABLE fatture ADD COLUMN importo_pagato DECIMAL(10,2) NOT NULL DEFAULT 0') } catch { /* esiste già */ }
    try { await db.execute('ALTER TABLE fatture DROP COLUMN pagata') } catch { /* non presente */ }

    await db.execute(`
      CREATE TABLE IF NOT EXISTS pagamenti_fattura (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        fattura_id INT           NOT NULL,
        data       DATE          NOT NULL,
        importo    DECIMAL(10,2) NOT NULL,
        note       VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (fattura_id) REFERENCES fatture(id) ON DELETE CASCADE
      )
    `)

    const [fattureRows] = await db.query('SELECT * FROM fatture ORDER BY data DESC, id DESC')
    const [pagamentiRows] = await db.query('SELECT * FROM pagamenti_fattura ORDER BY data ASC')

    await db.end()

    function dateToLocal(d: unknown): string {
      if (!(d instanceof Date)) return String(d ?? '')
      const yyyy = d.getFullYear()
      const mm   = String(d.getMonth() + 1).padStart(2, '0')
      const dd   = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    }

    const fatture = (fattureRows as Record<string, unknown>[]).map(r => ({
      ...r,
      data: dateToLocal(r.data),
    })) as Fattura[]

    const pagamenti = (pagamentiRows as Record<string, unknown>[]).map(r => ({
      ...r,
      data: dateToLocal(r.data),
    })) as Pagamento[]

    return { fatture, pagamenti }
  } catch {
    return { fatture: [], pagamenti: [] }
  }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 17, settings)) redirect('/')

  const { fatture, pagamenti } = await getData()

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Fatture</h2>
      <FattureClient fatture={fatture} pagamenti={pagamenti} />
    </div>
  )
}
