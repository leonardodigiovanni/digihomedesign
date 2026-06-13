'use client'

import { useState, useEffect, useMemo, useActionState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { creaAvviso, eliminaAvviso, cestinaAvviso, segnaLetti } from './actions'
import { b } from '@/lib/btn'

export type Avviso = {
  id: number
  cliente_id: number
  cliente_nome: string
  oggetto: string
  testo: string
  letto: number
  cestinato: number
  created_at: string
}

type ClienteOption = { id: number; label: string }

const inputStyle: React.CSSProperties = {
  border: '1px solid #ddd', borderRadius: 6, padding: '7px 10px',
  fontSize: 14, background: '#fff', width: '100%', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: 14, fontWeight: 600, color: '#666', textTransform: 'uppercase',
  letterSpacing: '0.05em', display: 'block', marginBottom: 4,
}
const thStyle: React.CSSProperties = {
  padding: '9px 12px', fontSize: 14, fontWeight: 600, color: '#888',
  textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
  background: '#fafafa', borderBottom: '1px solid #e8e8e8', whiteSpace: 'nowrap',
}
const tdStyle: React.CSSProperties = {
  padding: '10px 12px', fontSize: 14, color: '#333',
  borderBottom: '1px solid #222', verticalAlign: 'middle',
}

// ── Form nuovo avviso (staff) ──────────────────────────────────────────────

export function NuovoAvvisoForm({ clienti, isApp }: { clienti: ClienteOption[]; isApp?: boolean }) {
  const [state, action, pending] = useActionState(creaAvviso, {})
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    if (!pending && !state?.error) setResetKey(k => k + 1)
  }, [pending, state])

  return (
    <form key={resetKey} action={action} className="sfondo-riquadri-app" style={{
      border: '1px solid #222', borderRadius: 10,
      padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#222' }}>Nuovo avviso</div>
      {state?.error && (
        <div style={{ background: '#fff0f0', border: '1px solid #fcc', borderRadius: 6, padding: '8px 12px', fontSize: 14, color: '#c00' }}>
          {state.error}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Cliente *</label>
          <select name="cliente_id" required style={inputStyle}>
            <option value="">— seleziona —</option>
            <option value="all">📢 Tutti i clienti</option>
            {clienti.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Oggetto *</label>
          <input name="oggetto" required style={inputStyle} placeholder="Es. Preventivo pronto" />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Testo *</label>
        <textarea name="testo" required rows={3} style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Es. Le comunichiamo che il preventivo ufficiale è pronto." />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button type="submit" disabled={pending} className={b('btn-green', isApp)}
          style={{ padding: '0 24px', fontSize: 14, fontWeight: 600, border: 'none', cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.6 : 1 }}>
          {pending ? 'Invio…' : 'Invia avviso'}
        </button>
      </div>
    </form>
  )
}

// ── Tabella avvisi staff ───────────────────────────────────────────────────

export function AvvisiStaff({ avvisi, clienti, isApp }: { avvisi: Avviso[]; clienti: ClienteOption[]; isApp?: boolean }) {
  const [filtro, setFiltro] = useState('')
  const router   = useRouter()
  const hashRef  = useRef<string | null>(null)

  useEffect(() => {
    async function check() {
      try {
        const res  = await fetch('/api/avvisi/updates', { cache: 'no-store' })
        const data = await res.json() as { hash: string }
        if (hashRef.current !== null && data.hash !== hashRef.current) {
          router.refresh()
        }
        hashRef.current = data.hash
      } catch {}
    }
    check()
    const id = setInterval(check, 15_000)
    return () => clearInterval(id)
  }, [])

  const filtered = useMemo(() => {
    const q = filtro.trim().toLowerCase()
    return q ? avvisi.filter(a =>
      a.cliente_nome.toLowerCase().includes(q) ||
      a.oggetto.toLowerCase().includes(q) ||
      a.testo.toLowerCase().includes(q)
    ) : avvisi
  }, [avvisi, filtro])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        type="search"
        placeholder="Cerca per cliente, oggetto o testo…"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        style={{
          padding: '9px 12px', fontSize: 14, border: '1px solid #444',
          borderRadius: 8, fontFamily: 'inherit', background: '#f5f5f5',
          boxSizing: 'border-box', width: '100%',
        }}
      />

      {filtered.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun avviso.</p>
      ) : (
        <div className="sfondo-riquadri-app" style={{ overflowX: 'auto', border: '1px solid #222', borderRadius: '10px 10px 0 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="sfondo-riquadri-app">
                <th style={{ ...thStyle, minWidth: 90 }}>Cliente</th>
                <th style={{ ...thStyle, minWidth: 90 }}>Oggetto</th>
                <th style={{ ...thStyle, minWidth: 220 }}>Testo</th>
                <th style={{ ...thStyle, whiteSpace: 'nowrap' }}>Data</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Letto</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Cestinato</th>
                <th style={{ ...thStyle, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="sfondo-riquadri-app">
                  <td style={tdStyle}>{a.cliente_nome || '—'}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{a.oggetto}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'pre-wrap', fontSize: 14, color: '#555' }}>{a.testo}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{a.created_at}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: a.letto ? '#276749' : '#aaa' }}>{a.letto ? 'Sì' : 'No'}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: a.cestinato ? '#c00' : '#aaa' }}>{a.cestinato ? 'Sì' : 'No'}</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <button onClick={() => { if (confirm('Eliminare questo avviso?')) eliminaAvviso(a.id) }}
                      className={b('btn-red', isApp)}
                      style={{ padding: '0 14px', fontSize: 14, fontWeight: 600, border: 'none' }}>
                      Elimina
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Lista avvisi cliente ───────────────────────────────────────────────────

export function AvvisiCliente({ avvisi, isApp }: { avvisi: Avviso[]; isApp?: boolean }) {
  const [aperto, setAperto] = useState<Avviso | null>(null)
  const [letti, setLetti]   = useState<Set<number>>(() => new Set(avvisi.filter(a => a.letto).map(a => a.id)))
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => { setIsTouch(window.matchMedia('(pointer: coarse)').matches) }, [])

  async function apriAvviso(a: Avviso) {
    setAperto(a)
    if (!letti.has(a.id)) {
      setLetti(prev => new Set([...prev, a.id]))
      await segnaLetti([a.id])
      try {
        const res  = await fetch('/api/avvisi/unread', { cache: 'no-store' })
        const data = await res.json() as { count: number }
        window.dispatchEvent(new CustomEvent('avvisi-count-changed', { detail: { count: data.count } }))
      } catch {}
    }
  }

  if (avvisi.length === 0) return <p style={{ color: '#aaa', fontSize: 14 }}>Nessun avviso.</p>

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {avvisi.map(a => {
          const isLetto = letti.has(a.id)
          return (
            <div
              key={a.id}
              onClick={() => apriAvviso(a)}
              className={isLetto ? 'sfondo-riquadri-app' : undefined}
              style={{
                background: isLetto ? undefined : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#7a2810 0%,#bf5020 20%,#d97030 45%,#bf5020 80%,#7a2810 100%)',
                boxShadow: isLetto ? '0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.5)' : '0 4px 16px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.2)',
                border: isLetto ? '1px solid #222' : 'none',
                borderRadius: 8, padding: '0 14px', minHeight: 84,
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer',
              }}
            >
              {!isLetto && (
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', flexShrink: 0, display: 'inline-block' }} />
              )}
              <span style={{ flex: 1, fontSize: 14, fontWeight: isLetto ? 400 : 700, color: isLetto ? '#1a1a1a' : '#fff' }}>{a.oggetto}</span>
              <span style={{ fontSize: 14, color: isLetto ? '#777' : 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>{a.created_at}</span>
              <button
                onClick={e => { e.stopPropagation(); cestinaAvviso(a.id) }}
                className={`${b('btn-red', isApp)} btn-icon`}
                style={{ fontSize: 14, fontWeight: 600, border: 'none', flexShrink: 0 }}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>

      {/* Overlay fullscreen — clic/tocco ovunque per chiudere */}
      {aperto && (
        <div
          onClick={() => setAperto(null)}
          onTouchStart={() => setAperto(null)}
          style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 32 }}
        >
          {/* Oggetto + data — fissi in alto */}
          <div style={{ position: 'absolute', top: 20, left: 32, right: 32 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Oggetto:</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{aperto.oggetto}</span>
            </div>
            <span style={{ fontSize: 14, color: '#bbb' }}>{aperto.created_at}</span>
          </div>
          {/* Testo — centrato verticalmente e orizzontalmente */}
          <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#333', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{aperto.testo}</p>
          </div>
          <p style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', margin: 0, fontSize: 14, color: '#bbb', fontStyle: 'italic' }}>
            {isTouch ? 'Tocca per chiudere' : 'Clicca per chiudere'}
          </p>
        </div>
      )}
    </>
  )
}

