'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addCliente, updateCliente, deleteCliente, type MutResult } from './actions'

export type Cliente = {
  id: number
  tipo: 'fisica' | 'giuridica'
  nome: string
  cognome: string
  ragione_sociale: string
  indirizzo: string
  telefono: string
  email: string
  pec: string
  codice_sdi: string
  codice_fiscale: string
  partita_iva: string
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
const inputStyle: React.CSSProperties = {
  padding: '8px 10px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
}

function TipoBadge({ tipo }: { tipo: string }) {
  const isF = tipo === 'fisica'
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
      color: isF ? '#276749' : '#2b6cb0',
      background: isF ? '#f0fff4' : '#ebf8ff',
    }}>
      {isF ? 'Persona fisica' : 'Persona giuridica'}
    </span>
  )
}

function SortIcon({ col, sortCol, sortDir }: { col: string; sortCol: string; sortDir: 'asc'|'desc' }) {
  if (col !== sortCol) return <span style={{ color: '#ccc', marginLeft: 4 }}>↕</span>
  return <span style={{ marginLeft: 4 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
}

function ClienteForm({ defaults, onClose, action, pending, error }: {
  defaults?: Cliente
  onClose: () => void
  action: (payload: FormData) => void
  pending: boolean
  error?: string
}) {
  const [tipo, setTipo] = useState<'fisica'|'giuridica'>(defaults?.tipo ?? 'fisica')

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      {/* Tipo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Tipo *</label>
        <div style={{ display: 'flex', gap: 16 }}>
          {(['fisica','giuridica'] as const).map(t => (
            <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
              <input type="radio" name="tipo" value={t} checked={tipo === t} onChange={() => setTipo(t)} />
              {t === 'fisica' ? 'Persona fisica' : 'Persona giuridica'}
            </label>
          ))}
        </div>
      </div>

      {/* Nome / Cognome o Ragione Sociale */}
      {tipo === 'fisica' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Nome *</label>
            <input name="nome" type="text" required defaultValue={defaults?.nome ?? ''} placeholder="Mario" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Cognome *</label>
            <input name="cognome" type="text" required defaultValue={defaults?.cognome ?? ''} placeholder="Rossi" style={inputStyle} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Ragione sociale *</label>
          <input name="ragione_sociale" type="text" required defaultValue={defaults?.ragione_sociale ?? ''} placeholder="es. Rossi SRL" style={inputStyle} />
        </div>
      )}
      {/* Hidden fields for the unused type so server always receives both */}
      {tipo === 'fisica'
        ? <input type="hidden" name="ragione_sociale" value="" />
        : <><input type="hidden" name="nome" value="" /><input type="hidden" name="cognome" value="" /></>
      }

      {/* Indirizzo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>{tipo === 'giuridica' ? 'Sede legale' : 'Indirizzo'}</label>
        <input name="indirizzo" type="text" defaultValue={defaults?.indirizzo ?? ''} placeholder="Via Roma 1, 90100 Palermo" style={inputStyle} />
      </div>

      {/* Telefono + Email */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Telefono</label>
          <input name="telefono" type="tel" defaultValue={defaults?.telefono ?? ''} placeholder="+39 091 000000" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Email</label>
          <input name="email" type="email" defaultValue={defaults?.email ?? ''} placeholder="mario@esempio.it" style={inputStyle} />
        </div>
      </div>

      {/* PEC + Codice SDI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>PEC</label>
          <input name="pec" type="email" defaultValue={defaults?.pec ?? ''} placeholder="mario@pec.it" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Codice univoco SDI</label>
          <input name="codice_sdi" type="text" defaultValue={defaults?.codice_sdi ?? ''} placeholder="XXXXXXX" maxLength={7}
            style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
        </div>
      </div>

      {/* CF + P.IVA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Codice fiscale</label>
          <input name="codice_fiscale" type="text" defaultValue={defaults?.codice_fiscale ?? ''} placeholder="RSSMRA80A01F205X" maxLength={16}
            style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '0.06em' }} />
        </div>
        {tipo === 'giuridica' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Partita IVA</label>
            <input name="partita_iva" type="text" defaultValue={defaults?.partita_iva ?? ''} placeholder="07407080824" maxLength={11}
              style={{ ...inputStyle, letterSpacing: '0.06em' }} />
          </div>
        )}
        {tipo === 'fisica' && <input type="hidden" name="partita_iva" value="" />}
      </div>

      {error && (
        <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>{error}</div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} className="btn-red" style={btnBase}>Annulla</button>
        <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={btnBase}>
          {pending ? 'Salvataggio…' : 'Salva'}
        </button>
      </div>
    </form>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', width: '100%', maxWidth: 560, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function AddModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [result, formAction, pending] = useActionState<MutResult | null, FormData>(addCliente, null)
  useEffect(() => { if (result?.ok) { router.refresh(); onClose() } }, [result])
  return (
    <Modal title="Nuovo cliente" onClose={onClose}>
      <ClienteForm onClose={onClose} action={formAction} pending={pending} error={result && !result.ok ? result.error : undefined} />
    </Modal>
  )
}

function EditModal({ cliente, onClose }: { cliente: Cliente; onClose: () => void }) {
  const router = useRouter()
  const [result, formAction, pending] = useActionState<MutResult | null, FormData>(updateCliente, null)
  useEffect(() => { if (result?.ok) { router.refresh(); onClose() } }, [result])
  return (
    <Modal title="Modifica cliente" onClose={onClose}>
      <ClienteForm defaults={cliente} onClose={onClose} action={formAction} pending={pending} error={result && !result.ok ? result.error : undefined} />
    </Modal>
  )
}

function DeleteBtn({ id, role }: { id: number; role: string }) {
  const router = useRouter()
  const [result, action, pending] = useActionState<MutResult | null, FormData>(deleteCliente, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])
  if (role !== 'admin') return null
  return (
    <form action={action} onSubmit={e => { if (!confirm('Eliminare questo cliente?')) e.preventDefault() }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending}
        className={pending ? 'btn-gray' : 'btn-red'}
        style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, fontFamily: 'inherit' }}>
        {pending ? '…' : 'Elimina'}
      </button>
    </form>
  )
}

function displayName(c: Cliente) {
  return c.tipo === 'fisica' ? `${c.nome} ${c.cognome}`.trim() : c.ragione_sociale
}

type SortCol = 'nome_display' | 'tipo' | 'telefono' | 'email' | 'indirizzo' | 'codice_sdi'

export default function AnagraficaClientiClient({ clienti, role }: { clienti: Cliente[]; role: string }) {
  const [showAdd, setShowAdd]   = useState(false)
  const [editing, setEditing]   = useState<Cliente | null>(null)
  const [search, setSearch]     = useState('')
  const [tipoFilter, setTipoFilter] = useState('')
  const [sortCol, setSortCol]   = useState<SortCol>('nome_display')
  const [sortDir, setSortDir]   = useState<'asc'|'desc'>('asc')

  function handleSort(col: SortCol) {
    if (col === sortCol) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const filtered = clienti
    .filter(c => {
      const q = search.toLowerCase()
      const name = displayName(c).toLowerCase()
      const matchText = !q || name.includes(q) || c.email.toLowerCase().includes(q) || c.telefono.toLowerCase().includes(q) || c.codice_sdi.toLowerCase().includes(q) || c.codice_fiscale.toLowerCase().includes(q) || c.partita_iva.toLowerCase().includes(q)
      const matchTipo = !tipoFilter || c.tipo === tipoFilter
      return matchText && matchTipo
    })
    .sort((a, b) => {
      let va: string, vb: string
      if (sortCol === 'nome_display') { va = displayName(a); vb = displayName(b) }
      else { va = a[sortCol as keyof Cliente] as string; vb = b[sortCol as keyof Cliente] as string }
      if (va === vb) return 0
      const cmp = va.localeCompare(vb)
      return sortDir === 'asc' ? cmp : -cmp
    })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
      {editing && <EditModal cliente={editing} onClose={() => setEditing(null)} />}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="Cerca nome, email, telefono, SDI…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit' }} />
        <select value={tipoFilter} onChange={e => setTipoFilter(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 14, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', background: '#fff' }}>
          <option value="">Tutti i tipi</option>
          <option value="fisica">Persona fisica</option>
          <option value="giuridica">Persona giuridica</option>
        </select>
        <button onClick={() => setShowAdd(true)} className="btn-green" style={{ ...btnBase, whiteSpace: 'nowrap' }}>
          + Nuovo cliente
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '14px 24px 10px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
            Clienti{(search || tipoFilter) ? ` — ${filtered.length} risultati` : ` — ${clienti.length} totali`}
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle} onClick={() => handleSort('tipo')}>Tipo <SortIcon col="tipo" sortCol={sortCol} sortDir={sortDir} /></th>
                <th style={{ ...thStyle, textAlign: 'left', paddingLeft: 20 }} onClick={() => handleSort('nome_display')}>Nome / Ragione sociale <SortIcon col="nome_display" sortCol={sortCol} sortDir={sortDir} /></th>
                <th style={thStyle} onClick={() => handleSort('indirizzo')}>Indirizzo / Sede <SortIcon col="indirizzo" sortCol={sortCol} sortDir={sortDir} /></th>
                <th style={thStyle} onClick={() => handleSort('telefono')}>Telefono <SortIcon col="telefono" sortCol={sortCol} sortDir={sortDir} /></th>
                <th style={thStyle} onClick={() => handleSort('email')}>Email <SortIcon col="email" sortCol={sortCol} sortDir={sortDir} /></th>
                <th style={thStyle} onClick={() => handleSort('codice_sdi')}>PEC / SDI <SortIcon col="codice_sdi" sortCol={sortCol} sortDir={sortDir} /></th>
                <th style={{ ...thStyle, cursor: 'default' }}>CF / P.IVA</th>
                <th style={{ ...thStyle, cursor: 'default' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Nessun cliente trovato.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={tdStyle}><TipoBadge tipo={c.tipo} /></td>
                  <td style={{ ...tdStyle, fontWeight: 600, textAlign: 'left', paddingLeft: 20 }}>{displayName(c)}</td>
                  <td style={{ ...tdStyle, fontSize: 12, color: '#555', maxWidth: 180 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.indirizzo || <span style={{ color: '#ccc' }}>—</span>}</div>
                  </td>
                  <td style={tdStyle}>{c.telefono || <span style={{ color: '#ccc' }}>—</span>}</td>
                  <td style={tdStyle}>{c.email
                    ? <a href={`mailto:${c.email}`} style={{ color: '#2b6cb0', textDecoration: 'none' }}>{c.email}</a>
                    : <span style={{ color: '#ccc' }}>—</span>}
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                      <span style={{ color: '#555' }}>{c.pec || <span style={{ color: '#ccc' }}>—</span>}</span>
                      {c.codice_sdi && <span style={{ fontFamily: 'monospace', color: '#888', letterSpacing: '0.08em' }}>{c.codice_sdi}</span>}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                      {c.codice_fiscale
                        ? <span style={{ fontFamily: 'monospace', color: '#555', letterSpacing: '0.06em' }}>{c.codice_fiscale}</span>
                        : <span style={{ color: '#ccc' }}>—</span>}
                      {c.partita_iva && <span style={{ fontFamily: 'monospace', color: '#888', letterSpacing: '0.06em' }}>P.IVA {c.partita_iva}</span>}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button onClick={() => setEditing(c)}
                        style={{ padding: '3px 10px', fontSize: 12, border: '1px solid #ccc', borderRadius: 4, background: '#fafafa', color: '#444', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Modifica
                      </button>
                      <DeleteBtn id={c.id} role={role} />
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
