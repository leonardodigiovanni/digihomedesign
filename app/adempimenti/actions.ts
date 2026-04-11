'use server'

import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'

async function ensureTable() {
  const db = await getConnection()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS adempimenti (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      descrizione  VARCHAR(300) NOT NULL,
      ente         VARCHAR(150) NOT NULL DEFAULT '',
      periodo      VARCHAR(100) NOT NULL DEFAULT '',
      data_scadenza DATE NULL,
      incaricato   VARCHAR(100) NOT NULL DEFAULT '',
      stato        ENUM('da_fare','in_corso','completato','n_a') NOT NULL DEFAULT 'da_fare',
      anno         SMALLINT NOT NULL,
      ricorrente   TINYINT(1) NOT NULL DEFAULT 1,
      note         TEXT NULL,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.end()
}

export async function addAdempimento(_: unknown, formData: FormData) {
  await ensureTable()

  const descrizione   = (formData.get('descrizione')   as string) ?? ''
  const ente          = (formData.get('ente')          as string) ?? ''
  const periodo       = (formData.get('periodo')       as string) ?? ''
  const dataRaw       = (formData.get('data_scadenza') as string) ?? ''
  const data_scadenza = dataRaw ? dataRaw.slice(0, 10) + 'T12:00:00' : null
  const incaricato    = (formData.get('incaricato')    as string) ?? ''
  const anno          = parseInt(formData.get('anno')  as string)
  const ricorrente    = formData.get('ricorrente') === '1' ? 1 : 0
  const note          = (formData.get('note')          as string) ?? ''

  if (!descrizione || !anno) return { error: 'Descrizione e anno sono obbligatori.' }

  const db = await getConnection()
  await db.execute(
    'INSERT INTO adempimenti (descrizione, ente, periodo, data_scadenza, incaricato, stato, anno, ricorrente, note) VALUES (?,?,?,?,?,?,?,?,?)',
    [descrizione, ente, periodo, data_scadenza, incaricato, 'da_fare', anno, ricorrente, note]
  )
  await db.end()
  revalidatePath('/adempimenti')
  return { success: true }
}

export async function deleteAdempimento(_: unknown, formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID mancante.' }
  await ensureTable()
  const db = await getConnection()
  await db.execute('DELETE FROM adempimenti WHERE id = ?', [id])
  await db.end()
  revalidatePath('/adempimenti')
  return { success: true }
}

export async function updateStato(_: unknown, formData: FormData) {
  const id    = formData.get('id')    as string
  const stato = formData.get('stato') as string
  if (!id || !stato) return { error: 'Dati mancanti.' }
  await ensureTable()
  const db = await getConnection()
  await db.execute('UPDATE adempimenti SET stato = ? WHERE id = ?', [stato, id])
  await db.end()
  revalidatePath('/adempimenti')
  return { success: true }
}

export async function duplicaAnno(_: unknown, formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  if (!id) return { error: 'ID mancante.' }
  await ensureTable()
  const db = await getConnection()
  const [rows] = await db.query('SELECT * FROM adempimenti WHERE id = ?', [id])
  const r = (rows as Record<string, unknown>[])[0]
  if (!r) { await db.end(); return { error: 'Adempimento non trovato.' } }

  const nuovoAnno = Number(r.anno) + 1
  // Controlla se esiste già per quell'anno
  const [exist] = await db.query(
    'SELECT id FROM adempimenti WHERE descrizione = ? AND anno = ?',
    [r.descrizione, nuovoAnno]
  )
  if ((exist as unknown[]).length > 0) {
    await db.end()
    return { error: `Esiste già per il ${nuovoAnno}.` }
  }

  await db.execute(
    'INSERT INTO adempimenti (descrizione, ente, periodo, data_scadenza, incaricato, stato, anno, ricorrente, note) VALUES (?,?,?,?,?,?,?,?,?)',
    [r.descrizione, r.ente, r.periodo, r.data_scadenza, r.incaricato, 'da_fare', nuovoAnno, r.ricorrente, r.note] as any[]
  )
  await db.end()
  revalidatePath('/adempimenti')
  return { success: true }
}
