'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addOrdineRicevuto, updateStatoRicevuto, deleteOrdineRicevuto, addNota, deleteNota, type MutResult } from './actions'

export type Nota = {
  id: number
  testo: string
  autore: string
  created_at: string
}

export type OrdineRicevuto = {
  id: number
  numero_ordine: string
  cliente: string
  descrizione: string
  stato: string
  totale: number
  data_ordine: string
  created_at: string
  note: Nota[]
}

const STATI = ['nuovo','in_lavorazione','completato','annullato'] as const
type Stato = typeof STATI[number]

const STATO_COLORS: Record<Stato, [string,string]> = {
  nuovo:          ['#2b6cb0','#ebf8ff'],
  in_lavorazione: ['#c47c2a','#fffbeb'],
  completato:     ['#276749','#f0fff4'],
  annullato:      ['#c00','#fff5f5'],
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
function formatDateTime(s: string) {
  return new Date(s).toLocaleString('it-IT', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
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

function StatoRow({ ordine }: { ordine: OrdineRicevuto }) {
  const router = useRouter()
  const [stato, setStato] = useState(ordine.stato)
  const dirty = stato !== ordine.stato
  const [result, action, pending] = useActionState<MutResult | null, FormData>(updateStatoRicevuto, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  return (
    <form action={action} style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
      <input type="hidden" name="id" value={ordine.id} />
      <select name="stato" value={stato} onChange={e => setStato(e.target.value)}
        style={{ padding: '3px 6px', fontSize: 12, border: '1px solid #ccc', borderRadius: 5, fontFamily: 'inherit', background: '#fff' }}>
        {STATI.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
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

function DeleteOrdineBtn({ id, role }: { id: number; role: string }) {
  const router = useRouter()
  const [result, action, pending] = useActionState<MutResult | null, FormData>(deleteOrdineRicevuto, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  if (role !== 'admin') return null
  return (
    <form action={action} onSubmit={e => { if (!confirm('Eliminare questo ordine?')) e.preventDefault() }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending}
        className={pending ? 'btn-gray' : 'btn-red'}
        style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, fontFamily: 'inherit' }}>
        {pending ? '…' : 'Elimina'}
      </button>
    </form>
  )
}

function NotaItem({ nota, role }: { nota: Nota; role: string }) {
  const router = useRouter()
  const [result, action, pending] = useActionState<MutResult | null, FormData>(deleteNota, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  return (
    <div style={{ background: '#fffbf0', border: '1px solid #f0e6c0', borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 10 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: '#1a1a1a', lineHeight: 1.5 }}>{nota.testo}</div>
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
          <strong style={{ color: '#555' }}>{nota.autore}</strong> · {formatDateTime(nota.created_at)}
        </div>
      </div>
      {role === 'admin' && (
        <form action={action} onSubmit={e => { if (!confirm('Eliminare questa nota?')) e.preventDefault() }}>
          <input type="hidden" name="id" value={nota.id} />
          <button type="submit" disabled={pending}
            style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 14, padding: 0 }}>✕</button>
        </form>
      )}
    </div>
  )
}

function AddNotaForm({ ordineId }: { ordineId: number }) {
  const router = useRouter()
  const [result, formAction, pending] = useActionState<MutResult | null, FormData>(addNota, null)
  const ref = useRef<HTMLFormElement>(null)
  useEffect(() => { if (result?.ok) { router.refresh(); ref.current?.reset() } }, [result])
  return (
    <form ref={ref} action={formAction} style={{ display: 'flex', gap: 8 }}>
      <input type="hidden" name="ordine_id" value={ordineId} />
      <textarea name="testo" required rows={2} placeholder="Aggiungi una nota interna…"
        style={{ flex: 1, padding: '8px 10px', fontSize: 13, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', resize: 'vertical' }} />
      <button type="submit" disabled={pending}
        className={pending ? 'btn-gray' : 'btn-green'}
        style={{ padding: '8px 16px', fontSize: 13, borderRadius: 6, fontFamily: 'inherit', alignSelf: 'flex-end' }}>
        {pending ? '…' : 'Aggiungi'}
      </button>
    </form>
  )
}

function NotePanel({ ordine, role }: { ordine: OrdineRicevuto; role: string }) {
  return (
    <div style={{ background: '#fafaf8', border: '1px solid #e8e4d8', borderRadius: 10, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Note interne — {ordine.note.length} {ordine.note.length === 1 ? 'nota' : 'note'}
      </div>
      {ordine.note.length === 0 && (
        <div style={{ fontSize: 13, color: '#bbb', fontStyle: 'italic' }}>Nessuna nota ancora.</div>
      )}
      {ordine.note.map(n => <NotaItem key={n.id} nota={n} role={role} />)}
      <AddNotaForm ordineId={ordine.id} />
    </div>
  )
}

function OrdineRow({ ordine, role, colCount }: { ordine: OrdineRicevuto; role: string; colCount: number }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <tr style={{ borderBottom: expanded ? 'none' : '1px solid #f0f0f0', cursor: 'pointer', background: expanded ? '#fffef8' : '#fff' }}
        onClick={() => setExpanded(e => !e)}>
        <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
          <span style={{ marginRight: 6, color: '#aaa', fontSize: 11 }}>{expanded ? '▲' : '▼'}</span>
          {ordine.numero_ordine || '—'}
        </td>
        <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center' }}>{ordine.cliente}</td>
        <td style={{ padding: '10px 14px', textAlign: 'center' }}><StatoBadge stato={ordine.stato} /></td>
        <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center' }}>€ {Number(ordine.totale).toFixed(2)}</td>
        <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center', whiteSpace: 'nowrap' }}>{formatDate(ordine.data_ordine)}</td>
        <td style={{ padding: '10px 14px', fontSize: 12, color: '#666', maxWidth: 220 }} onClick={e => e.stopPropagation()}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ordine.descrizione || <span style={{ color: '#ccc' }}>—</span>}</div>
        </td>
        <td style={{ padding: '8px 14px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
          <StatoRow ordine={ordine} />
        </td>
        {role === 'admin' && (
          <td style={{ padding: '10px 14px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <DeleteOrdineBtn id={ordine.id} role={role} />
          </td>
        )}
      </tr>
      {expanded && (
        <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fffef8' }}>
          <td colSpan={colCount} style={{ padding: '0 20px 16px' }}>
            <NotePanel ordine={ordine} role={role} />
          </td>
        </tr>
      )}
    </>
  )
}

function AddModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [result, formAction, pending] = useActionState<MutResult | null, FormData>(addOrdineRicevuto, null)
  useEffect(() => { if (result?.ok) { router.refresh(); onClose() } }, [result])
  const today = new Date().toISOString().slice(0, 10)
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', width: '100%', maxWidth: 520, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Nuovo ordine ricevuto</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <F label="N° ordine" name="numero_ordine" type="text" placeholder="ORD-2026-001" />
            <F label="Cliente (username) *" name="cliente" type="text" placeholder="es. mario.rossi" required />
          </div>
          <F label="Descrizione" name="descrizione" type="text" placeholder="Descrizione ordine…" />
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

type SortCol = 'numero_ordine'|'cliente'|'stato'|'totale'|'data_ordine'

export default function OrdiniRicevutiClient({ ordini, role }: { ordini: OrdineRicevuto[]; role: string }) {
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
      const matchText = !q || o.cliente.toLowerCase().includes(q) || o.numero_ordine.toLowerCase().includes(q) || o.descrizione.toLowerCase().includes(q)
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
    { key: 'cliente',       label: 'Cliente' },
    { key: 'stato',         label: 'Stato' },
    { key: 'totale',        label: 'Totale (€)' },
    { key: 'data_ordine',   label: 'Data' },
  ]

  const colCount = cols.length + 2 + (role === 'admin' ? 1 : 0) // +desc +cambia_stato +elimina

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showModal && <AddModal onClose={() => setShowModal(false)} />}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="Cerca cliente, numero, descrizione…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
        <select value={statoFilter} onChange={e => setStatoFilter(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', background: '#fff' }}>
          <option value="">Tutti gli stati</option>
          {STATI.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
        </select>
        <button onClick={() => setShowModal(true)} className="btn-green" style={{ ...btnBase, whiteSpace: 'nowrap' }}>
          + Nuovo ordine
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
            Ordini{(search||statoFilter) ? ` — ${filtered.length} risultati` : ` — ${ordini.length} totali`}
          </h3>
          <span style={{ fontSize: 12, color: '#aaa' }}>Clicca su una riga per vedere le note interne</span>
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
                <tr><td colSpan={colCount} style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Nessun ordine trovato.</td></tr>
              ) : filtered.map(o => (
                <OrdineRow key={o.id} ordine={o} role={role} colCount={colCount} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
