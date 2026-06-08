'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'

async function checkAccess() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = await readSettings()
  if (!hasPageAccess(role, 25, settings)) redirect('/')
}

async function ensureTable() {
  const db = await getConnection()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS listini (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      categoria        VARCHAR(100) NOT NULL,
      produttore       VARCHAR(100) NOT NULL DEFAULT '',
      descrizione      VARCHAR(300) NOT NULL,
      unita            VARCHAR(30)  NOT NULL,
      prezzo_acquisto  DECIMAL(10,2) NOT NULL DEFAULT 0,
      prezzo_vendita   DECIMAL(10,2) NOT NULL DEFAULT 0,
      note             TEXT NULL,
      disponibile      TINYINT(1) NOT NULL DEFAULT 1,
      created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
  await db.execute(`ALTER TABLE listini ADD COLUMN disponibile TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
  try {
    await db.execute(`ALTER TABLE listini ADD COLUMN preventivabile TINYINT(1) NOT NULL DEFAULT 1`)
    await db.execute(`UPDATE listini SET preventivabile = 0 WHERE categoria = 'marmi'`)
  } catch { /* colonna già esistente */ }
  await db.execute(`ALTER TABLE listini ADD COLUMN foto_url VARCHAR(500) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN profilo_frontale_mm DECIMAL(6,2) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN profilo_profondita_mm DECIMAL(6,2) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN trasmittanza_uw DECIMAL(5,3) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN acquistabile TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN max_acquistabile INT NULL DEFAULT NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN sconto_articolo DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN schema_url VARCHAR(500) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN serie VARCHAR(200) NOT NULL DEFAULT ''`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN principale TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN caratteristica TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
  // campi obbligatori da inserire per salvare l'articolo nel preventivo
  await db.execute(`ALTER TABLE listini ADD COLUMN richiede_larghezza TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN richiede_altezza    TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN richiede_quantita   TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN richiede_piano      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN richiede_km         TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN richiede_peso       TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  // caratteristiche obbligatorie da abbinare all'articolo (una sola volta)
  await db.execute(`ALTER TABLE listini ADD COLUMN richiede_tipo_colore     TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN richiede_tipo_colore_acc TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN richiede_tipo_vetro       TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN costante DECIMAL(10,4) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN abbr VARCHAR(50) NOT NULL DEFAULT ''`).catch(() => {})
  await db.execute(`ALTER TABLE listini MODIFY COLUMN abbr VARCHAR(255) NOT NULL DEFAULT ''`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN minimo DECIMAL(10,4) NULL DEFAULT NULL`).catch(() => {})
  await db.end()
}

export type MutResult   = { ok: true } | { ok: false; error: string }
export type AddResult   = { ok: true; id: number } | { ok: false; error: string }

export async function addArticolo(_: AddResult | null, fd: FormData): Promise<AddResult> {
  await checkAccess()

  const categoria       = (fd.get('categoria')       as string)?.trim()
  const produttore      = (fd.get('produttore')      as string)?.trim() ?? ''
  const serie           = (fd.get('serie')           as string)?.trim() ?? ''
  const descrizione     = (fd.get('descrizione')     as string)?.trim()
  const unita           = (fd.get('unita')           as string)?.trim()
  const prezzo_acquisto = parseFloat((fd.get('prezzo_acquisto') as string) ?? '0')
  const prezzo_vendita  = parseFloat((fd.get('prezzo_vendita')  as string) ?? '0')
  const note            = (fd.get('note')            as string)?.trim() ?? ''
  const fornitoreRaw    = (fd.get('fornitore_id')    as string)?.trim()
  const fornitore_id    = fornitoreRaw ? parseInt(fornitoreRaw) : null
  const maxRaw          = (fd.get('max_acquistabile') as string)?.trim()
  const max_acquistabile = maxRaw !== '' && maxRaw != null ? parseInt(maxRaw) : null
  const sconto_articolo = parseFloat((fd.get('sconto_articolo') as string) ?? '0') || 0
  const costante        = parseFloat((fd.get('costante')        as string) ?? '0') || 0
  const abbr            = ((fd.get('abbr') as string) ?? '').trim()
  const minimoRaw       = (fd.get('minimo') as string)?.trim()
  const minimo          = minimoRaw !== '' && minimoRaw != null ? parseFloat(minimoRaw) : null

  if (!categoria || !descrizione || !unita)
    return { ok: false, error: 'Categoria, descrizione e unità sono obbligatori.' }

  await ensureTable()
  const db = await getConnection()
  try {
    const [ins] = await db.execute(
      'INSERT INTO listini (categoria, produttore, serie, descrizione, unita, prezzo_acquisto, prezzo_vendita, note, fornitore_id, max_acquistabile, sconto_articolo, costante, abbr, minimo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [categoria, produttore, serie, descrizione, unita, prezzo_acquisto, prezzo_vendita, note, fornitore_id, max_acquistabile, sconto_articolo, costante, abbr, minimo]
    ) as [{ insertId: number }, unknown]
    revalidatePath('/listini')
    return { ok: true, id: ins.insertId }
  } finally { await db.end() }
}

export async function updateArticolo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const id              = parseInt(fd.get('id') as string)
  const categoria       = (fd.get('categoria')       as string)?.trim()
  const produttore      = (fd.get('produttore')      as string)?.trim() ?? ''
  const serie           = (fd.get('serie')           as string)?.trim() ?? ''
  const descrizione     = (fd.get('descrizione')     as string)?.trim()
  const unita           = (fd.get('unita')           as string)?.trim()
  const prezzo_acquisto = parseFloat((fd.get('prezzo_acquisto') as string) ?? '0')
  const prezzo_vendita  = parseFloat((fd.get('prezzo_vendita')  as string) ?? '0')
  const note            = (fd.get('note')            as string)?.trim() ?? ''
  const fornitoreRaw    = (fd.get('fornitore_id')    as string)?.trim()
  const fornitore_id    = fornitoreRaw ? parseInt(fornitoreRaw) : null
  const maxRaw2         = (fd.get('max_acquistabile') as string)?.trim()
  const max_acquistabile = maxRaw2 !== '' && maxRaw2 != null ? parseInt(maxRaw2) : null
  const sconto_articolo = parseFloat((fd.get('sconto_articolo') as string) ?? '0') || 0
  const costante        = parseFloat((fd.get('costante')        as string) ?? '0') || 0
  const abbr            = ((fd.get('abbr') as string) ?? '').trim()
  const minimoRaw2      = (fd.get('minimo') as string)?.trim()
  const minimo          = minimoRaw2 !== '' && minimoRaw2 != null ? parseFloat(minimoRaw2) : null

  if (isNaN(id) || !categoria || !descrizione || !unita)
    return { ok: false, error: 'Dati non validi.' }

  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute(
      'UPDATE listini SET categoria=?, produttore=?, serie=?, descrizione=?, unita=?, prezzo_acquisto=?, prezzo_vendita=?, note=?, fornitore_id=?, max_acquistabile=?, sconto_articolo=?, costante=?, abbr=?, minimo=? WHERE id=?',
      [categoria, produttore, serie, descrizione, unita, prezzo_acquisto, prezzo_vendita, note, fornitore_id, max_acquistabile, sconto_articolo, costante, abbr, minimo, id]
    )
    revalidatePath('/listini')
    return { ok: true }
  } finally { await db.end() }
}

export async function toggleDisponibile(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('UPDATE listini SET disponibile = 1 - disponibile WHERE id=?', [id])
    revalidatePath('/listini')
    return { ok: true }
  } finally { await db.end() }
}

export async function togglePreventivabile(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('UPDATE listini SET preventivabile = 1 - preventivabile WHERE id=?', [id])
    revalidatePath('/listini')
    return { ok: true }
  } finally { await db.end() }
}

export async function toggleAcquistabile(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('UPDATE listini SET acquistabile = 1 - acquistabile WHERE id=?', [id])
    revalidatePath('/area-lavoro/listini')
    return { ok: true }
  } finally { await db.end() }
}

export async function deleteArticolo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('DELETE FROM listini WHERE id=?', [id])
    revalidatePath('/listini')
    return { ok: true }
  } finally { await db.end() }
}

export async function togglePrincipale(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('UPDATE listini SET principale = 1 - principale WHERE id=?', [id])
    revalidatePath('/area-lavoro/listini')
    return { ok: true }
  } finally { await db.end() }
}

export async function toggleCaratteristica(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('UPDATE listini SET caratteristica = 1 - caratteristica WHERE id=?', [id])
    revalidatePath('/area-lavoro/listini')
    return { ok: true }
  } finally { await db.end() }
}

const COLONNE_BOOL_ALLOWED = ['richiede_larghezza','richiede_altezza','richiede_quantita','richiede_piano','richiede_km','richiede_peso','richiede_tipo_colore','richiede_tipo_colore_acc','richiede_tipo_vetro','richiede_tipo_montaggio']

export async function toggleColonnaBooleana(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  const id  = parseInt(fd.get('id') as string)
  const col = (fd.get('colonna') as string) ?? ''
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  if (!COLONNE_BOOL_ALLOWED.includes(col)) return { ok: false, error: 'Colonna non valida.' }
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute(`UPDATE listini SET ${col} = 1 - ${col} WHERE id=?`, [id])
    revalidatePath('/area-lavoro/listini')
    return { ok: true }
  } finally { await db.end() }
}

export async function clearImmagine(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  const id   = parseInt(fd.get('id') as string)
  const tipo = fd.get('tipo') as string
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  const col = tipo === 'schema' ? 'schema_url' : tipo === 'foto' ? 'foto_url' : null
  if (!col) return { ok: false, error: 'Tipo non valido.' }
  const db = await getConnection()
  try {
    await db.execute(`UPDATE listini SET ${col} = NULL WHERE id=?`, [id])
    revalidatePath('/area-lavoro/listini')
    return { ok: true }
  } finally { await db.end() }
}

export async function updateSchedaTecnica(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  const frontale   = (fd.get('profilo_frontale_mm')   as string)?.trim()
  const profondita = (fd.get('profilo_profondita_mm') as string)?.trim()
  const trasmitt   = (fd.get('trasmittanza_uw')       as string)?.trim()

  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute(
      'UPDATE listini SET profilo_frontale_mm=?, profilo_profondita_mm=?, trasmittanza_uw=? WHERE id=?',
      [
        frontale   ? parseFloat(frontale)   : null,
        profondita ? parseFloat(profondita) : null,
        trasmitt   ? parseFloat(trasmitt)   : null,
        id,
      ]
    )
    revalidatePath('/area-lavoro/listini')
    return { ok: true }
  } finally { await db.end() }
}
