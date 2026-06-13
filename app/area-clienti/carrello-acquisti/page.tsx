import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import CarrelloAcquistiClient from './carrello-acquisti-client'
import { decompressCart, type CartItem } from '@/lib/cart-cookie'
import { readSettings } from '@/lib/settings'
import { extractAvgColor, colorFromDesc } from '@/lib/extract-color'

export const metadata: Metadata = { title: 'Carrello Acquisti' }

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

  let rows: {
    id: number; categoria: string; produttore: string; descrizione: string; unita: string
    prezzo_vendita: number; sconto_articolo: number
    richiede_tipo_colore: number; richiede_tipo_colore_acc: number
    richiede_tipo_vetro: number; richiede_tipo_montaggio: number
    foto_url: string | null; abbr: string | null; profilo_frontale_mm: number | null
  }[] = []

  if (allValidIds.length > 0) {
    const db = await getConnection()
    try {
      const ph = allValidIds.map(() => '?').join(',')
      const [r] = await db.query(
        `SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita, sconto_articolo,
                richiede_tipo_colore, richiede_tipo_colore_acc, richiede_tipo_vetro, richiede_tipo_montaggio,
                foto_url, abbr, profilo_frontale_mm
         FROM listini WHERE id IN (${ph})`,
        allValidIds
      ) as [typeof rows, unknown]
      rows = r
    } catch { return [] }
    finally { await db.end() }
  }

  const result = normalized.map((item, index) => {
    if (item.tipo === 'caratteristica' || item.id === 0) {
      return {
        index, listino_id: item.id ?? 0,
        categoria: '', produttore: '', descrizione: item.desc ?? '', unita: 'pz',
        prezzo_vendita: 0, sconto_articolo: 0,
        richiede_tipo_colore: 0, richiede_tipo_colore_acc: 0,
        richiede_tipo_vetro: 0, richiede_tipo_montaggio: 0,
        quantita: item.q, uid: item.uid!, parent: item.parent,
        tipo: 'caratteristica' as const, desc: item.desc, foto_url: null,
        abbr: '', profilo_mm: 80, bar_color: null as string | null, bar_color_acc: null as string | null,
      }
    }
    const art = rows.find(r => r.id === item.id)
    if (!art) return null
    return {
      index, listino_id: art.id,
      categoria: art.categoria, produttore: art.produttore,
      descrizione: art.descrizione, unita: art.unita,
      prezzo_vendita: Number(art.prezzo_vendita),
      sconto_articolo: Number(art.sconto_articolo ?? 0),
      richiede_tipo_colore:     Number(art.richiede_tipo_colore     ?? 0),
      richiede_tipo_colore_acc: Number(art.richiede_tipo_colore_acc ?? 0),
      richiede_tipo_vetro:      Number(art.richiede_tipo_vetro      ?? 0),
      richiede_tipo_montaggio:  Number(art.richiede_tipo_montaggio  ?? 0),
      quantita: item.q, ante: item.ante,
      larghezza_cm: item.l, altezza_cm: item.h,
      colore: item.colore, note: item.note,
      uid: item.uid!, parent: item.parent,
      tipo: item.tipo ?? 'articolo' as const, desc: item.desc,
      foto_url: art.foto_url ?? null,
      abbr: art.abbr ?? '',
      profilo_mm: art.profilo_frontale_mm ?? 80,
      bar_color: null as string | null,
      bar_color_acc: null as string | null,
    }
  }).filter(x => x !== null)

  // Calcola bar_color e bar_color_acc per articoli TC/TA
  await Promise.all(result.map(async a => {
    if (!a || a.tipo !== 'articolo') return
    const abbrUp = (a.abbr ?? '').trim().toUpperCase()
    if (!abbrUp.startsWith('TC(') && !abbrUp.startsWith('TA(')) return
    const colorChild = result.find(c => c && c.parent === a.uid && (rows.find(r => r.id === c.listino_id)?.richiede_tipo_colore ?? 0) === 1)
    if (colorChild) {
      const fotoRaw = rows.find(r => r.id === colorChild.listino_id)?.foto_url
      if (fotoRaw) {
        const fotoUrl = fotoRaw.startsWith('/') ? fotoRaw : `/${fotoRaw}`
        a.bar_color = await extractAvgColor(fotoUrl)
      }
      if (!a.bar_color) a.bar_color = colorFromDesc(colorChild.descrizione ?? '')
    }
    const colorAccChild = result.find(c => c && c.parent === a.uid && (rows.find(r => r.id === c.listino_id)?.richiede_tipo_colore_acc ?? 0) === 1)
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
  const username = cookieStore.get('session_user')?.value ?? ''
  const digiCartAcquisti = cookieStore.get('digi_cart_acquisti')?.value ?? ''

  const cart = decompressCart(digiCartAcquisti)
  const articoli = await getArticoliDaCookie(cart)
  const isLoggedIn = !!username
  const { registrazioniDisabilitate } = await readSettings()

  let scontoClientePct = 0
  if (username) {
    try {
      const db = await getConnection()
      try {
        const [uRows] = await db.query('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]) as [{ cliente_id: number | null }[], unknown]
        const clienteId = uRows[0]?.cliente_id ?? null
        if (clienteId) {
          const [cRows] = await db.query('SELECT sconto_pct FROM clienti WHERE id = ? LIMIT 1', [clienteId]) as [{ sconto_pct: number }[], unknown]
          scontoClientePct = Number(cRows[0]?.sconto_pct ?? 0)
        }
      } finally { await db.end() }
    } catch {}
  }

  let caratteristiche: {
    id: number; categoria: string; produttore: string; descrizione: string; unita: string
    prezzo_vendita: number; sconto_articolo: number
    richiede_tipo_colore: number; richiede_tipo_colore_acc: number
    richiede_tipo_vetro: number; richiede_tipo_montaggio: number
  }[] = []
  try {
    const db = await getConnection()
    try {
      const [cr] = await db.query(
        `SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita, sconto_articolo,
                richiede_tipo_colore, richiede_tipo_colore_acc, richiede_tipo_vetro, richiede_tipo_montaggio
         FROM listini
         WHERE (richiede_tipo_colore = 1 OR richiede_tipo_colore_acc = 1 OR richiede_tipo_vetro = 1 OR richiede_tipo_montaggio = 1)
           AND disponibile = 1 AND principale = 0
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
    } finally { await db.end() }
  } catch {}

  return (
    <div className="page-content-wrapper" style={{ margin: '8px 0', padding: '0 0 8px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <CarrelloAcquistiClient articoli={articoli} isLoggedIn={isLoggedIn} caratteristiche={caratteristiche} registrazioniDisabilitate={registrazioniDisabilitate} scontoClientePct={scontoClientePct} />
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>pagina revisionata</p>
    </div>
  )
}
