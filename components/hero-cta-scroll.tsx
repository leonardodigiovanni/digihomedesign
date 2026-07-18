'use client'

import { useEdgeAutoScroll } from '@/lib/use-edge-auto-scroll'
import { useScrollEdgeMask } from '@/lib/use-scroll-edge-mask'
import { mergeRefs } from '@/lib/merge-refs'

export default function HeroCtaScroll({ children }: { children: React.ReactNode }) {
  const autoScrollRef = useEdgeAutoScroll<HTMLDivElement>({ axis: 'x' })
  const maskRef = useScrollEdgeMask<HTMLDivElement>(40)
  return (
    <div ref={mergeRefs(autoScrollRef, maskRef)} className="home-hero-cta">
      {children}
    </div>
  )
}
