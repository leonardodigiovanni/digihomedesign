'use client'

import React, { useState, useMemo, useTransition, useRef, useEffect } from 'react'
import { addCompito, updateStato, deleteCompito, type MutResult } from './actions'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type Compito = {
  id: number
  titolo: string
  descrizione: string | null
  assegnato_a: string
  assegnato_nome: string   // display name ricavato da users
  creato_da: string
  priorita: 'bassa' | 'normale' | 'alta' | 'urgente'
  stato: 'da_fare' | 'in_corso' | 'completato'
  data_scadenza: string | null
  created_at: string
}

export type Utente = { username: string; nome: string; cognome: string; role: string }

// ─── Costanti ─────────────────────────────────────────────────────────────────

const PRIORITA = [
  { value: 'bassa',   label: 'Bassa',   color: '#757575' },
  { value: 'normale', label: 'Normale', color: '#1565c0' },
  { value: 'alta',    label: 'Alta',    color: '#e65100' },
  { value: 'urgente', label: 'Urgente', color: '#c62828' },
] as const

const STATI = [
  { value: 'da_fare',   label: 'Da fare',   color: '#757575' },
  { value: 'in_corso',  label: 'In corso',  color: '#e65100' },
  { value: 'completato',label: 'Completato',color: '#2e7d32' },
] as const

function PrioritaBadge({ p }: { p: string }) {
  const def = PRIORITA.find(x => x.value === p) ?? PRIORITA[1]
  return (
    <span style={{
      background: def.color, color: '#fff', borderRadius: 4,
      padding: '2px 8px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
    }}>{def.label}</span>
  )
}

function StatoBadge({ s }: { s: string }) {
  const def = STATI.find(x => x.value === s) ?? STATI[0]
  return (
    <span style={{
      background: def.color, color: '#fff', borderRadius: 4,
      padding: '2px 8px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
    }}>{def.label}</span>
  )
}

// ─── Select cambio stato (inline) ────────────────────────────────────────────

function StatoSelect({ compito }: { compito: Compito }) {
  const router = useRouter()
  const [result, action, pending] = useActionState<MutResult | null, FormData>(updateStato, null)
  const [stato, setStato] = useState(compito.stato)
  const dirty = stato !== compito.stato

  useEffect(() => { if (result?.ok) router.refresh() }, [result])

  return (
    <form action={action} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <input type="hidden" name="id" value={compito.id} />
      <select name="stato" value={stato} onChange={e => setStato(e.target.value as typeof stato)}
        style={{ padding: '3px 6px', fontSize: 12, border: '1px solid #ccc', borderRadius: 4, fontFamily: 'inherit', background: '#fff' }}>
        {STATI.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
      {dirty && (
        <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'}
          style={{ padding: '3px 8px', fontSize: 11, fontFamily: 'inherit' }}>
          {pending ? '…' : '✓'}
        </button>
      )}
    </form>
  )
}

// ─── Form nuovo compito ───────────────────────────────────────────────────────

function AddCompitoForm({ utenti, currentUser }: { utenti: Utente[]; currentUser: string }) {
  const [open, setOpen] = useState(false)
  const [result, action, pending] = useActionState<MutResult | null, FormData>(addCompito, null)
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (result?.ok) { router.refresh(); formRef.current?.reset(); setOpen(false) }
  }, [result])

  const inp: React.CSSProperties = {
    padding: '6px 9px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  }

  if (!open) return (
    <button className="btn-green" onClick={() => setOpen(true)}
      style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
      + Nuovo compito
    </button>
  )

  return (
    <form ref={formRef} action={action} style={{
      background: '#f8f8f8', border: '1px solid #ddd', borderRadius: 8,
      padding: '18px 22px', marginBottom: 24,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Titolo *</label>
          <input name="titolo" required style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Assegna a *</label>
          <select name="assegnato_a" required style={inp} defaultValue={currentUser}>
            <option value="">— Seleziona —</option>
            {utenti.map(u => (
              <option key={u.username} value={u.username}>
                {u.nome} {u.cognome} ({u.username}){u.username === currentUser ? ' — io' : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Priorità</label>
          <select name="priorita" style={inp} defaultValue="normale">
            {PRIORITA.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Scadenza</label>
          <input name="data_scadenza" type="date" style={inp} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Descrizione</label>
          <textarea name="descrizione" rows={2} style={{ ...inp, resize: 'vertical' }} />
        </div>
      </div>
      {result && !result.ok && (
        <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{result.error}</div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-green" disabled={pending}
          style={{ padding: '6px 16px', fontSize: 13, fontWeight: 600 }}>
          {pending ? 'Salvataggio...' : 'Salva'}
        </button>
        <button type="button" className="btn-gray" onClick={() => setOpen(false)}
          style={{ padding: '6px 16px', fontSize: 13 }}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Riga tabella ─────────────────────────────────────────────────────────────

function CompitoRow({
  compito, isGestore, rowIndex,
}: {
  compito: Compito; isGestore: boolean; rowIndex: number
}) {
  const router = useRouter()
  const [result, action, pending] = useActionState<MutResult | null, FormData>(deleteCompito, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])

  const scaduta = compito.data_scadenza && compito.stato !== 'completato'
    && new Date(compito.data_scadenza + 'T23:59:59') < new Date()

  const td: React.CSSProperties = {
    padding: '8px 12px', borderBottom: '1px solid #eee',
    verticalAlign: 'middle', fontSize: 13,
    background: compito.stato === 'completato'
      ? (rowIndex % 2 === 0 ? '#f9fff9' : '#f4fdf4')
      : (rowIndex % 2 === 0 ? '#fff' : '#fafafa'),
  }

  return (
    <tr>
      <td style={{ ...td, fontWeight: 600, maxWidth: 220 }}>
        {compito.titolo}
        {compito.descrizione && (
          <div style={{ fontWeight: 400, fontSize: 11, color: '#888', marginTop: 2, whiteSpace: 'pre-wrap' }}>
            {compito.descrizione}
          </div>
        )}
      </td>
      {isGestore && (
        <td style={{ ...td, whiteSpace: 'nowrap' }}>
          <div style={{ fontWeight: 600 }}>{compito.assegnato_nome}</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>{compito.assegnato_a}</div>
        </td>
      )}
      <td style={{ ...td, textAlign: 'center' }}><PrioritaBadge p={compito.priorita} /></td>
      <td style={{ ...td, textAlign: 'center' }}><StatoBadge s={compito.stato} /></td>
      <td style={{ ...td, whiteSpace: 'nowrap', color: scaduta ? '#c62828' : '#555', fontWeight: scaduta ? 700 : 400 }}>
        {compito.data_scadenza ?? '—'}
        {scaduta && <span style={{ fontSize: 10, display: 'block' }}>SCADUTA</span>}
      </td>
      {isGestore && (
        <td style={{ ...td, color: '#888', fontSize: 12, whiteSpace: 'nowrap' }}>{compito.creato_da}</td>
      )}
      <td style={{ ...td }}>
        <StatoSelect compito={compito} />
      </td>
      {isGestore && (
        <td style={{ ...td }}>
          <form action={action}>
            <input type="hidden" name="id" value={compito.id} />
            <button type="submit" disabled={pending} className="btn-red"
              style={{ padding: '3px 10px', fontSize: 12 }}
              onClick={e => { if (!confirm('Eliminare questo compito?')) e.preventDefault() }}>
              {pending ? '…' : 'Elimina'}
            </button>
          </form>
        </td>
      )}
    </tr>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

type SortField = 'priorita' | 'stato' | 'data_scadenza' | 'assegnato_a' | 'created_at'

const PRIORITA_ORDER = { urgente: 0, alta: 1, normale: 2, bassa: 3 }
const STATO_ORDER    = { da_fare: 0, in_corso: 1, completato: 2 }

export default function WorklistClient({
  compiti, utenti, isGestore, currentUser,
}: {
  compiti: Compito[]
  utenti: Utente[]
  isGestore: boolean
  currentUser: string
}) {
  const [filtroStato, setFiltroStato]       = useState('')
  const [filtroPriorita, setFiltroPriorita] = useState('')
  const [filtroUtente, setFiltroUtente]     = useState('')
  const [sortField, setSortField]           = useState<SortField>('priorita')
  const [sortDir, setSortDir]               = useState<'asc' | 'desc'>('asc')

  function toggleSort(f: SortField) {
    if (f === sortField) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(f); setSortDir('asc') }
  }

  const filtrati = useMemo(() => compiti.filter(c => {
    if (filtroStato    && c.stato    !== filtroStato)    return false
    if (filtroPriorita && c.priorita !== filtroPriorita) return false
    if (filtroUtente   && c.assegnato_a !== filtroUtente) return false
    return true
  }), [compiti, filtroStato, filtroPriorita, filtroUtente])

  const ordinati = useMemo(() => [...filtrati].sort((a, b) => {
    let av: number | string, bv: number | string
    if (sortField === 'priorita') {
      av = PRIORITA_ORDER[a.priorita]; bv = PRIORITA_ORDER[b.priorita]
    } else if (sortField === 'stato') {
      av = STATO_ORDER[a.stato]; bv = STATO_ORDER[b.stato]
    } else {
      av = a[sortField] ?? ''; bv = b[sortField] ?? ''
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ?  1 : -1
    return 0
  }), [filtrati, sortField, sortDir])

  const selInp: React.CSSProperties = {
    padding: '6px 10px', fontSize: 13, border: '1px solid #ccc',
    borderRadius: 4, fontFamily: 'inherit',
  }

  const thS = (f?: SortField): React.CSSProperties => ({
    padding: '8px 12px', color: '#c8960c', fontSize: 12, fontWeight: 600,
    textAlign: 'left', whiteSpace: 'nowrap', borderBottom: '2px solid #444',
    background: '#2a2a3e', cursor: f ? 'pointer' : 'default', userSelect: 'none',
  })

  function SortIcon({ f }: { f: SortField }) {
    if (f !== sortField) return <span style={{ color: '#666', marginLeft: 4 }}>↕</span>
    return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
  }

  return (
    <div>
      {/* Filtri */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filtroStato} onChange={e => setFiltroStato(e.target.value)} style={selInp}>
          <option value="">Tutti gli stati</option>
          {STATI.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={filtroPriorita} onChange={e => setFiltroPriorita(e.target.value)} style={selInp}>
          <option value="">Tutte le priorità</option>
          {PRIORITA.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        {isGestore && (
          <select value={filtroUtente} onChange={e => setFiltroUtente(e.target.value)} style={selInp}>
            <option value="">Tutti gli utenti</option>
            {utenti.map(u => (
              <option key={u.username} value={u.username}>
                {u.nome} {u.cognome}
              </option>
            ))}
          </select>
        )}
        <span style={{ fontSize: 13, color: '#888' }}>{ordinati.length} compiti</span>
      </div>

      {isGestore && <AddCompitoForm utenti={utenti} currentUser={currentUser} />}

      {ordinati.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 13 }}>
          {compiti.length === 0 ? 'Nessun compito presente.' : 'Nessun risultato.'}
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thS()}>Compito</th>
                {isGestore && <th style={{ ...thS('assegnato_a'), cursor: 'pointer' }} onClick={() => toggleSort('assegnato_a')}>
                  Assegnato a <SortIcon f="assegnato_a" />
                </th>}
                <th style={thS('priorita')} onClick={() => toggleSort('priorita')}>
                  Priorità <SortIcon f="priorita" />
                </th>
                <th style={thS('stato')} onClick={() => toggleSort('stato')}>
                  Stato <SortIcon f="stato" />
                </th>
                <th style={thS('data_scadenza')} onClick={() => toggleSort('data_scadenza')}>
                  Scadenza <SortIcon f="data_scadenza" />
                </th>
                {isGestore && <th style={thS()}>Creato da</th>}
                <th style={thS()}>Cambia stato</th>
                {isGestore && <th style={thS()}></th>}
              </tr>
            </thead>
            <tbody>
              {ordinati.map((c, i) => (
                <CompitoRow key={c.id} compito={c} isGestore={isGestore} rowIndex={i} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
