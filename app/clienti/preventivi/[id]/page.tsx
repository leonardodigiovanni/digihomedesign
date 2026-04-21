import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import PreventivoClient, { type Articolo, type ListinoItem, type Preventivo, type ClienteOption } from './preventivo-client'

export const metadata: Metadata = { title: 'Dettaglio Preventivo' }

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente') redirect('/')

  const { id } = await params
  const prevId = parseInt(id)
  if (isNaN(prevId)) redirect('/clienti/preventivi')

  const db = await getConnection()
  try {
    const [prevRows] = await db.query(
      'SELECT * FROM preventivi WHERE id = ?',
      [prevId]
    ) as [Record<string, unknown>[], unknown]

    if (!prevRows[0]) redirect('/clienti/preventivi')
    const raw = prevRows[0]
    const preventivo: Preventivo = {
      id: Number(raw.id),
      numero: String(raw.numero ?? ''),
      cliente_id: raw.cliente_id != null ? Number(raw.cliente_id) : null,
      descrizione: String(raw.descrizione ?? ''),
      stato: (raw.stato as Preventivo['stato']) ?? 'bozza',
      importo: Number(raw.importo),
      data: dateToLocal(raw.data),
      validita_giorni: Number(raw.validita_giorni),
      note: raw.note != null ? String(raw.note) : null,
      visibile_cliente: Number(raw.visibile_cliente),
    }

    const [artRows] = await db.query(
      'SELECT * FROM preventivo_articoli WHERE preventivo_id = ? ORDER BY id ASC',
      [prevId]
    ) as [Record<string, unknown>[], unknown]

    const articoli: Articolo[] = (artRows as Record<string, unknown>[]).map(a => ({
      id: Number(a.id),
      preventivo_id: Number(a.preventivo_id),
      tipo_prodotto: String(a.tipo_prodotto ?? ''),
      marca: String(a.marca ?? ''),
      modello: String(a.modello ?? ''),
      listino_id: a.listino_id != null ? Number(a.listino_id) : null,
      prezzo_base: Number(a.prezzo_base),
      unita: String(a.unita ?? 'pz'),
      colore: String(a.colore ?? ''),
      tipo_vetro: String(a.tipo_vetro ?? ''),
      accessori: String(a.accessori ?? ''),
      altezza_cm: Number(a.altezza_cm),
      larghezza_cm: Number(a.larghezza_cm),
      n_ante: Number(a.n_ante),
      quantita: Number(a.quantita),
      prezzo_totale: Number(a.prezzo_totale),
      note: a.note != null ? String(a.note) : null,
    }))

    const [listiniRows] = await db.query(
      'SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita FROM listini WHERE disponibile = 1 AND preventivabile = 1 ORDER BY categoria, produttore, descrizione'
    ) as [Record<string, unknown>[], unknown]

    const listini: ListinoItem[] = (listiniRows as Record<string, unknown>[]).map(l => ({
      id: Number(l.id),
      categoria: String(l.categoria ?? ''),
      produttore: String(l.produttore ?? ''),
      descrizione: String(l.descrizione ?? ''),
      unita: String(l.unita ?? 'pz'),
      prezzo_vendita: Number(l.prezzo_vendita),
    }))

    const [clientiRows] = await db.query(
      `SELECT id, nome, cognome, ragione_sociale FROM clienti ORDER BY ragione_sociale ASC, cognome ASC, nome ASC`
    ) as [Record<string, unknown>[], unknown]

    const clienti: ClienteOption[] = (clientiRows as Record<string, unknown>[]).map(c => ({
      id: Number(c.id),
      label: String(c.ragione_sociale || '').trim()
        || `${String(c.cognome ?? '')} ${String(c.nome ?? '')}`.trim(),
    }))

    return <PreventivoClient preventivo={preventivo} articoli={articoli} listini={listini} clienti={clienti} />
  } catch {
    redirect('/clienti/preventivi')
  } finally {
    await db.end()
  }
}
