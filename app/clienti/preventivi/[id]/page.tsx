import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import PreventivoClient, { type Articolo, type ListinoItem, type Preventivo, type ClienteOption } from './preventivo-client'
import { extractAvgColor } from '@/lib/extract-color'
import { ensurePercorsiTables } from '@/lib/percorsi'
import { getFiltriModelloLabels } from '@/lib/filtri-modello-labels'

export const metadata: Metadata = { title: 'Dettaglio Preventivo' }

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente') redirect('/')

  const { id } = await params
  const prevId = parseInt(id)
  if (isNaN(prevId)) redirect('/clienti/preventivi')

  const db = await getConnection()
  await db.execute(`ALTER TABLE preventivo_articoli ADD COLUMN ordine INT NOT NULL DEFAULT 0`).catch(() => {})
  try {
    const [prevRows] = await db.query(
      'SELECT * FROM preventivi WHERE id = ?',
      [prevId]
    ) as [Record<string, unknown>[], unknown]

    if (!prevRows[0]) redirect('/clienti/preventivi')
    const raw = prevRows[0]
    const preventivo: Preventivo = {
      id: Number(raw.id),
      numero: String(raw.numero ?? ''),
      cliente_id: raw.cliente_id != null ? Number(raw.cliente_id) : null,
      descrizione: String(raw.descrizione ?? ''),
      stato: (raw.stato as Preventivo['stato']) ?? 'bozza',
      importo: Number(raw.importo),
      data: dateToLocal(raw.data),
      validita_giorni: Number(raw.validita_giorni),
      note: raw.note != null ? String(raw.note) : null,
      visibile_cliente: Number(raw.visibile_cliente),
      sconto_cliente_pct: Number(raw.sconto_cliente_pct ?? 0),
      prezzo_forfait: Number(raw.prezzo_forfait ?? 0),
    }

    const [artRows] = await db.query(
      `SELECT pa.*, l.abbr, l.profilo_frontale_mm, l.foto_url AS listino_foto_url, l.richiede_tipo_colore_acc, l.escluso AS listino_escluso, l.categoria AS listino_categoria
       FROM preventivo_articoli pa
       LEFT JOIN listini l ON l.id = pa.listino_id
       WHERE pa.preventivo_id = ? ORDER BY COALESCE(pa.parent_id, pa.id) ASC, pa.ordine ASC, pa.id ASC`,
      [prevId]
    ) as [Record<string, unknown>[], unknown]

    const articoli: Articolo[] = (artRows as Record<string, unknown>[]).map(a => ({
      id: Number(a.id),
      preventivo_id: Number(a.preventivo_id),
      tipo_prodotto: String(a.tipo_prodotto ?? ''),
      marca: String(a.marca ?? ''),
      modello: String(a.modello ?? ''),
      listino_id: a.listino_id != null ? Number(a.listino_id) : null,
      prezzo_base: Number(a.prezzo_base),
      unita: String(a.unita ?? 'pz'),
      colore: String(a.colore ?? ''),
      tipo_vetro: String(a.tipo_vetro ?? ''),
      accessori: String(a.accessori ?? ''),
      altezza_cm: Number(a.altezza_cm),
      larghezza_cm: Number(a.larghezza_cm),
      unita_valore: a.unita_valore != null ? Number(a.unita_valore) : null,
      n_ante: Number(a.n_ante),
      quantita: Number(a.quantita),
      prezzo_totale: Number(a.prezzo_totale),
      prezzo_pre_sconto: Number(a.prezzo_pre_sconto ?? 0),
      sconto_articolo_pct: Number(a.sconto_articolo_pct ?? 0),
      note: a.note != null ? String(a.note) : null,
      ordine: Number(a.ordine ?? 0),
      parent_id: a.parent_id != null ? Number(a.parent_id) : null,
      abbr: a.abbr != null ? String(a.abbr) : '',
      profilo_mm: a.profilo_frontale_mm != null ? Number(a.profilo_frontale_mm) : 80,
      listino_foto_url: a.listino_foto_url != null ? String(a.listino_foto_url) : '',
      listino_escluso: Number(a.listino_escluso ?? 0),
      listino_categoria: String(a.listino_categoria ?? ''),
      bar_color: null,
      bar_color_acc: null,
    }))

    // Pre-calcola bar_color e bar_color_acc per articoli TC/TA
    await Promise.all(articoli.map(async a => {
      const up = a.abbr.trim().toUpperCase()
      if (!up.startsWith('TC(') && !up.startsWith('TA(')) return
      const isNotAcc = (c: typeof articoli[0]) => (artRows as Record<string, unknown>[]).find(r => Number(r.id) === c.id && Number(r.richiede_tipo_colore_acc) === 1) == null
      const child = articoli.find(c => c.parent_id === a.id && isNotAcc(c) && /color/i.test(c.tipo_prodotto + ' ' + c.modello))
        ?? articoli.find(c => c.parent_id === a.id && isNotAcc(c) && c.listino_foto_url)
      const fotoUrl = child?.listino_foto_url
      if (fotoUrl) {
        const normalized = fotoUrl.startsWith('http') ? fotoUrl : fotoUrl.startsWith('/') ? fotoUrl : `/${fotoUrl}`
        a.bar_color = await extractAvgColor(normalized)
      }
      const rawChildAcc = (artRows as Record<string, unknown>[]).find(
        r => Number(r.parent_id) === a.id && Number(r.richiede_tipo_colore_acc) === 1
      )
      const fotoAcc = rawChildAcc?.listino_foto_url != null ? String(rawChildAcc.listino_foto_url) : ''
      if (fotoAcc) {
        const normalized = fotoAcc.startsWith('http') ? fotoAcc : fotoAcc.startsWith('/') ? fotoAcc : `/${fotoAcc}`
        a.bar_color_acc = await extractAvgColor(normalized)
      }
    }))

    await db.execute(`ALTER TABLE listini ADD COLUMN principale TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN caratteristica TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN minimo DECIMAL(10,4) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_tipo_colore_acc TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN sottocategoria VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN fase          VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN materiale     VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN tipologia     VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN ambiente      VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN fascia        VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})

    const [listiniRows] = await db.query(`
      SELECT l.id,
             COALESCE(lp.categoria, l.categoria)           AS categoria,
             COALESCE(lp.sottocategoria, l.sottocategoria) AS sottocategoria,
             l.fase, l.materiale, l.tipologia, l.ambiente,
             l.produttore, l.serie, l.descrizione, l.fascia, l.unita,
             l.prezzo_vendita, l.prezzo_acquisto, l.sconto_articolo,
             l.principale, l.caratteristica,
             l.richiede_tipo_colore, l.richiede_tipo_colore_acc, l.richiede_tipo_vetro, l.richiede_tipo_montaggio,
             l.richiede_larghezza, l.richiede_altezza, l.richiede_quantita,
             l.minimo,
             l.Filtro_1 AS filtro_1, l.Filtro_2 AS filtro_2, l.Filtro_3 AS filtro_3, l.Filtro_4 AS filtro_4,
             l.Filtro_5 AS filtro_5, l.Filtro_6 AS filtro_6, l.Filtro_7 AS filtro_7, l.Filtro_8 AS filtro_8,
             l.Filtro_9 AS filtro_9, l.Filtro_10 AS filtro_10,
             l.schema_url, l.logo_url,
             COALESCE(f.ragione_sociale, '') AS fornitore_nome
      FROM listini l
      LEFT JOIN listini_percorsi lp ON lp.listino_id = l.id
      LEFT JOIN fornitori f ON f.id = l.fornitore_id
      WHERE l.disponibile = 1 AND (
        l.preventivabile = 1
        OR (l.principale = 0 AND (l.richiede_tipo_colore = 1 OR l.richiede_tipo_colore_acc = 1 OR l.richiede_tipo_vetro = 1 OR l.richiede_tipo_montaggio = 1))
      )
      ORDER BY COALESCE(lp.categoria, l.categoria), l.produttore, l.serie, l.descrizione
    `) as [Record<string, unknown>[], unknown]

    const _listiniAll: ListinoItem[] = (listiniRows as Record<string, unknown>[]).map(l => ({
      id: Number(l.id),
      categoria: String(l.categoria ?? ''),
      sottocategoria: l.sottocategoria ? String(l.sottocategoria) : null,
      fase:           l.fase           ? String(l.fase)           : null,
      materiale:      l.materiale      ? String(l.materiale)      : null,
      tipologia:      l.tipologia      ? String(l.tipologia)      : null,
      ambiente:       l.ambiente       ? String(l.ambiente)       : null,
      produttore: String(l.produttore ?? ''),
      serie: String(l.serie ?? ''),
      descrizione: String(l.descrizione ?? ''),
      fascia:         l.fascia         ? String(l.fascia)         : null,
      unita: String(l.unita ?? 'pz'),
      prezzo_vendita: Number(l.prezzo_vendita),
      prezzo_acquisto: Number(l.prezzo_acquisto),
      sconto_articolo: Number(l.sconto_articolo ?? 0),
      fornitore_nome: String(l.fornitore_nome ?? ''),
      principale: Number(l.principale ?? 1),
      caratteristica: Number(l.caratteristica ?? 1),
      richiede_tipo_colore:     Number(l.richiede_tipo_colore     ?? 0),
      richiede_tipo_colore_acc: Number(l.richiede_tipo_colore_acc ?? 0),
      richiede_tipo_vetro:      Number(l.richiede_tipo_vetro      ?? 0),
      richiede_tipo_montaggio:  Number(l.richiede_tipo_montaggio  ?? 0),
      richiede_larghezza:       Number(l.richiede_larghezza       ?? 0),
      richiede_altezza:         Number(l.richiede_altezza         ?? 0),
      richiede_quantita:        Number(l.richiede_quantita        ?? 0),
      minimo: l.minimo != null ? Number(l.minimo) : null,
      filtro_1: Number(l.filtro_1 ?? 0),
      filtro_2: Number(l.filtro_2 ?? 0),
      filtro_3: Number(l.filtro_3 ?? 0),
      filtro_4: Number(l.filtro_4 ?? 0),
      filtro_5: Number(l.filtro_5 ?? 0),
      filtro_6: Number(l.filtro_6 ?? 0),
      filtro_7: Number(l.filtro_7 ?? 0),
      filtro_8: Number(l.filtro_8 ?? 0),
      filtro_9: Number(l.filtro_9 ?? 0),
      filtro_10: Number(l.filtro_10 ?? 0),
      schema_url: l.schema_url != null ? String(l.schema_url) : null,
      logo_url: l.logo_url != null ? String(l.logo_url) : null,
    }))
    const _seenListiniIds = new Set<number>()
    const listini: ListinoItem[] = _listiniAll.filter(l => {
      if (_seenListiniIds.has(l.id)) return false
      _seenListiniIds.add(l.id)
      return true
    })

    // Percorsi per articoli preventivo + listini (per matching per coppie)
    let percorsiPerListino: Record<number, { categoria: string; sottocategoria: string }[]> = {}
    try {
      const allIds = [
        ...articoli.map(a => a.listino_id).filter((id): id is number => id !== null && id > 0),
        ...listini.map(l => l.id),
      ]
      const uniqIds = [...new Set(allIds)]
      if (uniqIds.length > 0) {
        await ensurePercorsiTables(db)
        const ph = uniqIds.map(() => '?').join(',')
        const [pRows] = await db.query(
          `SELECT listino_id, categoria, sottocategoria FROM listini_percorsi WHERE listino_id IN (${ph})`,
          uniqIds
        ) as [Record<string, unknown>[], unknown]
        for (const row of pRows as Record<string, unknown>[]) {
          const id = Number(row.listino_id)
          if (!percorsiPerListino[id]) percorsiPerListino[id] = []
          percorsiPerListino[id].push({ categoria: String(row.categoria), sottocategoria: String(row.sottocategoria) })
        }
      }
    } catch {}

    const [clientiRows] = await db.query(
      `SELECT id, COALESCE(NULLIF(TRIM(ragione_sociale), ''), CONCAT(TRIM(cognome), ' ', TRIM(nome))) AS label FROM clienti ORDER BY label ASC`
    ) as [Record<string, unknown>[], unknown]

    const clienti: ClienteOption[] = (clientiRows as Record<string, unknown>[])
      .map(c => ({ id: Number(c.id), label: String(c.label ?? '').trim() }))
      .filter(c => c.label !== '')

    let clienteEmail = '', clienteCellulare = ''
    if (preventivo.cliente_id) {
      const [cInfo] = await db.query('SELECT email, telefono FROM clienti WHERE id = ? LIMIT 1', [preventivo.cliente_id]) as [{ email: string; telefono: string }[], unknown]
      clienteEmail      = cInfo[0]?.email    ?? ''
      clienteCellulare  = cInfo[0]?.telefono ?? ''
    }

    const filtriLabels = await getFiltriModelloLabels(db)

    return <PreventivoClient preventivo={preventivo} articoli={articoli} listini={listini} clienti={clienti} isStaff={true} clienteEmail={clienteEmail} clienteCellulare={clienteCellulare} percorsiPerListino={percorsiPerListino} filtriLabels={filtriLabels} />
  } catch {
    redirect('/clienti/preventivi')
  } finally {
    await db.end()
  }
}
