'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
const ALL_ROLES = [
  'admin', 'cliente', 'dipendente', 'ragioniere', 'commercialista',
  'venditore', 'operaio', 'magazzino', 'direttore', 'marketing', 'email',
]

export type ChangeRoleResult =
  | { ok: true }
  | { ok: false; error: string }

export async function changeUserRole(
  _prev: ChangeRoleResult | null,
  formData: FormData
): Promise<ChangeRoleResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') {
    redirect('/')
  }

  const username = (formData.get('username') as string)?.trim()
  const newRole  = (formData.get('role') as string)?.trim()

  if (!username || !newRole) return { ok: false, error: 'Dati mancanti.' }

  const currentUser = cookieStore.get('session_user')?.value
  if (username === currentUser) {
    return { ok: false, error: 'Non puoi modificare il tuo stesso ruolo.' }
  }
  if (!ALL_ROLES.includes(newRole)) {
    return { ok: false, error: 'Ruolo non valido.' }
  }

  const conn = await getConnection()
  try {
    const [res] = await conn.execute(
      'UPDATE users SET role = ? WHERE username = ?',
      [newRole, username]
    ) as [{ affectedRows: number }, unknown]
    if (res.affectedRows === 0) return { ok: false, error: 'Utente non trovato.' }
  } finally {
    await conn.end()
  }

  return { ok: true }
}

export type ToggleCantieriResult =
  | { ok: true; newValue: number }
  | { ok: false; error: string }

export async function toggleCantieriCliente(
  _prev: ToggleCantieriResult | null,
  formData: FormData
): Promise<ToggleCantieriResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')

  const username = (formData.get('username') as string)?.trim()
  if (!username) return { ok: false, error: 'Dati mancanti.' }

  const conn = await getConnection()
  try {
    // Migrazione: aggiunge colonna se non esiste
    try {
      await conn.execute('ALTER TABLE users ADD COLUMN cantieri_visibili TINYINT(1) NOT NULL DEFAULT 1')
    } catch { /* esiste già */ }

    const [rows] = await conn.execute(
      'SELECT cantieri_visibili FROM users WHERE username = ?', [username]
    ) as [{ cantieri_visibili: number }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Utente non trovato.' }

    const newValue = rows[0].cantieri_visibili === 1 ? 0 : 1
    await conn.execute('UPDATE users SET cantieri_visibili = ? WHERE username = ?', [newValue, username])
    return { ok: true, newValue }
  } finally {
    await conn.end()
  }
}

export type ToggleOrdiniResult =
  | { ok: true; newValue: number }
  | { ok: false; error: string }

export async function toggleOrdiniCliente(
  _prev: ToggleOrdiniResult | null,
  formData: FormData
): Promise<ToggleOrdiniResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')

  const username = (formData.get('username') as string)?.trim()
  if (!username) return { ok: false, error: 'Dati mancanti.' }

  const conn = await getConnection()
  try {
    try { await conn.execute('ALTER TABLE users ADD COLUMN miei_ordini_visibili TINYINT(1) NOT NULL DEFAULT 1') } catch { /* esiste già */ }
    const [rows] = await conn.execute(
      'SELECT miei_ordini_visibili FROM users WHERE username = ?', [username]
    ) as [{ miei_ordini_visibili: number }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Utente non trovato.' }
    const newValue = rows[0].miei_ordini_visibili === 1 ? 0 : 1
    await conn.execute('UPDATE users SET miei_ordini_visibili = ? WHERE username = ?', [newValue, username])
    return { ok: true, newValue }
  } finally {
    await conn.end()
  }
}

export type ToggleActiveResult =
  | { ok: true; newActive: number }
  | { ok: false; error: string }

export async function toggleUserActive(
  _prev: ToggleActiveResult | null,
  formData: FormData
): Promise<ToggleActiveResult> {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') {
    redirect('/')
  }

  const username = (formData.get('username') as string)?.trim()
  if (!username) return { ok: false, error: 'Dati mancanti.' }

  const currentUser = cookieStore.get('session_user')?.value
  if (username === currentUser) {
    return { ok: false, error: 'Non puoi disattivare il tuo stesso account.' }
  }

  const conn = await getConnection()
  try {
    const [rows] = await conn.execute(
      'SELECT is_active FROM users WHERE username = ?',
      [username]
    ) as [{ is_active: number }[], unknown]
    if (rows.length === 0) return { ok: false, error: 'Utente non trovato.' }

    const newActive = rows[0].is_active === 1 ? 0 : 1
    await conn.execute(
      'UPDATE users SET is_active = ? WHERE username = ?',
      [newActive, username]
    )
    return { ok: true, newActive }
  } finally {
    await conn.end()
  }
}
