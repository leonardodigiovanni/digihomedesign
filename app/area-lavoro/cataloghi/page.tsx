import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import CataloghiClient, { type Voce } from './cataloghi-client'
import type { Metadata } from 'next'
import { ensurePercorsiTables, type Percorso } from '@/lib/percorsi'
import { getFiltriModelloLabels } from '@/lib/filtri-modello-labels'
import { getFiltriCatalogoLabels } from '@/lib/filtri-catalogo-labels'

export const metadata: Metadata = { title: 'Cataloghi' }

const STAFF_ROLES = ['admin', 'dipendente', 'direttore']

async function getData(): Promise<{ voci: Voce[]; percorsiPerVoce: Record<number, Percorso[]>; filtriLabels: Record<number, string>; filtriCatalogoLabels: Record<number, string> }> {
  const db = await getConnection()
  try {
    await ensurePercorsiTables(db)

    await db.execute(`
      CREATE TABLE IF NOT EXISTS catalogo_voci (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        nome         VARCHAR(200) NOT NULL,
        pdf_filename VARCHAR(255) NOT NULL,
        pdf_label    VARCHAR(200) NOT NULL DEFAULT '',
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN serie VARCHAR(200) NOT NULL DEFAULT ''`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN descrizione TEXT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_battente TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_scorrevole TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_taglio_termico TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_taglio_freddo TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_economico TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_fascia_alta TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN fase VARCHAR(100) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN materiale VARCHAR(100) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN tipologia VARCHAR(100) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN ambiente VARCHAR(100) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN fascia VARCHAR(100) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_1 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_2 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_3 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_4 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_5 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_6 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_7 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_8 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_9 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_10 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN schema_url VARCHAR(500) NULL`).catch(() => {})

    const [vociRows] = await db.query(`
      SELECT id, nome, pdf_filename, pdf_label, serie, descrizione,
             filtro_battente, filtro_scorrevole, filtro_taglio_termico, filtro_taglio_freddo,
             filtro_economico, filtro_fascia_alta,
             fase, materiale, tipologia, ambiente, fascia,
             filtro_1, filtro_2, filtro_3, filtro_4, filtro_5, filtro_6, filtro_7, filtro_8, filtro_9, filtro_10,
             schema_url
      FROM catalogo_voci ORDER BY nome ASC
    `)

    const [percorsiRows] = await db.query(
      'SELECT id, voce_id, categoria, sottocategoria FROM catalogo_voci_percorsi ORDER BY id ASC'
    )
    const percorsiPerVoce: Record<number, Percorso[]> = {}
    for (const r of percorsiRows as { id: number; voce_id: number; categoria: string; sottocategoria: string }[]) {
      if (!percorsiPerVoce[r.voce_id]) percorsiPerVoce[r.voce_id] = []
      percorsiPerVoce[r.voce_id].push({ id: r.id, categoria: r.categoria, sottocategoria: r.sottocategoria })
    }

    const voci = (vociRows as Record<string, unknown>[]).map(r => ({
      id:                    Number(r.id),
      nome:                  String(r.nome ?? ''),
      serie:                 String(r.serie ?? ''),
      pdf_filename:          String(r.pdf_filename ?? ''),
      pdf_label:             String(r.pdf_label ?? ''),
      descrizione:           String(r.descrizione ?? ''),
      filtro_battente:       Number(r.filtro_battente       ?? 0),
      filtro_scorrevole:     Number(r.filtro_scorrevole     ?? 0),
      filtro_taglio_termico: Number(r.filtro_taglio_termico ?? 0),
      filtro_taglio_freddo:  Number(r.filtro_taglio_freddo  ?? 0),
      filtro_economico:      Number(r.filtro_economico      ?? 0),
      filtro_fascia_alta:    Number(r.filtro_fascia_alta    ?? 0),
      fase:      r.fase      ? String(r.fase)      : null,
      materiale: r.materiale ? String(r.materiale) : null,
      tipologia: r.tipologia ? String(r.tipologia) : null,
      ambiente:  r.ambiente  ? String(r.ambiente)  : null,
      fascia:    r.fascia    ? String(r.fascia)     : null,
      filtro_1:  Number(r.filtro_1 ?? 0),
      filtro_2:  Number(r.filtro_2 ?? 0),
      filtro_3:  Number(r.filtro_3 ?? 0),
      filtro_4:  Number(r.filtro_4 ?? 0),
      filtro_5:  Number(r.filtro_5 ?? 0),
      filtro_6:  Number(r.filtro_6 ?? 0),
      filtro_7:  Number(r.filtro_7 ?? 0),
      filtro_8:  Number(r.filtro_8 ?? 0),
      filtro_9:  Number(r.filtro_9 ?? 0),
      filtro_10: Number(r.filtro_10 ?? 0),
      schema_url: r.schema_url ? String(r.schema_url) : null,
    })) as Voce[]

    const filtriLabels = await getFiltriModelloLabels(db)
    const filtriCatalogoLabels = await getFiltriCatalogoLabels(db)

    return { voci, percorsiPerVoce, filtriLabels, filtriCatalogoLabels }
  } finally {
    await db.end()
  }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (!role) redirect('/')
  const settings = await readSettings()
  if (!hasPageAccess(role, 23, settings)) redirect('/')

  const { voci, percorsiPerVoce, filtriLabels, filtriCatalogoLabels } = await getData()
  const isStaff = STAFF_ROLES.includes(role)

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Cataloghi</h2>
      <p style={{ color: '#000', fontSize: 13, marginBottom: 16 }}>
        Depliant e cataloghi prodotti. Ogni voce ha un PDF e N coppie categoria / sottocategoria.
      </p>
      <CataloghiClient voci={voci} isStaff={isStaff} percorsiPerVoce={percorsiPerVoce} filtriLabels={filtriLabels} filtriCatalogoLabels={filtriCatalogoLabels} />
    </div>
  )
}
