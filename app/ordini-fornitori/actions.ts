'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'

const ALLOWED = ['dipendente','magazzino','direttore','admin','venditore','commercialista']

async function checkAuth() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (!ALLOWED.includes(role)) throw new Error('Non autorizzato.')
  return role
}

export type MutResult = { ok: true } | { ok: false; error: string }

export async function addOrdineFornitore(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  try { await checkAuth() } catch { redirect('/') }
  const cookieStore = await cookies()
  const user = cookieStore.get('session_user')?.value ?? ''

  const numero     = (fd.get('numero_ordine') as string)?.trim()
  const fornitore  = (fd.get('fornitore') as string)?.trim()
  const descrizione = (fd.get('descrizione') as string)?.trim() ?? ''
  const totaleStr  = (fd.get('totale') as string)?.trim()
  const dataOrdine = (fd.get('data_ordine') as string)?.trim()

  if (!fornitore || !dataOrdine) return { ok: false, error: 'Fornitore e data sono obbligatori.' }
  const totale = parseFloat(totaleStr || '0')
  if (isNaN(totale)) return { ok: false, error: 'Totale non valido.' }

  const conn = await getConnection()
  try {
    await conn.execute(
      `INSERT INTO ordini_fornitori (numero_ordine,fornitore,descrizione,totale,data_ordine,created_by)
       VALUES (?,?,?,?,?,?)`,
      [numero || '', fornitore, descrizione, totale, dataOrdine, user]
    )
    return { ok: true }
  } catch { return { ok: false, error: 'Errore durante il salvataggio.' } }
  finally { await conn.end() }
}

export async function updateStatoFornitore(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  try { await checkAuth() } catch { redirect('/') }
  const id    = parseInt(fd.get('id') as string)
  const stato = (fd.get('stato') as string)?.trim()
  const STATI = ['bozza','inviato','confermato','ricevuto','annullato']
  if (isNaN(id) || !STATI.includes(stato)) return { ok: false, error: 'Dati non validi.' }
  const conn = await getConnection()
  try {
    await conn.execute('UPDATE ordini_fornitori SET stato=? WHERE id=?', [stato, id])
    return { ok: true }
  } catch { return { ok: false, error: 'Errore aggiornamento.' } }
  finally { await conn.end() }
}

export async function deleteOrdineFornitore(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') return { ok: false, error: 'Solo admin.' }
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  const conn = await getConnection()
  try {
    await conn.execute('DELETE FROM ordini_fornitori WHERE id=?', [id])
    return { ok: true }
  } catch { return { ok: false, error: 'Errore eliminazione.' } }
  finally { await conn.end() }
}
