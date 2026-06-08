'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getConnection } from '@/lib/db'
import { unlink } from 'fs/promises'
import path from 'path'

async function assertStaff() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente') throw new Error('Non autorizzato')
}

export async function uploadDocumento(_prev: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  try {
    await assertStaff()

    const file      = formData.get('file') as File | null
    const clienteId = formData.get('cliente_id') as string | null
    const titolo    = (formData.get('titolo') as string | null)?.trim() ?? ''
    const tipo      = (formData.get('tipo') as string | null)?.trim() || 'generico'
    const note      = (formData.get('note') as string | null)?.trim() || null
    const visibile  = formData.get('visibile_cliente') === '1' ? 1 : 0

    if (!file || file.size === 0) return { error: 'Seleziona un file.' }
    if (!titolo) return { error: 'Il titolo è obbligatorio.' }

    const uploadForm = new FormData()
    uploadForm.set('file', file)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/upload-documento`, {
      method: 'POST',
      body: uploadForm,
    })
    const json = await res.json() as { filename?: string; error?: string }
    if (!res.ok || !json.filename) return { error: json.error ?? 'Errore upload file.' }

    const conn = await getConnection()
    try {
      await conn.execute(
        `INSERT INTO documenti_cliente (cliente_id, titolo, tipo, filename, note, visibile_cliente)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [clienteId ? Number(clienteId) : null, titolo, tipo, json.filename, note, visibile]
      )
    } finally {
      await conn.end()
    }

    revalidatePath('/clienti/documenti')
    return {}
  } catch (e) {
    console.error(e)
    return { error: 'Errore durante il caricamento.' }
  }
}

export async function deleteDocumento(id: number, filename: string): Promise<{ error?: string }> {
  try {
    await assertStaff()

    const conn = await getConnection()
    try {
      await conn.execute('DELETE FROM documenti_cliente WHERE id = ?', [id])
    } finally {
      await conn.end()
    }

    try {
      await unlink(path.join(process.cwd(), 'public', 'uploads', 'documenti', filename))
    } catch {
      // file già assente su disco — non bloccante
    }

    revalidatePath('/clienti/documenti')
    return {}
  } catch (e) {
    console.error(e)
    return { error: 'Errore durante l\'eliminazione.' }
  }
}

export async function updateVisibileDocumento(id: number, visibile: boolean): Promise<void> {
  await assertStaff()
  const conn = await getConnection()
  try {
    await conn.execute('UPDATE documenti_cliente SET visibile_cliente = ? WHERE id = ?', [visibile ? 1 : 0, id])
  } finally {
    await conn.end()
  }
  revalidatePath('/clienti/documenti')
}

export async function updateClienteDocumento(id: number, clienteId: number | null): Promise<void> {
  await assertStaff()
  const conn = await getConnection()
  try {
    await conn.execute('UPDATE documenti_cliente SET cliente_id = ? WHERE id = ?', [clienteId, id])
  } finally {
    await conn.end()
  }
  revalidatePath('/clienti/documenti')
}
