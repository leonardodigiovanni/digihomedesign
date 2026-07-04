import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Computometrico' }

type Testata = {
  id: number
  numero: string
  cliente_nome: string
  creato_da: string | null
  descrizione: string
  stato: 'bozza' | 'calcolato' | 'archiviato'
  importo_stimato: number
  data: string
  note: string | null
  visibile_cliente: number
}

type Riga = {
  id: number
  listino_id: number | null
  categoria: string
  descrizione: string
  unita: string
  quantita: number
  prezzo_unitario: number
  totale_riga: number
  note: string | null
  ordine: number
}

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function fmt(n: number) {
  return n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const STATO_COLORS: Record<string, [string, string]> = {
  bozza:     ['#000',    'transparent'],
  calcolato: ['#276749', '#f0fff4'],
  archiviato:['#666',    '#f5f5f5'],
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!role) redirect('/')

  const { id } = await params
  const compId = parseInt(id)
  if (isNaN(compId)) redirect('/area-clienti/computometrici')

  const isStaff = role === 'admin' || role === 'dipendente'

  const db = await getConnection()
  try {
    const [tRows] = await db.query(`
      SELECT c.*,
        CASE WHEN cl.id IS NULL THEN '' WHEN cl.ragione_sociale != '' THEN cl.ragione_sociale
             ELSE CONCAT(TRIM(cl.cognome),' ',TRIM(cl.nome)) END AS cliente_nome
      FROM computometrici c
      LEFT JOIN clienti cl ON cl.id = c.cliente_id
      WHERE c.id = ?
    `, [compId]) as [Record<string, unknown>[], unknown]

    if (!tRows[0]) redirect('/area-clienti/computometrici')
    const raw = tRows[0]

    // Clienti possono vedere solo i propri
    if (!isStaff) {
      const [uRows] = await db.execute(
        'SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]
      ) as [{ cliente_id: number | null }[], unknown]
      const clienteId = uRows[0]?.cliente_id ?? null
      const ownedByClienteId = clienteId !== null && Number(raw.cliente_id) === clienteId
      const ownedByUsername  = raw.cliente_id == null && String(raw.creato_da ?? '') === username
      if (!ownedByClienteId && !ownedByUsername) redirect('/area-clienti/computometrici')
    }

    const testata: Testata = {
      id:              Number(raw.id),
      numero:          String(raw.numero ?? ''),
      cliente_nome:    String(raw.cliente_nome ?? ''),
      creato_da:       raw.creato_da ? String(raw.creato_da) : null,
      descrizione:     String(raw.descrizione ?? ''),
      stato:           (raw.stato as Testata['stato']) ?? 'bozza',
      importo_stimato: Number(raw.importo_stimato ?? 0),
      data:            dateToLocal(raw.data),
      note:            raw.note ? String(raw.note) : null,
      visibile_cliente: Number(raw.visibile_cliente ?? 1),
    }

    const [righeRows] = await db.query(`
      SELECT * FROM computometrico_articoli
      WHERE computometrico_id = ?
      ORDER BY ordine ASC, id ASC
    `, [compId]) as [Record<string, unknown>[], unknown]

    const righe: Riga[] = (righeRows as Record<string, unknown>[]).map(r => ({
      id:             Number(r.id),
      listino_id:     r.listino_id != null ? Number(r.listino_id) : null,
      categoria:      String(r.categoria ?? ''),
      descrizione:    String(r.descrizione ?? ''),
      unita:          String(r.unita ?? 'pz'),
      quantita:       Number(r.quantita ?? 0),
      prezzo_unitario: Number(r.prezzo_unitario ?? 0),
      totale_riga:    Number(r.totale_riga ?? 0),
      note:           r.note ? String(r.note) : null,
      ordine:         Number(r.ordine ?? 0),
    }))

    const totale = righe.reduce((s, r) => s + r.totale_riga, 0)

    const [statoColor, statoBg] = STATO_COLORS[testata.stato] ?? ['#666', '#f5f5f5']

    const thStyle: React.CSSProperties = {
      padding: '9px 14px', fontSize: 11, fontWeight: 700, color: '#7a6000',
      textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
      background: '#fff', borderBottom: '1px solid #c8960c', whiteSpace: 'nowrap',
    }
    const tdStyle: React.CSSProperties = {
      padding: '10px 14px', fontSize: 13, color: '#333',
      borderBottom: '1px solid #e8d870', verticalAlign: 'middle',
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 className="effetto-3d" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
              Computometrico {testata.numero || `#${testata.id}`}
            </h2>
            <p style={{ color: '#555', fontSize: 14, margin: '4px 0 0' }}>{testata.descrizione}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: statoBg, color: statoColor, padding: '4px 14px', borderRadius: 14, fontSize: 12, fontWeight: 700, border: '1px solid #ddd' }}>
              {testata.stato}
            </span>
            <a href="/area-clienti/computometrici" className="btn-gray" style={{ padding: '0 20px', height: 36, lineHeight: '36px', borderRadius: 18 }}>
              ← Elenco
            </a>
          </div>
        </div>

        {/* Scheda info */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {isStaff && testata.cliente_nome && (
            <div style={{ fontSize: 13 }}>
              <span style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', display: 'block' }}>Cliente</span>
              <span style={{ fontWeight: 600 }}>{testata.cliente_nome}</span>
            </div>
          )}
          <div style={{ fontSize: 13 }}>
            <span style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', display: 'block' }}>Data</span>
            <span>{testata.data}</span>
          </div>
          {isStaff && testata.creato_da && (
            <div style={{ fontSize: 13 }}>
              <span style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', display: 'block' }}>Creato da</span>
              <span>{testata.creato_da}</span>
            </div>
          )}
          <div style={{ fontSize: 13 }}>
            <span style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', display: 'block' }}>Totale stimato</span>
            <span style={{ fontWeight: 700, color: '#276749', fontSize: 16 }}>€ {fmt(totale)}</span>
          </div>
        </div>

        {/* Tabella righe */}
        {righe.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: 14 }}>Nessun articolo in questo computometrico.</p>
        ) : (
          <div style={{
            overflowX: 'auto', borderRadius: '8px 8px 0 0',
            border: '1px solid #c8960c',
            boxShadow: '0 4px 24px rgba(200,150,12,0.12)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Articolo</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Q.tà</th>
                  <th style={thStyle}>U.M.</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>€/u.</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Totale</th>
                  {righe.some(r => r.note) && <th style={thStyle}>Nota</th>}
                </tr>
              </thead>
              <tbody>
                {righe.map((r, i) => {
                  const isLast = i === righe.length - 1
                  const td = isLast ? { ...tdStyle, borderBottom: 'none' } : tdStyle
                  return (
                    <tr key={r.id} style={{ height: 60 }}>
                      <td style={{ ...td, color: '#aaa', fontSize: 11 }}>{i + 1}</td>
                      <td style={td}>
                        <div style={{ fontWeight: 600 }}>{r.descrizione}</div>
                        <div style={{ fontSize: 11, color: '#888' }}>{r.categoria}</div>
                      </td>
                      <td style={{ ...td, textAlign: 'right' }}>{r.quantita}</td>
                      <td style={{ ...td, color: '#888', fontSize: 12 }}>{r.unita}</td>
                      <td style={{ ...td, textAlign: 'right' }}>€ {fmt(r.prezzo_unitario)}</td>
                      <td style={{ ...td, textAlign: 'right', fontWeight: 700, color: '#276749' }}>
                        € {fmt(r.totale_riga)}
                      </td>
                      {righe.some(rr => rr.note) && (
                        <td style={{ ...td, fontSize: 12, color: '#777' }}>{r.note ?? ''}</td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Riquadro totale */}
        {righe.length > 0 && (
          <div style={{
            alignSelf: 'flex-end',
            border: '2px solid #c8960c',
            borderRadius: 10,
            padding: '14px 24px',
            background: '#fffdf2',
            minWidth: 220,
            textAlign: 'right',
          }}>
            <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Totale stimato (IVA esclusa)
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#276749' }}>
              € {fmt(totale)}
            </div>
          </div>
        )}

        {testata.note && (
          <div style={{ fontSize: 13, color: '#555', background: '#f5f5f5', borderRadius: 8, padding: '10px 14px' }}>
            <strong>Note:</strong> {testata.note}
          </div>
        )}
      </div>
    )
  } catch {
    redirect('/area-clienti/computometrici')
  } finally {
    await db.end()
  }
}
