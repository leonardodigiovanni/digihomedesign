'use server'

import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import { decompressCart, type CartItem } from '@/lib/cart-cookie'

export type CartResult = { ok: true; preventivoId?: number; newCart?: string } | { ok: false; error: string }
export type SaveResult = { ok: true; redirectUrl: string } | { ok: false; error: string }
export type PreventivoDestOption = { id: number; label: string }

// Formato compresso nel cookie: chiavi brevi per stare sotto i 4096 byte
type C = { id: number; q: number; u?: number; p?: number; t?: 1|2; a?: number; l?: number; h?: number; c?: string; n?: string; d?: string }

function compressCart(cart: CartItem[]): C[] {
  return cart.map(i => {
    const o: C = { id: i.id, q: i.q }
    if (i.uid    != null) o.u = i.uid
    if (i.parent != null) o.p = i.parent
    if (i.tipo === 'articolo')        o.t = 1
    if (i.tipo === 'caratteristica')  o.t = 2
    if (i.ante   != null) o.a = i.ante
    if (i.l      != null) o.l = i.l
    if (i.h      != null) o.h = i.h
    if (i.colore) o.c = i.colore
    if (i.note)   o.n = i.note
    if (i.desc)   o.d = i.desc
    return o
  })
}

function normalizeCart(raw: string): CartItem[] {
  const cart = decompressCart(raw)
  let maxUid = 0
  for (const i of cart) if ((i.uid ?? 0) > maxUid) maxUid = i.uid!
  let nextUid = maxUid + 1
  return cart.map(item => item.uid != null ? item : { ...item, uid: nextUid++ })
}

function saveCartCookie(cs: Awaited<ReturnType<typeof cookies>>, cart: CartItem[]) {
  if (cart.length === 0) cs.delete('digi_cart')
  else cs.set('digi_cart', JSON.stringify(compressCart(cart)), { maxAge: 30 * 24 * 60 * 60, path: '/', sameSite: 'lax' })
}

// ─── Aggiungi al carrello (sempre cookie, per tutti) ─────────────────────────

export async function aggiungiAlCarrello(_: CartResult | null, fd: FormData): Promise<CartResult> {
  const listinoId = parseInt(fd.get('listino_id') as string)
  const quantita  = Math.max(1, parseInt(fd.get('quantita') as string) || 1)
  const ante      = Math.max(0, parseInt(fd.get('ante') as string) || 0)
  const larghezza = parseFloat(fd.get('larghezza') as string) || 0
  const altezza   = parseFloat(fd.get('altezza') as string) || 0
  const colore    = (fd.get('colore') as string | null)?.trim() || ''
  const note      = (fd.get('note') as string | null)?.trim() || ''
  if (!listinoId || isNaN(listinoId)) return { ok: false, error: 'Articolo non valido.' }

  const cookieStore = await cookies()
  const cart = normalizeCart(cookieStore.get('digi_cart')?.value ?? '')
  const nextUid = Math.max(0, ...cart.map(i => i.uid ?? 0)) + 1

  const newItem: CartItem = { id: listinoId, q: quantita, uid: nextUid, tipo: 'articolo' }
  if (ante !== 1) newItem.ante = ante
  if (larghezza > 0) newItem.l = larghezza
  if (altezza > 0) newItem.h = altezza
  if (colore) newItem.colore = colore
  if (note) newItem.note = note

  // Leggi parent pendente (se l'utente ha cliccato "+" su un articolo nel carrello)
  const parentRaw = cookieStore.get('digi_cart_parent')?.value
  if (parentRaw) {
    try {
      const { uid: parentUid } = JSON.parse(parentRaw) as { uid: number; desc: string }
      const parentItem = cart.find(i => i.uid === parentUid)
      if (parentItem?.uid != null) {
        newItem.parent = parentItem.uid

        // Le caratteristiche tipo_vetro ereditano larghezza e altezza dal padre
        if (!newItem.l && !newItem.h) {
          const db2 = await getConnection()
          try {
            const [flagRows] = await db2.query(
              'SELECT richiede_tipo_vetro FROM listini WHERE id = ? LIMIT 1', [listinoId]
            ) as [{ richiede_tipo_vetro: number }[], unknown]
            if (flagRows[0]?.richiede_tipo_vetro === 1) {
              if (parentItem.l) newItem.l = parentItem.l
              if (parentItem.h) newItem.h = parentItem.h
              newItem.q = parentItem.q
            }
          } catch {} finally { await db2.end() }
        }

        // Inserisci subito dopo il padre e i suoi figli già esistenti
        const parentIdx = cart.findIndex(i => i.uid === parentUid)
        let insertIdx = parentIdx + 1
        while (insertIdx < cart.length && cart[insertIdx].parent === parentUid) insertIdx++
        cart.splice(insertIdx, 0, newItem)
        cookieStore.delete('digi_cart_parent')
        saveCartCookie(cookieStore, cart)
        return { ok: true }
      }
    } catch {}
    cookieStore.delete('digi_cart_parent')
  }

  cart.push(newItem)
  saveCartCookie(cookieStore, cart)
  return { ok: true }
}

// ─── Svuota carrello ──────────────────────────────────────────────────────────

export async function svuotaCarrello(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('digi_cart')
}

// ─── Rimuovi dal carrello per indice ─────────────────────────────────────────

export async function rimuoviDaCarrello(index: number): Promise<void> {
  const cs = await cookies()
  const cart = normalizeCart(cs.get('digi_cart')?.value ?? '')
  if (index < 0 || index >= cart.length) return
  const removedUid = cart[index].uid
  const filtered = cart.filter((item, i) => i !== index && item.parent !== removedUid)
  saveCartCookie(cs, filtered)
}

// ─── Aggiorna articolo esistente nel carrello ─────────────────────────────────

export async function aggiornaArticoloCarrello(
  index: number,
  updates: { q?: number; ante?: number; l?: number; h?: number; colore?: string; note?: string; desc?: string }
): Promise<CartResult> {
  const cs = await cookies()
  const cart = normalizeCart(cs.get('digi_cart')?.value ?? '')
  if (index < 0 || index >= cart.length) return { ok: false, error: 'Articolo non trovato.' }
  const item = { ...cart[index] }

  if (updates.q != null && updates.q > 0 && updates.q !== item.q) {
    const db = await getConnection()
    try {
      const [rows] = await db.query(
        'SELECT max_acquistabile FROM listini WHERE id = ? LIMIT 1', [item.id]
      ) as [{ max_acquistabile: number | null }[], unknown]
      const max = rows[0]?.max_acquistabile ?? null
      if (max === 0) return { ok: false, error: 'Articolo esaurito.' }
      if (max !== null && updates.q > max)
        return { ok: false, error: `Quantità non disponibile. Massimo acquistabile: ${max}.` }
    } finally { await db.end() }
  }

  if (updates.q    != null) item.q      = updates.q
  if (updates.ante != null) item.ante   = updates.ante
  if (updates.l    != null) item.l      = updates.l
  if (updates.h    != null) item.h      = updates.h
  if (updates.colore != null) item.colore = updates.colore
  if (updates.note   != null) item.note   = updates.note
  if (updates.desc   != null) item.desc   = updates.desc
  cart[index] = item

  // Propaga l/h/q ai figli tipo_vetro che li hanno ereditati
  const propagaL = updates.l != null
  const propagaH = updates.h != null
  const propagaQ = updates.q != null
  if (item.uid != null && (propagaL || propagaH || propagaQ)) {
    const figli = cart.filter(i => i.parent === item.uid && i.id && i.id !== 0)
    if (figli.length > 0) {
      const ids = figli.map(i => i.id!)
      const db = await getConnection()
      try {
        const ph = ids.map(() => '?').join(',')
        const [flagRows] = await db.query(
          `SELECT id, richiede_tipo_vetro FROM listini WHERE id IN (${ph})`, ids
        ) as [{ id: number; richiede_tipo_vetro: number }[], unknown]
        const vetroIds = new Set(flagRows.filter(r => r.richiede_tipo_vetro === 1).map(r => r.id))
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].parent === item.uid && vetroIds.has(cart[i].id!)) {
            const figlio = { ...cart[i] }
            if (propagaL) figlio.l = updates.l
            if (propagaH) figlio.h = updates.h
            if (propagaQ) figlio.q = updates.q!
            cart[i] = figlio
          }
        }
      } catch {} finally { await db.end() }
    }
  }
  saveCartCookie(cs, cart)
  return { ok: true }
}

// ─── Applica caratteristica diretta a uno o più padri ────────────────────────

export async function applicaCaratteristicaAlCarrello(
  parentUids: number[],
  listinoId: number,
  note?: string
): Promise<CartResult> {
  if (!listinoId || parentUids.length === 0) return { ok: false, error: 'Dati non validi.' }
  const cs   = await cookies()
  const cart = normalizeCart(cs.get('digi_cart')?.value ?? '')

  const db = await getConnection()
  try {
    const [rows] = await db.query(
      'SELECT id, richiede_tipo_vetro FROM listini WHERE id = ? LIMIT 1', [listinoId]
    ) as [{ id: number; richiede_tipo_vetro: number }[], unknown]
    if (!rows[0]) return { ok: false, error: 'Articolo non trovato.' }
    const isVetro = rows[0].richiede_tipo_vetro === 1

    let nextUid = Math.max(0, ...cart.map(i => i.uid ?? 0)) + 1
    for (const parentUid of parentUids) {
      const parentItem = cart.find(i => i.uid === parentUid)
      if (!parentItem) continue
      const newItem: CartItem = { id: listinoId, q: parentItem.q, uid: nextUid++, tipo: 'articolo', parent: parentUid }
      if (isVetro) {
        if (parentItem.l) newItem.l = parentItem.l
        if (parentItem.h) newItem.h = parentItem.h
        newItem.q = parentItem.q
      }
      if (note?.trim()) newItem.note = note.trim()
      const parentIdx = cart.findIndex(i => i.uid === parentUid)
      let insertIdx = parentIdx + 1
      while (insertIdx < cart.length && cart[insertIdx].parent === parentUid) insertIdx++
      cart.splice(insertIdx, 0, newItem)
    }
    saveCartCookie(cs, cart)
    return { ok: true, newCart: JSON.stringify(compressCart(cart)) }
  } finally { await db.end() }
}

// ─── Parent pendente: segnala al catalogo che il prossimo articolo è figlio ───

export async function impostaParentPendente(parentUid: number, parentDesc: string, lacune: string[] = []): Promise<void> {
  const cs = await cookies()
  cs.set('digi_cart_parent', JSON.stringify({ uid: parentUid, desc: parentDesc, lacune }), {
    maxAge: 15 * 60, path: '/', sameSite: 'lax',
  })
}

export async function annullaParentPendente(): Promise<void> {
  const cs = await cookies()
  cs.delete('digi_cart_parent')
}

// ─── Aggiungi nuovo articolo (da carrello, non da FormData catalogo) ──────────

export async function aggiungiArticoloAlCarrello(
  listinoId: number,
  updates: { q: number; ante?: number; l?: number; h?: number; colore?: string; note?: string }
): Promise<CartResult> {
  if (!listinoId) return { ok: false, error: 'Articolo non valido.' }
  const cs = await cookies()
  const cart = normalizeCart(cs.get('digi_cart')?.value ?? '')
  const nextUid = Math.max(0, ...cart.map(i => i.uid ?? 0)) + 1
  const newItem: CartItem = { id: listinoId, q: updates.q, uid: nextUid, tipo: 'articolo' }
  if (updates.ante) newItem.ante = updates.ante
  if (updates.l)    newItem.l    = updates.l
  if (updates.h)    newItem.h    = updates.h
  if (updates.colore) newItem.colore = updates.colore
  if (updates.note)   newItem.note   = updates.note
  cart.push(newItem)
  saveCartCookie(cs, cart)
  return { ok: true }
}

// ─── Carrello Acquisti (cookie digi_cart_acquisti) ────────────────────────────

function normalizeCartAcquisti(raw: string): CartItem[] {
  const cart = decompressCart(raw)
  let maxUid = 0
  for (const i of cart) if ((i.uid ?? 0) > maxUid) maxUid = i.uid!
  let nextUid = maxUid + 1
  return cart.map(item => item.uid != null ? item : { ...item, uid: nextUid++, tipo: item.tipo ?? 'articolo' })
}

function saveCartAcquistiCookie(cs: Awaited<ReturnType<typeof cookies>>, cart: CartItem[]) {
  if (cart.length === 0) cs.delete('digi_cart_acquisti')
  else cs.set('digi_cart_acquisti', JSON.stringify(compressCart(cart)), { maxAge: 30 * 24 * 60 * 60, path: '/', sameSite: 'lax' })
}

export async function aggiungiAlCarrelloAcquisti(_: CartResult | null, fd: FormData): Promise<CartResult> {
  const listinoId = parseInt(fd.get('listino_id') as string)
  const quantita  = Math.max(1, parseInt(fd.get('quantita') as string) || 1)
  const ante      = Math.max(0, parseInt(fd.get('ante') as string) || 0)
  const larghezza = parseFloat(fd.get('larghezza') as string) || 0
  const altezza   = parseFloat(fd.get('altezza') as string) || 0
  const colore    = (fd.get('colore') as string | null)?.trim() || ''
  const note      = (fd.get('note') as string | null)?.trim() || ''
  if (!listinoId || isNaN(listinoId)) return { ok: false, error: 'Articolo non valido.' }

  const db = await getConnection()
  try {
    const [rows] = await db.query(
      'SELECT max_acquistabile FROM listini WHERE id = ? LIMIT 1', [listinoId]
    ) as [{ max_acquistabile: number | null }[], unknown]
    const max = rows[0]?.max_acquistabile ?? null
    if (max === 0) return { ok: false, error: 'Articolo esaurito.' }
    if (max !== null && quantita > max)
      return { ok: false, error: `Quantità non disponibile. Massimo acquistabile: ${max}.` }
  } finally {
    await db.end()
  }

  const cookieStore = await cookies()
  const cart = normalizeCartAcquisti(cookieStore.get('digi_cart_acquisti')?.value ?? '')
  const nextUid = Math.max(0, ...cart.map(i => i.uid ?? 0)) + 1

  const newItem: CartItem = { id: listinoId, q: quantita, uid: nextUid, tipo: 'articolo' }
  if (ante !== 1) newItem.ante = ante
  if (larghezza > 0) newItem.l = larghezza
  if (altezza > 0) newItem.h = altezza
  if (colore) newItem.colore = colore
  if (note) newItem.note = note
  cart.push(newItem)

  saveCartAcquistiCookie(cookieStore, cart)
  return { ok: true }
}

export async function svuotaCarrelloAcquisti(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('digi_cart_acquisti')
}

export async function rimuoviDaCarrelloAcquisti(index: number): Promise<void> {
  const cs = await cookies()
  const cart = normalizeCartAcquisti(cs.get('digi_cart_acquisti')?.value ?? '')
  if (index < 0 || index >= cart.length) return
  const removedUid = cart[index].uid
  const filtered = cart.filter((item, i) => i !== index && item.parent !== removedUid)
  saveCartAcquistiCookie(cs, filtered)
}

export async function aggiornaArticoloCarrelloAcquisti(
  index: number,
  updates: { q?: number; l?: number; h?: number; colore?: string; note?: string }
): Promise<CartResult> {
  const cs = await cookies()
  const cart = normalizeCartAcquisti(cs.get('digi_cart_acquisti')?.value ?? '')
  if (index < 0 || index >= cart.length) return { ok: false, error: 'Articolo non trovato.' }
  const item = { ...cart[index] }

  if (updates.q != null && updates.q > 0 && updates.q !== item.q) {
    const db = await getConnection()
    try {
      const [rows] = await db.query(
        'SELECT max_acquistabile FROM listini WHERE id = ? LIMIT 1', [item.id]
      ) as [{ max_acquistabile: number | null }[], unknown]
      const max = rows[0]?.max_acquistabile ?? null
      if (max === 0) return { ok: false, error: 'Articolo esaurito.' }
      if (max !== null && updates.q > max)
        return { ok: false, error: `Quantità non disponibile. Massimo acquistabile: ${max}.` }
    } finally { await db.end() }
    item.q = updates.q
  }

  if (updates.l != null) item.l = updates.l > 0 ? updates.l : undefined
  if (updates.h != null) item.h = updates.h > 0 ? updates.h : undefined
  if (updates.colore != null) item.colore = updates.colore || undefined
  if (updates.note   != null) item.note   = updates.note   || undefined
  cart[index] = item
  saveCartAcquistiCookie(cs, cart)
  return { ok: true }
}

export async function aggiungiArticoloAlCarrelloAcquisti(
  listinoId: number,
  updates: { q: number; l?: number; h?: number; colore?: string; note?: string }
): Promise<CartResult> {
  if (!listinoId) return { ok: false, error: 'Articolo non valido.' }
  const db = await getConnection()
  try {
    const [rows] = await db.query(
      'SELECT max_acquistabile FROM listini WHERE id = ? LIMIT 1', [listinoId]
    ) as [{ max_acquistabile: number | null }[], unknown]
    const max = rows[0]?.max_acquistabile ?? null
    if (max === 0) return { ok: false, error: 'Articolo esaurito.' }
    if (max !== null && updates.q > max)
      return { ok: false, error: `Quantità non disponibile. Massimo acquistabile: ${max}.` }
  } finally { await db.end() }
  const cs = await cookies()
  const cart = normalizeCartAcquisti(cs.get('digi_cart_acquisti')?.value ?? '')
  const nextUid = Math.max(0, ...cart.map(i => i.uid ?? 0)) + 1
  const newItem: CartItem = { id: listinoId, q: updates.q, uid: nextUid, tipo: 'articolo' }
  if (updates.l) newItem.l = updates.l
  if (updates.h) newItem.h = updates.h
  if (updates.colore) newItem.colore = updates.colore
  if (updates.note)   newItem.note   = updates.note
  cart.push(newItem)
  saveCartAcquistiCookie(cs, cart)
  return { ok: true }
}

export async function applicaCaratteristicaAlCarrelloAcquisti(
  parentUids: number[],
  listinoId: number
): Promise<CartResult> {
  if (!listinoId || parentUids.length === 0) return { ok: false, error: 'Dati non validi.' }
  const cs   = await cookies()
  const cart = normalizeCartAcquisti(cs.get('digi_cart_acquisti')?.value ?? '')

  const db = await getConnection()
  try {
    const [rows] = await db.query(
      'SELECT id, richiede_tipo_vetro FROM listini WHERE id = ? LIMIT 1', [listinoId]
    ) as [{ id: number; richiede_tipo_vetro: number }[], unknown]
    if (!rows[0]) return { ok: false, error: 'Articolo non trovato.' }
    const isVetro = rows[0].richiede_tipo_vetro === 1

    let nextUid = Math.max(0, ...cart.map(i => i.uid ?? 0)) + 1
    for (const parentUid of parentUids) {
      const parentItem = cart.find(i => i.uid === parentUid)
      if (!parentItem) continue
      const newItem: CartItem = { id: listinoId, q: parentItem.q, uid: nextUid++, tipo: 'articolo', parent: parentUid }
      if (isVetro) {
        if (parentItem.l) newItem.l = parentItem.l
        if (parentItem.h) newItem.h = parentItem.h
        newItem.q = parentItem.q
      }
      const parentIdx = cart.findIndex(i => i.uid === parentUid)
      let insertIdx = parentIdx + 1
      while (insertIdx < cart.length && cart[insertIdx].parent === parentUid) insertIdx++
      cart.splice(insertIdx, 0, newItem)
    }
    saveCartAcquistiCookie(cs, cart)
    return { ok: true, newCart: JSON.stringify(compressCart(cart)) }
  } finally { await db.end() }
}

// ─── Salva carrello come NUOVO preventivo ─────────────────────────────────────

export async function salvaCarrelloComePreventivo(): Promise<SaveResult> {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  const role     = cookieStore.get('session_role')?.value ?? ''
  if (!username) return { ok: false, error: 'Devi essere loggato.' }

  const raw = cookieStore.get('digi_cart')?.value
  if (!raw) return { ok: false, error: 'Carrello vuoto.' }
  const cart = decompressCart(raw)
  if (cart.length === 0) return { ok: false, error: 'Carrello vuoto.' }

  const db = await getConnection()
  try {
    await db.execute(`CREATE TABLE IF NOT EXISTS preventivi (
      id INT AUTO_INCREMENT PRIMARY KEY,
      numero VARCHAR(50) NOT NULL DEFAULT '',
      cliente_id INT NULL,
      descrizione TEXT NULL,
      stato ENUM('bozza','inviato','accettato','rifiutato','scaduto') NOT NULL DEFAULT 'bozza',
      importo DECIMAL(10,2) NOT NULL DEFAULT 0,
      data DATE NOT NULL,
      validita_giorni INT NOT NULL DEFAULT 30,
      note TEXT NULL,
      visibile_cliente TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)
    await db.execute(`CREATE TABLE IF NOT EXISTS preventivo_articoli (
      id INT AUTO_INCREMENT PRIMARY KEY,
      preventivo_id INT NOT NULL,
      tipo_prodotto VARCHAR(100) NOT NULL,
      marca VARCHAR(100) NOT NULL DEFAULT '',
      modello VARCHAR(300) NOT NULL DEFAULT '',
      listino_id INT NULL,
      prezzo_base DECIMAL(10,2) NOT NULL DEFAULT 0,
      unita VARCHAR(30) NOT NULL DEFAULT 'pz',
      colore VARCHAR(100) NOT NULL DEFAULT '',
      tipo_vetro VARCHAR(100) NOT NULL DEFAULT '',
      accessori TEXT NULL,
      altezza_cm DECIMAL(7,2) NOT NULL DEFAULT 0,
      larghezza_cm DECIMAL(7,2) NOT NULL DEFAULT 0,
      n_ante INT NOT NULL DEFAULT 1,
      quantita INT NOT NULL DEFAULT 1,
      prezzo_totale DECIMAL(10,2) NOT NULL DEFAULT 0,
      prezzo_pre_sconto DECIMAL(10,2) NOT NULL DEFAULT 0,
      prezzo_scontato DECIMAL(10,2) NOT NULL DEFAULT 0,
      note TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)

    await db.execute(`ALTER TABLE preventivi ADD COLUMN creato_da VARCHAR(100) NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE preventivi ADD COLUMN sconto_cliente_pct DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE preventivo_articoli ADD COLUMN sconto_articolo_pct DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE preventivo_articoli ADD COLUMN parent_id INT NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE preventivo_articoli ADD COLUMN prezzo_pre_sconto DECIMAL(10,2) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE preventivo_articoli ADD COLUMN prezzo_scontato DECIMAL(10,2) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN sconto_articolo DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN costante DECIMAL(10,4) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE clienti ADD COLUMN sconto_pct DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
    await db.execute(`ALTER TABLE users ADD COLUMN cliente_id INT NULL DEFAULT NULL`).catch(() => {})
    await db.execute(`ALTER TABLE clienti ADD COLUMN utente_id INT NULL DEFAULT NULL`).catch(() => {})

    const [uRows] = await db.query('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]) as [{ cliente_id: number | null }[], unknown]
    const clienteId = uRows[0]?.cliente_id ?? null

    const today = new Date().toISOString().slice(0, 10)
    const [res] = await db.execute(
      "INSERT INTO preventivi (numero, descrizione, stato, importo, data, validita_giorni, cliente_id, creato_da) VALUES ('','Carrello','bozza',0,?,30,?,?)",
      [today, clienteId, username]
    ) as [{ insertId: number }, unknown]
    const preventivoId = res.insertId
    const dateStr = today.replace(/-/g, '')
    await db.execute('UPDATE preventivi SET numero = ? WHERE id = ?', [`${dateStr}-${String(preventivoId).padStart(6, '0')}`, preventivoId])

    const uidToInsertId   = new Map<number, number>()
    const prezziPerUid    = new Map<number, number>()  // prezzo_scontato per uid
    const prezziPrePerUid = new Map<number, number>()  // prezzo_pre_sconto per uid
    const costantiPerUid  = new Map<number, number>()  // costante listino del padre per uid

    for (const item of cart) {
      if (item.tipo === 'caratteristica' || item.id === 0) continue
      const [rows] = await db.query(
        'SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita, sconto_articolo, costante, minimo FROM listini WHERE id = ? LIMIT 1',
        [item.id]
      ) as [{ id: number; categoria: string; produttore: string; descrizione: string; unita: string; prezzo_vendita: number; sconto_articolo: number; costante: number; minimo: number | null }[], unknown]
      const art = rows[0]
      if (!art) continue

      const pb = Number(art.prezzo_vendita)
      const scontoArticoloPct = Number(art.sconto_articolo ?? 0)
      const parentDbId = item.parent != null ? (uidToInsertId.get(item.parent) ?? null) : null
      let prezzo = 0
      let prezzoPre = 0

      if (parentDbId !== null && pb === 0 && scontoArticoloPct !== 0) {
        const prezzoParent    = prezziPerUid.get(item.parent!)    ?? 0
        const prezzoParentPre = prezziPrePerUid.get(item.parent!) ?? 0
        prezzo    = Math.round(-(prezzoParent    * scontoArticoloPct / 100) * 100) / 100
        prezzoPre = Math.round(-(prezzoParentPre * scontoArticoloPct / 100) * 100) / 100
      } else {
        const scontoFactor = 1 - scontoArticoloPct / 100
        const h  = (item.h ?? 0) / 100
        const l  = (item.l ?? 0) / 100
        const q  = item.q
        // Per i figli usa la costante del padre; per i primari costante = 1
        const costante = parentDbId !== null
          ? (costantiPerUid.get(item.parent!) || 1)
          : 1
        let prezzoLordo = 0
        if (art.unita === 'm²') {
          const minimo = Number(art.minimo ?? 0)
          const mqPerPezzo = parentDbId === null ? Math.max(h * l, minimo) : h * l
          prezzoLordo = pb * mqPerPezzo * q * costante
        } else if (art.unita === 'ml') {
          prezzoLordo = pb * l * q * costante
        } else {
          prezzoLordo = pb * q
        }
        prezzoPre = Math.round(prezzoLordo * 100) / 100
        prezzo    = Math.round(prezzoLordo * scontoFactor * 100) / 100
      }

      if (item.uid != null) prezziPerUid.set(item.uid, prezzo)
      if (item.uid != null) prezziPrePerUid.set(item.uid, prezzoPre)
      if (item.uid != null) costantiPerUid.set(item.uid, Number(art.costante) > 0 ? Number(art.costante) : 1)

      const [ins] = await db.execute(
        `INSERT INTO preventivo_articoli (preventivo_id, tipo_prodotto, marca, modello, listino_id, prezzo_base, unita, colore, tipo_vetro, accessori, altezza_cm, larghezza_cm, n_ante, quantita, prezzo_totale, note, sconto_articolo_pct, parent_id, prezzo_pre_sconto, prezzo_scontato)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [preventivoId, art.categoria, art.produttore, art.descrizione, item.id, art.prezzo_vendita, art.unita, item.colore ?? '', '', null, item.h ?? 0, item.l ?? 0, item.ante ?? 1, item.q, prezzo, item.note ?? null, scontoArticoloPct, parentDbId, prezzoPre, prezzo]
      ) as [{ insertId: number }, unknown]

      if (item.uid != null) uidToInsertId.set(item.uid, ins.insertId)
    }

    // Calcola totale con sconto cliente
    const [totRow] = await db.query(
      'SELECT COALESCE(SUM(prezzo_totale),0) AS totale FROM preventivo_articoli WHERE preventivo_id = ?',
      [preventivoId]
    ) as [{ totale: number }[], unknown]
    let scontoClientePct = 0
    if (clienteId) {
      const [cRows] = await db.query(
        'SELECT sconto_pct FROM clienti WHERE id = ? LIMIT 1', [clienteId]
      ) as [{ sconto_pct: number }[], unknown]
      scontoClientePct = Number(cRows[0]?.sconto_pct ?? 0)
    }
    const subtotale = Number(totRow[0].totale)
    const importo   = Math.round(subtotale * (1 - scontoClientePct / 100) * 100) / 100
    await db.execute('UPDATE preventivi SET importo = ?, sconto_cliente_pct = ? WHERE id = ?', [importo, scontoClientePct, preventivoId])

    cookieStore.delete('digi_cart')

    const isStaff = role === 'admin' || role === 'dipendente' || role === 'direttore'
    return { ok: true, redirectUrl: isStaff ? `/clienti/preventivi/${preventivoId}` : `/area-clienti/preventivi/${preventivoId}` }
  } finally {
    await db.end()
  }
}

export async function importaCarrello(): Promise<void> {
  await salvaCarrelloComePreventivo()
}

// ─── Caratteristiche opzionali per una categoria/produttore ──────────────────

export type OptCarItem = {
  id: number
  categoria: string
  produttore: string
  descrizione: string
  prezzo_vendita: number
  sconto_articolo: number
}

export async function fetchCaratteristicheOpt(categoria: string, produttore: string): Promise<OptCarItem[]> {
  const db = await getConnection()
  try {
    const [rows] = await db.query(
      `SELECT id, COALESCE(categoria,'') AS categoria, COALESCE(produttore,'') AS produttore,
              descrizione, prezzo_vendita, sconto_articolo
       FROM listini
       WHERE caratteristica = 1 AND disponibile = 1 AND preventivabile = 1
         AND (categoria = '' OR categoria IS NULL OR categoria = ?)
         AND (produttore = '' OR produttore IS NULL OR produttore = ?)
       ORDER BY descrizione ASC`,
      [categoria, produttore]
    )
    return rows as OptCarItem[]
  } finally {
    await db.end()
  }
}

// ─── Aggiungi articolo direttamente a un preventivo esistente ────────────────

export async function aggiungiAlPreventivoDaCatalogo(fd: FormData): Promise<CartResult> {
  const preventivoId = parseInt(fd.get('preventivo_id') as string)
  const listinoId    = parseInt(fd.get('listino_id') as string)
  const quantita     = Math.max(1, parseInt(fd.get('quantita') as string) || 1)
  const ante         = Math.max(1, parseInt(fd.get('ante') as string) || 1)
  const larghezza    = parseFloat(fd.get('larghezza') as string) || 0
  const altezza      = parseFloat(fd.get('altezza') as string) || 0
  const colore       = (fd.get('colore') as string | null)?.trim() || ''
  const note         = (fd.get('note') as string | null)?.trim() || ''

  if (!preventivoId || !listinoId) return { ok: false, error: 'Dati non validi.' }

  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!username) return { ok: false, error: 'Devi essere loggato.' }

  const isStaff = role === 'admin' || role === 'dipendente'

  const db = await getConnection()
  try {
    // Staff: verifica solo lo stato. Cliente: verifica anche la proprietà.
    let prevOk = false
    if (isStaff) {
      const [rows] = await db.query(
        "SELECT id FROM preventivi WHERE id = ? AND stato IN ('bozza','richiesto') LIMIT 1",
        [preventivoId]
      ) as [{ id: number }[], unknown]
      prevOk = !!rows[0]
    } else {
      const [rows] = await db.query(`
        SELECT p.id FROM preventivi p
        LEFT JOIN clienti c ON c.id = p.cliente_id
        JOIN users u ON u.username = ?
        WHERE p.id = ? AND p.stato IN ('bozza','richiesto')
          AND ((c.email = u.email) OR (p.creato_da = ? AND p.cliente_id IS NULL))
        LIMIT 1
      `, [username, preventivoId, username]) as [{ id: number }[], unknown]
      prevOk = !!rows[0]
    }
    if (!prevOk) return { ok: false, error: 'Preventivo non trovato o non modificabile.' }

    const [listinoRows] = await db.query(
      'SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita, sconto_articolo FROM listini WHERE id = ? LIMIT 1',
      [listinoId]
    ) as [{ id: number; categoria: string; produttore: string; descrizione: string; unita: string; prezzo_vendita: number; sconto_articolo: number }[], unknown]
    const art = listinoRows[0]
    if (!art) return { ok: false, error: 'Articolo di listino non trovato.' }

    const pb = Number(art.prezzo_vendita)
    const scontoArticoloPct = Number(art.sconto_articolo ?? 0)
    const scontoFactor = 1 - scontoArticoloPct / 100
    const h = altezza / 100
    const l = larghezza / 100
    let prezzoLordo = 0
    if (art.unita === 'm²')      prezzoLordo = pb * h * l * quantita
    else if (art.unita === 'ml') prezzoLordo = pb * l * quantita
    else                         prezzoLordo = pb * quantita
    const prezzoPre = Math.round(prezzoLordo * 100) / 100
    const prezzo    = Math.round(prezzoLordo * scontoFactor * 100) / 100

    await db.execute(
      `INSERT INTO preventivo_articoli (preventivo_id, tipo_prodotto, marca, modello, listino_id, prezzo_base, unita, colore, tipo_vetro, accessori, altezza_cm, larghezza_cm, n_ante, quantita, prezzo_totale, note, sconto_articolo_pct, prezzo_pre_sconto, prezzo_scontato)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [preventivoId, art.categoria, art.produttore, art.descrizione, listinoId, art.prezzo_vendita, art.unita, colore, '', null, altezza, larghezza, ante, quantita, prezzo, note || null, scontoArticoloPct, prezzoPre, prezzo]
    )

    const [totRow] = await db.query(
      'SELECT COALESCE(SUM(prezzo_totale),0) AS totale FROM preventivo_articoli WHERE preventivo_id = ?',
      [preventivoId]
    ) as [{ totale: number }[], unknown]
    const [prevInfo] = await db.query(
      'SELECT sconto_cliente_pct FROM preventivi WHERE id = ? LIMIT 1',
      [preventivoId]
    ) as [{ sconto_cliente_pct: number }[], unknown]
    const scontoClientePct = Number(prevInfo[0]?.sconto_cliente_pct ?? 0)
    const importo = Math.round(Number(totRow[0].totale) * (1 - scontoClientePct / 100) * 100) / 100
    await db.execute('UPDATE preventivi SET importo = ? WHERE id = ?', [importo, preventivoId])

    return { ok: true, preventivoId }
  } finally {
    await db.end()
  }
}
