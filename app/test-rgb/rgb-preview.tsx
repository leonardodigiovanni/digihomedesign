'use client'

import { useState } from 'react'
import { rgbGradient, rgbBrushedBackground, rgbBoxShadow, rgbBorderColor } from '@/lib/bg-utils'

export default function RgbPreview() {
  const [r, setR] = useState(70)
  const [g, setG] = useState(130)
  const [b, setB] = useState(180)

  const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
  const gradA  = rgbGradient(r, g, b)
  const gradC  = rgbBrushedBackground(r, g, b)
  const shadow = rgbBoxShadow(r, g, b)
  const border = rgbBorderColor(r, g, b)

  return (
    <>
      {/* Color picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="color" value={hex} onChange={e => {
            const h = e.target.value
            setR(parseInt(h.slice(1,3),16))
            setG(parseInt(h.slice(3,5),16))
            setB(parseInt(h.slice(5,7),16))
          }} style={{ width: 48, height: 48, border: 'none', cursor: 'pointer', borderRadius: 8 }} />
          <span style={{ fontFamily: 'monospace', fontSize: 14, minWidth: 222, display: 'inline-block' }}>{hex.toUpperCase()} — rgb({r},{g},{b})</span>
        </div>
        {[
          { label: 'R', val: r, set: setR },
          { label: 'G', val: g, set: setG },
          { label: 'B', val: b, set: setB },
        ].map(({ label, val, set }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>{label} — {val}</span>
            <input type="range" min={0} max={255} value={val}
              onChange={e => set(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </div>

      {/* A */}
      <section style={{ marginBottom: 36 }}>
        <p style={{ marginBottom: 10, fontWeight: 600, fontSize: 15 }}>A — Gradiente RGB statico</p>
        <div style={{ height: 150, borderRadius: 12, border: `1px solid ${border}`, background: gradA, boxShadow: shadow }} />
        <code style={{ fontSize: 12, color: '#888', marginTop: 6, display: 'block' }}>
          {'className="rgb_a" (salva il colore in Settings)'}
        </code>
      </section>

      {/* B */}
      <section style={{ marginBottom: 36 }}>
        <p style={{ marginBottom: 10, fontWeight: 600, fontSize: 15 }}>B — RGB con shimmer animato</p>
        <div style={{ height: 150, borderRadius: 12, border: `1px solid ${border}`, background: gradA, boxShadow: shadow, position: 'relative', overflow: 'hidden' }}>
          <div className="gold-shimmer-wrap" />
        </div>
        <code style={{ fontSize: 12, color: '#888', marginTop: 6, display: 'block' }}>
          {'className="rgb_b"'}
        </code>
      </section>

      {/* C */}
      <section style={{ marginBottom: 36 }}>
        <p style={{ marginBottom: 10, fontWeight: 600, fontSize: 15 }}>C — RGB spazzolato + riflesso radiale + shimmer</p>
        <div style={{ height: 150, borderRadius: 12, border: `1px solid ${border}`, background: gradC, boxShadow: shadow, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.35) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
          <div className="gold-shimmer-wrap" />
        </div>
        <code style={{ fontSize: 12, color: '#888', marginTop: 6, display: 'block' }}>
          {'className="rgb_c"'}
        </code>
      </section>
    </>
  )
}
