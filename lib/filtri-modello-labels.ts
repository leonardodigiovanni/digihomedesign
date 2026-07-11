// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function ensureFiltriModelloLabelsTable(db: any) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS filtri_modello_labels (
      n     INT PRIMARY KEY,
      label VARCHAR(50) NOT NULL DEFAULT ''
    )
  `)
}

function defaults(): Record<number, string> {
  const d: Record<number, string> = {}
  for (let n = 1; n <= 10; n++) d[n] = `F${n}`
  return d
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getFiltriModelloLabels(db: any): Promise<Record<number, string>> {
  const labels = defaults()
  try {
    await ensureFiltriModelloLabelsTable(db)
    const [rows] = await db.query(`SELECT n, label FROM filtri_modello_labels`)
    for (const r of rows as { n: number; label: string }[]) {
      if (r.label) labels[r.n] = r.label
    }
  } catch {}
  return labels
}
