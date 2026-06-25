'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')
}

export async function aggiungiAPreventivo2(
  articolo2_id: number,
  percorso_id: number,
  categoria: string,
  sottocategoria: string,
): Promise<{ ok: boolean; error?: string }> {
  await checkAdmin()
  const db = await getConnection()
  try {
    await db.execute(
      'INSERT INTO preventivo2 (articolo2_id, percorso_id, categoria, sottocategoria) VALUES (?,?,?,?)',
      [articolo2_id, percorso_id || null, categoria, sottocategoria]
    )
    revalidatePath('/amministrazione/area-di-test')
    return { ok: true }
  } catch {
    return { ok: false, error: 'Errore inserimento.' }
  } finally {
    await db.end()
  }
}

export async function inserisciArticolo2(data: {
  fase: string; materiale: string; tipologia: string; ambiente: string
  articolo: string; fascia: string; marca: string; serie: string
  percorsi: { categoria: string; sottocategoria: string }[]
}): Promise<{ ok: boolean; error?: string }> {
  await checkAdmin()
  const db = await getConnection()
  try {
    const [res] = await db.execute(
      `INSERT INTO articoli2 (fase, materiale, tipologia, ambiente, articolo, fascia, marca, serie)
       VALUES (?,?,?,?,?,?,?,?)`,
      [data.fase, data.materiale, data.tipologia, data.ambiente, data.articolo, data.fascia, data.marca, data.serie]
    ) as [{ insertId: number }, unknown]
    const newId = res.insertId
    for (const p of data.percorsi) {
      if (!p.categoria && !p.sottocategoria) continue
      await db.execute(
        'INSERT INTO articoli2_percorsi (articolo2_id, categoria, sottocategoria) VALUES (?,?,?)',
        [newId, p.categoria, p.sottocategoria]
      )
    }
    revalidatePath('/amministrazione/area-di-test')
    return { ok: true }
  } catch {
    return { ok: false, error: 'Errore inserimento.' }
  } finally {
    await db.end()
  }
}

export async function eliminaDaPreventivo2(id: number): Promise<{ ok: boolean }> {
  await checkAdmin()
  const db = await getConnection()
  try {
    await db.execute('DELETE FROM preventivo2 WHERE id = ?', [id])
    revalidatePath('/amministrazione/area-di-test')
    return { ok: true }
  } finally {
    await db.end()
  }
}
