'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadDocumento, deleteDocumento, type UploadResult, type DeleteResult } from './actions'

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

const CATEGORIE = ['Contratti', 'Verbali', 'Corrispondenza', 'Certificati', 'Altro']

type SortCol = 'nome' | 'categoria' | 'size_bytes' | 'uploaded_by' | 'created_at'

const btnBase: React.CSSProperties = {
  padding: '8px 18px', fontSize: 14, borderRadius: 6,
  fontFamily: 'inherit',
}

const thStyle: React.CSSProperties = {
  padding: '9px 14px', fontSize: 11, fontWeight: 600, color: '#888',
  textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
  cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
  background: '#fafafa', borderBottom: '1px solid #e8e8e8',
}

function SortIcon({ col, sortCol, sortDir }: { col: SortCol; sortCol: SortCol; sortDir: 'asc' | 'desc' }) {
  if (col !== sortCol) return <span style={{ color: '#ccc', marginLeft: 4 }}>↕</span>
  return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fileBadge(mime: string, filename: string) {
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
    gif:  ['Immagine','#6b46c1'],
    zip:  ['ZIP',     '#718096'],
    rar:  ['ZIP',     '#718096'],
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
  const [result, action, pending] = useActionState<DeleteResult | null, FormData>(deleteDocumento, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  if (role !== 'admin') return null
  return (
    <form action={action} onSubmit={e => { if (!confirm('Eliminare questo documento?')) e.preventDefault() }}>
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
  const [result, formAction, pending] = useActionState<UploadResult | null, FormData>(uploadDocumento, null)

  useEffect(() => {
    if (result?.ok) { router.refresh(); onClose() }
  }, [result])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', width: '100%', maxWidth: 500, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Carica documento</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Nome documento *</label>
            <input name="nome" type="text" required placeholder="es. Contratto Rossi 2026"
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

export default function ArchivioClient({ documenti, role }: { documenti: Documento[]; role: string }) {
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch]       = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [sortCol, setSortCol]     = useState<SortCol>('created_at')
  const [sortDir, setSortDir]     = useState<'asc' | 'desc'>('desc')

  function handleSort(col: SortCol) {
    if (col === sortCol) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const filtered = documenti
    .filter(d => {
      const q = search.toLowerCase()
      const matchText = !q || d.nome.toLowerCase().includes(q) || d.uploaded_by.toLowerCase().includes(q)
      const matchCat  = !catFilter || d.categoria === catFilter
      return matchText && matchCat
    })
    .sort((a, b) => {
      const va = a[sortCol]
      const vb = b[sortCol]
      if (va === vb) return 0
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const cols: { key: SortCol; label: string }[] = [
    { key: 'nome',        label: 'Nome' },
    { key: 'categoria',   label: 'Categoria' },
    { key: 'size_bytes',  label: 'Dimensione' },
    { key: 'uploaded_by', label: 'Caricato da' },
    { key: 'created_at',  label: 'Data' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showModal && <UploadModal onClose={() => setShowModal(false)} />}

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1 }}>
          <input type="text" placeholder="Cerca per nome…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            style={{ padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', background: '#fff' }}>
            <option value="">Tutte le categorie</option>
            {CATEGORIE.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-green" style={{ ...btnBase, whiteSpace: 'nowrap' }}>
          + Carica documento
        </button>
      </div>

      {/* Tabella */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
            Documenti{(search || catFilter) ? ` — ${filtered.length} risultati` : ` — ${documenti.length} totali`}
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, cursor: 'default' }}>Tipo</th>
                {cols.map(c => (
                  <th key={c.key} style={thStyle} onClick={() => handleSort(c.key)}>
                    {c.label} <SortIcon col={c.key} sortCol={sortCol} sortDir={sortDir} />
                  </th>
                ))}
                <th style={{ ...thStyle, cursor: 'default' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Nessun documento trovato.</td></tr>
              ) : filtered.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 14px' }}>{fileBadge(d.mime_type, d.filename)}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{d.nome}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13 }}>
                    <span style={{ background: '#f0f4ff', color: '#3a5fa8', fontWeight: 600, fontSize: 11, padding: '2px 8px', borderRadius: 10 }}>{d.categoria}</span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#888' }}>{formatSize(d.size_bytes)}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#555' }}>{d.uploaded_by}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>{formatDate(d.created_at)}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <a href={`/uploads/documenti/${d.filename}`} download={d.nome}
                        style={{ padding: '3px 10px', fontSize: 12, border: '1px solid #ccc', borderRadius: 4, background: '#f9f9f9', color: '#333', textDecoration: 'none', fontFamily: 'inherit' }}>
                        ↓ Scarica
                      </a>
                      <DeleteBtn id={d.id} role={role} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
