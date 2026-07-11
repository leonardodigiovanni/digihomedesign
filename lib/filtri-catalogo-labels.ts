// Le 6 colonne booleane esistenti su catalogo_voci, in ordine C1..C6 — filtrano solo i PDF, mai gli articoli
export const FILTRI_CATALOGO_COLS = [
  'filtro_battente', 'filtro_scorrevole', 'filtro_taglio_termico',
  'filtro_taglio_freddo', 'filtro_economico', 'filtro_fascia_alta',
] as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function ensureFiltriCatalogoLabelsTable(db: any) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS filtri_catalogo_labels (
      n     INT PRIMARY KEY,
      label VARCHAR(50) NOT NULL DEFAULT ''
    )
  `)
}

function defaults(): Record<number, string> {
  const d: Record<number, string> = {}
  for (let n = 1; n <= 6; n++) d[n] = `C${n}`
  return d
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getFiltriCatalogoLabels(db: any): Promise<Record<number, string>> {
  const labels = defaults()
  try {
    await ensureFiltriCatalogoLabelsTable(db)
    const [rows] = await db.query(`SELECT n, label FROM filtri_catalogo_labels`)
    for (const r of rows as { n: number; label: string }[]) {
      // riga presente = valore esplicitamente salvato (anche stringa vuota va rispettata)
      labels[r.n] = r.label
    }
  } catch {}
  return labels
}
