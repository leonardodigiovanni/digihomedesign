import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { hasPageAccess } from '@/lib/permissions'
import { readSettings } from '@/lib/settings'
import { getConnection } from '@/lib/db'
import OrdiniStaffClient from './ordini-staff-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Ordini' }

type OrdineCliente = {
  id: number; numero: string; tipo: 'preventivo' | 'acquisto'
  cliente_id: number | null; cliente_nome: string | null
  data_ordine: string; descrizione?: string; importo_totale: number
  visibile_cliente: number; created_at: string
}

async function getClienti(): Promise<Array<{ id: number; nome: string }>> {
  const conn = await getConnection()
  try {
    const [rows] = await conn.query(
      `SELECT id, COALESCE(
        NULLIF(ragione_sociale,''),
        CONCAT(COALESCE(nome,''), ' ', COALESCE(cognome,'')),
        CONCAT('Cliente ',id)
      ) AS nome FROM clienti ORDER BY nome ASC`
    ) as [Array<{ id: number; nome: string }>, unknown]
    return rows
  } catch { return [] }
  finally { await conn.end() }
}

async function getOrdini(): Promise<OrdineCliente[]> {
  const conn = await getConnection()
  try {
    // Ensure table has visibile_cliente column
    try { await conn.execute('ALTER TABLE ordini_clienti ADD COLUMN visibile_cliente TINYINT(1) NOT NULL DEFAULT 1') } catch {}

    const [rows] = await conn.query(
      `SELECT o.id, o.numero, o.tipo, o.cliente_id,
              COALESCE(
                NULLIF(c.ragione_sociale,''),
                CONCAT(COALESCE(c.nome,''), ' ', COALESCE(c.cognome,'')),
                CONCAT('Cliente ', o.cliente_id)
              ) AS cliente_nome,
              DATE_FORMAT(o.data_ordine,'%Y-%m-%d') AS data_ordine,
              o.importo_totale, o.visibile_cliente,
              DATE_FORMAT(o.created_at,'%Y-%m-%d') AS created_at
       FROM ordini_clienti o
       LEFT JOIN clienti c ON c.id = o.cliente_id
       ORDER BY o.created_at DESC`
    ) as [OrdineCliente[], unknown]
    return rows
  } catch { return [] }
  finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = await readSettings()
  if (!hasPageAccess(role, 35, settings)) redirect('/')

  const [ordini, clienti] = await Promise.all([getOrdini(), getClienti()])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Ordini</h2>
        <p style={{ color: '#555', fontSize: 14, margin: '4px 0 0' }}>
          Gestione ordini clienti — preventivi accettati e acquisti completati.
        </p>
      </div>

      <OrdiniStaffClient ordini={ordini} clienti={clienti} />
    </div>
  )
}
