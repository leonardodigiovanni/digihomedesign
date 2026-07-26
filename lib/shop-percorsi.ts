'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// ─── Tipi pubblici ────────────────────────────────────────────────────────────

export type PercorsoShop = { id: number; categoria: string; sottocategoria: string }

// ─── Setup tabella — idempotente ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function ensureShopPercorsiTables(db: any): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS shop_percorsi (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      listino_id     INT NOT NULL,
      categoria      VARCHAR(100) NOT NULL DEFAULT '',
      sottocategoria VARCHAR(100) NOT NULL DEFAULT '',
      UNIQUE KEY uq_sp (listino_id, categoria, sottocategoria),
      CONSTRAINT fk_sp_listino FOREIGN KEY (listino_id) REFERENCES listini(id) ON DELETE CASCADE
    )
  `)
}

// ─── Server actions ───────────────────────────────────────────────────────────

async function checkAdmin() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente' && role !== 'direttore') redirect('/')
}

export async function addPercorsoShop(listinoId: number, categoria: string, sottocategoria: string): Promise<{ ok: boolean; error?: string }> {
  await checkAdmin()
  if (!categoria) return { ok: false, error: 'Categoria obbligatoria.' }
  const db = await getConnection()
  try {
    await ensureShopPercorsiTables(db)
    await db.execute(
      `INSERT IGNORE INTO shop_percorsi (listino_id, categoria, sottocategoria) VALUES (?, ?, ?)`,
      [listinoId, categoria.trim(), (sottocategoria ?? '').trim()]
    )
    revalidatePath('/area-lavoro/listini')
    revalidatePath('/shop')
    return { ok: true }
  } catch { return { ok: false, error: 'Errore inserimento.' } }
  finally { await db.end() }
}

export async function removePercorsoShop(percorsoId: number): Promise<{ ok: boolean }> {
  await checkAdmin()
  const db = await getConnection()
  try {
    await db.execute(`DELETE FROM shop_percorsi WHERE id = ?`, [percorsoId])
    revalidatePath('/area-lavoro/listini')
    revalidatePath('/shop')
    return { ok: true }
  } catch { return { ok: false } }
  finally { await db.end() }
}
