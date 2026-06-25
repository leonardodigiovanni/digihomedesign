import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import AreaTestClient, { type FlatRow, type Pv2Row } from './area-test-client'

export const metadata: Metadata = { title: 'Area di Test' }

const s = (v: unknown) => String(v ?? '')

export default async function Page() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')

  const db = await getConnection()

  await db.execute(`
    CREATE TABLE IF NOT EXISTS articoli2 (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      fase          VARCHAR(100) NOT NULL DEFAULT '',
      materiale     VARCHAR(100) NOT NULL DEFAULT '',
      tipologia     VARCHAR(100) NOT NULL DEFAULT '',
      ambiente      VARCHAR(100) NOT NULL DEFAULT '',
      articolo      VARCHAR(200) NOT NULL DEFAULT '',
      fascia        VARCHAR(100) NOT NULL DEFAULT '',
      marca         VARCHAR(100) NOT NULL DEFAULT '',
      serie         VARCHAR(100) NOT NULL DEFAULT '',
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS articoli2_percorsi (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      articolo2_id    INT NOT NULL,
      categoria       VARCHAR(100) NOT NULL DEFAULT '',
      sottocategoria  VARCHAR(100) NOT NULL DEFAULT ''
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS preventivo2 (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      articolo2_id    INT NOT NULL,
      percorso_id     INT NULL,
      categoria       VARCHAR(100) NOT NULL DEFAULT '',
      sottocategoria  VARCHAR(100) NOT NULL DEFAULT '',
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.execute(`ALTER TABLE preventivo2 ADD COLUMN percorso_id INT NULL`).catch(() => {})
  await db.execute(`ALTER TABLE preventivo2 ADD COLUMN categoria VARCHAR(100) NOT NULL DEFAULT ''`).catch(() => {})
  await db.execute(`ALTER TABLE preventivo2 ADD COLUMN sottocategoria VARCHAR(100) NOT NULL DEFAULT ''`).catch(() => {})

  try {
    const [flatRaw] = await db.query(`
      SELECT a.id, a.fase, a.materiale, a.tipologia, a.ambiente,
             a.articolo, a.fascia, a.marca, a.serie,
             COALESCE(p.id, 0)              AS percorso_id,
             COALESCE(p.categoria, '')      AS categoria,
             COALESCE(p.sottocategoria, '') AS sottocategoria
      FROM articoli2 a
      LEFT JOIN articoli2_percorsi p ON p.articolo2_id = a.id
      ORDER BY a.id ASC, p.id ASC
    `) as [Record<string, unknown>[], unknown]

    const [pv2Raw] = await db.query(`
      SELECT pv.id, pv.articolo2_id, pv.categoria, pv.sottocategoria, pv.created_at,
             a.articolo, a.fase, a.marca, a.serie
      FROM preventivo2 pv
      JOIN articoli2 a ON a.id = pv.articolo2_id
      ORDER BY pv.id DESC
    `) as [Record<string, unknown>[], unknown]

    const flatRows: FlatRow[] = (flatRaw as Record<string, unknown>[]).map(r => ({
      id:             Number(r.id),
      percorso_id:    Number(r.percorso_id ?? 0),
      fase:           s(r.fase),
      materiale:      s(r.materiale),
      tipologia:      s(r.tipologia),
      ambiente:       s(r.ambiente),
      articolo:       s(r.articolo),
      fascia:         s(r.fascia),
      marca:          s(r.marca),
      serie:          s(r.serie),
      categoria:      s(r.categoria),
      sottocategoria: s(r.sottocategoria),
    }))

    const pv2: Pv2Row[] = (pv2Raw as Record<string, unknown>[]).map(r => ({
      id:             Number(r.id),
      articolo2_id:   Number(r.articolo2_id),
      articolo:       s(r.articolo),
      fase:           s(r.fase),
      marca:          s(r.marca),
      serie:          s(r.serie),
      categoria:      s(r.categoria),
      sottocategoria: s(r.sottocategoria),
      created_at:     s(r.created_at),
    }))

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Area di Test</h2>
        <AreaTestClient flatRows={flatRows} pv2={pv2} />
      </div>
    )
  } finally {
    await db.end()
  }
}
