import type { ArticoloListino } from '@/app/brand/cataloghi/[slug]/aggiungi-articolo'
import { ensurePercorsiTables } from '@/lib/percorsi'

export type VoceForMatching = {
  id: number
  sottocategoria?: string | null
  fase?: string | null
  materiale?: string | null
  tipologia?: string | null
  ambiente?: string | null
  fascia?: string | null
  filtro_1?: number
  filtro_2?: number
  filtro_3?: number
  filtro_4?: number
}

export type MatchOpts = {
  parentPendente?: boolean
  lacuneAperte?: string[]
  categoriaListino?: string | null
}

export const LISTINO_COLS = 'id, descrizione, produttore, serie, unita, prezzo_acquisto, prezzo_vendita, sconto_articolo, richiede_larghezza, richiede_altezza, richiede_quantita, richiede_piano, richiede_km, richiede_peso, richiede_tipo_colore, richiede_tipo_vetro, richiede_tipo_montaggio, schema_url, max_acquistabile, Filtro_1 AS filtro_1, Filtro_2 AS filtro_2, Filtro_3 AS filtro_3, Filtro_4 AS filtro_4, Filtro_5 AS filtro_5, Filtro_6 AS filtro_6, Filtro_7 AS filtro_7, Filtro_8 AS filtro_8, Filtro_9 AS filtro_9, Filtro_10 AS filtro_10, sottocategoria, fase, materiale, tipologia, ambiente, fascia'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function matchArticoliPerVoce(voceList: VoceForMatching[], db: any, opts?: MatchOpts): Promise<Record<string, ArticoloListino[]>> {
  const result: Record<string, ArticoloListino[]> = {}

  await db.execute(`ALTER TABLE listini ADD COLUMN principale TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN caratteristica TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_1 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_2 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_3 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_4 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN sottocategoria VARCHAR(100) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN fase VARCHAR(100) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN materiale VARCHAR(100) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN tipologia VARCHAR(100) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN ambiente VARCHAR(100) NULL`).catch(() => {})
  await db.execute(`ALTER TABLE listini ADD COLUMN fascia VARCHAR(100) NULL`).catch(() => {})

  await ensurePercorsiTables(db)

  const principaleCol = opts?.parentPendente ? 'caratteristica' : 'principale'

  for (const voce of voceList) {
    // Filtri aggiuntivi (fase, materiale, ecc.) rimangono come WHERE su listini
    const extraConds: string[] = []
    const extraParams: (string | number)[] = []
    // campo vuoto sull'articolo = "va bene con qualunque valore", quindi match tollerante
    if (voce.fase)      { extraConds.push("(fase = ? OR fase IS NULL OR fase = '')");           extraParams.push(voce.fase) }
    if (voce.materiale) { extraConds.push("(materiale = ? OR materiale IS NULL OR materiale = '')"); extraParams.push(voce.materiale) }
    if (voce.tipologia) { extraConds.push("(tipologia = ? OR tipologia IS NULL OR tipologia = '')"); extraParams.push(voce.tipologia) }
    if (voce.ambiente)  { extraConds.push("(ambiente = ? OR ambiente IS NULL OR ambiente = '')"); extraParams.push(voce.ambiente) }
    if (voce.fascia)    { extraConds.push("(fascia = ? OR fascia IS NULL OR fascia = '')");     extraParams.push(voce.fascia) }
    if (voce.filtro_1 === 1) extraConds.push('Filtro_1 = 1')
    if (voce.filtro_2 === 1) extraConds.push('Filtro_2 = 1')
    if (voce.filtro_3 === 1) extraConds.push('Filtro_3 = 1')
    if (voce.filtro_4 === 1) extraConds.push('Filtro_4 = 1')
    const extraWhere = extraConds.length > 0 ? ' AND ' + extraConds.join(' AND ') : ''

    try {
      const [rows] = await db.query(
        `SELECT ${LISTINO_COLS} FROM listini
         WHERE disponibile = 1 AND preventivabile = 1 AND ${principaleCol} = 1
           AND id IN (
             SELECT lp.listino_id FROM listini_percorsi lp
             JOIN catalogo_voci_percorsi vp
               ON vp.categoria = lp.categoria AND vp.sottocategoria = lp.sottocategoria
             WHERE vp.voce_id = ?
           )${extraWhere}
         ORDER BY descrizione ASC`,
        [voce.id, ...extraParams]
      )
      let articoli = rows as ArticoloListino[]
      if (opts?.parentPendente && opts.lacuneAperte && opts.lacuneAperte.length > 0) {
        const lacune = opts.lacuneAperte
        articoli = articoli.filter(a =>
          lacune.some(l =>
            (l === 'tipo_colore'    && a.richiede_tipo_colore    === 1) ||
            (l === 'tipo_vetro'     && a.richiede_tipo_vetro     === 1) ||
            (l === 'tipo_montaggio' && a.richiede_tipo_montaggio === 1)
          )
        )
      }
      result[String(voce.id)] = articoli
    } catch {
      result[String(voce.id)] = []
    }
  }

  return result
}
