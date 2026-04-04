'use server'

import { getConnection } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import { sendSms } from '@/lib/sms'
import { readSettings } from '@/lib/settings'

function randomCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

// ─── Step 1: avvia registrazione ─────────────────────────────────────────────

export type StartResult =
  | { ok: true; pendingId: number }
  | { ok: false; error: string }

export async function startRegistration(
  _prev: StartResult | null,
  formData: FormData
): Promise<StartResult> {
  const { registrazioniDisabilitate } = readSettings()
  if (registrazioniDisabilitate) {
    return { ok: false, error: 'Le nuove registrazioni sono temporaneamente disabilitate.' }
  }

  const username     = (formData.get('username')       as string)?.trim()
  const nome         = (formData.get('nome')           as string)?.trim()
  const cognome      = (formData.get('cognome')        as string)?.trim()
  const data_nascita = (formData.get('data_nascita')   as string)?.trim()
  const luogo_nascita= (formData.get('luogo_nascita')  as string)?.trim()
  const email        = (formData.get('email')          as string)?.trim().toLowerCase()
  const cellulare    = (formData.get('cellulare')      as string)?.trim()
  const password     = (formData.get('password')       as string)
  const password2    = (formData.get('password2')      as string)

  if (!username || !nome || !cognome || !data_nascita || !luogo_nascita || !email || !cellulare || !password || !password2) {
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Indirizzo email non valido.' }
  }
  if (!/^\+?[\d\s\-]{8,15}$/.test(cellulare)) {
    return { ok: false, error: 'Numero di cellulare non valido.' }
  }

  const conn = await getConnection()
  let pendingId: number | null = null
  try {
    // Controllo unicità: username, email e cellulare separatamente per messaggi precisi
    const [byUsername] = await conn.execute(
      'SELECT id FROM users WHERE username = ?', [username]
    ) as [{ id: number }[], unknown]
    if (byUsername.length > 0) {
      return { ok: false, error: 'Username già in uso. Scegline un altro.' }
    }

    const [byEmail] = await conn.execute(
      'SELECT id FROM users WHERE email = ?', [email]
    ) as [{ id: number }[], unknown]
    if (byEmail.length > 0) {
      return { ok: false, error: 'Email già registrata. Usa un indirizzo diverso o accedi.' }
    }

    const [byCellulare] = await conn.execute(
      'SELECT id FROM users WHERE cellulare = ?', [cellulare]
    ) as [{ id: number }[], unknown]
    if (byCellulare.length > 0) {
      return { ok: false, error: 'Numero di cellulare già registrato. Usa un numero diverso.' }
    }

    const emailCode = randomCode()
    const phoneCode = randomCode()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await conn.execute('DELETE FROM pending_registrations WHERE email = ? OR username = ?', [email, username])
    const [ins] = await conn.execute(
      `INSERT INTO pending_registrations
         (username, nome, cognome, data_nascita, luogo_nascita, email, cellulare, password, email_code, phone_code, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, nome, cognome, data_nascita, luogo_nascita, email, cellulare, password, emailCode, phoneCode, expiresAt]
    ) as [{ insertId: number }, unknown]
    pendingId = ins.insertId

    await sendEmail(
      email,
      'Codice di verifica — MEF',
      `<p>Ciao <strong>${nome}</strong>,</p>
       <p>Il tuo codice di verifica email è:</p>
       <h2 style="letter-spacing:6px">${emailCode}</h2>
       <p>Il codice scade tra 15 minuti.</p>`
    )
    await sendSms(cellulare, `MEF - Codice verifica cellulare: ${phoneCode}`)
  } finally {
    await conn.end()
  }

  return { ok: true, pendingId: pendingId! }
}

// ─── Step 2: verifica email ───────────────────────────────────────────────────

export type VerifyResult = { ok: true } | { ok: false; error: string }

export async function verifyEmail(
  pendingId: number,
  code: string
): Promise<VerifyResult> {
  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(
      'SELECT email_code, expires_at FROM pending_registrations WHERE id = ? AND email_verified = 0',
      [pendingId]
    ) as [{ email_code: string; expires_at: Date }[], unknown]

    if (rows.length === 0) return { ok: false, error: 'Registrazione non trovata.' }
    const row = rows[0]
    if (new Date() > new Date(row.expires_at)) return { ok: false, error: 'Codice scaduto. Ricomincia la registrazione.' }
    if (row.email_code !== code.trim()) return { ok: false, error: 'Codice non corretto.' }

    await conn.execute(
      'UPDATE pending_registrations SET email_verified = 1 WHERE id = ?',
      [pendingId]
    )
    return { ok: true }
  } finally {
    await conn.end()
  }
}

// ─── Reinvia codice email ─────────────────────────────────────────────────────

export async function resendEmailCode(pendingId: number): Promise<VerifyResult> {
  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(
      'SELECT email, nome FROM pending_registrations WHERE id = ?',
      [pendingId]
    ) as [{ email: string; nome: string }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Registrazione non trovata.' }

    const newCode = randomCode()
    const newExpiry = new Date(Date.now() + 15 * 60 * 1000)
    await conn.execute(
      'UPDATE pending_registrations SET email_code = ?, email_verified = 0, expires_at = ? WHERE id = ?',
      [newCode, newExpiry, pendingId]
    )
    await sendEmail(
      rows[0].email,
      'Nuovo codice di verifica — MEF',
      `<p>Il tuo nuovo codice è:</p><h2 style="letter-spacing:6px">${newCode}</h2>`
    )
    return { ok: true }
  } finally {
    await conn.end()
  }
}

// ─── Step 3: verifica cellulare + completa registrazione ─────────────────────

export async function verifyPhone(
  pendingId: number,
  code: string
): Promise<VerifyResult> {
  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(
      `SELECT * FROM pending_registrations
       WHERE id = ? AND email_verified = 1 AND phone_verified = 0`,
      [pendingId]
    ) as [Record<string, unknown>[], unknown]

    if (rows.length === 0) return { ok: false, error: 'Verifica email non completata.' }

    const row = rows[0] as {
      username: string; nome: string; cognome: string; data_nascita: string; luogo_nascita: string
      email: string; cellulare: string; password: string
      phone_code: string; expires_at: Date
    }

    if (new Date() > new Date(row.expires_at)) return { ok: false, error: 'Codice scaduto. Ricomincia la registrazione.' }
    if (row.phone_code !== code.trim()) return { ok: false, error: 'Codice non corretto.' }

    await conn.execute(
      `INSERT INTO users (username, password, role, is_active, nome, cognome, data_nascita, luogo_nascita, email, email_verificata, cellulare, cellulare_verificato)
       VALUES (?, ?, 'cliente', 0, ?, ?, ?, ?, ?, 1, ?, 1)`,
      [row.username, row.password, row.nome, row.cognome, row.data_nascita, row.luogo_nascita, row.email, row.cellulare]
    )
    await conn.execute('DELETE FROM pending_registrations WHERE id = ?', [pendingId])

    const dataOra = new Date().toLocaleString('it-IT')
    const oggettoNotifica = `Nuovo utente: ${row.username} (${row.nome} ${row.cognome})`
    const corpoNotifica = `
      <p><strong>Nuovo utente in attesa di attivazione</strong></p>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#888">Username</td><td><strong>${row.username}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888">Nome</td><td>${row.nome} ${row.cognome}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888">Email</td><td>${row.email}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888">Cellulare</td><td>${row.cellulare}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#888">Data registrazione</td><td>${dataOra}</td></tr>
      </table>
    `.trim()

    await sendEmail(
      'leonardodigiovanni@tiscali.it',
      oggettoNotifica,
      corpoNotifica
    )

    await conn.execute(
      `INSERT INTO email_inbox (tipo, oggetto, corpo) VALUES ('nuova_registrazione', ?, ?)`,
      [oggettoNotifica, corpoNotifica]
    )
  } finally {
    await conn.end()
  }

  return { ok: true }
}

// ─── Reinvia codice SMS ───────────────────────────────────────────────────────

export async function resendPhoneCode(pendingId: number): Promise<VerifyResult> {
  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(
      'SELECT cellulare FROM pending_registrations WHERE id = ? AND email_verified = 1',
      [pendingId]
    ) as [{ cellulare: string }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Registrazione non trovata.' }

    const newCode = randomCode()
    const newExpiry = new Date(Date.now() + 15 * 60 * 1000)
    await conn.execute(
      'UPDATE pending_registrations SET phone_code = ?, expires_at = ? WHERE id = ?',
      [newCode, newExpiry, pendingId]
    )
    await sendSms(rows[0].cellulare, `MEF - Nuovo codice verifica: ${newCode}`)
    return { ok: true }
  } finally {
    await conn.end()
  }
}
