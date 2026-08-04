import { useEffect } from 'react'

/**
 * Come useEdgeAutoScroll, ma applicato a TUTTI gli elementi che corrispondono
 * a un selettore CSS (es. '.vetrina-foto-row'), invece di un singolo ref.
 * Pensato per essere montato una sola volta (es. nel layout root) e coprire
 * automaticamente ogni pagina che usa quella classe, presenti e future,
 * senza dover avvolgere ogni singolo contenitore con un componente dedicato.
 */
export function useEdgeAutoScrollForSelector(selector: string, options?: {
  axis?: 'x' | 'y'
  edgeZone?: number
  speedPxSec?: number
}) {
  const axis = options?.axis ?? 'x'
  const edgeZone = options?.edgeZone ?? 50
  const speedPxSec = options?.speedPxSec ?? 300

  useEffect(() => {
    let elements: HTMLElement[] = []
    const dirs = new Map<HTMLElement, 1 | -1 | 0>()
    let frame: number | null = null
    let lastTs: number | null = null

    function refresh() {
      elements = Array.from(document.querySelectorAll<HTMLElement>(selector))
    }
    refresh()

    // Ricalcola l'elenco quando il DOM cambia (nuova pagina, contenuto caricato dopo il mount)
    const mo = new MutationObserver(refresh)
    mo.observe(document.body, { childList: true, subtree: true })

    function tick(ts: number) {
      const elapsedSec = lastTs != null ? (ts - lastTs) / 1000 : 0
      lastTs = ts
      let any = false
      for (const el of elements) {
        const dir = dirs.get(el) ?? 0
        if (dir !== 0) {
          const delta = dir * speedPxSec * elapsedSec
          if (axis === 'x') el.scrollLeft += delta
          else el.scrollTop += delta
          any = true
        }
      }
      if (any) {
        frame = requestAnimationFrame(tick)
      } else {
        lastTs = null
        frame = null
      }
    }

    function ensureLoop() {
      if (frame == null) frame = requestAnimationFrame(tick)
    }

    function onMouseMove(e: MouseEvent) {
      let active = false
      let topEl: Element | null = null
      let topElChecked = false
      for (const el of elements) {
        const rect = el.getBoundingClientRect()
        let dir: 1 | -1 | 0 = 0
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
        // Ignora se il punto è coperto da un altro elemento (es. una tendina
        // aperta sopra): calcolato una sola volta per evento, solo se serve.
        if (dir !== 0) {
          if (!topElChecked) { topEl = document.elementFromPoint(e.clientX, e.clientY); topElChecked = true }
          if (!topEl || !el.contains(topEl)) dir = 0
        }
        dirs.set(el, dir)
        if (dir !== 0) active = true
      }
      if (active) ensureLoop()
    }

    function stop() {
      for (const el of elements) dirs.set(el, 0)
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', stop)
    return () => {
      mo.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', stop)
      if (frame != null) cancelAnimationFrame(frame)
    }
  }, [selector, axis, edgeZone, speedPxSec])
}
