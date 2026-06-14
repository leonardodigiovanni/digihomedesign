import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import CompletaForm from './completa-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Completa il profilo' }

export default async function Page() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value
  const role     = cookieStore.get('session_role')?.value
  if (!username || role !== 'cliente') redirect('/app/login')

  const db = await getConnection()
  let user = { username, nome: '', cognome: '', email: '', cellulare: '' }
  try {
    const [rows] = await db.execute(
      'SELECT nome, cognome, email, cellulare FROM users WHERE username = ? LIMIT 1', [username]
    ) as [{ nome: string; cognome: string; email: string; cellulare: string }[], unknown]
    const r = rows[0]
    if (r) user = { username, nome: r.nome ?? '', cognome: r.cognome ?? '', email: r.email ?? '', cellulare: r.cellulare ?? '' }
  } finally {
    await db.end()
  }

  return (
    <div style={{ marginLeft: 3, marginRight: 3, paddingBottom: 80 }}>
      <CompletaForm user={user} />
    </div>
  )
}
