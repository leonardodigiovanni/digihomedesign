import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getConnection } from '@/lib/db'
import TaskViewerClient from '@/app/area-clienti/cantieri/task/[id]/task-viewer-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Visualizzatore lavorazione' }

type TaskRow = {
  id: number; cantiere_id: number; descrizione: string
  data_inizio: string | null; data_fine: string | null
  stato: string; note: string | null
}
type MediaRow = {
  id: number; task_id: number; tipo: 'foto' | 'video'
  filename: string; descrizione: string | null; visto: number
}

function dateToStr(d: unknown): string | null {
  if (!d) return null
  if (d instanceof Date) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }
  return String(d)
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const taskId = parseInt(id)
  if (!taskId) notFound()

  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/app/login')

  const db = await getConnection()

  // Verifica che il task appartenga a un cantiere del cliente loggato
  let task: TaskRow | null = null
  try {
    let rows: TaskRow[]
    if (role === 'admin' || role === 'dipendente') {
      const [r] = await db.query('SELECT * FROM cantieri_lavori WHERE id = ? LIMIT 1', [taskId])
      rows = r as TaskRow[]
    } else {
      // cliente: verifica ownership
      const [r] = await db.query(`
        SELECT cl.*
        FROM cantieri_lavori cl
        JOIN cantieri c ON c.id = cl.cantiere_id
        JOIN users u ON u.cliente_id = c.cliente_id
        WHERE cl.id = ? AND u.username = ? AND c.visibile_cliente = 1
        LIMIT 1
      `, [taskId, username])
      rows = r as TaskRow[]
    }
    if (rows.length === 0) { await db.end(); notFound() }
    const r = rows[0]
    task = {
      ...r,
      data_inizio: dateToStr(r.data_inizio),
      data_fine:   dateToStr(r.data_fine),
    }
  } catch {
    await db.end(); notFound()
  }

  let media: MediaRow[] = []
  try {
    const [mRows] = await db.query(
      'SELECT * FROM cantieri_media WHERE task_id = ? ORDER BY id ASC',
      [taskId]
    )
    media = mRows as MediaRow[]
  } catch { /* task_id non ancora migrata */ }

  await db.end()

  return <TaskViewerClient task={task!} media={media} />
}
