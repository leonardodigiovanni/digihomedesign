'use client'

import { useState } from 'react'

const PuntinaSvg = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
  </svg>
)

export default function InfoCard({ titolo, corpo }: { titolo: string; corpo: string }) {
  const [aperto, setAperto] = useState(false)

  return (
    <div className="sfondo-riquadri-app" style={{ border: '1px solid #222', borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.5)' }}>
      <button
        onClick={() => setAperto(a => !a)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, width: '100%',
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          <PuntinaSvg />
          {titolo}
        </span>
        <span style={{
          fontSize: 15, color: '#888', transition: 'transform 0.2s',
          transform: aperto ? 'rotate(180deg)' : 'rotate(0deg)',
          display: 'inline-block',
        }}>▾</span>
      </button>
      {aperto && (
        <p className="app-card-body" style={{ marginTop: 8 }}>
          {corpo}
        </p>
      )}
    </div>
  )
}
