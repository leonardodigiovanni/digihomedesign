import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import CataloghiClient, { type Categoria } from './cataloghi-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cataloghi',
}

const STAFF_ROLES = ['admin', 'dipendente', 'direttore']

async function getData(): Promise<Categoria[]> {
  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS catalogo_categorie (
        id     INT AUTO_INCREMENT PRIMARY KEY,
        nome   VARCHAR(100) NOT NULL,
        ordine INT NOT NULL DEFAULT 0
      )
    `)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS catalogo_voci (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        categoria_id INT NOT NULL,
        nome         VARCHAR(200) NOT NULL,
        pdf_filename VARCHAR(255) NOT NULL,
        pdf_label    VARCHAR(200) NOT NULL DEFAULT '',
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoria_id) REFERENCES catalogo_categorie(id) ON DELETE CASCADE
      )
    `)

    const [cats] = await db.query('SELECT id, nome, ordine FROM catalogo_categorie ORDER BY ordine ASC, nome ASC')
    const [voci] = await db.query('SELECT id, categoria_id, nome, pdf_filename, pdf_label FROM catalogo_voci ORDER BY nome ASC')

    const voceMap: Record<number, Categoria['voci']> = {}
    for (const v of voci as { id: number; categoria_id: number; nome: string; pdf_filename: string; pdf_label: string }[]) {
      if (!voceMap[v.categoria_id]) voceMap[v.categoria_id] = []
      voceMap[v.categoria_id].push({ id: v.id, nome: v.nome, pdf_filename: v.pdf_filename, pdf_label: v.pdf_label })
    }

    return (cats as { id: number; nome: string; ordine: number }[]).map(c => ({
      id: c.id,
      nome: c.nome,
      ordine: c.ordine,
      voci: voceMap[c.id] ?? [],
    }))
  } finally {
    await db.end()
  }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''

  if (!role) redirect('/')
  const settings = readSettings()
  if (!hasPageAccess(role, 23, settings)) redirect('/')

  const categorie = await getData()
  const isStaff = STAFF_ROLES.includes(role)

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Cataloghi</h2>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
        Depliant e cataloghi prodotti per categoria.
      </p>
      <CataloghiClient categorie={categorie} isStaff={isStaff} />
    </div>
  )
}
