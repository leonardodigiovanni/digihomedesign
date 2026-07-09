import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import B2BClient, { type TemplateB2B, type BrandB2B } from './b2b-client'

export const metadata: Metadata = { title: 'B2B — Digi Home Design' }

const DEFAULT_TEMPLATE_OGGETTO = 'Richiesta di collaborazione commerciale e condizioni riservate alle imprese'
const DEFAULT_TEMPLATE_TESTO =
  `Siamo a disposizione per fornire qualsiasi ulteriore informazione sulla nostra azienda e saremmo lieti di fissare un colloquio telefonico o un incontro conoscitivo qualora lo riteneste opportuno.\n` +
  `Ringraziandovi anticipatamente per l'attenzione, porgiamo cordiali saluti.\n` +
  `[NOME E COGNOME]\n[TITOLO]\n[NOME AZIENDA]\n[Telefono]\n[E-mail]\n[Sito web]`

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') redirect('/')

  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS b2b_templates (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        oggetto    VARCHAR(255) NOT NULL,
        testo      LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS b2b_brand (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        nome       VARCHAR(200) NOT NULL,
        email      VARCHAR(255) NOT NULL,
        telefono   VARCHAR(50)  NULL,
        note       TEXT         NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    const [countRows] = await db.query(`SELECT COUNT(*) AS n FROM b2b_templates`) as [{ n: number }[], unknown]
    if (countRows[0].n === 0) {
      await db.execute(
        `INSERT INTO b2b_templates (oggetto, testo) VALUES (?, ?)`,
        [DEFAULT_TEMPLATE_OGGETTO, DEFAULT_TEMPLATE_TESTO]
      )
    }

    const [templateRows] = await db.query(
      `SELECT id, oggetto, testo, updated_at FROM b2b_templates ORDER BY updated_at DESC, id DESC`
    ) as [Record<string, unknown>[], unknown]

    const templates: TemplateB2B[] = (templateRows as Record<string, unknown>[]).map(r => ({
      id: Number(r.id),
      oggetto: String(r.oggetto ?? ''),
      testo: String(r.testo ?? ''),
      updated_at: r.updated_at instanceof Date ? r.updated_at.toLocaleDateString('it-IT') : String(r.updated_at ?? ''),
    }))

    const [brandRows] = await db.query(
      `SELECT id, nome, email, telefono, note FROM b2b_brand ORDER BY nome ASC`
    ) as [Record<string, unknown>[], unknown]

    const brands: BrandB2B[] = (brandRows as Record<string, unknown>[]).map(r => ({
      id: Number(r.id),
      nome: String(r.nome ?? ''),
      email: String(r.email ?? ''),
      telefono: r.telefono != null ? String(r.telefono) : '',
      note: r.note != null ? String(r.note) : '',
    }))

    return <B2BClient templates={templates} brands={brands} />
  } finally {
    await db.end()
  }
}
