'use server'

import { getConnection } from '@/lib/db'

export type ContattoIngegnereResult = { ok: true } | { ok: false; error: string }

export async function inviaContattoIngegnere(
  _: ContattoIngegnereResult | null,
  fd: FormData
): Promise<ContattoIngegnereResult> {
  const nome      = (fd.get('nome')      as string)?.trim()
  const email     = (fd.get('email')     as string)?.trim()
  const telefono  = (fd.get('telefono')  as string)?.trim() ?? ''
  const messaggio = (fd.get('messaggio') as string)?.trim() ?? ''

  if (!nome)                          return { ok: false, error: 'Nome obbligatorio.' }
  if (!email || !email.includes('@')) return { ok: false, error: 'Email non valida.' }

  const oggetto = `Richiesta Ingegnere Edile — ${nome} (${email})`
  const corpo = `
    <p><strong>Nome:</strong> ${nome}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${telefono  ? `<p><strong>Telefono:</strong> ${telefono}</p>` : ''}
    ${messaggio ? `<p><strong>Messaggio:</strong></p><p style="white-space:pre-wrap">${messaggio.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : ''}
  `

  const db = await getConnection()
  try {
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
    await db.execute(
      'INSERT INTO email_inbox (tipo, oggetto, corpo, letto) VALUES (?, ?, ?, 0)',
      ['ingegnere_edile', oggetto, corpo]
    )
    return { ok: true }
  } catch {
    return { ok: false, error: 'Errore durante l\'invio. Riprova più tardi.' }
  } finally {
    await db.end()
  }
}
