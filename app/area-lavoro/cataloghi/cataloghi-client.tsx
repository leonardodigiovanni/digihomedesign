'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { useActionState } from 'react'
import SelectLookup from '@/components/select-lookup'
import { useRouter } from 'next/navigation'
import { addCategoria, deleteCategoria, addVoce, updateVoce, deleteVoce, updateListinoCategoria, updateListinoVoce, type MutResult } from './actions'
import GestioneBlob from '@/components/gestione-blob'

function pdfSrc(filename: string): string {
  return filename.startsWith('https://') ? filename : `/uploads/cataloghi/${filename}`
}

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type Voce = {
  id: number
  nome: string
  serie: string
  pdf_filename: string
  pdf_label: string
  descrizione: string
  listino_categoria: string | null
  filtro_battente: number
  filtro_scorrevole: number
  filtro_taglio_termico: number
  filtro_taglio_freddo: number
  filtro_economico: number
  filtro_fascia_alta: number
}

export type Categoria = {
  id: number
  nome: string
  ordine: number
  listino_categoria: string | null
  voci: Voce[]
}

// ─── Form nuova categoria ─────────────────────────────────────────────────────

function NuovaCategoriaForm({ onDone }: { onDone: () => void }) {
  const [result, action, pending] = useActionState<MutResult | null, FormData>(addCategoria, null)
  const router = useRouter()

  useEffect(() => { if (result?.ok) { router.refresh(); onDone() } }, [result])

  const inp: React.CSSProperties = {
    padding: '6px 10px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 13, fontFamily: 'inherit', flex: 1,
  }

  return (
    <form action={action} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
      <input name="nome" required placeholder="Nome categoria (es. Infissi)" style={inp} autoFocus />
      <button type="submit" className="btn-green" disabled={pending}>
        {pending ? 'Salvataggio…' : 'Crea'}
      </button>
      <button type="button" className="btn-gray" onClick={onDone}>Annulla</button>
      {result && !result.ok && (
        <span style={{ color: '#c00', fontSize: 12 }}>{result.error}</span>
      )}
    </form>
  )
}

// ─── Form nuova voce ──────────────────────────────────────────────────────────

function NuovaVoceForm({ categoriaId, onDone }: { categoriaId: number; onDone: () => void }) {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [errore, setErrore] = useState('')
  const router = useRouter()

  const inp: React.CSSProperties = {
    padding: '6px 10px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = { fontSize: 11, color: '#666', display: 'block', marginBottom: 2 }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!pdfFile) { setErrore('Seleziona un PDF.'); return }
    const form = e.currentTarget  // cattura prima degli await
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
      fd.set('categoria_id', String(categoriaId))

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
      padding: '14px 16px', marginBottom: 10,
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
        <button type="submit" className="btn-green" disabled={uploading}>
          {uploading ? 'Upload…' : 'Aggiungi'}
        </button>
        <button type="button" className="btn-gray" onClick={onDone}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Form listino collegato ───────────────────────────────────────────────────

function ListinoCategoriaForm({ catId, current, listiniCategorie }: { catId: number; current: string | null; listiniCategorie: string[] }) {
  const [result, action, pending] = useActionState<MutResult | null, FormData>(updateListinoCategoria, null)
  const [listinoCatSel, setListinoCatSel] = useState(current ?? '')
  const router = useRouter()
  React.useEffect(() => { if (result?.ok) router.refresh() }, [result, router])

  return (
    <form action={action} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <input type="hidden" name="id" value={catId} />
      <label style={{ fontSize: 11, color: '#666', whiteSpace: 'nowrap' }}>Listino collegato:</label>
      <SelectLookup name="listino_categoria" value={listinoCatSel} onChange={setListinoCatSel}
        options={[{ value: '', label: '— nessuno —' }, ...listiniCategorie.map(c => ({ value: c, label: c }))]}
        style={{ flex: 1, minWidth: 140, padding: '4px 6px', border: '1px solid #ccc', borderRadius: 4, fontSize: 12, fontFamily: 'inherit' }} />
      <button type="submit" disabled={pending} className="btn-green">
        {pending ? '…' : 'Salva'}
      </button>
      {result && !result.ok && <span style={{ fontSize: 11, color: '#c00' }}>{result.error}</span>}
      {result?.ok && <span style={{ fontSize: 11, color: '#2e7d32' }}>✓</span>}
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

  const inp: React.CSSProperties = {
    padding: '6px 10px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = { fontSize: 11, color: '#666', display: 'block', marginBottom: 2 }

  async function caricaBlob() {
    setBlobLoading(true)
    try {
      const res = await fetch('/api/blob/lista?prefix=cataloghi/')
      const data = await res.json()
      setBlobList(data.blobs ?? [])
    } finally {
      setBlobLoading(false)
    }
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
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#fffdf0', border: '2px solid #c8960c', borderRadius: 0,
      padding: '14px 16px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={lbl}>Marca / Produttore *</label>
          <input name="nome" required defaultValue={voce.nome} style={inp} />
        </div>
        <div>
          <label style={lbl}>Serie / Modello</label>
          <input name="serie" defaultValue={voce.serie} style={inp} placeholder="Es. AWS 75" />
        </div>
        <div>
          <label style={lbl}>Etichetta PDF</label>
          <input name="pdf_label" defaultValue={voce.pdf_label} style={inp} placeholder="Es. Catalogo 2025" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Descrizione (opzionale)</label>
          <textarea
            name="descrizione"
            defaultValue={voce.descrizione}
            rows={7}
            placeholder="Descrizione tecnica del prodotto, caratteristiche, specifiche…"
            style={{ ...inp, resize: 'vertical', lineHeight: 1.6, fontSize: 12 }}
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ ...lbl, marginBottom: 6 }}>Filtri (caratteristiche del catalogo)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {([
              ['filtro_battente',       'A battente',     voce.filtro_battente],
              ['filtro_scorrevole',     'Scorrevole',     voce.filtro_scorrevole],
              ['filtro_taglio_termico', 'Taglio termico', voce.filtro_taglio_termico],
              ['filtro_taglio_freddo',  'Taglio freddo',  voce.filtro_taglio_freddo],
              ['filtro_economico',      'Economico',      voce.filtro_economico],
              ['filtro_fascia_alta',    'Fascia alta',    voce.filtro_fascia_alta],
            ] as [string, string, number][]).map(([name, label, val]) => (
              <label key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#333', cursor: 'pointer', padding: '4px 0' }}>
                <input type="checkbox" name={name} defaultChecked={val === 1} style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#c8960c' }} />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>PDF attuale</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#333', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {decodeURIComponent(voce.pdf_filename.split('/').pop() ?? voce.pdf_filename)}
            </span>
            <a href={pdfSrc(voce.pdf_filename)} target="_blank" rel="noreferrer" className="btn-black" style={{ fontSize: 11, padding: '2px 10px', height: 24, flexShrink: 0 }}>
              Apri
            </a>
          </div>

          <label style={lbl}>Sostituisci PDF</label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {(['mantieni', 'carica', 'blob'] as const).map(m => (
              <button key={m} type="button"
                onClick={() => { setPdfMode(m); if (m === 'blob') caricaBlob() }}
                className={pdfMode === m ? 'btn-black' : 'btn-gray'}
                style={{ fontSize: 11, padding: '3px 10px' }}>
                {m === 'mantieni' ? 'Mantieni attuale' : m === 'carica' ? 'Carica file' : 'Scegli da Blob'}
              </button>
            ))}
          </div>

          {pdfMode === 'carica' && (
            <div>
              <input type="file" accept=".pdf"
                onChange={e => setPdfFile(e.target.files?.[0] ?? null)}
                style={{ fontSize: 12 }} />
              {pdfFile && <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>{pdfFile.name}</span>}
            </div>
          )}

          {pdfMode === 'blob' && (
            <div style={{ border: '1px solid #ddd', borderRadius: 4, maxHeight: 200, overflowY: 'auto', background: '#fff' }}>
              {blobLoading && <div style={{ padding: '8px 12px', fontSize: 12, color: '#888' }}>Caricamento…</div>}
              {!blobLoading && blobList.length === 0 && <div style={{ padding: '8px 12px', fontSize: 12, color: '#888' }}>Nessun file su Vercel Blob.</div>}
              {blobList.map(b => (
                <div key={b.url}
                  onClick={() => setBlobScelto(b.url)}
                  style={{
                    padding: '7px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'monospace',
                    background: blobScelto === b.url ? '#fffbe6' : 'transparent',
                    borderLeft: blobScelto === b.url ? '3px solid #c8960c' : '3px solid transparent',
                    borderBottom: '1px solid #f0f0f0',
                  }}>
                  {b.nome}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {errore && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{errore}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-green" disabled={uploading}>
          {uploading ? 'Salvataggio…' : 'Salva'}
        </button>
        <button type="button" className="btn-gray" onClick={onDone}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Listino per voce ────────────────────────────────────────────────────────

function ListinoVoceForm({ voceId, current, listiniCategorie }: { voceId: number; current: string | null; listiniCategorie: string[] }) {
  const [sel, setSel] = useState(current ?? '')
  const [pending, startT] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => { setSel(current ?? '') }, [current])

  function handleSave() {
    const fd = new FormData()
    fd.set('id', String(voceId))
    fd.set('listino_categoria', sel)
    setSaved(false); setError('')
    startT(async () => {
      const res = await updateListinoVoce(null, fd)
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); router.refresh() }
      else setError(res.ok === false ? res.error : '')
    })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 5 }}>
      <label style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>Listino:</label>
      <SelectLookup value={sel} onChange={setSel}
        options={[{ value: '', label: '— nessuno —' }, ...listiniCategorie.map(c => ({ value: c, label: c }))]}
        style={{ flex: 1, minWidth: 160, padding: '3px 6px', border: '1px solid #ccc', borderRadius: 4, fontSize: 12, fontFamily: 'inherit' }} />
      <button type="button" onClick={handleSave} disabled={pending} className="btn-green">
        {pending ? '…' : 'Salva'}
      </button>
      {error && <span style={{ fontSize: 11, color: '#c00' }}>{error}</span>}
      {saved && <span style={{ fontSize: 11, color: '#2e7d32' }}>✓</span>}
    </div>
  )
}

// ─── Riga voce ────────────────────────────────────────────────────────────────

function VoceRow({ voce, isStaff, listiniCategorie }: { voce: Voce; isStaff: boolean; listiniCategorie: string[] }) {
  const [pending, startT] = useTransition()
  const [editing, setEditing] = useState(false)
  const router = useRouter()

  if (editing && isStaff) {
    return <VoceEditForm voce={voce} onDone={() => setEditing(false)} />
  }

  return (
    <div style={{
      padding: '10px 14px', borderBottom: '1px solid #f0f0f0',
      background: '#fff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{voce.nome}</span>
          {voce.serie && (
            <span style={{ fontSize: 12, color: '#555', marginLeft: 8 }}>— {voce.serie}</span>
          )}
          {voce.pdf_label && (
            <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>— {voce.pdf_label}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <a
            href={pdfSrc(voce.pdf_filename)}
            target="_blank"
            rel="noreferrer"
            className="btn-black"
          >
            Sfoglia catalogo
          </a>
          {isStaff && (
            <>
              <button onClick={() => setEditing(true)} className="btn-gray">
                Modifica
              </button>
              <form action={async fd => {
                startT(async () => { await deleteVoce(null, fd); router.refresh() })
              }}>
                <input type="hidden" name="id" value={voce.id} />
                <button type="submit" disabled={pending} className="btn-red"
                  onClick={e => { if (!confirm('Eliminare questa voce e il PDF allegato?')) e.preventDefault() }}>
                  Elimina
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      {isStaff && (
        <ListinoVoceForm voceId={voce.id} current={voce.listino_categoria} listiniCategorie={listiniCategorie} />
      )}
    </div>
  )
}

// ─── Accordion categoria ──────────────────────────────────────────────────────

function CategoriaAccordion({ cat, isStaff, listiniCategorie }: { cat: Categoria; isStaff: boolean; listiniCategorie: string[] }) {
  const [open, setOpen]       = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [pending, startT]     = useTransition()
  const router                = useRouter()

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, marginBottom: 10, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 18px', background: '#2a2a3e', cursor: 'pointer',
      }} onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#c8960c', fontWeight: 700, fontSize: 15 }}>{cat.nome}</span>
          <span style={{ fontSize: 12, color: '#888', background: '#1a1a2e', borderRadius: 10, padding: '1px 8px' }}>
            {cat.voci.length} {cat.voci.length === 1 ? 'catalogo' : 'cataloghi'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
          {isStaff && (
            <>
              <button
                className="btn-green"
                onClick={() => { setOpen(true); setAddOpen(a => !a) }}
              >
                + Voce
              </button>
              <form style={{ display: 'contents' }} action={async fd => {
                startT(async () => { await deleteCategoria(null, fd); router.refresh() })
              }}>
                <input type="hidden" name="id" value={cat.id} />
                <button type="submit" disabled={pending} className="btn-red"
                  onClick={e => { if (!confirm(`Eliminare la categoria "${cat.nome}" e tutti i suoi cataloghi?`)) e.preventDefault() }}>
                  Elimina cat.
                </button>
              </form>
            </>
          )}
          <span style={{ color: '#c8960c', fontSize: 18, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
            {open ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Contenuto */}
      {open && (
        <div style={{ background: '#fafafa' }}>
          {isStaff && (
            <div style={{ padding: '8px 14px', borderBottom: '1px solid #eee', background: '#f2f2f8' }}>
              <ListinoCategoriaForm key={cat.listino_categoria ?? ''} catId={cat.id} current={cat.listino_categoria} listiniCategorie={listiniCategorie} />
            </div>
          )}
          {isStaff && addOpen && (
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #eee' }}>
              <NuovaVoceForm categoriaId={cat.id} onDone={() => setAddOpen(false)} />
            </div>
          )}
          {cat.voci.length === 0 && !addOpen ? (
            <div style={{ padding: '14px 18px', color: '#aaa', fontSize: 13 }}>
              Nessun catalogo. {isStaff ? 'Aggiungi una voce con "+ Voce".' : ''}
            </div>
          ) : (
            cat.voci.map(v => <VoceRow key={v.id} voce={v} isStaff={isStaff} listiniCategorie={listiniCategorie} />)
          )}
        </div>
      )}
    </div>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function CataloghiClient({ categorie, isStaff, listiniCategorie }: { categorie: Categoria[]; isStaff: boolean; listiniCategorie: string[] }) {
  const [nuovaCategoria, setNuovaCategoria] = useState(false)

  return (
    <div>
      {isStaff && (
        <div style={{ marginBottom: 20 }}>
          {nuovaCategoria ? (
            <NuovaCategoriaForm onDone={() => setNuovaCategoria(false)} />
          ) : (
            <button className="btn-green" onClick={() => setNuovaCategoria(true)}>
              + Nuova categoria
            </button>
          )}
        </div>
      )}

      {categorie.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 13 }}>
          {isStaff ? 'Nessuna categoria. Creane una con "+ Nuova categoria".' : 'Nessun catalogo disponibile.'}
        </p>
      ) : (
        categorie.map(c => <CategoriaAccordion key={c.id} cat={c} isStaff={isStaff} listiniCategorie={listiniCategorie} />)
      )}

      {isStaff && <GestioneBlob prefix="cataloghi/" label="Gestione Blob — Cataloghi" />}
    </div>
  )
}
