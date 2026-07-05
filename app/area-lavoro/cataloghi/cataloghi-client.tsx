'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addVoce, updateVoce, deleteVoce } from './actions'
import { addPercorsoVoce, removePercorsoVoce, type Percorso } from '@/lib/percorsi'
import GestioneBlob from '@/components/gestione-blob'

function pdfSrc(filename: string): string {
  return filename.startsWith('https://') ? filename : `/uploads/cataloghi/${filename}`
}

const inp: React.CSSProperties = {
  padding: '6px 10px', border: '1px solid #ccc', borderRadius: 4,
  fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = { fontSize: 11, color: '#666', display: 'block', marginBottom: 2 }

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type Voce = {
  id: number
  nome: string
  serie: string
  pdf_filename: string
  pdf_label: string
  descrizione: string
  filtro_battente: number
  filtro_scorrevole: number
  filtro_taglio_termico: number
  filtro_taglio_freddo: number
  filtro_economico: number
  filtro_fascia_alta: number
  fase: string | null
  materiale: string | null
  tipologia: string | null
  ambiente: string | null
  fascia: string | null
  filtro_1: number
  filtro_2: number
  filtro_3: number
  filtro_4: number
  schema_url: string | null
}

// ─── Form nuova voce ──────────────────────────────────────────────────────────

function NuovaVoceForm({ onDone }: { onDone: () => void }) {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [errore, setErrore] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!pdfFile) { setErrore('Seleziona un PDF.'); return }
    const form = e.currentTarget
    setErrore('')
    setUploading(true)
    try {
      const uf = new FormData()
      uf.append('file', pdfFile)
      const res = await fetch('/api/upload-catalogo', { method: 'POST', body: uf })
      const data = await res.json()
      if (data.error) { setErrore(data.error); return }
      const fd = new FormData(form)
      fd.set('pdf_filename', data.filename)
      const result = await addVoce(null, fd)
      if (result.ok) { router.refresh(); onDone() }
      else setErrore(result.error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#f8f8f8', border: '1px solid #ddd', borderRadius: 6,
      padding: '14px 16px', marginBottom: 12,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={lbl}>Marca / Produttore *</label>
          <input name="nome" required style={inp} placeholder="Es. Schüco" />
        </div>
        <div>
          <label style={lbl}>Serie / Modello</label>
          <input name="serie" style={inp} placeholder="Es. AWS 75" />
        </div>
        <div>
          <label style={lbl}>Etichetta PDF (opzionale)</label>
          <input name="pdf_label" style={inp} placeholder="Es. Catalogo 2025" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>File PDF *</label>
          <input type="file" accept=".pdf" required
            onChange={e => setPdfFile(e.target.files?.[0] ?? null)}
            style={{ fontSize: 12 }} />
          {pdfFile && <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>{pdfFile.name}</span>}
        </div>
      </div>
      {errore && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{errore}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-green" disabled={uploading} style={{ flex: 1 }}>
          {uploading ? 'Upload…' : 'Aggiungi'}
        </button>
        <button type="button" className="btn-gray" onClick={onDone} style={{ flex: 1 }}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Form modifica voce ───────────────────────────────────────────────────────

function VoceEditForm({ voce, onDone }: { voce: Voce; onDone: () => void }) {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [errore, setErrore] = useState('')
  const [pdfMode, setPdfMode] = useState<'mantieni' | 'carica' | 'blob'>('mantieni')
  const [blobList, setBlobList] = useState<{ url: string; nome: string }[]>([])
  const [blobLoading, setBlobLoading] = useState(false)
  const [blobScelto, setBlobScelto] = useState<string | null>(null)
  const router = useRouter()

  async function caricaBlob() {
    setBlobLoading(true)
    try {
      const res = await fetch('/api/blob/lista?prefix=cataloghi/')
      const data = await res.json()
      setBlobList(data.blobs ?? [])
    } finally { setBlobLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setErrore('')
    setUploading(true)
    try {
      const fd = new FormData(form)
      fd.set('id', String(voce.id))
      if (pdfMode === 'carica' && pdfFile) {
        const uf = new FormData()
        uf.append('file', pdfFile)
        const res = await fetch('/api/upload-catalogo', { method: 'POST', body: uf })
        const data = await res.json()
        if (data.error) { setErrore(data.error); return }
        fd.set('new_pdf_filename', data.filename)
      } else if (pdfMode === 'blob' && blobScelto) {
        fd.set('new_pdf_filename', blobScelto)
      }
      const result = await updateVoce(null, fd)
      if (result.ok) { router.refresh(); onDone() }
      else setErrore(result.error)
    } finally { setUploading(false) }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#fffdf0', border: '2px solid #c8960c', borderRadius: 6,
      padding: '14px 16px', marginTop: 10,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={lbl}>Marca / Produttore *</label>
          <input name="nome" required defaultValue={voce.nome} style={inp} />
        </div>
        <div>
          <label style={lbl}>Serie / Modello</label>
          <input name="serie" defaultValue={voce.serie} style={inp} />
        </div>
        <div>
          <label style={lbl}>Etichetta PDF</label>
          <input name="pdf_label" defaultValue={voce.pdf_label} style={inp} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Descrizione</label>
          <textarea name="descrizione" defaultValue={voce.descrizione} rows={5}
            style={{ ...inp, resize: 'vertical', lineHeight: 1.6, fontSize: 12 }} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ ...lbl, marginBottom: 6 }}>Classificazione</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {(['fase', 'materiale', 'tipologia', 'ambiente', 'fascia'] as const).map(k => (
              <div key={k}>
                <label style={lbl}>{k.charAt(0).toUpperCase() + k.slice(1)}</label>
                <input name={k} defaultValue={voce[k] ?? ''} style={inp} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ ...lbl, marginBottom: 6 }}>Filtri catalogo</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {([
              ['filtro_battente',       'A battente'],
              ['filtro_scorrevole',     'Scorrevole'],
              ['filtro_taglio_termico', 'Taglio termico'],
              ['filtro_taglio_freddo',  'Taglio freddo'],
              ['filtro_economico',      'Economico'],
              ['filtro_fascia_alta',    'Fascia alta'],
            ] as [keyof Voce, string][]).map(([k, label]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" name={k as string} defaultChecked={(voce[k] as number) === 1}
                  style={{ width: 15, height: 15, accentColor: '#c8960c' }} />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ ...lbl, marginBottom: 6 }}>Filtri modello (ante)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
            {([
              ['filtro_1', '1 anta'],
              ['filtro_2', '2 ante'],
              ['filtro_3', '3+ ante'],
              ['filtro_4', 'Sopraluce'],
            ] as [keyof Voce, string][]).map(([k, label]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" name={k as string} defaultChecked={(voce[k] as number) === 1}
                  style={{ width: 15, height: 15, accentColor: '#1e5c1e' }} />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Schema (URL immagine)</label>
          <input name="schema_url" defaultValue={voce.schema_url ?? ''} style={inp} placeholder="/listini/schema.png" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>PDF attuale</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#333', wordBreak: 'break-all' }}>
              {decodeURIComponent(voce.pdf_filename.split('/').pop() ?? voce.pdf_filename)}
            </span>
            <a href={pdfSrc(voce.pdf_filename)} target="_blank" rel="noreferrer"
              className="btn-black" style={{ fontSize: 11, padding: '2px 10px', flexShrink: 0 }}>Apri</a>
          </div>
          <label style={lbl}>Sostituisci PDF</label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {(['mantieni', 'carica', 'blob'] as const).map(m => (
              <button key={m} type="button"
                onClick={() => { setPdfMode(m); if (m === 'blob') caricaBlob() }}
                className={pdfMode === m ? 'btn-black' : 'btn-gray'}
                style={{ fontSize: 11, padding: '3px 10px' }}>
                {m === 'mantieni' ? 'Mantieni' : m === 'carica' ? 'Carica file' : 'Da Blob'}
              </button>
            ))}
          </div>
          {pdfMode === 'carica' && (
            <div>
              <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] ?? null)} style={{ fontSize: 12 }} />
              {pdfFile && <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>{pdfFile.name}</span>}
            </div>
          )}
          {pdfMode === 'blob' && (
            <div style={{ border: '1px solid #ddd', borderRadius: 4, maxHeight: 180, overflowY: 'auto', background: '#fff' }}>
              {blobLoading && <div style={{ padding: '8px 12px', fontSize: 12, color: '#888' }}>Caricamento…</div>}
              {!blobLoading && blobList.length === 0 && <div style={{ padding: '8px 12px', fontSize: 12, color: '#888' }}>Nessun file su Blob.</div>}
              {blobList.map(b => (
                <div key={b.url} onClick={() => setBlobScelto(b.url)} style={{
                  padding: '6px 12px', cursor: 'pointer', fontSize: 12, background: blobScelto === b.url ? '#fffbe6' : 'transparent',
                  borderLeft: blobScelto === b.url ? '3px solid #c8960c' : '3px solid transparent',
                  borderBottom: '1px solid #f0f0f0',
                }}>{b.nome}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      {errore && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{errore}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-green" disabled={uploading} style={{ flex: 1 }}>
          {uploading ? 'Salvataggio…' : 'Salva'}
        </button>
        <button type="button" className="btn-gray" onClick={onDone} style={{ flex: 1 }}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Percorsi inline ──────────────────────────────────────────────────────────

function PercorsiInline({ percorsi, voceId }: { percorsi: Percorso[]; voceId: number }) {
  const router = useRouter()
  const [catInput, setCatInput] = useState('')
  const [sottoInput, setSottoInput] = useState('')
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<number | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  async function handleAdd() {
    if (!catInput.trim()) return
    setAdding(true)
    const res = await addPercorsoVoce(voceId, catInput.trim(), sottoInput.trim())
    if (res.ok) { setCatInput(''); setSottoInput(''); setShowAdd(false); router.refresh() }
    setAdding(false)
  }
  async function handleRemove(id: number) {
    setRemoving(id)
    await removePercorsoVoce(id)
    router.refresh()
    setRemoving(null)
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
      {percorsi.map(p => (
        <span key={p.id} style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          background: '#fff7e0', border: '1px solid #c8960c', borderRadius: 3,
          padding: '1px 6px', fontSize: 11, lineHeight: 1.6,
        }}>
          <b style={{ color: '#7a5000' }}>{p.categoria}</b>
          {p.sottocategoria ? <span style={{ color: '#999' }}>{' / '}{p.sottocategoria}</span> : null}
          <button onClick={() => handleRemove(p.id)} disabled={removing === p.id}
            style={{ marginLeft: 3, background: 'none', border: 'none', cursor: 'pointer', color: '#c62828', fontSize: 12, padding: 0, lineHeight: 1, fontWeight: 700 }}>
            ✕
          </button>
        </span>
      ))}
      {percorsi.length === 0 && !showAdd && (
        <span style={{ fontSize: 11, color: '#bbb', fontStyle: 'italic' }}>Nessun percorso</span>
      )}
      {!showAdd && (
        <button onClick={() => setShowAdd(true)} style={{
          background: 'none', border: '1px dashed #aaa', borderRadius: 3,
          fontSize: 11, color: '#888', padding: '1px 6px', cursor: 'pointer', lineHeight: 1.6,
        }}>+ percorso</button>
      )}
      {showAdd && (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
          <input value={catInput} onChange={e => setCatInput(e.target.value)}
            placeholder="Categoria" style={{ fontSize: 11, padding: '2px 6px', border: '1px solid #ccc', borderRadius: 3, width: 130 }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }} />
          <input value={sottoInput} onChange={e => setSottoInput(e.target.value)}
            placeholder="Sottocategoria" style={{ fontSize: 11, padding: '2px 6px', border: '1px solid #ccc', borderRadius: 3, width: 130 }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }} />
          <button onClick={handleAdd} disabled={adding || !catInput.trim()} className="btn-green"
            style={{ fontSize: 11, padding: '2px 8px' }}>{adding ? '…' : '✓'}</button>
          <button onClick={() => { setShowAdd(false); setCatInput(''); setSottoInput('') }} className="btn-red"
            style={{ fontSize: 11, padding: '2px 8px' }}>✕</button>
        </div>
      )}
    </div>
  )
}

// ─── Riga voce ────────────────────────────────────────────────────────────────

const FLAG_CATALOGO: [keyof Voce, string][] = [
  ['filtro_battente',       'Battente'],
  ['filtro_scorrevole',     'Scorrevole'],
  ['filtro_taglio_termico', 'T.Termico'],
  ['filtro_taglio_freddo',  'T.Freddo'],
  ['filtro_economico',      'Economico'],
  ['filtro_fascia_alta',    'F.Alta'],
]
const FLAG_MODELLO: [keyof Voce, string][] = [
  ['filtro_1', '1 anta'],
  ['filtro_2', '2 ante'],
  ['filtro_3', '3+ ante'],
  ['filtro_4', 'Sopraluce'],
]

function VoceRow({ voce, isStaff, percorsi }: { voce: Voce; isStaff: boolean; percorsi: Percorso[] }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [pending, startT] = useTransition()
  const router = useRouter()

  const classAtivi = FLAG_CATALOGO.filter(([k]) => (voce[k] as number) === 1).map(([, l]) => l)
  const modAtivi   = FLAG_MODELLO.filter(([k]) => (voce[k] as number) === 1).map(([, l]) => l)
  const hasDetail  = !!(voce.fase || voce.materiale || voce.tipologia || voce.ambiente || voce.fascia ||
                        voce.descrizione || classAtivi.length || modAtivi.length)

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 6, marginBottom: 6, background: '#fff', overflow: 'hidden' }}>
      {/* Riga principale */}
      <div style={{ display: 'flex', gap: 10, padding: '10px 14px', alignItems: 'flex-start' }}>
        {/* Sinistra: nome + percorsi */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{voce.nome}</span>
            {voce.serie && <span style={{ fontSize: 12, color: '#555' }}>{voce.serie}</span>}
            {voce.pdf_label && (
              <span style={{ fontSize: 11, color: '#fff', background: '#2a2a3e', borderRadius: 3, padding: '1px 6px' }}>
                {voce.pdf_label}
              </span>
            )}
          </div>
          <PercorsiInline percorsi={percorsi} voceId={voce.id} />
        </div>
        {/* Destra: azioni */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          <a href={pdfSrc(voce.pdf_filename)} target="_blank" rel="noreferrer"
            className="btn-black" style={{ fontSize: 11 }}>PDF</a>
          {hasDetail && (
            <button onClick={() => { setOpen(o => !o); if (editing) setEditing(false) }}
              className="btn-gray" style={{ fontSize: 11, padding: '3px 8px', minWidth: 28 }}>
              {open ? '▲' : '▼'}
            </button>
          )}
        </div>
      </div>

      {/* Pannello dettaglio */}
      {open && !editing && (
        <div style={{ borderTop: '1px solid #eee', padding: '10px 14px', background: '#fafafa' }}>
          {/* Classificazione */}
          {(voce.fase || voce.materiale || voce.tipologia || voce.ambiente || voce.fascia) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              {(['fase', 'materiale', 'tipologia', 'ambiente', 'fascia'] as const)
                .filter(k => voce[k])
                .map(k => (
                  <span key={k} style={{ fontSize: 11, background: '#f0f4ff', border: '1px solid #b0c0e0', borderRadius: 3, padding: '1px 7px' }}>
                    <span style={{ color: '#666' }}>{k}: </span>
                    <b style={{ color: '#2a2a6e' }}>{voce[k]}</b>
                  </span>
                ))}
            </div>
          )}
          {/* Flags catalogo */}
          {classAtivi.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
              {classAtivi.map(l => (
                <span key={l} style={{ fontSize: 11, background: '#fff7e0', border: '1px solid #c8960c', borderRadius: 3, padding: '1px 7px', color: '#7a5000' }}>{l}</span>
              ))}
            </div>
          )}
          {/* Flags modello */}
          {modAtivi.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
              {modAtivi.map(l => (
                <span key={l} style={{ fontSize: 11, background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: 3, padding: '1px 7px', color: '#1b5e20' }}>{l}</span>
              ))}
            </div>
          )}
          {/* Descrizione */}
          {voce.descrizione && (
            <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6, margin: '4px 0 8px', whiteSpace: 'pre-wrap' }}>
              {voce.descrizione}
            </p>
          )}
          {/* Azioni staff */}
          {isStaff && (
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={() => setEditing(true)} className="btn-gray" style={{ flex: 1, fontSize: 12 }}>Modifica</button>
              <form style={{ flex: 1 }} action={async fd => {
                startT(async () => { await deleteVoce(null, fd); router.refresh() })
              }}>
                <input type="hidden" name="id" value={voce.id} />
                <button type="submit" disabled={pending} className="btn-red"
                  style={{ width: '100%', fontSize: 12 }}
                  onClick={e => { if (!confirm('Eliminare questa voce e il PDF allegato?')) e.preventDefault() }}>
                  Elimina
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Form modifica */}
      {open && editing && isStaff && (
        <div style={{ borderTop: '1px solid #eee', padding: '0 14px 14px' }}>
          <VoceEditForm voce={voce} onDone={() => { setEditing(false) }} />
        </div>
      )}
    </div>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function CataloghiClient({
  voci, isStaff, percorsiPerVoce,
}: {
  voci: Voce[]
  isStaff: boolean
  percorsiPerVoce: Record<number, Percorso[]>
}) {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div>
      {isStaff && (
        <div style={{ marginBottom: 12 }}>
          {addOpen ? (
            <NuovaVoceForm onDone={() => setAddOpen(false)} />
          ) : (
            <button className="btn-green" onClick={() => setAddOpen(true)}>+ Nuova voce</button>
          )}
        </div>
      )}

      {voci.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 13 }}>
          {isStaff ? 'Nessuna voce. Aggiungine una con "+ Nuova voce".' : 'Nessun catalogo disponibile.'}
        </p>
      ) : (
        voci.map(v => (
          <VoceRow key={v.id} voce={v} isStaff={isStaff} percorsi={percorsiPerVoce[v.id] ?? []} />
        ))
      )}

      {isStaff && <GestioneBlob prefix="cataloghi/" label="Gestione Blob — Cataloghi" />}
    </div>
  )
}
