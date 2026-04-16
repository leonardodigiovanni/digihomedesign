'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadFacsimile, deleteFacsimile, type UploadResult, type DeleteResult } from './actions'

export type Documento = {
  id: number
  nome: string
  categoria: string
  filename: string
  mime_type: string
  size_bytes: number
  uploaded_by: string
  created_at: string
}

const CATEGORIE = [
  'Preventivi',
  'Privacy',
  'Accettazione preventivo',
  'Ordini',
  'Carta intestata',
  'Biglietti da visita',
  'Volantini',
  'Altro',
]

const btnBase: React.CSSProperties = {
  padding: '8px 18px', fontSize: 14, borderRadius: 6,
  fontFamily: 'inherit',
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fileBadge(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, [string, string]> = {
    pdf:  ['PDF',     '#e53e3e'],
    doc:  ['Word',    '#2b6cb0'],
    docx: ['Word',    '#2b6cb0'],
    xls:  ['Excel',   '#276749'],
    xlsx: ['Excel',   '#276749'],
    jpg:  ['Immagine','#6b46c1'],
    jpeg: ['Immagine','#6b46c1'],
    png:  ['Immagine','#6b46c1'],
    zip:  ['ZIP',     '#718096'],
  }
  const [label, color] = map[ext] ?? ['File', '#718096']
  return (
    <span style={{ background: color, color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, letterSpacing: '0.04em' }}>
      {label}
    </span>
  )
}

function DeleteBtn({ id, role }: { id: number; role: string }) {
  const router = useRouter()
  const [result, action, pending] = useActionState<DeleteResult | null, FormData>(deleteFacsimile, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  if (role !== 'admin') return null
  return (
    <form action={action} onSubmit={e => { if (!confirm('Eliminare questo facsimile?')) e.preventDefault() }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending}
        className={pending ? 'btn-gray' : 'btn-red'}
        style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, fontFamily: 'inherit' }}>
        {pending ? '…' : 'Elimina'}
      </button>
    </form>
  )
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [result, formAction, pending] = useActionState<UploadResult | null, FormData>(uploadFacsimile, null)

  useEffect(() => {
    if (result?.ok) { router.refresh(); onClose() }
  }, [result])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', width: '100%', maxWidth: 500, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Carica facsimile</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Nome *</label>
            <input name="nome" type="text" required placeholder="es. Modello Preventivo 2026"
              style={{ padding: '8px 10px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Categoria *</label>
            <select name="categoria" required
              style={{ padding: '8px 10px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', background: '#fff' }}>
              <option value="">Seleziona…</option>
              {CATEGORIE.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>File * <span style={{ fontSize: 11, color: '#aaa', fontWeight: 400 }}>(max 20 MB)</span></label>
            <input name="file" type="file" required
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.zip,.rar,.txt,.odt,.ods"
              style={{ fontSize: 13, fontFamily: 'inherit' }} />
          </div>

          {result && !result.ok && (
            <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>{result.error}</div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn-red" style={btnBase}>Annulla</button>
            <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={btnBase}>
              {pending ? 'Caricamento…' : 'Carica'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CategoriaSection({ categoria, docs, role, search }: { categoria: string; docs: Documento[]; role: string; search: string }) {
  const filtered = search
    ? docs.filter(d => d.nome.toLowerCase().includes(search.toLowerCase()))
    : docs
  if (filtered.length === 0) return null

  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '12px 20px', background: '#f7f8fa', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{categoria}</span>
        <span style={{ fontSize: 12, color: '#aaa' }}>{filtered.length} {filtered.length === 1 ? 'file' : 'file'}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filtered.map((d, i) => (
          <div key={d.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '10px 20px',
            borderBottom: i < filtered.length - 1 ? '1px solid #f5f5f5' : 'none',
          }}>
            {fileBadge(d.filename)}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.nome}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                {formatSize(d.size_bytes)} · {d.uploaded_by} · {formatDate(d.created_at)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <a href={`/uploads/documenti/${d.filename}`} download={d.nome}
                style={{ padding: '4px 12px', fontSize: 12, border: '1px solid #ccc', borderRadius: 4, background: '#f9f9f9', color: '#333', textDecoration: 'none', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                ↓ Scarica
              </a>
              <DeleteBtn id={d.id} role={role} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FacsimiliClient({ documenti, role }: { documenti: Documento[]; role: string }) {
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch]       = useState('')

  const grouped: Record<string, Documento[]> = {}
  for (const d of documenti) {
    if (!grouped[d.categoria]) grouped[d.categoria] = []
    grouped[d.categoria].push(d)
  }

  // ordine fisso categorie predefinite, poi eventuali extra
  const ordine = [...CATEGORIE, ...Object.keys(grouped).filter(k => !CATEGORIE.includes(k))]

  const hasResults = ordine.some(cat => {
    const docs = grouped[cat] ?? []
    return search ? docs.some(d => d.nome.toLowerCase().includes(search.toLowerCase())) : docs.length > 0
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showModal && <UploadModal onClose={() => setShowModal(false)} />}

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <input type="text" placeholder="Cerca facsimile…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, maxWidth: 360, padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
        <button onClick={() => setShowModal(true)} className="btn-green" style={{ ...btnBase, whiteSpace: 'nowrap' }}>
          + Carica facsimile
        </button>
      </div>

      {/* Sezioni per categoria */}
      {!hasResults && (
        <div style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Nessun facsimile trovato.</div>
      )}
      {ordine.map(cat => (
        <CategoriaSection
          key={cat}
          categoria={cat}
          docs={grouped[cat] ?? []}
          role={role}
          search={search}
        />
      ))}
    </div>
  )
}
