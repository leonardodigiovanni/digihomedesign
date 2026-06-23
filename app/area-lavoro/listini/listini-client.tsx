'use client'

import React, { useState, useMemo, useActionState, useTransition, useRef, useEffect, useContext, createContext } from 'react'
import { useRouter } from 'next/navigation'
import { addArticolo, updateArticolo, deleteArticolo, cloneArticolo, toggleDisponibile, togglePreventivabile, toggleAcquistabile, togglePrincipale, toggleCaratteristica, toggleColonnaBooleana, updateSchedaTecnica, clearImmagine, type MutResult, type AddResult } from './actions'

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type Fornitore = {
  id: number
  ragione_sociale: string
}

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
  acquistabile: number
  max_acquistabile: number | null
  sconto_articolo: number
  serie: string
  updated_at: string
  foto_url: string | null
  schema_url: string | null
  profilo_frontale_mm: number | null
  profilo_profondita_mm: number | null
  trasmittanza_uw: number | null
  fornitore_id: number | null
  fornitore_nome: string
  principale: number
  caratteristica: number
  richiede_larghezza: number
  richiede_altezza: number
  richiede_quantita: number
  richiede_piano: number
  richiede_km: number
  richiede_peso: number
  richiede_tipo_colore: number
  richiede_tipo_colore_acc: number
  richiede_tipo_vetro: number
  richiede_tipo_montaggio: number
  costante: number
  abbr: string
  minimo: number | null
  filtro_1: number
  filtro_2: number
  filtro_3: number
  filtro_4: number
  filtro_5: number
  filtro_6: number
  filtro_7: number
  filtro_8: number
  filtro_9: number
  filtro_10: number
}

// ─── Visibilità colonne ────────────────────────────────────────────────────────

const COL_KEYS = ['cat','prod','serie','forn','schema','foto','descr','unita','minimo','p_acq','p_vnd','costante','abbr','sconto','margine','note','richiede','filtri','azioni'] as const
type ColKey = typeof COL_KEYS[number]

const COL_LABELS: Record<ColKey, string> = {
  cat: 'Cat.', prod: 'Produttore', serie: 'Serie', forn: 'Fornitore',
  schema: 'Schema', foto: 'Foto', descr: 'Descriz.', unita: 'Unità',
  minimo: 'Minimo', p_acq: 'P.Acq', p_vnd: 'P.Vnd', costante: 'Cost.',
  abbr: 'Abbr', sconto: 'Sconto', margine: 'Margine', note: 'Note',
  richiede: 'Richiede…', filtri: 'Filtri', azioni: 'Azioni',
}

const COL_DEFAULT: Record<ColKey, boolean> = {
  cat: true, prod: true, serie: true, forn: true,
  schema: true, foto: true, descr: true, unita: true,
  minimo: false, p_acq: true, p_vnd: true, costante: false,
  abbr: false, sconto: true, margine: true, note: true,
  richiede: true, filtri: true, azioni: true,
}

const LS_COL_KEY = 'listini_col_vis'
const ColVisCtx = createContext<Record<ColKey, boolean>>(COL_DEFAULT)

function useVis() {
  const cv = useContext(ColVisCtx)
  return (key: ColKey): React.CSSProperties => cv[key] ? {} : { display: 'none' }
}

// ─── Costanti ─────────────────────────────────────────────────────────────────

const UNITA_PREDEFINITE = ['m²', 'ml', 'kg', 't', 'pz', 'h', 'corpo']

const FILTRI_FIELDS = [
  { n: 1,  col: 'Filtro_1',  label: '1A',  title: '1 Anta' },
  { n: 2,  col: 'Filtro_2',  label: '2A',  title: '2 Ante' },
  { n: 3,  col: 'Filtro_3',  label: '3+',  title: '3+ Ante' },
  { n: 4,  col: 'Filtro_4',  label: 'S',   title: 'Sopraluce' },
  { n: 5,  col: 'Filtro_5',  label: 'F5',  title: 'F5' },
  { n: 6,  col: 'Filtro_6',  label: 'F6',  title: 'F6' },
  { n: 7,  col: 'Filtro_7',  label: 'F7',  title: 'F7' },
  { n: 8,  col: 'Filtro_8',  label: 'F8',  title: 'F8' },
  { n: 9,  col: 'Filtro_9',  label: 'F9',  title: 'F9' },
  { n: 10, col: 'Filtro_10', label: 'F10', title: 'F10' },
]

function getFiltro(art: Articolo, n: number): number {
  return (art as unknown as Record<string, number>)[`filtro_${n}`] ?? 0
}

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
  borderRight: '1px solid #444',
  background: '#2a2a3e', userSelect: 'none',
}

// ─── Form nuovo articolo ──────────────────────────────────────────────────────

function NuovoArticoloForm({ categorie, produttori, fornitori, onDone }: {
  categorie: string[]; produttori: string[]; fornitori: Fornitore[]; onDone: (newId?: number) => void
}) {
  const [result, action, pending] = useActionState<AddResult | null, FormData>(addArticolo, null)
  const [unitaCustom, setUnitaCustom] = useState(false)
  const [unitaSel, setUnitaSel] = useState(UNITA_PREDEFINITE[0])
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef      = useRef<HTMLInputElement>(null)
  const pendingFile  = useRef<File | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!result?.ok) return
    const file = pendingFile.current
    if (file) {
      const fd = new FormData()
      fd.set('id', String(result.id))
      fd.set('foto', file)
      fd.set('tipo', 'foto')
      fetch('/api/listini/foto', { method: 'POST', body: fd }).finally(() => {
        router.refresh(); onDone(result.id)
      })
    } else {
      router.refresh(); onDone(result.id)
    }
  }, [result])

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
          <label style={lbl}>Produttore / Marca</label>
          <input name="produttore" style={inp} list="prod-list" placeholder="Es. Schüco" />
          <datalist id="prod-list">{produttori.map(p => <option key={p} value={p} />)}</datalist>
        </div>

        <div>
          <label style={lbl}>Serie / Modello</label>
          <input name="serie" style={inp} placeholder="Es. AWS 75" />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label style={lbl}>Etichetta / Descrizione *</label>
          <input name="descrizione" required style={inp} placeholder="Es. Finestra scorrevole 2 ante" />
        </div>

        {/* Upload foto */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Foto prodotto</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: 80, height: 64, border: '2px dashed #ccc', borderRadius: 5,
                cursor: 'pointer', overflow: 'hidden', background: '#f0f0f0', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {preview
                ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <span style={{ fontSize: 10, color: '#bbb', textAlign: 'center' }}>Clicca</span>
              }
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0]
                if (!f) return
                pendingFile.current = f
                setPreview(URL.createObjectURL(f))
              }}
            />
            <button type="button" onClick={() => fileRef.current?.click()}
              style={{ padding: '5px 12px', fontSize: 12, border: '1px solid #ccc', borderRadius: 4, background: '#f5f5f5', cursor: 'pointer' }}>
              {preview ? 'Cambia immagine' : 'Scegli immagine…'}
            </button>
            {preview && (
              <button type="button" onClick={() => { pendingFile.current = null; setPreview(null); if (fileRef.current) fileRef.current.value = '' }}
                style={{ padding: '5px 10px', fontSize: 12, border: '1px solid #ecc', borderRadius: 4, background: '#fff5f5', color: '#c00', cursor: 'pointer' }}>
                ✕
              </button>
            )}
          </div>
        </div>

        <div>
          <label style={lbl}>Fornitore</label>
          <select name="fornitore_id" style={inp}>
            <option value="">— nessuno —</option>
            {fornitori.map(f => <option key={f.id} value={f.id}>{f.ragione_sociale}</option>)}
          </select>
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

        <div>
          <label style={lbl}>Max acquistabile</label>
          <input name="max_acquistabile" type="number" min={0} step="1" style={inp} placeholder="vuoto=illimitato, 0=esaurito" />
        </div>

        <div>
          <label style={lbl}>Sconto articolo %</label>
          <input name="sconto_articolo" type="number" step="0.01" min="-100" max="100" defaultValue="0" style={inp} placeholder="0 = nessuno, neg. = magg." />
        </div>

      </div>
      {result && !result.ok && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{result.error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-green" disabled={pending}>
          {pending ? 'Salvataggio…' : 'Salva'}
        </button>
        <button type="button" className="btn-gray" onClick={() => onDone()}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Riga upload immagine riusabile ──────────────────────────────────────────

function ImgUploadRow({ preview, isTarget, pasteFlash, uploading, fileRef, onActivate, onFileChange }: {
  preview: string | null
  isTarget: boolean
  pasteFlash: boolean
  uploading: boolean
  fileRef: React.RefObject<HTMLInputElement | null>
  onActivate: () => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
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
          ? <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          : <span style={{ fontSize: 11, color: '#bbb', textAlign: 'center', padding: 8 }}>Clicca per<br/>caricare</span>
        }
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ padding: '6px 14px', fontSize: 12, border: '1px solid #ccc', borderRadius: 4, background: '#f5f5f5', cursor: uploading ? 'wait' : 'pointer' }}
        >
          {uploading ? 'Caricamento…' : 'Scegli file…'}
        </button>
        <div
          onClick={onActivate}
          style={{
            border: `2px ${isTarget ? 'solid' : 'dashed'} ${pasteFlash ? '#2b6cb0' : isTarget ? '#2b6cb0' : '#ccc'}`,
            borderRadius: 5, padding: '8px 10px',
            background: pasteFlash ? '#ebf4ff' : isTarget ? '#f0f6ff' : '#fafafa',
            textAlign: 'center', fontSize: 11,
            color: pasteFlash ? '#2b6cb0' : isTarget ? '#2b6cb0' : '#aaa',
            transition: 'all 0.2s', userSelect: 'none', cursor: 'pointer',
          }}
        >
          {pasteFlash ? '✓ Incollata' : isTarget ? '📋 Ctrl+V qui (attivo)' : '📋 Clicca per attivare Ctrl+V'}
        </div>
        <p style={{ margin: 0, fontSize: 10, color: '#bbb' }}>JPG, PNG, WebP — max 5 MB</p>
      </div>
    </div>
  )
}

// ─── Scheda tecnica ───────────────────────────────────────────────────────────

function SchedaTecnicaModal({ art, onClose }: { art: Articolo; onClose: () => void }) {
  const router = useRouter()
  const [result, formAction, pending] = useActionState<MutResult | null, FormData>(updateSchedaTecnica, null)
  const [preview,       setPreview]       = useState<string | null>(art.foto_url   ?? null)
  const [previewSchema, setPreviewSchema] = useState<string | null>(art.schema_url ?? null)
  const [uploading,  setUploading]  = useState(false)
  const [uploadErr,  setUploadErr]  = useState<string | null>(null)
  const [pasteFlash,       setPasteFlash]       = useState(false)
  const [pasteFlashSchema, setPasteFlashSchema] = useState(false)
  const [pasteTarget, setPasteTarget] = useState<'foto' | 'schema'>('foto')
  const fileRef       = useRef<HTMLInputElement>(null)
  const fileRefSchema = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (result?.ok) { router.refresh(); onClose() }
  }, [result])

  async function uploadFile(f: File, tipo: 'foto' | 'schema') {
    setUploadErr(null)
    setUploading(true)
    const objUrl = URL.createObjectURL(f)
    if (tipo === 'foto') setPreview(objUrl); else setPreviewSchema(objUrl)
    const fd = new FormData()
    fd.set('id', String(art.id))
    fd.set('foto', f)
    fd.set('tipo', tipo)
    try {
      const res  = await fetch('/api/listini/foto', { method: 'POST', body: fd })
      const data = await res.json() as { ok: boolean; foto_url?: string; schema_url?: string; error?: string }
      if (data.ok) {
        if (tipo === 'foto'   && data.foto_url)   setPreview      (data.foto_url   + '?t=' + Date.now())
        if (tipo === 'schema' && data.schema_url) setPreviewSchema(data.schema_url + '?t=' + Date.now())
      } else {
        setUploadErr(data.error ?? 'Errore upload')
      }
    } catch {
      setUploadErr('Errore di rete durante l\'upload')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    function handlePaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            if (pasteTarget === 'foto') { setPasteFlash(true); setTimeout(() => setPasteFlash(false), 600) }
            else                        { setPasteFlashSchema(true); setTimeout(() => setPasteFlashSchema(false), 600) }
            uploadFile(file, pasteTarget)
          }
          break
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [pasteTarget])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, tipo: 'foto' | 'schema') {
    const f = e.target.files?.[0]
    if (!f) return
    uploadFile(f, tipo)
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

          <div style={{ marginBottom: 14 }}>
            <span style={lbl}>Foto prodotto</span>
            <ImgUploadRow
              preview={preview}
              isTarget={pasteTarget === 'foto'}
              pasteFlash={pasteFlash}
              uploading={uploading}
              fileRef={fileRef}
              onActivate={() => setPasteTarget('foto')}
              onFileChange={e => handleFile(e, 'foto')}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <span style={lbl}>Schema</span>
            <ImgUploadRow
              preview={previewSchema}
              isTarget={pasteTarget === 'schema'}
              pasteFlash={pasteFlashSchema}
              uploading={uploading}
              fileRef={fileRefSchema}
              onActivate={() => setPasteTarget('schema')}
              onFileChange={e => handleFile(e, 'schema')}
            />
          </div>

          {uploadErr && <p style={{ color: '#c00', fontSize: 11, margin: '-10px 0 14px', background: '#fff5f5', padding: '6px 10px', borderRadius: 4 }}>{uploadErr}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={lbl}>Frontale (mm)</label>
              <input name="profilo_frontale_mm" type="number" step="0.1" min="0" defaultValue={art.profilo_frontale_mm ?? ''} placeholder="es. 70" style={numInp} />
            </div>
            <div>
              <label style={lbl}>Profondità (mm)</label>
              <input name="profilo_profondita_mm" type="number" step="0.1" min="0" defaultValue={art.profilo_profondita_mm ?? ''} placeholder="es. 80" style={numInp} />
            </div>
            <div>
              <label style={lbl}>Uw (W/m²K)</label>
              <input name="trasmittanza_uw" type="number" step="0.001" min="0" defaultValue={art.trasmittanza_uw ?? ''} placeholder="es. 1.3" style={numInp} />
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

// ─── Toggle buttons ────────────────────────────────────────────────────────────

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
        color: '#fff', whiteSpace: 'nowrap', minWidth: 76, textAlign: 'center',
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
        color: '#fff', whiteSpace: 'nowrap', minWidth: 64, textAlign: 'center',
      }}>
        {prev ? 'Preventiv.' : 'No prev.'}
      </button>
    </form>
  )
}

function ToggleAcquistabileBtn({ art }: { art: Articolo }) {
  const [, startT] = React.useTransition()
  const router = useRouter()
  const acq = art.acquistabile === 1
  return (
    <form style={{ display: 'contents' }} action={async fd => {
      startT(async () => { await toggleAcquistabile(null, fd); router.refresh() })
    }}>
      <input type="hidden" name="id" value={art.id} />
      <button type="submit" style={{
        padding: '2px 8px', fontSize: 10, fontWeight: 700, borderRadius: 3,
        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        background: acq ? '#6a1b9a' : '#aaa',
        color: '#fff', whiteSpace: 'nowrap', minWidth: 58, textAlign: 'center',
      }}>
        {acq ? 'Acquist.' : 'No acq.'}
      </button>
    </form>
  )
}

function TogglePrincipaleBtn({ art }: { art: Articolo }) {
  const [, startT] = React.useTransition()
  const router = useRouter()
  const val = art.principale === 1
  return (
    <form style={{ display: 'contents' }} action={async fd => {
      startT(async () => { await togglePrincipale(null, fd); router.refresh() })
    }}>
      <input type="hidden" name="id" value={art.id} />
      <button type="submit" style={{
        padding: '2px 8px', fontSize: 10, fontWeight: 700, borderRadius: 3,
        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        background: val ? '#1b5e20' : '#aaa',
        color: '#fff', whiteSpace: 'nowrap', minWidth: 62, textAlign: 'center',
      }}>
        {val ? 'Princ.' : 'No princ.'}
      </button>
    </form>
  )
}

function ToggleCheckbox({ id, colonna, valore }: { id: number; colonna: string; valore: number }) {
  const [, startT] = React.useTransition()
  const router = useRouter()
  const checked = valore === 1
  return (
    <form style={{ display: 'contents' }} action={async fd => {
      startT(async () => { await toggleColonnaBooleana(null, fd); router.refresh() })
    }}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="colonna" value={colonna} />
      <button type="submit" style={{
        width: 18, height: 18, padding: 0, cursor: 'pointer', fontFamily: 'inherit',
        background: checked ? '#1565c0' : '#fff',
        border: `2px solid ${checked ? '#1565c0' : '#bbb'}`,
        borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 12, lineHeight: 1,
      }}>
        {checked ? '✓' : ''}
      </button>
    </form>
  )
}

function ToggleCaratteristicaBtn({ art }: { art: Articolo }) {
  const [, startT] = React.useTransition()
  const router = useRouter()
  const val = art.caratteristica === 1
  return (
    <form style={{ display: 'contents' }} action={async fd => {
      startT(async () => { await toggleCaratteristica(null, fd); router.refresh() })
    }}>
      <input type="hidden" name="id" value={art.id} />
      <button type="submit" style={{
        padding: '2px 8px', fontSize: 10, fontWeight: 700, borderRadius: 3,
        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        background: val ? '#4a148c' : '#aaa',
        color: '#fff', whiteSpace: 'nowrap', minWidth: 62, textAlign: 'center',
      }}>
        {val ? 'Carat.' : 'No carat.'}
      </button>
    </form>
  )
}

function ImgCell({ artId, url, tipo, alt }: { artId: number; url: string | null; tipo: 'schema' | 'foto'; alt: string }) {
  const [, startT] = React.useTransition()
  const router = useRouter()
  return (
    <div style={{ position: 'relative', width: '100%', height: 90 }}>
      {url
        ? <img src={url} alt={alt} style={{ display: 'block', width: '100%', height: 90, objectFit: 'contain', background: '#f5f5f5', borderRadius: 3 }} />
        : <div style={{ width: '100%', height: 90, background: '#f5f5f5', borderRadius: 3 }} />
      }
      {url && (
        <form style={{ position: 'absolute', top: 2, right: 2 }} action={async fd => {
          startT(async () => { await clearImmagine(null, fd); router.refresh() })
        }}>
          <input type="hidden" name="id" value={artId} />
          <input type="hidden" name="tipo" value={tipo} />
          <button type="submit" title={`Rimuovi ${tipo}`} style={{
            width: 18, height: 18, padding: 0, lineHeight: 1, fontSize: 11, fontWeight: 700,
            background: 'rgba(180,30,30,0.85)', color: '#fff', border: 'none',
            borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </form>
      )}
    </div>
  )
}

// ─── Riga normale ─────────────────────────────────────────────────────────────

function RigaNormale({ art, onEdit, onScheda, onDelete, onAction, pending }: {
  art: Articolo
  onEdit: () => void
  onScheda: () => void
  onDelete: () => void
  onAction: () => void
  pending: boolean
}) {
  const vis = useVis()
  const m = margine(art.prezzo_acquisto, art.prezzo_vendita)
  const nonDisp = art.disponibile === 0
  const td: React.CSSProperties = {
    padding: '7px 10px', borderBottom: '1px solid #eee', borderRight: '1px solid #eee', fontSize: 12, verticalAlign: 'middle',
    opacity: nonDisp ? 0.45 : 1,
  }
  const hasDati = art.profilo_frontale_mm != null || art.profilo_profondita_mm != null || art.trasmittanza_uw != null

  return (
    <tr onDoubleClick={onEdit} onClick={onAction} style={{ cursor: 'pointer', background: nonDisp ? '#f9f9f9' : undefined }} title="Doppio click per modificare">
      <td style={{ ...td, ...vis('cat') }}><span style={{ background: '#e8e8f8', borderRadius: 3, padding: '2px 7px', fontSize: 11, fontWeight: 600 }}>{art.categoria}</span></td>
      <td style={{ ...td, color: '#555', ...vis('prod') }}>{art.produttore || '—'}</td>
      <td style={{ ...td, color: '#555', ...vis('serie') }}>{art.serie || '—'}</td>
      <td style={{ ...td, color: '#555', ...vis('forn') }}>{art.fornitore_nome || '—'}</td>
      <td style={{ ...td, padding: 4, width: 140, minWidth: 120, ...vis('schema') }}>
        <ImgCell artId={art.id} url={art.schema_url} tipo="schema" alt="schema" />
      </td>
      <td style={{ ...td, padding: 4, width: 140, minWidth: 120, ...vis('foto') }}>
        <ImgCell artId={art.id} url={art.foto_url} tipo="foto" alt={art.descrizione} />
      </td>
      <td style={{ ...td, fontWeight: 500, maxWidth: 300, ...vis('descr') }}>
        {art.descrizione}
      </td>
      <td style={{ ...td, textAlign: 'center', color: '#666', ...vis('unita') }}>{art.unita}</td>
      <td style={{ ...td, textAlign: 'center', color: '#666', ...vis('minimo') }}>{art.minimo ?? ''}</td>
      <td style={{ ...td, textAlign: 'right', color: '#1565c0', fontWeight: 600, ...vis('p_acq') }}>{fmt(art.prezzo_acquisto)}</td>
      <td style={{ ...td, textAlign: 'right', color: '#2e7d32', fontWeight: 600, ...vis('p_vnd') }}>{fmt(art.prezzo_vendita)}</td>
      <td style={{ ...td, textAlign: 'right', color: '#aaa', fontSize: 11, ...vis('costante') }}>
        {art.costante !== 0 ? art.costante : ''}
      </td>
      <td style={{ ...td, color: '#aaa', fontSize: 11, ...vis('abbr') }}>
        {art.abbr || ''}
      </td>
      <td style={{ ...td, textAlign: 'center', ...vis('sconto') }}>
        {art.sconto_articolo !== 0
          ? <span style={{ color: art.sconto_articolo < 0 ? '#1565c0' : '#e65100', fontWeight: 700, fontSize: 11 }}>
              {art.sconto_articolo < 0 ? `+${Math.abs(art.sconto_articolo)}%` : `${art.sconto_articolo}%`}
            </span>
          : <span style={{ color: '#ccc' }}>—</span>}
      </td>
      <td style={{ ...td, textAlign: 'center', ...vis('margine') }}>
        {m ? <span style={{ color: m.color, fontWeight: 700, fontSize: 11 }}>{m.pct}</span> : <span style={{ color: '#ccc' }}>—</span>}
      </td>
      <td style={{ ...td, color: '#888', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...vis('note') }}>
        {art.note || '—'}
        {art.max_acquistabile === 0 && (
          <span style={{ marginLeft: 6, background: '#c62828', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 3, padding: '1px 5px' }}>ESAURITO</span>
        )}
        {art.max_acquistabile != null && art.max_acquistabile > 0 && (
          <span style={{ marginLeft: 6, background: '#e65100', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 3, padding: '1px 5px' }}>Max {art.max_acquistabile}</span>
        )}
      </td>
      <td style={{ ...td, textAlign: 'center', ...vis('richiede') }}><ToggleCheckbox id={art.id} colonna="richiede_larghezza"   valore={art.richiede_larghezza} /></td>
      <td style={{ ...td, textAlign: 'center', ...vis('richiede') }}><ToggleCheckbox id={art.id} colonna="richiede_altezza"    valore={art.richiede_altezza} /></td>
      <td style={{ ...td, textAlign: 'center', ...vis('richiede') }}><ToggleCheckbox id={art.id} colonna="richiede_quantita"   valore={art.richiede_quantita} /></td>
      <td style={{ ...td, textAlign: 'center', ...vis('richiede') }}><ToggleCheckbox id={art.id} colonna="richiede_piano"      valore={art.richiede_piano} /></td>
      <td style={{ ...td, textAlign: 'center', ...vis('richiede') }}><ToggleCheckbox id={art.id} colonna="richiede_km"         valore={art.richiede_km} /></td>
      <td style={{ ...td, textAlign: 'center', ...vis('richiede') }}><ToggleCheckbox id={art.id} colonna="richiede_peso"       valore={art.richiede_peso} /></td>
      <td style={{ ...td, textAlign: 'center', ...vis('richiede') }}><ToggleCheckbox id={art.id} colonna="richiede_tipo_colore"     valore={art.richiede_tipo_colore} /></td>
      <td style={{ ...td, textAlign: 'center', ...vis('richiede') }}><ToggleCheckbox id={art.id} colonna="richiede_tipo_colore_acc" valore={art.richiede_tipo_colore_acc} /></td>
      <td style={{ ...td, textAlign: 'center', ...vis('richiede') }}><ToggleCheckbox id={art.id} colonna="richiede_tipo_vetro"      valore={art.richiede_tipo_vetro} /></td>
      <td style={{ ...td, textAlign: 'center', ...vis('richiede') }}><ToggleCheckbox id={art.id} colonna="richiede_tipo_montaggio" valore={art.richiede_tipo_montaggio} /></td>
      <td style={{ ...td, padding: 4, verticalAlign: 'middle', ...vis('filtri') }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px', width: 126 }}>
          {FILTRI_FIELDS.map(f => (
            <div key={f.col} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }} title={f.title}>
              <ToggleCheckbox id={art.id} colonna={f.col} valore={getFiltro(art, f.n)} />
              <span style={{ fontSize: 8, color: '#888', lineHeight: 1 }}>{f.label}</span>
            </div>
          ))}
        </div>
      </td>
      <td style={{ ...td, opacity: 1, whiteSpace: 'nowrap', ...vis('azioni') }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <ToggleDisponibileBtn art={art} />
          <TogglePreventivabileBtn art={art} />
          <ToggleAcquistabileBtn art={art} />
          <TogglePrincipaleBtn art={art} />
          <ToggleCaratteristicaBtn art={art} />
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
          <button onClick={onDelete} disabled={pending} className="btn-red">Elimina</button>
        </div>
      </td>
    </tr>
  )
}

// ─── Riga in modifica ─────────────────────────────────────────────────────────

function RigaEdit({ art, categorie, produttori, fornitori, onDone, onSaved }: {
  art: Articolo; categorie: string[]; produttori: string[]; fornitori: Fornitore[]; onDone: () => void; onSaved?: (id: number) => void
}) {
  const vis = useVis()
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
      if (result?.ok) { onSaved?.(art.id); router.refresh(); onDone() }
      else setError(result?.error ?? 'Errore')
    })
  }

  const tde: React.CSSProperties = { padding: '5px 6px', borderBottom: '1px solid #c8960c', borderRight: '1px solid #c8960c', background: '#fffdf0', verticalAlign: 'middle' }

  return (
    <tr ref={trRef} style={{ background: '#fffdf0' }}>
      <td style={{ ...tde, ...vis('cat') }}>
        <input name="categoria" defaultValue={art.categoria} required style={inp} list="cat-list-edit" />
        <datalist id="cat-list-edit">{categorie.map(c => <option key={c} value={c} />)}</datalist>
      </td>
      <td style={{ ...tde, ...vis('prod') }}>
        <input name="produttore" defaultValue={art.produttore} style={inp} list="prod-list-edit" />
        <datalist id="prod-list-edit">{produttori.map(p => <option key={p} value={p} />)}</datalist>
      </td>
      <td style={{ ...tde, ...vis('serie') }}>
        <input name="serie" defaultValue={art.serie} style={inp} placeholder="Es. AWS 75" />
      </td>
      <td style={{ ...tde, ...vis('forn') }}>
        <select name="fornitore_id" defaultValue={art.fornitore_id ?? ''} style={{ ...inp, width: 130 }}>
          <option value="">—</option>
          {fornitori.map(f => <option key={f.id} value={f.id}>{f.ragione_sociale}</option>)}
        </select>
      </td>
      <td style={{ ...tde, ...vis('schema') }} />
      <td style={{ ...tde, ...vis('foto') }} />
      <td style={{ ...tde, ...vis('descr') }}><input name="descrizione" defaultValue={art.descrizione} required style={inp} /></td>
      <td style={{ ...tde, ...vis('unita') }}>
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
      <td style={{ ...tde, ...vis('minimo') }}><input name="minimo" type="number" step="0.0001" min="0" defaultValue={art.minimo ?? ''} style={{ ...inp, width: 70, textAlign: 'right' }} placeholder="—" /></td>
      <td style={{ ...tde, ...vis('p_acq') }}><input name="prezzo_acquisto" type="number" step="0.01" min="0" defaultValue={art.prezzo_acquisto} required style={{ ...inp, width: 80, textAlign: 'right' }} /></td>
      <td style={{ ...tde, ...vis('p_vnd') }}><input name="prezzo_vendita" type="number" step="0.01" min="0" defaultValue={art.prezzo_vendita} required style={{ ...inp, width: 80, textAlign: 'right' }} /></td>
      <td style={{ ...tde, ...vis('costante') }}><input name="costante" type="number" step="0.0001" defaultValue={art.costante} style={{ ...inp, width: 80, textAlign: 'right' }} /></td>
      <td style={{ ...tde, ...vis('abbr') }}><input name="abbr" defaultValue={art.abbr} style={{ ...inp, width: 70 }} placeholder="abbr" /></td>
      <td style={{ ...tde, ...vis('sconto') }}><input name="sconto_articolo" type="number" step="0.01" min="-100" max="100" defaultValue={art.sconto_articolo} style={{ ...inp, width: 60, textAlign: 'right' }} /></td>
      <td style={{ ...tde, ...vis('margine') }} />
      <td style={{ ...tde, ...vis('note') }}>
        <input name="note" defaultValue={art.note ?? ''} style={{ ...inp, marginBottom: 3 }} placeholder="Note" />
        <input name="max_acquistabile" type="number" min={0} step="1"
          defaultValue={art.max_acquistabile ?? ''} style={{ ...inp, width: 70 }}
          placeholder="max" title="vuoto=illimitato, 0=esaurito" />
      </td>
      <td style={{ ...tde, ...vis('richiede') }} /><td style={{ ...tde, ...vis('richiede') }} /><td style={{ ...tde, ...vis('richiede') }} /><td style={{ ...tde, ...vis('richiede') }} />
      <td style={{ ...tde, ...vis('richiede') }} /><td style={{ ...tde, ...vis('richiede') }} /><td style={{ ...tde, ...vis('richiede') }} /><td style={{ ...tde, ...vis('richiede') }} /><td style={{ ...tde, ...vis('richiede') }} /><td style={{ ...tde, ...vis('richiede') }} />
      <td style={{ ...tde, ...vis('filtri') }} />
      <td style={{ ...tde, whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={handleSubmit} className="btn-green" disabled={pending}>
            {pending ? '…' : '✓'}
          </button>
          <button className="btn-gray" onClick={onDone}>✕</button>
        </div>
        {error && <div style={{ color: '#c00', fontSize: 10, marginTop: 2 }}>{error}</div>}
      </td>
    </tr>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function ListiniClient({ articoli, fornitori }: { articoli: Articolo[]; fornitori: Fornitore[] }) {
  const [filtroTesto, setFiltroTesto]           = useState('')
  const [filtroCategoria, setFiltroCategoria]   = useState('')
  const [filtroProduttore, setFiltroProduttore] = useState('')
  const [filtroSerie, setFiltroSerie]           = useState('')
  const [filtroFornitore, setFiltroFornitore]   = useState('')
  const [filtroDisp, setFiltroDisp]             = useState<'tutti' | 'disp' | 'nondisp'>('tutti')
  const [nuovoOpen, setNuovoOpen]           = useState(false)
  const [editId, setEditId]                 = useState<number | null>(null)
  const [schedaId, setSchedaId]             = useState<number | null>(null)
  const [deletingId, setDeletingId]         = useState<number | null>(null)
  const [lastId, setLastId]                 = useState<number | null>(null)
  const [isCloning, setIsCloning]           = useState(false)
  const [colVis, setColVis]                 = useState<Record<ColKey, boolean>>(COL_DEFAULT)
  const router = useRouter()

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_COL_KEY)
      if (saved) setColVis(prev => ({ ...prev, ...JSON.parse(saved) }))
    } catch {}
  }, [])

  function toggleCol(key: ColKey) {
    setColVis(prev => {
      const next = { ...prev, [key]: !prev[key] }
      try { localStorage.setItem(LS_COL_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  const categorie  = useMemo(() => [...new Set(articoli.map(a => a.categoria))].sort(), [articoli])
  const produttori = useMemo(() => [...new Set(articoli.map(a => a.produttore).filter(Boolean))].sort(), [articoli])
  const serie      = useMemo(() => [...new Set(articoli.map(a => a.serie).filter(Boolean))].sort(), [articoli])

  const filtrati = useMemo(() => articoli.filter(a => {
    if (filtroCategoria && a.categoria !== filtroCategoria) return false
    if (filtroProduttore && a.produttore !== filtroProduttore) return false
    if (filtroSerie && a.serie !== filtroSerie) return false
    if (filtroFornitore && String(a.fornitore_id ?? '') !== filtroFornitore) return false
    if (filtroDisp === 'disp' && a.disponibile !== 1) return false
    if (filtroDisp === 'nondisp' && a.disponibile !== 0) return false
    if (filtroTesto) {
      const t = filtroTesto.toLowerCase()
      return a.descrizione.toLowerCase().includes(t) || a.produttore.toLowerCase().includes(t) || a.fornitore_nome.toLowerCase().includes(t) || (a.note ?? '').toLowerCase().includes(t)
    }
    return true
  }), [articoli, filtroCategoria, filtroProduttore, filtroSerie, filtroFornitore, filtroTesto, filtroDisp])

  const schedaArt = schedaId !== null ? (articoli.find(a => a.id === schedaId) ?? null) : null

  const selInp: React.CSSProperties = {
    padding: '6px 10px', fontSize: 13, border: '1px solid #ccc',
    borderRadius: 4, fontFamily: 'inherit',
  }

  async function handleClone() {
    if (!lastId) return
    setIsCloning(true)
    const fd = new FormData(); fd.set('id', String(lastId))
    const res = await cloneArticolo(null, fd)
    if (res.ok) { setLastId(res.id); router.refresh() }
    setIsCloning(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Eliminare questo articolo?')) return
    setDeletingId(id)
    const fd = new FormData(); fd.set('id', String(id))
    await deleteArticolo(null, fd)
    router.refresh()
    setDeletingId(null)
  }

  // helper locale per th
  const thVis = (key: ColKey): React.CSSProperties => colVis[key] ? {} : { display: 'none' }

  return (
    <ColVisCtx.Provider value={colVis}>
      <div>
        {/* Selettore colonne */}
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center',
          padding: '8px 12px', background: '#1e1e30', borderRadius: 8, marginBottom: 12,
        }}>
          <span style={{ fontSize: 11, color: '#c8960c', fontWeight: 700, whiteSpace: 'nowrap', marginRight: 4 }}>Colonne:</span>
          {COL_KEYS.map(key => (
            <button
              key={key}
              onClick={() => toggleCol(key)}
              style={{
                padding: '3px 9px', fontSize: 10, fontWeight: 700, borderRadius: 3,
                border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                background: colVis[key] ? '#c8960c' : '#3a3a3a',
                color: colVis[key] ? '#fff' : '#666',
              }}
            >
              {COL_LABELS[key]}
            </button>
          ))}
        </div>

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
          <select value={filtroSerie} onChange={e => setFiltroSerie(e.target.value)} style={selInp}>
            <option value="">Tutte le serie</option>
            {serie.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filtroFornitore} onChange={e => setFiltroFornitore(e.target.value)} style={selInp}>
            <option value="">Tutti i fornitori</option>
            {fornitori.map(f => <option key={f.id} value={f.id}>{f.ragione_sociale}</option>)}
          </select>
          <select value={filtroDisp} onChange={e => setFiltroDisp(e.target.value as 'tutti' | 'disp' | 'nondisp')} style={selInp}>
            <option value="tutti">Tutti gli stati</option>
            <option value="disp">Solo disponibili</option>
            <option value="nondisp">Solo non disponibili</option>
          </select>
          <span style={{ fontSize: 13, color: '#888' }}>{filtrati.length} articoli</span>
        </div>

        {/* Pulsanti nuovo / ripeti */}
        {!nuovoOpen ? (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button className="btn-green" onClick={() => setNuovoOpen(true)}>+ Nuovo articolo</button>
            <button className="btn-green" onClick={handleClone} disabled={lastId === null || isCloning}
              style={{ opacity: lastId === null ? 0.4 : 1 }}>
              {isCloning ? 'Clonazione…' : '+ Ripeti articolo'}
            </button>
          </div>
        ) : (
          <NuovoArticoloForm categorie={categorie} produttori={produttori} fornitori={fornitori}
            onDone={(newId) => { if (newId) setLastId(newId); setNuovoOpen(false) }} />
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
                  <th style={{ ...thS, ...thVis('cat') }}>Categoria</th>
                  <th style={{ ...thS, ...thVis('prod') }}>Produttore</th>
                  <th style={{ ...thS, ...thVis('serie') }}>Serie</th>
                  <th style={{ ...thS, ...thVis('forn') }}>Fornitore</th>
                  <th style={{ ...thS, width: 140, ...thVis('schema') }}>Schema</th>
                  <th style={{ ...thS, width: 140, ...thVis('foto') }}>Foto prodotto</th>
                  <th style={{ ...thS, ...thVis('descr') }}>Descrizione</th>
                  <th style={{ ...thS, textAlign: 'center', ...thVis('unita') }}>Unità</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#b0bec5', fontSize: 10, ...thVis('minimo') }}>Minimo</th>
                  <th style={{ ...thS, textAlign: 'right', color: '#90caf9', ...thVis('p_acq') }}>P. Acquisto €</th>
                  <th style={{ ...thS, textAlign: 'right', color: '#a5d6a7', ...thVis('p_vnd') }}>P. Vendita €</th>
                  <th style={{ ...thS, textAlign: 'right', color: '#b0bec5', fontSize: 10, ...thVis('costante') }}>Costante</th>
                  <th style={{ ...thS, color: '#b0bec5', fontSize: 10, ...thVis('abbr') }}>Abbr</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#ffb74d', ...thVis('sconto') }}>Sconto %</th>
                  <th style={{ ...thS, textAlign: 'center', ...thVis('margine') }}>Margine</th>
                  <th style={{ ...thS, ...thVis('note') }}>Note / Max</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#80cbc4', ...thVis('richiede') }}>larghezza</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#80cbc4', ...thVis('richiede') }}>altezza</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#80cbc4', ...thVis('richiede') }}>quantita</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#80cbc4', ...thVis('richiede') }}>piano</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#80cbc4', ...thVis('richiede') }}>km</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#80cbc4', ...thVis('richiede') }}>peso</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#ce93d8', ...thVis('richiede') }}>tipo_colore</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#ce93d8', ...thVis('richiede') }}>tipo_colore_acc</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#ce93d8', ...thVis('richiede') }}>tipo_vetro</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#ce93d8', ...thVis('richiede') }}>tipo_montaggio</th>
                  <th style={{ ...thS, textAlign: 'center', color: '#80deea', ...thVis('filtri') }}>Filtri</th>
                  <th style={{ ...thS, ...(colVis['azioni'] || editId !== null ? {} : { display: 'none' }) }}>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filtrati.map(art => (
                  editId === art.id
                    ? <RigaEdit key={art.id} art={art} categorie={categorie} produttori={produttori} fornitori={fornitori} onDone={() => setEditId(null)} onSaved={(id) => setLastId(id)} />
                    : <RigaNormale key={art.id} art={art}
                        onEdit={() => setEditId(art.id)}
                        onScheda={() => setSchedaId(art.id)}
                        onDelete={() => handleDelete(art.id)}
                        onAction={() => setLastId(art.id)}
                        pending={deletingId === art.id} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {schedaArt && <SchedaTecnicaModal art={schedaArt} onClose={() => setSchedaId(null)} />}
      </div>
    </ColVisCtx.Provider>
  )
}
