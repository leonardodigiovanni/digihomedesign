import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import CantieriClient, { type Cantiere, type Lavoro, type Media, type Cliente } from '@/app/area-lavoro/cantieri/cantieri-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'I Miei Cantieri' }

function dateToStr(d: unknown): string | null {
  if (!d) return null
  if (d instanceof Date) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }
  return String(d)
}

async function getData(role: string, username: string) {
  const db = await getConnection()
  const isStaff = role === 'admin' || role === 'dipendente'

  let cantieriRows: Record<string, unknown>[]

  if (isStaff) {
    try {
      const [rows] = await db.query(`
        SELECT c.*, COALESCE(ak.ragione_sociale, CONCAT(ak.cognome, ' ', ak.nome)) AS cliente_nome
        FROM cantieri c LEFT JOIN clienti ak ON ak.id = c.cliente_id
        ORDER BY c.created_at DESC
      `)
      cantieriRows = rows as Record<string, unknown>[]
    } catch {
      const [rows] = await db.query('SELECT *, NULL AS cliente_nome FROM cantieri ORDER BY created_at DESC')
      cantieriRows = rows as Record<string, unknown>[]
    }
  } else {
    try {
      const [userRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username])
      const userEmail = (userRows as Record<string, unknown>[])[0]?.email as string ?? ''
      const [rows] = await db.query(`
        SELECT c.*, NULL AS cliente_nome FROM cantieri c
        INNER JOIN clienti ak ON ak.id = c.cliente_id AND ak.email = ?
        WHERE c.visibile_cliente = 1 ORDER BY c.created_at DESC
      `, [userEmail])
      cantieriRows = rows as Record<string, unknown>[]
    } catch { cantieriRows = [] }
  }

  const cantieri: Cantiere[] = cantieriRows.map(r => ({
    ...r,
    data_preventivo: dateToStr(r.data_preventivo),
    inizio_lavori:   dateToStr(r.inizio_lavori),
    fine_lavori:     dateToStr(r.fine_lavori),
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? ''),
  })) as Cantiere[]

  const cantiereIds = cantieri.map(c => c.id)
  let lavori: Lavoro[] = []
  let media: Media[] = []

  if (cantiereIds.length > 0) {
    const ph = cantiereIds.map(() => '?').join(',')
    const [lRows] = await db.query(`SELECT * FROM cantieri_lavori WHERE cantiere_id IN (${ph})`, cantiereIds)
    lavori = lRows as Lavoro[]
    const [mRows] = await db.query(`SELECT * FROM cantieri_media WHERE cantiere_id IN (${ph}) ORDER BY created_at ASC`, cantiereIds)
    media = mRows as Media[]
  }

  let clienti: Cliente[] = []
  if (isStaff) {
    try {
      const [cRows] = await db.query('SELECT id, nome, cognome, ragione_sociale, email FROM clienti ORDER BY cognome ASC, ragione_sociale ASC')
      clienti = cRows as Cliente[]
    } catch { /* tabella non ancora creata */ }
  }

  await db.end()
  return { cantieri, lavori, media, clienti, isStaff }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role    = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const { cantieri, lavori, media, clienti, isStaff } = await getData(role, username)

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Cantieri</h2>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
        {isStaff ? 'Tutti i cantieri — gestione completa.' : 'I tuoi cantieri attivi.'}
      </p>
      <CantieriClient cantieri={cantieri} lavori={lavori} media={media} clienti={clienti} isStaff={isStaff} />
    </div>
  )
}
