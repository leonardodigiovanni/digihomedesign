'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const GESTORI = ['admin', 'direttore']

async function getRole() {
  const cookieStore = await cookies()
  return cookieStore.get('session_role')?.value ?? ''
}
async function getUser() {
  const cookieStore = await cookies()
  return cookieStore.get('session_user')?.value ?? ''
}

async function ensureTable() {
  const db = await getConnection()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS worklist (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      titolo        VARCHAR(200) NOT NULL,
      descrizione   TEXT NULL,
      assegnato_a   VARCHAR(100) NOT NULL,
      creato_da     VARCHAR(100) NOT NULL,
      priorita      ENUM('bassa','normale','alta','urgente') NOT NULL DEFAULT 'normale',
      stato         ENUM('da_fare','in_corso','completato') NOT NULL DEFAULT 'da_fare',
      data_scadenza DATE NULL,
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.end()
}

export type MutResult = { ok: true } | { ok: false; error: string }

export async function addCompito(_: MutResult | null, fd: FormData): Promise<MutResult> {
  const role = await getRole()
  if (!GESTORI.includes(role)) redirect('/')
  const user = await getUser()

  const titolo       = (fd.get('titolo')        as string)?.trim()
  const descrizione  = (fd.get('descrizione')   as string)?.trim() ?? ''
  const assegnato_a  = (fd.get('assegnato_a')   as string)?.trim()
  const priorita     = (fd.get('priorita')      as string) ?? 'normale'
  const data_scad    = (fd.get('data_scadenza') as string)?.trim() || null

  if (!titolo || !assegnato_a) return { ok: false, error: 'Titolo e assegnatario sono obbligatori.' }

  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute(
      'INSERT INTO worklist (titolo, descrizione, assegnato_a, creato_da, priorita, data_scadenza) VALUES (?,?,?,?,?,?)',
      [titolo, descrizione, assegnato_a, user, priorita, data_scad]
    )
    revalidatePath('/worklist')
    return { ok: true }
  } finally { await db.end() }
}

export async function updateStato(_: MutResult | null, fd: FormData): Promise<MutResult> {
  const role = await getRole()
  const user = await getUser()
  if (!role) redirect('/')

  const id    = parseInt(fd.get('id') as string)
  const stato = (fd.get('stato') as string)?.trim()
  const STATI = ['da_fare', 'in_corso', 'completato']
  if (isNaN(id) || !STATI.includes(stato)) return { ok: false, error: 'Dati non validi.' }

  await ensureTable()
  const db = await getConnection()
  try {
    // I gestori aggiornano qualsiasi compito; gli altri solo i propri
    if (GESTORI.includes(role)) {
      await db.execute('UPDATE worklist SET stato = ? WHERE id = ?', [stato, id])
    } else {
      const [res] = await db.execute(
        'UPDATE worklist SET stato = ? WHERE id = ? AND assegnato_a = ?', [stato, id, user]
      ) as [{ affectedRows: number }, unknown]
      if (res.affectedRows === 0) return { ok: false, error: 'Non autorizzato.' }
    }
    revalidatePath('/worklist')
    return { ok: true }
  } finally { await db.end() }
}

export async function deleteCompito(_: MutResult | null, fd: FormData): Promise<MutResult> {
  const role = await getRole()
  if (!GESTORI.includes(role)) return { ok: false, error: 'Non autorizzato.' }

  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('DELETE FROM worklist WHERE id = ?', [id])
    revalidatePath('/worklist')
    return { ok: true }
  } finally { await db.end() }
}
