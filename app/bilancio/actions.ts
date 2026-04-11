'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getConnection } from '@/lib/db'

const ALLOWED_ROLES = ['commercialista', 'admin']

async function checkAuth() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!ALLOWED_ROLES.includes(role)) throw new Error('Non autorizzato.')
  return { role, username }
}

async function ensureTable(conn: Awaited<ReturnType<typeof getConnection>>) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS movimenti_contabili (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      data        DATE NOT NULL,
      anno        INT NOT NULL,
      tipo        ENUM('entrata','uscita') NOT NULL,
      sezione_ce  VARCHAR(100) NOT NULL,
      sezione_sp  VARCHAR(100) NOT NULL,
      descrizione TEXT,
      importo     DECIMAL(10,2) NOT NULL,
      created_by  VARCHAR(100) NOT NULL DEFAULT '',
      created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export type AddMovimentoResult =
  | { ok: true }
  | { ok: false; error: string }

export async function addMovimento(
  _prev: AddMovimentoResult | null,
  formData: FormData
): Promise<AddMovimentoResult> {
  let username: string
  try {
    const auth = await checkAuth()
    username = auth.username
  } catch {
    redirect('/')
  }

  const data        = (formData.get('data') as string)?.trim()
  const tipo        = (formData.get('tipo') as string)?.trim() as 'entrata' | 'uscita'
  const sezione_ce  = (formData.get('sezione_ce') as string)?.trim()
  const sezione_sp  = (formData.get('sezione_sp') as string)?.trim()
  const descrizione = (formData.get('descrizione') as string)?.trim() ?? ''
  const importoStr  = (formData.get('importo') as string)?.trim()

  if (!data || !tipo || !sezione_ce || !sezione_sp || !importoStr) {
    return { ok: false, error: 'Compila tutti i campi obbligatori.' }
  }

  const importo = parseFloat(importoStr)
  if (isNaN(importo) || importo <= 0) return { ok: false, error: 'Importo non valido.' }

  const anno = new Date(data).getFullYear()

  const conn = await getConnection()
  try {
    await ensureTable(conn)
    await conn.execute(
      `INSERT INTO movimenti_contabili (data, anno, tipo, sezione_ce, sezione_sp, descrizione, importo, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [data, anno, tipo, sezione_ce, sezione_sp, descrizione, importo, username]
    )
    revalidatePath('/bilancio')
    return { ok: true }
  } catch {
    return { ok: false, error: 'Errore durante il salvataggio.' }
  } finally {
    await conn.end()
  }
}

export type DeleteMovimentoResult =
  | { ok: true }
  | { ok: false; error: string }

export async function deleteMovimento(
  _prev: DeleteMovimentoResult | null,
  formData: FormData
): Promise<DeleteMovimentoResult> {
  try {
    await checkAuth()
  } catch {
    redirect('/')
  }

  const id = parseInt(formData.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  const conn = await getConnection()
  try {
    await conn.execute('DELETE FROM movimenti_contabili WHERE id = ?', [id])
    revalidatePath('/bilancio')
    return { ok: true }
  } catch {
    return { ok: false, error: "Errore durante l'eliminazione." }
  } finally {
    await conn.end()
  }
}
