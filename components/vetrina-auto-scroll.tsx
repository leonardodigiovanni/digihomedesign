'use client'

import { useEdgeAutoScrollForSelector } from '@/lib/use-edge-auto-scroll-selector'
import { useScrollEdgeMaskForSelector } from '@/lib/use-scroll-edge-mask-selector'
import { useElasticCardScrollForSelector } from '@/lib/use-elastic-card-scroll-selector'

export default function VetrinaAutoScroll() {
  useEdgeAutoScrollForSelector('.vetrina-foto-row', { axis: 'x' })
  useScrollEdgeMaskForSelector('.vetrina-foto-row', 40)
  useElasticCardScrollForSelector('.vetrina-foto-row', { targetWidth: 300, gap: 8, edgeClickZone: 40 })
  useEdgeAutoScrollForSelector('.filtri-scroll-row', { axis: 'x' })
  useScrollEdgeMaskForSelector('.filtri-scroll-row', 40)
  useEdgeAutoScrollForSelector('.sitemap-scroll', { axis: 'x' })
  useScrollEdgeMaskForSelector('.sitemap-scroll', 40)
  return null
}
