'use client'

import { useState } from 'react'
import { DeleteDocumentoButton } from '@/app/area-clienti/documenti/delete-button'
import { documentoSrc } from '@/lib/media-src'

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

const thStyle: React.CSSProperties = {
  padding: '9px 14px', fontSize: 14, fontWeight: 700, color: '#1a1a1a',
  textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
  borderBottom: '1px solid #333', whiteSpace: 'nowrap', fontFamily: 'monospace',
}
const tdStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 14, color: '#333',
  borderBottom: '1px solid #333', verticalAlign: 'middle', fontFamily: 'monospace',
}

export default function DocumentiClient({ documenti, isStaff }: { documenti: Documento[]; isStaff: boolean }) {
  const [filtro, setFiltro] = useState('')

  const lista = filtro.trim()
    ? documenti.filter(d =>
        (d.cliente_nome ?? '').toLowerCase().includes(filtro.toLowerCase()) ||
        d.titolo.toLowerCase().includes(filtro.toLowerCase())
      )
    : documenti

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {isStaff && (
        <input
          type="search"
          placeholder="Cerca per cliente o titolo…"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{
            padding: '9px 12px', fontSize: 14, border: '1px solid #444',
            borderRadius: 8, fontFamily: 'inherit', background: '#f5f5f5',
            boxSizing: 'border-box', width: '100%',
          }}
        />
      )}

      {lista.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14, fontFamily: 'monospace' }}>Nessun documento disponibile.</p>
      ) : (
        <div style={{ overflowX: 'auto', overflowY: 'hidden', borderRadius: '8px 8px 0 0', border: '1px solid #222', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="sfondo-riquadri-app">
                <th style={thStyle}>File</th>
                {isStaff && <th style={{ ...thStyle, minWidth: 160 }}>Cliente</th>}
                <th style={thStyle}>Titolo</th>
                <th style={thStyle}>Tipo</th>
                <th style={thStyle}>Data</th>
                {isStaff && <th style={{ ...thStyle, textAlign: 'center' }}>Visibile</th>}
                {isStaff && <th style={{ ...thStyle, textAlign: 'center' }}></th>}
              </tr>
            </thead>
            <tbody>
              {lista.map((d, idx) => {
                const td = idx === lista.length - 1 ? { ...tdStyle, borderBottom: 'none' } : tdStyle
                return (
                  <tr key={d.id} className="sfondo-riquadri-app" style={{ height: 84 }}>
                    <td style={td}>
                      <a href={documentoSrc(d.filename)} target="_blank" rel="noopener noreferrer"
                         className="btn-gold-app" style={{ padding: '0 14px', width: '100%' }}>
                        {d.filename.replace(/^\d+_/, '')}
                      </a>
                    </td>
                    {isStaff && <td style={{ ...td, minWidth: 160 }}>{d.cliente_nome || '—'}</td>}
                    <td style={td}>{d.titolo}</td>
                    <td style={td}>{d.tipo}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{d.created_at}</td>
                    {isStaff && (
                      <td style={{ ...td, textAlign: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: d.visibile_cliente ? '#276749' : '#c00' }}>
                          {d.visibile_cliente ? 'Sì' : 'No'}
                        </span>
                      </td>
                    )}
                    {isStaff && (
                      <td style={{ ...td, textAlign: 'center' }}>
                        <DeleteDocumentoButton id={d.id} filename={d.filename} titolo={d.titolo} isApp={true} />
                      </td>
                    )}
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
