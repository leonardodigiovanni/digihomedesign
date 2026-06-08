import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getConnection } from '@/lib/db'
import OrdineClient from './ordine-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dettaglio ordine' }

export type OrdineArticolo = {
  id: number; parent_id: number | null; tipo_riga: 'articolo' | 'caratteristica'
  categoria: string; produttore: string; serie: string; descrizione: string
  unita: string; quantita: number; larghezza_cm: number; altezza_cm: number
  n_ante: number; colore: string
  prezzo_unit: number; prezzo_lordo: number
  sconto_art_pct: number; sconto_cli_pct: number; totale: number
  abbr: string; profilo_mm: number; foto_url: string
  bar_color: string | null; bar_color_acc: string | null
}

export type OrdineInfo = {
  id: number; numero: string; tipo: 'preventivo' | 'acquisto'
  cliente_id: number | null; data_ordine: string; importo_totale: number
  sconto_cli_pct: number; created_at: string
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ordineId = parseInt(id)
  if (!ordineId) notFound()

  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const db = await getConnection()
  let ordine: OrdineInfo | null = null
  let articoli: OrdineArticolo[] = []

  try {
    // Verifica ownership per cliente
    let [rows] = await db.query(
      "SELECT id, numero, tipo, cliente_id, DATE_FORMAT(data_ordine,'%Y-%m-%d') AS data_ordine, importo_totale, sconto_cli_pct, DATE_FORMAT(created_at,'%Y-%m-%d') AS created_at FROM ordini_clienti WHERE id = ? LIMIT 1",
      [ordineId]
    ) as [OrdineInfo[], unknown]

    if (!rows[0]) { await db.end(); notFound() }
    ordine = rows[0]

    if (role === 'cliente') {
      const [uRows] = await db.query('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]) as [{ cliente_id: number | null }[], unknown]
      if (Number(ordine.cliente_id) !== uRows[0]?.cliente_id) { await db.end(); notFound() }
    }

    const [artRows] = await db.query(
      'SELECT * FROM ordini_clienti_articoli WHERE ordine_id = ? ORDER BY id ASC',
      [ordineId]
    ) as [OrdineArticolo[], unknown]
    articoli = artRows
  } catch { await db.end(); notFound() }

  await db.end()

  return <OrdineClient ordine={ordine!} articoli={articoli} />
}
