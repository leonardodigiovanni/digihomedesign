'use client'

import type { Cantiere } from '@/app/area-lavoro/cantieri/cantieri-client'

export default function ApriCantiereBtn({ cantiere, onSelect }: { cantiere: Cantiere; onSelect: (c: Cantiere) => void }) {
  const style: React.CSSProperties = {
    height: 42,
    padding: '0 24px',
    borderRadius: 21,
    border: 'none',
    fontSize: 14,
    fontWeight: 400,
    fontFamily: 'monospace',
    cursor: 'pointer',
    background: `repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 6px),
                 linear-gradient(135deg, #7a5c00 0%, #c8960c 20%, #e8b94a 45%, #c8960c 80%, #7a5c00 100%)`,
    color: '#1a1a1a',
    boxShadow: '0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(cantiere)}
      style={style}
    >
      {cantiere.titolo}
    </button>
  )
}
