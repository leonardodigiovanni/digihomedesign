import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import EmailClient from './email-client'

type Messaggio = {
  id: number
  tipo: string
  oggetto: string
  corpo: string
  letto: number
  created_at: string
  utente_attivo: number | null
  username_ref: string | null
  utente_nome: string | null
  utente_cognome: string | null
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'email') redirect('/')

  const conn = await getConnection()
  let messaggi: Messaggio[] = []
  try {
    const [rows] = await conn.execute(`
      SELECT
        e.id, e.tipo, e.oggetto, e.corpo, e.letto, e.created_at,
        u.is_active AS utente_attivo,
        u.nome     AS utente_nome,
        u.cognome  AS utente_cognome,
        CASE WHEN e.tipo = 'nuova_registrazione'
             THEN SUBSTRING_INDEX(SUBSTRING_INDEX(e.oggetto, ': ', -1), ' (', 1)
             ELSE NULL END AS username_ref
      FROM email_inbox e
      LEFT JOIN users u
        ON e.tipo = 'nuova_registrazione'
        AND u.username = SUBSTRING_INDEX(SUBSTRING_INDEX(e.oggetto, ': ', -1), ' (', 1)
      ORDER BY e.created_at DESC
    `)
    messaggi = (rows as Messaggio[]).map(m => ({
      ...m,
      corpo: (m.corpo as string)
        .replace(/<p[^>]*>Accedi a[\s\S]*?<\/p>/gi, '')
        .replace(/<p[^>]*>L'account[\s\S]*?<\/p>/gi, '')
        .trim(),
      utente_attivo:  m.utente_attivo  ?? null,
      username_ref:   m.username_ref   ?? null,
      utente_nome:    m.utente_nome    ?? null,
      utente_cognome: m.utente_cognome ?? null,
      created_at: m.created_at instanceof Date
        ? m.created_at.toISOString()
        : String(m.created_at),
    }))
  } finally {
    await conn.end()
  }

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Email</h2>
      <EmailClient messaggi={messaggi} isAdmin={role === 'admin'} />
    </div>
  )
}
