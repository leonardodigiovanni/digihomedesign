import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import PreventivoClient, { type Articolo, type ListinoItem, type Preventivo } from '../../../clienti/preventivi/[id]/preventivo-client'

export const metadata: Metadata = { title: 'Preventivo' }

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const { id } = await params
  const prevId = parseInt(id)
  if (isNaN(prevId)) redirect('/area-clienti/preventivi')

  const isStaff = role === 'admin' || role === 'dipendente'

  const db = await getConnection()
  try {
    const [prevRows] = await db.query(
      'SELECT * FROM preventivi WHERE id = ?', [prevId]
    ) as [Record<string, unknown>[], unknown]

    if (!prevRows[0]) redirect('/area-clienti/preventivi')
    const raw = prevRows[0]

    // Clienti possono vedere solo i propri preventivi
    if (!isStaff) {
      const [uRows] = await db.query(
        'SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]
      ) as [{ cliente_id: number | null }[], unknown]
      const clienteId = uRows[0]?.cliente_id ?? null
      const ownedByClienteId = clienteId !== null && Number(raw.cliente_id) === clienteId
      const ownedByUsername  = raw.cliente_id == null && String(raw.creato_da ?? '') === username
      if (!ownedByClienteId && !ownedByUsername) redirect('/area-clienti/preventivi')
    }

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

    // Check scaduto automatico
    if (preventivo.stato === 'inviato') {
      const dataPreventivo = new Date(preventivo.data)
      const scadenzaMs = dataPreventivo.getTime() + preventivo.validita_giorni * 24 * 60 * 60 * 1000
      const oggi = new Date(); oggi.setHours(0, 0, 0, 0)
      if (scadenzaMs < oggi.getTime()) {
        await db.execute('UPDATE preventivi SET stato = ? WHERE id = ?', ['scaduto', prevId])
        preventivo.stato = 'scaduto'
      }
    }

    const [artRows] = await db.query(
      'SELECT * FROM preventivo_articoli WHERE preventivo_id = ? ORDER BY id ASC', [prevId]
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

    const [listiniRows] = await db.query(`
      SELECT l.id, l.categoria, l.produttore, l.descrizione, l.unita,
             l.prezzo_vendita, l.prezzo_acquisto, l.sconto_articolo,
             COALESCE(f.ragione_sociale, '') AS fornitore_nome
      FROM listini l
      LEFT JOIN fornitori f ON f.id = l.fornitore_id
      WHERE l.disponibile = 1 AND l.preventivabile = 1
      ORDER BY l.categoria, l.produttore, l.descrizione
    `) as [Record<string, unknown>[], unknown]

    type RawListino = { id: number; categoria: string; produttore: string; descrizione: string; unita: string; prezzo_vendita: number; prezzo_acquisto: number; sconto_articolo: number; fornitore_nome: string }
    const allListini: RawListino[] = (listiniRows as Record<string, unknown>[]).map(l => ({
      id: Number(l.id),
      categoria: String(l.categoria ?? ''),
      produttore: String(l.produttore ?? ''),
      descrizione: String(l.descrizione ?? ''),
      unita: String(l.unita ?? 'pz'),
      prezzo_vendita: Number(l.prezzo_vendita),
      prezzo_acquisto: Number(l.prezzo_acquisto),
      sconto_articolo: Number(l.sconto_articolo ?? 0),
      fornitore_nome: String(l.fornitore_nome ?? ''),
    }))

    let listini: ListinoItem[]
    if (isStaff) {
      listini = allListini.map(l => ({ ...l, prezzo_acquisto: l.prezzo_acquisto }))
    } else {
      // Deduplicazione: un item per (categoria+produttore+descrizione), best margin
      const best = new Map<string, RawListino>()
      for (const l of allListini) {
        const key = `${l.categoria}||${l.produttore}||${l.descrizione}`
        const cur = best.get(key)
        if (!cur || (l.prezzo_vendita - l.prezzo_acquisto) > (cur.prezzo_vendita - cur.prezzo_acquisto)) {
          best.set(key, l)
        }
      }
      listini = [...best.values()].map(l => ({ id: l.id, categoria: l.categoria, produttore: l.produttore, descrizione: l.descrizione, unita: l.unita, prezzo_vendita: l.prezzo_vendita, sconto_articolo: l.sconto_articolo, fornitore_nome: l.fornitore_nome }))
    }

    let clienteEmail = '', clienteCellulare = ''
    {
      const [uInfo] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const userEmail = uInfo[0]?.email ?? ''
      clienteEmail = userEmail
      if (userEmail) {
        const [cInfo] = await db.query('SELECT telefono FROM clienti WHERE email = ? LIMIT 1', [userEmail]) as [{ telefono: string }[], unknown]
        clienteCellulare = cInfo[0]?.telefono ?? ''
      }
    }

    return (
      <PreventivoClient
        preventivo={preventivo}
        articoli={articoli}
        listini={listini}
        clienti={[]}
        isStaff={isStaff}
        clienteEmail={clienteEmail}
        clienteCellulare={clienteCellulare}
      />
    )
  } catch {
    redirect('/area-clienti/preventivi')
  } finally {
    await db.end()
  }
}
