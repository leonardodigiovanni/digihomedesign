import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import ShortcutStar from '@/components/shortcut-star'
import EliminaBtn from './elimina-btn'
import ClienteSelector, { type ClienteOption } from './cliente-selector'
import ApriBtnComputometrico from '@/app/area-clienti/computometrici/apri-btn'

export const metadata: Metadata = { title: 'Computi Metrici Clienti' }

type Computometrico = {
  id: number
  numero: string
  cliente_id: number | null
  cliente_nome: string
  creato_da: string | null
  descrizione: string
  stato: 'bozza' | 'calcolato' | 'archiviato'
  importo_stimato: number
  data: string
  visibile_cliente: number
}

const STATO_COLORS: Record<string, [string, string]> = {
  bozza:     ['#000',    'transparent'],
  calcolato: ['#276749', '#f0fff4'],
  archiviato:['#666',    '#f5f5f5'],
}

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

async function getData(): Promise<Computometrico[]> {
  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS computometrici (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        numero           VARCHAR(50)   NOT NULL DEFAULT '',
        cliente_id       INT           NULL,
        creato_da        VARCHAR(100)  NULL DEFAULT NULL,
        descrizione      TEXT          NULL,
        stato            ENUM('bozza','calcolato','archiviato') NOT NULL DEFAULT 'bozza',
        importo_stimato  DECIMAL(12,2) NOT NULL DEFAULT 0,
        data             DATE          NOT NULL,
        note             TEXT          NULL,
        visibile_cliente TINYINT(1)    NOT NULL DEFAULT 1,
        created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `)
    const [rows] = await db.query(`
      SELECT c.*,
        CASE WHEN cl.id IS NULL THEN ''
             WHEN cl.ragione_sociale != '' THEN cl.ragione_sociale
             ELSE CONCAT(TRIM(cl.cognome), ' ', TRIM(cl.nome))
        END AS cliente_nome
      FROM computometrici c
      LEFT JOIN clienti cl ON cl.id = c.cliente_id
      ORDER BY c.data DESC, c.id DESC
    `)
    return (rows as Record<string, unknown>[]).map(r => ({
      id:              Number(r.id),
      numero:          String(r.numero ?? ''),
      cliente_id:      r.cliente_id != null ? Number(r.cliente_id) : null,
      cliente_nome:    String(r.cliente_nome ?? ''),
      creato_da:       r.creato_da ? String(r.creato_da) : null,
      descrizione:     String(r.descrizione ?? ''),
      stato:           (r.stato as Computometrico['stato']) ?? 'bozza',
      importo_stimato: Number(r.importo_stimato ?? 0),
      data:            dateToLocal(r.data),
      visibile_cliente: Number(r.visibile_cliente ?? 1),
    }))
  } catch { return [] }
  finally { await db.end() }
}

async function getClienti(): Promise<ClienteOption[]> {
  const db = await getConnection()
  try {
    const [rows] = await db.query(
      `SELECT id, COALESCE(NULLIF(TRIM(ragione_sociale), ''), CONCAT(TRIM(cognome), ' ', TRIM(nome))) AS label FROM clienti ORDER BY label ASC`
    ) as [Record<string, unknown>[], unknown]
    return (rows as Record<string, unknown>[])
      .map(c => ({ id: Number(c.id), label: String(c.label ?? '').trim() }))
      .filter(c => c.label !== '')
  } catch { return [] }
  finally { await db.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente') redirect('/')

  const [items, clienti] = await Promise.all([getData(), getClienti()])

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
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Computi Metrici Clienti<ShortcutStar href="/clienti/computometrici" small /></h2>
          <p style={{ color: '#000', fontSize: 14, margin: '4px 0 0' }}>Tutti i computi metrici emessi.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/area-clienti/carrello-computometrico" className="btn-green" style={{ padding: '0 24px' }}>
            + Nuovo computo metrico
          </a>
        </div>
      </div>

      {items.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun computo metrico trovato.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8 }}>
            <thead>
              <tr>
                <th style={thStyle}>N°</th>
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>Creato da</th>
                <th style={thStyle}>Descrizione</th>
                <th style={thStyle}>Data</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Importo stimato</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Stato</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Visibile</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => {
                const [color, bg] = STATO_COLORS[p.stato] ?? ['#666', '#f5f5f5']
                return (
                  <tr key={p.id}>
                    <td style={tdStyle}>
                      <ApriBtnComputometrico id={p.id} numero={p.numero} />
                    </td>
                    <td style={tdStyle}>
                      <ClienteSelector computometrico_id={p.id} cliente_id={p.cliente_id} clienti={clienti} />
                    </td>
                    <td style={{ ...tdStyle, color: '#888', fontSize: 12 }}>{p.creato_da || '—'}</td>
                    <td style={tdStyle}>{p.descrizione}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{p.data}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      {p.importo_stimato > 0
                        ? `€ ${Number(p.importo_stimato).toLocaleString('it-IT', { minimumFractionDigits: 2 })}`
                        : '—'}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={{ background: bg, color, padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                        {p.stato}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontSize: 12, color: p.visibile_cliente ? '#276749' : '#c00' }}>
                      {p.visibile_cliente ? 'Sì' : 'No'}
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
