export type PercorsoEntry = { categoria: string; sottocategoria: string }

// Vero se un listino A (es. una caratteristica/voce) e un listino B (es. l'articolo
// padre a cui viene agganciata) condividono un percorso compatibile: stessa categoria,
// e la sottocategoria di A è vuota (jolly, va bene con qualunque sottocategoria di B)
// oppure combacia esattamente con quella di B. Se uno dei due non ha percorsi assegnati,
// ripiega sul confronto diretto delle categorie passate (stessa convenzione della COALESCE
// lato SQL). Usata per abbinare caratteristiche/voci al loro articolo/ambiente padre.
export function matchesPercorsi(
  aId: number, aCat: string,
  bId: number, bCat: string,
  map: Record<number, PercorsoEntry[]>
): boolean {
  const ap = map[aId] ?? []
  const bp = map[bId] ?? []
  if (!ap.length || !bp.length) return aCat === bCat
  return ap.some(a =>
    bp.some(b =>
      a.categoria === b.categoria &&
      (!a.sottocategoria || a.sottocategoria === b.sottocategoria)
    )
  )
}

// Percorsi reali di un listino; se non ne ha nessuno in listini_percorsi
// (mai assegnato), ricade sulla coppia categoria/sottocategoria singola
// gia' presente sulla riga (stesso fallback della COALESCE lato SQL).
function percorsiDi(
  listinoId: number,
  fallback: PercorsoEntry,
  map: Record<number, PercorsoEntry[]>
): PercorsoEntry[] {
  const rows = map[listinoId]
  return rows && rows.length > 0 ? rows : [fallback]
}

// Un listino puo' avere piu' percorsi (es. condiviso da piu' categorie):
// vero se ALMENO UNO dei suoi percorsi combacia col filtro richiesto.
export function hasPercorso(
  listinoId: number,
  filtro: { categoria?: string; sottocategoria?: string },
  fallback: PercorsoEntry,
  map: Record<number, PercorsoEntry[]>
): boolean {
  return percorsiDi(listinoId, fallback, map).some(p =>
    (!filtro.categoria || p.categoria === filtro.categoria) &&
    (!filtro.sottocategoria || p.sottocategoria === filtro.sottocategoria)
  )
}

// Valori (categoria o sottocategoria) presenti nei percorsi di un listino,
// eventualmente ristretti a una categoria specifica.
export function valoriPercorso(
  listinoId: number,
  filtro: { categoria?: string },
  campo: 'categoria' | 'sottocategoria',
  fallback: PercorsoEntry,
  map: Record<number, PercorsoEntry[]>
): string[] {
  return percorsiDi(listinoId, fallback, map)
    .filter(p => !filtro.categoria || p.categoria === filtro.categoria)
    .map(p => p[campo])
}
