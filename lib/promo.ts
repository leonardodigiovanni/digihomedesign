'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// ─── Tipi pubblici ────────────────────────────────────────────────────────────

export type PercorsoPromo = { id: number; categoria: string; sottocategoria: string }

// ─── Setup tabella + colonne — idempotente ─────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function ensurePromoTables(db: any): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS promo_percorsi (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      listino_id     INT NOT NULL,
      categoria      VARCHAR(100) NOT NULL DEFAULT '',
      sottocategoria VARCHAR(100) NOT NULL DEFAULT '',
      UNIQUE KEY uq_pp (listino_id, categoria, sottocategoria),
      CONSTRAINT fk_pp_listino FOREIGN KEY (listino_id) REFERENCES listini(id) ON DELETE CASCADE
    )
  `)
  await db.execute(`ALTER TABLE listini ADD COLUMN prezzo_promo    DECIMAL(10,2) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN fine_promozione DATE NULL`).catch(() => {})
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function checkAdmin() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente' && role !== 'direttore') redirect('/')
}

// Vero se il listino ha già almeno un percorso promo assegnato (usato per
// validare, in actions.ts, che modificando i prezzi non si rompa la regola
// "in promo => prezzo_promo impostato e inferiore al prezzo di vendita").
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function listinoHaPercorsiPromo(db: any, listinoId: number): Promise<boolean> {
  await ensurePromoTables(db)
  const [rows] = await db.query('SELECT id FROM promo_percorsi WHERE listino_id = ? LIMIT 1', [listinoId])
  return (rows as unknown[]).length > 0
}

// ─── Server actions — Percorsi promo per listino ──────────────────────────────

export async function addPercorsoPromo(listinoId: number, categoria: string, sottocategoria: string): Promise<{ ok: boolean; error?: string }> {
  await checkAdmin()
  if (!categoria) return { ok: false, error: 'Categoria obbligatoria.' }
  const db = await getConnection()
  try {
    await ensurePromoTables(db)
    const [rows] = await db.query('SELECT prezzo_vendita, prezzo_promo FROM listini WHERE id = ? LIMIT 1', [listinoId])
    const art = (rows as { prezzo_vendita: number; prezzo_promo: number | null }[])[0]
    if (!art) return { ok: false, error: 'Articolo non trovato.' }
    const prezzoVendita = Number(art.prezzo_vendita)
    const prezzoPromo = art.prezzo_promo != null ? Number(art.prezzo_promo) : null
    if (prezzoPromo == null || prezzoPromo >= prezzoVendita) {
      return { ok: false, error: 'Imposta prima un Prezzo Promo inferiore al Prezzo Vendita.' }
    }
    await db.execute(
      `INSERT IGNORE INTO promo_percorsi (listino_id, categoria, sottocategoria) VALUES (?, ?, ?)`,
      [listinoId, categoria.trim(), (sottocategoria ?? '').trim()]
    )
    revalidatePath('/area-lavoro/listini')
    revalidatePath('/promozioni')
    return { ok: true }
  } catch { return { ok: false, error: 'Errore inserimento.' } }
  finally { await db.end() }
}

export async function removePercorsoPromo(percorsoId: number): Promise<{ ok: boolean }> {
  await checkAdmin()
  const db = await getConnection()
  try {
    await db.execute(`DELETE FROM promo_percorsi WHERE id = ?`, [percorsoId])
    revalidatePath('/area-lavoro/listini')
    revalidatePath('/promozioni')
    return { ok: true }
  } catch { return { ok: false } }
  finally { await db.end() }
}
