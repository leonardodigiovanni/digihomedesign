'use client'

import { useRef, useEffect, type CSSProperties } from 'react'
import { useSiteSearchAnchor } from '@/components/site-search-provider'

export default function SiteSearchButton({ className, style }: { className?: string; style?: CSSProperties }) {
  const { open, toggle, registerAnchor } = useSiteSearchAnchor()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerAnchor(ref.current)
  }, [registerAnchor])

  return (
    <div ref={ref} className={className} style={{ position: 'relative', display: 'flex', alignItems: 'center', ...style }}>
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? 'Chiudi ricerca' : 'Cerca nel sito'}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 30, height: 30, borderRadius: '50%', border: 'none',
          background: 'transparent', color: '#fff', cursor: 'pointer', flexShrink: 0,
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.2" y2="16.2" />
        </svg>
      </button>
    </div>
  )
}
