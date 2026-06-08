'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { unlink } from 'fs/promises'
import path from 'path'

const STAFF_ROLES = ['admin', 'dipendente', 'direttore']

async function checkAccess() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = await readSettings()
  if (!hasPageAccess(role, 23, settings)) redirect('/')
  return role
}

async function ensureTables() {
  const db = await getConnection()
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
  const [listCatCheck] = await db.query(
    `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'catalogo_voci' AND COLUMN_NAME = 'listino_categoria'`
  ) as [{ cnt: number }[], unknown]
  if ((listCatCheck[0]?.cnt ?? 0) === 0) {
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN listino_categoria VARCHAR(100) NULL DEFAULT NULL`)
  }
  await db.end()
}

export type MutResult = { ok: true } | { ok: false; error: string }

// ─── Categorie ────────────────────────────────────────────────────────────────

export async function addCategoria(_: MutResult | null, fd: FormData): Promise<MutResult> {
  const role = await checkAccess()
  if (!STAFF_ROLES.includes(role)) return { ok: false, error: 'Non autorizzato.' }

  const nome = (fd.get('nome') as string)?.trim()
  if (!nome) return { ok: false, error: 'Nome obbligatorio.' }

  await ensureTables()
  const db = await getConnection()
  try {
    const [rows] = await db.query('SELECT COALESCE(MAX(ordine),0)+1 AS next FROM catalogo_categorie')
    const ordine = (rows as { next: number }[])[0]?.next ?? 1
    await db.execute('INSERT INTO catalogo_categorie (nome, ordine) VALUES (?,?)', [nome, ordine])
    revalidatePath('/cataloghi')
    return { ok: true }
  } finally { await db.end() }
}

export async function deleteCategoria(_: MutResult | null, fd: FormData): Promise<MutResult> {
  const role = await checkAccess()
  if (!STAFF_ROLES.includes(role)) return { ok: false, error: 'Non autorizzato.' }

  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()
  try {
    // Recupera i PDF delle voci per eliminarli dal disco
    const [voci] = await db.query('SELECT pdf_filename FROM catalogo_voci WHERE categoria_id = ?', [id])
    await db.execute('DELETE FROM catalogo_categorie WHERE id = ?', [id])

    const dir = path.join(process.cwd(), 'public', 'uploads', 'cataloghi')
    for (const v of voci as { pdf_filename: string }[]) {
      await unlink(path.join(dir, v.pdf_filename)).catch(() => {})
    }

    revalidatePath('/cataloghi')
    return { ok: true }
  } finally { await db.end() }
}

// ─── Voci ─────────────────────────────────────────────────────────────────────

export async function addVoce(_: MutResult | null, fd: FormData): Promise<MutResult> {
  const role = await checkAccess()
  if (!STAFF_ROLES.includes(role)) return { ok: false, error: 'Non autorizzato.' }

  const categoria_id      = parseInt(fd.get('categoria_id') as string)
  const nome              = (fd.get('nome')              as string)?.trim()
  const serie             = (fd.get('serie')             as string)?.trim() ?? ''
  const pdf_filename      = (fd.get('pdf_filename')      as string)?.trim()
  const pdf_label         = (fd.get('pdf_label')         as string)?.trim() ?? ''
  const listino_categoria = (fd.get('listino_categoria') as string)?.trim() || null

  if (isNaN(categoria_id) || !nome || !pdf_filename)
    return { ok: false, error: 'Dati incompleti.' }

  await ensureTables()
  const db = await getConnection()
  try {
    await db.execute(
      'INSERT INTO catalogo_voci (categoria_id, nome, pdf_filename, pdf_label, serie, listino_categoria) VALUES (?,?,?,?,?,?)',
      [categoria_id, nome, pdf_filename, pdf_label, serie, listino_categoria]
    )
    revalidatePath('/cataloghi')
    return { ok: true }
  } finally { await db.end() }
}

export async function updateListinoCategoria(_: MutResult | null, fd: FormData): Promise<MutResult> {
  const role = await checkAccess()
  if (!STAFF_ROLES.includes(role)) return { ok: false, error: 'Non autorizzato.' }

  const id = parseInt(fd.get('id') as string)
  const listino_categoria = (fd.get('listino_categoria') as string)?.trim() || null
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()
  try {
    await db.execute('UPDATE catalogo_categorie SET listino_categoria = ? WHERE id = ?', [listino_categoria, id])
    revalidatePath('/area-lavoro/cataloghi')
    return { ok: true }
  } finally { await db.end() }
}

export async function updateVoce(_: MutResult | null, fd: FormData): Promise<MutResult> {
  const role = await checkAccess()
  if (!STAFF_ROLES.includes(role)) return { ok: false, error: 'Non autorizzato.' }

  const id               = parseInt(fd.get('id') as string)
  const nome             = (fd.get('nome')             as string)?.trim()
  const serie            = (fd.get('serie')            as string)?.trim() ?? ''
  const pdf_label        = (fd.get('pdf_label')        as string)?.trim() ?? ''
  const descrizione      = (fd.get('descrizione')      as string)?.trim() ?? ''
  const new_pdf_filename = (fd.get('new_pdf_filename') as string)?.trim() || null

  if (isNaN(id) || !nome) return { ok: false, error: 'Dati incompleti.' }

  await ensureTables()
  const db = await getConnection()
  try {
    if (new_pdf_filename) {
      const [rows] = await db.query('SELECT pdf_filename FROM catalogo_voci WHERE id = ?', [id])
      const old = (rows as { pdf_filename: string }[])[0]
      await db.execute(
        'UPDATE catalogo_voci SET nome=?, serie=?, pdf_label=?, descrizione=?, pdf_filename=? WHERE id=?',
        [nome, serie, pdf_label, descrizione, new_pdf_filename, id]
      )
      if (old) {
        const dir = path.join(process.cwd(), 'public', 'uploads', 'cataloghi')
        await unlink(path.join(dir, old.pdf_filename)).catch(() => {})
      }
    } else {
      await db.execute(
        'UPDATE catalogo_voci SET nome=?, serie=?, pdf_label=?, descrizione=? WHERE id=?',
        [nome, serie, pdf_label, descrizione, id]
      )
    }
    // listino_categoria gestita da updateListinoVoce
    revalidatePath('/cataloghi')
    return { ok: true }
  } finally { await db.end() }
}

export async function updateListinoVoce(_: MutResult | null, fd: FormData): Promise<MutResult> {
  const role = await checkAccess()
  if (!STAFF_ROLES.includes(role)) return { ok: false, error: 'Non autorizzato.' }

  const id = parseInt(fd.get('id') as string)
  const listino_categoria = (fd.get('listino_categoria') as string)?.trim() || null
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()
  try {
    await db.execute('UPDATE catalogo_voci SET listino_categoria = ? WHERE id = ?', [listino_categoria, id])
    revalidatePath('/area-lavoro/cataloghi')
    return { ok: true }
  } finally { await db.end() }
}

export async function deleteVoce(_: MutResult | null, fd: FormData): Promise<MutResult> {
  const role = await checkAccess()
  if (!STAFF_ROLES.includes(role)) return { ok: false, error: 'Non autorizzato.' }

  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()
  try {
    const [rows] = await db.query('SELECT pdf_filename FROM catalogo_voci WHERE id = ?', [id])
    const voce = (rows as { pdf_filename: string }[])[0]

    await db.execute('DELETE FROM catalogo_voci WHERE id = ?', [id])

    if (voce) {
      const dir = path.join(process.cwd(), 'public', 'uploads', 'cataloghi')
      await unlink(path.join(dir, voce.pdf_filename)).catch(() => {})
    }

    revalidatePath('/cataloghi')
    return { ok: true }
  } finally { await db.end() }
}
