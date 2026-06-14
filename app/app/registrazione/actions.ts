'use server'

import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import { sendSms } from '@/lib/sms'
import { sendEmail } from '@/lib/email'
import { readSettings } from '@/lib/settings'

function randomCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export type StartResult =
  | { ok: true; pendingId: number }
  | { ok: false; error: string }

export type VerifyResult = { ok: true } | { ok: false; error: string }

// ─── Step 1: avvia registrazione snella ──────────────────────────────────────

export async function startAppRegistration(
  _prev: StartResult | null,
  formData: FormData
): Promise<StartResult> {
  const { registrazioniDisabilitate } = await readSettings()
  if (registrazioniDisabilitate) {
    return { ok: false, error: 'Le nuove registrazioni sono temporaneamente disabilitate.' }
  }

  const username  = (formData.get('username')  as string)?.trim()
  const cellulare = (formData.get('cellulare') as string)?.trim()
  const password  = (formData.get('password')  as string)
  const password2 = (formData.get('password2') as string)

  if (!username || !cellulare || !password || !password2) {
    return { ok: false, error: 'Tutti i campi sono obbligatori.' }
  }
  if (username.length < 3) {
    return { ok: false, error: 'Lo username deve essere di almeno 3 caratteri.' }
  }
  if (!/^[a-zA-Z0-9_.\-]+$/.test(username)) {
    return { ok: false, error: 'Lo username può contenere solo lettere, numeri, underscore, punti e trattini.' }
  }
  if (password !== password2) {
    return { ok: false, error: 'Le password non coincidono.' }
  }
  if (password.length < 8) {
    return { ok: false, error: 'La password deve essere di almeno 8 caratteri.' }
  }
  if (!/^\+?[\d\s\-]{8,15}$/.test(cellulare)) {
    return { ok: false, error: 'Numero di cellulare non valido.' }
  }

  const conn = await getConnection()
  let pendingId: number | null = null
  try {
    const [byUsername] = await conn.execute(
      'SELECT id FROM users WHERE username = ?', [username]
    ) as [{ id: number }[], unknown]
    if (byUsername.length > 0) {
      return { ok: false, error: 'Username già in uso. Scegline un altro.' }
    }

    const [byCellulare] = await conn.execute(
      'SELECT id FROM users WHERE cellulare = ?', [cellulare]
    ) as [{ id: number }[], unknown]
    if (byCellulare.length > 0) {
      return { ok: false, error: 'Numero di cellulare già registrato. Usa un numero diverso.' }
    }

    const phoneCode = randomCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await conn.execute(
      'DELETE FROM pending_registrations WHERE username = ? OR cellulare = ?',
      [username, cellulare]
    )
    const [ins] = await conn.execute(
      `INSERT INTO pending_registrations
         (username, nome, cognome, data_nascita, luogo_nascita, email, cellulare, password, email_code, phone_code, expires_at, email_verified)
       VALUES (?, '', '', '2000-01-01', '', '', ?, ?, '', ?, ?, 1)`,
      [username, cellulare, password, phoneCode, expiresAt]
    ) as [{ insertId: number }, unknown]
    pendingId = ins.insertId

    await sendSms(cellulare, `DIGI Home Design - Codice verifica: ${phoneCode}`)
  } finally {
    await conn.end()
  }

  return { ok: true, pendingId: pendingId! }
}

// ─── Step 2: verifica SMS + completa registrazione ───────────────────────────

export async function verifyAppPhone(
  pendingId: number,
  code: string
): Promise<VerifyResult> {
  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(
      `SELECT * FROM pending_registrations WHERE id = ? AND email_verified = 1 AND phone_verified = 0`,
      [pendingId]
    ) as [Record<string, unknown>[], unknown]

    if (rows.length === 0) return { ok: false, error: 'Registrazione non trovata.' }

    const row = rows[0] as {
      username: string; cellulare: string; password: string
      phone_code: string; expires_at: Date
    }

    if (new Date() > new Date(row.expires_at)) {
      return { ok: false, error: 'Codice scaduto. Ricomincia la registrazione.' }
    }
    if (row.phone_code !== code.trim()) {
      return { ok: false, error: 'Codice non corretto.' }
    }

    await conn.execute(`ALTER TABLE clienti ADD COLUMN utente_id INT NULL DEFAULT NULL`).catch(() => {})
    await conn.execute(`ALTER TABLE clienti ADD COLUMN sconto_pct DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
    await conn.execute(`ALTER TABLE users ADD COLUMN cliente_id INT NULL DEFAULT NULL`).catch(() => {})

    // Cerca clienti preesistente creato da dipendente con stesso telefono
    const [existingCl] = await conn.execute(
      'SELECT id FROM clienti WHERE telefono = ? AND utente_id IS NULL LIMIT 1',
      [row.cellulare]
    ) as [{ id: number }[], unknown]
    const existingClienteId = existingCl.length > 0 ? existingCl[0].id : null

    await conn.beginTransaction()
    try {
      let clienteId: number
      if (existingClienteId) {
        clienteId = existingClienteId
      } else {
        const [clientiRes] = await conn.execute(
          `INSERT INTO clienti (tipo, nome, cognome, ragione_sociale, indirizzo, telefono, email, pec, codice_sdi, codice_fiscale, partita_iva, sconto_pct)
           VALUES ('fisica', '', '', '', '', ?, '', '', '', '', '', 5)`,
          [row.cellulare]
        ) as [{ insertId: number }, unknown]
        clienteId = clientiRes.insertId
      }

      const [usersRes] = await conn.execute(
        `INSERT INTO users (username, password, role, is_active, nome, cognome, data_nascita, luogo_nascita, email, email_verificata, cellulare, cellulare_verificato, cliente_id)
         VALUES (?, ?, 'cliente', 0, '', '', '2000-01-01', '', '', 1, ?, 1, ?)`,
        [row.username, row.password, row.cellulare, clienteId]
      ) as [{ insertId: number }, unknown]
      const userId = usersRes.insertId

      await conn.execute('UPDATE clienti SET utente_id = ? WHERE id = ?', [userId, clienteId])
      await conn.commit()

      const cookieStore = await cookies()
      cookieStore.set('session_user', row.username, { httpOnly: true, path: '/' })
      cookieStore.set('session_role', 'cliente',    { httpOnly: true, path: '/' })
      cookieStore.set('profilo_incompleto', '1',    { httpOnly: true, path: '/', sameSite: 'lax' })
    } catch (err) {
      await conn.rollback()
      throw err
    }

    await conn.execute('DELETE FROM pending_registrations WHERE id = ?', [pendingId])

    const dataOra = new Date().toLocaleString('it-IT')
    const oggetto = `Nuovo utente app: ${row.username}`
    const corpo = `
      <p><strong>Nuovo utente registrato via app</strong></p>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#888">Username</td><td><strong>${row.username}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888">Cellulare</td><td>${row.cellulare}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888">Data</td><td>${dataOra}</td></tr>
      </table>
    `.trim()

    await sendEmail('leonardodigiovanni@tiscali.it', oggetto, corpo)
    await conn.execute(
      `INSERT INTO email_inbox (tipo, oggetto, corpo) VALUES ('nuova_registrazione', ?, ?)`,
      [oggetto, corpo]
    ).catch(() => {})
  } finally {
    await conn.end()
  }

  return { ok: true }
}

// ─── Reinvia codice SMS ───────────────────────────────────────────────────────

export async function resendAppPhoneCode(pendingId: number): Promise<VerifyResult> {
  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(
      'SELECT cellulare FROM pending_registrations WHERE id = ?',
      [pendingId]
    ) as [{ cellulare: string }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Registrazione non trovata.' }

    const newCode = randomCode()
    const newExpiry = new Date(Date.now() + 15 * 60 * 1000)
    await conn.execute(
      'UPDATE pending_registrations SET phone_code = ?, expires_at = ? WHERE id = ?',
      [newCode, newExpiry, pendingId]
    )
    await sendSms(rows[0].cellulare, `DIGI Home Design - Nuovo codice verifica: ${newCode}`)
    return { ok: true }
  } finally {
    await conn.end()
  }
}
