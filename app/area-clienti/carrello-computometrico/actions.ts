'use server'

import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type RigaCarrello = {
  uid: number
  parentUid?: number
  listino_id: number
  categoria: string
  produttore: string
  serie: string
  descrizione: string
  unita: string
  quantita: number
  larghezza_cm?: number
  altezza_cm?: number
  colore?: string
  note?: string
  prezzo_unitario: number
  totale_riga: number
}

export type RigaComputometrico = {
  listino_id: number | null
  categoria: string
  descrizione: string
  unita: string
  quantita: number
  prezzo_unitario: number
  totale_riga: number
  note: string
}

export type SalvaResult = { ok: boolean; error?: string; id?: number }

async function ensureCarrelloTable(db: Awaited<ReturnType<typeof getConnection>>) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS computometrici_carrello (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      username        VARCHAR(100)  NOT NULL,
      parent_id       INT           NULL,
      listino_id      INT           NOT NULL,
      categoria       VARCHAR(200)  NOT NULL DEFAULT '',
      produttore      VARCHAR(200)  NOT NULL DEFAULT '',
      serie           VARCHAR(200)  NOT NULL DEFAULT '',
      descrizione     TEXT          NOT NULL,
      unita           VARCHAR(50)   NOT NULL DEFAULT 'pz',
      quantita        DECIMAL(10,3) NOT NULL DEFAULT 1,
      larghezza_cm    DECIMAL(10,2) NULL,
      altezza_cm      DECIMAL(10,2) NULL,
      colore          VARCHAR(200)  NULL,
      note            TEXT          NULL,
      prezzo_unitario DECIMAL(12,2) NOT NULL DEFAULT 0,
      totale_riga     DECIMAL(12,2) NOT NULL DEFAULT 0,
      created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

async function ensureTables(db: Awaited<ReturnType<typeof getConnection>>) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS computometrico_articoli (
      id                INT AUTO_INCREMENT PRIMARY KEY,
      computometrico_id INT NOT NULL,
      listino_id        INT NULL,
      categoria         VARCHAR(100) NOT NULL DEFAULT '',
      descrizione       VARCHAR(300) NOT NULL DEFAULT '',
      unita             VARCHAR(30)  NOT NULL DEFAULT 'pz',
      quantita          DECIMAL(10,4) NOT NULL DEFAULT 1,
      prezzo_unitario   DECIMAL(10,2) NOT NULL DEFAULT 0,
      totale_riga       DECIMAL(12,2) NOT NULL DEFAULT 0,
      note              TEXT NULL,
      ordine            INT NOT NULL DEFAULT 0,
      created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function addRigaCarrello(data: Omit<RigaCarrello, 'uid'>): Promise<{ ok: boolean; uid?: number; error?: string }> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!username) return { ok: false, error: 'Non autenticato.' }

  const db = await getConnection()
  try {
    await ensureCarrelloTable(db)
    const [ins] = await db.execute(
      `INSERT INTO computometrici_carrello
         (username, parent_id, listino_id, categoria, produttore, serie, descrizione,
          unita, quantita, larghezza_cm, altezza_cm, colore, note, prezzo_unitario, totale_riga)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, data.parentUid ?? null, data.listino_id, data.categoria, data.produttore,
       data.serie, data.descrizione, data.unita, data.quantita,
       data.larghezza_cm ?? null, data.altezza_cm ?? null, data.colore ?? null,
       data.note ?? null, data.prezzo_unitario, data.totale_riga]
    ) as [{ insertId: number }, unknown]
    return { ok: true, uid: ins.insertId }
  } catch (e) {
    return { ok: false, error: String(e) }
  } finally {
    await db.end()
  }
}

export async function removeRigaCarrello(uid: number): Promise<{ ok: boolean }> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!username) return { ok: false }

  const db = await getConnection()
  try {
    await ensureCarrelloTable(db)
    await db.execute(
      `DELETE FROM computometrici_carrello WHERE (id = ? OR parent_id = ?) AND username = ?`,
      [uid, uid, username]
    )
    return { ok: true }
  } catch {
    return { ok: false }
  } finally {
    await db.end()
  }
}

export async function updateNoteCarrello(uid: number, note: string): Promise<{ ok: boolean }> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!username) return { ok: false }

  const db = await getConnection()
  try {
    await db.execute(
      `UPDATE computometrici_carrello SET note = ? WHERE id = ? AND username = ?`,
      [note || null, uid, username]
    )
    return { ok: true }
  } catch {
    return { ok: false }
  } finally {
    await db.end()
  }
}

export async function clearCarrelloComputometrico(): Promise<{ ok: boolean }> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!username) return { ok: false }

  const db = await getConnection()
  try {
    await db.execute(
      `DELETE FROM computometrici_carrello WHERE username = ?`,
      [username]
    )
    return { ok: true }
  } catch {
    return { ok: false }
  } finally {
    await db.end()
  }
}

export async function salvaComputometrico(
  righe: RigaComputometrico[],
  descrizione: string
): Promise<SalvaResult> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  const role     = cookieStore.get('session_role')?.value ?? ''
  if (!username || !role) return { ok: false, error: 'Non autenticato.' }
  if (righe.length === 0) return { ok: false, error: 'Nessun articolo nel carrello.' }

  const db = await getConnection()
  try {
    await ensureTables(db)

    const [uRows] = await db.execute(
      'SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]
    ) as [{ cliente_id: number | null }[], unknown]
    const clienteId = uRows[0]?.cliente_id ?? null

    const importo = righe.reduce((acc, r) => acc + r.totale_riga, 0)
    const today = new Date().toISOString().slice(0, 10)
    const [ins] = await db.execute(
      `INSERT INTO computometrici (numero, cliente_id, creato_da, descrizione, stato, importo_stimato, data, note, visibile_cliente)
       VALUES ('', ?, ?, ?, 'bozza', ?, ?, NULL, 1)`,
      [clienteId, username, descrizione || 'Nuova stima', importo, today]
    ) as [{ insertId: number }, unknown]
    const computometricoId = ins.insertId

    await db.execute(
      `UPDATE computometrici SET numero = CONCAT('C-', id) WHERE id = ?`,
      [computometricoId]
    )

    for (let i = 0; i < righe.length; i++) {
      const r = righe[i]
      await db.execute(
        `INSERT INTO computometrico_articoli
           (computometrico_id, listino_id, categoria, descrizione, unita, quantita, prezzo_unitario, totale_riga, note, ordine)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [computometricoId, r.listino_id ?? null, r.categoria, r.descrizione, r.unita,
         r.quantita, r.prezzo_unitario, r.totale_riga, r.note || null, i]
      )
    }

    revalidatePath('/area-clienti/computometrici')
    return { ok: true, id: computometricoId }
  } catch (e) {
    return { ok: false, error: String(e) }
  } finally {
    await db.end()
  }
}
