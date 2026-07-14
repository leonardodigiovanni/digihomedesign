'use server'

import { getConnection } from '@/lib/db'

async function ensureTables(db: Awaited<ReturnType<typeof getConnection>>) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ordini_clienti (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      numero         VARCHAR(50)  NOT NULL DEFAULT '',
      tipo           ENUM('preventivo','acquisto') NOT NULL DEFAULT 'preventivo',
      cliente_id     INT NULL,
      data_ordine    DATE NOT NULL,
      importo_totale DECIMAL(10,2) NOT NULL DEFAULT 0,
      source_id      INT NULL,
      created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ordini_clienti_articoli (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      ordine_id      INT NOT NULL,
      parent_id      INT NULL,
      tipo_riga      ENUM('articolo','caratteristica') NOT NULL DEFAULT 'articolo',
      categoria      VARCHAR(100) NOT NULL DEFAULT '',
      produttore     VARCHAR(100) NOT NULL DEFAULT '',
      serie          VARCHAR(100) NOT NULL DEFAULT '',
      descrizione    TEXT NOT NULL,
      unita          VARCHAR(30)  NOT NULL DEFAULT 'pz',
      quantita       DECIMAL(10,2) NOT NULL DEFAULT 1,
      larghezza_cm   DECIMAL(7,2) NOT NULL DEFAULT 0,
      altezza_cm     DECIMAL(7,2) NOT NULL DEFAULT 0,
      n_ante         INT NOT NULL DEFAULT 1,
      colore         VARCHAR(100) NOT NULL DEFAULT '',
      prezzo_unit    DECIMAL(10,2) NOT NULL DEFAULT 0,
      prezzo_lordo   DECIMAL(10,2) NOT NULL DEFAULT 0,
      sconto_art_pct DECIMAL(5,2) NOT NULL DEFAULT 0,
      sconto_cli_pct DECIMAL(5,2) NOT NULL DEFAULT 0,
      totale         DECIMAL(10,2) NOT NULL DEFAULT 0,
      abbr           VARCHAR(30)   NOT NULL DEFAULT '',
      profilo_mm     DECIMAL(5,1)  NOT NULL DEFAULT 0,
      foto_url       VARCHAR(255)  NOT NULL DEFAULT '',
      bar_color      VARCHAR(20)   NULL,
      bar_color_acc  VARCHAR(20)   NULL,
      FOREIGN KEY (ordine_id) REFERENCES ordini_clienti(id) ON DELETE CASCADE
    )
  `)
  // Migrations
  try { await db.execute('ALTER TABLE ordini_clienti_articoli ADD COLUMN prezzo_lordo DECIMAL(10,2) NOT NULL DEFAULT 0') } catch {}
  try { await db.execute("ALTER TABLE ordini_clienti_articoli ADD COLUMN abbr VARCHAR(30) NOT NULL DEFAULT ''") } catch {}
  try { await db.execute('ALTER TABLE ordini_clienti_articoli ADD COLUMN profilo_mm DECIMAL(5,1) NOT NULL DEFAULT 0') } catch {}
  try { await db.execute("ALTER TABLE ordini_clienti_articoli ADD COLUMN foto_url VARCHAR(255) NOT NULL DEFAULT ''") } catch {}
  try { await db.execute('ALTER TABLE ordini_clienti_articoli ADD COLUMN bar_color VARCHAR(20) NULL') } catch {}
  try { await db.execute('ALTER TABLE ordini_clienti_articoli ADD COLUMN bar_color_acc VARCHAR(20) NULL') } catch {}
  try { await db.execute('ALTER TABLE ordini_clienti ADD COLUMN sconto_cli_pct DECIMAL(5,2) NOT NULL DEFAULT 0') } catch {}
  try { await db.execute('ALTER TABLE ordini_clienti ADD COLUMN visibile_cliente TINYINT(1) NOT NULL DEFAULT 1') } catch {}
}

export async function clonaPreventivoComeOrdine(preventivoId: number) {
  const db = await getConnection()
  try {
    console.log('[CLONE_ORDINE] Inizio clonazione preventivo:', preventivoId)
    await ensureTables(db)

    // Evita duplicati
    const [dup] = await db.query(
      "SELECT id FROM ordini_clienti WHERE tipo = 'preventivo' AND source_id = ? LIMIT 1",
      [preventivoId]
    ) as [{ id: number }[], unknown]
    if (dup[0]) {
      console.log('[CLONE_ORDINE] Ordine già exists:', dup[0].id)
      return
    }

    const [prevRows] = await db.query(
      'SELECT id, numero, cliente_id, importo, data, sconto_cliente_pct FROM preventivi WHERE id = ? LIMIT 1',
      [preventivoId]
    ) as [{ id: number; numero: string; cliente_id: number | null; importo: number; data: unknown; sconto_cliente_pct: number }[], unknown]
    if (!prevRows[0]) {
      console.log('[CLONE_ORDINE] Preventivo non trovato')
      return
    }
    const prev = prevRows[0]
    console.log('[CLONE_ORDINE] Preventivo trovato:', { numero: prev.numero, cliente_id: prev.cliente_id, importo: prev.importo })

    const [artRows] = await db.query(
      `SELECT pa.id, pa.parent_id, pa.tipo_prodotto, pa.marca, pa.modello,
              pa.unita, pa.quantita, pa.larghezza_cm, pa.altezza_cm, pa.n_ante, pa.colore,
              pa.prezzo_base, pa.sconto_articolo_pct, pa.prezzo_totale, pa.prezzo_pre_sconto,
              COALESCE(l.abbr,'') AS abbr,
              COALESCE(l.profilo_frontale_mm,0) AS profilo_mm,
              COALESCE(l.foto_url,'') AS foto_url
       FROM preventivo_articoli pa
       LEFT JOIN listini l ON l.id = pa.listino_id
       WHERE pa.preventivo_id = ?
       ORDER BY pa.id ASC`,
      [preventivoId]
    ) as [Record<string, unknown>[], unknown]

    const dataOrdine = prev.data instanceof Date
      ? prev.data.toISOString().slice(0, 10)
      : String(prev.data ?? '').slice(0, 10)

    const [res] = await db.execute(
      'INSERT INTO ordini_clienti (numero, tipo, cliente_id, data_ordine, importo_totale, sconto_cli_pct, source_id) VALUES (?,?,?,?,?,?,?)',
      [prev.numero || `#${prev.id}`, 'preventivo', prev.cliente_id, dataOrdine, Number(prev.importo), Number(prev.sconto_cliente_pct ?? 0), preventivoId]
    ) as [{ insertId: number }, unknown]
    const ordineId = res.insertId
    console.log('[CLONE_ORDINE] Ordine creato:', { ordineId, numero: prev.numero, data: dataOrdine })

    const idMap = new Map<number, number>()
    for (const art of artRows) {
      const newParentId = art.parent_id ? (idMap.get(art.parent_id as number) ?? null) : null
      const [artRes] = await db.execute(
        'INSERT INTO ordini_clienti_articoli' +
        ' (ordine_id, parent_id, tipo_riga, categoria, produttore, serie, descrizione,' +
        '  unita, quantita, larghezza_cm, altezza_cm, n_ante, colore,' +
        '  prezzo_unit, prezzo_lordo, sconto_art_pct, sconto_cli_pct, totale,' +
        '  abbr, profilo_mm, foto_url)' +
        ' VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          ordineId, newParentId,
          art.parent_id ? 'caratteristica' : 'articolo',
          String(art.tipo_prodotto ?? ''), String(art.marca ?? ''), String(art.serie ?? ''),
          String(art.modello ?? ''),
          String(art.unita ?? 'pz'),
          Number(art.quantita ?? 1),
          Number(art.larghezza_cm ?? 0), Number(art.altezza_cm ?? 0),
          Number(art.n_ante ?? 1), String(art.colore ?? ''),
          Number(art.prezzo_base ?? 0),
          Number(art.prezzo_pre_sconto ?? art.prezzo_totale ?? 0),
          Number(art.sconto_articolo_pct ?? 0),
          Number(prev.sconto_cliente_pct ?? 0),
          Number(art.prezzo_totale ?? 0),
          String(art.abbr ?? ''), Number(art.profilo_mm ?? 0),
          String(art.foto_url ?? ''),
        ]
      ) as [{ insertId: number }, unknown]
      idMap.set(art.id as number, artRes.insertId)
    }
    console.log('[CLONE_ORDINE] ✅ Clonazione completata. Articoli inseriti:', artRows.length)
  } catch (err) {
    console.error('[CLONE_ORDINE] ❌ Errore:', err instanceof Error ? err.message : String(err))
  } finally {
    await db.end()
  }
}

export async function clonaAcquistoComeOrdine(ordineAcquistoId: number) {
  const db = await getConnection()
  db.on('error', err => console.error('[clonaAcquistoComeOrdine] errore connessione MySQL:', err))
  try {
    await ensureTables(db)

    const [dup] = await db.query(
      "SELECT id FROM ordini_clienti WHERE tipo = 'acquisto' AND source_id = ? LIMIT 1",
      [ordineAcquistoId]
    ) as [{ id: number }[], unknown]
    if (dup[0]) return

    const [rows] = await db.query(
      "SELECT id, cliente_id, totale, articoli_json, DATE_FORMAT(data,'%Y-%m-%d') AS data_str FROM ordini_acquisti WHERE id = ? LIMIT 1",
      [ordineAcquistoId]
    ) as [{ id: number; cliente_id: number | null; totale: number; articoli_json: string; data_str: string }[], unknown]
    if (!rows[0]) return
    const acq = rows[0]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let articoli: any[] = []
    try { articoli = JSON.parse(acq.articoli_json) } catch {}

    const [res] = await db.execute(
      'INSERT INTO ordini_clienti (numero, tipo, cliente_id, data_ordine, importo_totale, source_id) VALUES (?,?,?,?,?,?)',
      [`ACQ-${acq.id}`, 'acquisto', acq.cliente_id, acq.data_str, Number(acq.totale), acq.id]
    ) as [{ insertId: number }, unknown]
    const ordineId = res.insertId

    for (const art of articoli) {
      await db.execute(
        `INSERT INTO ordini_clienti_articoli
         (ordine_id, tipo_riga, categoria, produttore, serie, descrizione,
          unita, quantita, larghezza_cm, altezza_cm, colore,
          prezzo_unit, prezzo_lordo, sconto_art_pct, sconto_cli_pct, totale)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          ordineId, 'articolo',
          art.categoria ?? '', art.produttore ?? '', '',
          art.descrizione ?? '',
          art.unita ?? 'pz',
          Number(art.quantita ?? 1),
          Number(art.larghezza_cm ?? 0), Number(art.altezza_cm ?? 0),
          art.colore ?? '',
          Number(art.prezzo_vendita ?? 0),
          Number(art.prezzo_pre_sconto ?? 0),
          Number(art.sconto_articolo ?? 0),
          Number(art.sconto_cliente_pct ?? 0),
          Number(art.subtotale ?? 0),
        ]
      )
    }
  } finally {
    await db.end()
  }
}
