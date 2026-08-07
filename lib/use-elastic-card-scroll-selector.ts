import { useEffect } from 'react'
import { attachElasticCardScroll, type ElasticCardScrollOptions } from './use-elastic-card-scroll'

/**
 * Come useElasticCardScroll (lib/use-elastic-card-scroll.ts), ma applicato a TUTTI
 * gli elementi che corrispondono a un selettore CSS (es. '.vetrina-foto-row'),
 * invece di un singolo ref. Pensato per essere montato una sola volta (es. nel
 * layout root, come già fa components/vetrina-auto-scroll.tsx per fade/arrows e
 * auto-scroll ai bordi) e coprire automaticamente ogni pagina — presente o futura —
 * che usa quella classe, senza dover avvolgere ogni contenitore con un componente
 * dedicato. Stesso principio di useEdgeAutoScrollForSelector/useScrollEdgeMaskForSelector.
 */
export function useElasticCardScrollForSelector(selector: string, options: ElasticCardScrollOptions) {
  const { targetWidth, gap, tolerance, settleMs, varName, edgeClickZone } = options

  useEffect(() => {
    const cleanups = new Map<HTMLElement, () => void>()

    function attach(el: HTMLElement) {
      cleanups.set(el, attachElasticCardScroll(el, { targetWidth, gap, tolerance, settleMs, varName, edgeClickZone }))
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
  }, [selector, targetWidth, gap, tolerance, settleMs, varName, edgeClickZone])
}
