'use server'

import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { sendSms } from '@/lib/sms'

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

async function ensureTable(conn: Awaited<ReturnType<typeof getConnection>>) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS completamento_profilo (
      id INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL,
      nome VARCHAR(100) NOT NULL DEFAULT '',
      cognome VARCHAR(100) NOT NULL DEFAULT '',
      nuova_email VARCHAR(255) NOT NULL DEFAULT '',
      nuova_cellulare VARCHAR(20) NOT NULL DEFAULT '',
      email_code CHAR(6) NOT NULL DEFAULT '',
      phone_code CHAR(6) NOT NULL DEFAULT '',
      email_verificata TINYINT(1) NOT NULL DEFAULT 0,
      phone_verificato TINYINT(1) NOT NULL DEFAULT 0,
      expires_at TIMESTAMP NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY uq_username (username)
    )
  `)
}

async function getUsername(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('session_user')?.value ?? null
}

export type AvviaResult =
  | { ok: true; saved: true }
  | { ok: true; saved: false; pendingId: number; needsEmail: boolean; needsSms: boolean }
  | { ok: false; error: string }

export type VerificaResult = { ok: true } | { ok: false; error: string }

// ─── Step 1: salva o avvia verifiche ─────────────────────────────────────────

export async function avviaCompletamento(_prev: AvviaResult | null, fd: FormData): Promise<AvviaResult> {
  const username = await getUsername()
  if (!username) return { ok: false, error: 'Sessione scaduta. Accedi di nuovo.' }

  const nome     = (fd.get('nome')     as string ?? '').trim()
  const cognome  = (fd.get('cognome')  as string ?? '').trim()
  const email    = (fd.get('email')    as string ?? '').trim().toLowerCase()
  const cellulare = (fd.get('cellulare') as string ?? '').trim()

  if (!nome || !cognome) return { ok: false, error: 'Nome e cognome sono obbligatori.' }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Indirizzo email non valido.' }
  }
  if (cellulare && !/^\+?[\d\s\-]{8,15}$/.test(cellulare)) {
    return { ok: false, error: 'Numero di cellulare non valido.' }
  }

  const conn = await getConnection()
  try {
    await ensureTable(conn)

    const [curRows] = await conn.execute(
      'SELECT nome, cognome, email, cellulare FROM users WHERE username = ? LIMIT 1', [username]
    ) as [{ nome: string; cognome: string; email: string; cellulare: string }[], unknown]
    const cur = curRows[0]
    if (!cur) return { ok: false, error: 'Utente non trovato.' }

    const emailChanged   = email    && email    !== (cur.email    ?? '')
    const cellChanged    = cellulare && cellulare !== (cur.cellulare ?? '')

    // Unicità email
    if (emailChanged) {
      const [byEmail] = await conn.execute('SELECT id FROM users WHERE email = ? AND username != ?', [email, username]) as [{ id: number }[], unknown]
      if (byEmail.length > 0) return { ok: false, error: 'Email già in uso da un altro account.' }
    }
    // Unicità cellulare
    if (cellChanged) {
      const [byCel] = await conn.execute('SELECT id FROM users WHERE cellulare = ? AND username != ?', [cellulare, username]) as [{ id: number }[], unknown]
      if (byCel.length > 0) return { ok: false, error: 'Numero di cellulare già registrato.' }
    }

    // Se nessuna verifica necessaria → salva direttamente
    if (!emailChanged && !cellChanged) {
      await conn.execute(
        'UPDATE users SET nome = ?, cognome = ? WHERE username = ?',
        [nome, cognome, username]
      )
      await conn.execute(
        `UPDATE clienti SET nome = ?, cognome = ?
         WHERE id = (SELECT cliente_id FROM users WHERE username = ? LIMIT 1)`,
        [nome, cognome, username]
      ).catch(() => {})
      const cookieStore = await cookies()
      cookieStore.delete('profilo_incompleto')
      return { ok: true, saved: true }
    }

    // Prepara codici OTP
    const emailCode = emailChanged ? randomCode() : ''
    const phoneCode = cellChanged  ? randomCode() : ''
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await conn.execute(
      `INSERT INTO completamento_profilo
         (username, nome, cognome, nuova_email, nuova_cellulare, email_code, phone_code, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         nome=VALUES(nome), cognome=VALUES(cognome),
         nuova_email=VALUES(nuova_email), nuova_cellulare=VALUES(nuova_cellulare),
         email_code=VALUES(email_code), phone_code=VALUES(phone_code),
         email_verificata=0, phone_verificato=0, expires_at=VALUES(expires_at)`,
      [username, nome, cognome, email || '', cellulare || '', emailCode, phoneCode, expiresAt]
    )

    const [insRow] = await conn.execute(
      'SELECT id FROM completamento_profilo WHERE username = ?', [username]
    ) as [{ id: number }[], unknown]
    const pendingId = insRow[0].id

    if (emailChanged) {
      await sendEmail(email, 'Verifica email — DIGI Home Design', `
        <p>Ciao ${nome},</p>
        <p>Il tuo codice di verifica email è: <strong>${emailCode}</strong></p>
        <p>Scade tra 15 minuti.</p>
      `)
    }
    if (cellChanged) {
      await sendSms(cellulare, `DIGI Home Design - Codice verifica: ${phoneCode}`)
    }

    return { ok: true, saved: false, pendingId, needsEmail: !!emailChanged, needsSms: !!cellChanged }
  } finally {
    await conn.end()
  }
}

// ─── Step 2a: verifica email ──────────────────────────────────────────────────

export async function verificaEmailCompletamento(pendingId: number, code: string): Promise<VerificaResult & { needsSms?: boolean }> {
  const conn = await getConnection()
  try {
    await ensureTable(conn)
    const [rows] = await conn.execute(
      'SELECT * FROM completamento_profilo WHERE id = ?', [pendingId]
    ) as [Record<string, unknown>[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Sessione non trovata.' }

    const row = rows[0] as {
      email_code: string; phone_code: string; expires_at: Date
      nuova_cellulare: string; email_verificata: number
    }

    if (new Date() > new Date(row.expires_at)) return { ok: false, error: 'Codice scaduto.' }
    if (row.email_code !== code.trim()) return { ok: false, error: 'Codice non corretto.' }

    await conn.execute('UPDATE completamento_profilo SET email_verificata = 1 WHERE id = ?', [pendingId])

    const needsSms = !!row.nuova_cellulare && !row.phone_code === false && row.phone_code !== ''
    return { ok: true, needsSms }
  } finally {
    await conn.end()
  }
}

// ─── Step 2b: verifica SMS ────────────────────────────────────────────────────

export async function verificaSmsCompletamento(pendingId: number, code: string): Promise<VerificaResult> {
  const conn = await getConnection()
  try {
    await ensureTable(conn)
    const [rows] = await conn.execute(
      'SELECT * FROM completamento_profilo WHERE id = ?', [pendingId]
    ) as [Record<string, unknown>[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Sessione non trovata.' }

    const row = rows[0] as {
      username: string; nome: string; cognome: string
      nuova_email: string; nuova_cellulare: string
      phone_code: string; expires_at: Date; email_verificata: number
    }

    if (new Date() > new Date(row.expires_at)) return { ok: false, error: 'Codice scaduto.' }
    if (row.phone_code !== code.trim()) return { ok: false, error: 'Codice non corretto.' }

    await conn.execute('UPDATE completamento_profilo SET phone_verificato = 1 WHERE id = ?', [pendingId])
    await salvaCompletamento(conn, pendingId)
    return { ok: true }
  } finally {
    await conn.end()
  }
}

// ─── Salva dopo verifiche ─────────────────────────────────────────────────────

async function salvaCompletamento(conn: Awaited<ReturnType<typeof getConnection>>, pendingId: number) {
  const [rows] = await conn.execute(
    'SELECT * FROM completamento_profilo WHERE id = ?', [pendingId]
  ) as [Record<string, unknown>[], unknown]
  if (rows.length === 0) return

  const row = rows[0] as {
    username: string; nome: string; cognome: string
    nuova_email: string; nuova_cellulare: string
  }

  const updates: string[] = ['nome = ?', 'cognome = ?']
  const params: unknown[] = [row.nome, row.cognome]

  if (row.nuova_email) {
    updates.push('email = ?', 'email_verificata = 1')
    params.push(row.nuova_email)
  }
  if (row.nuova_cellulare) {
    updates.push('cellulare = ?', 'cellulare_verificato = 1')
    params.push(row.nuova_cellulare)
  }

  params.push(row.username)
  await conn.execute(`UPDATE users SET ${updates.join(', ')} WHERE username = ?`, params as string[])

  await conn.execute(
    `UPDATE clienti SET nome = ?, cognome = ?
     WHERE id = (SELECT cliente_id FROM users WHERE username = ? LIMIT 1)`,
    [row.nome, row.cognome, row.username]
  ).catch(() => {})

  await conn.execute('DELETE FROM completamento_profilo WHERE id = ?', [pendingId])
  const cookieStore = await cookies()
  cookieStore.delete('profilo_incompleto')
}

// ─── Chiamata dopo verifica email senza SMS ───────────────────────────────────

export async function finalizzaDopoEmail(pendingId: number): Promise<VerificaResult> {
  const conn = await getConnection()
  try {
    await ensureTable(conn)
    const [rows] = await conn.execute(
      'SELECT email_verificata, phone_code FROM completamento_profilo WHERE id = ?', [pendingId]
    ) as [{ email_verificata: number; phone_code: string }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Sessione non trovata.' }
    if (!rows[0].email_verificata) return { ok: false, error: 'Email non ancora verificata.' }
    if (rows[0].phone_code) return { ok: false, error: 'SMS non ancora verificato.' }
    await salvaCompletamento(conn, pendingId)
    return { ok: true }
  } finally {
    await conn.end()
  }
}

// ─── Reinvio codici ───────────────────────────────────────────────────────────

export async function reinviaEmailCompletamento(pendingId: number): Promise<VerificaResult> {
  const conn = await getConnection()
  try {
    await ensureTable(conn)
    const [rows] = await conn.execute(
      'SELECT nuova_email, nome FROM completamento_profilo WHERE id = ?', [pendingId]
    ) as [{ nuova_email: string; nome: string }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Sessione non trovata.' }
    const newCode = randomCode()
    const newExpiry = new Date(Date.now() + 15 * 60 * 1000)
    await conn.execute(
      'UPDATE completamento_profilo SET email_code = ?, expires_at = ? WHERE id = ?',
      [newCode, newExpiry, pendingId]
    )
    await sendEmail(rows[0].nuova_email, 'Verifica email — DIGI Home Design', `
      <p>Il tuo nuovo codice di verifica è: <strong>${newCode}</strong></p>
    `)
    return { ok: true }
  } finally {
    await conn.end()
  }
}

export async function reinviaSmsCompletamento(pendingId: number): Promise<VerificaResult> {
  const conn = await getConnection()
  try {
    await ensureTable(conn)
    const [rows] = await conn.execute(
      'SELECT nuova_cellulare FROM completamento_profilo WHERE id = ?', [pendingId]
    ) as [{ nuova_cellulare: string }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Sessione non trovata.' }
    const newCode = randomCode()
    const newExpiry = new Date(Date.now() + 15 * 60 * 1000)
    await conn.execute(
      'UPDATE completamento_profilo SET phone_code = ?, expires_at = ? WHERE id = ?',
      [newCode, newExpiry, pendingId]
    )
    await sendSms(rows[0].nuova_cellulare, `DIGI Home Design - Nuovo codice: ${newCode}`)
    return { ok: true }
  } finally {
    await conn.end()
  }
}

// ─── Salta: cancella il cookie (nessun salvataggio) ──────────────────────────

export async function saltaProfilo(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('profilo_incompleto')
}
