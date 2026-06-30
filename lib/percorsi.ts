'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// ─── Tipi pubblici ────────────────────────────────────────────────────────────

export type Percorso = { id: number; categoria: string; sottocategoria: string }

// ─── Setup tabelle + migrazione idempotente ────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function ensurePercorsiTables(db: any): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS listini_percorsi (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      listino_id     INT NOT NULL,
      categoria      VARCHAR(100) NOT NULL DEFAULT '',
      sottocategoria VARCHAR(100) NOT NULL DEFAULT '',
      UNIQUE KEY uq_lp (listino_id, categoria, sottocategoria),
      CONSTRAINT fk_lp_listino FOREIGN KEY (listino_id) REFERENCES listini(id) ON DELETE CASCADE
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS catalogo_voci_percorsi (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      voce_id        INT NOT NULL,
      categoria      VARCHAR(100) NOT NULL DEFAULT '',
      sottocategoria VARCHAR(100) NOT NULL DEFAULT '',
      UNIQUE KEY uq_vp (voce_id, categoria, sottocategoria),
      CONSTRAINT fk_vp_voce FOREIGN KEY (voce_id) REFERENCES catalogo_voci(id) ON DELETE CASCADE
    )
  `)
  // Aggiunge FK a tabelle esistenti create senza vincolo (idempotente via catch)
  await db.execute(`
    ALTER TABLE listini_percorsi
      ADD CONSTRAINT fk_lp_listino FOREIGN KEY (listino_id) REFERENCES listini(id) ON DELETE CASCADE
  `).catch(() => {})
  await db.execute(`
    ALTER TABLE catalogo_voci_percorsi
      ADD CONSTRAINT fk_vp_voce FOREIGN KEY (voce_id) REFERENCES catalogo_voci(id) ON DELETE CASCADE
  `).catch(() => {})
}

// ─── Sync write path ──────────────────────────────────────────────────────────

// Aggiunge (se non esiste) la coppia corrente di un listino ai suoi percorsi
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function syncListinoPercorsi(db: any, listinoId: number, categoria: string, sottocategoria: string | null): Promise<void> {
  if (!categoria) return
  await db.execute(
    `INSERT IGNORE INTO listini_percorsi (listino_id, categoria, sottocategoria) VALUES (?, ?, ?)`,
    [listinoId, categoria, sottocategoria ?? '']
  ).catch(() => {})
}

// Aggiunge (se non esiste) la coppia corrente di una voce ai suoi percorsi
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function syncVocePercorsi(db: any, voceId: number, categoria: string | null, sottocategoria: string | null): Promise<void> {
  if (!categoria) return
  await db.execute(
    `INSERT IGNORE INTO catalogo_voci_percorsi (voce_id, categoria, sottocategoria) VALUES (?, ?, ?)`,
    [voceId, categoria, sottocategoria ?? '']
  ).catch(() => {})
}

// ─── Server actions — Listini percorsi ────────────────────────────────────────

async function checkAdmin() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente' && role !== 'direttore') redirect('/')
}

export async function addPercorsoListino(listinoId: number, categoria: string, sottocategoria: string): Promise<{ ok: boolean; error?: string }> {
  await checkAdmin()
  if (!categoria) return { ok: false, error: 'Categoria obbligatoria.' }
  const db = await getConnection()
  try {
    await ensurePercorsiTables(db)
    await db.execute(
      `INSERT IGNORE INTO listini_percorsi (listino_id, categoria, sottocategoria) VALUES (?, ?, ?)`,
      [listinoId, categoria.trim(), (sottocategoria ?? '').trim()]
    )
    revalidatePath('/area-lavoro/listini')
    return { ok: true }
  } catch { return { ok: false, error: 'Errore inserimento.' } }
  finally { await db.end() }
}

export async function removePercorsoListino(percorsoId: number): Promise<{ ok: boolean }> {
  await checkAdmin()
  const db = await getConnection()
  try {
    await db.execute(`DELETE FROM listini_percorsi WHERE id = ?`, [percorsoId])
    revalidatePath('/area-lavoro/listini')
    return { ok: true }
  } catch { return { ok: false } }
  finally { await db.end() }
}

// ─── Server actions — Catalogo voci percorsi ──────────────────────────────────

export async function addPercorsoVoce(voceId: number, categoria: string, sottocategoria: string): Promise<{ ok: boolean; error?: string }> {
  await checkAdmin()
  if (!categoria) return { ok: false, error: 'Categoria obbligatoria.' }
  const db = await getConnection()
  try {
    await ensurePercorsiTables(db)
    await db.execute(
      `INSERT IGNORE INTO catalogo_voci_percorsi (voce_id, categoria, sottocategoria) VALUES (?, ?, ?)`,
      [voceId, categoria.trim(), (sottocategoria ?? '').trim()]
    )
    revalidatePath('/area-lavoro/cataloghi')
    return { ok: true }
  } catch { return { ok: false, error: 'Errore inserimento.' } }
  finally { await db.end() }
}

export async function removePercorsoVoce(percorsoId: number): Promise<{ ok: boolean }> {
  await checkAdmin()
  const db = await getConnection()
  try {
    await db.execute(`DELETE FROM catalogo_voci_percorsi WHERE id = ?`, [percorsoId])
    revalidatePath('/area-lavoro/cataloghi')
    return { ok: true }
  } catch { return { ok: false } }
  finally { await db.end() }
}
