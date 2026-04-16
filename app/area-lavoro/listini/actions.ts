'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'

async function checkAccess() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 25, settings)) redirect('/')
}

async function ensureTable() {
  const db = await getConnection()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS listini (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      categoria        VARCHAR(100) NOT NULL,
      produttore       VARCHAR(100) NOT NULL DEFAULT '',
      descrizione      VARCHAR(300) NOT NULL,
      unita            VARCHAR(30)  NOT NULL,
      prezzo_acquisto  DECIMAL(10,2) NOT NULL DEFAULT 0,
      prezzo_vendita   DECIMAL(10,2) NOT NULL DEFAULT 0,
      note             TEXT NULL,
      disponibile      TINYINT(1) NOT NULL DEFAULT 1,
      created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
  await db.execute(`ALTER TABLE listini ADD COLUMN disponibile TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
  await db.end()
}

export type MutResult = { ok: true } | { ok: false; error: string }

export async function addArticolo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const categoria       = (fd.get('categoria')       as string)?.trim()
  const produttore      = (fd.get('produttore')      as string)?.trim() ?? ''
  const descrizione     = (fd.get('descrizione')     as string)?.trim()
  const unita           = (fd.get('unita')           as string)?.trim()
  const prezzo_acquisto = parseFloat((fd.get('prezzo_acquisto') as string) ?? '0')
  const prezzo_vendita  = parseFloat((fd.get('prezzo_vendita')  as string) ?? '0')
  const note            = (fd.get('note')            as string)?.trim() ?? ''

  if (!categoria || !descrizione || !unita)
    return { ok: false, error: 'Categoria, descrizione e unità sono obbligatori.' }

  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute(
      'INSERT INTO listini (categoria, produttore, descrizione, unita, prezzo_acquisto, prezzo_vendita, note) VALUES (?,?,?,?,?,?,?)',
      [categoria, produttore, descrizione, unita, prezzo_acquisto, prezzo_vendita, note]
    )
    revalidatePath('/listini')
    return { ok: true }
  } finally { await db.end() }
}

export async function updateArticolo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const id              = parseInt(fd.get('id') as string)
  const categoria       = (fd.get('categoria')       as string)?.trim()
  const produttore      = (fd.get('produttore')      as string)?.trim() ?? ''
  const descrizione     = (fd.get('descrizione')     as string)?.trim()
  const unita           = (fd.get('unita')           as string)?.trim()
  const prezzo_acquisto = parseFloat((fd.get('prezzo_acquisto') as string) ?? '0')
  const prezzo_vendita  = parseFloat((fd.get('prezzo_vendita')  as string) ?? '0')
  const note            = (fd.get('note')            as string)?.trim() ?? ''

  if (isNaN(id) || !categoria || !descrizione || !unita)
    return { ok: false, error: 'Dati non validi.' }

  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute(
      'UPDATE listini SET categoria=?, produttore=?, descrizione=?, unita=?, prezzo_acquisto=?, prezzo_vendita=?, note=? WHERE id=?',
      [categoria, produttore, descrizione, unita, prezzo_acquisto, prezzo_vendita, note, id]
    )
    revalidatePath('/listini')
    return { ok: true }
  } finally { await db.end() }
}

export async function toggleDisponibile(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('UPDATE listini SET disponibile = 1 - disponibile WHERE id=?', [id])
    revalidatePath('/listini')
    return { ok: true }
  } finally { await db.end() }
}

export async function deleteArticolo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('DELETE FROM listini WHERE id=?', [id])
    revalidatePath('/listini')
    return { ok: true }
  } finally { await db.end() }
}
