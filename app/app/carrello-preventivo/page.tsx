import Link from 'next/link'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import CarrelloClient, { type ArticoloCarrello, type CaratteristicaListino, type ListinoItem } from '@/app/area-clienti/carrello-preventivo/carrello-client'
import { decompressCart } from '@/lib/cart-cookie'
import { extractAvgColor, colorFromDesc } from '@/lib/extract-color'
import { ensurePercorsiTables } from '@/lib/percorsi'
import SetActionBar from '@/app/app/set-action-bar'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Carrello Preventivo' }

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
  const allValidIds = [...new Set(normalized.filter(i => (i.id ?? 0) > 0).map(i => i.id!))]

  let rows: { id: number; categoria: string; produttore: string; serie: string; descrizione: string; unita: string; prezzo_vendita: number; sconto_articolo: number; costante: number; richiede_larghezza: number; richiede_altezza: number; richiede_quantita: number; richiede_tipo_colore: number; richiede_tipo_colore_acc: number; richiede_tipo_vetro: number; richiede_tipo_montaggio: number; minimo: number | null; abbr: string | null; profilo_frontale_mm: number | null; foto_url: string | null }[] = []

  if (allValidIds.length > 0) {
    const db = await getConnection()
    try {
      const ph = allValidIds.map(() => '?').join(',')
      const [r] = await db.query(
        `SELECT id, categoria, produttore, serie, descrizione, unita, prezzo_vendita, sconto_articolo, costante, richiede_larghezza, richiede_altezza, richiede_quantita, richiede_tipo_colore, richiede_tipo_colore_acc, richiede_tipo_vetro, richiede_tipo_montaggio, minimo, abbr, profilo_frontale_mm, foto_url FROM listini WHERE id IN (${ph})`,
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
        index, listino_id: item.id ?? 0, categoria: '', produttore: '', descrizione: item.desc ?? '',
        unita: 'pz', prezzo_vendita: 0, quantita: 1, uid: item.uid!,
        parent: item.parent, tipo: 'caratteristica' as const, desc: item.desc,
        foto_url: artCar?.foto_url ?? null, bar_color: null as string | null, bar_color_acc: null as string | null,
      }
    }
    const art = rows.find(r => r.id === item.id)
    if (!art) return null
    return {
      index, listino_id: art.id, categoria: art.categoria, produttore: art.produttore,
      serie: art.serie, descrizione: art.descrizione, unita: art.unita,
      prezzo_vendita: Number(art.prezzo_vendita), sconto_articolo: Number(art.sconto_articolo ?? 0),
      costante: Number(art.costante ?? 0),
      richiede_larghezza:   Number(art.richiede_larghezza   ?? 0),
      richiede_altezza:     Number(art.richiede_altezza     ?? 0),
      richiede_quantita:    Number(art.richiede_quantita    ?? 0),
      richiede_tipo_colore:     Number(art.richiede_tipo_colore     ?? 0),
      richiede_tipo_colore_acc: Number(art.richiede_tipo_colore_acc ?? 0),
      richiede_tipo_vetro:      Number(art.richiede_tipo_vetro      ?? 0),
      richiede_tipo_montaggio:  Number(art.richiede_tipo_montaggio  ?? 0),
      minimo: art.minimo != null ? Number(art.minimo) : null,
      quantita: item.q, ante: item.ante, larghezza_cm: item.l, altezza_cm: item.h,
      colore: item.colore, note: item.note, uid: item.uid!, parent: item.parent,
      tipo: 'articolo' as const, abbr: art.abbr ?? '',
      profilo_mm: art.profilo_frontale_mm ?? 80, foto_url: art.foto_url ?? null,
      bar_color: null as string | null, bar_color_acc: null as string | null,
    }
  }).filter(x => x !== null)

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
        const fotoUrl = fotoRaw.startsWith('/') ? fotoRaw : `/${fotoRaw}`
        a.bar_color = await extractAvgColor(fotoUrl)
      }
      if (!a.bar_color) a.bar_color = colorFromDesc(colorChild.descrizione ?? '')
    }
    const colorAccChild = result.find(c => c.parent === a.uid && (rows.find(r => r.id === c.listino_id)?.richiede_tipo_colore_acc ?? 0) === 1)
    if (colorAccChild) {
      const fotoRaw = rows.find(r => r.id === colorAccChild.listino_id)?.foto_url
      if (fotoRaw) {
        const fotoUrl = fotoRaw.startsWith('/') ? fotoRaw : `/${fotoRaw}`
        a.bar_color_acc = await extractAvgColor(fotoUrl)
      }
      if (!a.bar_color_acc) a.bar_color_acc = colorFromDesc(colorAccChild.descrizione ?? '')
    }
  }))

  return result
}

export default async function Page() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  const digiCart = cookieStore.get('digi_cart')?.value ?? ''

  const cart = decompressCart(digiCart)
  const articoli = await getArticoliDaCookie(cart)
  const isLoggedIn = !!username

  let caratteristiche: CaratteristicaListino[] = []
  try {
    const db2 = await getConnection()
    try {
      const [cr] = await db2.query(
        `SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita, sconto_articolo,
                richiede_tipo_colore, richiede_tipo_colore_acc, richiede_tipo_vetro, richiede_tipo_montaggio
         FROM listini
         WHERE (richiede_tipo_colore = 1 OR richiede_tipo_colore_acc = 1 OR richiede_tipo_vetro = 1 OR richiede_tipo_montaggio = 1)
           AND disponibile = 1
           AND principale = 0
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
      }))
    } finally { await db2.end() }
  } catch {}

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
        SELECT id, categoria, sottocategoria, fase, materiale, tipologia, ambiente,
               produttore, serie, descrizione, fascia, unita,
               prezzo_vendita, sconto_articolo,
               principale, caratteristica,
               richiede_larghezza, richiede_altezza,
               richiede_tipo_colore, richiede_tipo_colore_acc, richiede_tipo_vetro, richiede_tipo_montaggio,
               minimo,
               Filtro_1 AS filtro_1, Filtro_2 AS filtro_2, Filtro_3 AS filtro_3, Filtro_4 AS filtro_4,
               schema_url
        FROM listini
        WHERE disponibile = 1 AND preventivabile = 1 AND principale = 1
        ORDER BY categoria, produttore, serie, descrizione
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
        schema_url: l.schema_url != null ? String(l.schema_url) : null,
      }))
    } finally { await dbL.end() }
  } catch {}

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

  return (
    <div style={{ padding: '0 0 80px', color: '#444', fontSize: 14, lineHeight: 1.8, marginLeft: 3, marginRight: 3 }}>
      <CarrelloClient
        articoli={articoli}
        isLoggedIn={isLoggedIn}
        scontoClientePct={scontoClientePct}
        caratteristiche={caratteristiche}
        listini={listini}
        cataloghiHref="/app/cataloghi"
        stampaHref="/app/carrello-preventivo/stampa"
        postSaveHref="/app/carrello-preventivo"
        isApp={true}
        percorsiPerListino={percorsiPerListino}
      />
      <SetActionBar>
        <Link href="/app/cataloghi" className="btn-black-app fs-12" style={{ flex: 1 }}>
          Vai ai cataloghi →
        </Link>
      </SetActionBar>
    </div>
  )
}
