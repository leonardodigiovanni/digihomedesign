'use client'

import { useEdgeAutoScroll } from '@/lib/use-edge-auto-scroll'

export default function HeroCardsScroll({ children }: { children: React.ReactNode }) {
  const ref = useEdgeAutoScroll<HTMLDivElement>({ axis: 'x' })
  return (
    <div
      ref={ref}
      className="home-hero-cards"
      style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '8px 4px', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
