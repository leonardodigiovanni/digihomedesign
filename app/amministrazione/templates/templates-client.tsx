'use client'

import React, { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { salvaTemplate, salvaDisegnoTemplate, toggleAttivoTemplate, eliminaTemplate, type MutResult } from './actions'
import ShortcutStar from '@/components/shortcut-star'

export type Template = {
  id: number
  nome: string
  html: string
  attivo: number
  updated_at: string
}

export type DisegnoTemplate = {
  tipo: 'disegno_portrait' | 'disegno_landscape'
  label: string
  html: string
  updated_at: string
}

export type ProvvisorioTemplate = {
  html: string
  updated_at: string
}

const inp: React.CSSProperties = {
  padding: '7px 10px', border: '1px solid #ccc', borderRadius: 5,
  fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase',
  letterSpacing: '0.05em', display: 'block', marginBottom: 4,
}

// ─── Editor template disegno ─────────────────────────────────────────────────

function DisegnoTemplateEditor({ template, onClose }: { template: DisegnoTemplate; onClose: () => void }) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')
  const [html, setHtml]   = useState(template.html)
  const [tab, setTab]     = useState<'edit' | 'preview'>('edit')

  function handleSave() {
    const fd = new FormData()
    fd.set('tipo', template.tipo)
    fd.set('html', html)
    setError('')
    startT(async () => {
      const res = await salvaDisegnoTemplate(null, fd)
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
      <div style={{ background: '#fff', borderRadius: 10, width: '100%', maxWidth: 1000, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #e8e8e8' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Modifica: {template.label}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 11, color: '#888', lineHeight: 1.6 }}>
            Placeholder: <code>{'{{svg}}'}</code> — immagine SVG · <code>{'{{data}}'}</code> — data corrente · <code>{'{{W}}'}</code> / <code>{'{{H}}'}</code> — dimensioni pagina px
          </div>
          <div>
            <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '2px solid #e8e8e8' }}>
              {(['edit', 'preview'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '7px 20px', fontSize: 13, fontWeight: tab === t ? 700 : 400,
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: tab === t ? '2px solid #1a4a8a' : '2px solid transparent',
                  marginBottom: -2, color: tab === t ? '#1a4a8a' : '#666',
                }}>
                  {t === 'edit' ? '✏️ Modifica HTML' : '👁 Anteprima'}
                </button>
              ))}
            </div>
            {tab === 'edit' ? (
              <textarea value={html} onChange={e => setHtml(e.target.value)} rows={22} spellCheck={false} style={{
                ...inp, marginTop: 12, fontFamily: '"Courier New", Courier, monospace',
                fontSize: 12, resize: 'vertical', lineHeight: 1.5,
                background: '#1e1e2e', color: '#cdd6f4', borderColor: '#444',
              }} />
            ) : (
              <div style={{ marginTop: 12, border: '1px solid #ddd', borderRadius: 6, background: '#f0f0f0', padding: 20, overflowX: 'auto' }}>
                <div dangerouslySetInnerHTML={{ __html: html.replace('{{svg}}', '<div style="width:200px;height:150px;background:#e0e8f0;border:1px solid #aaa;display:flex;align-items:center;justify-content:center;font-size:11px;color:#666;">[ SVG disegno ]</div>').replace('{{data}}', new Date().toLocaleDateString('it-IT')).replace('{{W}}', '794').replace('{{H}}', '1123') }} />
              </div>
            )}
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

// ─── Editor template provvisorio ─────────────────────────────────────────────

function ProvvisorioTemplateEditor({ template, onClose }: { template: ProvvisorioTemplate; onClose: () => void }) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')
  const [html, setHtml]   = useState(template.html)
  const [tab, setTab]     = useState<'edit' | 'preview'>('edit')

  function handleSave() {
    const fd = new FormData()
    fd.set('tipo', 'preventivo_provvisorio')
    fd.set('html', html)
    setError('')
    startT(async () => {
      const res = await salvaDisegnoTemplate(null, fd)
      if (!res.ok) { setError(res.error); return }
      router.refresh()
      onClose()
    })
  }

  const previewHtml = html
    .replace(/\{\{data\}\}/g, new Date().toLocaleDateString('it-IT'))
    .replace(/\{\{cliente_nome\}\}/g, 'Mario Rossi')

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '24px 16px', overflowY: 'auto',
    }}>
      <div style={{ background: '#fff', borderRadius: 10, width: '100%', maxWidth: 1000, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #e8e8e8' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Modifica: Template Preventivo Provvisorio</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 11, color: '#888', lineHeight: 1.6 }}>
            Placeholder: <code>{'{{data}}'}</code> — data corrente &nbsp;·&nbsp; <code>{'{{cliente_nome}}'}</code> — nome cliente/utente<br/>
            <em>Le schede articolo, il totale e il piè di pagina vengono generati automaticamente.</em>
          </div>
          <div>
            <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '2px solid #e8e8e8' }}>
              {(['edit', 'preview'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '7px 20px', fontSize: 13, fontWeight: tab === t ? 700 : 400,
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: tab === t ? '2px solid #1a4a8a' : '2px solid transparent',
                  marginBottom: -2, color: tab === t ? '#1a4a8a' : '#666',
                }}>
                  {t === 'edit' ? '✏️ Modifica HTML' : '👁 Anteprima'}
                </button>
              ))}
            </div>
            {tab === 'edit' ? (
              <textarea value={html} onChange={e => setHtml(e.target.value)} rows={22} spellCheck={false} style={{
                ...inp, marginTop: 12, fontFamily: '"Courier New", Courier, monospace',
                fontSize: 12, resize: 'vertical', lineHeight: 1.5,
                background: '#1e1e2e', color: '#cdd6f4', borderColor: '#444',
              }} />
            ) : (
              <div style={{ marginTop: 12, border: '1px solid #ddd', borderRadius: 6, background: '#f0f0f0', padding: 20, overflowX: 'auto' }}>
                <div style={{ background: '#fff', padding: 20, fontFamily: 'Arial,Helvetica,sans-serif', fontSize: 13 }}
                  dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            )}
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

// ─── Editor singolo template ─────────────────────────────────────────────────

function TemplateEditor({ template, onClose }: { template: Template | null; onClose: () => void }) {
  const router  = useRouter()
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')
  const [nome, setNome]   = useState(template?.nome ?? '')
  const [html, setHtml]   = useState(template?.html ?? '')
  const [tab, setTab]     = useState<'edit' | 'preview'>('edit')

  function handleSave() {
    const fd = new FormData()
    if (template?.id) fd.set('id', String(template.id))
    fd.set('nome', nome)
    fd.set('html', html)
    setError('')
    startT(async () => {
      const res = await salvaTemplate(null, fd)
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
      <div style={{
        background: '#fff', borderRadius: 10, width: '100%', maxWidth: 1000,
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
      }}>
        {/* Header modale */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 20px', borderBottom: '1px solid #e8e8e8',
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
            {template ? `Modifica: ${template.nome}` : 'Nuovo template'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>✕</button>
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Nome */}
          <div>
            <span style={lbl}>Nome template</span>
            <input value={nome} onChange={e => setNome(e.target.value)} style={inp} placeholder="Es. Template preventivo" />
          </div>

          {/* Tab edit/preview */}
          <div>
            <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '2px solid #e8e8e8' }}>
              {(['edit', 'preview'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '7px 20px', fontSize: 13, fontWeight: tab === t ? 700 : 400,
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: tab === t ? '2px solid #1a4a8a' : '2px solid transparent',
                  marginBottom: -2, color: tab === t ? '#1a4a8a' : '#666',
                }}>
                  {t === 'edit' ? '✏️ Modifica HTML' : '👁 Anteprima'}
                </button>
              ))}
            </div>

            {tab === 'edit' ? (
              <div>
                <span style={{ ...lbl, marginTop: 12, marginBottom: 6 }}>HTML template (usa {'{{placeholder}}'} per i dati dinamici)</span>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 8, lineHeight: 1.6 }}>
                  Placeholder disponibili: <code>{'{{data}}'}</code> <code>{'{{numero}}'}</code> <code>{'{{cliente_nome}}'}</code> <code>{'{{cliente_indirizzo}}'}</code> <code>{'{{articoli}}'}</code> <code>{'{{totale}}'}</code> <code>{'{{note_block}}'}</code>
                </div>
                <textarea
                  value={html}
                  onChange={e => setHtml(e.target.value)}
                  rows={22}
                  spellCheck={false}
                  style={{
                    ...inp, fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 12, resize: 'vertical', lineHeight: 1.5,
                    background: '#1e1e2e', color: '#cdd6f4', borderColor: '#444',
                  }}
                />
              </div>
            ) : (
              <div style={{
                marginTop: 12, border: '1px solid #ddd', borderRadius: 6,
                background: '#f0f0f0', padding: 20, overflowX: 'auto',
              }}>
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            )}
          </div>

          {error && (
            <div style={{ background: '#fff5f5', color: '#c00', padding: '8px 12px', borderRadius: 5, fontSize: 13 }}>
              {error}
            </div>
          )}

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

// ─── Componente principale ────────────────────────────────────────────────────

export default function TemplatesClient({ templates, disegnoTemplates, provvisorioTemplate }: { templates: Template[]; disegnoTemplates: DisegnoTemplate[]; provvisorioTemplate: ProvvisorioTemplate }) {
  const router = useRouter()
  const [editing, setEditing]                     = useState<Template | null | undefined>(undefined)
  const [editingDisegno, setEditingDisegno]         = useState<DisegnoTemplate | undefined>(undefined)
  const [editingProvvisorio, setEditingProvvisorio] = useState(false)
  const [delPending, startDel]          = useTransition()
  const [togPending, startTog]          = useTransition()

  function handleToggle(t: Template) {
    const fd = new FormData(); fd.set('id', String(t.id))
    startTog(async () => { await toggleAttivoTemplate(null, fd); router.refresh() })
  }

  function handleElimina(t: Template) {
    if (!confirm(`Eliminare il template "${t.nome}"?`)) return
    const fd = new FormData(); fd.set('id', String(t.id))
    startDel(async () => { await eliminaTemplate(null, fd); router.refresh() })
  }

  const thS: React.CSSProperties = {
    padding: '9px 14px', fontSize: 11, fontWeight: 600, color: '#888',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fafafa', borderBottom: '1px solid #e8e8e8',
  }
  const tdS: React.CSSProperties = {
    padding: '11px 14px', fontSize: 13, borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── Sezione Template Preventivo ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Template Preventivo<ShortcutStar href="/amministrazione/templates" small /></h2>
        </div>
      </div>

      {templates.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun template. Creane uno con "+ Nuovo template".</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={thS}>Nome</th>
                <th style={{ ...thS, width: 160, whiteSpace: 'nowrap' }}>Aggiornato</th>
                <th style={{ ...thS, width: 100, textAlign: 'right' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(t => (
                <tr key={t.id} style={{ background: t.attivo ? '#fff' : '#fafafa' }}>
                  <td style={{ ...tdS, fontWeight: 600 }}>
                    {t.nome}
                  </td>
                  <td style={{ ...tdS, color: '#888', fontSize: 12, whiteSpace: 'nowrap', width: 160 }}>{t.updated_at}</td>
                  <td style={{ ...tdS, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => setEditing(t)} className="btn-black">Modifica</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      </div>{/* fine sezione preventivo */}

      {/* ── Sezione Template Preventivo Provvisorio ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Template Preventivo Provvisorio</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={thS}>Nome</th>
                <th style={{ ...thS, width: 160, whiteSpace: 'nowrap' }}>Aggiornato</th>
                <th style={{ ...thS, width: 100, textAlign: 'right' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...tdS, fontWeight: 600 }}>Template Preventivo Provvisorio</td>
                <td style={{ ...tdS, color: '#888', fontSize: 12, whiteSpace: 'nowrap', width: 160 }}>{provvisorioTemplate.updated_at}</td>
                <td style={{ ...tdS, textAlign: 'right' }}>
                  <button onClick={() => setEditingProvvisorio(true)} className="btn-black">Modifica</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Sezione Template Disegno ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Template Disegno</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={thS}>Nome</th>
                <th style={{ ...thS, width: 160, whiteSpace: 'nowrap' }}>Aggiornato</th>
                <th style={{ ...thS, width: 100, textAlign: 'right' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {disegnoTemplates.map(t => (
                <tr key={t.tipo}>
                  <td style={{ ...tdS, fontWeight: 600 }}>{t.label}</td>
                  <td style={{ ...tdS, color: '#888', fontSize: 12, whiteSpace: 'nowrap', width: 160 }}>{t.updated_at}</td>
                  <td style={{ ...tdS, textAlign: 'right' }}>
                    <button onClick={() => setEditingDisegno(t)} className="btn-black">Modifica</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modali editor */}
      {editing !== undefined && (
        <TemplateEditor template={editing} onClose={() => setEditing(undefined)} />
      )}
      {editingDisegno !== undefined && (
        <DisegnoTemplateEditor template={editingDisegno} onClose={() => setEditingDisegno(undefined)} />
      )}
      {editingProvvisorio && (
        <ProvvisorioTemplateEditor template={provvisorioTemplate} onClose={() => setEditingProvvisorio(false)} />
      )}
    </div>
  )
}
