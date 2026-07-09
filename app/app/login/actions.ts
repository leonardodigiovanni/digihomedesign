'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { readSettings } from '@/lib/settings'

const COOKIE_OPTS = { httpOnly: true, path: '/', maxAge: 30 * 24 * 60 * 60, sameSite: 'lax' } as const

export async function appLogin(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) return 'Inserisci username e password'

  const conn = await getConnection()
  let role: string | null = null
  let profiloIncompleto = false
  try {
    const [rows] = await conn.execute(
      'SELECT username, role, nome, cognome, email FROM users WHERE username = ? AND password = ? AND is_active = 1',
      [username, password]
    )
    const users = rows as { username: string; role: string; nome: string; cognome: string; email: string }[]
    if (users.length === 0) return 'Credenziali non valide'
    role = users[0].role
    if (role === 'cliente') {
      profiloIncompleto = !users[0].nome || !users[0].cognome || !users[0].email
    }
  } finally {
    await conn.end()
  }

  const bypassManutenzione = role === 'cliente' && username === 'Diggio83'

  if (role !== 'admin' && !bypassManutenzione) {
    const { loginClientiDisabilitato, loginDipendentiDisabilitato, manutenzione } = await readSettings()
    if (manutenzione) return 'Sito in manutenzione — accesso riservato agli amministratori.'
    if (role === 'cliente' && loginClientiDisabilitato) return 'Il login per i clienti è temporaneamente disabilitato.'
    if (role !== 'cliente' && loginDipendentiDisabilitato) return 'Il login per i dipendenti è temporaneamente disabilitato.'
  }

  const cookieStore = await cookies()
  cookieStore.set('session_user', username, COOKIE_OPTS)
  cookieStore.set('session_role', role!, COOKIE_OPTS)
  if (profiloIncompleto) {
    cookieStore.set('profilo_incompleto', '1', { httpOnly: true, path: '/', sameSite: 'lax' })
    redirect('/app/completa-profilo')
  } else {
    cookieStore.delete('profilo_incompleto')
    redirect('/app')
  }
}

export async function appLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('session_user')
  cookieStore.delete('session_role')
  redirect('/app/login')
}
