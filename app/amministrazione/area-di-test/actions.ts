'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')
}

export async function aggiungiAPreventivo2(articolo2_id: number): Promise<{ ok: boolean; error?: string }> {
  await checkAdmin()
  const db = await getConnection()
  try {
    await db.execute('INSERT INTO preventivo2 (articolo2_id) VALUES (?)', [articolo2_id])
    revalidatePath('/amministrazione/area-di-test')
    return { ok: true }
  } catch {
    return { ok: false, error: 'Errore inserimento.' }
  } finally {
    await db.end()
  }
}

export async function eliminaDaPreventivo2(id: number): Promise<{ ok: boolean }> {
  await checkAdmin()
  const db = await getConnection()
  try {
    await db.execute('DELETE FROM preventivo2 WHERE id = ?', [id])
    revalidatePath('/amministrazione/area-di-test')
    return { ok: true }
  } finally {
    await db.end()
  }
}
