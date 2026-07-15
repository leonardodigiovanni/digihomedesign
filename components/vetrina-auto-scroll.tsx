'use client'

import { useEdgeAutoScrollForSelector } from '@/lib/use-edge-auto-scroll-selector'

export default function VetrinaAutoScroll() {
  useEdgeAutoScrollForSelector('.vetrina-foto-row', { axis: 'x' })
  return null
}
