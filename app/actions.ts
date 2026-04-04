'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { readSettings } from '@/lib/settings'

const COOKIE_OPTS = { httpOnly: true, path: '/' } as const

export async function login(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) return 'Inserisci username e password'

  const conn = await getConnection()
  let role: string | null = null
  try {
    const [rows] = await conn.execute(
      'SELECT username, role FROM users WHERE username = ? AND password = ? AND is_active = 1',
      [username, password]
    )
    const users = rows as { username: string; role: string }[]
    if (users.length === 0) return 'Credenziali non valide'
    role = users[0].role
  } finally {
    await conn.end()
  }

  if (role !== 'admin') {
    const { loginClientiDisabilitato, loginDipendentiDisabilitato } = readSettings()
    if (role === 'cliente' && loginClientiDisabilitato) {
      return 'Il login per i clienti è temporaneamente disabilitato.'
    }
    if (role !== 'cliente' && loginDipendentiDisabilitato) {
      return 'Il login per i dipendenti è temporaneamente disabilitato.'
    }
  }

  const cookieStore = await cookies()
  cookieStore.set('session_user', username, COOKIE_OPTS)
  cookieStore.set('session_role', role!, COOKIE_OPTS)
  redirect('/')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session_user')
  cookieStore.delete('session_role')
  redirect('/')
}

export async function refreshSession() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value
  const role = cookieStore.get('session_role')?.value
  if (username) cookieStore.set('session_user', username, COOKIE_OPTS)
  if (role)     cookieStore.set('session_role', role,     COOKIE_OPTS)
}
