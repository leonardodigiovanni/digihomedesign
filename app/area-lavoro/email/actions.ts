'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'

export type MarkReadResult = { ok: true } | { ok: false; error: string }

export async function markRead(id: number): Promise<MarkReadResult> {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'email') {
    redirect('/')
  }

  const conn = await getConnection()
  try {
    await conn.execute('UPDATE email_inbox SET letto = 1 WHERE id = ?', [id])
    return { ok: true }
  } finally {
    await conn.end()
  }
}

export type AttivaUtenteResult = { ok: true } | { ok: false; error: string }

export async function attivaUtente(username: string): Promise<AttivaUtenteResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') {
    redirect('/')
  }

  const conn = await getConnection()
  try {
    const [res] = await conn.execute(
      'UPDATE users SET is_active = 1 WHERE username = ?',
      [username]
    ) as [{ affectedRows: number }, unknown]
    if (res.affectedRows === 0) return { ok: false, error: 'Utente non trovato.' }
    return { ok: true }
  } finally {
    await conn.end()
  }
}
