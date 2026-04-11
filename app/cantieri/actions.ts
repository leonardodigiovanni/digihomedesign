'use server'

import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'

async function ensureTables() {
  const db = await getConnection()

  await db.execute(`
    CREATE TABLE IF NOT EXISTS cantieri (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      cliente_id     INT NULL,
      titolo         VARCHAR(200) NOT NULL,
      indirizzo      VARCHAR(300) NOT NULL DEFAULT '',
      stato          ENUM('preventivo','in_corso','completato','sospeso') NOT NULL DEFAULT 'preventivo',
      data_preventivo DATE NULL,
      inizio_lavori  DATE NULL,
      fine_lavori    DATE NULL,
      note_pubbliche TEXT NULL,
      note_interne   TEXT NULL,
      created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS cantieri_lavori (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      cantiere_id      INT NOT NULL,
      descrizione      VARCHAR(300) NOT NULL,
      qta              DECIMAL(10,2) NOT NULL DEFAULT 1,
      unita            VARCHAR(20)  NOT NULL DEFAULT 'cad',
      prezzo_unit      DECIMAL(10,2) NOT NULL DEFAULT 0,
      sconto_pct       DECIMAL(5,2)  NOT NULL DEFAULT 0,
      totale           DECIMAL(10,2) GENERATED ALWAYS AS (qta * prezzo_unit * (1 - sconto_pct / 100)) STORED,
      visibile_cliente TINYINT(1) NOT NULL DEFAULT 1,
      FOREIGN KEY (cantiere_id) REFERENCES cantieri(id) ON DELETE CASCADE
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS cantieri_media (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      cantiere_id      INT NOT NULL,
      tipo             ENUM('foto','video') NOT NULL DEFAULT 'foto',
      filename         VARCHAR(255) NOT NULL,
      descrizione      VARCHAR(200) NULL,
      visibile_cliente TINYINT(1) NOT NULL DEFAULT 1,
      created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cantiere_id) REFERENCES cantieri(id) ON DELETE CASCADE
    )
  `)

  // Migration: visibile_cliente sul cantiere stesso
  try { await db.execute('ALTER TABLE cantieri ADD COLUMN visibile_cliente TINYINT(1) NOT NULL DEFAULT 1') } catch { /* esiste già */ }

  await db.end()
}

function dateField(fd: FormData, key: string): string | null {
  const v = (fd.get(key) as string ?? '').slice(0, 10)
  return v ? v + 'T12:00:00' : null
}

// ─── Cantieri ─────────────────────────────────────────────────────────────────

export async function addCantiere(_: unknown, formData: FormData) {
  await ensureTables()

  const cliente_id    = parseInt(formData.get('cliente_id') as string) || null
  if (!cliente_id) return { error: 'Seleziona un cliente.' }
  const titolo        = (formData.get('titolo')    as string) ?? ''
  const indirizzo     = (formData.get('indirizzo') as string) ?? ''
  const stato         = (formData.get('stato')     as string) ?? 'preventivo'
  const prev          = dateField(formData, 'data_preventivo')
  const inizio        = dateField(formData, 'inizio_lavori')
  const fine          = dateField(formData, 'fine_lavori')
  const note_pub      = (formData.get('note_pubbliche') as string) ?? ''
  const note_int      = (formData.get('note_interne')   as string) ?? ''

  if (!titolo) return { error: 'Il titolo è obbligatorio.' }

  const db = await getConnection()
  // Migrazione: aggiunge data_preventivo se la tabella esisteva già
  try { await db.execute('ALTER TABLE cantieri ADD COLUMN data_preventivo DATE NULL AFTER fine_lavori') } catch { /* esiste già */ }

  await db.execute(
    'INSERT INTO cantieri (cliente_id, titolo, indirizzo, stato, data_preventivo, inizio_lavori, fine_lavori, note_pubbliche, note_interne) VALUES (?,?,?,?,?,?,?,?,?)',
    [cliente_id, titolo, indirizzo, stato, prev, inizio, fine, note_pub, note_int]
  )
  await db.end()
  revalidatePath('/cantieri')
  return { success: true }
}

export async function updateStatoCantiere(_: unknown, formData: FormData) {
  const id    = formData.get('id')    as string
  const stato = formData.get('stato') as string
  if (!id || !stato) return { error: 'Dati mancanti.' }
  await ensureTables()
  const db = await getConnection()
  await db.execute('UPDATE cantieri SET stato = ? WHERE id = ?', [stato, id])
  await db.end()
  revalidatePath('/cantieri')
  return { success: true }
}

export async function toggleVisibileCantiere(_: unknown, formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID mancante.' }
  await ensureTables()
  const db = await getConnection()
  await db.execute('UPDATE cantieri SET visibile_cliente = 1 - visibile_cliente WHERE id = ?', [id])
  await db.end()
  revalidatePath('/cantieri')
  return { success: true }
}

export async function deleteCantiere(_: unknown, formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID mancante.' }
  await ensureTables()
  const db = await getConnection()
  await db.execute('DELETE FROM cantieri WHERE id = ?', [id])
  await db.end()
  revalidatePath('/cantieri')
  return { success: true }
}

// ─── Lavori ───────────────────────────────────────────────────────────────────

export async function addLavoro(_: unknown, formData: FormData) {
  await ensureTables()

  const cantiere_id      = parseInt(formData.get('cantiere_id')      as string)
  const descrizione      = (formData.get('descrizione')              as string) ?? ''
  const qta              = parseFloat(formData.get('qta')            as string) || 1
  const unita            = (formData.get('unita')                    as string) || 'cad'
  const prezzo_unit      = parseFloat(formData.get('prezzo_unit')    as string) || 0
  const sconto_pct       = parseFloat(formData.get('sconto_pct')     as string) || 0
  const visibile_cliente = formData.get('visibile_cliente') === '1' ? 1 : 0

  if (!cantiere_id || !descrizione) return { error: 'Dati mancanti.' }

  const db = await getConnection()
  await db.execute(
    'INSERT INTO cantieri_lavori (cantiere_id, descrizione, qta, unita, prezzo_unit, sconto_pct, visibile_cliente) VALUES (?,?,?,?,?,?,?)',
    [cantiere_id, descrizione, qta, unita, prezzo_unit, sconto_pct, visibile_cliente]
  )
  await db.end()
  revalidatePath('/cantieri')
  return { success: true }
}

export async function deleteLavoro(_: unknown, formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID mancante.' }
  await ensureTables()
  const db = await getConnection()
  await db.execute('DELETE FROM cantieri_lavori WHERE id = ?', [id])
  await db.end()
  revalidatePath('/cantieri')
  return { success: true }
}

// ─── Media ────────────────────────────────────────────────────────────────────

export async function addMedia(_: unknown, formData: FormData) {
  await ensureTables()

  const cantiere_id      = parseInt(formData.get('cantiere_id')      as string)
  const filename         = (formData.get('filename')                 as string) ?? ''
  const tipo             = (formData.get('tipo')                     as string) ?? 'foto'
  const descrizione      = (formData.get('descrizione')              as string) ?? ''
  const visibile_cliente = formData.get('visibile_cliente') === '1' ? 1 : 0

  if (!cantiere_id || !filename) return { error: 'Dati mancanti.' }

  const db = await getConnection()
  await db.execute(
    'INSERT INTO cantieri_media (cantiere_id, tipo, filename, descrizione, visibile_cliente) VALUES (?,?,?,?,?)',
    [cantiere_id, tipo, filename, descrizione, visibile_cliente]
  )
  await db.end()
  revalidatePath('/cantieri')
  return { success: true }
}

export async function deleteMedia(_: unknown, formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID mancante.' }
  await ensureTables()
  const db = await getConnection()
  await db.execute('DELETE FROM cantieri_media WHERE id = ?', [id])
  await db.end()
  revalidatePath('/cantieri')
  return { success: true }
}
