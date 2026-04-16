'use server'

import { getConnection } from '@/lib/db'
import { revalidatePath } from 'next/cache'


async function ensureTables() {
  const db = await getConnection()

  await db.execute(`
    CREATE TABLE IF NOT EXISTS fatture (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      tipo           ENUM('attiva','passiva') NOT NULL,
      numero         VARCHAR(50)   NOT NULL,
      data           DATE          NOT NULL,
      controparte    VARCHAR(200)  NOT NULL,
      importo        DECIMAL(10,2) NOT NULL DEFAULT 0,
      iva            DECIMAL(5,2)  NOT NULL DEFAULT 22,
      totale         DECIMAL(10,2) GENERATED ALWAYS AS (importo + importo * iva / 100) STORED,
      importo_pagato DECIMAL(10,2) NOT NULL DEFAULT 0,
      note           TEXT,
      created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Migrazione: aggiunge importo_pagato se la tabella esisteva già senza
  try {
    await db.execute(
      'ALTER TABLE fatture ADD COLUMN importo_pagato DECIMAL(10,2) NOT NULL DEFAULT 0'
    )
  } catch { /* colonna già presente */ }

  // Migrazione: rimuove pagata se presente (opzionale, non bloccante)
  try {
    await db.execute('ALTER TABLE fatture DROP COLUMN pagata')
  } catch { /* colonna non presente */ }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS pagamenti_fattura (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      fattura_id INT           NOT NULL,
      data       DATE          NOT NULL,
      importo    DECIMAL(10,2) NOT NULL,
      note       VARCHAR(200),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fattura_id) REFERENCES fatture(id) ON DELETE CASCADE
    )
  `)

  await db.end()
}

async function ricalcolaImportoPagato(db: Awaited<ReturnType<typeof getConnection>>, fatturaId: number) {
  await db.execute(
    'UPDATE fatture SET importo_pagato = (SELECT COALESCE(SUM(importo),0) FROM pagamenti_fattura WHERE fattura_id = ?) WHERE id = ?',
    [fatturaId, fatturaId]
  )
}

// ─── Fatture ──────────────────────────────────────────────────────────────────

export async function addFattura(_: unknown, formData: FormData) {
  await ensureTables()

  const tipo        = formData.get('tipo')        as string
  const numero      = formData.get('numero')      as string
  const data        = ((formData.get('data') as string) ?? '').slice(0, 10) + 'T12:00:00'
  const controparte = formData.get('controparte') as string
  const importo     = parseFloat(formData.get('importo') as string) || 0
  const iva         = parseFloat(formData.get('iva')     as string) ?? 22
  const note        = (formData.get('note') as string) || ''

  if (!tipo || !numero || !data || !controparte) {
    return { error: 'Compila tutti i campi obbligatori.' }
  }

  const db = await getConnection()
  await db.execute(
    'INSERT INTO fatture (tipo, numero, data, controparte, importo, iva, note) VALUES (?,?,?,?,?,?,?)',
    [tipo, numero, data, controparte, importo, iva, note]
  )
  await db.end()
  revalidatePath('/fatture')
  return { success: true }
}

export async function deleteFattura(_: unknown, formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return { error: 'ID mancante.' }
  await ensureTables()
  const db = await getConnection()
  await db.execute('DELETE FROM fatture WHERE id = ?', [id])
  await db.end()
  revalidatePath('/fatture')
  return { success: true }
}

// ─── Pagamenti ────────────────────────────────────────────────────────────────

export async function addPagamento(_: unknown, formData: FormData) {
  await ensureTables()

  const fatturaId = parseInt(formData.get('fattura_id') as string)
  const dataRaw   = (formData.get('data') as string ?? '').slice(0, 10)
  const data      = dataRaw + 'T12:00:00'
  const importo   = parseFloat(formData.get('importo') as string) || 0
  const note      = (formData.get('note') as string) || ''

  if (!fatturaId || !data || importo <= 0) {
    return { error: 'Compila data e importo.' }
  }

  const db = await getConnection()
  await db.execute(
    'INSERT INTO pagamenti_fattura (fattura_id, data, importo, note) VALUES (?,?,?,?)',
    [fatturaId, data, importo, note]
  )
  await ricalcolaImportoPagato(db, fatturaId)
  await db.end()
  revalidatePath('/fatture')
  return { success: true }
}

export async function deletePagamento(_: unknown, formData: FormData) {
  await ensureTables()

  const id        = parseInt(formData.get('id')         as string)
  const fatturaId = parseInt(formData.get('fattura_id') as string)
  if (!id || !fatturaId) return { error: 'ID mancante.' }

  const db = await getConnection()
  await db.execute('DELETE FROM pagamenti_fattura WHERE id = ?', [id])
  await ricalcolaImportoPagato(db, fatturaId)
  await db.end()
  revalidatePath('/fatture')
  return { success: true }
}
