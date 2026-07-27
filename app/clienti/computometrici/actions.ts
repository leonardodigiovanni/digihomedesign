'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'

async function checkAccess() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente') redirect('/')
}

export type MutResult = { ok: true } | { ok: false; error: string }

export async function eliminaComputometrico(id: number): Promise<MutResult> {
  await checkAccess()
  if (!id) return { ok: false, error: 'ID non valido.' }

  const db = await getConnection()
  try {
    await db.execute('DELETE FROM computometrico_articoli WHERE computometrico_id = ?', [id])
    await db.execute('DELETE FROM computometrici WHERE id = ?', [id])
    revalidatePath('/clienti/computometrici')
    return { ok: true }
  } finally { await db.end() }
}

export async function associaClienteComputometrico(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const computometrico_id = parseInt(fd.get('computometrico_id') as string)
  const cliente_id        = parseInt(fd.get('cliente_id') as string) || null
  if (!computometrico_id) return { ok: false, error: 'ID non valido.' }

  const db = await getConnection()
  try {
    await db.execute('UPDATE computometrici SET cliente_id = ? WHERE id = ?', [cliente_id, computometrico_id])
    revalidatePath('/clienti/computometrici')
    revalidatePath(`/area-clienti/computometrici/${computometrico_id}`)
    return { ok: true }
  } finally { await db.end() }
}
