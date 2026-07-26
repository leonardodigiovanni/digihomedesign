import { toEcommerceSlug } from '@/lib/ecommerce'
import { ensureCategoriaImmaginiTables } from '@/lib/categoria-immagini'

// Helper condivisi per navigare shop_percorsi / promo_percorsi (stessa forma:
// listino_id, categoria, sottocategoria) come alberi a 2 livelli con slug
// calcolati a runtime — usati sia da /shop/... che da /promozioni/....
// Le funzioni prendono una connessione già aperta (stessa convenzione di
// ensurePercorsiTables), così una pagina può fare più chiamate su una sola connessione.

export type Tabella = 'shop_percorsi' | 'promo_percorsi'
export type VoceCategoria = { nome: string; slug: string; numArticoli: number; immagine: string | null }

const CAT_TABLE: Record<Tabella, string> = {
  shop_percorsi: 'categoria_immagini_shop_cat',
  promo_percorsi: 'categoria_immagini_promo_cat',
}
const SUB_TABLE: Record<Tabella, string> = {
  shop_percorsi: 'categoria_immagini_shop_sub',
  promo_percorsi: 'categoria_immagini_promo_sub',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCategorieTopLevel(db: any, tabella: Tabella): Promise<VoceCategoria[]> {
  await ensureCategoriaImmaginiTables(db)
  const catTab = CAT_TABLE[tabella]
  const [rows] = await db.query(`
    SELECT t.categoria, COUNT(DISTINCT t.listino_id) AS n,
      (SELECT ci.immagine_url FROM ${catTab} ci WHERE ci.categoria = t.categoria LIMIT 1) AS immagine
    FROM ${tabella} t WHERE t.categoria != '' GROUP BY t.categoria ORDER BY t.categoria ASC
  `)
  return (rows as { categoria: string; n: number; immagine: string | null }[]).map(r => ({
    nome: r.categoria, slug: toEcommerceSlug(r.categoria), numArticoli: Number(r.n), immagine: r.immagine ?? null,
  }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function resolveCategoria(db: any, tabella: Tabella, slug: string): Promise<string | null> {
  const cats = await getCategorieTopLevel(db, tabella)
  return cats.find(c => c.slug === slug)?.nome ?? null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSottocategorie(db: any, tabella: Tabella, categoria: string): Promise<VoceCategoria[]> {
  await ensureCategoriaImmaginiTables(db)
  const subTab = SUB_TABLE[tabella]
  const [rows] = await db.query(`
    SELECT t.sottocategoria, COUNT(DISTINCT t.listino_id) AS n,
      (SELECT ci.immagine_url FROM ${subTab} ci
       WHERE ci.categoria = ? AND ci.sottocategoria = t.sottocategoria LIMIT 1) AS immagine
    FROM ${tabella} t WHERE t.categoria = ? AND t.sottocategoria != '' GROUP BY t.sottocategoria ORDER BY t.sottocategoria ASC
  `, [categoria, categoria])
  return (rows as { sottocategoria: string; n: number; immagine: string | null }[]).map(r => ({
    nome: r.sottocategoria, slug: toEcommerceSlug(r.sottocategoria), numArticoli: Number(r.n), immagine: r.immagine ?? null,
  }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function resolveSottocategoria(db: any, tabella: Tabella, categoria: string, slug: string): Promise<string | null> {
  const subs = await getSottocategorie(db, tabella, categoria)
  return subs.find(s => s.slug === slug)?.nome ?? null
}

// Vero se l'articolo ha davvero quella coppia categoria/sottocategoria tra i suoi
// percorsi (usato per dare 404 se l'URL non corrisponde a un percorso reale).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function percorsoValido(db: any, tabella: Tabella, listinoId: number, categoria: string, sottocategoria: string): Promise<boolean> {
  const [rows] = await db.query(
    `SELECT id FROM ${tabella} WHERE listino_id = ? AND categoria = ? AND sottocategoria = ? LIMIT 1`,
    [listinoId, categoria, sottocategoria]
  )
  return (rows as unknown[]).length > 0
}

// Primo percorso disponibile per un articolo (id crescente) — usato per il
// canonical SEO della pagina prodotto: si auto-aggiorna se quel percorso viene
// cancellato, perché ricalcolato a ogni richiesta.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function primoPercorso(db: any, tabella: Tabella, listinoId: number): Promise<{ categoria: string; sottocategoria: string } | null> {
  const [rows] = await db.query(
    `SELECT categoria, sottocategoria FROM ${tabella} WHERE listino_id = ? ORDER BY id ASC LIMIT 1`,
    [listinoId]
  )
  const list = rows as { categoria: string; sottocategoria: string }[]
  return list[0] ?? null
}
