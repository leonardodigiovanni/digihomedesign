import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import CantieriClienteClient from './cantieri-cliente-client'
import type { Cantiere, Task, Media } from '@/app/area-lavoro/cantieri/cantieri-client'
import type { Metadata } from 'next'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = { title: 'I Miei Cantieri' }

function dateToStr(d: unknown): string | null {
  if (!d) return null
  if (d instanceof Date) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }
  return String(d)
}

async function getData(username: string) {
  const db = await getConnection()

  let cantieri: Cantiere[] = []
  let tasks: Task[]        = []
  let media: Media[]       = []

  try {
    // 1. Recupera il cliente_id dal cookie username
    let clienteId: number | null = null
    try {
      const [uRows] = await db.query('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username])
      clienteId = (uRows as { cliente_id: number | null }[])[0]?.cliente_id ?? null
    } catch {
      // colonna cliente_id non ancora migrata in users: fallback via email
      const [uRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username])
      const email   = (uRows as { email: string }[])[0]?.email ?? ''
      if (email) {
        const [cRows] = await db.query('SELECT id FROM clienti WHERE email = ? LIMIT 1', [email])
        clienteId = (cRows as { id: number }[])[0]?.id ?? null
      }
    }

    if (!clienteId) { await db.end(); return { cantieri, tasks, media } }

    // 2. Carica cantieri del cliente
    let cantieriRows: Record<string, unknown>[]
    try {
      const [rows] = await db.query(
        'SELECT *, NULL AS cliente_nome FROM cantieri WHERE cliente_id = ? AND visibile_cliente = 1 ORDER BY id DESC',
        [clienteId]
      )
      cantieriRows = rows as Record<string, unknown>[]
    } catch {
      // visibile_cliente non ancora migrata: mostra tutti i cantieri del cliente
      const [rows] = await db.query(
        'SELECT *, NULL AS cliente_nome FROM cantieri WHERE cliente_id = ? ORDER BY id DESC',
        [clienteId]
      )
      cantieriRows = rows as Record<string, unknown>[]
    }

    cantieri = cantieriRows.map(r => ({
      ...r,
      data_preventivo: dateToStr(r.data_preventivo),
      inizio_lavori:   dateToStr(r.inizio_lavori),
      fine_lavori:     dateToStr(r.fine_lavori),
      created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? ''),
    })) as Cantiere[]

    // 3. Carica task
    if (cantieri.length > 0) {
      const ids = cantieri.map(c => c.id)
      const ph  = ids.map(() => '?').join(',')
      const [tRows] = await db.query(
        `SELECT * FROM cantieri_lavori WHERE cantiere_id IN (${ph}) ORDER BY id ASC`,
        ids
      )
      tasks = (tRows as Record<string, unknown>[]).map(r => ({
        ...r,
        data_inizio: dateToStr(r.data_inizio),
        data_fine:   dateToStr(r.data_fine),
        created_at:  r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? ''),
      })) as Task[]

      // 4. Carica media
      if (tasks.length > 0) {
        try {
          const tids = tasks.map(t => t.id)
          const tph  = tids.map(() => '?').join(',')
          const [mRows] = await db.query(
            `SELECT * FROM cantieri_media WHERE task_id IN (${tph}) ORDER BY id ASC`,
            tids
          )
          media = mRows as Media[]
        } catch { /* colonna task_id non ancora migrata */ }
      }
    }
  } catch { /* tabella cantieri non ancora creata */ }

  await db.end()
  return { cantieri, tasks, media }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  if (role === 'cliente') {
    const db = await getConnection()
    const [uRows] = await db.query('SELECT is_active FROM users WHERE username = ? LIMIT 1', [username]) as [{ is_active: number }[], unknown]
    await db.end()
    if ((uRows[0]?.is_active ?? 0) === 0) redirect('/area-clienti/preventivi')
  }

  const { cantieri, tasks, media } = await getData(username)

  return (
    <div>
      <ShortcutStar href="/area-clienti/cantieri" />
      <CantieriClienteClient cantieri={cantieri} tasks={tasks} media={media} />
      <div className="IsDebug fs-11" style={{ marginTop: 8 }}>pagina revisionata</div>
    </div>
  )
}
