'use client'

import React, { useState, useMemo, useActionState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addArticolo, updateArticolo, deleteArticolo, toggleDisponibile, togglePreventivabile, updateSchedaTecnica, type MutResult } from './actions'

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type Articolo = {
  id: number
  categoria: string
  produttore: string
  descrizione: string
  unita: string
  prezzo_acquisto: number
  prezzo_vendita: number
  note: string | null
  disponibile: number
  preventivabile: number
  updated_at: string
  foto_url: string | null
  profilo_frontale_mm: number | null
  profilo_profondita_mm: number | null
  trasmittanza_uw: number | null
}

// ─── Costanti ─────────────────────────────────────────────────────────────────

const UNITA_PREDEFINITE = ['m²', 'ml', 'kg', 't', 'pz', 'h', 'corpo']

function fmt(n: number) {
  return n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function margine(acq: number, vnd: number): { pct: string; color: string } | null {
  if (vnd <= 0) return null
  const pct = ((vnd - acq) / vnd) * 100
  const color = pct >= 20 ? '#2e7d32' : pct >= 10 ? '#e65100' : '#c62828'
  return { pct: pct.toFixed(1) + '%', color }
}

// ─── Stili comuni ─────────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  padding: '4px 6px', border: '1px solid #bbb', borderRadius: 3,
  fontSize: 12, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
}

const thS: React.CSSProperties = {
  padding: '8px 10px', color: '#c8960c', fontSize: 11, fontWeight: 700,
  textAlign: 'left', whiteSpace: 'nowrap', borderBottom: '2px solid #444',
  background: '#2a2a3e', userSelect: 'none',
}

// ─── Form nuovo articolo ──────────────────────────────────────────────────────

function NuovoArticoloForm({ categorie, produttori, onDone }: {
  categorie: string[]; produttori: string[]; onDone: () => void
}) {
  const [result, action, pending] = useActionState<MutResult | null, FormData>(addArticolo, null)
  const [unitaCustom, setUnitaCustom] = useState(false)
  const [unitaSel, setUnitaSel] = useState(UNITA_PREDEFINITE[0])
  const router = useRouter()

  if (result?.ok) { router.refresh(); onDone() }

  const lbl: React.CSSProperties = { fontSize: 11, color: '#555', display: 'block', marginBottom: 2 }

  return (
    <form action={action} style={{
      background: '#f8f8f8', border: '1px solid #ddd', borderRadius: 8,
      padding: '16px 18px', marginBottom: 20,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={lbl}>Categoria *</label>
          <input name="categoria" required style={inp} list="cat-list" placeholder="Es. Infissi" />
          <datalist id="cat-list">{categorie.map(c => <option key={c} value={c} />)}</datalist>
        </div>
        <div>
          <label style={lbl}>Produttore</label>
          <input name="produttore" style={inp} list="prod-list" placeholder="Es. Schüco" />
          <datalist id="prod-list">{produttori.map(p => <option key={p} value={p} />)}</datalist>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={lbl}>Descrizione *</label>
          <input name="descrizione" required style={inp} placeholder="Es. Finestra scorrevole 2 ante" />
        </div>
        <div>
          <label style={lbl}>Unità *</label>
          {unitaCustom ? (
            <input name="unita" required style={inp} placeholder="Es. rotolo"
              autoFocus onBlur={e => { if (!e.target.value) setUnitaCustom(false) }} />
          ) : (
            <select name="unita" required style={inp} value={unitaSel}
              onChange={e => { if (e.target.value === '__altro__') setUnitaCustom(true); else setUnitaSel(e.target.value) }}>
              {UNITA_PREDEFINITE.map(u => <option key={u} value={u}>{u}</option>)}
              <option value="__altro__">+ Altra…</option>
            </select>
          )}
        </div>
        <div>
          <label style={lbl}>P. Acquisto (€)</label>
          <input name="prezzo_acquisto" type="number" step="0.01" min="0" defaultValue="0" style={inp} />
        </div>
        <div>
          <label style={lbl}>P. Vendita (€)</label>
          <input name="prezzo_vendita" type="number" step="0.01" min="0" defaultValue="0" style={inp} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Note</label>
          <input name="note" style={inp} placeholder="Opzionale" />
        </div>
      </div>
      {result && !result.ok && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{result.error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-green" disabled={pending}
          style={{ padding: '6px 16px', fontSize: 13, fontWeight: 600 }}>
          {pending ? 'Salvataggio…' : 'Salva'}
        </button>
        <button type="button" className="btn-gray" onClick={onDone}
          style={{ padding: '6px 12px', fontSize: 13 }}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Scheda tecnica ───────────────────────────────────────────────────────────

function SchedaTecnicaModal({ art, onClose }: { art: Articolo; onClose: () => void }) {
  const router = useRouter()
  const [result, formAction, pending] = useActionState<MutResult | null, FormData>(updateSchedaTecnica, null)
  const [preview, setPreview] = useState<string | null>(art.foto_url ?? null)
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (result?.ok) { router.refresh(); onClose() }
  }, [result])

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setUploadErr(null)
    setUploading(true)
    setPreview(URL.createObjectURL(f))
    const fd = new FormData()
    fd.set('id', String(art.id))
    fd.set('foto', f)
    try {
      const res  = await fetch('/api/listini/foto', { method: 'POST', body: fd })
      const data = await res.json() as { ok: boolean; foto_url?: string; error?: string }
      if (data.ok && data.foto_url) {
        setPreview(data.foto_url + '?t=' + Date.now())
      } else {
        setUploadErr(data.error ?? 'Errore upload')
      }
    } catch {
      setUploadErr('Errore di rete durante l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const numInp: React.CSSProperties = {
    padding: '6px 8px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase',
    letterSpacing: '0.05em', display: 'block', marginBottom: 3,
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 10, padding: 24, width: '100%', maxWidth: 480,
        boxShadow: '0 8px 40px rgba(0,0,0,0.22)', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Scheda tecnica</h3>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>{art.descrizione}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888', lineHeight: 1 }}>✕</button>
        </div>

        <form action={formAction}>
          <input type="hidden" name="id" value={art.id} />

          {/* Foto profilo */}
          <div style={{ marginBottom: 18 }}>
            <span style={lbl}>Foto profilo</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  width: 110, height: 90, border: '2px dashed #ccc', borderRadius: 6,
                  cursor: 'pointer', overflow: 'hidden', background: '#f5f5f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                {preview
                  ? <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 11, color: '#bbb', textAlign: 'center', padding: 8 }}>Clicca per<br/>caricare foto</span>
                }
              </div>
              <div style={{ flex: 1 }}>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFile}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  style={{
                    padding: '6px 14px', fontSize: 12, border: '1px solid #ccc',
                    borderRadius: 4, background: '#f5f5f5', cursor: uploading ? 'wait' : 'pointer',
                    display: 'block', marginBottom: 6,
                  }}
                >
                  {uploading ? 'Caricamento…' : 'Scegli immagine…'}
                </button>
                <p style={{ margin: 0, fontSize: 11, color: '#aaa' }}>JPG, PNG, WebP — max 5 MB</p>
                {uploadErr && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#c00' }}>{uploadErr}</p>}
              </div>
            </div>
          </div>

          {/* Dati tecnici */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={lbl}>Frontale (mm)</label>
              <input
                name="profilo_frontale_mm"
                type="number"
                step="0.1"
                min="0"
                defaultValue={art.profilo_frontale_mm ?? ''}
                placeholder="es. 70"
                style={numInp}
              />
            </div>
            <div>
              <label style={lbl}>Profondità (mm)</label>
              <input
                name="profilo_profondita_mm"
                type="number"
                step="0.1"
                min="0"
                defaultValue={art.profilo_profondita_mm ?? ''}
                placeholder="es. 80"
                style={numInp}
              />
            </div>
            <div>
              <label style={lbl}>Uw (W/m²K)</label>
              <input
                name="trasmittanza_uw"
                type="number"
                step="0.001"
                min="0"
                defaultValue={art.trasmittanza_uw ?? ''}
                placeholder="es. 1.3"
                style={numInp}
              />
            </div>
          </div>

          {result && !result.ok && (
            <p style={{ color: '#c00', fontSize: 12, margin: '0 0 12px', background: '#fff5f5', padding: '6px 10px', borderRadius: 4 }}>
              {result.error}
            </p>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{
              padding: '7px 18px', fontSize: 13, border: '1px solid #ccc',
              borderRadius: 5, background: '#f5f5f5', cursor: 'pointer',
            }}>
              Annulla
            </button>
            <button type="submit" disabled={pending} style={{
              padding: '7px 20px', fontSize: 13, fontWeight: 700, borderRadius: 5,
              background: pending ? '#aaa' : '#1a4a8a', color: '#fff', border: 'none',
              cursor: pending ? 'not-allowed' : 'pointer',
            }}>
              {pending ? 'Salvataggio…' : 'Salva scheda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Riga normale ─────────────────────────────────────────────────────────────

function ToggleDisponibileBtn({ art }: { art: Articolo }) {
  const [, startT] = React.useTransition()
  const router = useRouter()
  const disp = art.disponibile === 1
  return (
    <form style={{ display: 'contents' }} action={async fd => {
      startT(async () => { await toggleDisponibile(null, fd); router.refresh() })
    }}>
      <input type="hidden" name="id" value={art.id} />
      <button type="submit" style={{
        padding: '2px 8px', fontSize: 10, fontWeight: 700, borderRadius: 3,
        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        background: disp ? '#2e7d32' : '#757575',
        color: '#fff', whiteSpace: 'nowrap',
      }}>
        {disp ? 'Disponibile' : 'Non disp.'}
      </button>
    </form>
  )
}

function TogglePreventivabileBtn({ art }: { art: Articolo }) {
  const [, startT] = React.useTransition()
  const router = useRouter()
  const prev = art.preventivabile === 1
  return (
    <form style={{ display: 'contents' }} action={async fd => {
      startT(async () => { await togglePreventivabile(null, fd); router.refresh() })
    }}>
      <input type="hidden" name="id" value={art.id} />
      <button type="submit" style={{
        padding: '2px 8px', fontSize: 10, fontWeight: 700, borderRadius: 3,
        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        background: prev ? '#1565c0' : '#aaa',
        color: '#fff', whiteSpace: 'nowrap',
      }}>
        {prev ? 'Preventiv.' : 'No prev.'}
      </button>
    </form>
  )
}

function RigaNormale({ art, onEdit, onScheda, onDelete, pending }: {
  art: Articolo
  onEdit: () => void
  onScheda: () => void
  onDelete: () => void
  pending: boolean
}) {
  const m = margine(art.prezzo_acquisto, art.prezzo_vendita)
  const nonDisp = art.disponibile === 0
  const td: React.CSSProperties = {
    padding: '7px 10px', borderBottom: '1px solid #eee', fontSize: 12, verticalAlign: 'middle',
    opacity: nonDisp ? 0.45 : 1,
  }
  const hasDati = art.profilo_frontale_mm != null || art.profilo_profondita_mm != null || art.trasmittanza_uw != null

  return (
    <tr onDoubleClick={onEdit} style={{ cursor: 'pointer', background: nonDisp ? '#f9f9f9' : undefined }} title="Doppio click per modificare">
      <td style={td}><span style={{ background: '#e8e8f8', borderRadius: 3, padding: '2px 7px', fontSize: 11, fontWeight: 600 }}>{art.categoria}</span></td>
      <td style={{ ...td, color: '#555' }}>{art.produttore || '—'}</td>
      <td style={{ ...td, fontWeight: 500, maxWidth: 300 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {art.foto_url && (
            <img src={art.foto_url} alt="" style={{ width: 22, height: 22, objectFit: 'cover', borderRadius: 3, border: '1px solid #ddd', flexShrink: 0 }} />
          )}
          {art.descrizione}
        </div>
      </td>
      <td style={{ ...td, textAlign: 'center', color: '#666' }}>{art.unita}</td>
      <td style={{ ...td, textAlign: 'right', color: '#1565c0', fontWeight: 600 }}>{fmt(art.prezzo_acquisto)}</td>
      <td style={{ ...td, textAlign: 'right', color: '#2e7d32', fontWeight: 600 }}>{fmt(art.prezzo_vendita)}</td>
      <td style={{ ...td, textAlign: 'center' }}>
        {m ? <span style={{ color: m.color, fontWeight: 700, fontSize: 11 }}>{m.pct}</span> : <span style={{ color: '#ccc' }}>—</span>}
      </td>
      <td style={{ ...td, color: '#888', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{art.note || '—'}</td>
      <td style={{ ...td, opacity: 1, whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <ToggleDisponibileBtn art={art} />
          <TogglePreventivabileBtn art={art} />
          <button onClick={onScheda} style={{
            padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
            background: hasDati || art.foto_url ? '#1a5276' : '#3d3d5c',
            color: hasDati || art.foto_url ? '#7fc8f8' : '#9999cc',
            border: 'none', borderRadius: 3, fontWeight: 600,
          }}>
            {hasDati || art.foto_url ? '📋 Scheda' : 'Scheda'}
          </button>
          <button onClick={onEdit} style={{
            padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
            background: '#2a2a3e', color: '#c8960c', border: 'none', borderRadius: 3, fontWeight: 600,
          }}>Modifica</button>
          <button onClick={onDelete} disabled={pending} className="btn-red"
            style={{ padding: '3px 8px', fontSize: 11 }}>Elimina</button>
        </div>
      </td>
    </tr>
  )
}

// ─── Riga in modifica ─────────────────────────────────────────────────────────

function RigaEdit({ art, categorie, produttori, onDone }: {
  art: Articolo; categorie: string[]; produttori: string[]; onDone: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [unitaCustom, setUnitaCustom] = useState(!UNITA_PREDEFINITE.includes(art.unita))
  const [unitaSel, setUnitaSel] = useState(UNITA_PREDEFINITE.includes(art.unita) ? art.unita : UNITA_PREDEFINITE[0])
  const router = useRouter()
  const trRef = useRef<HTMLTableRowElement>(null)

  function handleSubmit() {
    const fd = new FormData()
    fd.set('id', String(art.id))
    trRef.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[name]').forEach(el => {
      fd.set(el.name, el.value)
    })
    startTransition(async () => {
      const result = await updateArticolo(null, fd)
      if (result?.ok) { router.refresh(); onDone() }
      else setError(result?.error ?? 'Errore')
    })
  }

  const tde: React.CSSProperties = { padding: '5px 6px', borderBottom: '1px solid #c8960c', background: '#fffdf0', verticalAlign: 'middle' }

  return (
    <tr ref={trRef} style={{ background: '#fffdf0' }}>
      <td style={tde}>
        <input name="categoria" defaultValue={art.categoria} required style={inp} list="cat-list-edit" />
        <datalist id="cat-list-edit">{categorie.map(c => <option key={c} value={c} />)}</datalist>
      </td>
      <td style={tde}>
        <input name="produttore" defaultValue={art.produttore} style={inp} list="prod-list-edit" />
        <datalist id="prod-list-edit">{produttori.map(p => <option key={p} value={p} />)}</datalist>
      </td>
      <td style={tde}><input name="descrizione" defaultValue={art.descrizione} required style={inp} /></td>
      <td style={tde}>
        {unitaCustom ? (
          <input name="unita" defaultValue={art.unita} required style={{ ...inp, width: 60 }}
            onBlur={e => { if (!e.target.value) setUnitaCustom(false) }} />
        ) : (
          <select name="unita" required style={{ ...inp, width: 70 }} value={unitaSel}
            onChange={e => { if (e.target.value === '__altro__') setUnitaCustom(true); else setUnitaSel(e.target.value) }}>
            {UNITA_PREDEFINITE.map(u => <option key={u} value={u}>{u}</option>)}
            <option value="__altro__">+</option>
          </select>
        )}
      </td>
      <td style={tde}><input name="prezzo_acquisto" type="number" step="0.01" min="0" defaultValue={art.prezzo_acquisto} required style={{ ...inp, width: 80, textAlign: 'right' }} /></td>
      <td style={tde}><input name="prezzo_vendita" type="number" step="0.01" min="0" defaultValue={art.prezzo_vendita} required style={{ ...inp, width: 80, textAlign: 'right' }} /></td>
      <td style={tde} />
      <td style={tde}><input name="note" defaultValue={art.note ?? ''} style={inp} /></td>
      <td style={{ ...tde, whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={handleSubmit} className="btn-green" disabled={pending}
            style={{ padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
            {pending ? '…' : '✓'}
          </button>
          <button className="btn-gray" onClick={onDone}
            style={{ padding: '3px 8px', fontSize: 11 }}>✕</button>
        </div>
        {error && <div style={{ color: '#c00', fontSize: 10, marginTop: 2 }}>{error}</div>}
      </td>
    </tr>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function ListiniClient({ articoli }: { articoli: Articolo[] }) {
  const [filtroTesto, setFiltroTesto]           = useState('')
  const [filtroCategoria, setFiltroCategoria]   = useState('')
  const [filtroProduttore, setFiltroProduttore] = useState('')
  const [filtroDisp, setFiltroDisp]             = useState<'tutti' | 'disp' | 'nondisp'>('tutti')
  const [nuovoOpen, setNuovoOpen]           = useState(false)
  const [editId, setEditId]                 = useState<number | null>(null)
  const [schedaId, setSchedaId]             = useState<number | null>(null)
  const [deletingId, setDeletingId]         = useState<number | null>(null)
  const router = useRouter()

  const categorie  = useMemo(() => [...new Set(articoli.map(a => a.categoria))].sort(), [articoli])
  const produttori = useMemo(() => [...new Set(articoli.map(a => a.produttore).filter(Boolean))].sort(), [articoli])

  const filtrati = useMemo(() => articoli.filter(a => {
    if (filtroCategoria && a.categoria !== filtroCategoria) return false
    if (filtroProduttore && a.produttore !== filtroProduttore) return false
    if (filtroDisp === 'disp' && a.disponibile !== 1) return false
    if (filtroDisp === 'nondisp' && a.disponibile !== 0) return false
    if (filtroTesto) {
      const t = filtroTesto.toLowerCase()
      return a.descrizione.toLowerCase().includes(t) || a.produttore.toLowerCase().includes(t) || (a.note ?? '').toLowerCase().includes(t)
    }
    return true
  }), [articoli, filtroCategoria, filtroProduttore, filtroTesto, filtroDisp])

  const schedaArt = schedaId !== null ? (articoli.find(a => a.id === schedaId) ?? null) : null

  const selInp: React.CSSProperties = {
    padding: '6px 10px', fontSize: 13, border: '1px solid #ccc',
    borderRadius: 4, fontFamily: 'inherit',
  }

  async function handleDelete(id: number) {
    if (!confirm('Eliminare questo articolo?')) return
    setDeletingId(id)
    const fd = new FormData(); fd.set('id', String(id))
    await deleteArticolo(null, fd)
    router.refresh()
    setDeletingId(null)
  }

  return (
    <div>
      {/* Barra filtri */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="Cerca descrizione, produttore…"
          value={filtroTesto} onChange={e => setFiltroTesto(e.target.value)}
          style={{ ...selInp, minWidth: 240 }} />
        <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} style={selInp}>
          <option value="">Tutte le categorie</option>
          {categorie.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filtroProduttore} onChange={e => setFiltroProduttore(e.target.value)} style={selInp}>
          <option value="">Tutti i produttori</option>
          {produttori.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filtroDisp} onChange={e => setFiltroDisp(e.target.value as 'tutti' | 'disp' | 'nondisp')} style={selInp}>
          <option value="tutti">Tutti gli stati</option>
          <option value="disp">Solo disponibili</option>
          <option value="nondisp">Solo non disponibili</option>
        </select>
        <span style={{ fontSize: 13, color: '#888' }}>{filtrati.length} articoli</span>
      </div>

      {/* Pulsante nuovo */}
      {!nuovoOpen ? (
        <button className="btn-green" onClick={() => setNuovoOpen(true)}
          style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          + Nuovo articolo
        </button>
      ) : (
        <NuovoArticoloForm categorie={categorie} produttori={produttori} onDone={() => setNuovoOpen(false)} />
      )}

      {filtrati.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 13 }}>
          {articoli.length === 0 ? 'Nessun articolo. Aggiungine uno con "+ Nuovo articolo".' : 'Nessun risultato.'}
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thS}>Categoria</th>
                <th style={thS}>Produttore</th>
                <th style={thS}>Descrizione</th>
                <th style={{ ...thS, textAlign: 'center' }}>Unità</th>
                <th style={{ ...thS, textAlign: 'right', color: '#90caf9' }}>P. Acquisto €</th>
                <th style={{ ...thS, textAlign: 'right', color: '#a5d6a7' }}>P. Vendita €</th>
                <th style={{ ...thS, textAlign: 'center' }}>Margine</th>
                <th style={thS}>Note</th>
                <th style={thS}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtrati.map(art => (
                editId === art.id
                  ? <RigaEdit key={art.id} art={art} categorie={categorie} produttori={produttori} onDone={() => setEditId(null)} />
                  : <RigaNormale key={art.id} art={art}
                      onEdit={() => setEditId(art.id)}
                      onScheda={() => setSchedaId(art.id)}
                      onDelete={() => handleDelete(art.id)}
                      pending={deletingId === art.id} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Scheda tecnica modale */}
      {schedaArt && <SchedaTecnicaModal art={schedaArt} onClose={() => setSchedaId(null)} />}
    </div>
  )
}
