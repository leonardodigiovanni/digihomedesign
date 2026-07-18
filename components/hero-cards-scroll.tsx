'use client'

import { useEdgeAutoScroll } from '@/lib/use-edge-auto-scroll'
import { useScrollEdgeMask } from '@/lib/use-scroll-edge-mask'
import { mergeRefs } from '@/lib/merge-refs'

export default function HeroCardsScroll({ children }: { children: React.ReactNode }) {
  const autoScrollRef = useEdgeAutoScroll<HTMLDivElement>({ axis: 'x' })
  const maskRef = useScrollEdgeMask<HTMLDivElement>(40)
  return (
    <div
      ref={mergeRefs(autoScrollRef, maskRef)}
      className="home-hero-cards"
      style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '8px 4px', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
