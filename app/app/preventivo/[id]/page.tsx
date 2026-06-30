import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import PreventivoClient, { type Articolo, type ListinoItem, type Preventivo } from '../../../clienti/preventivi/[id]/preventivo-client'
import PreventivoActionsBar from './actions-bar'
import { extractAvgColor } from '@/lib/extract-color'

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!username) redirect('/app/login')

  const { id } = await params
  const prevId = parseInt(id)
  if (isNaN(prevId)) redirect('/app/preventivo')

  const isStaff = role === 'admin' || role === 'dipendente'

  const db = await getConnection()
  try {
    await db.execute(`ALTER TABLE listini ADD COLUMN richiede_tipo_colore_acc TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN sottocategoria VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN fase          VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN materiale     VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN tipologia     VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN ambiente      VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN fascia        VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})

    const [prevRows] = await db.query('SELECT * FROM preventivi WHERE id = ?', [prevId]) as [Record<string, unknown>[], unknown]
    if (!prevRows[0]) redirect('/app/preventivo')
    const raw = prevRows[0]

    if (!isStaff) {
      const [uRows] = await db.query('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]) as [{ cliente_id: number | null }[], unknown]
      const clienteId = uRows[0]?.cliente_id ?? null
      const ownedByClienteId = clienteId !== null && Number(raw.cliente_id) === clienteId
      const ownedByUsername  = raw.cliente_id == null && String(raw.creato_da ?? '') === username
      if (!ownedByClienteId && !ownedByUsername) redirect('/app/preventivo')
    }

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

    if (preventivo.stato === 'inviato') {
      const dataPreventivo = new Date(preventivo.data)
      const scadenzaMs = dataPreventivo.getTime() + preventivo.validita_giorni * 24 * 60 * 60 * 1000
      const oggi = new Date(); oggi.setHours(0, 0, 0, 0)
      if (scadenzaMs < oggi.getTime()) {
        await db.execute('UPDATE preventivi SET stato = ? WHERE id = ?', ['scaduto', prevId])
        preventivo.stato = 'scaduto'
      }
    }

    const [artRows] = await db.query(
      `SELECT pa.*, l.abbr, l.profilo_frontale_mm, l.foto_url AS listino_foto_url, l.richiede_tipo_colore_acc FROM preventivo_articoli pa LEFT JOIN listini l ON l.id = pa.listino_id WHERE pa.preventivo_id = ? ORDER BY pa.id ASC`,
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
      bar_color: null,
      bar_color_acc: null,
    }))

    await Promise.all(articoli.map(async a => {
      const up = a.abbr.trim().toUpperCase()
      if (!up.startsWith('TC(') && !up.startsWith('TA(')) return
      const isNotAcc = (c: typeof articoli[0]) => (artRows as Record<string, unknown>[]).find(r => Number(r.id) === c.id && Number(r.richiede_tipo_colore_acc) === 1) == null
      const child = articoli.find(c => c.parent_id === a.id && isNotAcc(c) && /color/i.test(c.tipo_prodotto + ' ' + c.modello))
        ?? articoli.find(c => c.parent_id === a.id && isNotAcc(c) && c.listino_foto_url)
      if (child?.listino_foto_url) {
        const normalized = child.listino_foto_url.startsWith('/') ? child.listino_foto_url : `/${child.listino_foto_url}`
        a.bar_color = await extractAvgColor(normalized)
      }
      const rawChildAcc = (artRows as Record<string, unknown>[]).find(
        r => Number(r.parent_id) === a.id && Number(r.richiede_tipo_colore_acc) === 1
      )
      const fotoAcc = rawChildAcc?.listino_foto_url != null ? String(rawChildAcc.listino_foto_url) : ''
      if (fotoAcc) {
        const normalized = fotoAcc.startsWith('/') ? fotoAcc : `/${fotoAcc}`
        a.bar_color_acc = await extractAvgColor(normalized)
      }
    }))

    const [listiniRows] = await db.query(`
      SELECT l.id,
             COALESCE(lp.categoria, l.categoria)           AS categoria,
             COALESCE(lp.sottocategoria, l.sottocategoria) AS sottocategoria,
             l.fase, l.materiale, l.tipologia, l.ambiente,
             l.produttore, l.serie, l.descrizione, l.fascia, l.unita,
             l.prezzo_vendita, l.prezzo_acquisto, l.sconto_articolo,
             l.principale, l.caratteristica,
             l.richiede_tipo_colore, l.richiede_tipo_colore_acc, l.richiede_tipo_vetro, l.richiede_tipo_montaggio,
             l.minimo,
             l.Filtro_1 AS filtro_1, l.Filtro_2 AS filtro_2, l.Filtro_3 AS filtro_3, l.Filtro_4 AS filtro_4,
             l.schema_url,
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

    type RawListino = {
      id: number; categoria: string; sottocategoria: string | null; fase: string | null; materiale: string | null
      tipologia: string | null; ambiente: string | null; fascia: string | null
      produttore: string; serie: string; descrizione: string; unita: string
      prezzo_vendita: number; prezzo_acquisto: number; sconto_articolo: number; fornitore_nome: string
      principale: number; caratteristica: number
      richiede_tipo_colore: number; richiede_tipo_colore_acc: number; richiede_tipo_vetro: number; richiede_tipo_montaggio: number
      minimo: number | null
      filtro_1: number; filtro_2: number; filtro_3: number; filtro_4: number
      schema_url: string | null
    }
    const allListini: RawListino[] = (listiniRows as Record<string, unknown>[]).map(l => ({
      id: Number(l.id),
      categoria: String(l.categoria ?? ''),
      sottocategoria: l.sottocategoria ? String(l.sottocategoria) : null,
      fase:           l.fase           ? String(l.fase)           : null,
      materiale:      l.materiale      ? String(l.materiale)      : null,
      tipologia:      l.tipologia      ? String(l.tipologia)      : null,
      ambiente:       l.ambiente       ? String(l.ambiente)       : null,
      fascia:         l.fascia         ? String(l.fascia)         : null,
      produttore: String(l.produttore ?? ''),
      serie: String(l.serie ?? ''),
      descrizione: String(l.descrizione ?? ''),
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
      minimo: l.minimo != null ? Number(l.minimo) : null,
      filtro_1: Number(l.filtro_1 ?? 0),
      filtro_2: Number(l.filtro_2 ?? 0),
      filtro_3: Number(l.filtro_3 ?? 0),
      filtro_4: Number(l.filtro_4 ?? 0),
      schema_url: l.schema_url != null ? String(l.schema_url) : null,
    }))

    let percorsiPerListino: Record<number, { categoria: string; sottocategoria: string }[]> = {}
    try {
      const allIds = [
        ...articoli.map(a => a.listino_id).filter((id): id is number => id !== null && id > 0),
        ...allListini.map(l => l.id),
      ]
      const uniqIds = [...new Set(allIds)]
      if (uniqIds.length > 0) {
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

    let listini: ListinoItem[]
    if (isStaff) {
      listini = allListini.map(l => ({ ...l }))
    } else {
      const best = new Map<string, RawListino>()
      for (const l of allListini) {
        const key = `${l.categoria}||${l.produttore}||${l.descrizione}`
        const cur = best.get(key)
        if (!cur || (l.prezzo_vendita - l.prezzo_acquisto) > (cur.prezzo_vendita - cur.prezzo_acquisto)) {
          best.set(key, l)
        }
      }
      listini = [...best.values()].map(l => ({
        id: l.id, categoria: l.categoria, sottocategoria: l.sottocategoria, fase: l.fase,
        materiale: l.materiale, tipologia: l.tipologia, ambiente: l.ambiente, fascia: l.fascia,
        produttore: l.produttore, serie: l.serie,
        descrizione: l.descrizione, unita: l.unita, prezzo_vendita: l.prezzo_vendita,
        sconto_articolo: l.sconto_articolo, fornitore_nome: l.fornitore_nome,
        principale: l.principale, caratteristica: l.caratteristica,
        richiede_tipo_colore: l.richiede_tipo_colore, richiede_tipo_colore_acc: l.richiede_tipo_colore_acc,
        richiede_tipo_vetro: l.richiede_tipo_vetro, richiede_tipo_montaggio: l.richiede_tipo_montaggio,
        minimo: l.minimo,
        filtro_1: l.filtro_1, filtro_2: l.filtro_2, filtro_3: l.filtro_3, filtro_4: l.filtro_4,
        schema_url: l.schema_url,
      }))
    }

    let clienteEmail = '', clienteCellulare = ''
    {
      const [uInfo] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const userEmail = uInfo[0]?.email ?? ''
      clienteEmail = userEmail
      if (userEmail) {
        const [cInfo] = await db.query('SELECT telefono FROM clienti WHERE email = ? LIMIT 1', [userEmail]) as [{ telefono: string }[], unknown]
        clienteCellulare = cInfo[0]?.telefono ?? ''
      }
    }

    type ClienteOpt = { id: number; label: string }
    let clienti: ClienteOpt[] = []
    if (isStaff) {
      const [cRows] = await db.query(
        `SELECT id, COALESCE(NULLIF(ragione_sociale,''), CONCAT(TRIM(cognome),' ',TRIM(nome))) AS label FROM clienti ORDER BY label`
      ) as [{ id: number; label: string }[], unknown]
      clienti = cRows.map(c => ({ id: Number(c.id), label: String(c.label) }))
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <PreventivoActionsBar id={prevId} />
        <PreventivoClient
          preventivo={preventivo}
          articoli={articoli}
          listini={listini}
          clienti={clienti}
          isStaff={isStaff}
          clienteEmail={clienteEmail}
          clienteCellulare={clienteCellulare}
          isApp={true}
          stampaHref={`/app/preventivo/${prevId}/stampa`}
          backHref="/app/preventivo"
          percorsiPerListino={percorsiPerListino}
        />
      </div>
    )
  } catch {
    redirect('/app/preventivo')
  } finally {
    await db.end()
  }
}
