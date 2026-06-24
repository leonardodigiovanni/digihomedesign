'use client'

import { useState, useMemo } from 'react'
import SelectLookup from '@/components/select-lookup'
import { documentoSrc } from '@/lib/media-src'
import { ClienteSelect } from './cliente-select'
import { VisibileCheckbox } from './visibile-checkbox'
import { DeleteDocumentoButton } from './delete-button'

type Documento = {
  id: number
  cliente_id: number | null
  cliente_nome: string
  titolo: string
  tipo: string
  filename: string
  note: string | null
  visibile_cliente: number
  created_at: string
}

type ClienteOption = { id: number; label: string }

const thStyle: React.CSSProperties = {
  padding: '9px 14px', fontSize: 11, fontWeight: 700, color: '#7a6000',
  textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
  background: '#fff', borderBottom: '1px solid #c8960c', whiteSpace: 'nowrap',
}
const tdStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 13, color: '#333',
  borderBottom: '1px solid #c8960c', verticalAlign: 'middle',
}
const controlStyle: React.CSSProperties = {
  border: '1px solid #ddd', borderRadius: 6, padding: '7px 10px',
  fontSize: 13, background: '#fff', height: 34, boxSizing: 'border-box',
}

export function DocumentiFiltri({ documenti, clienti }: { documenti: Documento[]; clienti: ClienteOption[] }) {
  const [titolo, setTitolo]   = useState('')
  const [cliente, setCliente] = useState('')
  const [tipo, setTipo]       = useState('')
  const [visibile, setVis]    = useState('')

  const tipiDistinti = useMemo(() =>
    [...new Set(documenti.map(d => d.tipo).filter(Boolean))].sort(),
    [documenti]
  )

  const filtered = useMemo(() => documenti.filter(d => {
    if (titolo   && !d.titolo.toLowerCase().includes(titolo.toLowerCase())) return false
    if (cliente  && String(d.cliente_id ?? '') !== cliente) return false
    if (tipo     && d.tipo !== tipo) return false
    if (visibile === '1' && d.visibile_cliente !== 1) return false
    if (visibile === '0' && d.visibile_cliente !== 0) return false
    return true
  }), [documenti, titolo, cliente, tipo, visibile])

  const hasFilter = titolo || cliente || tipo || visibile

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* barra filtri */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Cerca titolo…"
          value={titolo}
          onChange={e => setTitolo(e.target.value)}
          style={{ ...controlStyle, minWidth: 180 }}
        />
        <SelectLookup value={cliente} onChange={setCliente}
          options={[{ value: '', label: 'Tutti i clienti' }, ...clienti.map(c => ({ value: String(c.id), label: c.label }))]}
          style={{ ...controlStyle, minWidth: 160 }} />
        <SelectLookup value={tipo} onChange={setTipo}
          options={[{ value: '', label: 'Tutti i tipi' }, ...tipiDistinti.map(t => ({ value: t, label: t }))]}
          style={{ ...controlStyle, minWidth: 140 }} />
        <SelectLookup value={visibile} onChange={setVis}
          options={[{ value: '', label: 'Visibilità: tutti' }, { value: '1', label: 'Visibile: Sì' }, { value: '0', label: 'Visibile: No' }]}
          style={{ ...controlStyle, minWidth: 120 }} />
        {hasFilter && (
          <button
            onClick={() => { setTitolo(''); setCliente(''); setTipo(''); setVis('') }}
            style={{ ...controlStyle, background: '#f5f5f5', cursor: 'pointer', color: '#555', border: '1px solid #ccc' }}
          >
            Azzera
          </button>
        )}
        <span style={{ fontSize: 12, color: '#999', marginLeft: 4 }}>
          {filtered.length} / {documenti.length}
        </span>
      </div>

      {/* tabella */}
      {filtered.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun documento corrisponde ai filtri.</p>
      ) : (
        <div style={{
          overflowX: 'auto', overflowY: 'hidden', borderRadius: 8, border: '1px solid #c8960c',
          boxShadow: '0 4px 24px rgba(200,150,12,0.18), inset 0 1px 0 rgba(255,250,200,0.5)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>Titolo</th>
                <th style={thStyle}>Tipo</th>
                <th style={thStyle}>File</th>
                <th style={thStyle}>Data</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Visibile</th>
                <th style={{ ...thStyle, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} style={{ height: 60 }}>
                  <td style={tdStyle}>
                    <ClienteSelect docId={d.id} clienteId={d.cliente_id} clienti={clienti} />
                  </td>
                  <td style={tdStyle}>{d.titolo}</td>
                  <td style={tdStyle}>{d.tipo}</td>
                  <td style={tdStyle}>
                    <a href={documentoSrc(d.filename)} target="_blank" rel="noopener noreferrer"
                       style={{ color: '#c8960c', textDecoration: 'underline' }}>
                      {d.filename.replace(/^\d+_/, '')}
                    </a>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{d.created_at}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <VisibileCheckbox docId={d.id} visibile={d.visibile_cliente === 1} />
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <DeleteDocumentoButton id={d.id} filename={d.filename} titolo={d.titolo} />
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
