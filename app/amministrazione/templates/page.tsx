import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import TemplatesClient, { type Template } from './templates-client'

export const metadata: Metadata = { title: 'Template Preventivi' }

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') redirect('/')

  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS preventivo_templates (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        nome       VARCHAR(200) NOT NULL,
        html       LONGTEXT NOT NULL,
        attivo     TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    const [rows] = await db.query(
      'SELECT id, nome, attivo, updated_at FROM preventivo_templates ORDER BY attivo DESC, id ASC'
    ) as [Record<string, unknown>[], unknown]

    // Carica html solo per la lista (serve nel client per l'editor)
    const [fullRows] = await db.query(
      'SELECT id, nome, html, attivo, updated_at FROM preventivo_templates ORDER BY attivo DESC, id ASC'
    ) as [Record<string, unknown>[], unknown]

    const templates: Template[] = (fullRows as Record<string, unknown>[]).map(r => ({
      id: Number(r.id),
      nome: String(r.nome ?? ''),
      html: String(r.html ?? ''),
      attivo: Number(r.attivo),
      updated_at: r.updated_at instanceof Date
        ? r.updated_at.toLocaleDateString('it-IT')
        : String(r.updated_at ?? ''),
    }))

    return <TemplatesClient templates={templates} />
  } finally {
    await db.end()
  }
}
