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
      sconto_cliente_pct: Number(raw.sconto_cliente_pct ?? 0),
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
      prezzo_pre_sconto: Number(a.prezzo_pre_sconto ?? 0),
      sconto_articolo_pct: Number(a.sconto_articolo_pct ?? 0),
      note: a.note != null ? String(a.note) : null,
      parent_id: a.parent_id != null ? Number(a.parent_id) : null,
    }))

    await db.execute(`ALTER TABLE listini ADD COLUMN principale TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
    await db.execute(`ALTER TABLE listini ADD COLUMN caratteristica TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})

    const [listiniRows] = await db.query(`
      SELECT l.id, l.categoria, l.produttore, l.descrizione, l.unita,
             l.prezzo_vendita, l.prezzo_acquisto, l.sconto_articolo,
             l.principale, l.caratteristica,
             COALESCE(f.ragione_sociale, '') AS fornitore_nome
      FROM listini l
      LEFT JOIN fornitori f ON f.id = l.fornitore_id
      WHERE l.disponibile = 1 AND l.preventivabile = 1
      ORDER BY l.categoria, l.produttore, l.descrizione
    `) as [Record<string, unknown>[], unknown]

    const listini: ListinoItem[] = (listiniRows as Record<string, unknown>[]).map(l => ({
      id: Number(l.id),
      categoria: String(l.categoria ?? ''),
      produttore: String(l.produttore ?? ''),
      descrizione: String(l.descrizione ?? ''),
      unita: String(l.unita ?? 'pz'),
      prezzo_vendita: Number(l.prezzo_vendita),
      prezzo_acquisto: Number(l.prezzo_acquisto),
      sconto_articolo: Number(l.sconto_articolo ?? 0),
      fornitore_nome: String(l.fornitore_nome ?? ''),
      principale: Number(l.principale ?? 1),
      caratteristica: Number(l.caratteristica ?? 1),
    }))

    const [clientiRows] = await db.query(
      `SELECT id, nome, cognome, ragione_sociale FROM clienti ORDER BY ragione_sociale ASC, cognome ASC, nome ASC`
    ) as [Record<string, unknown>[], unknown]

    const clienti: ClienteOption[] = (clientiRows as Record<string, unknown>[]).map(c => ({
      id: Number(c.id),
      label: String(c.ragione_sociale || '').trim()
        || `${String(c.cognome ?? '')} ${String(c.nome ?? '')}`.trim(),
    }))

    let clienteEmail = '', clienteCellulare = ''
    if (preventivo.cliente_id) {
      const [cInfo] = await db.query('SELECT email, telefono FROM clienti WHERE id = ? LIMIT 1', [preventivo.cliente_id]) as [{ email: string; telefono: string }[], unknown]
      clienteEmail      = cInfo[0]?.email    ?? ''
      clienteCellulare  = cInfo[0]?.telefono ?? ''
    }

    return <PreventivoClient preventivo={preventivo} articoli={articoli} listini={listini} clienti={clienti} isStaff={true} clienteEmail={clienteEmail} clienteCellulare={clienteCellulare} />
  } catch {
    redirect('/clienti/preventivi')
  } finally {
    await db.end()
  }
}
