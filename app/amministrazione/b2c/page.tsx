import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import B2CClient, { type TemplateB2C, type ClienteB2C } from './b2c-client'

export const metadata: Metadata = { title: 'B2C — Digi Home Design' }

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') redirect('/')

  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS b2c_templates (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        oggetto    VARCHAR(255) NOT NULL,
        testo      LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS b2c_clienti (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        nome       VARCHAR(200) NOT NULL,
        email      VARCHAR(255) NOT NULL,
        telefono   VARCHAR(50)  NULL,
        note       TEXT         NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    const [templateRows] = await db.query(
      `SELECT id, oggetto, testo, updated_at FROM b2c_templates ORDER BY updated_at DESC, id DESC`
    ) as [Record<string, unknown>[], unknown]

    const templates: TemplateB2C[] = (templateRows as Record<string, unknown>[]).map(r => ({
      id: Number(r.id),
      oggetto: String(r.oggetto ?? ''),
      testo: String(r.testo ?? ''),
      updated_at: r.updated_at instanceof Date ? r.updated_at.toLocaleDateString('it-IT') : String(r.updated_at ?? ''),
    }))

    const [clienteRows] = await db.query(
      `SELECT id, nome, email, telefono, note FROM b2c_clienti ORDER BY nome ASC`
    ) as [Record<string, unknown>[], unknown]

    const clienti: ClienteB2C[] = (clienteRows as Record<string, unknown>[]).map(r => ({
      id: Number(r.id),
      nome: String(r.nome ?? ''),
      email: String(r.email ?? ''),
      telefono: r.telefono != null ? String(r.telefono) : '',
      note: r.note != null ? String(r.note) : '',
    }))

    return <B2CClient templates={templates} clienti={clienti} />
  } finally {
    await db.end()
  }
}
