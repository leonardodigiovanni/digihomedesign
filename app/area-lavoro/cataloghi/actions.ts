'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { ensurePercorsiTables } from '@/lib/percorsi'


const STAFF_ROLES = ['admin', 'dipendente', 'direttore']

async function checkAccess() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = await readSettings()
  if (!hasPageAccess(role, 23, settings)) redirect('/')
  return role
}

async function ensureVociTable(db: Awaited<ReturnType<typeof getConnection>>) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS catalogo_voci (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      nome         VARCHAR(200) NOT NULL,
      pdf_filename VARCHAR(255) NOT NULL,
      pdf_label    VARCHAR(200) NOT NULL DEFAULT '',
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN serie VARCHAR(200) NOT NULL DEFAULT ''`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN descrizione TEXT NULL`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_battente TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_scorrevole TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_taglio_termico TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_taglio_freddo TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_economico TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_fascia_alta TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN fase VARCHAR(100) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN materiale VARCHAR(100) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN tipologia VARCHAR(100) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN ambiente VARCHAR(100) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN fascia VARCHAR(100) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_1 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_2 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_3 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_4 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN schema_url VARCHAR(500) NULL`).catch(() => {})
}

export type MutResult = { ok: true } | { ok: false; error: string }

// ─── Voci ─────────────────────────────────────────────────────────────────────

export async function addVoce(_: MutResult | null, fd: FormData): Promise<MutResult> {
  const role = await checkAccess()
  if (!STAFF_ROLES.includes(role)) return { ok: false, error: 'Non autorizzato.' }

  const nome         = (fd.get('nome')         as string)?.trim()
  const serie        = (fd.get('serie')        as string)?.trim() ?? ''
  const pdf_filename = (fd.get('pdf_filename') as string)?.trim()
  const pdf_label    = (fd.get('pdf_label')    as string)?.trim() ?? ''
  const categoria    = (fd.get('categoria')    as string)?.trim() || ''

  if (!nome || !pdf_filename) return { ok: false, error: 'Dati incompleti.' }

  const db = await getConnection()
  try {
    await ensureVociTable(db)
    const [ins] = await db.execute(
      'INSERT INTO catalogo_voci (nome, pdf_filename, pdf_label, serie) VALUES (?,?,?,?)',
      [nome, pdf_filename, pdf_label, serie]
    ) as [{ insertId: number }, unknown]
    await ensurePercorsiTables(db).catch(() => {})
    if (categoria) {
      await db.execute(
        'INSERT IGNORE INTO catalogo_voci_percorsi (voce_id, categoria, sottocategoria) VALUES (?,?,?)',
        [ins.insertId, categoria, '']
      ).catch(() => {})
    }
    revalidatePath('/cataloghi')
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
  const filtro_battente       = fd.get('filtro_battente')       === 'on' ? 1 : 0
  const filtro_scorrevole     = fd.get('filtro_scorrevole')     === 'on' ? 1 : 0
  const filtro_taglio_termico = fd.get('filtro_taglio_termico') === 'on' ? 1 : 0
  const filtro_taglio_freddo  = fd.get('filtro_taglio_freddo')  === 'on' ? 1 : 0
  const filtro_economico      = fd.get('filtro_economico')      === 'on' ? 1 : 0
  const filtro_fascia_alta    = fd.get('filtro_fascia_alta')    === 'on' ? 1 : 0
  const fase           = (fd.get('fase')           as string)?.trim() || null
  const materiale      = (fd.get('materiale')      as string)?.trim() || null
  const tipologia      = (fd.get('tipologia')      as string)?.trim() || null
  const ambiente       = (fd.get('ambiente')       as string)?.trim() || null
  const fascia         = (fd.get('fascia')         as string)?.trim() || null
  const filtro_1       = fd.get('filtro_1')        === 'on' ? 1 : 0
  const filtro_2       = fd.get('filtro_2')        === 'on' ? 1 : 0
  const filtro_3       = fd.get('filtro_3')        === 'on' ? 1 : 0
  const filtro_4       = fd.get('filtro_4')        === 'on' ? 1 : 0
  const schema_url     = (fd.get('schema_url')     as string)?.trim() || null

  if (isNaN(id) || !nome) return { ok: false, error: 'Dati incompleti.' }

  const db = await getConnection()
  try {
    await ensureVociTable(db)
    const extraCols = ', filtro_battente=?, filtro_scorrevole=?, filtro_taglio_termico=?, filtro_taglio_freddo=?, filtro_economico=?, filtro_fascia_alta=?, fase=?, materiale=?, tipologia=?, ambiente=?, fascia=?, filtro_1=?, filtro_2=?, filtro_3=?, filtro_4=?, schema_url=?'
    const extraVals = [filtro_battente, filtro_scorrevole, filtro_taglio_termico, filtro_taglio_freddo, filtro_economico, filtro_fascia_alta, fase, materiale, tipologia, ambiente, fascia, filtro_1, filtro_2, filtro_3, filtro_4, schema_url]
    if (new_pdf_filename) {
      await db.execute(
        `UPDATE catalogo_voci SET nome=?, serie=?, pdf_label=?, descrizione=?, pdf_filename=?${extraCols} WHERE id=?`,
        [nome, serie, pdf_label, descrizione, new_pdf_filename, ...extraVals, id]
      )
    } else {
      await db.execute(
        `UPDATE catalogo_voci SET nome=?, serie=?, pdf_label=?, descrizione=?${extraCols} WHERE id=?`,
        [nome, serie, pdf_label, descrizione, ...extraVals, id]
      )
    }
    revalidatePath('/cataloghi')
    return { ok: true }
  } finally { await db.end() }
}

export async function deleteVoce(_: MutResult | null, fd: FormData): Promise<MutResult> {
  const role = await checkAccess()
  if (!STAFF_ROLES.includes(role)) return { ok: false, error: 'Non autorizzato.' }

  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  const db = await getConnection()
  try {
    await db.execute('DELETE FROM catalogo_voci WHERE id = ?', [id])
    revalidatePath('/cataloghi')
    return { ok: true }
  } finally { await db.end() }
}
