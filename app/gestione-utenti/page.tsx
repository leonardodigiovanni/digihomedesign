import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import GestioneUtentiClient from './gestione-utenti-client'

export default async function Page() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')

  const conn = await getConnection()
  let users: { username: string; nome: string; cognome: string; email: string; cellulare: string; role: string; is_active: number }[] = []
  try {
    const [rows] = await conn.execute(
      'SELECT username, nome, cognome, email, cellulare, role, is_active FROM users ORDER BY role, username'
    )
    users = rows as typeof users
  } finally {
    await conn.end()
  }

  const currentUser = cookieStore.get('session_user')?.value ?? ''

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Gestione Utenti</h2>
      <GestioneUtentiClient users={users} currentUser={currentUser} />
    </div>
  )
}
