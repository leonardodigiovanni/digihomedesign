'use client'

import React, { useState, useTransition } from 'react'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { addCategoria, deleteCategoria, addVoce, deleteVoce, type MutResult } from './actions'

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type Voce = {
  id: number
  nome: string
  pdf_filename: string
  pdf_label: string
}

export type Categoria = {
  id: number
  nome: string
  ordine: number
  voci: Voce[]
}

// ─── Form nuova categoria ─────────────────────────────────────────────────────

function NuovaCategoriaForm({ onDone }: { onDone: () => void }) {
  const [result, action, pending] = useActionState<MutResult | null, FormData>(addCategoria, null)
  const router = useRouter()

  if (result?.ok) { router.refresh(); onDone() }

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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={lbl}>Marca / Produttore *</label>
          <input name="nome" required style={inp} placeholder="Es. Schüco" />
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

// ─── Riga voce ────────────────────────────────────────────────────────────────

function VoceRow({ voce, isStaff }: { voce: Voce; isStaff: boolean }) {
  const [pending, startT] = useTransition()
  const router = useRouter()

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px', borderBottom: '1px solid #f0f0f0',
      background: '#fff',
    }}>
      <div>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{voce.nome}</span>
        {voce.pdf_label && (
          <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>— {voce.pdf_label}</span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <a
          href={`/uploads/cataloghi/${voce.pdf_filename}`}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: '4px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            background: '#2a2a3e', color: '#c8960c', border: 'none', borderRadius: 4,
            textDecoration: 'none', display: 'inline-block',
          }}
        >
          Apri catalogo ↗
        </a>
        {isStaff && (
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
        )}
      </div>
    </div>
  )
}

// ─── Accordion categoria ──────────────────────────────────────────────────────

function CategoriaAccordion({ cat, isStaff }: { cat: Categoria; isStaff: boolean }) {
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

export default function CataloghiClient({ categorie, isStaff }: { categorie: Categoria[]; isStaff: boolean }) {
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
        categorie.map(c => <CategoriaAccordion key={c.id} cat={c} isStaff={isStaff} />)
      )}
    </div>
  )
}
