'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { sendEmail } from '@/lib/email'

async function checkAccess() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const user = cookieStore.get('session_user')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 26, settings)) redirect('/')
  return { role, user }
}

async function migrate() {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS ordini_fornitori (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        numero_ordine  VARCHAR(50)   NOT NULL DEFAULT '',
        fornitore      VARCHAR(255)  NOT NULL,
        descrizione    TEXT          NOT NULL,
        stato          VARCHAR(20)   NOT NULL DEFAULT 'bozza',
        totale         DECIMAL(10,2) NOT NULL DEFAULT 0,
        data_ordine    DATE          NOT NULL,
        created_by     VARCHAR(100)  NOT NULL DEFAULT '',
        created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN qta DECIMAL(10,3) NOT NULL DEFAULT 1`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN prezzo_unitario DECIMAL(10,2) NOT NULL DEFAULT 0`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN aliq_sconto DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN aliq_iva DECIMAL(5,2) NOT NULL DEFAULT 22`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN fatturato TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN pagato TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN stato_consegna VARCHAR(30) NOT NULL DEFAULT 'non_consegnato'`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN data_consegna_stimata DATE NULL`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN data_consegna DATE NULL`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN ultimo_sollecito DATETIME NULL`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN note TEXT NULL`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN email_fornitore VARCHAR(255) NOT NULL DEFAULT ''`).catch(() => {})
  } finally {
    await conn.end()
  }
}

function calcTotale(qta: number, prezzo: number, sconto: number, iva: number): number {
  const imponibile = qta * prezzo * (1 - sconto / 100)
  return imponibile * (1 + iva / 100)
}

export type MutResult = { ok: true } | { ok: false; error: string }

export async function addOrdineFornitore(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  const { user } = await checkAccess()
  await migrate()

  const numero          = (fd.get('numero_ordine') as string)?.trim() ?? ''
  const fornitore       = (fd.get('fornitore') as string)?.trim() ?? ''
  const descrizione     = (fd.get('descrizione') as string)?.trim() ?? ''
  const dataOrdine      = (fd.get('data_ordine') as string)?.trim() ?? ''
  const emailFornitore  = (fd.get('email_fornitore') as string)?.trim() ?? ''
  const note            = (fd.get('note') as string)?.trim() ?? ''
  const qta             = parseFloat((fd.get('qta') as string) ?? '1') || 1
  const prezzo          = parseFloat((fd.get('prezzo_unitario') as string) ?? '0') || 0
  const sconto          = parseFloat((fd.get('aliq_sconto') as string) ?? '0') || 0
  const iva             = parseFloat((fd.get('aliq_iva') as string) ?? '22') || 22
  const dataStiamta     = (fd.get('data_consegna_stimata') as string)?.trim() || null

  if (!fornitore || !dataOrdine) return { ok: false, error: 'Fornitore e data ordine sono obbligatori.' }

  const totale = calcTotale(qta, prezzo, sconto, iva)

  const conn = await getConnection()
  try {
    await conn.execute(
      `INSERT INTO ordini_fornitori
        (numero_ordine, fornitore, descrizione, data_ordine, created_by, qta, prezzo_unitario, aliq_sconto, aliq_iva, totale, email_fornitore, note, data_consegna_stimata)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [numero, fornitore, descrizione, dataOrdine, user, qta, prezzo, sconto, iva, totale, emailFornitore, note, dataStiamta]
    )
    revalidatePath('/ordini-fornitori')
    return { ok: true }
  } catch { return { ok: false, error: 'Errore durante il salvataggio.' } }
  finally { await conn.end() }
}

export async function updateOrdineFornitore(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  await migrate()

  const id              = parseInt(fd.get('id') as string)
  const numero          = (fd.get('numero_ordine') as string)?.trim() ?? ''
  const fornitore       = (fd.get('fornitore') as string)?.trim() ?? ''
  const descrizione     = (fd.get('descrizione') as string)?.trim() ?? ''
  const dataOrdine      = (fd.get('data_ordine') as string)?.trim() ?? ''
  const emailFornitore  = (fd.get('email_fornitore') as string)?.trim() ?? ''
  const note            = (fd.get('note') as string)?.trim() ?? ''
  const qta             = parseFloat((fd.get('qta') as string) ?? '1') || 1
  const prezzo          = parseFloat((fd.get('prezzo_unitario') as string) ?? '0') || 0
  const sconto          = parseFloat((fd.get('aliq_sconto') as string) ?? '0') || 0
  const iva             = parseFloat((fd.get('aliq_iva') as string) ?? '22') || 22
  const dataStiamta     = (fd.get('data_consegna_stimata') as string)?.trim() || null

  if (isNaN(id) || !fornitore || !dataOrdine) return { ok: false, error: 'Dati non validi.' }

  const totale = calcTotale(qta, prezzo, sconto, iva)

  const conn = await getConnection()
  try {
    await conn.execute(
      `UPDATE ordini_fornitori SET
        numero_ordine=?, fornitore=?, descrizione=?, data_ordine=?,
        qta=?, prezzo_unitario=?, aliq_sconto=?, aliq_iva=?, totale=?,
        email_fornitore=?, note=?, data_consegna_stimata=?
       WHERE id=?`,
      [numero, fornitore, descrizione, dataOrdine, qta, prezzo, sconto, iva, totale, emailFornitore, note, dataStiamta, id]
    )
    revalidatePath('/ordini-fornitori')
    return { ok: true }
  } catch { return { ok: false, error: 'Errore durante il salvataggio.' } }
  finally { await conn.end() }
}

export async function toggleFatturato(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  await migrate()
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  const conn = await getConnection()
  try {
    await conn.execute('UPDATE ordini_fornitori SET fatturato = 1 - fatturato WHERE id=?', [id])
    revalidatePath('/ordini-fornitori')
    return { ok: true }
  } catch { return { ok: false, error: 'Errore aggiornamento.' } }
  finally { await conn.end() }
}

export async function togglePagato(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  await migrate()
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  const conn = await getConnection()
  try {
    await conn.execute('UPDATE ordini_fornitori SET pagato = 1 - pagato WHERE id=?', [id])
    revalidatePath('/ordini-fornitori')
    return { ok: true }
  } catch { return { ok: false, error: 'Errore aggiornamento.' } }
  finally { await conn.end() }
}

export async function updateStatoConsegna(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  await migrate()
  const id    = parseInt(fd.get('id') as string)
  const stato = (fd.get('stato_consegna') as string)?.trim()
  const STATI = ['non_consegnato', 'parziale', 'consegnato']
  if (isNaN(id) || !STATI.includes(stato)) return { ok: false, error: 'Dati non validi.' }
  const dataConsegna = stato === 'consegnato' ? new Date().toISOString().slice(0, 10) : null
  const conn = await getConnection()
  try {
    await conn.execute(
      'UPDATE ordini_fornitori SET stato_consegna=?, data_consegna=? WHERE id=?',
      [stato, stato === 'consegnato' ? dataConsegna : null, id]
    )
    revalidatePath('/ordini-fornitori')
    return { ok: true }
  } catch { return { ok: false, error: 'Errore aggiornamento.' } }
  finally { await conn.end() }
}

export async function sollecitaFornitore(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  await checkAccess()
  await migrate()
  const id    = parseInt(fd.get('id') as string)
  const email = (fd.get('email') as string)?.trim()
  const cc    = (fd.get('cc') as string)?.trim() || undefined
  const testo = (fd.get('testo') as string)?.trim()
  if (isNaN(id) || !email || !testo) return { ok: false, error: 'Email e testo sono obbligatori.' }

  const conn = await getConnection()
  try {
    const [rows] = await conn.execute('SELECT numero_ordine FROM ordini_fornitori WHERE id=?', [id]) as [Record<string, unknown>[], unknown]
    if (!rows.length) return { ok: false, error: 'Ordine non trovato.' }
    const numero = String(rows[0].numero_ordine || id)
    await sendEmail(email, `Sollecito ordine N°${numero}`, `<pre style="font-family:inherit">${testo}</pre>`, cc)
    await conn.execute(
      'UPDATE ordini_fornitori SET email_fornitore=?, ultimo_sollecito=NOW() WHERE id=?',
      [email, id]
    )
    revalidatePath('/ordini-fornitori')
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Errore invio.'
    return { ok: false, error: msg }
  }
  finally { await conn.end() }
}

export async function deleteOrdineFornitore(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  const { role } = await checkAccess()
  if (role !== 'admin') return { ok: false, error: 'Solo admin.' }
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  const conn = await getConnection()
  try {
    await conn.execute('DELETE FROM ordini_fornitori WHERE id=?', [id])
    revalidatePath('/ordini-fornitori')
    return { ok: true }
  } catch { return { ok: false, error: 'Errore eliminazione.' } }
  finally { await conn.end() }
}
