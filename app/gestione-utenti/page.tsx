import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import GestioneUtentiClient from './gestione-utenti-client'

export default async function Page() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')

  const conn = await getConnection()
  // Migrazione: aggiunge colonne se non esistono
  try { await conn.execute('ALTER TABLE users ADD COLUMN cantieri_visibili TINYINT(1) NOT NULL DEFAULT 1') } catch { /* esiste già */ }
  try { await conn.execute('ALTER TABLE users ADD COLUMN miei_ordini_visibili TINYINT(1) NOT NULL DEFAULT 1') } catch { /* esiste già */ }

  let users: { username: string; nome: string; cognome: string; email: string; cellulare: string; role: string; is_active: number; cantieri_visibili: number; miei_ordini_visibili: number }[] = []
  try {
    const [rows] = await conn.execute(
      'SELECT username, nome, cognome, email, cellulare, role, is_active, cantieri_visibili, miei_ordini_visibili FROM users ORDER BY role, username'
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
