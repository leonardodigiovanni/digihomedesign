import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'
import CarrelloClient, { type ArticoloCarrello, type CaratteristicaListino, type ListinoItem } from './carrello-client'
import { decompressCart } from '@/lib/cart-cookie'
import { extractAvgColor, colorFromDesc } from '@/lib/extract-color'
import { ensurePercorsiTables } from '@/lib/percorsi'
import { readSettings } from '@/lib/settings'
import { getFiltriModelloLabels } from '@/lib/filtri-modello-labels'
import ShortcutStar from '@/components/shortcut-star'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Carrello Preventivo' }

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

type CarrelloDB = {
  id: number
  cliente_nome: string
  creato_da: string | null
  data: string
  n_articoli: number
}

type CartItem = {
  id: number; q: number; ante?: number; l?: number; h?: number; colore?: string; note?: string
  uid?: number; parent?: number; tipo?: 'articolo' | 'caratteristica'; desc?: string
}

function normalizeCartItems(cart: CartItem[]): CartItem[] {
  let maxUid = 0
  for (const i of cart) if ((i.uid ?? 0) > maxUid) maxUid = i.uid!
  let nextUid = maxUid + 1
  return cart.map(item => item.uid != null ? item : { ...item, uid: nextUid++ })
}

async function getArticoliDaCookie(cart: CartItem[]) {
  if (cart.length === 0) return []
  const normalized = normalizeCartItems(cart)
  // include tutti gli item con id > 0 (sia articoli principali che figli/caratteristiche)
  const allValidIds = [...new Set(normalized.filter(i => (i.id ?? 0) > 0).map(i => i.id!))]

  let rows: { id: number; categoria: string; produttore: string; serie: string; descrizione: string; unita: string; prezzo_vendita: number; sconto_articolo: number; costante: number; richiede_larghezza: number; richiede_altezza: number; richiede_quantita: number; richiede_tipo_colore: number; richiede_tipo_colore_acc: number; richiede_tipo_vetro: number; richiede_tipo_montaggio: number; minimo: number | null; abbr: string | null; profilo_frontale_mm: number | null; foto_url: string | null; escluso: number }[] = []

  if (allValidIds.length > 0) {
    const db = await getConnection()
    try {
      const ph = allValidIds.map(() => '?').join(',')
      const [r] = await db.query(
        `SELECT id, categoria, produttore, serie, descrizione, unita, prezzo_vendita, sconto_articolo, costante, richiede_larghezza, richiede_altezza, richiede_quantita, richiede_tipo_colore, richiede_tipo_colore_acc, richiede_tipo_vetro, richiede_tipo_montaggio, minimo, abbr, profilo_frontale_mm, foto_url, escluso FROM listini WHERE id IN (${ph})`,
        allValidIds
      ) as [typeof rows, unknown]
      rows = r
    } catch { return [] }
    finally { await db.end() }
  }

  const result = normalized.map((item, index) => {
    if (item.tipo === 'caratteristica' || item.id === 0) {
      const artCar = item.id > 0 ? rows.find(r => r.id === item.id) : null
      return {
        index,
        listino_id: item.id ?? 0,
        categoria: '',
        produttore: '',
        descrizione: item.desc ?? '',
        unita: 'pz',
        prezzo_vendita: 0,
        quantita: 1,
        uid: item.uid!,
        parent: item.parent,
        tipo: 'caratteristica' as const,
        desc: item.desc,
        foto_url: artCar?.foto_url ?? null,
        escluso: Number(artCar?.escluso ?? 0),
        bar_color: null as string | null,
        bar_color_acc: null as string | null,
      }
    }
    const art = rows.find(r => r.id === item.id)
    if (!art) return null
    return {
      index,
      listino_id: art.id,
      categoria: art.categoria,
      produttore: art.produttore,
      serie: art.serie,
      descrizione: art.descrizione,
      unita: art.unita,
      prezzo_vendita: Number(art.prezzo_vendita),
      sconto_articolo: Number(art.sconto_articolo ?? 0),
      costante: Number(art.costante ?? 0),
      richiede_larghezza:   Number(art.richiede_larghezza   ?? 0),
      richiede_altezza:     Number(art.richiede_altezza     ?? 0),
      richiede_quantita:    Number(art.richiede_quantita    ?? 0),
      richiede_tipo_colore:     Number(art.richiede_tipo_colore     ?? 0),
      richiede_tipo_colore_acc: Number(art.richiede_tipo_colore_acc ?? 0),
      richiede_tipo_vetro:      Number(art.richiede_tipo_vetro      ?? 0),
      richiede_tipo_montaggio:  Number(art.richiede_tipo_montaggio  ?? 0),
      minimo: art.minimo != null ? Number(art.minimo) : null,
      quantita: item.q,
      ante: item.ante,
      larghezza_cm: item.l,
      altezza_cm: item.h,
      colore: item.colore,
      note: item.note,
      uid: item.uid!,
      parent: item.parent,
      tipo: 'articolo' as const,
      abbr: art.abbr ?? '',
      profilo_mm: art.profilo_frontale_mm ?? 80,
      foto_url: art.foto_url ?? null,
      escluso: Number(art.escluso ?? 0),
      bar_color: null as string | null,
      bar_color_acc: null as string | null,
    }
  }).filter(x => x !== null)

  // Pre-calcola bar_color e bar_color_acc per articoli TC/TA
  await Promise.all(result.map(async a => {
    if (a.tipo !== 'articolo') return
    const abbrUp = (a.abbr ?? '').trim().toUpperCase()
    if (!abbrUp.startsWith('TC(') && !abbrUp.startsWith('TA(')) return
    const isNotAcc = (c: typeof result[0]) => (rows.find(r => r.id === c.listino_id)?.richiede_tipo_colore_acc ?? 0) !== 1
    const colorChild = result.find(c => c.parent === a.uid && (rows.find(r => r.id === c.listino_id)?.richiede_tipo_colore ?? 0) === 1)
      ?? result.find(c => c.parent === a.uid && isNotAcc(c) && (/color/i.test(c.categoria) || /color/i.test(c.descrizione ?? '')))
      ?? result.find(c => c.parent === a.uid && isNotAcc(c) && !!rows.find(r => r.id === c.listino_id)?.foto_url)
    if (colorChild) {
      const fotoRaw = rows.find(r => r.id === colorChild.listino_id)?.foto_url
      if (fotoRaw) {
        a.bar_color = await extractAvgColor(fotoRaw.startsWith('http') ? fotoRaw : fotoRaw.startsWith('/') ? fotoRaw : `/${fotoRaw}`)
      }
      if (!a.bar_color) a.bar_color = colorFromDesc(colorChild.descrizione ?? '')
    }
    const colorAccChild = result.find(c => c.parent === a.uid && (rows.find(r => r.id === c.listino_id)?.richiede_tipo_colore_acc ?? 0) === 1)
    if (colorAccChild) {
      const fotoRaw = rows.find(r => r.id === colorAccChild.listino_id)?.foto_url
      if (fotoRaw) {
        a.bar_color_acc = await extractAvgColor(fotoRaw.startsWith('http') ? fotoRaw : fotoRaw.startsWith('/') ? fotoRaw : `/${fotoRaw}`)
      }
      if (!a.bar_color_acc) a.bar_color_acc = colorFromDesc(colorAccChild.descrizione ?? '')
    }
  }))

  return result
}

async function getCarrelliDB(): Promise<CarrelloDB[]> {
  const db = await getConnection()
  try {
    const [rows] = await db.query(`
      SELECT
        p.id,
        p.creato_da,
        p.data,
        CASE
          WHEN c.id IS NULL THEN ''
          WHEN c.ragione_sociale != '' THEN c.ragione_sociale
          ELSE CONCAT(TRIM(c.cognome), ' ', TRIM(c.nome))
        END AS cliente_nome,
        COUNT(pa.id) AS n_articoli
      FROM preventivi p
      LEFT JOIN clienti c ON c.id = p.cliente_id
      LEFT JOIN preventivo_articoli pa ON pa.preventivo_id = p.id
      WHERE p.descrizione = 'Carrello' AND p.stato = 'bozza'
      GROUP BY p.id, p.creato_da, p.data, c.id, c.ragione_sociale, c.cognome, c.nome
      ORDER BY p.id DESC
    `)
    return (rows as Record<string, unknown>[]).map(r => ({
      id: r.id as number,
      creato_da: (r.creato_da as string | null) ?? null,
      cliente_nome: (r.cliente_nome as string) ?? '',
      data: dateToLocal(r.data),
      n_articoli: Number(r.n_articoli),
    }))
  } catch { return [] }
  finally { await db.end() }
}

async function StaffView() {
  const carrelli = await getCarrelliDB()

  const th: React.CSSProperties = {
    padding: '9px 14px', fontSize: 11, fontWeight: 600, color: '#888',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fafafa', borderBottom: '1px solid #e8e8e8', whiteSpace: 'nowrap',
  }
  const td: React.CSSProperties = {
    padding: '10px 14px', fontSize: 13, color: '#333',
    borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Carrelli Preventivo</h2>
        <p style={{ color: '#000', fontSize: 14, margin: '4px 0 0' }}>
          Preventivi bozza "Carrello" creati da utenti loggati.
        </p>
      </div>

      {carrelli.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun carrello trovato.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8 }}>
            <thead>
              <tr>
                <th style={th}>N°</th>
                <th style={th}>Cliente</th>
                <th style={th}>Utente</th>
                <th style={th}>Data</th>
                <th style={{ ...th, textAlign: 'center' }}>Articoli</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {carrelli.map(c => (
                <tr key={c.id}>
                  <td style={td}>#{c.id}</td>
                  <td style={td}>{c.cliente_nome || '—'}</td>
                  <td style={{ ...td, color: '#888' }}>{c.creato_da || '—'}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>{c.data}</td>
                  <td style={{ ...td, textAlign: 'center' }}>{c.n_articoli}</td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <a
                      href={`/clienti/preventivi/${c.id}`}
                      style={{ color: '#2b6cb0', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}
                    >
                      Apri →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default async function Page() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  const digiCart = cookieStore.get('digi_cart')?.value ?? ''

  const isStaff = role === 'admin' || role === 'dipendente' || role === 'direttore'
  if (!isStaff) {
    const { rolePermissions } = await readSettings()
    if (!(rolePermissions['cliente'] ?? []).includes(52)) redirect('/aiuto/guida-preventivo')
  }

  const cart = decompressCart(digiCart)

  const articoli = await getArticoliDaCookie(cart)
  const isLoggedIn = !!username

  // Carica caratteristiche disponibili (colore + vetro)
  let caratteristiche: CaratteristicaListino[] = []
  try {
    const db2 = await getConnection()
    try {
      const [cr] = await db2.query(
        `SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita, sconto_articolo,
                richiede_tipo_colore, richiede_tipo_colore_acc, richiede_tipo_vetro, richiede_tipo_montaggio, foto_url, escluso
         FROM listini
         WHERE disponibile = 1
           AND principale = 0
           AND (
             (richiede_tipo_colore = 1 OR richiede_tipo_colore_acc = 1 OR richiede_tipo_vetro = 1 OR richiede_tipo_montaggio = 1)
             OR (caratteristica = 1 AND preventivabile = 1
                 AND richiede_tipo_colore = 0 AND richiede_tipo_colore_acc = 0
                 AND richiede_tipo_vetro = 0 AND richiede_tipo_montaggio = 0)
           )
         ORDER BY categoria ASC, descrizione ASC`
      ) as [Record<string, unknown>[], unknown]
      caratteristiche = cr.map(r => ({
        id:                  Number(r.id),
        categoria:           String(r.categoria ?? ''),
        produttore:          String(r.produttore ?? ''),
        descrizione:         String(r.descrizione ?? ''),
        unita:               String(r.unita ?? 'pz'),
        prezzo_vendita:      Number(r.prezzo_vendita ?? 0),
        sconto_articolo:     Number(r.sconto_articolo ?? 0),
        richiede_tipo_colore:     Number(r.richiede_tipo_colore     ?? 0),
        richiede_tipo_colore_acc: Number(r.richiede_tipo_colore_acc ?? 0),
        richiede_tipo_vetro:      Number(r.richiede_tipo_vetro      ?? 0),
        richiede_tipo_montaggio:  Number(r.richiede_tipo_montaggio  ?? 0),
        foto_url:            r.foto_url ? String(r.foto_url) : null,
        escluso:             Number(r.escluso ?? 0),
      }))
    } finally { await db2.end() }
  } catch {}

  // Percorsi (coppie cat+sottocat) per articoli carrello + caratteristiche
  let percorsiPerListino: Record<number, { categoria: string; sottocategoria: string }[]> = {}
  try {
    const allIds = [
      ...articoli.map(a => a.listino_id).filter(id => id > 0),
      ...caratteristiche.map(c => c.id),
    ]
    const uniqIds = [...new Set(allIds)]
    if (uniqIds.length > 0) {
      const dbP = await getConnection()
      try {
        await ensurePercorsiTables(dbP)
        const ph = uniqIds.map(() => '?').join(',')
        const [pRows] = await dbP.query(
          `SELECT listino_id, categoria, sottocategoria FROM listini_percorsi WHERE listino_id IN (${ph})`,
          uniqIds
        ) as [Record<string, unknown>[], unknown]
        for (const row of pRows as Record<string, unknown>[]) {
          const id = Number(row.listino_id)
          if (!percorsiPerListino[id]) percorsiPerListino[id] = []
          percorsiPerListino[id].push({ categoria: String(row.categoria), sottocategoria: String(row.sottocategoria) })
        }
      } finally { await dbP.end() }
    }
  } catch {}

  // Carica listini principali per la modale aggiungi articolo
  let listini: ListinoItem[] = []
  try {
    const dbL = await getConnection()
    try {
      await dbL.execute(`ALTER TABLE listini ADD COLUMN sottocategoria VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
      await dbL.execute(`ALTER TABLE listini ADD COLUMN fase          VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
      await dbL.execute(`ALTER TABLE listini ADD COLUMN materiale     VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
      await dbL.execute(`ALTER TABLE listini ADD COLUMN tipologia     VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
      await dbL.execute(`ALTER TABLE listini ADD COLUMN ambiente      VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
      await dbL.execute(`ALTER TABLE listini ADD COLUMN fascia        VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
      const [lr] = await dbL.query(`
        SELECT l.id,
               COALESCE(lp.categoria, l.categoria)           AS categoria,
               COALESCE(lp.sottocategoria, l.sottocategoria) AS sottocategoria,
               l.fase, l.materiale, l.tipologia, l.ambiente,
               l.produttore, l.serie, l.descrizione, l.fascia, l.unita,
               l.prezzo_vendita, l.sconto_articolo,
               l.principale, l.caratteristica,
               l.richiede_larghezza, l.richiede_altezza,
               l.richiede_tipo_colore, l.richiede_tipo_colore_acc, l.richiede_tipo_vetro, l.richiede_tipo_montaggio,
               l.minimo,
               l.Filtro_1 AS filtro_1, l.Filtro_2 AS filtro_2, l.Filtro_3 AS filtro_3, l.Filtro_4 AS filtro_4,
               l.Filtro_5 AS filtro_5, l.Filtro_6 AS filtro_6, l.Filtro_7 AS filtro_7, l.Filtro_8 AS filtro_8,
               l.Filtro_9 AS filtro_9, l.Filtro_10 AS filtro_10,
               l.schema_url, l.logo_url
        FROM listini l
        LEFT JOIN listini_percorsi lp ON lp.listino_id = l.id
        WHERE l.disponibile = 1 AND l.preventivabile = 1 AND l.principale = 1
        ORDER BY COALESCE(lp.categoria, l.categoria), l.produttore, l.serie, l.descrizione
      `) as [Record<string, unknown>[], unknown]
      listini = (lr as Record<string, unknown>[]).map(l => ({
        id:           Number(l.id),
        categoria:    String(l.categoria ?? ''),
        sottocategoria: l.sottocategoria ? String(l.sottocategoria) : null,
        fase:           l.fase           ? String(l.fase)           : null,
        materiale:      l.materiale      ? String(l.materiale)      : null,
        tipologia:      l.tipologia      ? String(l.tipologia)      : null,
        ambiente:       l.ambiente       ? String(l.ambiente)       : null,
        produttore:   String(l.produttore ?? ''),
        serie:        String(l.serie ?? ''),
        descrizione:  String(l.descrizione ?? ''),
        fascia:         l.fascia         ? String(l.fascia)         : null,
        unita:        String(l.unita ?? 'pz'),
        prezzo_vendita: Number(l.prezzo_vendita),
        sconto_articolo: Number(l.sconto_articolo ?? 0),
        principale:   Number(l.principale ?? 1),
        caratteristica: Number(l.caratteristica ?? 1),
        richiede_larghezza: Number(l.richiede_larghezza ?? 0),
        richiede_altezza:   Number(l.richiede_altezza   ?? 0),
        richiede_tipo_colore:     Number(l.richiede_tipo_colore     ?? 0),
        richiede_tipo_colore_acc: Number(l.richiede_tipo_colore_acc ?? 0),
        richiede_tipo_vetro:      Number(l.richiede_tipo_vetro      ?? 0),
        richiede_tipo_montaggio:  Number(l.richiede_tipo_montaggio  ?? 0),
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
    } finally { await dbL.end() }
  } catch {}

  let filtriLabels: Record<number, string> = {}
  try {
    const dbF = await getConnection()
    try { filtriLabels = await getFiltriModelloLabels(dbF) } finally { await dbF.end() }
  } catch {}

  // Leggi sconto cliente se loggato
  let scontoClientePct = 0
  if (username && role === 'cliente') {
    try {
      const db = await getConnection()
      const [uRows] = await db.query('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]) as [{ cliente_id: number | null }[], unknown]
      const clienteId = uRows[0]?.cliente_id ?? null
      if (clienteId) {
        const [cRows] = await db.query('SELECT sconto_pct FROM clienti WHERE id = ? LIMIT 1', [clienteId]) as [{ sconto_pct: number }[], unknown]
        scontoClientePct = Number(cRows[0]?.sconto_pct ?? 0)
      }
      await db.end()
    } catch {}
  }

  // Righe del cookie che non risolvono più contro listini (articolo cancellato):
  // spariscono dalla vista ma restano nel cookie, gonfiando il badge in layout.tsx.
  const hasOrfani = cart.filter(i => i.tipo !== 'caratteristica').length !== articoli.filter(a => a?.tipo !== 'caratteristica').length

  return (
    <div className="page-content-wrapper" style={{ margin: '8px 0', padding: '0 0 8px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>

<ShortcutStar href="/area-clienti/carrello-preventivo" />
<CarrelloClient articoli={articoli} isLoggedIn={isLoggedIn} scontoClientePct={scontoClientePct} caratteristiche={caratteristiche} listini={listini} percorsiPerListino={percorsiPerListino} filtriLabels={filtriLabels} hasOrfani={hasOrfani} />

      {isStaff && (
        <div style={{ marginTop: 56, borderTop: '2px solid #e8e8e8', paddingTop: 40 }}>
          <StaffView />
        </div>
      )}
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>pagina revisionata</p>
    </div>
  )
}
