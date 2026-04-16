'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'

async function checkStaff() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const STAFF = ['dipendente','magazzino','direttore','admin','venditore','commercialista','ragioniere','operaio','marketing','email']
  if (!STAFF.includes(role)) throw new Error('Non autorizzato.')
  return role
}

export type MutResult = { ok: true } | { ok: false; error: string }

export async function addFornitore(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  try { await checkStaff() } catch { redirect('/') }

  const ragione_sociale = (fd.get('ragione_sociale') as string)?.trim()
  const indirizzo       = (fd.get('indirizzo') as string)?.trim() ?? ''
  const telefono        = (fd.get('telefono') as string)?.trim() ?? ''
  const email           = (fd.get('email') as string)?.trim() ?? ''
  const pec             = (fd.get('pec') as string)?.trim() ?? ''

  if (!ragione_sociale) return { ok: false, error: 'Ragione sociale obbligatoria.' }

  const conn = await getConnection()
  try {
    await conn.execute(
      'INSERT INTO fornitori (ragione_sociale,indirizzo,telefono,email,pec) VALUES (?,?,?,?,?)',
      [ragione_sociale, indirizzo, telefono, email, pec]
    )
    return { ok: true }
  } catch { return { ok: false, error: 'Errore durante il salvataggio.' } }
  finally { await conn.end() }
}

export async function updateFornitore(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  try { await checkStaff() } catch { redirect('/') }

  const id              = parseInt(fd.get('id') as string)
  const ragione_sociale = (fd.get('ragione_sociale') as string)?.trim()
  const indirizzo       = (fd.get('indirizzo') as string)?.trim() ?? ''
  const telefono        = (fd.get('telefono') as string)?.trim() ?? ''
  const email           = (fd.get('email') as string)?.trim() ?? ''
  const pec             = (fd.get('pec') as string)?.trim() ?? ''

  if (isNaN(id) || !ragione_sociale) return { ok: false, error: 'Dati non validi.' }

  const conn = await getConnection()
  try {
    await conn.execute(
      'UPDATE fornitori SET ragione_sociale=?,indirizzo=?,telefono=?,email=?,pec=? WHERE id=?',
      [ragione_sociale, indirizzo, telefono, email, pec, id]
    )
    return { ok: true }
  } catch { return { ok: false, error: 'Errore durante il salvataggio.' } }
  finally { await conn.end() }
}

export async function deleteFornitore(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') return { ok: false, error: 'Solo admin.' }
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  const conn = await getConnection()
  try {
    await conn.execute('DELETE FROM fornitori WHERE id=?', [id])
    return { ok: true }
  } catch { return { ok: false, error: 'Errore eliminazione.' } }
  finally { await conn.end() }
}
