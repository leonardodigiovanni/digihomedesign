'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { syncListinoPercorsi, ensurePercorsiTables } from '@/lib/percorsi'

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
  await db.execute(`ALTER TABLE listini ADD COLUMN logo_url VARCHAR(500) NULL`).catch(() => {})
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
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_1  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_2  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_3  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_4  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_5  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_6  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_7  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_8  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_9  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_10 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN sottocategoria VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN fase          VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN materiale     VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN tipologia     VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN ambiente      VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN fascia        VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN escluso       TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.end()
}

export type MutResult   = { ok: true } | { ok: false; error: string }
export type AddResult   = { ok: true; id: number } | { ok: false; error: string }

export async function addArticolo(_: AddResult | null, fd: FormData): Promise<AddResult> {
  await checkAccess()

  const categoria       = (fd.get('categoria')       as string)?.trim()
  const sottocategoria  = (fd.get('sottocategoria')  as string)?.trim() || null
  const fase            = (fd.get('fase')            as string)?.trim() || null
  const materiale       = (fd.get('materiale')       as string)?.trim() || null
  const tipologia       = (fd.get('tipologia')       as string)?.trim() || null
  const ambiente        = (fd.get('ambiente')        as string)?.trim() || null
  const produttore      = (fd.get('produttore')      as string)?.trim() ?? ''
  const serie           = (fd.get('serie')           as string)?.trim() ?? ''
  const descrizione     = (fd.get('descrizione')     as string)?.trim()
  const fascia          = (fd.get('fascia')          as string)?.trim() || null
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
      'INSERT INTO listini (categoria, sottocategoria, fase, materiale, tipologia, ambiente, produttore, serie, descrizione, fascia, unita, prezzo_acquisto, prezzo_vendita, note, fornitore_id, max_acquistabile, sconto_articolo, costante, abbr, minimo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [categoria, sottocategoria, fase, materiale, tipologia, ambiente, produttore, serie, descrizione, fascia, unita, prezzo_acquisto, prezzo_vendita, note, fornitore_id, max_acquistabile, sconto_articolo, costante, abbr, minimo]
    ) as [{ insertId: number }, unknown]
    await ensurePercorsiTables(db).catch(() => {})
    await syncListinoPercorsi(db, ins.insertId, categoria, sottocategoria).catch(() => {})
    revalidatePath('/listini')
    return { ok: true, id: ins.insertId }
  } finally { await db.end() }
}

export async function updateArticolo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const id              = parseInt(fd.get('id') as string)
  const categoria       = (fd.get('categoria')       as string)?.trim()
  const sottocategoria  = (fd.get('sottocategoria')  as string)?.trim() || null
  const fase            = (fd.get('fase')            as string)?.trim() || null
  const materiale       = (fd.get('materiale')       as string)?.trim() || null
  const tipologia       = (fd.get('tipologia')       as string)?.trim() || null
  const ambiente        = (fd.get('ambiente')        as string)?.trim() || null
  const produttore      = (fd.get('produttore')      as string)?.trim() ?? ''
  const serie           = (fd.get('serie')           as string)?.trim() ?? ''
  const descrizione     = (fd.get('descrizione')     as string)?.trim()
  const fascia          = (fd.get('fascia')          as string)?.trim() || null
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
      'UPDATE listini SET categoria=?, sottocategoria=?, fase=?, materiale=?, tipologia=?, ambiente=?, produttore=?, serie=?, descrizione=?, fascia=?, unita=?, prezzo_acquisto=?, prezzo_vendita=?, note=?, fornitore_id=?, max_acquistabile=?, sconto_articolo=?, costante=?, abbr=?, minimo=? WHERE id=?',
      [categoria, sottocategoria, fase, materiale, tipologia, ambiente, produttore, serie, descrizione, fascia, unita, prezzo_acquisto, prezzo_vendita, note, fornitore_id, max_acquistabile, sconto_articolo, costante, abbr, minimo, id]
    )
    await ensurePercorsiTables(db).catch(() => {})
    await syncListinoPercorsi(db, id, categoria, sottocategoria).catch(() => {})
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

export async function toggleComputabile(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('UPDATE listini SET computabile = 1 - computabile WHERE id=?', [id])
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
    await db.execute(`DELETE FROM listini_percorsi WHERE listino_id = ?`, [id]).catch(() => {})
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

export async function toggleEscluso(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute('UPDATE listini SET escluso = 1 - escluso WHERE id=?', [id])
    revalidatePath('/area-lavoro/listini')
    return { ok: true }
  } finally { await db.end() }
}

const COLONNE_BOOL_ALLOWED = ['richiede_larghezza','richiede_altezza','richiede_quantita','richiede_piano','richiede_km','richiede_peso','richiede_tipo_colore','richiede_tipo_colore_acc','richiede_tipo_vetro','richiede_tipo_montaggio','Filtro_1','Filtro_2','Filtro_3','Filtro_4','Filtro_5','Filtro_6','Filtro_7','Filtro_8','Filtro_9','Filtro_10']

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

export async function cloneArticolo(_: AddResult | null, fd: FormData): Promise<AddResult> {
  await checkAccess()
  const sourceId = parseInt(fd.get('id') as string)
  if (isNaN(sourceId)) return { ok: false, error: 'ID non valido.' }
  await ensureTable()
  const db = await getConnection()
  try {
    const [descRows] = await db.query('SELECT descrizione FROM listini WHERE id=?', [sourceId])
    const src = (descRows as { descrizione: string }[])[0]
    if (!src) return { ok: false, error: 'Articolo non trovato.' }
    const m = src.descrizione.match(/^(\d+)\s+(.*)$/)
    const nuovaDescrizione = m ? `${parseInt(m[1], 10) + 1} ${m[2]}` : `0 ${src.descrizione}`

    const [ins] = await db.execute(
      `INSERT INTO listini
        (categoria, produttore, serie, descrizione, unita, prezzo_acquisto, prezzo_vendita,
         note, fornitore_id, max_acquistabile, sconto_articolo, costante, abbr, minimo,
         disponibile, preventivabile, acquistabile, principale, caratteristica,
         richiede_larghezza, richiede_altezza, richiede_quantita, richiede_piano,
         richiede_km, richiede_peso, richiede_tipo_colore, richiede_tipo_colore_acc,
         richiede_tipo_vetro, richiede_tipo_montaggio, foto_url)
       SELECT
        categoria, produttore, serie, ?, unita, prezzo_acquisto, prezzo_vendita,
        note, fornitore_id, max_acquistabile, sconto_articolo, costante, abbr, minimo,
        disponibile, preventivabile, acquistabile, principale, caratteristica,
        richiede_larghezza, richiede_altezza, richiede_quantita, richiede_piano,
        richiede_km, richiede_peso, richiede_tipo_colore, richiede_tipo_colore_acc,
        richiede_tipo_vetro, richiede_tipo_montaggio, foto_url
       FROM listini WHERE id=?`,
      [nuovaDescrizione, sourceId]
    ) as [{ insertId: number }, unknown]
    await ensurePercorsiTables(db).catch(() => {})
    await db.execute(
      `INSERT IGNORE INTO listini_percorsi (listino_id, categoria, sottocategoria)
       SELECT ?, categoria, sottocategoria FROM listini_percorsi WHERE listino_id = ?`,
      [ins.insertId, sourceId]
    ).catch(() => {})
    revalidatePath('/area-lavoro/listini')
    return { ok: true, id: ins.insertId }
  } finally { await db.end() }
}

export async function clearImmagine(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  const id   = parseInt(fd.get('id') as string)
  const tipo = fd.get('tipo') as string
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  const col = tipo === 'schema' ? 'schema_url' : tipo === 'foto' ? 'foto_url' : tipo === 'logo' ? 'logo_url' : null
  if (!col) return { ok: false, error: 'Tipo non valido.' }
  const db = await getConnection()
  try {
    await db.execute(`UPDATE listini SET ${col} = NULL WHERE id=?`, [id])
    revalidatePath('/area-lavoro/listini')
    return { ok: true }
  } finally { await db.end() }
}

// ─── Aggiornamento massivo (riga valori) ──────────────────────────────────────

const CAMPI_TESTO: Record<string, string> = {
  categoria: 'categoria', fase: 'fase', materiale: 'materiale', tipologia: 'tipologia',
  ambiente: 'ambiente', descrizione: 'descrizione', fascia: 'fascia', produttore: 'produttore',
  logo: 'logo_url', serie: 'serie', unita: 'unita', abbr: 'abbr', note: 'note',
}
const CAMPI_NUMERICI: Record<string, string> = {
  minimo: 'minimo', p_acq: 'prezzo_acquisto', p_vnd: 'prezzo_vendita', costante: 'costante', sconto: 'sconto_articolo',
}
const CAMPI_BOOL: Record<string, string> = {
  escluso: 'escluso',
  disponibile: 'disponibile', preventivabile: 'preventivabile', acquistabile: 'acquistabile',
  computabile: 'computabile', principale: 'principale', caratteristica: 'caratteristica',
  richiede_larghezza: 'richiede_larghezza', richiede_altezza: 'richiede_altezza', richiede_quantita: 'richiede_quantita',
  richiede_piano: 'richiede_piano', richiede_km: 'richiede_km', richiede_peso: 'richiede_peso',
  richiede_tipo_colore: 'richiede_tipo_colore', richiede_tipo_colore_acc: 'richiede_tipo_colore_acc',
  richiede_tipo_vetro: 'richiede_tipo_vetro', richiede_tipo_montaggio: 'richiede_tipo_montaggio',
  filtro_1: 'Filtro_1', filtro_2: 'Filtro_2', filtro_3: 'Filtro_3', filtro_4: 'Filtro_4', filtro_5: 'Filtro_5',
  filtro_6: 'Filtro_6', filtro_7: 'Filtro_7', filtro_8: 'Filtro_8', filtro_9: 'Filtro_9', filtro_10: 'Filtro_10',
}

// Colonne che accettano NULL in DB: la convenzione "NULL" (case-insensitive) scritta in un campo
// azzera la colonna. Le colonne testuali/numeriche NOT NULL vengono azzerate a '' / 0 invece.
const TESTO_NULLABLE = new Set(['fase', 'materiale', 'tipologia', 'ambiente', 'fascia', 'logo', 'note'])
const NUMERICI_NULLABLE = new Set(['minimo'])

function isNullToken(v: string): boolean {
  return v.trim().toLowerCase() === 'null'
}

export type BulkResult =
  | { ok: true; aggiornati: number; percorsiInseriti: number }
  | { ok: false; error: string }

export async function updateMassivo(ids: number[], valori: Record<string, string>): Promise<BulkResult> {
  await checkAccess()
  if (!ids.length) return { ok: false, error: 'Nessun articolo nella lista filtrata.' }

  await ensureTable()
  const db = await getConnection()
  try {
    const sets: string[] = []
    const params: (string | number | null)[] = []

    for (const [k, col] of Object.entries(CAMPI_TESTO)) {
      const v = valori[k]
      if (v === undefined || v === '') continue
      if (isNullToken(v)) { sets.push(`${col} = ?`); params.push(TESTO_NULLABLE.has(k) ? null : '') }
      else { sets.push(`${col} = ?`); params.push(v) }
    }
    for (const [k, col] of Object.entries(CAMPI_NUMERICI)) {
      const v = valori[k]
      if (v === undefined || v === '') continue
      if (isNullToken(v)) { sets.push(`${col} = ?`); params.push(NUMERICI_NULLABLE.has(k) ? null : 0) }
      else {
        const n = parseFloat(v)
        if (!isNaN(n)) { sets.push(`${col} = ?`); params.push(n) }
      }
    }
    for (const [k, col] of Object.entries(CAMPI_BOOL)) {
      const v = valori[k]
      if (v === '0' || v === '1') { sets.push(`${col} = ?`); params.push(parseInt(v)) }
    }
    if (valori.fornitore) {
      const raw = valori.fornitore.trim()
      if (isNullToken(raw)) {
        sets.push('fornitore_id = ?'); params.push(null)
      } else {
        let fornitoreId: number | null = null
        if (/^\d+$/.test(raw)) {
          fornitoreId = parseInt(raw)
        } else {
          const [rows] = await db.query('SELECT id FROM fornitori WHERE ragione_sociale = ? LIMIT 1', [raw])
          const r = (rows as { id: number }[])[0]
          if (r) fornitoreId = r.id
        }
        if (fornitoreId != null) { sets.push('fornitore_id = ?'); params.push(fornitoreId) }
      }
    }

    let aggiornati = 0
    if (sets.length > 0) {
      const placeholders = ids.map(() => '?').join(',')
      const [res] = await db.query(
        `UPDATE listini SET ${sets.join(', ')} WHERE id IN (${placeholders})`,
        [...params, ...ids]
      ) as [{ affectedRows: number }, unknown]
      aggiornati = res.affectedRows
    }

    let percorsiInseriti = 0
    const pc = (valori.percorso_categoria ?? '').trim()
    const ps = (valori.percorso_sottocategoria ?? '').trim()
    if (pc) {
      await ensurePercorsiTables(db)
      for (const id of ids) {
        const [r] = await db.execute(
          `INSERT IGNORE INTO listini_percorsi (listino_id, categoria, sottocategoria) VALUES (?, ?, ?)`,
          [id, pc, ps]
        ) as [{ affectedRows: number }, unknown]
        if (r.affectedRows > 0) percorsiInseriti++
      }
    }

    revalidatePath('/area-lavoro/listini')
    return { ok: true, aggiornati, percorsiInseriti }
  } finally { await db.end() }
}

export async function updateSchedaTecnica(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  const frontale   = (fd.get('profilo_frontale_mm')   as string)?.trim()
  const profondita = (fd.get('profilo_profondita_mm') as string)?.trim()
  const trasmitt   = (fd.get('trasmittanza_uw')       as string)?.trim()
  const logoUrl    = (fd.get('logo_url')              as string)?.trim()

  await ensureTable()
  const db = await getConnection()
  try {
    await db.execute(
      'UPDATE listini SET profilo_frontale_mm=?, profilo_profondita_mm=?, trasmittanza_uw=?, logo_url=? WHERE id=?',
      [
        frontale   ? parseFloat(frontale)   : null,
        profondita ? parseFloat(profondita) : null,
        trasmitt   ? parseFloat(trasmitt)   : null,
        logoUrl    ? logoUrl                : null,
        id,
      ]
    )
    revalidatePath('/area-lavoro/listini')
    return { ok: true }
  } finally { await db.end() }
}
