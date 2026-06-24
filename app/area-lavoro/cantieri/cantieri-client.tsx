'use client'

import React, { useState, useMemo, useTransition, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import {
  addCantiere, deleteCantiere, updateStatoCantiere, toggleVisibileCantiere,
  assignClienteToCantiere,
  addTask, updateTask, deleteTask,
  addMedia, deleteMedia,
} from './actions'
import { cantiereSrc } from '@/lib/media-src'

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type Cliente = { id: number; nome: string; cognome: string; ragione_sociale: string; email: string }

export type Task = {
  id: number; cantiere_id: number; descrizione: string
  data_inizio: string | null; data_fine: string | null; note: string | null
  stato: 'da_fare' | 'in_corso' | 'completato' | 'sospeso'
  created_at: string
}

export type Media = {
  id: number; task_id: number; tipo: 'foto' | 'video'
  filename: string; descrizione: string | null; visto: number
}

export type Cantiere = {
  id: number; cliente_id: number | null; titolo: string; indirizzo: string
  stato: 'preventivo' | 'in_corso' | 'completato' | 'sospeso'
  data_preventivo: string | null; inizio_lavori: string | null; fine_lavori: string | null
  note_pubbliche: string | null; note_interne: string | null
  created_at: string; visibile_cliente: number
  cliente_nome?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATI_CANTIERE = [
  { value: 'preventivo', label: 'Preventivo', bg: '#1565c0' },
  { value: 'in_corso',   label: 'In corso',   bg: '#e65100' },
  { value: 'completato', label: 'Completato', bg: '#2e7d32' },
  { value: 'sospeso',    label: 'Sospeso',    bg: '#757575' },
]

function StatoBadge({ stato }: { stato: string }) {
  const s = STATI_CANTIERE.find(x => x.value === stato) ?? STATI_CANTIERE[0]
  return (
    <span style={{
      background: s.bg, color: '#fff', borderRadius: 4,
      padding: '2px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
    }}>{s.label}</span>
  )
}

function nomeCliente(c: Cliente) {
  return c.ragione_sociale || `${c.cognome} ${c.nome}`.trim()
}

const inp: React.CSSProperties = {
  padding: '5px 8px', border: '1px solid #ccc', borderRadius: 4,
  fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff',
}

const inpSm: React.CSSProperties = {
  padding: '4px 7px', border: '1px solid #ccc', borderRadius: 4,
  fontSize: 12, fontFamily: 'inherit', boxSizing: 'border-box',
}

// ─── ClienteSelect ────────────────────────────────────────────────────────────

function ClienteSelect({
  clienti, name, defaultId, placeholder = 'Cerca cliente (opzionale)...',
}: {
  clienti: Cliente[]; name: string; defaultId?: number | null; placeholder?: string
}) {
  const defaultCliente = clienti.find(c => c.id === defaultId) ?? null
  const [selected, setSelected] = useState<Cliente | null>(defaultCliente)
  const [query, setQuery]       = useState(defaultCliente ? nomeCliente(defaultCliente) : '')
  const [open, setOpen]         = useState(false)

  const filtered = query
    ? clienti.filter(c => nomeCliente(c).toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : clienti.slice(0, 8)

  function pick(c: Cliente) {
    setSelected(c); setQuery(nomeCliente(c)); setOpen(false)
  }
  function clear() {
    setSelected(null); setQuery(''); setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 4 }}>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          style={{ ...inp, flex: 1 }}
          autoComplete="off"
        />
        {selected && (
          <button type="button" onClick={clear}
            style={{ padding: '0 8px', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', background: '#f5f5f5', fontSize: 13 }}>
            ✕
          </button>
        )}
      </div>
      <input type="hidden" name={name} value={selected?.id ?? ''} />
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
          background: '#fff', border: '1px solid #ccc', borderRadius: 4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxHeight: 200, overflowY: 'auto',
        }}>
          {filtered.map(c => (
            <div key={c.id} onMouseDown={() => pick(c)} style={{
              padding: '7px 10px', fontSize: 13, cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              {nomeCliente(c)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Form nuovo cantiere ──────────────────────────────────────────────────────

function AddCantiereForm({ clienti }: { clienti: Cliente[] }) {
  const [open, setOpen]   = useState(false)
  const [error, setError] = useState('')
  const [pending, startT] = useTransition()
  const formRef           = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError('')
    startT(async () => {
      const res = await addCantiere(null, fd)
      if (res?.error) { setError(res.error); return }
      formRef.current?.reset()
      setOpen(false)
    })
  }

  if (!open) return (
    <button className="btn-green" onClick={() => setOpen(true)}
      style={{ marginBottom: 20 }}>
      + Nuovo cantiere
    </button>
  )

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{
      background: '#f8f8f8', border: '1px solid #ddd', borderRadius: 8,
      padding: '18px 22px', marginBottom: 24,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Titolo *</label>
          <input name="titolo" required style={inp} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Cliente</label>
          <ClienteSelect clienti={clienti} name="cliente_id" />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Stato</label>
          <select name="stato" style={inp} defaultValue="preventivo">
            {STATI_CANTIERE.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Indirizzo lavori</label>
          <input name="indirizzo" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Data preventivo</label>
          <input name="data_preventivo" type="date" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Inizio lavori</label>
          <input name="inizio_lavori" type="date" style={inp} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Fine lavori</label>
          <input name="fine_lavori" type="date" style={inp} />
        </div>
      </div>
      {error && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-green" disabled={pending}>
          {pending ? 'Salvataggio...' : 'Salva'}
        </button>
        <button type="button" className="btn-gray" onClick={() => setOpen(false)}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Form task ────────────────────────────────────────────────────────────────

function AddTaskForm({ cantiereId, onDone }: { cantiereId: number; onDone: () => void }) {
  const [error, setError] = useState('')
  const [pending, startT] = useTransition()
  const formRef           = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError('')
    startT(async () => {
      const res = await addTask(null, fd)
      if (res?.error) { setError(res.error); return }
      formRef.current?.reset()
      onDone()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{
      background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 6,
      padding: '12px 14px', marginBottom: 10,
    }}>
      <input type="hidden" name="cantiere_id" value={cantiereId} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, marginBottom: 8 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Descrizione *</div>
          <input name="descrizione" required style={{ ...inpSm, width: '100%' }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Data inizio</div>
          <input name="data_inizio" type="date" style={{ ...inpSm, width: '100%' }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Data fine</div>
          <input name="data_fine" type="date" style={{ ...inpSm, width: '100%' }} />
        </div>
      </div>
      {error && <div style={{ color: '#c00', fontSize: 11, marginBottom: 6 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="submit" className="btn-green" disabled={pending}>
          {pending ? '...' : 'Salva task'}
        </button>
        <button type="button" className="btn-gray" onClick={onDone}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Upload media per task ────────────────────────────────────────────────────

function UploadMediaForm({ taskId }: { taskId: number }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [pending, startT]         = useTransition()
  const fileRef                   = useRef<HTMLInputElement>(null)
  const descRef                   = useRef<HTMLInputElement>(null)

  async function handleUpload() {
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('task_id', String(taskId))
      const res  = await fetch('/api/upload-cantiere', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) { setError(data.error); return }

      const afd = new FormData()
      afd.set('task_id',     String(taskId))
      afd.set('filename',    data.filename)
      afd.set('tipo',        data.tipo)
      afd.set('descrizione', descRef.current?.value ?? '')

      startT(async () => { await addMedia(null, afd) })
      if (fileRef.current) fileRef.current.value = ''
      if (descRef.current) descRef.current.value = ''
    } catch { setError('Errore durante upload.') }
    finally  { setUploading(false) }
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end', marginTop: 8 }}>
      <div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>File (foto/video)</div>
        <input ref={fileRef} type="file" accept="image/*,video/*" style={{ fontSize: 12 }} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Descrizione</div>
        <input ref={descRef} style={{ ...inpSm, width: 160 }} />
      </div>
      {error && <span style={{ fontSize: 11, color: '#c00' }}>{error}</span>}
      <button onClick={handleUpload} disabled={uploading || pending} className="btn-green">
        {uploading ? 'Caricamento...' : 'Carica'}
      </button>
    </div>
  )
}

// ─── Task item con media ──────────────────────────────────────────────────────

function TaskItem({
  task, media,
}: {
  task: Task; media: Media[]
}) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing]   = useState(false)
  const [pending, startT]       = useTransition()
  const [errEdit, setErrEdit]   = useState('')
  const formEditRef             = useRef<HTMLFormElement>(null)

  const taskMedia = media.filter(m => m.task_id === task.id)
  const nVisti    = taskMedia.filter(m => m.visto).length

  const STATI_TASK = [
    { value: 'da_fare',    label: 'Da fare'    },
    { value: 'in_corso',   label: 'In corso'   },
    { value: 'completato', label: 'Completato' },
    { value: 'sospeso',    label: 'Sospeso'    },
  ]

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setErrEdit('')
    startT(async () => {
      const res = await updateTask(null, fd)
      if (res?.error) { setErrEdit(res.error); return }
      setEditing(false)
    })
  }

  return (
    <div style={{
      border: '1px solid #e0e0e0', borderRadius: 6, marginBottom: 8,
      background: '#fff',
    }}>
      {/* Header task */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', cursor: 'pointer',
          borderRadius: expanded ? '6px 6px 0 0' : 6,
          background: expanded ? '#f0f4ff' : '#fff',
        }}
      >
        <span style={{ fontSize: 16, color: '#555' }}>{expanded ? '▾' : '▸'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{task.descrizione}</div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 2, display: 'flex', gap: 12 }}>
            {task.data_inizio && <span>Dal {task.data_inizio.slice(0, 10)}</span>}
            {task.data_fine   && <span>Al {task.data_fine.slice(0, 10)}</span>}
            {taskMedia.length > 0 && (
              <span style={{ color: nVisti === taskMedia.length ? '#2e7d32' : '#e65100' }}>
                {taskMedia.length} file · {nVisti} visti
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
          <button type="button" className="btn-gray" disabled={pending}
            onClick={e => { e.stopPropagation(); setEditing(v => !v); setExpanded(true) }}>
            {editing ? 'Annulla' : 'Modifica'}
          </button>
          <form action={async fd => { startT(async () => { await deleteTask(null, fd) }) }}
            onClick={e => e.stopPropagation()}>
            <input type="hidden" name="id" value={task.id} />
            <button type="submit" disabled={pending} className="btn-red"
              onClick={e => { e.stopPropagation(); if (!confirm('Eliminare il task e tutti i suoi media?')) e.preventDefault() }}>
              Elimina
            </button>
          </form>
        </div>
      </div>

      {/* Corpo espanso */}
      {expanded && (
        <div style={{ padding: '12px 14px', borderTop: '1px solid #e8e8e8' }}>

          {/* Form modifica */}
          {editing && (
            <form ref={formEditRef} onSubmit={handleUpdate} style={{
              background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 6,
              padding: '12px 14px', marginBottom: 14,
            }}>
              <input type="hidden" name="id" value={task.id} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, marginBottom: 8 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Descrizione *</div>
                  <input name="descrizione" required defaultValue={task.descrizione} style={{ ...inpSm, width: '100%' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Stato</div>
                  <select name="stato" defaultValue={task.stato} style={{ ...inpSm, width: '100%' }}>
                    {STATI_TASK.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Data inizio</div>
                  <input name="data_inizio" type="date" defaultValue={task.data_inizio?.slice(0,10) ?? ''} style={{ ...inpSm, width: '100%' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Data fine</div>
                  <input name="data_fine" type="date" defaultValue={task.data_fine?.slice(0,10) ?? ''} style={{ ...inpSm, width: '100%' }} />
                </div>
              </div>
              {errEdit && <div style={{ color: '#c00', fontSize: 11, marginBottom: 6 }}>{errEdit}</div>}
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="submit" className="btn-green" disabled={pending}>
                  {pending ? '...' : 'Salva modifiche'}
                </button>
                <button type="button" className="btn-gray" onClick={() => setEditing(false)}>Annulla</button>
              </div>
            </form>
          )}

          {/* Media */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
            {taskMedia.map(m => {
              const src = cantiereSrc(m.task_id, m.filename)
              return (
                <div key={m.id} style={{ position: 'relative', width: 140 }}>
                  {m.tipo === 'foto' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={m.descrizione ?? ''} style={{
                      width: 140, height: 100, objectFit: 'cover', borderRadius: 5, display: 'block',
                      border: '1px solid #ddd',
                    }} />
                  ) : (
                    <video src={src} controls style={{
                      width: 140, height: 100, borderRadius: 5, display: 'block',
                      border: '1px solid #ddd', objectFit: 'cover',
                    }} />
                  )}
                  {m.descrizione && (
                    <div style={{ fontSize: 10, color: '#555', marginTop: 2, textAlign: 'center' }}>{m.descrizione}</div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, alignItems: 'center' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      color: m.visto ? '#2e7d32' : '#bbb',
                    }}>
                      {m.visto ? '✓ Visto' : '○ Non visto'}
                    </span>
                    <form action={async fd => { startT(async () => { await deleteMedia(null, fd) }) }}>
                      <input type="hidden" name="id" value={m.id} />
                      <button type="submit" disabled={pending} className="btn-red"
                        onClick={e => { if (!confirm('Eliminare?')) e.preventDefault() }}>✕</button>
                    </form>
                  </div>
                </div>
              )
            })}
          </div>

          <UploadMediaForm taskId={task.id} />
        </div>
      )}
    </div>
  )
}

// ─── Associa cliente ──────────────────────────────────────────────────────────

function AssignClienteSection({
  cantiereId, currentClienteId, clienti,
}: {
  cantiereId: number; currentClienteId: number | null; clienti: Cliente[]
}) {
  const router       = useRouter()
  const selectRef    = useRef<HTMLSelectElement>(null)
  const [open, setOpen]   = useState(false)
  const [filter, setFilter] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const filtered = filter
    ? clienti.filter(c => nomeCliente(c).toLowerCase().includes(filter.toLowerCase()))
    : clienti

  async function handleSave() {
    const val = selectRef.current?.value
    if (!val) { setError('Seleziona un cliente.'); return }
    setError('')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.set('id', String(cantiereId))
      fd.set('cliente_id', val)
      const res = await assignClienteToCantiere(null, fd)
      if (res?.error) { setError(res.error); return }
      setOpen(false)
      router.refresh()
    } catch (e) {
      setError('Errore: ' + String(e))
    } finally {
      setSaving(false)
    }
  }

  if (!open) return (
    <button type="button" onClick={() => { setOpen(true); setFilter('') }} style={{
      padding: '4px 12px', fontSize: 12, border: '1px solid #1565c0', borderRadius: 4,
      background: '#e3f2fd', color: '#1565c0', cursor: 'pointer', fontFamily: 'inherit',
    }}>
      {currentClienteId ? 'Cambia cliente' : '+ Associa cliente'}
    </button>
  )

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filtra clienti..."
        style={{ ...inpSm, width: 160 }}
      />
      <select ref={selectRef} defaultValue={currentClienteId ?? ''} style={{ ...inpSm, minWidth: 200 }}>
        <option value="">— nessuno —</option>
        {filtered.map(c => (
          <option key={c.id} value={c.id}>{nomeCliente(c)}</option>
        ))}
      </select>
      {error && <span style={{ fontSize: 12, color: '#c00' }}>{error}</span>}
      <button type="button" onClick={handleSave} disabled={saving} className="btn-green">
        {saving ? '...' : 'Salva'}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="btn-gray">
        Annulla
      </button>
    </div>
  )
}

// ─── Dettaglio cantiere ───────────────────────────────────────────────────────

function DettaglioCantiere({
  cantiere, tasks, media, clienti, isStaff, onClose,
}: {
  cantiere: Cantiere; tasks: Task[]; media: Media[]
  clienti: Cliente[]; isStaff: boolean; onClose: () => void
}) {
  const [pending, startT]  = useTransition()
  const [addingTask, setAddingTask] = useState(false)

  const mieiTask  = tasks.filter(t => t.cantiere_id === cantiere.id)

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      overflowY: 'auto', padding: '40px 16px',
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: '#fff', borderRadius: 12, width: '100%', maxWidth: 900,
        padding: '28px 32px', position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{cantiere.titolo}</h3>
            {cantiere.indirizzo && (
              <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>{cantiere.indirizzo}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <StatoBadge stato={cantiere.stato} />
            {isStaff && (
              <select defaultValue={cantiere.stato}
                onChange={async e => {
                  const fd = new FormData(); fd.set('id', String(cantiere.id)); fd.set('stato', e.target.value)
                  startT(async () => { await updateStatoCantiere(null, fd) })
                }}
                style={{ padding: '4px 8px', fontSize: 12, border: '1px solid #ccc', borderRadius: 4, fontFamily: 'inherit' }}>
                {STATI_CANTIERE.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            )}
            <button onClick={onClose} style={{
              background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#666', lineHeight: 1,
            }}>✕</button>
          </div>
        </div>

        {/* Cliente */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#444' }}>
            <strong>Cliente:</strong>{' '}
            {cantiere.cliente_nome
              ? <span style={{ color: '#1a1a1a' }}>{cantiere.cliente_nome}</span>
              : <span style={{ color: '#bbb', fontStyle: 'italic' }}>non assegnato</span>
            }
          </span>
          {isStaff && (
            <AssignClienteSection
              cantiereId={cantiere.id}
              currentClienteId={cantiere.cliente_id}
              clienti={clienti}
            />
          )}
        </div>

        {/* Date */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 16, fontSize: 13, color: '#555', flexWrap: 'wrap' }}>
          {cantiere.data_preventivo && <span><strong>Preventivo:</strong> {cantiere.data_preventivo.slice(0,10)}</span>}
          {cantiere.inizio_lavori   && <span><strong>Inizio:</strong> {cantiere.inizio_lavori.slice(0,10)}</span>}
          {cantiere.fine_lavori     && <span><strong>Fine:</strong> {cantiere.fine_lavori.slice(0,10)}</span>}
        </div>


        {/* Task */}
        <div style={{ borderTop: '2px solid #eee', paddingTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              Task ({mieiTask.length})
            </div>
            {isStaff && !addingTask && (
              <button onClick={() => setAddingTask(true)} className="btn-green">
                + Aggiungi task
              </button>
            )}
          </div>

          {isStaff && addingTask && (
            <AddTaskForm cantiereId={cantiere.id} onDone={() => setAddingTask(false)} />
          )}

          {mieiTask.length === 0 ? (
            <p style={{ color: '#aaa', fontSize: 13 }}>Nessun task.</p>
          ) : (
            mieiTask.map(t => (
              <TaskItem key={t.id} task={t} media={media} />
            ))
          )}
        </div>
      </div>
    </div>
  , document.body)
}

// ─── Riga tabella cantiere ────────────────────────────────────────────────────

function CardCantiere({
  cantiere, tasks, media, clienti, isStaff, rowIndex,
}: {
  cantiere: Cantiere; tasks: Task[]; media: Media[]
  clienti: Cliente[]; isStaff: boolean; rowIndex: number
}) {
  const [aperto, setAperto] = useState(false)
  const [pending, startT]   = useTransition()

  const mieiTask  = tasks.filter(t => t.cantiere_id === cantiere.id)
  const taskIds   = new Set(mieiTask.map(t => t.id))
  const nMedia    = media.filter(m => taskIds.has(m.task_id)).length

  const td: React.CSSProperties = {
    padding: '7px 12px', borderBottom: '1px solid #eee',
    verticalAlign: 'middle', fontSize: 13,
    background: rowIndex % 2 === 0 ? '#fff' : '#fafafa',
  }

  return (
    <>
      <tr>
        <td style={{ ...td, fontWeight: 600, maxWidth: 200 }}>{cantiere.titolo}</td>
        <td style={{ ...td, whiteSpace: 'nowrap' }}>{cantiere.cliente_nome || <span style={{ color: '#bbb', fontStyle: 'italic' }}>—</span>}</td>
        <td style={{ ...td, color: '#666', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {cantiere.indirizzo || '—'}
        </td>
        <td style={{ ...td, textAlign: 'center' }}><StatoBadge stato={cantiere.stato} /></td>
        <td style={{ ...td, whiteSpace: 'nowrap', color: '#555' }}>{cantiere.data_preventivo?.slice(0,10) ?? '—'}</td>
        <td style={{ ...td, whiteSpace: 'nowrap', color: '#555' }}>{cantiere.inizio_lavori?.slice(0,10) ?? '—'}</td>
        <td style={{ ...td, whiteSpace: 'nowrap', color: '#555' }}>{cantiere.fine_lavori?.slice(0,10) ?? '—'}</td>
        <td style={{ ...td, textAlign: 'center', color: '#888' }}>{nMedia}</td>
        <td style={{ ...td, textAlign: 'center', color: '#888' }}>{mieiTask.length}</td>
        <td style={{ ...td, whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button onClick={() => setAperto(true)} style={{
              padding: '4px 12px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
              background: '#2a2a3e', color: '#c8960c', border: 'none', borderRadius: 4, fontWeight: 600,
            }}>Apri</button>
            {isStaff && (
              <form action={async fd => { startT(async () => { await toggleVisibileCantiere(null, fd) }) }}>
                <input type="hidden" name="id" value={cantiere.id} />
                <button type="submit" disabled={pending}
                  title={cantiere.visibile_cliente ? 'Visibile al cliente' : 'Nascosto al cliente'}
                  style={{
                    padding: '4px 8px', fontSize: 12, cursor: 'pointer', border: 'none', borderRadius: 4, fontWeight: 600,
                    background: cantiere.visibile_cliente ? '#e8f5e9' : '#f5f5f5',
                    color: cantiere.visibile_cliente ? '#2e7d32' : '#999',
                  }}>
                  {cantiere.visibile_cliente ? '👁 Vis.' : '🔒 Nasc.'}
                </button>
              </form>
            )}
            {isStaff && (
              <form action={async fd => { startT(async () => { await deleteCantiere(null, fd) }) }}>
                <input type="hidden" name="id" value={cantiere.id} />
                <button type="submit" disabled={pending} className="btn-red"
                  onClick={e => { if (!confirm('Eliminare cantiere e tutti i suoi dati?')) e.preventDefault() }}>
                  Elimina
                </button>
              </form>
            )}
          </div>
        </td>
      </tr>
      {aperto && (
        <DettaglioCantiere
          cantiere={cantiere} tasks={tasks} media={media}
          clienti={clienti} isStaff={isStaff} onClose={() => setAperto(false)}
        />
      )}
    </>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

type SortField = 'data_preventivo' | 'inizio_lavori' | 'fine_lavori' | 'created_at' | 'titolo' | 'stato'
type SortDir   = 'asc' | 'desc'

const SORT_OPTIONS: { label: string; value: SortField }[] = [
  { label: 'Data preventivo',  value: 'data_preventivo' },
  { label: 'Inizio lavori',    value: 'inizio_lavori'   },
  { label: 'Fine lavori',      value: 'fine_lavori'     },
  { label: 'Data inserimento', value: 'created_at'      },
  { label: 'Titolo',           value: 'titolo'          },
  { label: 'Stato',            value: 'stato'           },
]

export default function CantieriClient({
  cantieri, tasks, media, clienti, isStaff,
}: {
  cantieri: Cantiere[]; tasks: Task[]; media: Media[]
  clienti: Cliente[]; isStaff: boolean
}) {
  const [filtroStato, setFiltroStato] = useState('')
  const [filtroTesto, setFiltroTesto] = useState('')
  const [sortField, setSortField]     = useState<SortField>('data_preventivo')
  const [sortDir, setSortDir]         = useState<SortDir>('desc')

  const filtrati = useMemo(() => cantieri.filter(c => {
    if (filtroStato && c.stato !== filtroStato) return false
    if (filtroTesto) {
      const t = filtroTesto.toLowerCase()
      return c.titolo.toLowerCase().includes(t) ||
        (c.cliente_nome ?? '').toLowerCase().includes(t) ||
        c.indirizzo.toLowerCase().includes(t)
    }
    return true
  }), [cantieri, filtroStato, filtroTesto])

  const ordinati = useMemo(() => [...filtrati].sort((a, b) => {
    const av = a[sortField] ?? ''
    const bv = b[sortField] ?? ''
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ?  1 : -1
    return 0
  }), [filtrati, sortField, sortDir])

  const selInp: React.CSSProperties = {
    padding: '6px 10px', fontSize: 13, border: '1px solid #ccc',
    borderRadius: 4, fontFamily: 'inherit',
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Cerca titolo, cliente, indirizzo..."
          value={filtroTesto} onChange={e => setFiltroTesto(e.target.value)}
          style={{ ...selInp, minWidth: 220 }}
        />
        <select value={filtroStato} onChange={e => setFiltroStato(e.target.value)} style={selInp}>
          <option value="">Tutti gli stati</option>
          {STATI_CANTIERE.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }}>
          <span style={{ fontSize: 12, color: '#666', whiteSpace: 'nowrap' }}>Ordina per:</span>
          <select value={sortField} onChange={e => setSortField(e.target.value as SortField)} style={selInp}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} style={{
            padding: '6px 10px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', background: '#fff',
          }}>
            {sortDir === 'asc' ? '▲ Asc' : '▼ Disc'}
          </button>
        </div>
        <span style={{ fontSize: 13, color: '#888' }}>{ordinati.length} cantieri</span>
      </div>

      {isStaff && <AddCantiereForm clienti={clienti} />}

      {ordinati.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 13 }}>
          {cantieri.length === 0 ? 'Nessun cantiere presente.' : 'Nessun risultato.'}
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#2a2a3e' }}>
                {['Titolo', 'Cliente', 'Indirizzo', 'Stato', 'Preventivo', 'Inizio', 'Fine', 'Media', 'Task', ''].map(h => (
                  <th key={h} style={{
                    padding: '8px 12px', color: '#c8960c', fontSize: 12, fontWeight: 600,
                    textAlign: 'left', whiteSpace: 'nowrap', borderBottom: '2px solid #444',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ordinati.map((c, i) => (
                <CardCantiere key={c.id} cantiere={c} tasks={tasks} media={media}
                  clienti={clienti} isStaff={isStaff} rowIndex={i} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
