'use client'

import React, { useState, useMemo, useTransition, useRef, useEffect } from 'react'
import { addFattura, deleteFattura, addPagamento, deletePagamento } from './actions'

function localDateStr(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const IVA_OPZIONI = [
  { label: 'Esente', value: 0 },
  { label: '10%',    value: 10 },
  { label: '22%',    value: 22 },
]

export type Fattura = {
  id: number
  tipo: 'attiva' | 'passiva'
  numero: string
  data: string
  controparte: string
  importo: number
  iva: number
  totale: number
  importo_pagato: number
  note: string | null
}

export type Pagamento = {
  id: number
  fattura_id: number
  data: string
  importo: number
  note: string | null
}

// ─── Stato pagamento ──────────────────────────────────────────────────────────

function StatoBadge({ fattura }: { fattura: Fattura }) {
  const tot  = Number(fattura.totale)
  const pag  = Number(fattura.importo_pagato)
  let label: string
  let bg: string

  if (pag <= 0)       { label = 'Non pagata'; bg = '#c62828' }
  else if (pag < tot) { label = 'Parziale';   bg = '#e65100' }
  else if (pag > tot) { label = 'Eccedenza';  bg = '#6a1b9a' }
  else                { label = 'Saldata';     bg = '#2e7d32' }

  return (
    <span style={{
      background: bg, color: '#fff', borderRadius: 4,
      padding: '2px 8px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

// ─── Form aggiunta fattura ────────────────────────────────────────────────────

function AddFatturaForm({ defaultTipo }: { defaultTipo: 'attiva' | 'passiva' }) {
  const [open, setOpen]   = useState(false)
  const [error, setError] = useState('')
  const [pending, startT] = useTransition()
  const formRef           = useRef<HTMLFormElement>(null)
  const [today, setToday] = useState('')
  useEffect(() => { setToday(localDateStr()) }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError('')
    startT(async () => {
      const res = await addFattura(null, fd)
      if (res?.error) { setError(res.error); return }
      formRef.current?.reset()
      setOpen(false)
    })
  }

  const inp: React.CSSProperties = {
    padding: '5px 8px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  }

  if (!open) return (
    <button className="btn-green" onClick={() => setOpen(true)}
      style={{ padding: '7px 18px', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
      + Nuova fattura {defaultTipo === 'attiva' ? 'attiva' : 'passiva'}
    </button>
  )

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{
      background: '#f8f8f8', border: '1px solid #ddd', borderRadius: 8,
      padding: '16px 20px', marginBottom: 16,
    }}>
      <input type="hidden" name="tipo" value={defaultTipo} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Numero *</label>
          <input name="numero" required style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Data *</label>
          <input name="data" type="date" defaultValue={today} required style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>
            {defaultTipo === 'attiva' ? 'Cliente *' : 'Fornitore *'}
          </label>
          <input name="controparte" required style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Imponibile (€) *</label>
          <input name="importo" type="number" step="0.01" min="0" defaultValue="0" required style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>IVA *</label>
          <select name="iva" style={inp} defaultValue="22">
            {IVA_OPZIONI.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Note</label>
          <input name="note" style={inp} />
        </div>
      </div>
      {error && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-green" disabled={pending}
          style={{ padding: '6px 16px', fontSize: 13, fontWeight: 600 }}>
          {pending ? 'Salvataggio...' : 'Salva'}
        </button>
        <button type="button" className="btn-gray" onClick={() => setOpen(false)}
          style={{ padding: '6px 16px', fontSize: 13 }}>
          Annulla
        </button>
      </div>
    </form>
  )
}

// ─── Form aggiunta pagamento ──────────────────────────────────────────────────

function AddPagamentoForm({ fatturaId, residuo, onDone }: { fatturaId: number; residuo: number; onDone: () => void }) {
  const [error, setError]           = useState('')
  const [pending, startT]           = useTransition()
  const [importoVal, setImportoVal] = useState('')
  const formRef                     = useRef<HTMLFormElement>(null)
  const [today, setToday]           = useState('')
  useEffect(() => { setToday(localDateStr()) }, [])

  const inp: React.CSSProperties = {
    padding: '4px 7px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 12, fontFamily: 'inherit', boxSizing: 'border-box',
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError('')
    startT(async () => {
      const res = await addPagamento(null, fd)
      if (res?.error) { setError(res.error); return }
      formRef.current?.reset()
      setImportoVal('')
      onDone()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}
      style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap', marginTop: 8 }}>
      <input type="hidden" name="fattura_id" value={fatturaId} />
      <div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Data *</div>
        <input name="data" type="date" defaultValue={today} required style={{ ...inp, width: 130 }} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Importo € *</div>
        <input name="importo" type="number" step="0.01" min="0.01" required
          value={importoVal} onChange={e => setImportoVal(e.target.value)}
          style={{ ...inp, width: 110 }} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Note</div>
        <input name="note" style={{ ...inp, width: 160 }} />
      </div>
      {error && <span style={{ color: '#c00', fontSize: 11 }}>{error}</span>}
      <button type="submit" className="btn-green" disabled={pending}
        style={{ padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
        {pending ? '...' : 'Aggiungi'}
      </button>
      {residuo > 0 && (
        <button type="button" disabled={pending}
          onClick={() => setImportoVal(residuo.toFixed(2))}
          style={{
            padding: '4px 12px', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            background: '#1565c0', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer',
          }}>
          Saldo (€ {residuo.toFixed(2)})
        </button>
      )}
    </form>
  )
}

// ─── Pannello pagamenti (riga espandibile) ────────────────────────────────────

function PagamentiPanel({ fattura, pagamenti }: { fattura: Fattura; pagamenti: Pagamento[] }) {
  const [pending, startT] = useTransition()
  const miei              = pagamenti.filter(p => p.fattura_id === fattura.id)
  const tot               = Number(fattura.totale)
  const pag               = Number(fattura.importo_pagato)
  const residuo           = tot - pag

  const tdS: React.CSSProperties = { padding: '3px 10px', fontSize: 12, borderBottom: '1px solid #eee' }

  return (
    <div style={{ padding: '10px 16px', background: '#fafdf8', borderTop: '1px solid #e0e0e0' }}>
      <div style={{ display: 'flex', gap: 24, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12 }}>Totale: <strong>€ {tot.toFixed(2)}</strong></span>
        <span style={{ fontSize: 12 }}>Pagato: <strong style={{ color: '#2e7d32' }}>€ {pag.toFixed(2)}</strong></span>
        <span style={{ fontSize: 12 }}>Residuo: <strong style={{ color: residuo > 0 ? '#c62828' : '#2e7d32' }}>€ {Math.max(0, residuo).toFixed(2)}</strong></span>
      </div>

      {miei.length > 0 && (
        <table style={{ borderCollapse: 'collapse', fontSize: 12, marginBottom: 8, width: '100%', maxWidth: 520 }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th style={{ ...tdS, fontWeight: 600 }}>Data</th>
              <th style={{ ...tdS, fontWeight: 600 }}>Importo</th>
              <th style={{ ...tdS, fontWeight: 600 }}>Note</th>
              <th style={tdS} />
            </tr>
          </thead>
          <tbody>
            {miei.map(p => (
              <tr key={p.id}>
                <td style={tdS}>{p.data?.slice?.(0, 10) ?? p.data}</td>
                <td style={tdS}>€ {Number(p.importo).toFixed(2)}</td>
                <td style={tdS}>{p.note ?? ''}</td>
                <td style={tdS}>
                  <form action={async (fd) => { startT(async () => { await deletePagamento(null, fd) }) }}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="fattura_id" value={fattura.id} />
                    <button type="submit" disabled={pending} className="btn-red"
                      style={{ padding: '2px 8px', fontSize: 11 }}
                      onClick={e => { if (!confirm('Eliminare questo pagamento?')) e.preventDefault() }}>
                      Elimina
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <AddPagamentoForm fatturaId={fattura.id} residuo={Math.max(0, residuo)} onDone={() => {}} />
    </div>
  )
}

// ─── Riepilogo totali ─────────────────────────────────────────────────────────

function Riepilogo({ fatture, tipo }: { fatture: Fattura[]; tipo: 'attiva' | 'passiva' }) {
  const imponibile = fatture.reduce((s, f) => s + Number(f.importo), 0)
  const iva        = fatture.reduce((s, f) => s + (Number(f.importo) * Number(f.iva) / 100), 0)
  const totale     = imponibile + iva
  const daPagare   = fatture.reduce((s, f) => s + Math.max(0, Number(f.totale) - Number(f.importo_pagato)), 0)

  const cell: React.CSSProperties = { padding: '6px 14px', fontSize: 13, fontWeight: 600 }
  return (
    <div style={{ display: 'flex', gap: 0, background: '#f0f0f0', borderRadius: 6, overflow: 'hidden', marginBottom: 14, width: 'fit-content', flexWrap: 'wrap' }}>
      <div style={cell}>Imponibile: <strong>€ {imponibile.toFixed(2)}</strong></div>
      <div style={{ ...cell, borderLeft: '1px solid #ddd' }}>IVA: <strong>€ {iva.toFixed(2)}</strong></div>
      <div style={{ ...cell, borderLeft: '1px solid #ddd' }}>Totale: <strong>€ {totale.toFixed(2)}</strong></div>
      <div style={{ ...cell, borderLeft: '1px solid #ddd', color: daPagare > 0 ? '#b00' : '#070' }}>
        {tipo === 'attiva' ? 'Da incassare' : 'Da pagare'}: <strong>€ {daPagare.toFixed(2)}</strong>
      </div>
    </div>
  )
}

// ─── Tabella fatture ──────────────────────────────────────────────────────────

type SortKey = keyof Fattura
type SortDir = 'asc' | 'desc'

type ColDef = { key: SortKey; label: string; type: 'text' | 'date' | 'number' | 'stato' }

const COLS: ColDef[] = [
  { key: 'numero',         label: 'Numero',       type: 'text'   },
  { key: 'data',           label: 'Data',         type: 'date'   },
  { key: 'controparte',    label: 'Controparte',  type: 'text'   },
  { key: 'importo',        label: 'Imponibile €', type: 'number' },
  { key: 'iva',            label: 'IVA',          type: 'number' },
  { key: 'totale',         label: 'Totale €',     type: 'number' },
  { key: 'importo_pagato', label: 'Pagato €',     type: 'number' },
  { key: 'importo_pagato', label: 'Stato',        type: 'stato'  },
  { key: 'note',           label: 'Note',         type: 'text'   },
]

function TabellaFatture({ fatture, pagamenti }: { fatture: Fattura[]; pagamenti: Pagamento[] }) {
  const [sortKey, setSortKey]     = useState<SortKey>('data')
  const [sortDir, setSortDir]     = useState<SortDir>('desc')
  const [filters, setFilters]     = useState<Record<string, string>>({})
  const [expanded, setExpanded]   = useState<number | null>(null)
  const [pending, startT]         = useTransition()

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    return fatture.filter(f => {
      return COLS.filter((c, i, arr) => arr.findIndex(x => x.key === c.key) === i).every(col => {
        const fv = filters[col.key] ?? ''
        if (!fv || fv === 'all') return true
        if (col.type === 'stato') {
          const tot = Number(f.totale); const pag = Number(f.importo_pagato)
          const stato = pag <= 0 ? 'non pagata' : pag < tot ? 'parziale' : pag > tot ? 'eccedenza' : 'saldata'
          return stato.includes(fv.toLowerCase())
        }
        return String(f[col.key] ?? '').toLowerCase().includes(fv.toLowerCase())
      })
    })
  }, [fatture, filters])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? ''
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, sortKey, sortDir])

  const thBase: React.CSSProperties = {
    padding: '6px 10px', background: '#2a2a3e', color: '#c8960c',
    fontSize: 12, fontWeight: 600, textAlign: 'left', cursor: 'pointer',
    userSelect: 'none', whiteSpace: 'nowrap', borderBottom: '2px solid #444',
  }
  const tdBase: React.CSSProperties = {
    padding: '6px 10px', fontSize: 13, borderBottom: '1px solid #eee', verticalAlign: 'middle',
  }
  const inpF: React.CSSProperties = {
    width: '100%', padding: '3px 6px', fontSize: 11, border: '1px solid #ccc',
    borderRadius: 3, boxSizing: 'border-box', fontFamily: 'inherit',
  }

  if (fatture.length === 0) return <p style={{ color: '#aaa', fontSize: 13 }}>Nessuna fattura presente.</p>

  const NUM_COLS = COLS.length + 1 // +1 per azioni

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {COLS.map((col, i) => (
              <th key={i} style={thBase} onClick={() => handleSort(col.key)}>
                {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </th>
            ))}
            <th style={{ ...thBase, cursor: 'default' }}>Azioni</th>
          </tr>
          <tr style={{ background: '#f5f5f5' }}>
            {COLS.map((col, i) => (
              <th key={i} style={{ padding: '4px 6px' }}>
                {col.type === 'stato' ? (
                  <select style={inpF} onChange={e => setFilters(p => ({ ...p, _stato: e.target.value }))}>
                    <option value="all">Tutti</option>
                    <option value="non pagata">Non pagata</option>
                    <option value="parziale">Parziale</option>
                    <option value="saldata">Saldata</option>
                    <option value="eccedenza">Eccedenza</option>
                  </select>
                ) : (
                  <input style={inpF} placeholder="Filtra..."
                    onChange={e => setFilters(p => ({ ...p, [col.key]: e.target.value }))} />
                )}
              </th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {sorted.map((f, i) => (
            <React.Fragment key={f.id}>
              <tr style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={tdBase}>{f.numero}</td>
                <td style={tdBase}>{f.data?.slice?.(0, 10) ?? f.data}</td>
                <td style={tdBase}>{f.controparte}</td>
                <td style={{ ...tdBase, textAlign: 'right' }}>€ {Number(f.importo).toFixed(2)}</td>
                <td style={{ ...tdBase, textAlign: 'right' }}>
                  {IVA_OPZIONI.find(o => o.value === Number(f.iva))?.label ?? `${f.iva}%`}
                </td>
                <td style={{ ...tdBase, textAlign: 'right', fontWeight: 600 }}>€ {Number(f.totale).toFixed(2)}</td>
                <td style={{ ...tdBase, textAlign: 'right' }}>€ {Number(f.importo_pagato).toFixed(2)}</td>
                <td style={{ ...tdBase, textAlign: 'center' }}><StatoBadge fattura={f} /></td>
                <td style={{ ...tdBase, color: '#666', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.note ?? ''}
                </td>
                <td style={{ ...tdBase, whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => setExpanded(prev => prev === f.id ? null : f.id)}
                      style={{
                        padding: '3px 10px', fontSize: 12, fontFamily: 'inherit',
                        border: '1px solid #aaa', borderRadius: 4, cursor: 'pointer',
                        background: expanded === f.id ? '#e0e0e0' : '#fff',
                      }}>
                      {expanded === f.id ? 'Chiudi' : '+ Pagamento'}
                    </button>
                    <form action={async (fd) => { startT(async () => { await deleteFattura(null, fd) }) }}>
                      <input type="hidden" name="id" value={f.id} />
                      <button type="submit" disabled={pending} className="btn-red"
                        style={{ padding: '3px 10px', fontSize: 12 }}
                        onClick={e => { if (!confirm('Eliminare questa fattura?')) e.preventDefault() }}>
                        Elimina
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
              {expanded === f.id && (
                <tr>
                  <td colSpan={NUM_COLS} style={{ padding: 0, background: '#fafdf8' }}>
                    <PagamentiPanel fattura={f} pagamenti={pagamenti} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={NUM_COLS} style={{ ...tdBase, color: '#aaa', textAlign: 'center' }}>
                Nessun risultato.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// ─── Filtro trimestrale ───────────────────────────────────────────────────────

type Trimestre = '1T' | '2T' | '3T' | '4T' | 'anno'

const TRIMESTRI: { label: string; value: Trimestre }[] = [
  { label: '1° Trim.', value: '1T'   },
  { label: '2° Trim.', value: '2T'   },
  { label: '3° Trim.', value: '3T'   },
  { label: '4° Trim.', value: '4T'   },
  { label: 'Anno intero', value: 'anno' },
]

function meseInTrimestre(mese: number, t: Trimestre): boolean {
  if (t === 'anno') return true
  if (t === '1T') return mese >= 1  && mese <= 3
  if (t === '2T') return mese >= 4  && mese <= 6
  if (t === '3T') return mese >= 7  && mese <= 9
  return mese >= 10 && mese <= 12
}

function filtraPerPeriodo(fatture: Fattura[], anno: number, trimestre: Trimestre): Fattura[] {
  return fatture.filter(f => {
    const d = new Date(f.data + 'T12:00:00')
    return d.getFullYear() === anno && meseInTrimestre(d.getMonth() + 1, trimestre)
  })
}

// ─── Pannello riepilogo IVA ───────────────────────────────────────────────────

function PannelloRiepilogo({ attive, passive }: { attive: Fattura[]; passive: Fattura[] }) {
  const fatAtt = attive.reduce((s, f) => s + Number(f.importo), 0)
  const fatPas = passive.reduce((s, f) => s + Number(f.importo), 0)
  const diff   = fatAtt - fatPas

  const ivaRaccolta = attive.reduce((s, f)  => s + Number(f.importo) * Number(f.iva) / 100, 0)
  const ivaPagata   = passive.reduce((s, f) => s + Number(f.importo) * Number(f.iva) / 100, 0)
  const ivaNetta    = ivaRaccolta - ivaPagata

  const row: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: 14,
  }
  const val: React.CSSProperties = { fontWeight: 700, fontSize: 15 }

  return (
    <div style={{
      background: '#fff', border: '2px solid #3949ab', borderRadius: 10,
      padding: '20px 24px', marginBottom: 28,
    }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: '#3949ab', marginBottom: 14, paddingBottom: 8, borderBottom: '2px solid #e8eaf6' }}>
        Riepilogo periodo
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
        {/* Colonna fatturazione */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Fatturazione</div>
          <div style={row}>
            <span style={{ color: '#2e7d32' }}>Attivo (imponibile)</span>
            <span style={{ ...val, color: '#2e7d32' }}>€ {fatAtt.toFixed(2)}</span>
          </div>
          <div style={row}>
            <span style={{ color: '#b71c1c' }}>Passivo (imponibile)</span>
            <span style={{ ...val, color: '#b71c1c' }}>€ {fatPas.toFixed(2)}</span>
          </div>
          <div style={{ ...row, borderBottom: 'none', paddingTop: 10 }}>
            <span style={{ fontWeight: 600 }}>Differenza netta</span>
            <span style={{ ...val, color: diff >= 0 ? '#2e7d32' : '#c62828' }}>
              {diff >= 0 ? '+' : ''}€ {diff.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Colonna IVA */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>IVA</div>
          <div style={row}>
            <span style={{ color: '#2e7d32' }}>IVA raccolta (attive)</span>
            <span style={{ ...val, color: '#2e7d32' }}>€ {ivaRaccolta.toFixed(2)}</span>
          </div>
          <div style={row}>
            <span style={{ color: '#b71c1c' }}>IVA pagata (passive)</span>
            <span style={{ ...val, color: '#b71c1c' }}>€ {ivaPagata.toFixed(2)}</span>
          </div>
          <div style={{ ...row, borderBottom: 'none', paddingTop: 10 }}>
            <span style={{ fontWeight: 600 }}>IVA netta</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                background: ivaNetta > 0 ? '#c62828' : '#2e7d32',
                color: '#fff', borderRadius: 4, padding: '2px 10px', fontSize: 12, fontWeight: 700,
              }}>
                {ivaNetta > 0 ? 'Da versare' : ivaNetta < 0 ? 'In accredito' : 'Pari'}
              </span>
              <span style={{ ...val, color: ivaNetta > 0 ? '#c62828' : '#2e7d32' }}>
                € {Math.abs(ivaNetta).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function FattureClient({ fatture, pagamenti }: { fatture: Fattura[]; pagamenti: Pagamento[] }) {
  const annoCorrente = new Date().getFullYear()
  const anniDisponibili = useMemo(() => {
    const anni = new Set(fatture.map(f => new Date(f.data + 'T12:00:00').getFullYear()))
    anni.add(annoCorrente)
    return Array.from(anni).sort((a, b) => b - a)
  }, [fatture, annoCorrente])

  const [anno, setAnno]           = useState(annoCorrente)
  const [trimestre, setTrimestre] = useState<Trimestre>('anno')

  const attiveFiltrate  = useMemo(() => filtraPerPeriodo(fatture.filter(f => f.tipo === 'attiva'),  anno, trimestre), [fatture, anno, trimestre])
  const passiveFiltrate = useMemo(() => filtraPerPeriodo(fatture.filter(f => f.tipo === 'passiva'), anno, trimestre), [fatture, anno, trimestre])

  const boxStyle: React.CSSProperties = {
    background: '#fff', border: '1px solid #e0e0e0',
    borderRadius: 10, padding: '20px 24px', marginBottom: 28,
  }
  const titleStyle: React.CSSProperties = {
    fontSize: 17, fontWeight: 700, marginBottom: 14, paddingBottom: 8,
    borderBottom: '2px solid #e0e0e0',
  }
  const btnPeriodo = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px', fontSize: 13, fontWeight: active ? 700 : 400,
    border: `1px solid ${active ? '#3949ab' : '#ccc'}`,
    borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit',
    background: active ? '#3949ab' : '#fff',
    color: active ? '#fff' : '#333',
  })

  return (
    <div>
      {/* Filtro periodo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <select value={anno} onChange={e => setAnno(Number(e.target.value))}
          style={{ padding: '6px 10px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4, fontFamily: 'inherit' }}>
          {anniDisponibili.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        {TRIMESTRI.map(t => (
          <button key={t.value} onClick={() => setTrimestre(t.value)} style={btnPeriodo(trimestre === t.value)}>
            {t.label}
          </button>
        ))}
      </div>

      <PannelloRiepilogo attive={attiveFiltrate} passive={passiveFiltrate} />

      <div style={boxStyle}>
        <div style={{ ...titleStyle, color: '#2e7d32' }}>Fatture Attive</div>
        <Riepilogo fatture={attiveFiltrate} tipo="attiva" />
        <AddFatturaForm defaultTipo="attiva" />
        <TabellaFatture fatture={attiveFiltrate} pagamenti={pagamenti} />
      </div>

      <div style={boxStyle}>
        <div style={{ ...titleStyle, color: '#b71c1c' }}>Fatture Passive</div>
        <Riepilogo fatture={passiveFiltrate} tipo="passiva" />
        <AddFatturaForm defaultTipo="passiva" />
        <TabellaFatture fatture={passiveFiltrate} pagamenti={pagamenti} />
      </div>
    </div>
  )
}
