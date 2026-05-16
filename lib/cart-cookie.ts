export type CartItem = {
  id: number; q: number; ante?: number; l?: number; h?: number; colore?: string; note?: string
  uid?: number; parent?: number; tipo?: 'articolo' | 'caratteristica'; desc?: string
}

// Supporta sia il formato compresso (chiavi brevi: u,p,t,a,c,n,d)
// che il formato vecchio (chiavi lunghe) per retrocompatibilità
export function decompressCart(raw: string): CartItem[] {
  let parsed: unknown[] = []
  try { parsed = raw ? JSON.parse(raw) : [] } catch {}
  if (!Array.isArray(parsed)) return []
  return parsed.map(x => {
    const r = x as Record<string, unknown>
    const item: CartItem = { id: Number(r.id ?? 0), q: Number(r.q ?? 1) }
    const uid = r.u ?? r.uid
    if (uid    != null) item.uid    = Number(uid)
    const parent = r.p ?? r.parent
    if (parent != null) item.parent = Number(parent)
    if (r.t === 1 || r.tipo === 'articolo')       item.tipo = 'articolo'
    if (r.t === 2 || r.tipo === 'caratteristica')  item.tipo = 'caratteristica'
    const ante = r.a ?? r.ante
    if (ante != null) item.ante = Number(ante)
    if (r.l  != null) item.l = Number(r.l)
    if (r.h  != null) item.h = Number(r.h)
    const colore = (r.c ?? r.colore) as string | undefined
    if (colore) item.colore = colore
    const note = (r.n ?? r.note) as string | undefined
    if (note) item.note = note
    const desc = (r.d ?? r.desc) as string | undefined
    if (desc) item.desc = desc
    return item
  })
}
