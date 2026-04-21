import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import ListiniClient, { type Articolo } from './listini-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Listini',
}

async function getData(): Promise<Articolo[]> {
  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS listini (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        categoria        VARCHAR(100) NOT NULL,
        produttore       VARCHAR(100) NOT NULL DEFAULT '',
        descrizione      VARCHAR(300) NOT NULL,
        unita            VARCHAR(30)  NOT NULL,
        prezzo_acquisto  DECIMAL(10,2) NOT NULL DEFAULT 0,
        prezzo_vendita   DECIMAL(10,2) NOT NULL DEFAULT 0,
        note             TEXT NULL,
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    await db.execute(`ALTER TABLE listini ADD COLUMN disponibile TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
    try {
      await db.execute(`ALTER TABLE listini ADD COLUMN preventivabile TINYINT(1) NOT NULL DEFAULT 1`)
      await db.execute(`UPDATE listini SET preventivabile = 0 WHERE categoria = 'marmi'`)
    } catch { /* colonna già esistente */ }
    await db.execute(`ALTER TABLE listini ADD COLUMN foto_url VARCHAR(500) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN profilo_frontale_mm DECIMAL(6,2) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN profilo_profondita_mm DECIMAL(6,2) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN trasmittanza_uw DECIMAL(5,3) NULL`).catch(() => {})
    const [rows] = await db.query(
      'SELECT id, categoria, produttore, descrizione, unita, prezzo_acquisto, prezzo_vendita, note, disponibile, preventivabile, updated_at, foto_url, profilo_frontale_mm, profilo_profondita_mm, trasmittanza_uw FROM listini ORDER BY categoria ASC, produttore ASC, descrizione ASC'
    )
    return (rows as Record<string, unknown>[]).map(r => ({
      ...r,
      prezzo_acquisto:      parseFloat(String(r.prezzo_acquisto ?? 0)),
      prezzo_vendita:       parseFloat(String(r.prezzo_vendita  ?? 0)),
      disponibile:          Number(r.disponibile    ?? 1),
      preventivabile:       Number(r.preventivabile ?? 1),
      updated_at:           r.updated_at instanceof Date ? r.updated_at.toISOString() : String(r.updated_at ?? ''),
      foto_url:             r.foto_url ? String(r.foto_url) : null,
      profilo_frontale_mm:  r.profilo_frontale_mm  != null ? parseFloat(String(r.profilo_frontale_mm))  : null,
      profilo_profondita_mm:r.profilo_profondita_mm != null ? parseFloat(String(r.profilo_profondita_mm)) : null,
      trasmittanza_uw:      r.trasmittanza_uw != null ? parseFloat(String(r.trasmittanza_uw)) : null,
    })) as Articolo[]
  } finally {
    await db.end()
  }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''

  if (!role) redirect('/')
  const settings = readSettings()
  if (!hasPageAccess(role, 25, settings)) redirect('/')

  const articoli = await getData()

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Listini</h2>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
        Prezzi di acquisto e vendita per articoli e lavorazioni. Doppio click su una riga per modificarla.
      </p>
      <ListiniClient articoli={articoli} />
    </div>
  )
}
