import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import ApriBtnPreventivo from './apri-btn'
import { creaPreventivo } from './actions'
import { decompressCart } from '@/lib/cart-cookie'

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

export default async function AppPreventivoPage() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!username) redirect('/app/login')

  const { preventivi, isStaff } = await getData(role, username)

  const cartRaw = cookieStore.get('digi_cart')?.value ?? ''
  const cartNonVuoto = decompressCart(cartRaw).filter(i => i.parent == null).length > 0

  const brushed = 'repeating-linear-gradient(90deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 3px),linear-gradient(160deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)'
  const thStyle: React.CSSProperties = {
    padding: '9px 14px', fontSize: 14, fontWeight: 700, color: '#1a1a1a',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    borderBottom: '1px solid #333', whiteSpace: 'nowrap',
  }
  const tdStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: 14, color: '#333',
    borderBottom: '1px solid #333', verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 3 }}>
      <div style={{ background: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 3px),linear-gradient(160deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)', border: '1px solid #222', borderRadius: 12, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.5)' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' }}>Preventivi</p>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: 0 }}>{isStaff ? 'Tutti i preventivi emessi.' : 'I preventivi associati al tuo account.'}</p>
      </div>
      <div style={{ background: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 3px),linear-gradient(160deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)', border: '1px solid #222', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {isStaff && (
          <form action={creaPreventivo}>
            <button type="submit" className="btn-green"
              style={{ height: 42, padding: '0 24px', borderRadius: 21, fontSize: 14, fontWeight: 700 }}>
              + Nuovo preventivo
            </button>
          </form>
        )}
        {cartNonVuoto ? (
          <a href="/app/carrello-preventivo" className="btn-black"
            style={{ display: 'inline-flex', alignItems: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
            Vai alla simulazione →
          </a>
        ) : (
          <a href="/app/carrello-preventivo" className="btn-green"
            style={{ display: 'inline-flex', alignItems: 'center', height: 42, padding: '0 24px', borderRadius: 21, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
            + Simula preventivo
          </a>
        )}
      </div>

      {preventivi.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun preventivo trovato.</p>
      ) : (
        <div style={{
          overflowX: 'auto', overflowY: 'hidden', borderRadius: 8, border: '1px solid #222',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: brushed }}>
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
                  <tr key={p.id} style={{ height: 84, background: brushed }}>
                    <td style={td}>
                      <ApriBtnPreventivo id={p.id} numero={p.numero} />
                    </td>
                    {isStaff && <td style={{ ...td, maxWidth: 120, whiteSpace: 'normal', wordBreak: 'break-word' }}>{p.cliente_nome || '—'}</td>}
                    <td style={{ ...td, maxWidth: 180, whiteSpace: 'normal', wordBreak: 'break-word' }}>{p.descrizione}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{p.data}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap', textAlign: 'right' }}>€ {Number(p.importo).toFixed(2)}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{p.validita_giorni} gg</td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <span style={{ background: bg, color, padding: '2px 10px', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
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
    </div>
  )
}

