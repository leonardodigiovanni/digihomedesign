'use client'

import { useState } from 'react'
import { eseguiQuery } from './actions'

type QueryResult = {
  columns: string[]
  rows: Record<string, unknown>[]
  rowsAffected?: number
  error?: string
}

export default function DatabaseClient() {
  const [sql, setSql] = useState('')
  const [result, setResult] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleEsegui() {
    if (!sql.trim()) return
    setLoading(true)
    setResult(null)
    const res = await eseguiQuery(sql)
    setResult(res)
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <textarea
        value={sql}
        onChange={e => setSql(e.target.value)}
        placeholder="Scrivi la query SQL..."
        rows={4}
        style={{
          width: '100%',
          background: '#0a0a0a',
          color: '#e0e0e0',
          border: '1px solid #444',
          borderRadius: 6,
          padding: '12px 14px',
          fontFamily: 'monospace',
          fontSize: 14,
          resize: 'vertical',
          overflowY: 'auto',
          boxSizing: 'border-box',
          outline: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={handleEsegui}
          disabled={loading || !sql.trim()}
          className="btn-green"
          style={{ minWidth: 140 }}
        >
          {loading ? 'Esecuzione...' : 'Esegui'}
        </button>
      </div>

      {result && !result.error && result.columns.length === 0 && result.rowsAffected !== undefined && (
        <div style={{
          background: '#001a00',
          border: '1px solid #080',
          borderRadius: 6,
          padding: '10px 14px',
          color: '#5f5',
          fontSize: 14,
        }}>
          Query eseguita. Righe interessate: <strong>{result.rowsAffected}</strong>
        </div>
      )}

      {result?.error && (
        <div style={{
          background: '#1a0000',
          border: '1px solid #800',
          borderRadius: 6,
          padding: '10px 14px',
          color: '#ff6b6b',
          fontFamily: 'monospace',
          fontSize: 13,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}>
          {result.error}
        </div>
      )}

      {result && !result.error && result.columns.length > 0 && (
        <div style={{ overflowX: 'auto', border: '1px solid #333', borderRadius: 6 }}>
          <div style={{ fontSize: 12, color: '#888', padding: '6px 12px', borderBottom: '1px solid #333' }}>
            {result.rows.length} {result.rows.length === 1 ? 'riga' : 'righe'}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#1a1a1a' }}>
                {result.columns.map(col => (
                  <th key={col} style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    color: '#c8a84b',
                    fontWeight: 600,
                    borderBottom: '1px solid #333',
                    whiteSpace: 'nowrap',
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f0f0f0' }}>
                  {result.columns.map(col => {
                    const val = row[col]
                    const display = val === null ? <span style={{ color: '#999', fontStyle: 'italic' }}>NULL</span>
                      : String(val)
                    return (
                      <td key={col} style={{
                        padding: '7px 12px',
                        borderBottom: '1px solid #ccc',
                        color: '#111',
                        maxWidth: 320,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {display}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
