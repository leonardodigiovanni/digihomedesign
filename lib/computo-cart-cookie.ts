// Cookie del carrello computometrico (digi_cart_computo) — stesso principio di
// lib/cart-cookie.ts (chiavi corte per stare sotto il limite dei 4KB), ma qui
// il carrello salva l'intera riga (non solo un riferimento al listino) perché
// prezzo/misure possono essere modificati dallo staff per quel singolo computo.

export const COMPUTO_CART_COOKIE = 'digi_cart_computo'

export type ComputoCartItem = {
  uid: number
  parentUid?: number
  listino_id: number
  categoria: string
  produttore: string
  serie: string
  descrizione: string
  unita: string
  quantita: number
  larghezza_cm?: number
  altezza_cm?: number
  altezza3d_cm?: number
  base_calcolo?: string | null
  colore?: string
  note?: string
  prezzo_unitario: number
  totale_riga: number
}

export function compressComputoCart(items: ComputoCartItem[]): string {
  return JSON.stringify(items.map(it => ({
    u:  it.uid,
    p:  it.parentUid,
    i:  it.listino_id,
    c:  it.categoria,
    pr: it.produttore,
    se: it.serie,
    d:  it.descrizione,
    un: it.unita,
    q:  it.quantita,
    l:  it.larghezza_cm,
    h:  it.altezza_cm,
    h3: it.altezza3d_cm,
    bc: it.base_calcolo,
    co: it.colore,
    n:  it.note,
    pu: it.prezzo_unitario,
    t:  it.totale_riga,
  })))
}

export function decompressComputoCart(raw: string): ComputoCartItem[] {
  let parsed: unknown[] = []
  try { parsed = raw ? JSON.parse(raw) : [] } catch {}
  if (!Array.isArray(parsed)) return []
  return parsed.map(x => {
    const r = x as Record<string, unknown>
    const item: ComputoCartItem = {
      uid: Number(r.u ?? 0),
      listino_id: Number(r.i ?? 0),
      categoria: String(r.c ?? ''),
      produttore: String(r.pr ?? ''),
      serie: String(r.se ?? ''),
      descrizione: String(r.d ?? ''),
      unita: String(r.un ?? 'pz'),
      quantita: Number(r.q ?? 1),
      prezzo_unitario: Number(r.pu ?? 0),
      totale_riga: Number(r.t ?? 0),
    }
    if (r.p  != null) item.parentUid    = Number(r.p)
    if (r.l  != null) item.larghezza_cm = Number(r.l)
    if (r.h  != null) item.altezza_cm   = Number(r.h)
    if (r.h3 != null) item.altezza3d_cm = Number(r.h3)
    if (r.bc != null) item.base_calcolo = String(r.bc)
    if (r.co != null) item.colore       = String(r.co)
    if (r.n  != null) item.note         = String(r.n)
    return item
  }).filter(it => it.uid > 0)
}
