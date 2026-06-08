'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getConnection } from '@/lib/db'

async function getRole() {
  const cookieStore = await cookies()
  return cookieStore.get('session_role')?.value ?? ''
}

async function ensureTable() {
  const db = await getConnection()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS avvisi (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      cliente_id INT NOT NULL,
      oggetto    VARCHAR(200) NOT NULL DEFAULT '',
      testo      TEXT NOT NULL,
      letto      TINYINT(1) NOT NULL DEFAULT 0,
      cestinato  TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.execute(`ALTER TABLE avvisi ADD COLUMN oggetto VARCHAR(200) NOT NULL DEFAULT ''`).catch(() => {})
  await db.end()
}

export async function creaAvviso(_prev: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  const role = await getRole()
  if (role !== 'admin' && role !== 'dipendente') return { error: 'Non autorizzato.' }

  const clienteIdRaw = ((fd.get('cliente_id') as string) ?? '').trim()
  const oggetto      = ((fd.get('oggetto') as string) ?? '').trim()
  const testo        = ((fd.get('testo') as string) ?? '').trim()
  if (!clienteIdRaw) return { error: 'Seleziona un cliente.' }
  if (!oggetto)      return { error: 'L\'oggetto è obbligatorio.' }
  if (!testo)        return { error: 'Il testo è obbligatorio.' }

  await ensureTable()
  const db = await getConnection()
  try {
    if (clienteIdRaw === 'all') {
      const [rows] = await db.query('SELECT id FROM clienti ORDER BY id') as [{ id: number }[], unknown]
      if (!rows.length) return { error: 'Nessun cliente trovato.' }
      for (const c of rows) {
        await db.execute('INSERT INTO avvisi (cliente_id, oggetto, testo) VALUES (?, ?, ?)', [c.id, oggetto, testo])
      }
    } else {
      const cliente_id = parseInt(clienteIdRaw) || 0
      if (!cliente_id) return { error: 'Cliente non valido.' }
      await db.execute('INSERT INTO avvisi (cliente_id, oggetto, testo) VALUES (?, ?, ?)', [cliente_id, oggetto, testo])
    }
  } finally { await db.end() }

  revalidatePath('/area-clienti/avvisi')
  return {}
}

export async function eliminaAvviso(id: number): Promise<void> {
  const role = await getRole()
  if (role !== 'admin' && role !== 'dipendente') return

  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('DELETE FROM avvisi WHERE id = ?', [id])
  } finally { await db.end() }

  revalidatePath('/area-clienti/avvisi')
}

export async function cestinaAvviso(id: number): Promise<void> {
  const role = await getRole()
  if (!role) return

  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('UPDATE avvisi SET cestinato = 1 WHERE id = ?', [id])
  } finally { await db.end() }

  revalidatePath('/area-clienti/avvisi')
}

export async function segnaLetti(ids: number[]): Promise<void> {
  if (!ids.length) return
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute(
      `UPDATE avvisi SET letto = 1 WHERE id IN (${ids.map(() => '?').join(',')})`,
      ids
    )
  } finally { await db.end() }
}
