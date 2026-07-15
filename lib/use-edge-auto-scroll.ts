import { useEffect, useRef } from 'react'

/**
 * Quando il mouse è vicino al bordo (o esce) del div collegato al ref restituito,
 * scrolla in automatico verso quel bordo finché il mouse non rientra verso il centro.
 * Stesso comportamento della griglia listini, generalizzato per riuso su qualsiasi
 * contenitore scrollabile (orizzontale o verticale).
 */
export function useEdgeAutoScroll<T extends HTMLElement>(options?: {
  axis?: 'x' | 'y'
  edgeZone?: number
  speedPxSec?: number
}) {
  const axis = options?.axis ?? 'x'
  const edgeZone = options?.edgeZone ?? 50
  const speedPxSec = options?.speedPxSec ?? 300

  const ref = useRef<T>(null)
  const dirRef = useRef<0 | 1 | -1>(0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    let lastTs: number | null = null

    function tick(ts: number) {
      const el = ref.current
      if (dirRef.current !== 0 && el) {
        const elapsedSec = lastTs != null ? (ts - lastTs) / 1000 : 0
        lastTs = ts
        const delta = dirRef.current * speedPxSec * elapsedSec
        if (axis === 'x') el.scrollLeft += delta
        else el.scrollTop += delta
        frameRef.current = requestAnimationFrame(tick)
      } else {
        lastTs = null
        frameRef.current = null
      }
    }

    function ensureLoop() {
      if (frameRef.current == null) frameRef.current = requestAnimationFrame(tick)
    }

    function onMouseMove(e: MouseEvent) {
      const el = ref.current
      if (!el) { dirRef.current = 0; return }
      const rect = el.getBoundingClientRect()

      if (axis === 'x') {
        if (e.clientY < rect.top || e.clientY > rect.bottom) { dirRef.current = 0; return }
        if (e.clientX < rect.left + edgeZone) { dirRef.current = -1; ensureLoop() }
        else if (e.clientX > rect.right - edgeZone) { dirRef.current = 1; ensureLoop() }
        else dirRef.current = 0
      } else {
        if (e.clientX < rect.left || e.clientX > rect.right) { dirRef.current = 0; return }
        if (e.clientY < rect.top + edgeZone) { dirRef.current = -1; ensureLoop() }
        else if (e.clientY > rect.bottom - edgeZone) { dirRef.current = 1; ensureLoop() }
        else dirRef.current = 0
      }
    }

    function stop() { dirRef.current = 0 }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', stop)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', stop)
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current)
    }
  }, [axis, edgeZone, speedPxSec])

  return ref
}
