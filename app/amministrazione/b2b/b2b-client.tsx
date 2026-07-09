'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  salvaTemplateB2B, salvaComeNuovoTemplateB2B, eliminaTemplateB2B,
  salvaBrandB2B, eliminaBrandB2B, inviaEmailB2B,
  type InviaResult,
} from './actions'

export type TemplateB2B = {
  id: number
  oggetto: string
  testo: string
  updated_at: string
}

export type BrandB2B = {
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

// ─── Modale form brand ────────────────────────────────────────────────────

function BrandForm({ brand, onClose }: { brand: BrandB2B | null; onClose: () => void }) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')
  const [nome, setNome]         = useState(brand?.nome ?? '')
  const [email, setEmail]       = useState(brand?.email ?? '')
  const [telefono, setTelefono] = useState(brand?.telefono ?? '')
  const [note, setNote]         = useState(brand?.note ?? '')

  function handleSave() {
    const fd = new FormData()
    if (brand) fd.set('id', String(brand.id))
    fd.set('nome', nome)
    fd.set('email', email)
    fd.set('telefono', telefono)
    fd.set('note', note)
    setError('')
    startT(async () => {
      const res = await salvaBrandB2B(null, fd)
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
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{brand ? 'Modifica brand' : 'Nuovo brand'}</h3>
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

// ─── Pagina B2B ───────────────────────────────────────────────────────────

export default function B2BClient({ templates, brands }: { templates: TemplateB2B[]; brands: BrandB2B[] }) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [sending, startSend] = useTransition()

  const [selectedId, setSelectedId] = useState<number | null>(templates[0]?.id ?? null)
  const [oggetto, setOggetto] = useState(templates[0]?.oggetto ?? '')
  const [testo, setTesto]     = useState(templates[0]?.testo ?? '')
  const [error, setError]     = useState('')

  const [selectedBrandIds, setSelectedBrandIds] = useState<Set<number>>(new Set())
  const [brandForm, setBrandForm] = useState<'new' | BrandB2B | null>(null)
  const [inviaResult, setInviaResult] = useState<InviaResult | null>(null)

  function caricaTemplate(t: TemplateB2B) {
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
      const res = await salvaTemplateB2B(null, fd)
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
      const res = await salvaComeNuovoTemplateB2B(null, fd)
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
      const res = await eliminaTemplateB2B(null, fd)
      if (!res.ok) { setError(res.error); return }
      nuovoTemplate()
      router.refresh()
    })
  }

  function toggleBrand(id: number) {
    setSelectedBrandIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function handleEliminaBrand(id: number) {
    if (!confirm('Eliminare questo brand dalla rubrica?')) return
    const fd = new FormData()
    fd.set('id', String(id))
    startT(async () => {
      const res = await eliminaBrandB2B(null, fd)
      if (!res.ok) { alert(res.error); return }
      setSelectedBrandIds(prev => { const n = new Set(prev); n.delete(id); return n })
      router.refresh()
    })
  }

  function handleInvia() {
    setInviaResult(null)
    startSend(async () => {
      const res = await inviaEmailB2B(oggetto, testo, [...selectedBrandIds])
      setInviaResult(res)
      if (res.ok) setSelectedBrandIds(new Set())
    })
  }

  const canInvia = oggetto.trim() !== '' && testo.trim() !== '' && selectedBrandIds.size > 0 && !sending

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        Amministrazione / B2B
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>B2B — Template ed email a marchi/fornitori</h1>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* ── Colonna template ── */}
        <div style={{ flex: '2 1 480px', minWidth: 320, background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Template</h2>
            <button onClick={nuovoTemplate} className="btn-black fs-12" style={{ padding: '0 14px', height: 32 }}>+ Nuovo</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
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

        {/* ── Colonna rubrica brand ── */}
        <div style={{ flex: '1 1 320px', minWidth: 280, background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Rubrica Brand</h2>
            <button onClick={() => setBrandForm('new')} className="btn-black fs-12" style={{ padding: '0 14px', height: 32 }}>+ Nuovo</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 480, overflowY: 'auto' }}>
            {brands.length === 0 && (
              <p className="fs-12" style={{ color: '#888' }}>Nessun brand in rubrica. Aggiungine uno con &quot;+ Nuovo&quot;.</p>
            )}
            {brands.map(b => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: '1px solid #eee', borderRadius: 6 }}>
                <input type="checkbox" checked={selectedBrandIds.has(b.id)} onChange={() => toggleBrand(b.id)} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fs-13" style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.nome}</div>
                  <div className="fs-11" style={{ color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.email}</div>
                </div>
                <button onClick={() => setBrandForm(b)} className="fs-11" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a4a8a' }}>✏️</button>
                <button onClick={() => handleEliminaBrand(b.id)} className="fs-11" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c00' }}>🗑️</button>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, color: '#888' }}>{selectedBrandIds.size} selezionati</div>
        </div>
      </div>

      {/* ── Barra invio ── */}
      <div style={{ marginTop: 16, background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={handleInvia} disabled={!canInvia} className={canInvia ? 'btn-green' : 'btn-gray'} style={{ height: 42, fontSize: 14, fontWeight: 700 }}>
          {sending ? 'Invio in corso…' : `Invia mail (${selectedBrandIds.size} destinatari)`}
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

      {brandForm && (
        <BrandForm brand={brandForm === 'new' ? null : brandForm} onClose={() => setBrandForm(null)} />
      )}

      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>sezione B2B: template + rubrica brand + invio email individuale per destinatario</p>
    </div>
  )
}
