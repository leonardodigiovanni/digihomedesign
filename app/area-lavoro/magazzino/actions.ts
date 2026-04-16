'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'

const ALLOWED_ROLES = ['dipendente', 'magazzino', 'direttore', 'admin']

async function checkAuth() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (!ALLOWED_ROLES.includes(role)) throw new Error('Non autorizzato.')
  return role
}

export type AddMaterialeResult =
  | { ok: true; id: number }
  | { ok: false; error: string }

export async function addMateriale(
  _prev: AddMaterialeResult | null,
  formData: FormData
): Promise<AddMaterialeResult> {
  try {
    await checkAuth()
  } catch {
    redirect('/')
  }

  const descrizione    = (formData.get('descrizione') as string)?.trim()
  const produttore     = (formData.get('produttore') as string)?.trim()
  const modello        = (formData.get('modello') as string)?.trim()
  const costoStr       = (formData.get('costo_unitario') as string)?.trim()
  const tipoUnita      = (formData.get('tipo_unita') as string)?.trim()
  const colore         = (formData.get('colore') as string)?.trim() ?? ''
  const giacenzaStr    = (formData.get('giacenza') as string)?.trim()

  if (!descrizione || !produttore || !modello || !costoStr || !tipoUnita) {
    return { ok: false, error: 'Compila tutti i campi obbligatori.' }
  }

  const costo    = parseFloat(costoStr)
  const giacenza = parseFloat(giacenzaStr || '0')

  if (isNaN(costo) || costo < 0)    return { ok: false, error: 'Costo non valido.' }
  if (isNaN(giacenza) || giacenza < 0) return { ok: false, error: 'Giacenza non valida.' }

  const conn = await getConnection()
  try {
    const [res] = await conn.execute(
      `INSERT INTO magazzino (descrizione, produttore, modello, costo_unitario, tipo_unita, colore, giacenza, totale_caricato)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [descrizione, produttore, modello, costo, tipoUnita, colore, giacenza, giacenza]
    ) as [{ insertId: number }, unknown]
    return { ok: true, id: res.insertId }
  } catch {
    return { ok: false, error: 'Errore durante il salvataggio.' }
  } finally {
    await conn.end()
  }
}

export type UpdateGiacenzaResult =
  | { ok: true; giacenza: number; totale_caricato: number }
  | { ok: false; error: string }

export async function updateGiacenza(
  _prev: UpdateGiacenzaResult | null,
  formData: FormData
): Promise<UpdateGiacenzaResult> {
  try {
    await checkAuth()
  } catch {
    redirect('/')
  }

  const id          = parseInt(formData.get('id') as string)
  const nuovaStr    = (formData.get('giacenza') as string)?.trim()
  const vecchiaStr  = (formData.get('giacenza_old') as string)?.trim()

  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  const nuova  = parseFloat(nuovaStr)
  const vecchia = parseFloat(vecchiaStr)

  if (isNaN(nuova) || nuova < 0)  return { ok: false, error: 'Valore non valido.' }
  if (isNaN(vecchia))              return { ok: false, error: 'Valore precedente non valido.' }

  const conn = await getConnection()
  try {
    // Se carico (aumento), aggiorna anche totale_caricato
    if (nuova > vecchia) {
      const delta = nuova - vecchia
      await conn.execute(
        'UPDATE magazzino SET giacenza = ?, totale_caricato = totale_caricato + ? WHERE id = ?',
        [nuova, delta, id]
      )
    } else {
      await conn.execute(
        'UPDATE magazzino SET giacenza = ? WHERE id = ?',
        [nuova, id]
      )
    }

    const [rows] = await conn.execute(
      'SELECT giacenza, totale_caricato FROM magazzino WHERE id = ?',
      [id]
    ) as [{ giacenza: number; totale_caricato: number }[], unknown]

    if (rows.length === 0) return { ok: false, error: 'Materiale non trovato.' }
    return { ok: true, giacenza: rows[0].giacenza, totale_caricato: rows[0].totale_caricato }
  } catch {
    return { ok: false, error: 'Errore durante l\'aggiornamento.' }
  } finally {
    await conn.end()
  }
}

export type DeleteMaterialeResult =
  | { ok: true }
  | { ok: false; error: string }

export async function deleteMateriale(
  _prev: DeleteMaterialeResult | null,
  formData: FormData
): Promise<DeleteMaterialeResult> {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') return { ok: false, error: 'Solo gli admin possono eliminare.' }

  const id = parseInt(formData.get('id') as string)
  if (isNaN(id)) return { ok: false, error: 'ID non valido.' }

  const conn = await getConnection()
  try {
    await conn.execute('DELETE FROM magazzino WHERE id = ?', [id])
    return { ok: true }
  } catch {
    return { ok: false, error: 'Errore durante l\'eliminazione.' }
  } finally {
    await conn.end()
  }
}
