'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/email'

async function checkAdmin() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') redirect('/')
}

export type MutResult = { ok: true; id?: number } | { ok: false; error: string }

// ─── Template ─────────────────────────────────────────────────────────────

export async function salvaTemplateB2C(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAdmin()
  const id      = parseInt(fd.get('id') as string) || null
  const oggetto = ((fd.get('oggetto') as string) ?? '').trim()
  const testo   = ((fd.get('testo') as string) ?? '').trim()

  if (!oggetto) return { ok: false, error: "L'oggetto è obbligatorio." }
  if (!testo) return { ok: false, error: 'Il testo non può essere vuoto.' }

  const db = await getConnection()
  try {
    if (id) {
      await db.execute('UPDATE b2c_templates SET oggetto = ?, testo = ? WHERE id = ?', [oggetto, testo, id])
      revalidatePath('/amministrazione/b2c')
      return { ok: true, id }
    }
    const [res] = await db.execute('INSERT INTO b2c_templates (oggetto, testo) VALUES (?, ?)', [oggetto, testo])
    revalidatePath('/amministrazione/b2c')
    return { ok: true, id: (res as { insertId: number }).insertId }
  } finally {
    await db.end()
  }
}

export async function salvaComeNuovoTemplateB2C(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAdmin()
  const oggetto = ((fd.get('oggetto') as string) ?? '').trim()
  const testo   = ((fd.get('testo') as string) ?? '').trim()

  if (!oggetto) return { ok: false, error: "L'oggetto è obbligatorio." }
  if (!testo) return { ok: false, error: 'Il testo non può essere vuoto.' }

  const db = await getConnection()
  try {
    const [res] = await db.execute('INSERT INTO b2c_templates (oggetto, testo) VALUES (?, ?)', [oggetto, testo])
    revalidatePath('/amministrazione/b2c')
    return { ok: true, id: (res as { insertId: number }).insertId }
  } finally {
    await db.end()
  }
}

export async function eliminaTemplateB2C(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAdmin()
  const id = parseInt(fd.get('id') as string)
  if (!id) return { ok: false, error: 'ID non valido.' }
  const db = await getConnection()
  try {
    await db.execute('DELETE FROM b2c_templates WHERE id = ?', [id])
    revalidatePath('/amministrazione/b2c')
    return { ok: true }
  } finally {
    await db.end()
  }
}

// ─── Clienti ────────────────────────────────────────────────────────────

export async function salvaClienteB2C(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAdmin()
  const id       = parseInt(fd.get('id') as string) || null
  const nome     = ((fd.get('nome') as string) ?? '').trim()
  const email    = ((fd.get('email') as string) ?? '').trim()
  const telefono = ((fd.get('telefono') as string) ?? '').trim() || null
  const note     = ((fd.get('note') as string) ?? '').trim() || null

  if (!nome) return { ok: false, error: 'Il nome è obbligatorio.' }
  if (!email) return { ok: false, error: "L'email è obbligatoria." }

  const db = await getConnection()
  try {
    if (id) {
      await db.execute('UPDATE b2c_clienti SET nome = ?, email = ?, telefono = ?, note = ? WHERE id = ?', [nome, email, telefono, note, id])
    } else {
      await db.execute('INSERT INTO b2c_clienti (nome, email, telefono, note) VALUES (?, ?, ?, ?)', [nome, email, telefono, note])
    }
    revalidatePath('/amministrazione/b2c')
    return { ok: true }
  } finally {
    await db.end()
  }
}

export async function eliminaClienteB2C(_: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAdmin()
  const id = parseInt(fd.get('id') as string)
  if (!id) return { ok: false, error: 'ID non valido.' }
  const db = await getConnection()
  try {
    await db.execute('DELETE FROM b2c_clienti WHERE id = ?', [id])
    revalidatePath('/amministrazione/b2c')
    return { ok: true }
  } finally {
    await db.end()
  }
}

// ─── Invio email ────────────────────────────────────────────────────────

export type InviaResult =
  | { ok: true; inviate: string[]; fallite: { email: string; error: string }[] }
  | { ok: false; error: string }

export async function inviaEmailB2C(oggetto: string, testo: string, clienteIds: number[]): Promise<InviaResult> {
  await checkAdmin()
  if (!oggetto.trim()) return { ok: false, error: "L'oggetto è obbligatorio." }
  if (!testo.trim()) return { ok: false, error: 'Il testo non può essere vuoto.' }
  if (clienteIds.length === 0) return { ok: false, error: 'Seleziona almeno un destinatario.' }

  const db = await getConnection()
  let destinatari: { id: number; email: string }[]
  try {
    const placeholders = clienteIds.map(() => '?').join(',')
    const [rows] = await db.query(
      `SELECT id, email FROM b2c_clienti WHERE id IN (${placeholders})`,
      clienteIds
    )
    destinatari = rows as { id: number; email: string }[]
  } finally {
    await db.end()
  }

  const html = testo
    .split('\n')
    .map(riga => riga.trim() === '' ? '<br/>' : `<div>${riga}</div>`)
    .join('')

  const inviate: string[] = []
  const fallite: { email: string; error: string }[] = []

  for (const dest of destinatari) {
    try {
      await sendEmail(dest.email, oggetto, html)
      inviate.push(dest.email)
    } catch (e) {
      fallite.push({ email: dest.email, error: e instanceof Error ? e.message : 'Errore sconosciuto' })
    }
  }

  return { ok: true, inviate, fallite }
}
