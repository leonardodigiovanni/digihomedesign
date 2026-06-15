'use server'

import { getConnection } from '@/lib/db'
import { sendSms } from '@/lib/sms'
import { validatePassword } from '@/lib/password'

function randomCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

async function ensureTable(conn: Awaited<ReturnType<typeof getConnection>>) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS recupero_password (
      id INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL,
      phone_code CHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY uq_username (username)
    )
  `)
}

export type AvviaResult =
  | { ok: true; pendingId: number }
  | { ok: false; error: string }

export type VerificaResult = { ok: true } | { ok: false; error: string }

// ─── Step 1: cerca utente per cellulare, invia OTP ───────────────────────────

export async function avviaRecupero(
  _prev: AvviaResult | null,
  fd: FormData
): Promise<AvviaResult> {
  const cellulare = (fd.get('cellulare') as string ?? '').trim()
  if (!cellulare) return { ok: false, error: 'Inserisci il numero di cellulare.' }
  if (!/^\+?[\d\s\-]{8,15}$/.test(cellulare)) return { ok: false, error: 'Numero non valido.' }

  const conn = await getConnection()
  try {
    await ensureTable(conn)
    const [rows] = await conn.execute(
      'SELECT username FROM users WHERE cellulare = ? AND is_active = 1 LIMIT 1', [cellulare]
    ) as [{ username: string }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Nessun account trovato con questo numero.' }

    const username = rows[0].username
    const code = randomCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await conn.execute(
      `INSERT INTO recupero_password (username, phone_code, expires_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE phone_code=VALUES(phone_code), expires_at=VALUES(expires_at)`,
      [username, code, expiresAt]
    )
    const [ins] = await conn.execute(
      'SELECT id FROM recupero_password WHERE username = ?', [username]
    ) as [{ id: number }[], unknown]

    await sendSms(cellulare, `DIGI Home Design - Codice recupero: ${code}`)
    return { ok: true, pendingId: ins[0].id }
  } finally {
    await conn.end()
  }
}

// ─── Step 2: verifica OTP ────────────────────────────────────────────────────

export async function verificaRecupero(pendingId: number, code: string): Promise<VerificaResult> {
  const conn = await getConnection()
  try {
    await ensureTable(conn)
    const [rows] = await conn.execute(
      'SELECT phone_code, expires_at FROM recupero_password WHERE id = ?', [pendingId]
    ) as [{ phone_code: string; expires_at: Date }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Sessione non trovata.' }
    if (new Date() > new Date(rows[0].expires_at)) return { ok: false, error: 'Codice scaduto.' }
    if (rows[0].phone_code !== code.trim()) return { ok: false, error: 'Codice non corretto.' }
    return { ok: true }
  } finally {
    await conn.end()
  }
}

// ─── Step 3: salva nuova password ────────────────────────────────────────────

export async function salvaPassword(pendingId: number, nuovaPassword: string): Promise<VerificaResult> {
  const err = validatePassword(nuovaPassword)
  if (err) return { ok: false, error: err }

  const conn = await getConnection()
  try {
    await ensureTable(conn)
    const [rows] = await conn.execute(
      'SELECT username FROM recupero_password WHERE id = ?', [pendingId]
    ) as [{ username: string }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Sessione non trovata.' }

    await conn.execute(
      'UPDATE users SET password = ? WHERE username = ?', [nuovaPassword, rows[0].username]
    )
    await conn.execute('DELETE FROM recupero_password WHERE id = ?', [pendingId])
    return { ok: true }
  } finally {
    await conn.end()
  }
}

// ─── Reinvio OTP ─────────────────────────────────────────────────────────────

export async function reinviaRecupero(pendingId: number): Promise<VerificaResult> {
  const conn = await getConnection()
  try {
    await ensureTable(conn)
    const [rows] = await conn.execute(
      'SELECT r.username, u.cellulare FROM recupero_password r JOIN users u ON u.username = r.username WHERE r.id = ?',
      [pendingId]
    ) as [{ username: string; cellulare: string }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Sessione non trovata.' }

    const code = randomCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
    await conn.execute(
      'UPDATE recupero_password SET phone_code = ?, expires_at = ? WHERE id = ?',
      [code, expiresAt, pendingId]
    )
    await sendSms(rows[0].cellulare, `DIGI Home Design - Nuovo codice recupero: ${code}`)
    return { ok: true }
  } finally {
    await conn.end()
  }
}
