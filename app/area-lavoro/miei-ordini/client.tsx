'use client'

import { useState } from 'react'

export type OrdineCliente = {
  id: number
  numero_ordine: string
  cliente: string
  descrizione: string
  stato: string
  totale: number
  data_ordine: string
  created_at: string
}

const STATI = ['nuovo','in_lavorazione','completato','annullato'] as const
type Stato = typeof STATI[number]

const STATO_COLORS: Record<Stato, [string,string]> = {
  nuovo:          ['#2b6cb0','#ebf8ff'],
  in_lavorazione: ['#c47c2a','#fffbeb'],
  completato:     ['#276749','#f0fff4'],
  annullato:      ['#c00','#fff5f5'],
}

const thStyle: React.CSSProperties = {
  padding: '9px 14px', fontSize: 11, fontWeight: 600, color: '#888',
  textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em',
  whiteSpace: 'nowrap', background: '#fafafa', borderBottom: '1px solid #e8e8e8',
  cursor: 'pointer', userSelect: 'none',
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('it-IT', { day:'2-digit', month:'2-digit', year:'numeric' })
}

function StatoBadge({ stato }: { stato: string }) {
  const [color, bg] = STATO_COLORS[stato as Stato] ?? ['#718096','#edf2f7']
  const label = stato.replace('_', ' ')
  return <span style={{ color, background: bg, fontWeight: 600, fontSize: 11, padding: '3px 9px', borderRadius: 10 }}>{label}</span>
}

function SortIcon({ col, sortCol, sortDir }: { col: string; sortCol: string; sortDir: 'asc'|'desc' }) {
  if (col !== sortCol) return <span style={{ color: '#ccc', marginLeft: 4 }}>↕</span>
  return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
}

type SortCol = 'numero_ordine'|'stato'|'totale'|'data_ordine'

export default function MieiOrdiniClient({ ordini }: { ordini: OrdineCliente[] }) {
  const [search, setSearch]           = useState('')
  const [statoFilter, setStatoFilter] = useState('')
  const [sortCol, setSortCol]         = useState<SortCol>('data_ordine')
  const [sortDir, setSortDir]         = useState<'asc'|'desc'>('desc')

  function handleSort(col: SortCol) {
    if (col === sortCol) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const filtered = ordini
    .filter(o => {
      const q = search.toLowerCase()
      const matchText = !q || o.numero_ordine.toLowerCase().includes(q) || o.descrizione.toLowerCase().includes(q)
      const matchStato = !statoFilter || o.stato === statoFilter
      return matchText && matchStato
    })
    .sort((a, b) => {
      const va = a[sortCol]; const vb = b[sortCol]
      if (va === vb) return 0
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const cols: { key: SortCol; label: string }[] = [
    { key: 'numero_ordine', label: 'N° Ordine' },
    { key: 'stato',         label: 'Stato' },
    { key: 'totale',        label: 'Totale (€)' },
    { key: 'data_ordine',   label: 'Data' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="Cerca numero ordine, descrizione…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
        <select value={statoFilter} onChange={e => setStatoFilter(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', background: '#fff' }}>
          <option value="">Tutti gli stati</option>
          {STATI.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
        </select>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
            Ordini{(search||statoFilter) ? ` — ${filtered.length} risultati` : ` — ${ordini.length} totali`}
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {cols.map(c => (
                  <th key={c.key} style={thStyle} onClick={() => handleSort(c.key)}>
                    {c.label} <SortIcon col={c.key} sortCol={sortCol} sortDir={sortDir} />
                  </th>
                ))}
                <th style={{ ...thStyle, cursor: 'default' }}>Descrizione</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Nessun ordine trovato.</td></tr>
              ) : filtered.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{o.numero_ordine || '—'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}><StatoBadge stato={o.stato} /></td>
                  <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center' }}>€ {Number(o.totale).toFixed(2)}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center', whiteSpace: 'nowrap' }}>{formatDate(o.data_ordine)}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#666', maxWidth: 260 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.descrizione || <span style={{ color: '#ccc' }}>—</span>}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
