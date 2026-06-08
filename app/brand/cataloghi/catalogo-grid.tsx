'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { CategoriaCard } from './page'

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 42,
  background: [
    'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px)',
    'linear-gradient(135deg,#7a5c00 0%,#c8960c 20%,#e8b94a 45%,#c8960c 80%,#7a5c00 100%)',
  ].join(','),
  boxShadow: '0 4px 16px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.25)',
  border: 'none',
  borderRadius: 9999,
  textDecoration: 'none',
  color: '#1a1a1a',
  fontWeight: 400,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  transition: 'filter 0.15s',
  fontSize: 14,
  fontFamily: 'monospace',
}

export function CatalogoGrid({ categorie, basePath = '/brand/cataloghi' }: { categorie: CategoriaCard[]; basePath?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [cols, setCols] = useState(2)

  useEffect(() => {
    const compute = () => {
      const container = ref.current
      if (!container || categorie.length === 0) return
      const W = container.offsetWidth
      const longestName = categorie.reduce((a, b) => a.nome.length >= b.nome.length ? a : b).nome
      const span = document.createElement('span')
      span.style.cssText = 'position:fixed;top:-9999px;left:-9999px;font-family:monospace;font-size:14px;white-space:nowrap;padding:0 20px'
      span.textContent = longestName
      document.body.appendChild(span)
      const minW = span.offsetWidth
      document.body.removeChild(span)
      const gap = 8
      setCols(Math.max(1, Math.floor((W + gap) / (minW + gap))))
    }
    compute()
    const ro = new ResizeObserver(compute)
    if (ref.current) ro.observe(ref.current)
    return () => ro.disconnect()
  }, [categorie])

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12, marginBottom: 12, padding: '0 4px' }}>
      {categorie.map(c => (
        <Link key={c.id} href={`${basePath}/${c.slug}`} style={CARD_STYLE}>
          {c.nome}
        </Link>
      ))}
    </div>
  )
}
