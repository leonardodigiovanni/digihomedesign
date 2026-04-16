'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'

const STAFF = ['dipendente','magazzino','direttore','admin','venditore','commercialista','ragioniere','operaio','marketing','email']

async function checkStaff() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (!STAFF.includes(role)) throw new Error('Non autorizzato.')
  return role
}

export type MutResult = { ok: true } | { ok: false; error: string }

export async function toggleVisibileOrdine(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  try { await checkStaff() } catch { redirect('/') }
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  const conn = await getConnection()
  try {
    // Migration: aggiunge colonna se non esiste
    try { await conn.execute('ALTER TABLE ordini_ricevuti ADD COLUMN visibile_cliente TINYINT(1) NOT NULL DEFAULT 1') } catch { /* esiste già */ }
    await conn.execute('UPDATE ordini_ricevuti SET visibile_cliente = 1 - visibile_cliente WHERE id = ?', [id])
    return { ok: true }
  } catch { return { ok: false, error: 'Errore aggiornamento.' } }
  finally { await conn.end() }
}

export async function addOrdineRicevuto(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  try { await checkStaff() } catch { redirect('/') }

  const numero      = (fd.get('numero_ordine') as string)?.trim() ?? ''
  const clienteId   = parseInt(fd.get('cliente_id') as string)
  const descrizione = (fd.get('descrizione') as string)?.trim() ?? ''
  const totaleStr   = (fd.get('totale') as string)?.trim()
  const dataOrdine  = (fd.get('data_ordine') as string)?.trim()

  if (!clienteId || !dataOrdine) return { ok: false, error: 'Cliente e data sono obbligatori.' }
  const totale = parseFloat(totaleStr || '0')
  if (isNaN(totale)) return { ok: false, error: 'Totale non valido.' }

  const conn = await getConnection()
  try {
    // Ricava display name del cliente
    const [cRows] = await conn.execute(
      'SELECT nome, cognome, ragione_sociale FROM clienti WHERE id = ? LIMIT 1', [clienteId]
    ) as [{ nome: string; cognome: string; ragione_sociale: string }[], unknown]
    if (cRows.length === 0) return { ok: false, error: 'Cliente non trovato.' }
    const c = cRows[0]
    const clienteNome = c.ragione_sociale || `${c.cognome} ${c.nome}`.trim()

    await conn.execute(
      `INSERT INTO ordini_ricevuti (numero_ordine, cliente, cliente_id, descrizione, totale, data_ordine)
       VALUES (?,?,?,?,?,?)`,
      [numero, clienteNome, clienteId, descrizione, totale, dataOrdine]
    )
    return { ok: true }
  } catch { return { ok: false, error: 'Errore durante il salvataggio.' } }
  finally { await conn.end() }
}

export async function updateStatoRicevuto(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  try { await checkStaff() } catch { redirect('/') }
  const id    = parseInt(fd.get('id') as string)
  const stato = (fd.get('stato') as string)?.trim()
  const STATI = ['nuovo','in_lavorazione','completato','annullato']
  if (isNaN(id) || !STATI.includes(stato)) return { ok: false, error: 'Dati non validi.' }
  const conn = await getConnection()
  try {
    await conn.execute('UPDATE ordini_ricevuti SET stato=? WHERE id=?', [stato, id])
    return { ok: true }
  } catch { return { ok: false, error: 'Errore aggiornamento.' } }
  finally { await conn.end() }
}

export async function deleteOrdineRicevuto(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') return { ok: false, error: 'Solo admin.' }
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  const conn = await getConnection()
  try {
    await conn.execute('DELETE FROM ordini_ricevuti WHERE id=?', [id])
    return { ok: true }
  } catch { return { ok: false, error: 'Errore eliminazione.' } }
  finally { await conn.end() }
}

export async function addNota(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const user = cookieStore.get('session_user')?.value ?? ''
  if (role === 'cliente' || !role) redirect('/')

  const ordineId = parseInt(fd.get('ordine_id') as string)
  const testo    = (fd.get('testo') as string)?.trim()
  if (isNaN(ordineId) || !testo) return { ok: false, error: 'Dati mancanti.' }

  const conn = await getConnection()
  try {
    await conn.execute(
      'INSERT INTO ordini_note (ordine_id,testo,autore) VALUES (?,?,?)',
      [ordineId, testo, user]
    )
    return { ok: true }
  } catch { return { ok: false, error: 'Errore salvataggio nota.' } }
  finally { await conn.end() }
}

export async function deleteNota(_p: MutResult | null, fd: FormData): Promise<MutResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') return { ok: false, error: 'Solo admin.' }
  const id = parseInt(fd.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }
  const conn = await getConnection()
  try {
    await conn.execute('DELETE FROM ordini_note WHERE id=?', [id])
    return { ok: true }
  } catch { return { ok: false, error: 'Errore eliminazione.' } }
  finally { await conn.end() }
}
