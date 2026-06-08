'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'

async function ensureTables() {
  const db = await getConnection()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS preventivi (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      numero           VARCHAR(50)   NOT NULL DEFAULT '',
      cliente_id       INT           NULL,
      descrizione      TEXT          NULL,
      stato            ENUM('bozza','inviato','accettato','rifiutato','scaduto') NOT NULL DEFAULT 'bozza',
      importo          DECIMAL(10,2) NOT NULL DEFAULT 0,
      data             DATE          NOT NULL,
      validita_giorni  INT           NOT NULL DEFAULT 5,
      note             TEXT          NULL,
      visibile_cliente TINYINT(1)    NOT NULL DEFAULT 1,
      created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.execute(`ALTER TABLE preventivi ADD COLUMN creato_da VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
  await db.end()
}

export async function creaPreventivo() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!username) redirect('/app/login')

  await ensureTables()
  const db = await getConnection()
  const today = new Date().toISOString().slice(0, 10)

  let cliente_id: number | null = null
  const [uRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
  const email = uRows[0]?.email ?? ''
  if (email) {
    const [cRows] = await db.query('SELECT id FROM clienti WHERE email = ? LIMIT 1', [email]) as [{ id: number }[], unknown]
    cliente_id = cRows[0]?.id ?? null
  }

  const [result] = await db.execute(
    'INSERT INTO preventivi (numero, descrizione, stato, importo, data, validita_giorni, cliente_id, creato_da) VALUES (?,?,?,?,?,?,?,?)',
    ['', 'Nuovo preventivo', 'bozza', 0, today, 5, cliente_id, role === 'cliente' ? username : null]
  ) as [{ insertId: number }, unknown]
  const id = result.insertId
  const dateStr = today.replace(/-/g, '')
  const numero = `${dateStr}-${String(id).padStart(6, '0')}`
  await db.execute('UPDATE preventivi SET numero = ? WHERE id = ?', [numero, id])
  await db.end()

  redirect(`/app/preventivo/${id}`)
}
