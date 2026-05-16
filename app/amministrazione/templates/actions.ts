'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') redirect('/')
}

export type MutResult = { ok: true } | { ok: false; error: string }

export async function salvaTemplate(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAdmin()

  const id   = parseInt(fd.get('id') as string) || null
  const nome = ((fd.get('nome') as string) ?? '').trim()
  const html = ((fd.get('html') as string) ?? '').trim()

  if (!nome) return { ok: false, error: 'Il nome è obbligatorio.' }
  if (!html) return { ok: false, error: 'Il template non può essere vuoto.' }

  const db = await getConnection()
  try {
    if (id) {
      await db.execute('UPDATE preventivo_templates SET nome = ?, html = ? WHERE id = ?', [nome, html, id])
    } else {
      await db.execute('INSERT INTO preventivo_templates (nome, html) VALUES (?,?)', [nome, html])
    }
    revalidatePath('/amministrazione/templates')
    return { ok: true }
  } finally {
    await db.end()
  }
}

export async function toggleAttivoTemplate(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAdmin()
  const id = parseInt(fd.get('id') as string)
  if (!id) return { ok: false, error: 'ID non valido.' }
  const db = await getConnection()
  try {
    await db.execute('UPDATE preventivo_templates SET attivo = 1 - attivo WHERE id = ?', [id])
    revalidatePath('/amministrazione/templates')
    return { ok: true }
  } finally {
    await db.end()
  }
}

export async function eliminaTemplate(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAdmin()
  const id = parseInt(fd.get('id') as string)
  if (!id) return { ok: false, error: 'ID non valido.' }
  const db = await getConnection()
  try {
    await db.execute('DELETE FROM preventivo_templates WHERE id = ?', [id])
    revalidatePath('/amministrazione/templates')
    return { ok: true }
  } finally {
    await db.end()
  }
}

export async function salvaDisegnoTemplate(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAdmin()
  const tipo = ((fd.get('tipo') as string) ?? '').trim()
  const html = ((fd.get('html') as string) ?? '').trim()
  if (!tipo) return { ok: false, error: 'Tipo non valido.' }
  if (!html) return { ok: false, error: 'Il template non può essere vuoto.' }
  const db = await getConnection()
  try {
    await db.execute(
      'UPDATE preventivo_templates SET html = ? WHERE tipo = ?',
      [html, tipo]
    )
    revalidatePath('/amministrazione/templates')
    return { ok: true }
  } finally {
    await db.end()
  }
}
