'use client'

import React, { useState, useMemo, useTransition, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  addCantiere, deleteCantiere, updateStatoCantiere,
  addLavoro, deleteLavoro, addMedia, deleteMedia, toggleVisibileCantiere,
} from './actions'

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type Cliente = { id: number; nome: string; cognome: string; ragione_sociale: string; email: string }

export type Lavoro = {
  id: number; cantiere_id: number; descrizione: string
  qta: number; unita: string; prezzo_unit: number; sconto_pct: number
  totale: number; visibile_cliente: number
}

export type Media = {
  id: number; cantiere_id: number; tipo: 'foto' | 'video'
  filename: string; descrizione: string | null; visibile_cliente: number
}

export type Cantiere = {
  id: number; cliente_id: number | null; titolo: string; indirizzo: string
  stato: 'preventivo' | 'in_corso' | 'completato' | 'sospeso'
  data_preventivo: string | null; inizio_lavori: string | null; fine_lavori: string | null
  note_pubbliche: string | null; note_interne: string | null
  created_at: string; visibile_cliente: number
  cliente_nome?: string
}

// ─── Stato badge ──────────────────────────────────────────────────────────────

const STATI_CANTIERE = [
  { value: 'preventivo',  label: 'Preventivo',  bg: '#1565c0' },
  { value: 'in_corso',    label: 'In corso',    bg: '#e65100' },
  { value: 'completato',  label: 'Completato',  bg: '#2e7d32' },
  { value: 'sospeso',     label: 'Sospeso',     bg: '#757575' },
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

  const inp: React.CSSProperties = {
    padding: '5px 8px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  }

  if (!open) return (
    <button className="btn-green" onClick={() => setOpen(true)}
      style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
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
        <div>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Cliente *</label>
          <select name="cliente_id" required style={inp}>
            <option value="">— Seleziona cliente —</option>
            {clienti.map(c => (
              <option key={c.id} value={c.id}>
                {c.ragione_sociale || `${c.cognome} ${c.nome}`}
              </option>
            ))}
          </select>
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
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Note pubbliche (visibili al cliente)</label>
          <textarea name="note_pubbliche" rows={2} style={{ ...inp, resize: 'vertical' }} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 2 }}>Note interne (solo staff)</label>
          <textarea name="note_interne" rows={2} style={{ ...inp, resize: 'vertical' }} />
        </div>
      </div>
      {error && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{error}</div>}
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

// ─── Form lavoro ──────────────────────────────────────────────────────────────

function AddLavoroForm({ cantiereId }: { cantiereId: number }) {
  const [open, setOpen]   = useState(false)
  const [error, setError] = useState('')
  const [pending, startT] = useTransition()
  const formRef           = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError('')
    startT(async () => {
      const res = await addLavoro(null, fd)
      if (res?.error) { setError(res.error); return }
      formRef.current?.reset()
      setOpen(false)
    })
  }

  const inp: React.CSSProperties = {
    padding: '4px 7px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 12, fontFamily: 'inherit', boxSizing: 'border-box',
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{
      padding: '4px 12px', fontSize: 12, fontFamily: 'inherit',
      border: '1px solid #aaa', borderRadius: 4, cursor: 'pointer', background: '#fff', marginBottom: 8,
    }}>+ Aggiungi lavorazione</button>
  )

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{
      background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 6,
      padding: '12px 14px', marginBottom: 10,
    }}>
      <input type="hidden" name="cantiere_id" value={cantiereId} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 8 }}>
        <div style={{ flex: '2 1 200px' }}>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Descrizione *</div>
          <input name="descrizione" required style={{ ...inp, width: '100%' }} />
        </div>
        <div style={{ flex: '0 1 70px' }}>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Qtà</div>
          <input name="qta" type="number" step="0.01" defaultValue="1" style={{ ...inp, width: '100%' }} />
        </div>
        <div style={{ flex: '0 1 70px' }}>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Unità</div>
          <select name="unita" style={{ ...inp, width: '100%' }}>
            {['cad','mq','ml','mc','kg','h','corpo'].map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div style={{ flex: '0 1 90px' }}>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Prezzo unit. €</div>
          <input name="prezzo_unit" type="number" step="0.01" defaultValue="0" style={{ ...inp, width: '100%' }} />
        </div>
        <div style={{ flex: '0 1 70px' }}>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Sconto %</div>
          <input name="sconto_pct" type="number" step="0.01" defaultValue="0" style={{ ...inp, width: '100%' }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Visibile cliente</div>
          <select name="visibile_cliente" style={{ ...inp }}>
            <option value="1">Sì</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>
      {error && <div style={{ color: '#c00', fontSize: 11, marginBottom: 6 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="submit" className="btn-green" disabled={pending}
          style={{ padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>
          {pending ? '...' : 'Salva'}
        </button>
        <button type="button" className="btn-gray" onClick={() => setOpen(false)}
          style={{ padding: '4px 12px', fontSize: 12 }}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Upload media ─────────────────────────────────────────────────────────────

function UploadMediaForm({ cantiereId }: { cantiereId: number }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [pending, startT]         = useTransition()
  const fileRef                   = useRef<HTMLInputElement>(null)
  const descRef                   = useRef<HTMLInputElement>(null)
  const visRef                    = useRef<HTMLSelectElement>(null)

  async function handleUpload() {
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('cantiere_id', String(cantiereId))
      const res  = await fetch('/api/upload-cantiere', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) { setError(data.error); return }

      const afd = new FormData()
      afd.set('cantiere_id',      String(cantiereId))
      afd.set('filename',         data.filename)
      afd.set('tipo',             data.tipo)
      afd.set('descrizione',      descRef.current?.value ?? '')
      afd.set('visibile_cliente', visRef.current?.value ?? '1')

      startT(async () => { await addMedia(null, afd) })
      if (fileRef.current)  fileRef.current.value  = ''
      if (descRef.current)  descRef.current.value  = ''
    } catch { setError('Errore durante upload.') }
    finally  { setUploading(false) }
  }

  const inp: React.CSSProperties = {
    padding: '4px 7px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 12, fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 10 }}>
      <div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>File (foto/video)</div>
        <input ref={fileRef} type="file" accept="image/*,video/*" style={{ fontSize: 12 }} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Descrizione</div>
        <input ref={descRef} style={{ ...inp, width: 160 }} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Visibile cliente</div>
        <select ref={visRef} style={inp} defaultValue="1">
          <option value="1">Sì</option>
          <option value="0">No</option>
        </select>
      </div>
      {error && <span style={{ fontSize: 11, color: '#c00' }}>{error}</span>}
      <button onClick={handleUpload} disabled={uploading || pending} className="btn-green"
        style={{ padding: '4px 14px', fontSize: 12, fontWeight: 600 }}>
        {uploading ? 'Caricamento...' : 'Carica'}
      </button>
    </div>
  )
}

// ─── Dettaglio cantiere ───────────────────────────────────────────────────────

function DettaglioCantiere({
  cantiere, lavori, media, isStaff, onClose,
}: {
  cantiere: Cantiere; lavori: Lavoro[]; media: Media[]; isStaff: boolean; onClose: () => void
}) {
  const [pending, startT] = useTransition()
  const miei_lavori = lavori.filter(l => l.cantiere_id === cantiere.id && (isStaff || l.visibile_cliente))
  const miei_media  = media.filter(m  => m.cantiere_id === cantiere.id  && (isStaff || m.visibile_cliente))

  const totImponibile = miei_lavori.reduce((s, l) => s + Number(l.totale), 0)

  const tdS: React.CSSProperties = { padding: '6px 10px', fontSize: 13, borderBottom: '1px solid #eee' }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{cantiere.titolo}</h3>
            {cantiere.cliente_nome && (
              <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Cliente: {cantiere.cliente_nome}</div>
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

        {/* Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', marginBottom: 20, fontSize: 13 }}>
          {cantiere.indirizzo   && <div><strong>Indirizzo:</strong> {cantiere.indirizzo}</div>}
          {cantiere.inizio_lavori && <div><strong>Inizio:</strong> {cantiere.inizio_lavori.slice(0,10)}</div>}
          {cantiere.fine_lavori   && <div><strong>Fine:</strong>   {cantiere.fine_lavori.slice(0,10)}</div>}
          {cantiere.note_pubbliche && (
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Note:</strong> {cantiere.note_pubbliche}
            </div>
          )}
          {isStaff && cantiere.note_interne && (
            <div style={{ gridColumn: '1 / -1', background: '#fff8e1', padding: '6px 10px', borderRadius: 4 }}>
              <strong>Note interne:</strong> {cantiere.note_interne}
            </div>
          )}
        </div>

        {/* Lavorazioni */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 6 }}>
            Lavorazioni
          </div>
          {isStaff && <AddLavoroForm cantiereId={cantiere.id} />}
          {miei_lavori.length === 0 ? (
            <p style={{ color: '#aaa', fontSize: 13 }}>Nessuna lavorazione.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={tdS}>Descrizione</th>
                    <th style={{ ...tdS, textAlign: 'right' }}>Qtà</th>
                    <th style={tdS}>Unità</th>
                    {isStaff && <th style={{ ...tdS, textAlign: 'right' }}>Prezzo unit.</th>}
                    {isStaff && <th style={{ ...tdS, textAlign: 'right' }}>Sconto %</th>}
                    {isStaff && <th style={{ ...tdS, textAlign: 'right' }}>Totale</th>}
                    {isStaff && <th style={tdS}>Visibile</th>}
                    {isStaff && <th />}
                  </tr>
                </thead>
                <tbody>
                  {miei_lavori.map((l, i) => (
                    <tr key={l.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={tdS}>{l.descrizione}</td>
                      <td style={{ ...tdS, textAlign: 'right' }}>{Number(l.qta)}</td>
                      <td style={tdS}>{l.unita}</td>
                      {isStaff && <td style={{ ...tdS, textAlign: 'right' }}>€ {Number(l.prezzo_unit).toFixed(2)}</td>}
                      {isStaff && <td style={{ ...tdS, textAlign: 'right' }}>{Number(l.sconto_pct).toFixed(0)}%</td>}
                      {isStaff && <td style={{ ...tdS, textAlign: 'right', fontWeight: 600 }}>€ {Number(l.totale).toFixed(2)}</td>}
                      {isStaff && <td style={{ ...tdS, color: l.visibile_cliente ? '#2e7d32' : '#999', textAlign: 'center' }}>{l.visibile_cliente ? '✓' : '✗'}</td>}
                      {isStaff && (
                        <td style={tdS}>
                          <form action={async fd => { startT(async () => { await deleteLavoro(null, fd) }) }}>
                            <input type="hidden" name="id" value={l.id} />
                            <button type="submit" disabled={pending} className="btn-red"
                              style={{ padding: '2px 8px', fontSize: 11 }}
                              onClick={e => { if (!confirm('Eliminare?')) e.preventDefault() }}>✕</button>
                          </form>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                {isStaff && (
                  <tfoot>
                    <tr>
                      <td colSpan={5} style={{ ...tdS, textAlign: 'right', fontWeight: 600 }}>Totale imponibile:</td>
                      <td style={{ ...tdS, textAlign: 'right', fontWeight: 700, fontSize: 14 }}>€ {totImponibile.toFixed(2)}</td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>

        {/* Media */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 6 }}>
            Foto e Video
          </div>
          {isStaff && <UploadMediaForm cantiereId={cantiere.id} />}
          {miei_media.length === 0 ? (
            <p style={{ color: '#aaa', fontSize: 13 }}>Nessun file caricato.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {miei_media.map(m => {
                const src = `/uploads/cantieri/${cantiere.id}/${m.filename}`
                return (
                  <div key={m.id} style={{ position: 'relative', width: 150 }}>
                    {m.tipo === 'foto' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={m.descrizione ?? ''} style={{
                        width: 150, height: 110, objectFit: 'cover', borderRadius: 6, display: 'block',
                        border: '1px solid #ddd',
                      }} />
                    ) : (
                      <video src={src} controls style={{
                        width: 150, height: 110, borderRadius: 6, display: 'block',
                        border: '1px solid #ddd', objectFit: 'cover',
                      }} />
                    )}
                    {m.descrizione && (
                      <div style={{ fontSize: 11, color: '#555', marginTop: 3, textAlign: 'center' }}>{m.descrizione}</div>
                    )}
                    {isStaff && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10 }}>
                        <span style={{ color: m.visibile_cliente ? '#2e7d32' : '#999' }}>
                          {m.visibile_cliente ? '👁 visibile' : '🔒 privato'}
                        </span>
                        <form action={async fd => { startT(async () => { await deleteMedia(null, fd) }) }}>
                          <input type="hidden" name="id" value={m.id} />
                          <button type="submit" disabled={pending} className="btn-red"
                            style={{ padding: '1px 6px', fontSize: 10 }}
                            onClick={e => { if (!confirm('Eliminare?')) e.preventDefault() }}>✕</button>
                        </form>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  , document.body)
}

// ─── Riga tabella cantiere ────────────────────────────────────────────────────

function CardCantiere({
  cantiere, lavori, media, isStaff, rowIndex, nFoto, nLavori,
}: {
  cantiere: Cantiere; lavori: Lavoro[]; media: Media[]
  isStaff: boolean; rowIndex: number; nFoto: number; nLavori: number
}) {
  const [aperto, setAperto] = useState(false)
  const [pending, startT]   = useTransition()

  const td: React.CSSProperties = {
    padding: '7px 12px', borderBottom: '1px solid #eee',
    verticalAlign: 'middle', fontSize: 13,
    background: rowIndex % 2 === 0 ? '#fff' : '#fafafa',
  }

  return (
    <>
      <tr>
        <td style={{ ...td, fontWeight: 600, maxWidth: 200 }}>{cantiere.titolo}</td>
        <td style={{ ...td, whiteSpace: 'nowrap' }}>{cantiere.cliente_nome ?? '—'}</td>
        <td style={{ ...td, color: '#666', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {cantiere.indirizzo || '—'}
        </td>
        <td style={{ ...td, textAlign: 'center' }}><StatoBadge stato={cantiere.stato} /></td>
        <td style={{ ...td, whiteSpace: 'nowrap', color: '#555' }}>{cantiere.data_preventivo?.slice(0,10) ?? '—'}</td>
        <td style={{ ...td, whiteSpace: 'nowrap', color: '#555' }}>{cantiere.inizio_lavori?.slice(0,10)   ?? '—'}</td>
        <td style={{ ...td, whiteSpace: 'nowrap', color: '#555' }}>{cantiere.fine_lavori?.slice(0,10)     ?? '—'}</td>
        <td style={{ ...td, textAlign: 'center', color: '#888' }}>{nFoto}</td>
        <td style={{ ...td, textAlign: 'center', color: '#888' }}>{nLavori}</td>
        <td style={{ ...td, whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button onClick={() => setAperto(true)} style={{
              padding: '4px 12px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
              background: '#2a2a3e', color: '#c8960c', border: 'none', borderRadius: 4, fontWeight: 600,
            }}>Apri</button>
            {isStaff && (
              <form action={async fd => { startT(async () => { await toggleVisibileCantiere(null, fd) }) }}>
                <input type="hidden" name="id" value={cantiere.id} />
                <button type="submit" disabled={pending} title={cantiere.visibile_cliente ? 'Visibile al cliente — clicca per nascondere' : 'Nascosto al cliente — clicca per rendere visibile'}
                  style={{
                    padding: '4px 8px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', border: 'none',
                    borderRadius: 4, fontWeight: 600,
                    background: cantiere.visibile_cliente ? '#e8f5e9' : '#f5f5f5',
                    color: cantiere.visibile_cliente ? '#2e7d32' : '#999',
                  }}>
                  {cantiere.visibile_cliente ? '👁 Vis.' : '🔒 Nasco.'}
                </button>
              </form>
            )}
            {isStaff && (
              <form action={async fd => { startT(async () => { await deleteCantiere(null, fd) }) }}>
                <input type="hidden" name="id" value={cantiere.id} />
                <button type="submit" disabled={pending} className="btn-red"
                  style={{ padding: '4px 10px', fontSize: 12 }}
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
          cantiere={cantiere} lavori={lavori} media={media}
          isStaff={isStaff} onClose={() => setAperto(false)}
        />
      )}
    </>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

type SortField = 'data_preventivo' | 'inizio_lavori' | 'fine_lavori' | 'created_at' | 'titolo' | 'stato'
type SortDir   = 'asc' | 'desc'

const SORT_OPTIONS: { label: string; value: SortField }[] = [
  { label: 'Data preventivo', value: 'data_preventivo' },
  { label: 'Inizio lavori',   value: 'inizio_lavori'   },
  { label: 'Fine lavori',     value: 'fine_lavori'     },
  { label: 'Data inserimento',value: 'created_at'      },
  { label: 'Titolo',          value: 'titolo'          },
  { label: 'Stato',           value: 'stato'           },
]

export default function CantieriClient({
  cantieri, lavori, media, clienti, isStaff,
}: {
  cantieri: Cantiere[]; lavori: Lavoro[]; media: Media[]
  clienti: Cliente[]; isStaff: boolean
}) {
  const [filtroStato, setFiltroStato] = useState('')
  const [filtroTesto, setFiltroTesto] = useState('')
  const [sortField, setSortField]     = useState<SortField>('data_preventivo')
  const [sortDir, setSortDir]         = useState<SortDir>('desc')

  function toggleDir() { setSortDir(d => d === 'asc' ? 'desc' : 'asc') }

  const filtrati = useMemo(() => {
    return cantieri.filter(c => {
      if (filtroStato && c.stato !== filtroStato) return false
      if (filtroTesto) {
        const t = filtroTesto.toLowerCase()
        return c.titolo.toLowerCase().includes(t) ||
          (c.cliente_nome ?? '').toLowerCase().includes(t) ||
          c.indirizzo.toLowerCase().includes(t)
      }
      return true
    })
  }, [cantieri, filtroStato, filtroTesto])

  const ordinati = useMemo(() => {
    return [...filtrati].sort((a, b) => {
      const av = a[sortField] ?? ''
      const bv = b[sortField] ?? ''
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ?  1 : -1
      return 0
    })
  }, [filtrati, sortField, sortDir])

  const selInp: React.CSSProperties = {
    padding: '6px 10px', fontSize: 13, border: '1px solid #ccc',
    borderRadius: 4, fontFamily: 'inherit',
  }

  return (
    <div>
      {/* Barra filtri + ordinamento */}
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
          <button onClick={toggleDir} style={{
            padding: '6px 10px', fontSize: 13, fontFamily: 'inherit',
            border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', background: '#fff',
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
                {[
                  'Titolo', 'Cliente', 'Indirizzo', 'Stato',
                  'Preventivo', 'Inizio', 'Fine', 'Foto', 'Lavoraz.', ''
                ].map(h => (
                  <th key={h} style={{
                    padding: '8px 12px', color: '#c8960c', fontSize: 12, fontWeight: 600,
                    textAlign: 'left', whiteSpace: 'nowrap', borderBottom: '2px solid #444',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ordinati.map((c, i) => {
                const nFoto   = media.filter(m => m.cantiere_id === c.id).length
                const nLavori = lavori.filter(l => l.cantiere_id === c.id).length
                return (
                  <CardCantiere key={c.id} cantiere={c} lavori={lavori} media={media}
                    isStaff={isStaff} rowIndex={i} nFoto={nFoto} nLavori={nLavori} />
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
