'use server'

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server'
import type { RegistrationResponseJSON, AuthenticationResponseJSON } from '@simplewebauthn/server'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OptionsJSON = Record<string, any>
import { getConnection } from '@/lib/db'
import { cookies } from 'next/headers'
import { readSettings } from '@/lib/settings'
import crypto from 'crypto'

const IS_PROD = process.env.NODE_ENV === 'production'
const RP_NAME = 'DIGI Home Design'
const RP_ID   = IS_PROD ? 'digi-home-design.com' : 'localhost'
const ORIGINS = IS_PROD
  ? ['https://www.digi-home-design.com', 'https://digi-home-design.com']
  : ['http://localhost:3000']

const SESSION_OPTS = { httpOnly: true, path: '/', maxAge: 30 * 24 * 60 * 60, sameSite: 'lax' } as const

async function ensureTables(conn: Awaited<ReturnType<typeof getConnection>>) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS webauthn_credentials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      credential_id VARCHAR(500) NOT NULL,
      public_key TEXT NOT NULL,
      sign_count INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_cred (credential_id)
    )
  `)
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS webauthn_challenges (
      id INT AUTO_INCREMENT PRIMARY KEY,
      key_id VARCHAR(100) NOT NULL UNIQUE,
      challenge VARCHAR(500) NOT NULL,
      expires_at TIMESTAMP NOT NULL
    )
  `)
}

async function storeChallenge(conn: Awaited<ReturnType<typeof getConnection>>, challenge: string): Promise<string> {
  const keyId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
  await conn.execute(
    'INSERT INTO webauthn_challenges (key_id, challenge, expires_at) VALUES (?, ?, ?)',
    [keyId, challenge, expiresAt]
  )
  await conn.execute('DELETE FROM webauthn_challenges WHERE expires_at < NOW()').catch(() => {})
  return keyId
}

async function consumeChallenge(conn: Awaited<ReturnType<typeof getConnection>>, keyId: string): Promise<string | null> {
  const [rows] = await conn.execute(
    'SELECT challenge, expires_at FROM webauthn_challenges WHERE key_id = ?', [keyId]
  ) as [{ challenge: string; expires_at: Date }[], unknown]
  if (rows.length === 0) return null
  await conn.execute('DELETE FROM webauthn_challenges WHERE key_id = ?', [keyId])
  if (new Date() > new Date(rows[0].expires_at)) return null
  return rows[0].challenge
}

// ─── Controlla se utente ha già una credenziale registrata ──────────────────

export async function hasWebAuthnCredential(): Promise<boolean> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value
  if (!username) return false
  const conn = await getConnection()
  try {
    await ensureTables(conn)
    const [rows] = await conn.execute(
      'SELECT id FROM webauthn_credentials WHERE username = ? LIMIT 1', [username]
    ) as [{ id: number }[], unknown]
    return rows.length > 0
  } finally {
    await conn.end()
  }
}

// ─── Registrazione ──────────────────────────────────────────────────────────

export async function getWebAuthnRegOptions(): Promise<
  { ok: true; options: OptionsJSON; challengeKey: string } | { ok: false; error: string }
> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value
  if (!username) return { ok: false, error: 'Sessione scaduta.' }

  const conn = await getConnection()
  try {
    await ensureTables(conn)
    const [existing] = await conn.execute(
      'SELECT credential_id FROM webauthn_credentials WHERE username = ?', [username]
    ) as [{ credential_id: string }[], unknown]

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userName: username,
      attestationType: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      excludeCredentials: existing.map(c => ({ id: c.credential_id })),
    })

    const challengeKey = await storeChallenge(conn, options.challenge)
    return { ok: true, options, challengeKey }
  } finally {
    await conn.end()
  }
}

export async function verifyWebAuthnReg(
  response: RegistrationResponseJSON,
  challengeKey: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value
  if (!username) return { ok: false, error: 'Sessione scaduta.' }

  const conn = await getConnection()
  try {
    await ensureTables(conn)
    const expectedChallenge = await consumeChallenge(conn, challengeKey)
    if (!expectedChallenge) return { ok: false, error: 'Sessione scaduta. Riprova.' }

    const { verified, registrationInfo } = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: ORIGINS,
      expectedRPID: RP_ID,
    })

    if (!verified || !registrationInfo) return { ok: false, error: 'Verifica fallita.' }

    const { credential } = registrationInfo
    const publicKeyB64 = Buffer.from(credential.publicKey).toString('base64')

    await conn.execute(
      `INSERT INTO webauthn_credentials (username, credential_id, public_key, sign_count)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE public_key=VALUES(public_key), sign_count=VALUES(sign_count)`,
      [username, credential.id, publicKeyB64, credential.counter]
    )
    return { ok: true }
  } catch (e) {
    console.error('WebAuthn reg error:', e)
    return { ok: false, error: 'Errore durante la registrazione.' }
  } finally {
    await conn.end()
  }
}

// ─── Autenticazione ─────────────────────────────────────────────────────────

export async function getWebAuthnAuthOptions(): Promise<
  { ok: true; options: OptionsJSON; challengeKey: string } | { ok: false; error: string }
> {
  const conn = await getConnection()
  try {
    await ensureTables(conn)
    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      userVerification: 'required',
    })
    const challengeKey = await storeChallenge(conn, options.challenge)
    return { ok: true, options, challengeKey }
  } finally {
    await conn.end()
  }
}

export async function verifyWebAuthnAuth(
  response: AuthenticationResponseJSON,
  challengeKey: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const conn = await getConnection()
  try {
    await ensureTables(conn)
    const expectedChallenge = await consumeChallenge(conn, challengeKey)
    if (!expectedChallenge) return { ok: false, error: 'Sessione scaduta. Riprova.' }

    const credentialId = (response as unknown as { id: string }).id

    const [creds] = await conn.execute(
      'SELECT username, credential_id, public_key, sign_count FROM webauthn_credentials WHERE credential_id = ?',
      [credentialId]
    ) as [{ username: string; credential_id: string; public_key: string; sign_count: number }[], unknown]

    if (creds.length === 0) return { ok: false, error: 'Impronta non riconosciuta.' }
    const stored = creds[0]

    const { verified, authenticationInfo } = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: ORIGINS,
      expectedRPID: RP_ID,
      credential: {
        id: stored.credential_id,
        publicKey: new Uint8Array(Buffer.from(stored.public_key, 'base64')),
        counter: stored.sign_count,
      },
    })

    if (!verified) return { ok: false, error: 'Verifica fallita.' }

    // Aggiorna il contatore
    await conn.execute(
      'UPDATE webauthn_credentials SET sign_count = ? WHERE credential_id = ?',
      [authenticationInfo.newCounter, stored.credential_id]
    )

    // Imposta sessione 30 giorni
    const [userRows] = await conn.execute(
      'SELECT role FROM users WHERE username = ? AND is_active = 1 LIMIT 1', [stored.username]
    ) as [{ role: string }[], unknown]
    if (userRows.length === 0) return { ok: false, error: 'Utente non trovato.' }

    const role = userRows[0].role
    if (role !== 'admin') {
      const { manutenzione, loginClientiDisabilitato, loginDipendentiDisabilitato } = await readSettings()
      if (manutenzione) return { ok: false, error: 'Sito in manutenzione — accesso riservato agli amministratori.' }
      if (role === 'cliente' && loginClientiDisabilitato) return { ok: false, error: 'Il login per i clienti è temporaneamente disabilitato.' }
      if (role !== 'cliente' && loginDipendentiDisabilitato) return { ok: false, error: 'Il login per i dipendenti è temporaneamente disabilitato.' }
    }

    const cookieStore = await cookies()
    cookieStore.set('session_user', stored.username, SESSION_OPTS)
    cookieStore.set('session_role', role, SESSION_OPTS)

    return { ok: true }
  } catch (e) {
    console.error('WebAuthn auth error:', e)
    return { ok: false, error: 'Errore durante la verifica.' }
  } finally {
    await conn.end()
  }
}

// ─── Rimuovi impronta ───────────────────────────────────────────────────────

export async function removeWebAuthnCredential(): Promise<void> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value
  if (!username) return
  const conn = await getConnection()
  try {
    await conn.execute('DELETE FROM webauthn_credentials WHERE username = ?', [username])
  } finally {
    await conn.end()
  }
}
