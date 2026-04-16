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

export async function addCliente(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  try { await checkStaff() } catch { redirect('/') }

  const tipo            = (fd.get('tipo') as string)?.trim()
  const nome            = (fd.get('nome') as string)?.trim() ?? ''
  const cognome         = (fd.get('cognome') as string)?.trim() ?? ''
  const ragione_sociale = (fd.get('ragione_sociale') as string)?.trim() ?? ''
  const indirizzo       = (fd.get('indirizzo') as string)?.trim() ?? ''
  const telefono        = (fd.get('telefono') as string)?.trim() ?? ''
  const email           = (fd.get('email') as string)?.trim() ?? ''
  const pec             = (fd.get('pec') as string)?.trim() ?? ''
  const codice_sdi      = (fd.get('codice_sdi') as string)?.trim() ?? ''
  const codice_fiscale  = (fd.get('codice_fiscale') as string)?.trim().toUpperCase() ?? ''
  const partita_iva     = (fd.get('partita_iva') as string)?.trim() ?? ''

  if (tipo !== 'fisica' && tipo !== 'giuridica') return { ok: false, error: 'Tipo non valido.' }
  if (tipo === 'fisica' && (!nome || !cognome)) return { ok: false, error: 'Nome e cognome obbligatori.' }
  if (tipo === 'giuridica' && !ragione_sociale) return { ok: false, error: 'Ragione sociale obbligatoria.' }

  const conn = await getConnection()
  try {
    await conn.execute(
      `INSERT INTO clienti (tipo,nome,cognome,ragione_sociale,indirizzo,telefono,email,pec,codice_sdi,codice_fiscale,partita_iva)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [tipo, nome, cognome, ragione_sociale, indirizzo, telefono, email, pec, codice_sdi, codice_fiscale, partita_iva]
    )
    return { ok: true }
  } catch { return { ok: false, error: 'Errore durante il salvataggio.' } }
  finally { await conn.end() }
}

export async function updateCliente(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  try { await checkStaff() } catch { redirect('/') }

  const id              = parseInt(fd.get('id') as string)
  const tipo            = (fd.get('tipo') as string)?.trim()
  const nome            = (fd.get('nome') as string)?.trim() ?? ''
  const cognome         = (fd.get('cognome') as string)?.trim() ?? ''
  const ragione_sociale = (fd.get('ragione_sociale') as string)?.trim() ?? ''
  const indirizzo       = (fd.get('indirizzo') as string)?.trim() ?? ''
  const telefono        = (fd.get('telefono') as string)?.trim() ?? ''
  const email           = (fd.get('email') as string)?.trim() ?? ''
  const pec             = (fd.get('pec') as string)?.trim() ?? ''
  const codice_sdi      = (fd.get('codice_sdi') as string)?.trim() ?? ''
  const codice_fiscale  = (fd.get('codice_fiscale') as string)?.trim().toUpperCase() ?? ''
  const partita_iva     = (fd.get('partita_iva') as string)?.trim() ?? ''

  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  if (tipo !== 'fisica' && tipo !== 'giuridica') return { ok: false, error: 'Tipo non valido.' }
  if (tipo === 'fisica' && (!nome || !cognome)) return { ok: false, error: 'Nome e cognome obbligatori.' }
  if (tipo === 'giuridica' && !ragione_sociale) return { ok: false, error: 'Ragione sociale obbligatoria.' }

  const conn = await getConnection()
  try {
    await conn.execute(
      `UPDATE clienti SET tipo=?,nome=?,cognome=?,ragione_sociale=?,indirizzo=?,telefono=?,email=?,pec=?,codice_sdi=?,codice_fiscale=?,partita_iva=? WHERE id=?`,
      [tipo, nome, cognome, ragione_sociale, indirizzo, telefono, email, pec, codice_sdi, codice_fiscale, partita_iva, id]
    )
    return { ok: true }
  } catch { return { ok: false, error: 'Errore durante il salvataggio.' } }
  finally { await conn.end() }
}

export async function deleteCliente(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') return { ok: false, error: 'Solo admin.' }
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  const conn = await getConnection()
  try {
    await conn.execute('DELETE FROM clienti WHERE id=?', [id])
    return { ok: true }
  } catch { return { ok: false, error: 'Errore eliminazione.' } }
  finally { await conn.end() }
}
