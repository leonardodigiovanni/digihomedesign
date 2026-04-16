import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import OrdiniForniClient, { type OrdineFornitore } from './client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ordini Fornitori',
}

async function getOrdini(): Promise<OrdineFornitore[]> {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS ordini_fornitori (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        numero_ordine  VARCHAR(50)   NOT NULL DEFAULT '',
        fornitore      VARCHAR(255)  NOT NULL,
        descrizione    TEXT          NOT NULL,
        stato          VARCHAR(20)   NOT NULL DEFAULT 'bozza',
        totale         DECIMAL(10,2) NOT NULL DEFAULT 0,
        data_ordine    DATE          NOT NULL,
        created_by     VARCHAR(100)  NOT NULL DEFAULT '',
        created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN qta DECIMAL(10,3) NOT NULL DEFAULT 1`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN prezzo_unitario DECIMAL(10,2) NOT NULL DEFAULT 0`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN aliq_sconto DECIMAL(5,2) NOT NULL DEFAULT 0`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN aliq_iva DECIMAL(5,2) NOT NULL DEFAULT 22`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN fatturato TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN pagato TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN stato_consegna VARCHAR(30) NOT NULL DEFAULT 'non_consegnato'`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN data_consegna_stimata DATE NULL`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN data_consegna DATE NULL`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN ultimo_sollecito DATETIME NULL`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN note TEXT NULL`).catch(() => {})
    await conn.execute(`ALTER TABLE ordini_fornitori ADD COLUMN email_fornitore VARCHAR(255) NOT NULL DEFAULT ''`).catch(() => {})

    const [rows] = await conn.execute(
      `SELECT o.id, o.numero_ordine, o.fornitore, o.descrizione, o.data_ordine, o.created_by,
              o.qta, o.prezzo_unitario, o.aliq_sconto, o.aliq_iva, o.totale,
              o.fatturato, o.pagato, o.stato_consegna,
              o.data_consegna_stimata, o.data_consegna, o.ultimo_sollecito,
              o.note, o.email_fornitore,
              COALESCE(f.email, '') AS email_anagrafica,
              COALESCE(f.pec, '')   AS pec_anagrafica
       FROM ordini_fornitori o
       LEFT JOIN fornitori f ON f.ragione_sociale = o.fornitore
       ORDER BY o.data_ordine DESC, o.id DESC`
    ) as [Record<string, unknown>[], unknown]

    return rows.map(r => ({
      id:                    Number(r.id),
      numero_ordine:         String(r.numero_ordine ?? ''),
      fornitore:             String(r.fornitore ?? ''),
      descrizione:           String(r.descrizione ?? ''),
      data_ordine:           r.data_ordine instanceof Date ? r.data_ordine.toISOString().slice(0,10) : String(r.data_ordine ?? ''),
      created_by:            String(r.created_by ?? ''),
      qta:                   parseFloat(String(r.qta ?? 1)),
      prezzo_unitario:       parseFloat(String(r.prezzo_unitario ?? 0)),
      aliq_sconto:           parseFloat(String(r.aliq_sconto ?? 0)),
      aliq_iva:              parseFloat(String(r.aliq_iva ?? 22)),
      totale:                parseFloat(String(r.totale ?? 0)),
      fatturato:             Number(r.fatturato ?? 0),
      pagato:                Number(r.pagato ?? 0),
      stato_consegna:        String(r.stato_consegna ?? 'non_consegnato'),
      data_consegna_stimata: r.data_consegna_stimata instanceof Date ? r.data_consegna_stimata.toISOString().slice(0,10) : (r.data_consegna_stimata ? String(r.data_consegna_stimata) : null),
      data_consegna:         r.data_consegna instanceof Date ? r.data_consegna.toISOString().slice(0,10) : (r.data_consegna ? String(r.data_consegna) : null),
      ultimo_sollecito:      r.ultimo_sollecito instanceof Date ? r.ultimo_sollecito.toISOString() : (r.ultimo_sollecito ? String(r.ultimo_sollecito) : null),
      note:                  r.note ? String(r.note) : null,
      email_fornitore:       String(r.email_fornitore ?? ''),
      email_anagrafica:      String(r.email_anagrafica ?? ''),
      pec_anagrafica:        String(r.pec_anagrafica ?? ''),
    })) as OrdineFornitore[]
  } finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 26, settings)) redirect('/')

  const ordini = await getOrdini()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Ordini a Fornitori</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Gestione ordini inviati ai fornitori</p>
      </div>
      <OrdiniForniClient ordini={ordini} role={role} />
    </div>
  )
}
