import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import ListiniClient, { type Articolo, type Fornitore } from './listini-client'
import type { Metadata } from 'next'
import { ensurePercorsiTables, type Percorso } from '@/lib/percorsi'

export const metadata: Metadata = {
  title: 'Listini',
}

async function getData(): Promise<{ articoli: Articolo[]; fornitori: Fornitore[]; percorsiPerListino: Record<number, Percorso[]> }> {
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
    await db.execute(`ALTER TABLE listini ADD COLUMN fornitore_id INT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN acquistabile TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN max_acquistabile INT NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN sconto_articolo DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN schema_url VARCHAR(500) NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN serie VARCHAR(200) NOT NULL DEFAULT ''`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN principale TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN caratteristica TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_larghezza  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_altezza     TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_quantita    TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_piano       TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_km          TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_peso        TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_tipo_colore     TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_tipo_colore_acc TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_tipo_vetro       TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_tipo_montaggio TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN costante DECIMAL(10,4) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN abbr VARCHAR(50) NOT NULL DEFAULT ''`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN minimo DECIMAL(10,4) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_1  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_2  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_3  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_4  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_5  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_6  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_7  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_8  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_9  TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_10 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN sottocategoria VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN fase          VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN materiale     VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN tipologia     VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN ambiente      VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN fascia        VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN escluso       TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})

    const [rows] = await db.query(`
      SELECT l.id, l.categoria, l.sottocategoria, l.fase, l.materiale, l.tipologia, l.ambiente, l.produttore, l.descrizione, l.fascia, l.unita,
             l.prezzo_acquisto, l.prezzo_vendita, l.note, l.disponibile, l.preventivabile, l.acquistabile, l.max_acquistabile,
             l.sconto_articolo, l.serie, l.principale, l.caratteristica,
             l.richiede_larghezza, l.richiede_altezza, l.richiede_quantita, l.richiede_piano,
             l.richiede_km, l.richiede_peso, l.richiede_tipo_colore, l.richiede_tipo_colore_acc, l.richiede_tipo_vetro, l.richiede_tipo_montaggio, l.costante, l.abbr, l.minimo,
             l.Filtro_1, l.Filtro_2, l.Filtro_3, l.Filtro_4, l.Filtro_5,
             l.Filtro_6, l.Filtro_7, l.Filtro_8, l.Filtro_9, l.Filtro_10,
             l.updated_at, l.foto_url, l.schema_url, l.profilo_frontale_mm, l.profilo_profondita_mm,
             l.trasmittanza_uw, l.fornitore_id, l.escluso,
             COALESCE(f.ragione_sociale, '') AS fornitore_nome
      FROM listini l
      LEFT JOIN fornitori f ON f.id = l.fornitore_id
      ORDER BY l.categoria ASC, l.produttore ASC, l.descrizione ASC
    `)
    const [forniRows] = await db.query(
      'SELECT id, ragione_sociale FROM fornitori ORDER BY ragione_sociale ASC'
    )
    const articoli = (rows as Record<string, unknown>[]).map(r => ({
      ...r,
      prezzo_acquisto:       parseFloat(String(r.prezzo_acquisto ?? 0)),
      prezzo_vendita:        parseFloat(String(r.prezzo_vendita  ?? 0)),
      disponibile:           Number(r.disponibile    ?? 1),
      preventivabile:        Number(r.preventivabile ?? 1),
      acquistabile:          Number(r.acquistabile   ?? 0),
      max_acquistabile:      r.max_acquistabile != null ? Number(r.max_acquistabile) : null,
      sconto_articolo:       parseFloat(String(r.sconto_articolo ?? 0)),
      serie:                 String(r.serie ?? ''),
      principale:            Number(r.principale ?? 1),
      caratteristica:        Number(r.caratteristica ?? 1),
      richiede_larghezza:    Number(r.richiede_larghezza  ?? 0),
      richiede_altezza:      Number(r.richiede_altezza    ?? 0),
      richiede_quantita:     Number(r.richiede_quantita   ?? 0),
      richiede_piano:        Number(r.richiede_piano      ?? 0),
      richiede_km:           Number(r.richiede_km         ?? 0),
      richiede_peso:         Number(r.richiede_peso       ?? 0),
      richiede_tipo_colore:     Number(r.richiede_tipo_colore     ?? 0),
      richiede_tipo_colore_acc: Number(r.richiede_tipo_colore_acc ?? 0),
      richiede_tipo_vetro:      Number(r.richiede_tipo_vetro      ?? 0),
      richiede_tipo_montaggio:  Number(r.richiede_tipo_montaggio  ?? 0),
      costante:              parseFloat(String(r.costante ?? 0)),
      abbr:                  String(r.abbr ?? ''),
      minimo:                r.minimo != null ? parseFloat(String(r.minimo)) : null,
      filtro_1:  Number(r.Filtro_1  ?? 0),
      filtro_2:  Number(r.Filtro_2  ?? 0),
      filtro_3:  Number(r.Filtro_3  ?? 0),
      filtro_4:  Number(r.Filtro_4  ?? 0),
      filtro_5:  Number(r.Filtro_5  ?? 0),
      filtro_6:  Number(r.Filtro_6  ?? 0),
      filtro_7:  Number(r.Filtro_7  ?? 0),
      filtro_8:  Number(r.Filtro_8  ?? 0),
      filtro_9:  Number(r.Filtro_9  ?? 0),
      filtro_10: Number(r.Filtro_10 ?? 0),
      updated_at:            r.updated_at instanceof Date ? r.updated_at.toISOString() : String(r.updated_at ?? ''),
      foto_url:              r.foto_url   ? String(r.foto_url)   : null,
      schema_url:            r.schema_url ? String(r.schema_url) : null,
      profilo_frontale_mm:   r.profilo_frontale_mm  != null ? parseFloat(String(r.profilo_frontale_mm))  : null,
      profilo_profondita_mm: r.profilo_profondita_mm != null ? parseFloat(String(r.profilo_profondita_mm)) : null,
      trasmittanza_uw:       r.trasmittanza_uw != null ? parseFloat(String(r.trasmittanza_uw)) : null,
      fornitore_id:          r.fornitore_id != null ? Number(r.fornitore_id) : null,
      fornitore_nome:        String(r.fornitore_nome ?? ''),
      sottocategoria:        r.sottocategoria ? String(r.sottocategoria) : null,
      fase:                  r.fase           ? String(r.fase)           : null,
      materiale:             r.materiale      ? String(r.materiale)      : null,
      tipologia:             r.tipologia      ? String(r.tipologia)      : null,
      ambiente:              r.ambiente       ? String(r.ambiente)       : null,
      fascia:                r.fascia         ? String(r.fascia)         : null,
      escluso:               Number(r.escluso ?? 0),
    })) as Articolo[]
    const fornitori = (forniRows as Record<string, unknown>[]).map(r => ({
      id: Number(r.id),
      ragione_sociale: String(r.ragione_sociale ?? ''),
    })) as Fornitore[]

    await ensurePercorsiTables(db)
    const [percorsiRows] = await db.query('SELECT id, listino_id, categoria, sottocategoria FROM listini_percorsi ORDER BY id ASC')
    const percorsiPerListino: Record<number, Percorso[]> = {}
    for (const r of percorsiRows as { id: number; listino_id: number; categoria: string; sottocategoria: string }[]) {
      if (!percorsiPerListino[r.listino_id]) percorsiPerListino[r.listino_id] = []
      percorsiPerListino[r.listino_id].push({ id: r.id, categoria: r.categoria, sottocategoria: r.sottocategoria })
    }

    return { articoli, fornitori, percorsiPerListino }
  } finally {
    await db.end()
  }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''

  if (!role) redirect('/')
  const settings = await readSettings()
  if (!hasPageAccess(role, 25, settings)) redirect('/')

  const { articoli, fornitori, percorsiPerListino } = await getData()

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Listini</h2>
      <p style={{ color: '#000', fontSize: 13, marginBottom: 24 }}>
        Prezzi di acquisto e vendita per articoli e lavorazioni. Doppio click su una riga per modificarla.
      </p>
      <ListiniClient articoli={articoli} fornitori={fornitori} percorsiPerListino={percorsiPerListino} />
    </div>
  )
}
