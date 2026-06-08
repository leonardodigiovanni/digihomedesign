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

async function getData(): Promise<{ categorie: Categoria[]; listiniCategorie: string[] }> {
  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS catalogo_categorie (
        id     INT AUTO_INCREMENT PRIMARY KEY,
        nome   VARCHAR(100) NOT NULL,
        ordine INT NOT NULL DEFAULT 0
      )
    `)
    const [colCheck] = await db.query(
      `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'catalogo_categorie' AND COLUMN_NAME = 'listino_categoria'`
    ) as [{ cnt: number }[], unknown]
    if ((colCheck[0]?.cnt ?? 0) === 0) {
      await db.execute(`ALTER TABLE catalogo_categorie ADD COLUMN listino_categoria VARCHAR(100) NULL DEFAULT NULL`)
    }
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
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN serie VARCHAR(200) NOT NULL DEFAULT ''`).catch(() => {})
    const [descrCheck] = await db.query(
      `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'catalogo_voci' AND COLUMN_NAME = 'descrizione'`
    ) as [{ cnt: number }[], unknown]
    if ((descrCheck[0]?.cnt ?? 0) === 0) {
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN descrizione TEXT NULL`)
    }
    const [listCatVoceCheck] = await db.query(
      `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'catalogo_voci' AND COLUMN_NAME = 'listino_categoria'`
    ) as [{ cnt: number }[], unknown]
    if ((listCatVoceCheck[0]?.cnt ?? 0) === 0) {
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN listino_categoria VARCHAR(100) NULL DEFAULT NULL`)
    }

    const [cats] = await db.query('SELECT id, nome, ordine, listino_categoria FROM catalogo_categorie ORDER BY ordine ASC, nome ASC')
    const [voci] = await db.query('SELECT id, categoria_id, nome, pdf_filename, pdf_label, serie, descrizione, listino_categoria FROM catalogo_voci ORDER BY nome ASC')

    let listiniCategorie: string[] = []
    try {
      const [lc] = await db.query('SELECT DISTINCT categoria FROM listini WHERE categoria IS NOT NULL AND categoria != \'\' ORDER BY categoria ASC')
      listiniCategorie = (lc as { categoria: string }[]).map(r => r.categoria)
    } catch {}

    const voceMap: Record<number, Categoria['voci']> = {}
    for (const v of voci as { id: number; categoria_id: number; nome: string; pdf_filename: string; pdf_label: string; serie: string; descrizione: string; listino_categoria: string | null }[]) {
      if (!voceMap[v.categoria_id]) voceMap[v.categoria_id] = []
      voceMap[v.categoria_id].push({ id: v.id, nome: v.nome, pdf_filename: v.pdf_filename, pdf_label: v.pdf_label, serie: v.serie ?? '', descrizione: v.descrizione ?? '', listino_categoria: v.listino_categoria ?? null })
    }

    const categorie = (cats as { id: number; nome: string; ordine: number; listino_categoria: string | null }[]).map(c => ({
      id: c.id,
      nome: c.nome,
      ordine: c.ordine,
      listino_categoria: c.listino_categoria ?? null,
      voci: voceMap[c.id] ?? [],
    }))
    return { categorie, listiniCategorie }
  } finally {
    await db.end()
  }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''

  if (!role) redirect('/')
  const settings = await readSettings()
  if (!hasPageAccess(role, 23, settings)) redirect('/')

  const { categorie, listiniCategorie } = await getData()
  const isStaff = STAFF_ROLES.includes(role)

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Cataloghi</h2>
      <p style={{ color: '#000', fontSize: 13, marginBottom: 24 }}>
        Depliant e cataloghi prodotti per categoria.
      </p>
      <CataloghiClient categorie={categorie} isStaff={isStaff} listiniCategorie={listiniCategorie} />
    </div>
  )
}
