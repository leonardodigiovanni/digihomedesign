'use client'

import React, { useState, useMemo, useRef, useTransition, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { addRecord, deleteRecord, type MutResult } from './actions'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type Record_ = {
  id: number
  tipo: string
  titolo: string
  periodo: string
  immagine: string | null
  video: string | null
  note: string | null
  created_at: string
}

// ─── Costanti ─────────────────────────────────────────────────────────────────

const TIPI = [
  'Volantinaggio', 'Social Media', 'Email', 'Evento',
  'Sponsorizzazione', 'Affissione', 'Fiera', 'Altro',
]

const TIPO_COLORS: Record<string, string> = {
  'Volantinaggio':   '#5c6bc0',
  'Social Media':    '#0288d1',
  'Email':           '#00897b',
  'Evento':          '#f57c00',
  'Sponsorizzazione':'#8e24aa',
  'Affissione':      '#6d4c41',
  'Fiera':           '#2e7d32',
  'Altro':           '#757575',
}

function TipoBadge({ tipo }: { tipo: string }) {
  const color = TIPO_COLORS[tipo] ?? '#757575'
  return (
    <span style={{
      background: color, color: '#fff', borderRadius: 4,
      padding: '2px 8px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
    }}>{tipo}</span>
  )
}

// ─── Modal dettaglio ──────────────────────────────────────────────────────────

function DettaglioModal({ rec, onClose }: { rec: Record_; onClose: () => void }) {
  const [imgAr, setImgAr] = useState<string | null>(null)

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
      overflowY: 'auto', padding: '40px 16px',
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: '#fff', borderRadius: 12, width: '100%', maxWidth: 800,
        padding: '28px 32px', position: 'relative', margin: '0 auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <TipoBadge tipo={rec.tipo} />
            <h3 style={{ margin: '8px 0 2px', fontSize: 20, fontWeight: 700 }}>{rec.titolo}</h3>
            {rec.periodo && <div style={{ color: '#888', fontSize: 13 }}>Periodo: {rec.periodo}</div>}
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#666',
          }}>✕</button>
        </div>

        {rec.immagine && (
          <div style={{ marginBottom: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/uploads/marketing/${rec.immagine}`}
              alt={rec.titolo}
              onLoad={e => {
                const el = e.currentTarget
                setImgAr(`${el.naturalWidth} / ${el.naturalHeight}`)
              }}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                aspectRatio: imgAr ?? 'auto',
                borderRadius: 8,
                border: '1px solid #eee',
              }}
            />
            <div style={{ textAlign: 'right', marginTop: 6 }}>
              <a
                href={`/uploads/marketing/${rec.immagine}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 12, color: '#888', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Apri immagine originale ↗
              </a>
            </div>
          </div>
        )}

        {rec.video && (
          <div style={{ marginBottom: 20 }}>
            <video
              src={`/uploads/marketing/${rec.video}`}
              controls
              style={{ width: '100%', borderRadius: 8, border: '1px solid #eee', maxHeight: 420 }}
            />
          </div>
        )}

        {rec.note && (
          <div style={{
            background: '#f9f9f9', border: '1px solid #eee', borderRadius: 6,
            padding: '12px 16px', fontSize: 14, color: '#444', whiteSpace: 'pre-wrap', lineHeight: 1.6,
          }}>
            {rec.note}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

// ─── Form nuovo record ────────────────────────────────────────────────────────

function AddRecordForm() {
  const [open, setOpen]       = useState(false)
  const [result, action, pending] = useActionState<MutResult | null, FormData>(addRecord, null)
  const [uploading, setUploading] = useState(false)
  const [imgFile, setImgFile]     = useState<File | null>(null)
  const [vidFile, setVidFile]     = useState<File | null>(null)
  const [tipoCustom, setTipoCustom] = useState(false)
  const [tipoSel, setTipoSel]       = useState(TIPI[0])
  const formRef   = useRef<HTMLFormElement>(null)
  const imgRef    = useRef<HTMLInputElement>(null)
  const vidRef    = useRef<HTMLInputElement>(null)
  const router    = useRouter()

  useEffect(() => {
    if (result?.ok) { router.refresh(); formRef.current?.reset(); setOpen(false); setImgFile(null); setVidFile(null); setTipoCustom(false); setTipoSel(TIPI[0]) }
  }, [result])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    setUploading(true)
    try {
      // Upload immagine
      if (imgFile) {
        const uf = new FormData(); uf.append('file', imgFile)
        const res = await fetch('/api/upload-marketing', { method: 'POST', body: uf })
        const data = await res.json()
        if (data.error) { alert('Errore upload immagine: ' + data.error); return }
        fd.set('immagine', data.filename)
      }
      // Upload video
      if (vidFile) {
        const uf = new FormData(); uf.append('file', vidFile)
        const res = await fetch('/api/upload-marketing', { method: 'POST', body: uf })
        const data = await res.json()
        if (data.error) { alert('Errore upload video: ' + data.error); return }
        fd.set('video', data.filename)
      }
    } finally { setUploading(false) }

    // Chiama la server action manualmente (non tramite action= perché gestiamo upload manuale)
    const res = await addRecord(null, fd)
    if (res?.ok) { router.refresh(); formRef.current?.reset(); setOpen(false); setImgFile(null); setVidFile(null) }
  }

  const inp: React.CSSProperties = {
    padding: '6px 9px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = { fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }

  if (!open) return (
    <button className="btn-green" onClick={() => setOpen(true)}
      style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
      + Nuovo record
    </button>
  )

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{
      background: '#f8f8f8', border: '1px solid #ddd', borderRadius: 8,
      padding: '18px 22px', marginBottom: 24,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>

        <div>
          <label style={lbl}>Tipo *</label>
          {tipoCustom ? (
            <input name="tipo" required style={inp} placeholder="Es. Radio, TV…"
              autoFocus onBlur={e => { if (!e.target.value) setTipoCustom(false) }} />
          ) : (
            <select name="tipo" required style={inp} value={tipoSel}
              onChange={e => { if (e.target.value === '__altro__') setTipoCustom(true); else setTipoSel(e.target.value) }}>
              {TIPI.map(t => <option key={t} value={t}>{t}</option>)}
              <option value="__altro__">+ Personalizzato…</option>
            </select>
          )}
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label style={lbl}>Titolo *</label>
          <input name="titolo" required style={inp} />
        </div>

        <div>
          <label style={lbl}>Periodo</label>
          <input name="periodo" style={inp} placeholder="Es. Giugno 2025, Q2 2026" />
        </div>

        <div>
          <label style={lbl}>Immagine (opzionale)</label>
          <input ref={imgRef} type="file" accept="image/*" style={{ fontSize: 12 }}
            onChange={e => setImgFile(e.target.files?.[0] ?? null)} />
          {imgFile && <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{imgFile.name}</div>}
        </div>

        <div>
          <label style={lbl}>Video (opzionale)</label>
          <input ref={vidRef} type="file" accept="video/*" style={{ fontSize: 12 }}
            onChange={e => setVidFile(e.target.files?.[0] ?? null)} />
          {vidFile && <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{vidFile.name}</div>}
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Note</label>
          <textarea name="note" rows={3} style={{ ...inp, resize: 'vertical' }} />
        </div>
      </div>

      {result && !result.ok && (
        <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{result.error}</div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-green" disabled={pending || uploading}
          style={{ padding: '6px 16px', fontSize: 13, fontWeight: 600 }}>
          {uploading ? 'Upload...' : pending ? 'Salvataggio...' : 'Salva'}
        </button>
        <button type="button" className="btn-gray" onClick={() => setOpen(false)}
          style={{ padding: '6px 16px', fontSize: 13 }}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Riga tabella ─────────────────────────────────────────────────────────────

function RecordRow({ rec, rowIndex }: { rec: Record_; rowIndex: number }) {
  const [dettaglio, setDettaglio] = useState(false)
  const [pending, startT]         = useTransition()
  const router                    = useRouter()

  const td: React.CSSProperties = {
    padding: '8px 12px', borderBottom: '1px solid #eee',
    verticalAlign: 'middle', fontSize: 13,
    background: rowIndex % 2 === 0 ? '#fff' : '#fafafa',
  }

  return (
    <>
      <tr>
        <td style={{ ...td, textAlign: 'center' }}><TipoBadge tipo={rec.tipo} /></td>
        <td style={{ ...td, fontWeight: 600, maxWidth: 220 }}>{rec.titolo}</td>
        <td style={{ ...td, color: '#666', whiteSpace: 'nowrap' }}>{rec.periodo || '—'}</td>
        <td style={{ ...td, textAlign: 'center' }}>
          {rec.immagine ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/uploads/marketing/${rec.immagine}`} alt=""
              style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd', cursor: 'pointer' }}
              onClick={() => setDettaglio(true)} />
          ) : <span style={{ color: '#ddd', fontSize: 12 }}>—</span>}
        </td>
        <td style={{ ...td, textAlign: 'center' }}>
          {rec.video
            ? <span style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => setDettaglio(true)} title="Video allegato">🎬</span>
            : <span style={{ color: '#ddd', fontSize: 12 }}>—</span>}
        </td>
        <td style={{ ...td, maxWidth: 260, color: '#666' }}>
          {rec.note
            ? <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rec.note}</span>
            : <span style={{ color: '#ddd' }}>—</span>}
        </td>
        <td style={{ ...td, whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setDettaglio(true)} style={{
              padding: '4px 12px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
              background: '#2a2a3e', color: '#c8960c', border: 'none', borderRadius: 4, fontWeight: 600,
            }}>Apri</button>
            <form action={async fd => {
              startT(async () => {
                await deleteRecord(null, fd)
                router.refresh()
              })
            }}>
              <input type="hidden" name="id" value={rec.id} />
              <button type="submit" disabled={pending} className="btn-red"
                style={{ padding: '4px 10px', fontSize: 12 }}
                onClick={e => { if (!confirm('Eliminare questo record?')) e.preventDefault() }}>
                Elimina
              </button>
            </form>
          </div>
        </td>
      </tr>
      {dettaglio && <DettaglioModal rec={rec} onClose={() => setDettaglio(false)} />}
    </>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

type SortField = 'tipo' | 'periodo' | 'created_at'

export default function MarketingClient({ records }: { records: Record_[] }) {
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroTesto, setFiltroTesto] = useState('')
  const [sortField, setSortField]   = useState<SortField>('created_at')
  const [sortDir, setSortDir]       = useState<'asc' | 'desc'>('desc')

  function toggleSort(f: SortField) {
    if (f === sortField) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(f); setSortDir('asc') }
  }

  const tipiPresenti = useMemo(() => [...new Set(records.map(r => r.tipo))].sort(), [records])

  const filtrati = useMemo(() => records.filter(r => {
    if (filtroTipo && r.tipo !== filtroTipo) return false
    if (filtroTesto) {
      const t = filtroTesto.toLowerCase()
      return r.titolo.toLowerCase().includes(t) ||
        r.periodo.toLowerCase().includes(t) ||
        (r.note ?? '').toLowerCase().includes(t)
    }
    return true
  }), [records, filtroTipo, filtroTesto])

  const ordinati = useMemo(() => [...filtrati].sort((a, b) => {
    const av = a[sortField] ?? '', bv = b[sortField] ?? ''
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ?  1 : -1
    return 0
  }), [filtrati, sortField, sortDir])

  const selInp: React.CSSProperties = {
    padding: '6px 10px', fontSize: 13, border: '1px solid #ccc',
    borderRadius: 4, fontFamily: 'inherit',
  }

  function SortIcon({ f }: { f: SortField }) {
    if (f !== sortField) return <span style={{ color: '#666', marginLeft: 4 }}>↕</span>
    return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
  }

  const thS = (f?: SortField): React.CSSProperties => ({
    padding: '8px 12px', color: '#c8960c', fontSize: 12, fontWeight: 600,
    textAlign: 'left', whiteSpace: 'nowrap', borderBottom: '2px solid #444',
    background: '#2a2a3e', cursor: f ? 'pointer' : 'default', userSelect: 'none',
  })

  return (
    <div>
      {/* Filtri */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Cerca titolo, periodo, note…"
          value={filtroTesto} onChange={e => setFiltroTesto(e.target.value)}
          style={{ ...selInp, minWidth: 220 }} />
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={selInp}>
          <option value="">Tutti i tipi</option>
          {tipiPresenti.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span style={{ fontSize: 13, color: '#888' }}>{ordinati.length} record</span>
      </div>

      <AddRecordForm />

      {ordinati.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 13 }}>
          {records.length === 0 ? 'Nessun record presente.' : 'Nessun risultato.'}
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thS('tipo')} onClick={() => toggleSort('tipo')}>
                  Tipo <SortIcon f="tipo" />
                </th>
                <th style={thS()}>Titolo</th>
                <th style={thS('periodo')} onClick={() => toggleSort('periodo')}>
                  Periodo <SortIcon f="periodo" />
                </th>
                <th style={{ ...thS(), textAlign: 'center' }}>Immagine</th>
                <th style={{ ...thS(), textAlign: 'center' }}>Video</th>
                <th style={thS()}>Note</th>
                <th style={thS('created_at')} onClick={() => toggleSort('created_at')}>
                  Data <SortIcon f="created_at" />
                </th>
              </tr>
            </thead>
            <tbody>
              {ordinati.map((r, i) => <RecordRow key={r.id} rec={r} rowIndex={i} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
