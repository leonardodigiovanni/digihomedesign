import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import CantieriClienteClient from '@/app/area-clienti/cantieri/cantieri-cliente-client'
import type { Cantiere, Task, Media } from '@/app/area-lavoro/cantieri/cantieri-client'

function dateToStr(d: unknown): string | null {
  if (!d) return null
  if (d instanceof Date) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }
  return String(d)
}

async function getData(username: string, isStaff: boolean) {
  const db = await getConnection()

  let cantieri: Cantiere[] = []
  let tasks: Task[]        = []
  let media: Media[]       = []

  try {
    let cantieriRows: Record<string, unknown>[]

    if (isStaff) {
      const [rows] = await db.query(
        'SELECT *, NULL AS cliente_nome FROM cantieri ORDER BY id DESC'
      )
      cantieriRows = rows as Record<string, unknown>[]
    } else {
      let clienteId: number | null = null
      try {
        const [uRows] = await db.query('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username])
        clienteId = (uRows as { cliente_id: number | null }[])[0]?.cliente_id ?? null
      } catch {
        const [uRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username])
        const email   = (uRows as { email: string }[])[0]?.email ?? ''
        if (email) {
          const [cRows] = await db.query('SELECT id FROM clienti WHERE email = ? LIMIT 1', [email])
          clienteId = (cRows as { id: number }[])[0]?.id ?? null
        }
      }

      if (!clienteId) { await db.end(); return { cantieri, tasks, media } }

      try {
        const [rows] = await db.query(
          'SELECT *, NULL AS cliente_nome FROM cantieri WHERE cliente_id = ? AND visibile_cliente = 1 ORDER BY id DESC',
          [clienteId]
        )
        cantieriRows = rows as Record<string, unknown>[]
      } catch {
        const [rows] = await db.query(
          'SELECT *, NULL AS cliente_nome FROM cantieri WHERE cliente_id = ? ORDER BY id DESC',
          [clienteId]
        )
        cantieriRows = rows as Record<string, unknown>[]
      }
    }

    cantieri = cantieriRows.map(r => ({
      ...r,
      data_preventivo: dateToStr(r.data_preventivo),
      inizio_lavori:   dateToStr(r.inizio_lavori),
      fine_lavori:     dateToStr(r.fine_lavori),
      created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? ''),
    })) as Cantiere[]

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

      if (tasks.length > 0) {
        try {
          const tids = tasks.map(t => t.id)
          const tph  = tids.map(() => '?').join(',')
          const [mRows] = await db.query(
            `SELECT * FROM cantieri_media WHERE task_id IN (${tph}) ORDER BY id ASC`,
            tids
          )
          media = mRows as Media[]
        } catch {}
      }
    }
  } catch {}

  await db.end()
  return { cantieri, tasks, media }
}

export default async function AppCantierePage() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  const role     = cookieStore.get('session_role')?.value ?? ''
  if (!username) redirect('/app/login')

  const isStaff = role === 'admin' || role === 'dipendente'
  const { cantieri, tasks, media } = await getData(username, isStaff)

  return (
    <div>
      <CantieriClienteClient
        cantieri={cantieri}
        tasks={tasks}
        media={media}
        isApp={true}
        isDipendente={isStaff}
      />
    </div>
  )
}
