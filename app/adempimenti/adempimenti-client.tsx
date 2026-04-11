'use client'

import React, { useState, useMemo, useTransition, useRef, useEffect } from 'react'
import { addAdempimento, deleteAdempimento, updateStato, duplicaAnno } from './actions'

export type Adempimento = {
  id: number
  descrizione: string
  ente: string
  periodo: string
  data_scadenza: string | null
  incaricato: string
  stato: 'da_fare' | 'in_corso' | 'completato' | 'n_a'
  anno: number
  ricorrente: number
  note: string | null
}

// ─── Stato badge ──────────────────────────────────────────────────────────────

const STATI: { value: Adempimento['stato']; label: string; bg: string; next: Adempimento['stato'] }[] = [
  { value: 'da_fare',    label: 'Da fare',    bg: '#c62828', next: 'in_corso'   },
  { value: 'in_corso',   label: 'In corso',   bg: '#e65100', next: 'completato' },
  { value: 'completato', label: 'Completato', bg: '#2e7d32', next: 'n_a'        },
  { value: 'n_a',        label: 'N/A',        bg: '#757575', next: 'da_fare'    },
]

function StatoBadge({ adempimento, onCicla }: { adempimento: Adempimento; onCicla: (nextStato: string) => void }) {
  const s = STATI.find(x => x.value === adempimento.stato) ?? STATI[0]
  return (
    <button onClick={() => onCicla(s.next)} style={{
      background: s.bg, color: '#fff', border: 'none', borderRadius: 4,
      padding: '3px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
      fontFamily: 'inherit', whiteSpace: 'nowrap',
    }}>
      {s.label}
    </button>
  )
}

// ─── Form aggiunta ────────────────────────────────────────────────────────────

function AddForm({ anno }: { anno: number }) {
  const [open, setOpen]   = useState(false)
  const [error, setError] = useState('')
  const [pending, startT] = useTransition()
  const formRef           = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError('')
    startT(async () => {
      const res = await addAdempimento(null, fd)
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
      style={{ padding: '7px 18px', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
      + Nuovo adempimento
    </button>
  )

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{
      background: '#f8f8f8', border: '1px solid #ddd', borderRadius: 8,
      padding: '16px 20px', marginBottom: 20,
    }}>
      <input type="hidden" name="anno" value={anno} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 10 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Descrizione *</label>
          <input name="descrizione" required style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Ente</label>
          <input name="ente" placeholder="Es. Agenzia Entrate" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Periodo / Scadenza</label>
          <input name="periodo" placeholder="Es. Entro 30 aprile" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Data scadenza</label>
          <input name="data_scadenza" type="date" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Incaricato</label>
          <input name="incaricato" placeholder="Es. Commercialista" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Ricorrente</label>
          <select name="ricorrente" style={inp} defaultValue="1">
            <option value="1">Sì (ogni anno)</option>
            <option value="0">No (una tantum)</option>
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Note</label>
          <textarea name="note" rows={2} style={{ ...inp, resize: 'vertical' }} />
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

// ─── Tabella ──────────────────────────────────────────────────────────────────

type SortDir = 'asc' | 'desc'
type ColKey = keyof Adempimento

type ColDef = { key: ColKey; label: string }

const COLS: ColDef[] = [
  { key: 'descrizione',  label: 'Descrizione'    },
  { key: 'ente',         label: 'Ente'           },
  { key: 'periodo',      label: 'Periodo'        },
  { key: 'data_scadenza',label: 'Scadenza'       },
  { key: 'incaricato',   label: 'Incaricato'     },
  { key: 'stato',        label: 'Stato'          },
  { key: 'ricorrente',   label: 'Ricorrente'     },
  { key: 'note',         label: 'Note'           },
]

export default function AdempimentiClient({ adempimenti }: { adempimenti: Adempimento[] }) {
  const annoCorrente = new Date().getFullYear()
  const anniDisponibili = useMemo(() => {
    const anni = new Set(adempimenti.map(a => a.anno))
    anni.add(annoCorrente)
    return Array.from(anni).sort((a, b) => b - a)
  }, [adempimenti, annoCorrente])

  const [anno, setAnno]           = useState(annoCorrente)
  const [sortKey, setSortKey]     = useState<ColKey>('data_scadenza')
  const [sortDir, setSortDir]     = useState<SortDir>('asc')
  const [filters, setFilters]     = useState<Record<string, string>>({})
  const [pending, startT]         = useTransition()
  const [errori, setErrori]       = useState<Record<number, string>>({})

  const lista = useMemo(() => adempimenti.filter(a => a.anno === anno), [adempimenti, anno])

  const filtered = useMemo(() => {
    return lista.filter(a =>
      COLS.every(col => {
        const fv = filters[col.key] ?? ''
        if (!fv) return true
        const val = a[col.key]
        if (col.key === 'stato') {
          const s = STATI.find(x => x.value === a.stato)
          return s?.label.toLowerCase().includes(fv.toLowerCase())
        }
        if (col.key === 'ricorrente') return fv === 'all' || (fv === '1' ? a.ricorrente === 1 : a.ricorrente === 0)
        return String(val ?? '').toLowerCase().includes(fv.toLowerCase())
      })
    )
  }, [lista, filters])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? ''
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, sortKey, sortDir])

  function handleSort(key: ColKey) {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function handleCiclaStato(id: number, nextStato: string) {
    const fd = new FormData()
    fd.set('id', String(id))
    fd.set('stato', nextStato)
    startT(async () => { await updateStato(null, fd) })
  }

  async function handleDuplica(id: number) {
    const fd = new FormData()
    fd.set('id', String(id))
    startT(async () => {
      const res = await duplicaAnno(null, fd)
      if (res?.error) setErrori(prev => ({ ...prev, [id]: res.error! }))
      else setErrori(prev => { const n = { ...prev }; delete n[id]; return n })
    })
  }

  // Contatori per anno selezionato
  const totale     = lista.length
  const daFare     = lista.filter(a => a.stato === 'da_fare').length
  const inCorso    = lista.filter(a => a.stato === 'in_corso').length
  const completati = lista.filter(a => a.stato === 'completato').length

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

  return (
    <div>
      {/* Filtro anno + riepilogo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>Anno:</label>
          <select value={anno} onChange={e => setAnno(Number(e.target.value))}
            style={{ padding: '6px 10px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4, fontFamily: 'inherit' }}>
            {anniDisponibili.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: `Totale: ${totale}`,       bg: '#eee',     col: '#333'    },
            { label: `Da fare: ${daFare}`,       bg: '#ffebee',  col: '#c62828' },
            { label: `In corso: ${inCorso}`,     bg: '#fff3e0',  col: '#e65100' },
            { label: `Completati: ${completati}`,bg: '#e8f5e9',  col: '#2e7d32' },
          ].map(b => (
            <span key={b.label} style={{
              padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600,
              background: b.bg, color: b.col,
            }}>{b.label}</span>
          ))}
        </div>
      </div>

      <AddForm anno={anno} />

      {lista.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 13 }}>Nessun adempimento per il {anno}.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {COLS.map(col => (
                  <th key={col.key} style={thBase} onClick={() => handleSort(col.key)}>
                    {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  </th>
                ))}
                <th style={{ ...thBase, cursor: 'default' }}>Azioni</th>
              </tr>
              <tr style={{ background: '#f5f5f5' }}>
                {COLS.map(col => (
                  <th key={col.key} style={{ padding: '4px 6px' }}>
                    {col.key === 'ricorrente' ? (
                      <select style={inpF} onChange={e => setFilters(p => ({ ...p, [col.key]: e.target.value }))}>
                        <option value="">Tutti</option>
                        <option value="1">Sì</option>
                        <option value="0">No</option>
                      </select>
                    ) : col.key === 'stato' ? (
                      <select style={inpF} onChange={e => setFilters(p => ({ ...p, [col.key]: e.target.value }))}>
                        <option value="">Tutti</option>
                        {STATI.map(s => <option key={s.value} value={s.label}>{s.label}</option>)}
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
              {sorted.map((a, i) => (
                <tr key={a.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ ...tdBase, fontWeight: 600, maxWidth: 220 }}>{a.descrizione}</td>
                  <td style={tdBase}>{a.ente}</td>
                  <td style={tdBase}>{a.periodo}</td>
                  <td style={tdBase}>{a.data_scadenza?.slice(0, 10) ?? '—'}</td>
                  <td style={tdBase}>{a.incaricato}</td>
                  <td style={{ ...tdBase, textAlign: 'center' }}>
                    <StatoBadge adempimento={a} onCicla={next => handleCiclaStato(a.id, next)} />
                  </td>
                  <td style={{ ...tdBase, textAlign: 'center', color: a.ricorrente ? '#2e7d32' : '#999' }}>
                    {a.ricorrente ? '✓ Sì' : 'No'}
                  </td>
                  <td style={{ ...tdBase, color: '#666', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.note ?? ''}
                  </td>
                  <td style={{ ...tdBase, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 6, flexDirection: 'column', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {a.ricorrente === 1 && (
                          <button onClick={() => handleDuplica(a.id)} disabled={pending}
                            style={{
                              padding: '3px 8px', fontSize: 11, fontFamily: 'inherit',
                              border: '1px solid #1565c0', borderRadius: 4, cursor: 'pointer',
                              background: '#e3f2fd', color: '#1565c0', whiteSpace: 'nowrap',
                            }}>
                            → {a.anno + 1}
                          </button>
                        )}
                        <form action={async (fd) => { startT(async () => { await deleteAdempimento(null, fd) }) }}>
                          <input type="hidden" name="id" value={a.id} />
                          <button type="submit" disabled={pending} className="btn-red"
                            style={{ padding: '3px 10px', fontSize: 11 }}
                            onClick={e => { if (!confirm('Eliminare?')) e.preventDefault() }}>
                            Elimina
                          </button>
                        </form>
                      </div>
                      {errori[a.id] && (
                        <span style={{ fontSize: 10, color: '#c00' }}>{errori[a.id]}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={COLS.length + 1} style={{ ...tdBase, color: '#aaa', textAlign: 'center' }}>
                    Nessun risultato.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
