'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addOrdineFornitore, updateStatoFornitore, deleteOrdineFornitore, type MutResult } from './actions'

export type OrdineFornitore = {
  id: number
  numero_ordine: string
  fornitore: string
  descrizione: string
  stato: string
  totale: number
  data_ordine: string
  created_by: string
  created_at: string
}

const STATI = ['bozza','inviato','confermato','ricevuto','annullato'] as const
type Stato = typeof STATI[number]

const STATO_COLORS: Record<Stato, [string,string]> = {
  bozza:      ['#718096','#edf2f7'],
  inviato:    ['#2b6cb0','#ebf8ff'],
  confermato: ['#276749','#f0fff4'],
  ricevuto:   ['#1a1a1a','#f7f7f7'],
  annullato:  ['#c00','#fff5f5'],
}

const btnBase: React.CSSProperties = {
  padding: '8px 18px', fontSize: 14, borderRadius: 6,
  fontFamily: 'inherit',
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
  return <span style={{ color, background: bg, fontWeight: 600, fontSize: 11, padding: '3px 9px', borderRadius: 10 }}>{stato}</span>
}

function SortIcon({ col, sortCol, sortDir }: { col: string; sortCol: string; sortDir: 'asc'|'desc' }) {
  if (col !== sortCol) return <span style={{ color: '#ccc', marginLeft: 4 }}>↕</span>
  return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
}

function StatoRow({ ordine, role }: { ordine: OrdineFornitore; role: string }) {
  const router = useRouter()
  const [stato, setStato] = useState(ordine.stato)
  const dirty = stato !== ordine.stato
  const [result, action, pending] = useActionState<MutResult | null, FormData>(updateStatoFornitore, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  return (
    <form action={action} style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
      <input type="hidden" name="id" value={ordine.id} />
      <select name="stato" value={stato} onChange={e => setStato(e.target.value)}
        style={{ padding: '3px 6px', fontSize: 12, border: '1px solid #ccc', borderRadius: 5, fontFamily: 'inherit', background: '#fff' }}>
        {STATI.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      {dirty && (
        <button type="submit" disabled={pending}
          className={pending ? 'btn-gray' : 'btn-green'}
          style={{ padding: '3px 8px', fontSize: 11, borderRadius: 4, fontFamily: 'inherit' }}>
          {pending ? '…' : '✓'}
        </button>
      )}
    </form>
  )
}

function DeleteBtn({ id, role }: { id: number; role: string }) {
  const router = useRouter()
  const [result, action, pending] = useActionState<MutResult | null, FormData>(deleteOrdineFornitore, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  if (role !== 'admin') return null
  return (
    <form action={action} onSubmit={e => { if (!confirm('Eliminare?')) e.preventDefault() }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending}
        className={pending ? 'btn-gray' : 'btn-red'}
        style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, fontFamily: 'inherit' }}>
        {pending ? '…' : 'Elimina'}
      </button>
    </form>
  )
}

function AddModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [result, formAction, pending] = useActionState<MutResult | null, FormData>(addOrdineFornitore, null)
  useEffect(() => { if (result?.ok) { router.refresh(); onClose() } }, [result])
  const today = new Date().toISOString().slice(0, 10)
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', width: '100%', maxWidth: 520, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Nuovo ordine a fornitore</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <F label="N° ordine" name="numero_ordine" type="text" placeholder="ORD-2026-001" />
            <F label="Fornitore *" name="fornitore" type="text" placeholder="es. Edilforniture SRL" required />
          </div>
          <F label="Descrizione" name="descrizione" type="text" placeholder="Materiali, riferimenti…" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <F label="Totale (€)" name="totale" type="number" placeholder="0.00" step="0.01" min="0" />
            <F label="Data ordine *" name="data_ordine" type="date" defaultValue={today} required />
          </div>
          {result && !result.ok && (
            <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>{result.error}</div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-red" style={btnBase}>Annulla</button>
            <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={btnBase}>
              {pending ? 'Salvataggio…' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function F({ label, name, type, placeholder, step, min, required, defaultValue }: {
  label: string; name: string; type: string; placeholder?: string;
  step?: string; min?: string; required?: boolean; defaultValue?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>{label}</label>
      <input name={name} type={type} placeholder={placeholder} step={step} min={min}
        required={required} defaultValue={defaultValue}
        style={{ padding: '8px 10px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
    </div>
  )
}

type SortCol = 'numero_ordine'|'fornitore'|'stato'|'totale'|'data_ordine'|'created_by'

export default function OrdiniForniClient({ ordini, role }: { ordini: OrdineFornitore[]; role: string }) {
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch]       = useState('')
  const [statoFilter, setStatoFilter] = useState('')
  const [sortCol, setSortCol]     = useState<SortCol>('data_ordine')
  const [sortDir, setSortDir]     = useState<'asc'|'desc'>('desc')

  function handleSort(col: SortCol) {
    if (col === sortCol) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const filtered = ordini
    .filter(o => {
      const q = search.toLowerCase()
      const matchText = !q || o.fornitore.toLowerCase().includes(q) || o.numero_ordine.toLowerCase().includes(q) || o.descrizione.toLowerCase().includes(q)
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
    { key: 'fornitore',     label: 'Fornitore' },
    { key: 'stato',         label: 'Stato' },
    { key: 'totale',        label: 'Totale (€)' },
    { key: 'data_ordine',   label: 'Data' },
    { key: 'created_by',    label: 'Creato da' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showModal && <AddModal onClose={() => setShowModal(false)} />}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="Cerca fornitore, numero, descrizione…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
        <select value={statoFilter} onChange={e => setStatoFilter(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', background: '#fff' }}>
          <option value="">Tutti gli stati</option>
          {STATI.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowModal(true)} className="btn-green" style={{ ...btnBase, whiteSpace: 'nowrap' }}>
          + Nuovo ordine
        </button>
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
                <th style={{ ...thStyle, cursor: 'default' }}>Cambia stato</th>
                {role === 'admin' && <th style={{ ...thStyle, cursor: 'default' }}>Azioni</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Nessun ordine trovato.</td></tr>
              ) : filtered.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{o.numero_ordine || '—'}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center' }}>{o.fornitore}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}><StatoBadge stato={o.stato} /></td>
                  <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center' }}>€ {Number(o.totale).toFixed(2)}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center', whiteSpace: 'nowrap' }}>{formatDate(o.data_ordine)}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#888', textAlign: 'center' }}>{o.created_by}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#666', maxWidth: 200 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.descrizione || <span style={{ color: '#ccc' }}>—</span>}</div>
                  </td>
                  <td style={{ padding: '8px 14px', textAlign: 'center' }}><StatoRow ordine={o} role={role} /></td>
                  {role === 'admin' && <td style={{ padding: '10px 14px', textAlign: 'center' }}><DeleteBtn id={o.id} role={role} /></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
