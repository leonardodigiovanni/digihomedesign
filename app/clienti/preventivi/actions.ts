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
  await db.execute(`ALTER TABLE preventivi ADD COLUMN sconto_cliente_pct DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE preventivo_articoli ADD COLUMN sconto_articolo_pct DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE preventivo_articoli ADD COLUMN parent_id INT NULL DEFAULT NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN sconto_articolo DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE clienti ADD COLUMN sconto_pct DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE preventivi MODIFY COLUMN stato ENUM('bozza','richiesto','inviato','accettato','rifiutato','scaduto','annullato') NOT NULL DEFAULT 'bozza'`).catch(() => {})
  await db.execute(`
    CREATE TABLE IF NOT EXISTS email_inbox (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      tipo       VARCHAR(60)  NOT NULL DEFAULT '',
      oggetto    VARCHAR(300) NOT NULL DEFAULT '',
      corpo      TEXT         NOT NULL,
      letto      TINYINT(1)   NOT NULL DEFAULT 0,
      created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `).catch(() => {})
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
  const dateStr = today.replace(/-/g, '')
  const numero = `${dateStr}-${String(id).padStart(6, '0')}`
  await db.execute('UPDATE preventivi SET numero = ? WHERE id = ?', [numero, id])
  await db.end()

  if (role === 'cliente') redirect(`/area-clienti/preventivi/${id}`)
  else redirect(`/clienti/preventivi/${id}`)
}

export type MutResult = { ok: true } | { ok: false; error: string }
export type GenResult = { ok: true; importo: number } | { ok: false; error: string }
export type InviaResult = { ok: true; cloneId: number } | { ok: false; error: string }

export async function eliminaPreventivo(id: number): Promise<MutResult> {
  await checkAccess()
  if (!id) return { ok: false, error: 'ID non valido.' }
  await ensureTables()
  const db = await getConnection()
  try {
    await db.execute('DELETE FROM preventivo_articoli WHERE preventivo_id = ?', [id])
    await db.execute('DELETE FROM preventivi WHERE id = ?', [id])
    revalidatePath('/clienti/preventivi')
    return { ok: true }
  } finally { await db.end() }
}

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

// Ricalcola importo con sconto cliente e aggiorna preventivi.
// Usa lo sconto già memorizzato in preventivi.sconto_cliente_pct (preserva override staff);
// lo inizializza da clienti.sconto_pct solo se è ancora 0.
async function ricalcolaTotaleConSconti(
  db: Awaited<ReturnType<typeof getConnection>>,
  preventivo_id: number
): Promise<void> {
  const [prevRows] = await db.query(
    'SELECT cliente_id, sconto_cliente_pct FROM preventivi WHERE id = ? LIMIT 1', [preventivo_id]
  ) as [{ cliente_id: number | null; sconto_cliente_pct: number }[], unknown]
  const clienteId = prevRows[0]?.cliente_id ?? null

  let scontoClientePct = Number(prevRows[0]?.sconto_cliente_pct ?? 0)
  if (scontoClientePct === 0 && clienteId) {
    const [cRows] = await db.query(
      'SELECT sconto_pct FROM clienti WHERE id = ? LIMIT 1', [clienteId]
    ) as [{ sconto_pct: number }[], unknown]
    scontoClientePct = Number(cRows[0]?.sconto_pct ?? 0)
  }

  const [rows] = await db.query(
    'SELECT COALESCE(SUM(prezzo_totale),0) AS totale FROM preventivo_articoli WHERE preventivo_id = ?',
    [preventivo_id]
  ) as [{ totale: number }[], unknown]
  const subtotale = Number(rows[0].totale)
  const importo   = Math.round(subtotale * (1 - scontoClientePct / 100) * 100) / 100

  await db.execute(
    'UPDATE preventivi SET importo = ?, sconto_cliente_pct = ? WHERE id = ?',
    [importo, scontoClientePct, preventivo_id]
  )
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
  let altezza_cm    = parseFloat(fd.get('altezza_cm')   as string) || 0
  let larghezza_cm  = parseFloat(fd.get('larghezza_cm') as string) || 0
  let n_ante        = parseInt(fd.get('n_ante')   as string) || 0
  let quantita      = parseInt(fd.get('quantita') as string) || 1
  const note        = ((fd.get('note') as string) ?? '').trim()
  const parent_id   = parseInt(fd.get('parent_id') as string) || null

  if (!preventivo_id || !tipo_prodotto)
    return { ok: false, error: 'Tipo prodotto obbligatorio.' }

  const db = await getConnection()
  let scontoArticoloPct = 0
  if (listino_id) {
    const [lRows] = await db.query(
      'SELECT sconto_articolo FROM listini WHERE id = ? LIMIT 1', [listino_id]
    ) as [{ sconto_articolo: number }[], unknown]
    scontoArticoloPct = Number(lRows[0]?.sconto_articolo ?? 0)
  }

  let prezzo = 0

  if (parent_id) {
    const [pRows] = await db.query(
      'SELECT larghezza_cm, altezza_cm, quantita, n_ante, prezzo_totale FROM preventivo_articoli WHERE id = ? LIMIT 1',
      [parent_id]
    ) as [{ larghezza_cm: number; altezza_cm: number; quantita: number; n_ante: number; prezzo_totale: number }[], unknown]
    const par = pRows[0]
    if (!par) { await db.end(); return { ok: false, error: 'Articolo padre non trovato.' } }

    larghezza_cm = Number(par.larghezza_cm)
    altezza_cm   = Number(par.altezza_cm)
    n_ante       = Number(par.n_ante)
    quantita     = 0

    const uLower = unita.toLowerCase()
    if (scontoArticoloPct !== 0) {
      prezzo = Math.round(-(Number(par.prezzo_totale) * scontoArticoloPct / 100) * 100) / 100
    } else if (uLower === 'm²' || uLower === 'mq' || uLower === 'm2') {
      const h = altezza_cm / 100
      const l = larghezza_cm / 100
      prezzo = Math.round(prezzo_base * h * l * Number(par.quantita) * 100) / 100
    }
  } else {
    const h  = altezza_cm  / 100
    const l  = larghezza_cm / 100
    const scontoFactor = 1 - scontoArticoloPct / 100
    if (unita === 'm²')      prezzo = prezzo_base * scontoFactor * h * l * quantita
    else if (unita === 'ml') prezzo = prezzo_base * scontoFactor * l * quantita
    else                     prezzo = prezzo_base * scontoFactor * quantita
    prezzo = Math.round(prezzo * 100) / 100
  }

  await db.execute(
    `INSERT INTO preventivo_articoli
     (preventivo_id, tipo_prodotto, marca, modello, listino_id, prezzo_base, unita,
      colore, tipo_vetro, accessori, altezza_cm, larghezza_cm, n_ante, quantita, prezzo_totale, note, sconto_articolo_pct, parent_id)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [preventivo_id, tipo_prodotto, marca, modello, listino_id, prezzo_base, unita,
     colore, tipo_vetro, accessori, altezza_cm, larghezza_cm, n_ante, quantita, prezzo, note, scontoArticoloPct, parent_id]
  )

  await ricalcolaTotaleConSconti(db, preventivo_id)
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
  await ricalcolaTotaleConSconti(db, preventivo_id)
  await db.end()
  revalidatePath(`/clienti/preventivi/${preventivo_id}`)
  return { ok: true }
}

export async function inoltroRichiesta(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAnyRole()
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''

  const preventivo_id = parseInt(fd.get('preventivo_id') as string)
  const email         = ((fd.get('email')     as string) ?? '').trim()
  const cellulare     = ((fd.get('cellulare') as string) ?? '').trim()
  const note          = ((fd.get('note')      as string) ?? '').trim()
  if (!preventivo_id) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()
  try {
    const [prevRows] = await db.query(
      'SELECT id, numero, stato, cliente_id FROM preventivi WHERE id = ? LIMIT 1', [preventivo_id]
    ) as [{ id: number; numero: string; stato: string; cliente_id: number | null }[], unknown]
    if (!prevRows[0]) return { ok: false, error: 'Preventivo non trovato.' }
    const prev = prevRows[0]
    if (prev.stato !== 'bozza') return { ok: false, error: 'Il preventivo non è più in bozza.' }

    if (role === 'cliente') {
      const [uRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const userEmail = uRows[0]?.email ?? ''
      const [cRows]  = await db.query('SELECT id FROM clienti WHERE email = ? LIMIT 1', [userEmail]) as [{ id: number }[], unknown]
      if (Number(prev.cliente_id) !== (cRows[0]?.id ?? null)) return { ok: false, error: 'Non autorizzato.' }
    }

    await db.execute('UPDATE preventivi SET stato = ? WHERE id = ?', ['richiesto', preventivo_id])

    const numero = prev.numero || `#${prev.id}`
    const righeCorpo = [
      `<strong>Richiesta preventivo N° ${numero}</strong><br/><br/>`,
      note      ? `<strong>Note del cliente:</strong><br/>${note.replace(/\n/g, '<br/>')}<br/><br/>` : '',
      `<strong>Contatti forniti:</strong><br/>`,
      email     ? `Email: ${email}<br/>` : '',
      cellulare ? `Cellulare: ${cellulare}<br/>` : '',
      `<br/><a href="/clienti/preventivi/${preventivo_id}" style="color:#1a4a8a;font-weight:bold;">Apri preventivo →</a>`,
    ].join('')
    await db.execute(
      'INSERT INTO email_inbox (tipo, oggetto, corpo, letto) VALUES (?,?,?,0)',
      ['richiesta_preventivo', `Richiesta preventivo N° ${numero}`, righeCorpo]
    )

    revalidatePath(`/clienti/preventivi/${preventivo_id}`)
    revalidatePath(`/area-clienti/preventivi/${preventivo_id}`)
    return { ok: true }
  } finally { await db.end() }
}

export async function modificaArticolo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const id            = parseInt(fd.get('id') as string)
  const preventivo_id = parseInt(fd.get('preventivo_id') as string)
  const altezza_cm    = parseFloat(fd.get('altezza_cm')   as string) || 0
  const larghezza_cm  = parseFloat(fd.get('larghezza_cm') as string) || 0
  const n_ante        = parseInt(fd.get('n_ante')    as string) || 1
  const quantita      = parseInt(fd.get('quantita')  as string) || 1
  const prezzo_base   = parseFloat(fd.get('prezzo_base')         as string) || 0
  const sconto_art    = parseFloat(fd.get('sconto_articolo_pct') as string) || 0
  const note          = ((fd.get('note') as string) ?? '').trim()

  if (!id || !preventivo_id) return { ok: false, error: 'Dati mancanti.' }

  await ensureTables()
  const db = await getConnection()
  try {
    const [artRows] = await db.query(
      'SELECT unita FROM preventivo_articoli WHERE id = ? LIMIT 1', [id]
    ) as [{ unita: string }[], unknown]
    const unita = artRows[0]?.unita ?? 'pz'

    const h = altezza_cm / 100
    const l = larghezza_cm / 100
    const factor = 1 - sconto_art / 100
    let prezzo = 0
    if (unita === 'm²')      prezzo = prezzo_base * factor * h * l * quantita
    else if (unita === 'ml') prezzo = prezzo_base * factor * l * quantita
    else                     prezzo = prezzo_base * factor * quantita
    prezzo = Math.round(prezzo * 100) / 100

    await db.execute(
      `UPDATE preventivo_articoli
       SET altezza_cm=?, larghezza_cm=?, n_ante=?, quantita=?,
           prezzo_base=?, sconto_articolo_pct=?, prezzo_totale=?, note=?
       WHERE id=? AND preventivo_id=?`,
      [altezza_cm, larghezza_cm, n_ante, quantita, prezzo_base, sconto_art, prezzo, note || null, id, preventivo_id]
    )

    // Aggiorna figli: ereditano le nuove dimensioni e ricalcolano il loro contributo
    const [childRows] = await db.query(
      'SELECT id, unita, prezzo_base AS pb, sconto_articolo_pct AS scp FROM preventivo_articoli WHERE parent_id = ? AND preventivo_id = ?',
      [id, preventivo_id]
    ) as [{ id: number; unita: string; pb: number; scp: number }[], unknown]
    for (const child of childRows) {
      const uLower = (child.unita ?? '').toLowerCase()
      let childPrezzo = 0
      const childSconto = Number(child.scp ?? 0)
      if (childSconto !== 0) {
        childPrezzo = Math.round(-(prezzo * childSconto / 100) * 100) / 100
      } else if (uLower === 'm²' || uLower === 'mq' || uLower === 'm2') {
        childPrezzo = Math.round(Number(child.pb) * h * l * quantita * 100) / 100
      }
      await db.execute(
        'UPDATE preventivo_articoli SET larghezza_cm=?, altezza_cm=?, n_ante=?, prezzo_totale=? WHERE id=?',
        [larghezza_cm, altezza_cm, n_ante, childPrezzo, child.id]
      )
    }

    await ricalcolaTotaleConSconti(db, preventivo_id)
    revalidatePath(`/clienti/preventivi/${preventivo_id}`)
    revalidatePath(`/area-clienti/preventivi/${preventivo_id}/stampa`)
    return { ok: true }
  } finally { await db.end() }
}

export async function aggiornaSconto(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const preventivo_id     = parseInt(fd.get('preventivo_id')     as string)
  const sconto_cliente_pct = parseFloat(fd.get('sconto_cliente_pct') as string) || 0
  if (!preventivo_id) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()
  try {
    const [rows] = await db.query(
      'SELECT COALESCE(SUM(prezzo_totale),0) AS totale FROM preventivo_articoli WHERE preventivo_id = ?',
      [preventivo_id]
    ) as [{ totale: number }[], unknown]
    const subtotale = Number(rows[0].totale)
    const importo   = Math.round(subtotale * (1 - sconto_cliente_pct / 100) * 100) / 100
    await db.execute(
      'UPDATE preventivi SET sconto_cliente_pct=?, importo=? WHERE id=?',
      [sconto_cliente_pct, importo, preventivo_id]
    )
    revalidatePath(`/clienti/preventivi/${preventivo_id}`)
    revalidatePath(`/area-clienti/preventivi/${preventivo_id}/stampa`)
    return { ok: true }
  } finally { await db.end() }
}

export async function inviaAlCliente(_: InviaResult | null, fd: FormData): Promise<InviaResult> {
  await checkAccess()

  const preventivo_id = parseInt(fd.get('preventivo_id') as string)
  if (!preventivo_id) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()
  try {
    const [prevRows] = await db.query(
      'SELECT * FROM preventivi WHERE id = ? LIMIT 1', [preventivo_id]
    ) as [Record<string, unknown>[], unknown]
    if (!prevRows[0]) return { ok: false, error: 'Preventivo non trovato.' }
    const prev = prevRows[0]
    if (prev.stato !== 'bozza' && prev.stato !== 'richiesto')
      return { ok: false, error: 'Stato non valido per l\'invio.' }

    // Marca originale come annullato
    await db.execute('UPDATE preventivi SET stato = ? WHERE id = ?', ['annullato', preventivo_id])

    // Crea clone con stato inviato
    const today = new Date().toISOString().slice(0, 10)
    const [cloneResult] = await db.execute(
      `INSERT INTO preventivi (numero, cliente_id, descrizione, stato, importo, data, validita_giorni, note, visibile_cliente, sconto_cliente_pct)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      ['', prev.cliente_id != null ? Number(prev.cliente_id) : null,
       prev.descrizione != null ? String(prev.descrizione) : null,
       'inviato', Number(prev.importo), today, Number(prev.validita_giorni),
       prev.note != null ? String(prev.note) : null,
       Number(prev.visibile_cliente), Number(prev.sconto_cliente_pct ?? 0)] as (string | number | null)[]
    ) as [{ insertId: number }, unknown]
    const cloneId = cloneResult.insertId
    const dateStr = today.replace(/-/g, '')
    const cloneNumero = `${dateStr}-${String(cloneId).padStart(6, '0')}`
    await db.execute('UPDATE preventivi SET numero = ? WHERE id = ?', [cloneNumero, cloneId])

    // Clona articoli preservando la gerarchia padre/figlio
    const [artRows] = await db.query(
      'SELECT * FROM preventivo_articoli WHERE preventivo_id = ? ORDER BY id ASC', [preventivo_id]
    ) as [Record<string, unknown>[], unknown]

    const idMap = new Map<number, number>() // old_id → new_id

    // Prima passata: root (parent_id NULL) — ottieni il nuovo insertId
    for (const a of artRows as Record<string, unknown>[]) {
      if (a.parent_id != null) continue
      const [res] = await db.execute(
        `INSERT INTO preventivo_articoli (preventivo_id, tipo_prodotto, marca, modello, listino_id, prezzo_base, unita,
         colore, tipo_vetro, accessori, altezza_cm, larghezza_cm, n_ante, quantita, prezzo_totale, note, sconto_articolo_pct, parent_id)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [cloneId, String(a.tipo_prodotto ?? ''), String(a.marca ?? ''), String(a.modello ?? ''),
         a.listino_id != null ? Number(a.listino_id) : null,
         Number(a.prezzo_base), String(a.unita ?? 'pz'),
         String(a.colore ?? ''), String(a.tipo_vetro ?? ''), String(a.accessori ?? ''),
         Number(a.altezza_cm), Number(a.larghezza_cm), Number(a.n_ante),
         Number(a.quantita), Number(a.prezzo_totale),
         a.note != null ? String(a.note) : null,
         Number(a.sconto_articolo_pct ?? 0), null] as (string | number | null)[]
      ) as [{ insertId: number }, unknown]
      idMap.set(Number(a.id), res.insertId)
    }

    // Seconda passata: figli — usa il nuovo ID del padre
    for (const a of artRows as Record<string, unknown>[]) {
      if (a.parent_id == null) continue
      const newParentId = idMap.get(Number(a.parent_id)) ?? null
      await db.execute(
        `INSERT INTO preventivo_articoli (preventivo_id, tipo_prodotto, marca, modello, listino_id, prezzo_base, unita,
         colore, tipo_vetro, accessori, altezza_cm, larghezza_cm, n_ante, quantita, prezzo_totale, note, sconto_articolo_pct, parent_id)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [cloneId, String(a.tipo_prodotto ?? ''), String(a.marca ?? ''), String(a.modello ?? ''),
         a.listino_id != null ? Number(a.listino_id) : null,
         Number(a.prezzo_base), String(a.unita ?? 'pz'),
         String(a.colore ?? ''), String(a.tipo_vetro ?? ''), String(a.accessori ?? ''),
         Number(a.altezza_cm), Number(a.larghezza_cm), Number(a.n_ante),
         Number(a.quantita), Number(a.prezzo_totale),
         a.note != null ? String(a.note) : null,
         Number(a.sconto_articolo_pct ?? 0), newParentId] as (string | number | null)[]
      )
    }

    // Email al cliente
    let clienteEmail = '', clienteNome = ''
    if (prev.cliente_id) {
      const [cRows] = await db.query(
        'SELECT email, nome, cognome, ragione_sociale FROM clienti WHERE id = ? LIMIT 1', [prev.cliente_id]
      ) as [{ email: string; nome: string; cognome: string; ragione_sociale: string }[], unknown]
      if (cRows[0]) {
        clienteEmail = cRows[0].email ?? ''
        clienteNome  = (cRows[0].ragione_sociale || `${cRows[0].nome ?? ''} ${cRows[0].cognome ?? ''}`.trim()).trim()
      }
    }

    if (clienteEmail) {
      const { sendEmail } = await import('@/lib/email')
      await sendEmail(
        clienteEmail,
        `Il tuo preventivo N° ${cloneNumero} è pronto`,
        `<p>Gentile ${clienteNome || 'Cliente'},</p>
<p>Il preventivo <strong>N° ${cloneNumero}</strong> che hai richiesto è pronto nella tua area personale.</p>
<p><a href="/area-clienti/preventivi/${cloneId}" style="color:#1a4a8a;font-weight:bold;">Visualizza il preventivo →</a></p>
<br/><p style="color:#888;font-size:12px;">Digi Home Design S.r.l.</p>`
      )
    }

    await db.execute(
      'INSERT INTO email_inbox (tipo, oggetto, corpo, letto) VALUES (?,?,?,1)',
      [
        'preventivo_inviato',
        `Preventivo N° ${cloneNumero} inviato a ${clienteNome || '—'}`,
        `Preventivo inviato a <strong>${clienteNome || '—'}</strong> (${clienteEmail || '—'}).<br/><br/><a href="/clienti/preventivi/${cloneId}" style="color:#1a4a8a;font-weight:bold;">Apri preventivo →</a>`,
      ]
    )

    revalidatePath('/clienti/preventivi')
    revalidatePath(`/clienti/preventivi/${preventivo_id}`)
    revalidatePath(`/clienti/preventivi/${cloneId}`)
    revalidatePath(`/area-clienti/preventivi/${preventivo_id}`)
    revalidatePath(`/area-clienti/preventivi/${cloneId}`)
    return { ok: true, cloneId }
  } finally { await db.end() }
}

export async function accettaPreventivo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAnyRole()
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''

  const preventivo_id = parseInt(fd.get('preventivo_id') as string)
  if (!preventivo_id) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()
  try {
    const [prevRows] = await db.query(
      'SELECT id, numero, stato, cliente_id FROM preventivi WHERE id = ? LIMIT 1', [preventivo_id]
    ) as [{ id: number; numero: string; stato: string; cliente_id: number | null }[], unknown]
    if (!prevRows[0]) return { ok: false, error: 'Preventivo non trovato.' }
    const prev = prevRows[0]
    if (prev.stato !== 'inviato') return { ok: false, error: 'Il preventivo non è in stato inviato.' }

    if (role === 'cliente') {
      const [uRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const userEmail = uRows[0]?.email ?? ''
      const [cRows]  = await db.query('SELECT id FROM clienti WHERE email = ? LIMIT 1', [userEmail]) as [{ id: number }[], unknown]
      if (Number(prev.cliente_id) !== (cRows[0]?.id ?? null)) return { ok: false, error: 'Non autorizzato.' }
    }

    await db.execute('UPDATE preventivi SET stato = ? WHERE id = ?', ['accettato', preventivo_id])
    const numero = prev.numero || `#${prev.id}`
    await db.execute(
      'INSERT INTO email_inbox (tipo, oggetto, corpo, letto) VALUES (?,?,?,0)',
      [
        'preventivo_accettato',
        `Preventivo N° ${numero} accettato`,
        `Il cliente ha <strong>accettato</strong> il preventivo <strong>N° ${numero}</strong>.<br/><br/><a href="/clienti/preventivi/${preventivo_id}" style="color:#1a4a8a;font-weight:bold;">Apri preventivo →</a>`,
      ]
    )
    revalidatePath(`/clienti/preventivi/${preventivo_id}`)
    revalidatePath(`/area-clienti/preventivi/${preventivo_id}`)
    return { ok: true }
  } finally { await db.end() }
}

export async function rifiutaPreventivo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAnyRole()
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''

  const preventivo_id = parseInt(fd.get('preventivo_id') as string)
  if (!preventivo_id) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()
  try {
    const [prevRows] = await db.query(
      'SELECT id, numero, stato, cliente_id FROM preventivi WHERE id = ? LIMIT 1', [preventivo_id]
    ) as [{ id: number; numero: string; stato: string; cliente_id: number | null }[], unknown]
    if (!prevRows[0]) return { ok: false, error: 'Preventivo non trovato.' }
    const prev = prevRows[0]
    if (prev.stato !== 'inviato') return { ok: false, error: 'Il preventivo non è in stato inviato.' }

    if (role === 'cliente') {
      const [uRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const userEmail = uRows[0]?.email ?? ''
      const [cRows]  = await db.query('SELECT id FROM clienti WHERE email = ? LIMIT 1', [userEmail]) as [{ id: number }[], unknown]
      if (Number(prev.cliente_id) !== (cRows[0]?.id ?? null)) return { ok: false, error: 'Non autorizzato.' }
    }

    await db.execute('UPDATE preventivi SET stato = ? WHERE id = ?', ['rifiutato', preventivo_id])
    const numero = prev.numero || `#${prev.id}`
    await db.execute(
      'INSERT INTO email_inbox (tipo, oggetto, corpo, letto) VALUES (?,?,?,0)',
      [
        'preventivo_rifiutato',
        `Preventivo N° ${numero} rifiutato`,
        `Il cliente ha <strong>rifiutato</strong> il preventivo <strong>N° ${numero}</strong>.<br/><br/><a href="/clienti/preventivi/${preventivo_id}" style="color:#1a4a8a;font-weight:bold;">Apri preventivo →</a>`,
      ]
    )
    revalidatePath(`/clienti/preventivi/${preventivo_id}`)
    revalidatePath(`/area-clienti/preventivi/${preventivo_id}`)
    return { ok: true }
  } finally { await db.end() }
}

export async function annullaPreventivo(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()

  const preventivo_id = parseInt(fd.get('preventivo_id') as string)
  if (!preventivo_id) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()
  try {
    const [prevRows] = await db.query(
      'SELECT id, stato FROM preventivi WHERE id = ? LIMIT 1', [preventivo_id]
    ) as [{ id: number; stato: string }[], unknown]
    if (!prevRows[0]) return { ok: false, error: 'Preventivo non trovato.' }
    if (prevRows[0].stato === 'annullato') return { ok: false, error: 'Già annullato.' }

    await db.execute('UPDATE preventivi SET stato = ? WHERE id = ?', ['annullato', preventivo_id])
    revalidatePath(`/clienti/preventivi/${preventivo_id}`)
    revalidatePath(`/area-clienti/preventivi/${preventivo_id}`)
    return { ok: true }
  } finally { await db.end() }
}

export async function generaPreventivo(_: GenResult | null, fd: FormData): Promise<GenResult> {
  await checkAnyRole()

  const preventivo_id = parseInt(fd.get('preventivo_id') as string)
  if (!preventivo_id) return { ok: false, error: 'ID non valido.' }

  await ensureTables()
  const db = await getConnection()

  // Leggo cliente_id per recuperare lo sconto cliente
  const [prevRows] = await db.query(
    'SELECT cliente_id FROM preventivi WHERE id = ? LIMIT 1',
    [preventivo_id]
  ) as [{ cliente_id: number | null }[], unknown]
  const clienteId = prevRows[0]?.cliente_id ?? null

  let scontoClientePct = 0
  if (clienteId) {
    const [cRows] = await db.query(
      'SELECT sconto_pct FROM clienti WHERE id = ? LIMIT 1',
      [clienteId]
    ) as [{ sconto_pct: number }[], unknown]
    scontoClientePct = Number(cRows[0]?.sconto_pct ?? 0)
  }

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
    const listinoId = a.listino_id != null ? Number(a.listino_id) : null

    // Sconto articolo dal listino (snapshot)
    let scontoArticoloPct = 0
    if (listinoId) {
      const [lRows] = await db.query(
        'SELECT sconto_articolo FROM listini WHERE id = ? LIMIT 1',
        [listinoId]
      ) as [{ sconto_articolo: number }[], unknown]
      scontoArticoloPct = Number(lRows[0]?.sconto_articolo ?? 0)
    }

    const scontoFactor = 1 - scontoArticoloPct / 100
    let prezzo = 0
    if (u === 'm²')      prezzo = pb * scontoFactor * h * l * q
    else if (u === 'ml') prezzo = pb * scontoFactor * l * q
    else                 prezzo = pb * scontoFactor * q

    prezzo = Math.round(prezzo * 100) / 100
    await db.execute(
      'UPDATE preventivo_articoli SET prezzo_totale = ?, sconto_articolo_pct = ? WHERE id = ?',
      [prezzo, scontoArticoloPct, Number(a.id)]
    )
    totale += prezzo
  }

  totale = Math.round(totale * 100) / 100
  const importo_scontato = Math.round(totale * (1 - scontoClientePct / 100) * 100) / 100

  await db.execute(
    'UPDATE preventivi SET importo = ?, sconto_cliente_pct = ? WHERE id = ?',
    [importo_scontato, scontoClientePct, preventivo_id]
  )
  await db.end()
  revalidatePath(`/clienti/preventivi/${preventivo_id}`)
  return { ok: true, importo: importo_scontato }
}
