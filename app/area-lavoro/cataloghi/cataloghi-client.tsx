'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { addCategoria, deleteCategoria, addVoce, updateVoce, deleteVoce, updateListinoCategoria, type MutResult } from './actions'

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type Voce = {
  id: number
  nome: string
  serie: string
  pdf_filename: string
  pdf_label: string
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
      <button type="submit" className="btn-green" disabled={pending}
        style={{ padding: '6px 16px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
        {pending ? 'Salvataggio…' : 'Crea'}
      </button>
      <button type="button" className="btn-gray" onClick={onDone}
        style={{ padding: '6px 12px', fontSize: 13 }}>Annulla</button>
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
        <button type="submit" className="btn-green" disabled={uploading}
          style={{ padding: '5px 14px', fontSize: 12, fontWeight: 600 }}>
          {uploading ? 'Upload…' : 'Aggiungi'}
        </button>
        <button type="button" className="btn-gray" onClick={onDone}
          style={{ padding: '5px 10px', fontSize: 12 }}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Form listino collegato ───────────────────────────────────────────────────

function ListinoCategoriaForm({ catId, current, listiniCategorie }: { catId: number; current: string | null; listiniCategorie: string[] }) {
  const [result, action, pending] = useActionState<MutResult | null, FormData>(updateListinoCategoria, null)
  const router = useRouter()
  React.useEffect(() => { if (result?.ok) router.refresh() }, [result, router])

  return (
    <form action={action} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <input type="hidden" name="id" value={catId} />
      <label style={{ fontSize: 11, color: '#666', whiteSpace: 'nowrap' }}>Listino collegato:</label>
      <select name="listino_categoria" defaultValue={current ?? ''}
        style={{ flex: 1, minWidth: 140, padding: '4px 6px', border: '1px solid #ccc', borderRadius: 4, fontSize: 12, fontFamily: 'inherit' }}>
        <option value="">— nessuno —</option>
        {listiniCategorie.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button type="submit" disabled={pending} className="btn-green"
        style={{ padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>
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
  const router = useRouter()

  const inp: React.CSSProperties = {
    padding: '6px 10px', border: '1px solid #ccc', borderRadius: 4,
    fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = { fontSize: 11, color: '#666', display: 'block', marginBottom: 2 }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setErrore('')
    setUploading(true)
    try {
      const fd = new FormData(form)
      fd.set('id', String(voce.id))
      if (pdfFile) {
        const uf = new FormData()
        uf.append('file', pdfFile)
        const res = await fetch('/api/upload-catalogo', { method: 'POST', body: uf })
        const data = await res.json()
        if (data.error) { setErrore(data.error); return }
        fd.set('new_pdf_filename', data.filename)
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
      background: '#fffdf0', border: '1px solid #c8960c', borderRadius: 0,
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
          <label style={lbl}>Sostituisci PDF (opzionale — lascia vuoto per mantenere l&apos;attuale)</label>
          <input type="file" accept=".pdf"
            onChange={e => setPdfFile(e.target.files?.[0] ?? null)}
            style={{ fontSize: 12 }} />
          {pdfFile && <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>{pdfFile.name}</span>}
        </div>
      </div>
      {errore && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{errore}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-green" disabled={uploading}
          style={{ padding: '5px 14px', fontSize: 12, fontWeight: 600 }}>
          {uploading ? 'Salvataggio…' : 'Salva'}
        </button>
        <button type="button" className="btn-gray" onClick={onDone}
          style={{ padding: '5px 10px', fontSize: 12 }}>Annulla</button>
      </div>
    </form>
  )
}

// ─── Riga voce ────────────────────────────────────────────────────────────────

function VoceRow({ voce, isStaff }: { voce: Voce; isStaff: boolean }) {
  const [pending, startT] = useTransition()
  const [editing, setEditing] = useState(false)
  const router = useRouter()

  if (editing && isStaff) {
    return <VoceEditForm voce={voce} onDone={() => setEditing(false)} />
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px', borderBottom: '1px solid #f0f0f0',
      background: '#fff',
    }}>
      <div>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{voce.nome}</span>
        {voce.serie && (
          <span style={{ fontSize: 12, color: '#555', marginLeft: 8 }}>— {voce.serie}</span>
        )}
        {voce.pdf_label && (
          <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>— {voce.pdf_label}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <a
          href={`/uploads/cataloghi/${voce.pdf_filename}`}
          target="_blank"
          rel="noreferrer"
          className="btn-black"
          style={{ padding: '4px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
        >
          Sfoglia catalogo
        </a>
        {isStaff && (
          <>
            <button onClick={() => setEditing(true)} className="btn-gray"
              style={{ padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>
              Modifica
            </button>
            <form action={async fd => {
              startT(async () => { await deleteVoce(null, fd); router.refresh() })
            }}>
              <input type="hidden" name="id" value={voce.id} />
              <button type="submit" disabled={pending} className="btn-red"
                style={{ padding: '4px 10px', fontSize: 12 }}
                onClick={e => { if (!confirm('Eliminare questa voce e il PDF allegato?')) e.preventDefault() }}>
                Elimina
              </button>
            </form>
          </>
        )}
      </div>
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
                style={{ padding: '3px 10px', fontSize: 11, fontWeight: 600 }}
              >
                + Voce
              </button>
              <form style={{ display: 'contents' }} action={async fd => {
                startT(async () => { await deleteCategoria(null, fd); router.refresh() })
              }}>
                <input type="hidden" name="id" value={cat.id} />
                <button type="submit" disabled={pending} className="btn-red"
                  style={{ padding: '3px 8px', fontSize: 11 }}
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
            cat.voci.map(v => <VoceRow key={v.id} voce={v} isStaff={isStaff} />)
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
            <button className="btn-green" onClick={() => setNuovaCategoria(true)}
              style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600 }}>
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
    </div>
  )
}
