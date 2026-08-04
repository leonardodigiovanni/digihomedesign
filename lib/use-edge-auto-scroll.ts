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

      let dir: 0 | 1 | -1 = 0
      if (axis === 'x') {
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          if (e.clientX < rect.left + edgeZone) dir = -1
          else if (e.clientX > rect.right - edgeZone) dir = 1
        }
      } else {
        if (e.clientX >= rect.left && e.clientX <= rect.right) {
          if (e.clientY < rect.top + edgeZone) dir = -1
          else if (e.clientY > rect.bottom - edgeZone) dir = 1
        }
      }

      // Ignora se il punto è coperto da un altro elemento (es. una tendina aperta
      // sopra): la geometria da sola non basta, altrimenti lo scroll scatta anche
      // sotto contenuto sovrapposto e invisibile in quel punto.
      if (dir !== 0) {
        const topEl = document.elementFromPoint(e.clientX, e.clientY)
        if (!topEl || !el.contains(topEl)) dir = 0
      }

      dirRef.current = dir
      if (dir !== 0) ensureLoop()
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
