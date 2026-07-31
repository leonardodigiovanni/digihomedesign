import { useEffect } from 'react'
import { attachScrollArrows } from './scroll-edge-arrows'

function computeMask(el: HTMLElement, fadePx: number, arrows: ReturnType<typeof attachScrollArrows>) {
  const maxScroll = el.scrollWidth - el.clientWidth
  const fadeLeft  = maxScroll > 1 && el.scrollLeft > 1
  const fadeRight = maxScroll > 1 && el.scrollLeft < maxScroll - 1

  let mask = 'none'
  if (fadeLeft && fadeRight) {
    mask = `linear-gradient(to right, transparent 0, #000 ${fadePx}px, #000 calc(100% - ${fadePx}px), transparent 100%)`
  } else if (fadeRight) {
    mask = `linear-gradient(to right, #000 0, #000 calc(100% - ${fadePx}px), transparent 100%)`
  } else if (fadeLeft) {
    mask = `linear-gradient(to right, transparent 0, #000 ${fadePx}px, #000 100%)`
  }
  el.style.maskImage = mask
  el.style.setProperty('-webkit-mask-image', mask)
  arrows.setVisible(fadeLeft, fadeRight)
}

/**
 * Come useScrollEdgeMask (lib/use-scroll-edge-mask.ts), ma applicato a TUTTI
 * gli elementi che corrispondono a un selettore CSS, montato una sola volta
 * (es. nel layout root). Stesso principio di useEdgeAutoScrollForSelector:
 * ricalcola l'elenco quando il DOM cambia, così copre ogni pagina — presente
 * o futura — che usa quella classe, senza avvolgere ogni contenitore.
 */
export function useScrollEdgeMaskForSelector(selector: string, fadePx = 40) {
  useEffect(() => {
    const cleanups = new Map<HTMLElement, () => void>()

    function attach(el: HTMLElement) {
      const arrows = attachScrollArrows(el)
      const update = () => computeMask(el, fadePx, arrows)
      update()
      el.addEventListener('scroll', update, { passive: true })
      const ro = new ResizeObserver(update)
      ro.observe(el)
      cleanups.set(el, () => {
        el.removeEventListener('scroll', update)
        ro.disconnect()
        arrows.cleanup()
      })
    }

    function detach(el: HTMLElement) {
      cleanups.get(el)?.()
      cleanups.delete(el)
    }

    function refresh() {
      const current = new Set(document.querySelectorAll<HTMLElement>(selector))
      for (const el of cleanups.keys()) if (!current.has(el)) detach(el)
      for (const el of current) if (!cleanups.has(el)) attach(el)
    }

    refresh()
    const mo = new MutationObserver(refresh)
    mo.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('resize', refresh)

    return () => {
      mo.disconnect()
      window.removeEventListener('resize', refresh)
      for (const el of Array.from(cleanups.keys())) detach(el)
    }
  }, [selector, fadePx])
}
