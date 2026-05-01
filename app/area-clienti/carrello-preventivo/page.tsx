import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'
import CarrelloClient, { type ArticoloCarrello } from './carrello-client'

export const metadata: Metadata = { title: 'Carrello Preventivo' }

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

type CarrelloDB = {
  id: number
  cliente_nome: string
  creato_da: string | null
  data: string
  n_articoli: number
}

type CartItem = {
  id: number; q: number; ante?: number; l?: number; h?: number; colore?: string; note?: string
  uid?: number; parent?: number; tipo?: 'articolo' | 'caratteristica'; desc?: string
}

function normalizeCartItems(cart: CartItem[]): CartItem[] {
  let maxUid = 0
  for (const i of cart) if ((i.uid ?? 0) > maxUid) maxUid = i.uid!
  let nextUid = maxUid + 1
  return cart.map(item => item.uid != null ? item : { ...item, uid: nextUid++ })
}

async function getArticoliDaCookie(cart: CartItem[]) {
  if (cart.length === 0) return []
  const normalized = normalizeCartItems(cart)
  const artItems = normalized.filter(i => i.tipo !== 'caratteristica' && i.id !== 0)
  const ids = artItems.map(i => i.id)

  let rows: { id: number; categoria: string; produttore: string; descrizione: string; unita: string; prezzo_vendita: number }[] = []
  if (ids.length > 0) {
    const db = await getConnection()
    try {
      const ph = ids.map(() => '?').join(',')
      const [r] = await db.query(
        `SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita FROM listini WHERE id IN (${ph})`,
        ids
      ) as [typeof rows, unknown]
      rows = r
    } catch { return [] }
    finally { await db.end() }
  }

  return normalized.map((item, index) => {
    if (item.tipo === 'caratteristica' || item.id === 0) {
      return {
        index,
        listino_id: 0,
        categoria: '',
        produttore: '',
        descrizione: item.desc ?? '',
        unita: 'pz',
        prezzo_vendita: 0,
        quantita: 1,
        uid: item.uid!,
        parent: item.parent,
        tipo: 'caratteristica' as const,
        desc: item.desc,
      }
    }
    const art = rows.find(r => r.id === item.id)
    if (!art) return null
    return {
      index,
      listino_id: art.id,
      categoria: art.categoria,
      produttore: art.produttore,
      descrizione: art.descrizione,
      unita: art.unita,
      prezzo_vendita: Number(art.prezzo_vendita),
      quantita: item.q,
      ante: item.ante,
      larghezza_cm: item.l,
      altezza_cm: item.h,
      colore: item.colore,
      note: item.note,
      uid: item.uid!,
      parent: item.parent,
      tipo: 'articolo' as const,
    }
  }).filter(x => x !== null)
}

async function getCarrelliDB(): Promise<CarrelloDB[]> {
  const db = await getConnection()
  try {
    const [rows] = await db.query(`
      SELECT
        p.id,
        p.creato_da,
        p.data,
        CASE
          WHEN c.id IS NULL THEN ''
          WHEN c.ragione_sociale != '' THEN c.ragione_sociale
          ELSE CONCAT(TRIM(c.cognome), ' ', TRIM(c.nome))
        END AS cliente_nome,
        COUNT(pa.id) AS n_articoli
      FROM preventivi p
      LEFT JOIN clienti c ON c.id = p.cliente_id
      LEFT JOIN preventivo_articoli pa ON pa.preventivo_id = p.id
      WHERE p.descrizione = 'Carrello' AND p.stato = 'bozza'
      GROUP BY p.id, p.creato_da, p.data, c.id, c.ragione_sociale, c.cognome, c.nome
      ORDER BY p.id DESC
    `)
    return (rows as Record<string, unknown>[]).map(r => ({
      id: r.id as number,
      creato_da: (r.creato_da as string | null) ?? null,
      cliente_nome: (r.cliente_nome as string) ?? '',
      data: dateToLocal(r.data),
      n_articoli: Number(r.n_articoli),
    }))
  } catch { return [] }
  finally { await db.end() }
}

async function StaffView() {
  const carrelli = await getCarrelliDB()

  const th: React.CSSProperties = {
    padding: '9px 14px', fontSize: 11, fontWeight: 600, color: '#888',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fafafa', borderBottom: '1px solid #e8e8e8', whiteSpace: 'nowrap',
  }
  const td: React.CSSProperties = {
    padding: '10px 14px', fontSize: 13, color: '#333',
    borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Carrelli Preventivo</h2>
        <p style={{ color: '#000', fontSize: 14, margin: '4px 0 0' }}>
          Preventivi bozza "Carrello" creati da utenti loggati.
        </p>
      </div>

      {carrelli.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun carrello trovato.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8 }}>
            <thead>
              <tr>
                <th style={th}>N°</th>
                <th style={th}>Cliente</th>
                <th style={th}>Utente</th>
                <th style={th}>Data</th>
                <th style={{ ...th, textAlign: 'center' }}>Articoli</th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {carrelli.map(c => (
                <tr key={c.id}>
                  <td style={td}>#{c.id}</td>
                  <td style={td}>{c.cliente_nome || '—'}</td>
                  <td style={{ ...td, color: '#888' }}>{c.creato_da || '—'}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>{c.data}</td>
                  <td style={{ ...td, textAlign: 'center' }}>{c.n_articoli}</td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <a
                      href={`/clienti/preventivi/${c.id}`}
                      style={{ color: '#2b6cb0', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}
                    >
                      Apri →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default async function Page() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  const digiCart = cookieStore.get('digi_cart')?.value ?? ''

  const isStaff = role === 'admin' || role === 'dipendente' || role === 'direttore'

  // Cliente loggato senza cookie → già nei preventivi, niente da vedere qui
  if (role === 'cliente' && !digiCart) {
    redirect('/area-clienti/preventivi')
  }

  let cart: CartItem[] = []
  try { cart = digiCart ? JSON.parse(digiCart) : [] } catch {}

  const articoli = await getArticoliDaCookie(cart)
  const isLoggedIn = !!username

  // Leggi sconto cliente se loggato
  let scontoClientePct = 0
  if (username && role === 'cliente') {
    try {
      const db = await getConnection()
      const [uRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username]) as [{ email: string }[], unknown]
      const email = uRows[0]?.email ?? ''
      if (email) {
        const [cRows] = await db.query('SELECT sconto_pct FROM clienti WHERE email = ? LIMIT 1', [email]) as [{ sconto_pct: number }[], unknown]
        scontoClientePct = Number(cRows[0]?.sconto_pct ?? 0)
      }
      await db.end()
    } catch {}
  }

  return (
    <div style={{ maxWidth: 980, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 12, color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link>
        {' / '}Carrello preventivo
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 26, fontWeight: 700, marginBottom: 20 }}>
        Il tuo carrello preventivo
      </h1>
      <CarrelloClient articoli={articoli} isLoggedIn={isLoggedIn} scontoClientePct={scontoClientePct} />

      {isStaff && (
        <div style={{ marginTop: 56, borderTop: '2px solid #e8e8e8', paddingTop: 40 }}>
          <StaffView />
        </div>
      )}
    </div>
  )
}
