import { useCallback, useRef } from 'react'
import { attachScrollArrows } from './scroll-edge-arrows'

/**
 * Applica una maschera di sfumatura (mask-image) ai bordi di un contenitore
 * scrollabile orizzontalmente, ma SOLO sul lato in cui esiste altro contenuto
 * da scrollare. Se si è già all'inizio, niente fade a sinistra; se si è alla
 * fine, niente fade a destra; se il contenuto non scrolla affatto, niente fade.
 *
 * Implementato come callback ref (non useRef+useEffect con deps fisse):
 * se l'elemento viene montato più tardi rispetto al primo render del
 * componente chiamante (es. reso visibile solo quando arriva un contenuto
 * async, come la sticky-bottom-bar), un useEffect con deps fisse non si
 * riattiverebbe mai e il fade resterebbe sempre spento. La callback ref
 * invece si riesegue ogni volta che l'elemento compare/scompare.
 */
export function useScrollEdgeMask<T extends HTMLElement>(fadePx = 40) {
  const cleanupRef = useRef<(() => void) | null>(null)

  const ref = useCallback((el: T | null) => {
    cleanupRef.current?.()
    cleanupRef.current = null
    if (!el) return

    const arrows = attachScrollArrows(el)

    function update() {
      if (!el) return
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

    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)

    cleanupRef.current = () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
      window.removeEventListener('resize', update)
      arrows.cleanup()
    }
  }, [fadePx])

  return ref
}
