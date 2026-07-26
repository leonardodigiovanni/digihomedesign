import { del } from '@vercel/blob'

// Immagini associate a categorie/sottocategorie di shop_percorsi, promo_percorsi
// e catalogo_voci_percorsi. Due concetti distinti, in tabelle separate:
//
// - "immagine categoria": UNA per ogni valore distinct di categoria (usata sul
//   riquadro di primo livello, es. la tile "Inverno" su /shop) — tabella
//   `categoria_immagini_<tipo>_cat`, chiave = categoria.
// - "immagine sottocategoria": UNA per ogni coppia categoria/sottocategoria
//   (usata sul riquadro di secondo livello, es. la tile "Divani" su
//   /shop/inverno, o "Generale" per i cataloghi senza sottocategoria) —
//   tabella `categoria_immagini_<tipo>_sub`, chiave = (categoria, sottocategoria).
//
// Tenerle separate (invece di due colonne sulla stessa riga-coppia) evita che
// più coppie con la stessa categoria (es. inverno/divani e inverno/xxx)
// finiscano ciascuna con una propria copia — indipendente e potenzialmente in
// conflitto — dell'immagine di categoria, quando in realtà ne esiste una sola
// per "Inverno".
//
// Le righe qui sono "satelliti" delle tabelle sorgente: se una categoria o una
// coppia sparisce dalla tabella sorgente, la riga corrispondente va ripulita
// insieme al blob associato — vedi pulisciImmaginiOrfane().

export type TipoCategoriaImmagini = 'shop' | 'promo' | 'cataloghi'
export type TipoConSottocategoria = 'shop' | 'promo' | 'cataloghi'
export type SlotImmagine = 'categoria' | 'sottocategoria'

const SOURCE_TABLE: Record<TipoCategoriaImmagini, string> = {
  shop: 'shop_percorsi',
  promo: 'promo_percorsi',
  cataloghi: 'catalogo_voci_percorsi',
}

const CAT_TABLE: Record<TipoCategoriaImmagini, string> = {
  shop: 'categoria_immagini_shop_cat',
  promo: 'categoria_immagini_promo_cat',
  cataloghi: 'categoria_immagini_cataloghi_cat',
}

const SUB_TABLE: Record<TipoConSottocategoria, string> = {
  shop: 'categoria_immagini_shop_sub',
  promo: 'categoria_immagini_promo_sub',
  cataloghi: 'categoria_immagini_cataloghi_sub',
}

export type CategoriaImmagine = { categoria: string; immagine_url: string | null }
export type SottocategoriaImmagine = { categoria: string; sottocategoria: string; immagine_url: string | null }

// ─── Setup tabelle — idempotente ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function ensureCategoriaImmaginiTables(db: any): Promise<void> {
  for (const tabella of Object.values(CAT_TABLE)) {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ${tabella} (
        categoria    VARCHAR(100) NOT NULL PRIMARY KEY,
        immagine_url VARCHAR(500) NULL
      )
    `)
  }
  for (const tabella of Object.values(SUB_TABLE)) {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ${tabella} (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        categoria      VARCHAR(100) NOT NULL DEFAULT '',
        sottocategoria VARCHAR(100) NOT NULL DEFAULT '',
        immagine_url   VARCHAR(500) NULL,
        UNIQUE KEY uq_coppia (categoria, sottocategoria)
      )
    `)
  }
}

// ─── Pulizia orfane ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function pulisciImmaginiOrfane(db: any): Promise<void> {
  for (const tipo of Object.keys(CAT_TABLE) as TipoCategoriaImmagini[]) {
    const src = SOURCE_TABLE[tipo]
    const tab = CAT_TABLE[tipo]
    const [orfane] = await db.query(`
      SELECT ci.categoria, ci.immagine_url FROM ${tab} ci
      WHERE NOT EXISTS (SELECT 1 FROM ${src} s WHERE s.categoria = ci.categoria)
    `)
    for (const row of orfane as { categoria: string; immagine_url: string | null }[]) {
      if (row.immagine_url?.startsWith('https://')) await del(row.immagine_url).catch(() => {})
      await db.execute(`DELETE FROM ${tab} WHERE categoria = ?`, [row.categoria])
    }
  }
  for (const tipo of Object.keys(SUB_TABLE) as TipoConSottocategoria[]) {
    const src = SOURCE_TABLE[tipo]
    const tab = SUB_TABLE[tipo]
    const [orfane] = await db.query(`
      SELECT ci.id, ci.immagine_url FROM ${tab} ci
      WHERE NOT EXISTS (SELECT 1 FROM ${src} s WHERE s.categoria = ci.categoria AND s.sottocategoria = ci.sottocategoria)
    `)
    for (const row of orfane as { id: number; immagine_url: string | null }[]) {
      if (row.immagine_url?.startsWith('https://')) await del(row.immagine_url).catch(() => {})
      await db.execute(`DELETE FROM ${tab} WHERE id = ?`, [row.id])
    }
  }
}

// ─── Lettura ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCategorieConImmagine(db: any, tipo: TipoCategoriaImmagini): Promise<CategoriaImmagine[]> {
  const src = SOURCE_TABLE[tipo]
  const tab = CAT_TABLE[tipo]
  const [rows] = await db.query(`
    SELECT s.categoria, ci.immagine_url
    FROM (SELECT DISTINCT categoria FROM ${src} WHERE categoria != '') s
    LEFT JOIN ${tab} ci ON ci.categoria = s.categoria
    ORDER BY s.categoria ASC
  `)
  return (rows as { categoria: string; immagine_url: string | null }[]).map(r => ({ categoria: r.categoria, immagine_url: r.immagine_url ?? null }))
}

// includiVuota: i cataloghi ammettono sottocategoria vuota (voce "Generale" nel
// secondo livello di navigazione) — shop/promo no, restano esclusi come prima.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCoppieConImmagine(db: any, tipo: TipoConSottocategoria, includiVuota = false): Promise<SottocategoriaImmagine[]> {
  const src = SOURCE_TABLE[tipo]
  const tab = SUB_TABLE[tipo]
  const [rows] = await db.query(`
    SELECT s.categoria, s.sottocategoria, ci.immagine_url
    FROM (SELECT DISTINCT categoria, sottocategoria FROM ${src} WHERE categoria != '' ${includiVuota ? '' : "AND sottocategoria != ''"}) s
    LEFT JOIN ${tab} ci ON ci.categoria = s.categoria AND ci.sottocategoria = s.sottocategoria
    ORDER BY s.categoria ASC, s.sottocategoria ASC
  `)
  return (rows as { categoria: string; sottocategoria: string; immagine_url: string | null }[]).map(r => ({
    categoria: r.categoria, sottocategoria: r.sottocategoria, immagine_url: r.immagine_url ?? null,
  }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getImmagineCategoria(db: any, tipo: TipoCategoriaImmagini, categoria: string): Promise<string | null> {
  const tab = CAT_TABLE[tipo]
  const [rows] = await db.query(`SELECT immagine_url FROM ${tab} WHERE categoria = ? LIMIT 1`, [categoria])
  return (rows as { immagine_url: string | null }[])[0]?.immagine_url ?? null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getImmagineSottocategoria(db: any, tipo: TipoConSottocategoria, categoria: string, sottocategoria: string): Promise<string | null> {
  const tab = SUB_TABLE[tipo]
  const [rows] = await db.query(`SELECT immagine_url FROM ${tab} WHERE categoria = ? AND sottocategoria = ? LIMIT 1`, [categoria, sottocategoria])
  return (rows as { immagine_url: string | null }[])[0]?.immagine_url ?? null
}

// ─── Scrittura ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertImmagineCategoria(db: any, tipo: TipoCategoriaImmagini, categoria: string, url: string): Promise<void> {
  const tab = CAT_TABLE[tipo]
  await db.execute(
    `INSERT INTO ${tab} (categoria, immagine_url) VALUES (?, ?) ON DUPLICATE KEY UPDATE immagine_url = VALUES(immagine_url)`,
    [categoria, url]
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertImmagineSottocategoria(db: any, tipo: TipoConSottocategoria, categoria: string, sottocategoria: string, url: string): Promise<void> {
  const tab = SUB_TABLE[tipo]
  await db.execute(
    `INSERT INTO ${tab} (categoria, sottocategoria, immagine_url) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE immagine_url = VALUES(immagine_url)`,
    [categoria, sottocategoria, url]
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function clearImmagineCategoria(db: any, tipo: TipoCategoriaImmagini, categoria: string): Promise<void> {
  const url = await getImmagineCategoria(db, tipo, categoria)
  if (url?.startsWith('https://')) await del(url).catch(() => {})
  await db.execute(`UPDATE ${CAT_TABLE[tipo]} SET immagine_url = NULL WHERE categoria = ?`, [categoria])
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function clearImmagineSottocategoria(db: any, tipo: TipoConSottocategoria, categoria: string, sottocategoria: string): Promise<void> {
  const url = await getImmagineSottocategoria(db, tipo, categoria, sottocategoria)
  if (url?.startsWith('https://')) await del(url).catch(() => {})
  await db.execute(`UPDATE ${SUB_TABLE[tipo]} SET immagine_url = NULL WHERE categoria = ? AND sottocategoria = ?`, [categoria, sottocategoria])
}
