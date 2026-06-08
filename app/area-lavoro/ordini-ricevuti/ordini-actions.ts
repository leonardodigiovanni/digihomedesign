'use server'

import { revalidatePath } from 'next/cache'
import { getConnection } from '@/lib/db'

async function ensureTables(db: Awaited<ReturnType<typeof getConnection>>) {
  try { await db.execute('ALTER TABLE ordini_clienti ADD COLUMN visibile_cliente TINYINT(1) NOT NULL DEFAULT 1') } catch {}
}

export async function toggleVisibile(ordineId: number, visibile: boolean) {
  const db = await getConnection()
  try {
    await ensureTables(db)
    await db.execute('UPDATE ordini_clienti SET visibile_cliente = ? WHERE id = ?', [visibile ? 1 : 0, ordineId])
    revalidatePath('/area-lavoro/ordini-ricevuti')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  } finally {
    await db.end()
  }
}

export async function eliminaOrdine(ordineId: number) {
  const db = await getConnection()
  try {
    await ensureTables(db)
    await db.execute('DELETE FROM ordini_clienti_articoli WHERE ordine_id = ?', [ordineId])
    await db.execute('DELETE FROM ordini_clienti WHERE id = ?', [ordineId])
    revalidatePath('/area-lavoro/ordini-ricevuti')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  } finally {
    await db.end()
  }
}
