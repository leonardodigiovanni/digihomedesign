'use client'

import React, { useState, useMemo } from 'react'
import { useTransition } from 'react'
import { toggleVisibile, eliminaOrdine } from './ordini-actions'
import SelectLookup from '@/components/select-lookup'

type OrdineCliente = {
  id: number; numero: string; tipo: 'preventivo' | 'acquisto'
  cliente_id: number | null; cliente_nome: string | null
  data_ordine: string; importo_totale: number
  visibile_cliente: number; created_at: string
}

export default function OrdiniStaffClient({
  ordini,
  clienti,
}: {
  ordini: OrdineCliente[]
  clienti: Array<{ id: number; nome: string }>
}) {
  const [filterCliente, setFilterCliente] = useState('')
  const [filterNumero, setFilterNumero] = useState('')
  const [filterData, setFilterData] = useState('')
  const [pending, startT] = useTransition()

  const filtered = useMemo(() => {
    return ordini.filter(o => {
      if (filterCliente && String(o.cliente_id) !== filterCliente) return false
      if (filterNumero && !o.numero.toLowerCase().includes(filterNumero.toLowerCase())) return false
      if (filterData && o.data_ordine !== filterData) return false
      return true
    })
  }, [ordini, filterCliente, filterNumero, filterData])

  const handleToggleVisibile = (id: number, vis: number) => {
    startT(async () => {
      await toggleVisibile(id, vis === 0)
    })
  }

  const handleElimina = (id: number) => {
    if (confirm('Eliminare questo ordine?')) {
      startT(async () => {
        await eliminaOrdine(id)
      })
    }
  }

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Filtri */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <SelectLookup
          value={filterCliente}
          onChange={setFilterCliente}
          options={[{ value: '', label: 'Tutti i clienti' }, ...clienti.map(c => ({ value: String(c.id), label: c.nome }))]}
          style={{ padding: '8px 12px', fontSize: 13, borderRadius: 4, border: '1px solid #ccc', flex: 1, minWidth: 150 }} />
        <input
          type="text"
          placeholder="Numero ordine"
          value={filterNumero}
          onChange={e => setFilterNumero(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 13, borderRadius: 4, border: '1px solid #ccc', flex: 1, minWidth: 150 }}
        />
        <input
          type="date"
          value={filterData}
          onChange={e => setFilterData(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 13, borderRadius: 4, border: '1px solid #ccc', flex: 1, minWidth: 150 }}
        />
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun ordine trovato.</p>
      ) : (
        <div style={{
          overflowX: 'auto', borderRadius: 8, border: '1px solid #c8960c',
          boxShadow: '0 4px 24px rgba(200,150,12,0.18), inset 0 1px 0 rgba(255,250,200,0.5)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={thStyle}>Cliente</th>
                <th style={thStyle}>N° Ordine</th>
                <th style={thStyle}>Tipo</th>
                <th style={thStyle}>Data</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Importo</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => {
                const isLast = i === filtered.length - 1
                const td = isLast ? { ...tdStyle, borderBottom: 'none' } : tdStyle
                const isVisible = o.visibile_cliente === 1
                return (
                  <tr key={o.id} style={{ height: 80 }}>
                    <td style={{ ...td, minWidth: 150 }}>{o.cliente_nome || '—'}</td>
                    <td style={{ ...td, fontWeight: 600 }}>
                      <a href={`/area-lavoro/ordini-ricevuti/${o.id}`}
                        style={{ color: '#2b6cb0', textDecoration: 'none' }}>
                        {o.numero || `#${o.id}`}
                      </a>
                    </td>
                    <td style={td}>
                      <span style={{
                        background: o.tipo === 'preventivo' ? '#e3f2fd' : '#f0fff4',
                        color: o.tipo === 'preventivo' ? '#1565c0' : '#276749',
                        padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                      }}>
                        {o.tipo === 'preventivo' ? 'Preventivo' : 'Acquisto'}
                      </span>
                    </td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{o.data_ordine}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 600 }}>
                      € {Number(o.importo_totale).toFixed(2)}
                    </td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button
                          onClick={() => handleToggleVisibile(o.id, o.visibile_cliente)}
                          disabled={pending}
                          className={`${isVisible ? 'btn-black' : 'btn-gray'} btn-icon`}
                          title={isVisible ? 'Nascondi dal cliente' : 'Mostra al cliente'}
                          style={{ fontSize: 16 }}>
                          {isVisible ? '👁' : '🚫'}
                        </button>
                        <button
                          onClick={() => handleElimina(o.id)}
                          disabled={pending}
                          className="btn-red btn-icon"
                          title="Elimina ordine"
                          style={{ fontSize: 14 }}>
                          ✕
                        </button>
                      </div>
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
