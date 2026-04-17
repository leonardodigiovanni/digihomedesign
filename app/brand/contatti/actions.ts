'use server'

import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import { sendSms } from '@/lib/sms'

export type ContattoLoggatoResult = { ok: true } | { ok: false; error: string }

export type CodiceResult = { ok: true } | { ok: false; error: string }
export type ContattoResult = { ok: true } | { ok: false; error: string }

async function ensureTables(db: Awaited<ReturnType<typeof getConnection>>) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS email_inbox (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      tipo       VARCHAR(50)  NOT NULL DEFAULT 'generico',
      oggetto    VARCHAR(500) NOT NULL DEFAULT '',
      corpo      TEXT         NOT NULL,
      letto      TINYINT(1)   NOT NULL DEFAULT 0,
      created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contatto_otp (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      cellulare  VARCHAR(20)  NOT NULL,
      codice     VARCHAR(6)   NOT NULL,
      expires_at DATETIME     NOT NULL,
      created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function inviaContattoLoggato(
  _: ContattoLoggatoResult | null,
  fd: FormData
): Promise<ContattoLoggatoResult> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value
  const role     = cookieStore.get('session_role')?.value
  if (!username || !role) return { ok: false, error: 'Sessione non valida. Ricarica la pagina.' }

  const email    = (fd.get('email')    as string)?.trim()
  const messaggio = (fd.get('messaggio') as string)?.trim()

  if (!email || !email.includes('@')) return { ok: false, error: 'Email non valida.' }
  if (!messaggio)                      return { ok: false, error: 'Il messaggio è obbligatorio.' }

  const db = await getConnection()
  try {
    await ensureTables(db)
    const oggetto = `Messaggio da ${role} (${username})`
    const corpo = `
      <p><strong>Utente:</strong> ${username} (${role})</p>
      <p><strong>Email di risposta:</strong> ${email}</p>
      <p><strong>Messaggio:</strong></p>
      <p style="white-space:pre-wrap">${messaggio.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    `
    await db.execute(
      'INSERT INTO email_inbox (tipo, oggetto, corpo, letto) VALUES (?, ?, ?, 0)',
      ['contatto', oggetto, corpo]
    )
    return { ok: true }
  } catch {
    return { ok: false, error: 'Errore durante l\'invio. Riprova più tardi.' }
  } finally {
    await db.end()
  }
}

export async function inviaCodice(
  _: CodiceResult | null,
  fd: FormData
): Promise<CodiceResult> {
  const cellulare = (fd.get('cellulare') as string)?.trim()
  if (!cellulare || cellulare.length < 6)
    return { ok: false, error: 'Numero di cellulare non valido.' }

  const codice = String(Math.floor(100000 + Math.random() * 900000))

  const db = await getConnection()
  try {
    await ensureTables(db)
    // Elimina eventuali OTP precedenti per questo numero
    await db.execute('DELETE FROM contatto_otp WHERE cellulare = ?', [cellulare])
    // Inserisce nuovo OTP con scadenza 10 minuti
    await db.execute(
      'INSERT INTO contatto_otp (cellulare, codice, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))',
      [cellulare, codice]
    )
    await sendSms(cellulare, `Il tuo codice di verifica Digi Home Design è: ${codice}`)
    return { ok: true }
  } catch {
    return { ok: false, error: 'Errore durante l\'invio del codice. Riprova.' }
  } finally {
    await db.end()
  }
}

export async function inviaContatto(
  _: ContattoResult | null,
  fd: FormData
): Promise<ContattoResult> {
  const nome      = (fd.get('nome')      as string)?.trim()
  const cognome   = (fd.get('cognome')   as string)?.trim() ?? ''
  const email     = (fd.get('email')     as string)?.trim()
  const cellulare = (fd.get('cellulare') as string)?.trim()
  const messaggio = (fd.get('messaggio') as string)?.trim()
  const codice    = (fd.get('codice')    as string)?.trim()

  if (!nome)                          return { ok: false, error: 'Il nome è obbligatorio.' }
  if (!email || !email.includes('@')) return { ok: false, error: 'Email non valida.' }
  if (!cellulare)                     return { ok: false, error: 'Il cellulare è obbligatorio.' }
  if (!messaggio)                     return { ok: false, error: 'Il messaggio è obbligatorio.' }
  if (!codice)                        return { ok: false, error: 'Inserisci il codice ricevuto via SMS.' }

  const db = await getConnection()
  try {
    await ensureTables(db)

    // Verifica OTP
    const [rows] = await db.execute(
      'SELECT id FROM contatto_otp WHERE cellulare = ? AND codice = ? AND expires_at > NOW() LIMIT 1',
      [cellulare, codice]
    )
    const otp = (rows as { id: number }[])[0]
    if (!otp) return { ok: false, error: 'Codice non valido o scaduto. Richiedi un nuovo codice.' }

    // Elimina OTP usato
    await db.execute('DELETE FROM contatto_otp WHERE id = ?', [otp.id])

    const nomeCompleto = cognome ? `${nome} ${cognome}` : nome
    const oggetto = `Richiesta contatto: ${nomeCompleto} (${email})`
    const corpo = `
      <p><strong>Nome:</strong> ${nomeCompleto}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Cellulare:</strong> ${cellulare}</p>
      <p><strong>Messaggio:</strong></p>
      <p style="white-space:pre-wrap">${messaggio.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    `

    await db.execute(
      'INSERT INTO email_inbox (tipo, oggetto, corpo, letto) VALUES (?, ?, ?, 0)',
      ['contatto', oggetto, corpo]
    )
    return { ok: true }
  } catch {
    return { ok: false, error: 'Errore durante l\'invio. Riprova più tardi.' }
  } finally {
    await db.end()
  }
}
