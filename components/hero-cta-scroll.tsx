'use client'

import { useEdgeAutoScroll } from '@/lib/use-edge-auto-scroll'

export default function HeroCtaScroll({ children }: { children: React.ReactNode }) {
  const ref = useEdgeAutoScroll<HTMLDivElement>({ axis: 'x' })
  return (
    <div ref={ref} className="home-hero-cta">
      {children}
    </div>
  )
}
