import { getConnection } from '@/lib/db'

type ColSpec = { table: string; column: string }

// Per ogni prefisso di Vercel Blob, le colonne DB dove può essere salvato l'URL del file.
// Serve per contare quante volte un blob è ancora referenziato (0 = orfano, eliminabile).
const SEZIONI: Record<string, ColSpec[]> = {
  'listini/': [
    { table: 'listini', column: 'foto_url' },
    { table: 'listini', column: 'schema_url' },
    { table: 'listini', column: 'logo_url' },
  ],
  'cataloghi/': [
    { table: 'catalogo_voci', column: 'pdf_filename' },
  ],
  'cantieri/': [
    { table: 'cantieri_media', column: 'filename' },
  ],
  'documenti/': [
    { table: 'documenti_cliente', column: 'filename' },
  ],
  'marketing/': [
    { table: 'marketing', column: 'immagine' },
    { table: 'marketing', column: 'video' },
  ],
  'categoria-immagini/': [
    { table: 'categoria_immagini_shop_cat', column: 'immagine_url' },
    { table: 'categoria_immagini_promo_cat', column: 'immagine_url' },
    { table: 'categoria_immagini_cataloghi_cat', column: 'immagine_url' },
    { table: 'categoria_immagini_shop_sub', column: 'immagine_url' },
    { table: 'categoria_immagini_promo_sub', column: 'immagine_url' },
    { table: 'categoria_immagini_cataloghi_sub', column: 'immagine_url' },
  ],
}

// Conta, per ogni URL già presente su Blob sotto un prefisso, quante righe di DB lo referenziano
// (sommando su tutte le tabelle/colonne che quella sezione può usare). Una query aggregata per
// colonna invece che una per blob, per restare veloce anche con centinaia di file.
export async function mappaOccorrenzeBlob(prefix: string): Promise<Map<string, number>> {
  const mappa = new Map<string, number>()
  const cols = SEZIONI[prefix]
  if (!cols) return mappa

  const db = await getConnection()
  try {
    for (const { table, column } of cols) {
      try {
        const [rows] = await db.query(
          `SELECT ${column} AS url, COUNT(*) AS n FROM ${table} WHERE ${column} IS NOT NULL AND ${column} != '' GROUP BY ${column}`
        )
        for (const r of rows as { url: string; n: number }[]) {
          mappa.set(r.url, (mappa.get(r.url) ?? 0) + Number(r.n))
        }
      } catch { /* tabella non ancora creata */ }
    }
    return mappa
  } finally { await db.end() }
}
