'use client'

import React, { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { salvaTemplate, toggleAttivoTemplate, eliminaTemplate, type MutResult } from './actions'

export type Template = {
  id: number
  nome: string
  html: string
  attivo: number
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
            <input value={nome} onChange={e => setNome(e.target.value)} style={inp} placeholder="Es. Template standard" />
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
            <button onClick={onClose} style={{
              padding: '8px 20px', fontSize: 13, border: '1px solid #ccc',
              borderRadius: 6, background: '#f5f5f5', cursor: 'pointer',
            }}>Annulla</button>
            <button onClick={handleSave} disabled={pending} style={{
              padding: '8px 22px', fontSize: 13, fontWeight: 700, borderRadius: 6,
              background: pending ? '#aaa' : '#1a6e3b', color: '#fff',
              border: 'none', cursor: pending ? 'not-allowed' : 'pointer',
            }}>
              {pending ? 'Salvataggio…' : '✓ Salva template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function TemplatesClient({ templates }: { templates: Template[] }) {
  const router = useRouter()
  const [editing, setEditing]   = useState<Template | null | undefined>(undefined)
  const [delPending, startDel]  = useTransition()
  const [togPending, startTog]  = useTransition()

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Template Preventivi</h2>
          <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>
            Template HTML per la generazione dei PDF. Il primo template attivo viene usato.
          </p>
        </div>
        <button onClick={() => setEditing(null)} style={{
          padding: '9px 22px', fontSize: 13, fontWeight: 700, borderRadius: 6,
          background: '#1a6e3b', color: '#fff', border: 'none', cursor: 'pointer',
        }}>
          + Nuovo template
        </button>
      </div>

      {templates.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun template. Creane uno con "+ Nuovo template".</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8 }}>
            <thead>
              <tr>
                <th style={thS}>Nome</th>
                <th style={{ ...thS, textAlign: 'center' }}>Stato</th>
                <th style={thS}>Aggiornato</th>
                <th style={{ ...thS, textAlign: 'right' }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(t => (
                <tr key={t.id} style={{ background: t.attivo ? '#fff' : '#fafafa' }}>
                  <td style={{ ...tdS, fontWeight: 600 }}>
                    {t.nome}
                    {t.attivo === 1 && (
                      <span style={{
                        marginLeft: 10, fontSize: 10, fontWeight: 700, background: '#1a4a8a',
                        color: '#fff', padding: '2px 7px', borderRadius: 3,
                      }}>USATO</span>
                    )}
                  </td>
                  <td style={{ ...tdS, textAlign: 'center' }}>
                    <button onClick={() => handleToggle(t)} disabled={togPending} style={{
                      padding: '3px 12px', fontSize: 11, fontWeight: 700, borderRadius: 3,
                      border: 'none', cursor: 'pointer',
                      background: t.attivo ? '#1a6e3b' : '#aaa', color: '#fff',
                    }}>
                      {t.attivo ? 'Attivo' : 'Inattivo'}
                    </button>
                  </td>
                  <td style={{ ...tdS, color: '#888', fontSize: 12, whiteSpace: 'nowrap' }}>{t.updated_at}</td>
                  <td style={{ ...tdS, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => setEditing(t)} style={{
                        padding: '5px 14px', fontSize: 12, fontWeight: 600, borderRadius: 4,
                        background: '#1a4a8a', color: '#fff', border: 'none', cursor: 'pointer',
                      }}>Modifica</button>
                      <button onClick={() => handleElimina(t)} disabled={delPending} style={{
                        padding: '5px 12px', fontSize: 12, fontWeight: 600, borderRadius: 4,
                        background: '#c00', color: '#fff', border: 'none', cursor: 'pointer',
                      }}>Elimina</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale editor */}
      {editing !== undefined && (
        <TemplateEditor template={editing} onClose={() => setEditing(undefined)} />
      )}
    </div>
  )
}
