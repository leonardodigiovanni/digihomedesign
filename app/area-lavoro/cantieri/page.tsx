import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import CantieriClient, { type Cantiere, type Task, type Media, type Cliente } from './cantieri-client'
import GestioneBlob from '@/components/gestione-blob'
import ShortcutStar from '@/components/shortcut-star'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Cantieri' }

function dateToStr(d: unknown): string | null {
  if (!d) return null
  if (d instanceof Date) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }
  return String(d)
}

async function getData() {
  const db = await getConnection()

  let cantieriRows: Record<string, unknown>[]
  try {
    const [rows] = await db.query(`
      SELECT c.*,
        NULLIF(TRIM(COALESCE(NULLIF(ak.ragione_sociale,''), CONCAT_WS(' ', ak.cognome, ak.nome))), '') AS cliente_nome
      FROM cantieri c
      LEFT JOIN clienti ak ON ak.id = c.cliente_id
      ORDER BY c.created_at DESC
    `)
    cantieriRows = rows as Record<string, unknown>[]
  } catch {
    const [rows] = await db.query('SELECT *, NULL AS cliente_nome FROM cantieri ORDER BY created_at DESC')
    cantieriRows = rows as Record<string, unknown>[]
  }

  const cantieri: Cantiere[] = cantieriRows.map(r => ({
    ...r,
    data_preventivo: dateToStr(r.data_preventivo),
    inizio_lavori:   dateToStr(r.inizio_lavori),
    fine_lavori:     dateToStr(r.fine_lavori),
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? ''),
  })) as Cantiere[]

  const cantiereIds = cantieri.map(c => c.id)
  let tasks: Task[]  = []
  let media: Media[] = []

  if (cantiereIds.length > 0) {
    const ph = cantiereIds.map(() => '?').join(',')
    const [tRows] = await db.query(
      `SELECT * FROM cantieri_lavori WHERE cantiere_id IN (${ph}) ORDER BY id ASC`,
      cantiereIds
    )
    tasks = (tRows as Record<string, unknown>[]).map(r => ({
      ...r,
      data_inizio: dateToStr(r.data_inizio),
      data_fine:   dateToStr(r.data_fine),
      created_at:  r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? ''),
    })) as Task[]

    if (tasks.length > 0) {
      try {
        const taskIds = tasks.map(t => t.id)
        const tph = taskIds.map(() => '?').join(',')
        const [mRows] = await db.query(
          `SELECT * FROM cantieri_media WHERE task_id IN (${tph}) ORDER BY id ASC`,
          taskIds
        )
        media = mRows as Media[]
      } catch { /* colonna task_id non ancora migrata */ }
    }
  }

  let clienti: Cliente[] = []
  try {
    const [cRows] = await db.query('SELECT id, nome, cognome, ragione_sociale, email FROM clienti ORDER BY cognome ASC, ragione_sociale ASC')
    clienti = cRows as Cliente[]
  } catch { /* tabella non ancora creata */ }

  await db.end()
  return { cantieri, tasks, media, clienti }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente') redirect('/')

  const { cantieri, tasks, media, clienti } = await getData()

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Cantieri<ShortcutStar href="/area-lavoro/cantieri" small /></h2>
      <p style={{ color: '#000', fontSize: 13, marginBottom: 24 }}>Tutti i cantieri — gestione completa.</p>
      <CantieriClient cantieri={cantieri} tasks={tasks} media={media} clienti={clienti} isStaff={true} />
      <GestioneBlob prefix="cantieri/" label="Gestione Blob — Cantieri" />
      <div className="IsDebug fs-11" style={{ marginTop: 8 }}>pagina revisionata</div>
    </div>
  )
}
