import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import { creaPreventivo } from '../../clienti/preventivi/actions'
import ApriBtnPreventivo from './apri-btn'
import { decompressCart } from '@/lib/cart-cookie'

export const metadata: Metadata = { title: 'Preventivi' }

type Preventivo = {
  id: number
  numero: string
  cliente_id: number | null
  cliente_nome: string
  descrizione: string
  stato: 'bozza' | 'inviato' | 'accettato' | 'rifiutato' | 'scaduto'
  importo: number
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

async function getData(role: string, username: string): Promise<{ preventivi: Preventivo[]; isStaff: boolean }> {
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
        validita_giorni  INT           NOT NULL DEFAULT 30,
        note             TEXT          NULL,
        visibile_cliente TINYINT(1)    NOT NULL DEFAULT 1,
        created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `)
    const [col] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'preventivi' AND COLUMN_NAME = 'creato_da'`
    ) as [{ cnt: number }[], unknown]
    if ((col[0]?.cnt ?? 0) === 0) {
      await conn.execute(`ALTER TABLE preventivi ADD COLUMN creato_da VARCHAR(100) NULL DEFAULT NULL`)
    }

    const isStaff = role === 'admin' || role === 'dipendente'
    let rows: Record<string, unknown>[]

    if (isStaff) {
      const [r] = await conn.query(`
        SELECT p.*, CASE WHEN c.id IS NULL THEN '' WHEN c.ragione_sociale != '' THEN c.ragione_sociale ELSE CONCAT(TRIM(c.cognome), ' ', TRIM(c.nome)) END AS cliente_nome
        FROM preventivi p LEFT JOIN clienti c ON c.id = p.cliente_id
        ORDER BY p.data DESC, p.id DESC
      `)
      rows = r as Record<string, unknown>[]
    } else {
      const [userRows] = await conn.execute('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]) as [{ cliente_id: number | null }[], unknown]
      const clienteId = userRows[0]?.cliente_id ?? null
      const [r] = await conn.query(`
        SELECT p.*, '' AS cliente_nome FROM preventivi p
        WHERE p.visibile_cliente = 1
          AND p.stato != 'da inviare'
          AND (
            (p.cliente_id = ?)
            OR (p.creato_da = ? AND p.cliente_id IS NULL)
          )
        ORDER BY p.data DESC, p.id DESC
      `, [clienteId, username])
      rows = r as Record<string, unknown>[]
    }

    const today = new Date(); today.setHours(0,0,0,0)
    const preventivi = rows.map(r => {
      let stato = String(r.stato ?? 'bozza')
      if (!['accettato','rifiutato','annullato','scaduto'].includes(stato)) {
        const exp = new Date(r.data as string)
        exp.setDate(exp.getDate() + Number(r.validita_giorni ?? 5))
        if (exp < today) stato = 'scaduto'
      }
      return { ...r, stato, data: dateToLocal(r.data), created_at: dateToLocal(r.created_at) }
    }) as Preventivo[]
    return { preventivi, isStaff }
  } catch { return { preventivi: [], isStaff: false } }
  finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role    = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const { preventivi, isStaff } = await getData(role, username)

  const cartRaw = cookieStore.get('digi_cart')?.value ?? ''
  const cartNonVuoto = decompressCart(cartRaw).filter(i => i.parent == null).length > 0

  const thStyle: React.CSSProperties = {
    padding: '9px 14px', fontSize: 12, fontWeight: 700, color: '#7a6000',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fff', borderBottom: '1px solid #c8960c', whiteSpace: 'nowrap',
  }
  const tdStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: 13, color: '#333',
    borderBottom: '1px solid #c8960c', verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="effetto-3d" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Preventivi</h2>
          <p style={{ color: '#000', fontSize: 14, margin: '4px 0 0' }}>
            {isStaff ? 'Tutti i preventivi emessi.' : 'I preventivi associati al tuo account.'}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {cartNonVuoto ? (
            <a href="/area-clienti/carrello-preventivo" className="btn-black"
              style={{ display: 'inline-flex', alignItems: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              Vai alla simulazione →
            </a>
          ) : (
            <a href="/area-clienti/carrello-preventivo" className="btn-green"
              style={{ display: 'inline-flex', alignItems: 'center', height: 42, padding: '0 24px', borderRadius: 21, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              + Simula preventivo
            </a>
          )}
        </div>
      </div>

      {preventivi.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun preventivo trovato.</p>
      ) : (
        <div style={{
          overflowX: 'auto', overflowY: 'hidden', borderRadius: 8, border: '1px solid #c8960c',
          boxShadow: '0 4px 24px rgba(200,150,12,0.18), inset 0 1px 0 rgba(255,250,200,0.5)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={thStyle}>N° PREVENTIVO</th>
                {isStaff && <th style={thStyle}>Cliente</th>}
                <th style={thStyle}>Descrizione</th>
                <th style={thStyle}>Data</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Importo</th>
                <th style={thStyle}>Validità</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Stato</th>
              </tr>
            </thead>
            <tbody>
              {preventivi.map((p, i) => {
                const [color, bg] = STATO_COLORS[p.stato] ?? ['#666', '#f5f5f5']
                const td = i === preventivi.length - 1 ? { ...tdStyle, borderBottom: 'none' } : tdStyle
                return (
                  <tr key={p.id} style={{ height: 80 }}>
                    <td style={td}>
                      <ApriBtnPreventivo id={p.id} numero={p.numero} isStaff={isStaff} />
                    </td>
                    {isStaff && <td style={{ ...td, maxWidth: 120, whiteSpace: 'normal', wordBreak: 'break-word' }}>{p.cliente_nome || '—'}</td>}
                    <td style={{ ...td, maxWidth: 180, whiteSpace: 'normal', wordBreak: 'break-word' }}>{p.descrizione}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{p.data}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap', textAlign: 'right' }}>€ {Number(p.importo).toFixed(2)}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{p.validita_giorni} gg</td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <span style={{ background: bg, color, padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                        {p.stato}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="IsDebug fs-11" style={{ marginTop: 8 }}>pagina revisionata</div>
    </div>
  )
}
