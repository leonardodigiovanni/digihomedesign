'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  salvaTemplateB2C, salvaComeNuovoTemplateB2C, eliminaTemplateB2C,
  salvaClienteB2C, eliminaClienteB2C, inviaEmailB2C,
  type InviaResult,
} from './actions'

export type TemplateB2C = {
  id: number
  oggetto: string
  testo: string
  updated_at: string
}

export type ClienteB2C = {
  id: number
  nome: string
  email: string
  telefono: string
  note: string
}

const inp: React.CSSProperties = {
  padding: '7px 10px', border: '1px solid #ccc', borderRadius: 5,
  fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase',
  letterSpacing: '0.05em', display: 'block', marginBottom: 4,
}

// ─── Modale form cliente ──────────────────────────────────────────────────

function ClienteForm({ cliente, onClose }: { cliente: ClienteB2C | null; onClose: () => void }) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')
  const [nome, setNome]         = useState(cliente?.nome ?? '')
  const [email, setEmail]       = useState(cliente?.email ?? '')
  const [telefono, setTelefono] = useState(cliente?.telefono ?? '')
  const [note, setNote]         = useState(cliente?.note ?? '')

  function handleSave() {
    const fd = new FormData()
    if (cliente) fd.set('id', String(cliente.id))
    fd.set('nome', nome)
    fd.set('email', email)
    fd.set('telefono', telefono)
    fd.set('note', note)
    setError('')
    startT(async () => {
      const res = await salvaClienteB2C(null, fd)
      if (!res.ok) { setError(res.error); return }
      router.refresh()
      onClose()
    })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '24px 16px', overflowY: 'auto',
    }}>
      <div style={{ background: '#fff', borderRadius: 10, width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #e8e8e8' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{cliente ? 'Modifica cliente' : 'Nuovo cliente'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={lbl}>Nome</label>
            <input style={inp} value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Email</label>
            <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Telefono</label>
            <input style={inp} value={telefono} onChange={e => setTelefono(e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Note</label>
            <textarea style={{ ...inp, resize: 'vertical' }} rows={3} value={note} onChange={e => setNote(e.target.value)} />
          </div>
          {error && <div style={{ background: '#fff5f5', color: '#c00', padding: '8px 12px', borderRadius: 5, fontSize: 13 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
            <button onClick={onClose} className="btn-red">Annulla</button>
            <button onClick={handleSave} disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={{ padding: '0 22px' }}>
              {pending ? 'Salvataggio…' : 'Salva'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pagina B2C ───────────────────────────────────────────────────────────

export default function B2CClient({ templates, clienti }: { templates: TemplateB2C[]; clienti: ClienteB2C[] }) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [sending, startSend] = useTransition()

  const [selectedId, setSelectedId] = useState<number | null>(templates[0]?.id ?? null)
  const [oggetto, setOggetto] = useState(templates[0]?.oggetto ?? '')
  const [testo, setTesto]     = useState(templates[0]?.testo ?? '')
  const [error, setError]     = useState('')

  const [selectedClienteIds, setSelectedClienteIds] = useState<Set<number>>(new Set())
  const [clienteForm, setClienteForm] = useState<'new' | ClienteB2C | null>(null)
  const [inviaResult, setInviaResult] = useState<InviaResult | null>(null)

  function caricaTemplate(t: TemplateB2C) {
    setSelectedId(t.id)
    setOggetto(t.oggetto)
    setTesto(t.testo)
    setError('')
    setInviaResult(null)
  }

  function nuovoTemplate() {
    setSelectedId(null)
    setOggetto('')
    setTesto('')
    setError('')
    setInviaResult(null)
  }

  function handleSalva() {
    const fd = new FormData()
    if (selectedId) fd.set('id', String(selectedId))
    fd.set('oggetto', oggetto)
    fd.set('testo', testo)
    setError('')
    startT(async () => {
      const res = await salvaTemplateB2C(null, fd)
      if (!res.ok) { setError(res.error); return }
      if (res.id) setSelectedId(res.id)
      router.refresh()
    })
  }

  function handleSalvaComeNuovo() {
    const fd = new FormData()
    fd.set('oggetto', oggetto)
    fd.set('testo', testo)
    setError('')
    startT(async () => {
      const res = await salvaComeNuovoTemplateB2C(null, fd)
      if (!res.ok) { setError(res.error); return }
      if (res.id) setSelectedId(res.id)
      router.refresh()
    })
  }

  function handleElimina() {
    if (!selectedId) return
    if (!confirm('Eliminare questo template?')) return
    const fd = new FormData()
    fd.set('id', String(selectedId))
    startT(async () => {
      const res = await eliminaTemplateB2C(null, fd)
      if (!res.ok) { setError(res.error); return }
      nuovoTemplate()
      router.refresh()
    })
  }

  function toggleCliente(id: number) {
    setSelectedClienteIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function handleEliminaCliente(id: number) {
    if (!confirm('Eliminare questo cliente dalla rubrica?')) return
    const fd = new FormData()
    fd.set('id', String(id))
    startT(async () => {
      const res = await eliminaClienteB2C(null, fd)
      if (!res.ok) { alert(res.error); return }
      setSelectedClienteIds(prev => { const n = new Set(prev); n.delete(id); return n })
      router.refresh()
    })
  }

  function handleInvia() {
    setInviaResult(null)
    startSend(async () => {
      const res = await inviaEmailB2C(oggetto, testo, [...selectedClienteIds])
      setInviaResult(res)
      if (res.ok) setSelectedClienteIds(new Set())
    })
  }

  const canInvia = oggetto.trim() !== '' && testo.trim() !== '' && selectedClienteIds.size > 0 && !sending

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        Amministrazione / B2C
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>B2C — Template ed email ai clienti</h1>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* ── Colonna template ── */}
        <div style={{ flex: '2 1 480px', minWidth: 320, background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Template</h2>
            <button onClick={nuovoTemplate} className="btn-black fs-12" style={{ padding: '0 14px', height: 32 }}>+ Nuovo</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {templates.length === 0 && (
              <p className="fs-12" style={{ color: '#888' }}>Nessun template salvato. Crea il primo con &quot;+ Nuovo&quot;.</p>
            )}
            {templates.map(t => (
              <button key={t.id} onClick={() => caricaTemplate(t)}
                className="fs-12"
                style={{
                  padding: '6px 12px', borderRadius: 16, cursor: 'pointer',
                  border: t.id === selectedId ? '2px solid #1a4a8a' : '1px solid #ccc',
                  background: t.id === selectedId ? '#eaf1fb' : '#fafafa',
                  color: '#333', fontWeight: t.id === selectedId ? 700 : 400,
                }}
              >
                {t.oggetto}
              </button>
            ))}
          </div>

          <div>
            <label style={lbl}>Oggetto</label>
            <input style={inp} value={oggetto} onChange={e => setOggetto(e.target.value)} placeholder="Oggetto dell'email" />
          </div>
          <div>
            <label style={lbl}>Testo</label>
            <textarea style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} rows={16} value={testo} onChange={e => setTesto(e.target.value)} placeholder="Corpo dell'email" />
          </div>

          {error && <div style={{ background: '#fff5f5', color: '#c00', padding: '8px 12px', borderRadius: 5, fontSize: 13 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={handleSalva} disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={{ flex: 1, minWidth: 100 }}>
              {pending ? '…' : 'Salva'}
            </button>
            <button onClick={handleSalvaComeNuovo} disabled={pending} className="btn-black" style={{ flex: 1, minWidth: 100 }}>
              Salva con nome
            </button>
            <button onClick={handleElimina} disabled={pending || !selectedId} className="btn-red" style={{ flex: 1, minWidth: 100 }}>
              Elimina
            </button>
          </div>
        </div>

        {/* ── Colonna clienti ── */}
        <div style={{ flex: '1 1 320px', minWidth: 280, background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Clienti</h2>
            <button onClick={() => setClienteForm('new')} className="btn-black fs-12" style={{ padding: '0 14px', height: 32 }}>+ Nuovo</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 480, overflowY: 'auto' }}>
            {clienti.length === 0 && (
              <p className="fs-12" style={{ color: '#888' }}>Nessun cliente in rubrica. Aggiungine uno con &quot;+ Nuovo&quot;.</p>
            )}
            {clienti.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: '1px solid #eee', borderRadius: 6 }}>
                <input type="checkbox" checked={selectedClienteIds.has(c.id)} onChange={() => toggleCliente(c.id)} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fs-13" style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nome}</div>
                  <div className="fs-11" style={{ color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</div>
                </div>
                <button onClick={() => setClienteForm(c)} className="fs-11" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a4a8a' }}>✏️</button>
                <button onClick={() => handleEliminaCliente(c.id)} className="fs-11" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c00' }}>🗑️</button>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, color: '#888' }}>{selectedClienteIds.size} selezionati</div>
        </div>
      </div>

      {/* ── Barra invio ── */}
      <div style={{ marginTop: 16, background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={handleInvia} disabled={!canInvia} className={canInvia ? 'btn-green' : 'btn-gray'} style={{ height: 42, fontSize: 14, fontWeight: 700 }}>
          {sending ? 'Invio in corso…' : `Invia mail (${selectedClienteIds.size} destinatari)`}
        </button>
        {inviaResult && !inviaResult.ok && (
          <div style={{ background: '#fff5f5', color: '#c00', padding: '8px 12px', borderRadius: 5, fontSize: 13 }}>{inviaResult.error}</div>
        )}
        {inviaResult && inviaResult.ok && (
          <div className="fs-12" style={{ color: '#333' }}>
            {inviaResult.inviate.length > 0 && (
              <div style={{ color: '#1a7a2a' }}>Inviata a: {inviaResult.inviate.join(', ')}</div>
            )}
            {inviaResult.fallite.length > 0 && (
              <div style={{ color: '#c00', marginTop: 4 }}>
                Errore per: {inviaResult.fallite.map(f => `${f.email} (${f.error})`).join(', ')}
              </div>
            )}
          </div>
        )}
      </div>

      {clienteForm && (
        <ClienteForm cliente={clienteForm === 'new' ? null : clienteForm} onClose={() => setClienteForm(null)} />
      )}

      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>sezione B2C: template + rubrica clienti (tabella separata da clienti/users) + invio email individuale per destinatario</p>
    </div>
  )
}
