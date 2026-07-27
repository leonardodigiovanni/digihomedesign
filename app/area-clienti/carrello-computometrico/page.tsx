import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { ensurePercorsiTables } from '@/lib/percorsi'
import type { PercorsoEntry } from '@/lib/percorsi-match'
import { readSettings } from '@/lib/settings'
import { getFiltriModelloLabels } from '@/lib/filtri-modello-labels'
import { decompressComputoCart, COMPUTO_CART_COOKIE } from '@/lib/computo-cart-cookie'
import type { Metadata } from 'next'
import CarrelloComputometricoClient from './carrello-client'
import type { ArticoloComputabile } from './carrello-client'
import ShortcutStar from '@/components/shortcut-star'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Carrello Computo Metrico' }

async function getArticoli(): Promise<{ articoli: ArticoloComputabile[]; percorsiPerListino: Record<number, PercorsoEntry[]> }> {
  const db = await getConnection()
  try {
    await db.execute(`ALTER TABLE listini ADD COLUMN computabile TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_altezza3d TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN base_calcolo VARCHAR(20) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN sottocategoria VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN fase          VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN materiale     VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN tipologia     VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN ambiente      VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN fascia        VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
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

    await ensurePercorsiTables(db)

    const [rows] = await db.query(`
      SELECT l.id,
             COALESCE(lp.categoria, l.categoria)           AS categoria,
             COALESCE(lp.sottocategoria, l.sottocategoria) AS sottocategoria,
             l.fase, l.materiale, l.tipologia, l.ambiente, l.fascia,
             l.produttore, l.serie, l.descrizione, l.unita,
             l.prezzo_vendita, l.sconto_articolo,
             l.principale, l.caratteristica, l.base_calcolo,
             l.richiede_larghezza, l.richiede_altezza, l.richiede_altezza3d, l.richiede_quantita,
             l.richiede_tipo_colore, l.richiede_tipo_colore_acc, l.richiede_tipo_vetro, l.richiede_tipo_montaggio,
             l.minimo,
             l.Filtro_1 AS filtro_1, l.Filtro_2 AS filtro_2, l.Filtro_3 AS filtro_3, l.Filtro_4 AS filtro_4,
             l.Filtro_5 AS filtro_5, l.Filtro_6 AS filtro_6, l.Filtro_7 AS filtro_7, l.Filtro_8 AS filtro_8,
             l.Filtro_9 AS filtro_9, l.Filtro_10 AS filtro_10,
             l.schema_url, l.logo_url
      FROM listini l
      LEFT JOIN listini_percorsi lp ON lp.listino_id = l.id
      WHERE l.disponibile = 1 AND l.computabile = 1
      ORDER BY COALESCE(lp.categoria, l.categoria), l.produttore, l.serie, l.descrizione
    `) as [Record<string, unknown>[], unknown]

    const all: ArticoloComputabile[] = (rows as Record<string, unknown>[])
      .map(r => ({
        id:            Number(r.id),
        categoria:     String(r.categoria ?? ''),
        sottocategoria: r.sottocategoria ? String(r.sottocategoria) : null,
        fase:           r.fase           ? String(r.fase)           : null,
        materiale:      r.materiale      ? String(r.materiale)      : null,
        tipologia:      r.tipologia      ? String(r.tipologia)      : null,
        ambiente:       r.ambiente       ? String(r.ambiente)       : null,
        fascia:         r.fascia         ? String(r.fascia)         : null,
        produttore:    String(r.produttore ?? ''),
        serie:         String(r.serie ?? ''),
        descrizione:   String(r.descrizione ?? ''),
        unita:         String(r.unita ?? 'pz'),
        prezzo_vendita: Number(r.prezzo_vendita ?? 0),
        sconto_articolo: Number(r.sconto_articolo ?? 0),
        principale:    Number(r.principale ?? 1),
        caratteristica: Number(r.caratteristica ?? 1),
        base_calcolo:  r.base_calcolo ? String(r.base_calcolo) : null,
        richiede_larghezza:       Number(r.richiede_larghezza       ?? 0),
        richiede_altezza:         Number(r.richiede_altezza         ?? 0),
        richiede_altezza3d:       Number(r.richiede_altezza3d       ?? 0),
        richiede_quantita:        Number(r.richiede_quantita        ?? 0),
        richiede_tipo_colore:     Number(r.richiede_tipo_colore     ?? 0),
        richiede_tipo_colore_acc: Number(r.richiede_tipo_colore_acc ?? 0),
        richiede_tipo_vetro:      Number(r.richiede_tipo_vetro      ?? 0),
        richiede_tipo_montaggio:  Number(r.richiede_tipo_montaggio  ?? 0),
        minimo: r.minimo != null ? Number(r.minimo) : null,
        filtro_1: Number(r.filtro_1 ?? 0),
        filtro_2: Number(r.filtro_2 ?? 0),
        filtro_3: Number(r.filtro_3 ?? 0),
        filtro_4: Number(r.filtro_4 ?? 0),
        filtro_5: Number(r.filtro_5 ?? 0),
        filtro_6: Number(r.filtro_6 ?? 0),
        filtro_7: Number(r.filtro_7 ?? 0),
        filtro_8: Number(r.filtro_8 ?? 0),
        filtro_9: Number(r.filtro_9 ?? 0),
        filtro_10: Number(r.filtro_10 ?? 0),
        schema_url: r.schema_url != null ? String(r.schema_url) : null,
        logo_url: r.logo_url != null ? String(r.logo_url) : null,
      }))

    // Un listino puo' comparire su piu' righe (un percorso per categoria/sottocategoria
    // condivisa): teniamo una riga canonica per id, i percorsi completi vivono a parte
    // in percorsiPerListino cosi' il filtro categoria/sottocategoria della modale puo'
    // ancora vederli tutti (vedi lib/percorsi-match.ts).
    const seenIds = new Set<number>()
    const articoli = all.filter(a => {
      if (seenIds.has(a.id)) return false
      seenIds.add(a.id)
      return true
    })

    const percorsiPerListino: Record<number, PercorsoEntry[]> = {}
    if (articoli.length > 0) {
      const ph = articoli.map(() => '?').join(',')
      const [pRows] = await db.query(
        `SELECT listino_id, categoria, sottocategoria FROM listini_percorsi WHERE listino_id IN (${ph})`,
        articoli.map(a => a.id)
      ) as [Record<string, unknown>[], unknown]
      for (const row of pRows as Record<string, unknown>[]) {
        const id = Number(row.listino_id)
        if (!percorsiPerListino[id]) percorsiPerListino[id] = []
        percorsiPerListino[id].push({ categoria: String(row.categoria), sottocategoria: String(row.sottocategoria) })
      }
    }

    return { articoli, percorsiPerListino }
  } catch { return { articoli: [], percorsiPerListino: {} } }
  finally { await db.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  const role     = cookieStore.get('session_role')?.value ?? ''
  const isStaff = role === 'admin' || role === 'dipendente' || role === 'direttore'
  if (!isStaff) {
    const { rolePermissions } = await readSettings()
    if (!(rolePermissions['cliente'] ?? []).includes(54)) redirect('/aiuto/guida-computometrico')
  }

  const initialRighe = decompressComputoCart(cookieStore.get(COMPUTO_CART_COOKIE)?.value ?? '')

  const [{ articoli, percorsiPerListino }, filtriLabels] = await Promise.all([
    getArticoli(),
    (async () => {
      const db = await getConnection()
      try { return await getFiltriModelloLabels(db) } catch { return {} } finally { await db.end() }
    })(),
  ])

  return (
    <div className="page-content-wrapper" style={{ margin: '8px 0', padding: '0 0 8px' }}>
      <ShortcutStar href="/area-clienti/carrello-computometrico" />
      <CarrelloComputometricoClient articoli={articoli} isLoggedIn={!!username} isStaff={isStaff} initialRighe={initialRighe} filtriLabels={filtriLabels} percorsiPerListino={percorsiPerListino} />
    </div>
  )
}
