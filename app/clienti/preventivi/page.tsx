import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import { creaPreventivo } from './actions'
import EliminaBtn from './elimina-btn'
import VisibilitaBtn from './visibilita-btn'
import ApriBtnPreventivo from '../../area-clienti/preventivi/apri-btn'
import { decompressCart } from '@/lib/cart-cookie'

export const metadata: Metadata = { title: 'Preventivi Clienti' }

type Preventivo = {
  id: number
  numero: string
  cliente_id: number | null
  cliente_nome: string
  descrizione: string
  stato: 'bozza' | 'inviato' | 'accettato' | 'rifiutato' | 'scaduto'
  importo: number
  prezzo_forfait: number
  data: string
  validita_giorni: number
  note: string | null
  visibile_cliente: number
  created_at: string
}

const STATO_COLORS: Record<string, [string, string]> = {
  bozza:     ['#000', 'transparent'],
  inviato:   ['#2b6cb0', '#ebf8ff'],
  accettato: ['#276749', '#f0fff4'],
  rifiutato: ['#c00', '#fff5f5'],
  scaduto:   ['#8a6d3b', '#fffbeb'],
}

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

async function getData(): Promise<Preventivo[]> {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS preventivi (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        numero           VARCHAR(50)   NOT NULL DEFAULT '',
        cliente_id       INT           NULL,
        descrizione      TEXT          NULL,
        stato            ENUM('bozza','inviato','accettato','rifiutato','scaduto') NOT NULL DEFAULT 'bozza',
        importo          DECIMAL(10,2) NOT NULL DEFAULT 0,
        data             DATE          NOT NULL,
        validita_giorni  INT           NOT NULL DEFAULT 5,
        note             TEXT          NULL,
        visibile_cliente TINYINT(1)    NOT NULL DEFAULT 1,
        created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `)
    const [rows] = await conn.query(`
      SELECT p.*, CASE WHEN c.id IS NULL THEN '' WHEN c.ragione_sociale != '' THEN c.ragione_sociale ELSE CONCAT(TRIM(c.cognome), ' ', TRIM(c.nome)) END AS cliente_nome
      FROM preventivi p LEFT JOIN clienti c ON c.id = p.cliente_id
      ORDER BY p.data DESC, p.id DESC
    `)
    const today = new Date(); today.setHours(0,0,0,0)
    return (rows as Record<string, unknown>[]).map(r => {
      let stato = String(r.stato ?? 'bozza')
      if (!['accettato','rifiutato','annullato','scaduto'].includes(stato)) {
        const exp = new Date(r.data as string)
        exp.setDate(exp.getDate() + Number(r.validita_giorni ?? 5))
        if (exp < today) stato = 'scaduto'
      }
      return { ...r, stato, data: dateToLocal(r.data), created_at: dateToLocal(r.created_at) }
    }) as Preventivo[]
  } catch { return [] }
  finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente') redirect('/')

  const preventivi = await getData()

  const cartRaw = cookieStore.get('digi_cart')?.value ?? ''
  const cartNonVuoto = decompressCart(cartRaw).filter(i => i.parent == null).length > 0

  const thStyle: React.CSSProperties = {
    padding: '9px 14px', fontSize: 11, fontWeight: 600, color: '#888',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fafafa', borderBottom: '1px solid #e8e8e8', whiteSpace: 'nowrap',
  }
  const tdStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: 13, color: '#333',
    borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Preventivi Clienti</h2>
          <p style={{ color: '#000', fontSize: 14, margin: '4px 0 0' }}>Tutti i preventivi emessi.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <form action={creaPreventivo}>
            <button type="submit" className="btn-green"
              style={{ padding: '0 24px', fontWeight: 600 }}>
              + Nuovo preventivo
            </button>
          </form>
          {cartNonVuoto ? (
            <a href="/area-clienti/carrello-preventivo" className="btn-black">
              Vai alla simulazione →
            </a>
          ) : (
            <a href="/area-clienti/carrello-preventivo" className="btn-green"
              style={{ padding: '0 24px' }}>
              + Simula preventivo
            </a>
          )}
        </div>
      </div>

      {preventivi.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun preventivo trovato.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8 }}>
            <thead>
              <tr>
                <th style={thStyle}>N° PREVENTIVO</th>
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>Descrizione</th>
                <th style={thStyle}>Data</th>
                <th style={thStyle}>Importo</th>
                <th style={thStyle}>Validità</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Stato</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Visibile</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {preventivi.map(p => {
                const [color, bg] = STATO_COLORS[p.stato] ?? ['#666', '#f5f5f5']
                return (
                  <tr key={p.id}>
                    <td style={tdStyle}>
                      <ApriBtnPreventivo id={p.id} numero={p.numero} isStaff={true} />
                    </td>
                    <td style={tdStyle}>{p.cliente_nome || '—'}</td>
                    <td style={tdStyle}>{p.descrizione}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{p.data}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>€ {(Number(p.importo) + Number(p.prezzo_forfait ?? 0)).toFixed(2)}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{p.validita_giorni} gg</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={{ background: bg, color, padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                        {p.stato}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <VisibilitaBtn id={p.id} visibile={p.visibile_cliente === 1} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <EliminaBtn id={p.id} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
