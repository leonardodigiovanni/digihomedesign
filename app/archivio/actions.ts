'use server'

import fs from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'documenti')
const MAX_SIZE = 20 * 1024 * 1024 // 20 MB

function ensureDir() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export type UploadResult =
  | { ok: true }
  | { ok: false; error: string }

export type DeleteResult =
  | { ok: true }
  | { ok: false; error: string }

export async function uploadDocumento(
  _prev: UploadResult | null,
  formData: FormData
): Promise<UploadResult> {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const user = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const nome      = (formData.get('nome') as string)?.trim()
  const categoria = (formData.get('categoria') as string)?.trim()
  const file      = formData.get('file') as File | null

  if (!nome || !categoria) return { ok: false, error: 'Nome e categoria sono obbligatori.' }
  if (!file || file.size === 0) return { ok: false, error: 'Seleziona un file.' }
  if (file.size > MAX_SIZE) return { ok: false, error: 'File troppo grande (max 20 MB).' }

  ensureDir()

  const ext      = path.extname(file.name)
  const base     = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_\-\.]/g, '_').slice(0, 80)
  const filename = `${Date.now()}_${base}${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)

  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(filepath, buffer)

  const conn = await getConnection()
  try {
    await conn.execute(
      `INSERT INTO documenti_interni (sezione, nome, categoria, filename, mime_type, size_bytes, uploaded_by)
       VALUES ('archivio', ?, ?, ?, ?, ?, ?)`,
      [nome, categoria, filename, file.type || 'application/octet-stream', file.size, user]
    )
    return { ok: true }
  } catch {
    fs.unlinkSync(filepath)
    return { ok: false, error: 'Errore durante il salvataggio.' }
  } finally {
    await conn.end()
  }
}

export async function deleteDocumento(
  _prev: DeleteResult | null,
  formData: FormData
): Promise<DeleteResult> {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') return { ok: false, error: 'Solo gli admin possono eliminare.' }

  const id = parseInt(formData.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(
      `SELECT filename FROM documenti_interni WHERE id = ? AND sezione = 'archivio'`, [id]
    ) as [{ filename: string }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Documento non trovato.' }

    await conn.execute('DELETE FROM documenti_interni WHERE id = ?', [id])

    const filepath = path.join(UPLOAD_DIR, rows[0].filename)
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath)

    return { ok: true }
  } catch {
    return { ok: false, error: 'Errore durante l\'eliminazione.' }
  } finally {
    await conn.end()
  }
}
