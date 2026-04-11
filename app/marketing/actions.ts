'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { unlink } from 'fs/promises'
import path from 'path'

async function checkAccess() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 29, settings)) redirect('/')
}

async function ensureTable() {
  const db = await getConnection()
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
  await db.end()
}

export type MutResult = { ok: true } | { ok: false; error: string }

export async function addRecord(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const tipo     = (fd.get('tipo')     as string)?.trim()
  const titolo   = (fd.get('titolo')   as string)?.trim()
  const periodo  = (fd.get('periodo')  as string)?.trim() ?? ''
  const note     = (fd.get('note')     as string)?.trim() ?? ''
  const immagine = (fd.get('immagine') as string)?.trim() || null
  const video    = (fd.get('video')    as string)?.trim() || null

  if (!tipo || !titolo) return { ok: false, error: 'Tipo e titolo sono obbligatori.' }

  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute(
      'INSERT INTO marketing (tipo, titolo, periodo, immagine, video, note) VALUES (?,?,?,?,?,?)',
      [tipo, titolo, periodo, immagine, video, note]
    )
    revalidatePath('/marketing')
    return { ok: true }
  } finally { await db.end() }
}

export async function deleteRecord(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  await ensureTable()
  const db = await getConnection()
  try {
    const [rows] = await db.query('SELECT immagine, video FROM marketing WHERE id = ?', [id])
    const rec = (rows as { immagine: string | null; video: string | null }[])[0]

    await db.execute('DELETE FROM marketing WHERE id = ?', [id])

    if (rec) {
      const dir = path.join(process.cwd(), 'public', 'uploads', 'marketing')
      for (const filename of [rec.immagine, rec.video]) {
        if (filename) await unlink(path.join(dir, filename)).catch(() => {})
      }
    }

    revalidatePath('/marketing')
    return { ok: true }
  } finally { await db.end() }
}
