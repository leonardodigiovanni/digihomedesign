'use client'

import { useState } from 'react'
import ApriBtnPreventivo from './apri-btn'

type Preventivo = {
  id: number
  numero: string
  cliente_nome: string
  descrizione: string
  stato: string
  importo: number
  data: string
  validita_giorni: number
}

const STATO_COLORS: Record<string, [string, string]> = {
  bozza:     ['#000', 'transparent'],
  inviato:   ['#2b6cb0', '#ebf8ff'],
  accettato: ['#276749', '#f0fff4'],
  rifiutato: ['#c00', '#fff5f5'],
  scaduto:   ['#8a6d3b', '#fffbeb'],
}

const BRUSHED = 'repeating-linear-gradient(90deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 3px),linear-gradient(160deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)'

const TH: React.CSSProperties = {
  padding: '9px 14px', fontSize: 14, fontWeight: 700, color: '#1a1a1a',
  textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
  borderBottom: '1px solid #333', whiteSpace: 'nowrap',
}
const TD: React.CSSProperties = {
  padding: '10px 14px', fontSize: 14, color: '#333',
  borderBottom: '1px solid #333', verticalAlign: 'middle',
}

function CellaCliente({ nome }: { nome: string }) {
  if (!nome) return <span style={{ color: '#aaa' }}>—</span>
  if (!nome.includes('|')) return <span>{nome}</span>
  const [cognome, n] = nome.split('|')
  return (
    <>
      <div style={{ fontWeight: 600 }}>{cognome}</div>
      <div style={{ color: '#555', fontSize: 13 }}>{n}</div>
    </>
  )
}

export default function PreventiviTabella({ preventivi, isStaff }: { preventivi: Preventivo[]; isStaff: boolean }) {
  const [filtro, setFiltro] = useState('')

  const visibili = filtro.trim()
    ? preventivi.filter(p => {
        const q = filtro.toLowerCase()
        const nome = p.cliente_nome.replace('|', ' ').toLowerCase()
        return nome.includes(q) || p.numero.toLowerCase().includes(q) || p.descrizione?.toLowerCase().includes(q)
      })
    : preventivi

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {isStaff && (
        <input
          type="search"
          placeholder="Cerca per cliente, numero o descrizione…"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{
            padding: '9px 12px', fontSize: 14, border: '1px solid #444',
            borderRadius: 8, fontFamily: 'inherit', background: '#f5f5f5',
            boxSizing: 'border-box', width: '100%',
          }}
        />
      )}

      {visibili.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun preventivo trovato.</p>
      ) : (
        <div style={{ overflowX: 'auto', overflowY: 'hidden', borderRadius: 8, border: '1px solid #222', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: BRUSHED }}>
                <th style={TH}>N° PREVENTIVO</th>
                {isStaff && <th style={TH}>Cliente</th>}
                <th style={TH}>Descrizione</th>
                <th style={TH}>Data</th>
                <th style={{ ...TH, textAlign: 'right' }}>Importo</th>
                <th style={TH}>Validità</th>
                <th style={{ ...TH, textAlign: 'center' }}>Stato</th>
              </tr>
            </thead>
            <tbody>
              {visibili.map((p, i) => {
                const [color, bg] = STATO_COLORS[p.stato] ?? ['#666', '#f5f5f5']
                const td = i === visibili.length - 1 ? { ...TD, borderBottom: 'none' } : TD
                return (
                  <tr key={p.id} style={{ height: 84, background: BRUSHED }}>
                    <td style={td}><ApriBtnPreventivo id={p.id} numero={p.numero} /></td>
                    {isStaff && <td style={{ ...td, minWidth: 160 }}><CellaCliente nome={p.cliente_nome} /></td>}
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
