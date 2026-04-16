'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addFornitore, updateFornitore, deleteFornitore, type MutResult } from './actions'

export type Fornitore = {
  id: number
  ragione_sociale: string
  indirizzo: string
  telefono: string
  email: string
  pec: string
  created_at: string
}

const btnBase: React.CSSProperties = {
  padding: '8px 18px', fontSize: 14, borderRadius: 6,
  fontFamily: 'inherit',
}
const thStyle: React.CSSProperties = {
  padding: '9px 14px', fontSize: 11, fontWeight: 600, color: '#888',
  textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em',
  whiteSpace: 'nowrap', background: '#fafafa', borderBottom: '1px solid #e8e8e8',
  cursor: 'pointer', userSelect: 'none',
}
const tdStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 13, textAlign: 'center',
}

function SortIcon({ col, sortCol, sortDir }: { col: string; sortCol: string; sortDir: 'asc'|'desc' }) {
  if (col !== sortCol) return <span style={{ color: '#ccc', marginLeft: 4 }}>↕</span>
  return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
}

function FornitoreFields({ defaults }: { defaults?: Fornitore }) {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Ragione sociale *</label>
        <input name="ragione_sociale" type="text" required defaultValue={defaults?.ragione_sociale ?? ''}
          placeholder="es. Edilforniture SRL"
          style={{ padding: '8px 10px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Indirizzo</label>
        <input name="indirizzo" type="text" defaultValue={defaults?.indirizzo ?? ''}
          placeholder="Via Roma 1, 90100 Palermo"
          style={{ padding: '8px 10px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Telefono</label>
          <input name="telefono" type="tel" defaultValue={defaults?.telefono ?? ''}
            placeholder="+39 091 000000"
            style={{ padding: '8px 10px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Email</label>
          <input name="email" type="email" defaultValue={defaults?.email ?? ''}
            placeholder="info@fornitore.it"
            style={{ padding: '8px 10px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>PEC</label>
        <input name="pec" type="email" defaultValue={defaults?.pec ?? ''}
          placeholder="fornitore@pec.it"
          style={{ padding: '8px 10px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
      </div>
    </>
  )
}

function AddModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [result, formAction, pending] = useActionState<MutResult | null, FormData>(addFornitore, null)
  useEffect(() => { if (result?.ok) { router.refresh(); onClose() } }, [result])
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', width: '100%', maxWidth: 520, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Nuovo fornitore</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <FornitoreFields />
          {result && !result.ok && (
            <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>{result.error}</div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-red" style={btnBase}>Annulla</button>
            <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={btnBase}>
              {pending ? 'Salvataggio…' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditModal({ fornitore, onClose }: { fornitore: Fornitore; onClose: () => void }) {
  const router = useRouter()
  const [result, formAction, pending] = useActionState<MutResult | null, FormData>(updateFornitore, null)
  useEffect(() => { if (result?.ok) { router.refresh(); onClose() } }, [result])
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', width: '100%', maxWidth: 520, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Modifica fornitore</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <input type="hidden" name="id" value={fornitore.id} />
          <FornitoreFields defaults={fornitore} />
          {result && !result.ok && (
            <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>{result.error}</div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-red" style={btnBase}>Annulla</button>
            <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={btnBase}>
              {pending ? 'Salvataggio…' : 'Salva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteBtn({ id, role }: { id: number; role: string }) {
  const router = useRouter()
  const [result, action, pending] = useActionState<MutResult | null, FormData>(deleteFornitore, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  if (role !== 'admin') return null
  return (
    <form action={action} onSubmit={e => { if (!confirm('Eliminare questo fornitore?')) e.preventDefault() }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending}
        className={pending ? 'btn-gray' : 'btn-red'}
        style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, fontFamily: 'inherit' }}>
        {pending ? '…' : 'Elimina'}
      </button>
    </form>
  )
}

type SortCol = 'ragione_sociale'|'telefono'|'email'|'pec'|'indirizzo'

export default function AnagraficaForniClient({ fornitori, role }: { fornitori: Fornitore[]; role: string }) {
  const [showAdd, setShowAdd]       = useState(false)
  const [editing, setEditing]       = useState<Fornitore | null>(null)
  const [search, setSearch]         = useState('')
  const [sortCol, setSortCol]       = useState<SortCol>('ragione_sociale')
  const [sortDir, setSortDir]       = useState<'asc'|'desc'>('asc')

  function handleSort(col: SortCol) {
    if (col === sortCol) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const filtered = fornitori
    .filter(f => {
      const q = search.toLowerCase()
      return !q
        || f.ragione_sociale.toLowerCase().includes(q)
        || f.indirizzo.toLowerCase().includes(q)
        || f.telefono.toLowerCase().includes(q)
        || f.email.toLowerCase().includes(q)
        || f.pec.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      const va = a[sortCol]; const vb = b[sortCol]
      if (va === vb) return 0
      const cmp = va.localeCompare(vb)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const cols: { key: SortCol; label: string }[] = [
    { key: 'ragione_sociale', label: 'Ragione Sociale' },
    { key: 'indirizzo',       label: 'Indirizzo' },
    { key: 'telefono',        label: 'Telefono' },
    { key: 'email',           label: 'Email' },
    { key: 'pec',             label: 'PEC' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showAdd  && <AddModal onClose={() => setShowAdd(false)} />}
      {editing  && <EditModal fornitore={editing} onClose={() => setEditing(null)} />}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="Cerca ragione sociale, email, telefono…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
        <button onClick={() => setShowAdd(true)} className="btn-green" style={{ ...btnBase, whiteSpace: 'nowrap' }}>
          + Nuovo fornitore
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
            Fornitori{search ? ` — ${filtered.length} risultati` : ` — ${fornitori.length} totali`}
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
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
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Nessun fornitore trovato.</td></tr>
              ) : filtered.map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ ...tdStyle, fontWeight: 600, textAlign: 'left', paddingLeft: 20 }}>{f.ragione_sociale}</td>
                  <td style={{ ...tdStyle, color: '#555' }}>{f.indirizzo || <span style={{ color: '#ccc' }}>—</span>}</td>
                  <td style={tdStyle}>{f.telefono || <span style={{ color: '#ccc' }}>—</span>}</td>
                  <td style={tdStyle}>{f.email
                    ? <a href={`mailto:${f.email}`} style={{ color: '#2b6cb0', textDecoration: 'none' }}>{f.email}</a>
                    : <span style={{ color: '#ccc' }}>—</span>}
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, color: '#555' }}>{f.pec || <span style={{ color: '#ccc' }}>—</span>}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button onClick={() => setEditing(f)}
                        style={{ padding: '3px 10px', fontSize: 12, border: '1px solid #ccc', borderRadius: 4, background: '#fafafa', color: '#444', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Modifica
                      </button>
                      <DeleteBtn id={f.id} role={role} />
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
