'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { CategoriaCard } from './page'
import { b } from '@/lib/btn'

export function CatalogoGrid({ categorie, basePath = '/chi-siamo/cataloghi', isApp }: { categorie: CategoriaCard[]; basePath?: string; isApp?: boolean }) {
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
        <Link key={c.id} href={`${basePath}/${c.slug}`} className={b('btn-gold', isApp)}
          style={{ display: 'flex' }}>
          {c.nome}
        </Link>
      ))}
    </div>
  )
}
