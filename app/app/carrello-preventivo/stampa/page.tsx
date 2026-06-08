import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import StampaProvvisorioClient from '@/app/area-clienti/carrello-preventivo/stampa/stampa-client'
import { type ArtRow, calcolaPrezzo, buildStampaData } from '@/app/area-clienti/carrello-preventivo/stampa/page'
import { decompressCart } from '@/lib/cart-cookie'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Stampa Preventivo Provvisorio' }

export default async function Page() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? ''
  const digiCart = cookieStore.get('digi_cart')?.value ?? ''

  if (!digiCart) redirect('/app/carrello-preventivo')

  const cart = decompressCart(digiCart)
  if (cart.length === 0) redirect('/app/carrello-preventivo')

  const db = await getConnection()
  let arts: ArtRow[] = []
  let clienteNome = 'N/D'
  let clienteIndirizzo = ''

  try {
    const ids = cart.map(i => i.id)
    const ph  = ids.map(() => '?').join(',')
    const [rows] = await db.query(
      `SELECT id, categoria, produttore, serie, descrizione, unita, prezzo_vendita, sconto_articolo, costante, foto_url, profilo_frontale_mm, abbr, richiede_tipo_colore, richiede_tipo_colore_acc, richiede_tipo_vetro, richiede_tipo_montaggio, trasmittanza_uw, minimo FROM listini WHERE id IN (${ph})`,
      ids
    ) as [{ id: number; categoria: string; produttore: string; serie: string; descrizione: string; unita: string; prezzo_vendita: number; sconto_articolo: number; costante: number; foto_url: string | null; profilo_frontale_mm: number | null; abbr: string | null; richiede_tipo_colore: number | null; richiede_tipo_colore_acc: number | null; richiede_tipo_vetro: number | null; richiede_tipo_montaggio: number | null; minimo: number | null; trasmittanza_uw: number | null }[], unknown]

    let rootIdx = 0
    arts = cart.map((item) => {
      const r = rows.find(x => x.id === item.id)
      if (!r) return null
      const isRoot = item.parent == null
      return {
        idx: isRoot ? rootIdx++ : 0,
        uid: item.uid,
        parent_uid: item.parent,
        categoria: r.categoria,
        produttore: r.produttore,
        serie: r.serie ?? '',
        descrizione: r.descrizione,
        unita: r.unita,
        prezzo_vendita: Number(r.prezzo_vendita),
        sconto_articolo: Number(r.sconto_articolo ?? 0),
        costante: Number(r.costante ?? 0),
        quantita: item.q,
        larghezza_cm: item.l ?? 0,
        altezza_cm: item.h ?? 0,
        foto_url: r.foto_url ?? '',
        profilo_mm: Number(r.profilo_frontale_mm ?? 0),
        abbr: r.abbr ?? '',
        richiede_tipo_colore:     Number(r.richiede_tipo_colore     ?? 0),
        richiede_tipo_colore_acc: Number(r.richiede_tipo_colore_acc ?? 0),
        richiede_tipo_vetro:      Number(r.richiede_tipo_vetro      ?? 0),
        richiede_tipo_montaggio:  Number(r.richiede_tipo_montaggio  ?? 0),
        minimo: r.minimo != null ? Number(r.minimo) : null,
        trasmittanza_uw: r.trasmittanza_uw != null ? Number(r.trasmittanza_uw) : null,
      }
    }).filter(x => x !== null) as ArtRow[]

    if (username) {
      const [uRows] = await db.query(
        'SELECT email FROM users WHERE username = ? LIMIT 1', [username]
      ) as [{ email: string }[], unknown]
      const email = uRows[0]?.email ?? ''
      if (email) {
        const [cRows] = await db.query(
          'SELECT nome, cognome, ragione_sociale, indirizzo FROM clienti WHERE email = ? LIMIT 1', [email]
        ) as [{ nome: string; cognome: string; ragione_sociale: string; indirizzo: string }[], unknown]
        if (cRows[0]) {
          const c = cRows[0]
          clienteNome = String(c.ragione_sociale || '').trim() || `${String(c.cognome ?? '')} ${String(c.nome ?? '')}`.trim() || username
          clienteIndirizzo = String(c.indirizzo || '').trim()
        } else {
          clienteNome = username
        }
      } else {
        clienteNome = username
      }
    }
  } finally {
    await db.end()
  }

  if (arts.length === 0) redirect('/app/carrello-preventivo')

  const today  = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
  const totale = arts.reduce((s, a) => s + calcolaPrezzo(a, arts), 0).toFixed(2)
  const now    = new Date()
  const numero = `PP-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`

  const stampaData = await buildStampaData({ arts, totale, data: today, numero, clienteNome, clienteIndirizzo })

  return <StampaProvvisorioClient data={stampaData} tornaHref="/app/carrello-preventivo" />
}
