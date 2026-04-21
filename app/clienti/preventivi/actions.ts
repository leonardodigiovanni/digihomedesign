'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'

async function checkAccess() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente') redirect('/')
}

async function checkAnyRole() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (!role) redirect('/')
}

async function ensureTables() {
  const db = await getConnection()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS preventivi (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      numero           VARCHAR(50)   NOT NULL DEFAULT '',
      cliente_id       INT           NULL,
      descrizione      TEXT          NULL,
      stato            ENUM('bozza','inviato','accettato','rifiutato','scaduto') NOT NULL DEFAULT 'bozza',
      importo          DECIMAL(10,2) NOT NULL DEFAULT 0,
      data             DATE          NOT NULL,
      validita_giorni  INT           NOT NULL DEFAULT 30,
      note             TEXT          NULL,
      visibile_cliente TINYINT(1)    NOT NULL DEFAULT 1,
      created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS preventivo_articoli (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      preventivo_id  INT NOT NULL,
      tipo_prodotto  VARCHAR(100) NOT NULL,
      marca          VARCHAR(100) NOT NULL DEFAULT '',
      modello        VARCHAR(300) NOT NULL DEFAULT '',
      listino_id     INT NULL,
      prezzo_base    DECIMAL(10,2) NOT NULL DEFAULT 0,
      unita          VARCHAR(30) NOT NULL DEFAULT 'pz',
      colore         VARCHAR(100) NOT NULL DEFAULT '',
      tipo_vetro     VARCHAR(100) NOT NULL DEFAULT '',
      accessori      TEXT NULL,
      altezza_cm     DECIMAL(7,2) NOT NULL DEFAULT 0,
      larghezza_cm   DECIMAL(7,2) NOT NULL DEFAULT 0,
      n_ante         INT NOT NULL DEFAULT 1,
      quantita       INT NOT NULL DEFAULT 1,
      prezzo_totale  DECIMAL(10,2) NOT NULL DEFAULT 0,
      note           TEXT NULL,
      created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.end()
}

export async function creaPreventivo() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  await ensureTables()
  const db = await getConnection()
  const today = new Date().toISOString().slice(0, 10)

  let cliente_id: number | null = null
  if (role === 'cliente') {
    const [uRows] = await db.query(
      'SELECT email FROM users WHERE username = ? LIMIT 1', [username]
    ) as [{ email: string }[], unknown]
    const email = uRows[0]?.email ?? ''
    if (email) {
      const [cRows] = await db.query(
        'SELECT id FROM clienti WHERE email = ? LIMIT 1', [email]
      ) as [{ id: number }[], unknown]
      cliente_id = cRows[0]?.id ?? null
    }
  }

  const [result] = await db.execute(
    'INSERT INTO preventivi (numero, descrizione, stato, importo, data, validita_giorni, cliente_id) VALUES (?,?,?,?,?,?,?)',
    ['', 'Nuovo preventivo', 'bozza', 0, today, 30, cliente_id]
  ) as [{ insertId: number }, unknown]
  const id = result.insertId
  await db.end()

  if (role === 'cliente') redirect(`/area-clienti/preventivi/${id}`)
  else redirect(`/clienti/preventivi/${id}`)
}

export type MutResult = { ok: true } | { ok: false; error: string }
export type GenResult = { ok: true; importo: number } | { ok: false; error: string }

export async function aggiornaDatiPreventivo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAnyRole()

  const preventivo_id  = parseInt(fd.get('preventivo_id') as string)
  const descrizione    = ((fd.get('descrizione') as string) ?? '').trim()
  const note           = ((fd.get('note')        as string) ?? '').trim()
  if (!preventivo_id) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()
  await db.execute('UPDATE preventivi SET descrizione = ?, note = ? WHERE id = ?', [descrizione || null, note || null, preventivo_id])
  await db.end()
  revalidatePath(`/clienti/preventivi/${preventivo_id}`)
  return { ok: true }
}

export async function associaCliente(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const preventivo_id = parseInt(fd.get('preventivo_id') as string)
  const cliente_id    = parseInt(fd.get('cliente_id')    as string) || null
  if (!preventivo_id) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()
  await db.execute('UPDATE preventivi SET cliente_id = ? WHERE id = ?', [cliente_id, preventivo_id])
  await db.end()
  revalidatePath(`/clienti/preventivi/${preventivo_id}`)
  return { ok: true }
}

export async function aggiungiArticolo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAnyRole()
  await ensureTables()

  const preventivo_id = parseInt(fd.get('preventivo_id') as string)
  const tipo_prodotto = ((fd.get('tipo_prodotto') as string) ?? '').trim()
  const marca         = ((fd.get('marca')         as string) ?? '').trim()
  const modello       = ((fd.get('modello')       as string) ?? '').trim()
  const listino_id    = parseInt(fd.get('listino_id') as string) || null
  const prezzo_base   = parseFloat(fd.get('prezzo_base') as string) || 0
  const unita         = ((fd.get('unita')         as string) ?? 'pz').trim()
  const colore        = ((fd.get('colore')        as string) ?? '').trim()
  const tipo_vetro    = ((fd.get('tipo_vetro')    as string) ?? '').trim()
  const accessori     = ((fd.get('accessori')     as string) ?? '').trim()
  const altezza_cm    = parseFloat(fd.get('altezza_cm')   as string) || 0
  const larghezza_cm  = parseFloat(fd.get('larghezza_cm') as string) || 0
  const n_ante        = parseInt(fd.get('n_ante')   as string) || 1
  const quantita      = parseInt(fd.get('quantita') as string) || 1
  const note          = ((fd.get('note') as string) ?? '').trim()

  if (!preventivo_id || !tipo_prodotto)
    return { ok: false, error: 'Tipo prodotto obbligatorio.' }

  const db = await getConnection()
  await db.execute(
    `INSERT INTO preventivo_articoli
     (preventivo_id, tipo_prodotto, marca, modello, listino_id, prezzo_base, unita,
      colore, tipo_vetro, accessori, altezza_cm, larghezza_cm, n_ante, quantita, note)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [preventivo_id, tipo_prodotto, marca, modello, listino_id, prezzo_base, unita,
     colore, tipo_vetro, accessori, altezza_cm, larghezza_cm, n_ante, quantita, note]
  )
  await db.end()
  revalidatePath(`/clienti/preventivi/${preventivo_id}`)
  return { ok: true }
}

export async function rimuoviArticolo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAnyRole()

  const id            = parseInt(fd.get('id') as string)
  const preventivo_id = parseInt(fd.get('preventivo_id') as string)
  if (!id || !preventivo_id) return { ok: false, error: 'Dati mancanti.' }

  await ensureTables()
  const db = await getConnection()
  await db.execute('DELETE FROM preventivo_articoli WHERE id = ? AND preventivo_id = ?', [id, preventivo_id])
  await db.end()
  revalidatePath(`/clienti/preventivi/${preventivo_id}`)
  return { ok: true }
}

export async function generaPreventivo(_: GenResult | null, fd: FormData): Promise<GenResult> {
  await checkAnyRole()

  const preventivo_id = parseInt(fd.get('preventivo_id') as string)
  if (!preventivo_id) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()

  const [articoli] = await db.query(
    'SELECT * FROM preventivo_articoli WHERE preventivo_id = ?',
    [preventivo_id]
  ) as [Record<string, unknown>[], unknown]

  if ((articoli as unknown[]).length === 0) {
    await db.end()
    return { ok: false, error: 'Nessun articolo nel preventivo.' }
  }

  let totale = 0
  for (const a of articoli) {
    const h  = Number(a.altezza_cm)  / 100
    const l  = Number(a.larghezza_cm) / 100
    const q  = Number(a.quantita)
    const pb = Number(a.prezzo_base)
    const u  = String(a.unita)

    let prezzo = 0
    if (u === 'm²')      prezzo = pb * h * l * q
    else if (u === 'ml') prezzo = pb * l * q
    else                 prezzo = pb * q

    prezzo = Math.round(prezzo * 100) / 100
    await db.execute('UPDATE preventivo_articoli SET prezzo_totale = ? WHERE id = ?', [prezzo, Number(a.id)])
    totale += prezzo
  }

  totale = Math.round(totale * 100) / 100
  await db.execute('UPDATE preventivi SET importo = ? WHERE id = ?', [totale, preventivo_id])
  await db.end()
  revalidatePath(`/clienti/preventivi/${preventivo_id}`)
  return { ok: true, importo: totale }
}
