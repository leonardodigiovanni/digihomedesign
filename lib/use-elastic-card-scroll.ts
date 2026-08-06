import { useCallback, useRef } from 'react'

interface ElasticCardScrollOptions {
  /** Larghezza "ideale" della card (px) — quella usata oggi come fissa. */
  targetWidth: number
  /** Gap tra le card in px — deve combaciare col gap CSS reale del flex container. */
  gap: number
  /** Margine di elasticità attorno a targetWidth, come frazione (0.15 = ±15%). */
  tolerance?: number
  /** Silenzio scroll (ms) prima di scattare lo snap. */
  settleMs?: number
  /** Nome della CSS custom property scritta sul container con la larghezza calcolata. */
  varName?: string
  /**
   * Larghezza (px) della fascia ai bordi dove un click/tap NON attiva il link
   * sottostante ma fa scorrere di una card in quella direzione (nessun effetto se
   * quel bordo non ha più nulla da mostrare). Deve combaciare col `fadePx` passato
   * a useScrollEdgeMask nello stesso componente, così la zona "clic per avanzare"
   * coincide visivamente con quella sbiadita. Non passato = comportamento disattivato.
   */
  edgeClickZone?: number
}

/**
 * Applica a un contenitore scrollabile orizzontale (flex, overflow-x:auto) due
 * comportamenti pensati per riquadri di larghezza omogenea ("card"):
 *
 * 1. Larghezza elastica a numero intero: calcola quante card (N, intero) entrano
 *    nella larghezza disponibile restando il più vicino possibile a `targetWidth`,
 *    poi ridistribuisce lo spazio esatto su quelle N card (mai una card parziale
 *    ai bordi). Se anche una sola card supererebbe lo schermo, quella singola card
 *    viene ridotta a riempire esattamente lo schermo. Il risultato è scritto come
 *    CSS custom property sul container (default `--card-w`), letta dalla regola
 *    CSS della card al posto di un valore fisso. Ricalcolato ad ogni resize del
 *    container via ResizeObserver.
 *
 * 2. Snap dopo l'azione: lo scroll resta libero (dito, barra, hover-frecce) — solo
 *    dopo `settleMs` di silenzio sugli eventi 'scroll' (quindi anche dopo lo
 *    scroll-momentum del touch, non solo dopo il rilascio) arrotonda la posizione
 *    al multiplo più vicino di (cardWidth + gap) — equivalente a "centra la card
 *    più visibile, butta fuori quella minoritaria" — e ci scrolla con transizione
 *    smooth. In fondo alla corsa lo scroll è già bloccato dal browser al limite,
 *    quindi in pratica non scatta nessuna transizione aggiuntiva.
 *
 * 3. Click nella fascia ai bordi = avanza di una card (opzionale, `edgeClickZone`):
 *    un click/tap dentro quella fascia non attiva il link della card sotto, scorre
 *    invece di un cardStride nella direzione di quel bordo (o niente, se il bordo
 *    non ha più nulla da mostrare). Fuori da quella fascia il click passa normale.
 *
 * Riusabile: stesso hook pensato anche per le CTA (components/hero-cta-scroll.tsx),
 * non solo per le card home.
 */
export function useElasticCardScroll<T extends HTMLElement>(options: ElasticCardScrollOptions) {
  const { targetWidth, gap, tolerance = 0.15, settleMs = 200, varName = '--card-w', edgeClickZone } = options
  const cleanupRef = useRef<(() => void) | null>(null)
  const cardStrideRef = useRef(targetWidth + gap)

  const ref = useCallback((el: T | null) => {
    cleanupRef.current?.()
    cleanupRef.current = null
    if (!el) return

    let settleTimer: ReturnType<typeof setTimeout> | null = null

    function scheduleSnap() {
      if (settleTimer) clearTimeout(settleTimer)
      settleTimer = setTimeout(() => {
        settleTimer = null
        const stride = cardStrideRef.current
        if (!el || stride <= 0) return
        const maxScroll = el.scrollWidth - el.clientWidth
        const target = Math.min(maxScroll, Math.max(0, Math.round(el.scrollLeft / stride) * stride))
        if (Math.abs(target - el.scrollLeft) > 0.5) {
          el.scrollTo({ left: target, behavior: 'smooth' })
        }
      }, settleMs)
    }

    function computeWidth() {
      // clientWidth include il padding orizzontale del container: le card, flex
      // children dentro quel padding, hanno davvero a disposizione solo lo spazio
      // che resta dopo averlo sottratto — altrimenti ogni card risulta di quel
      // tanto più larga dello schermo (visibile soprattutto con N=1: a fine corsa
      // resta un residuo di scroll di pochi px, freccia/fade non spariscono mai).
      const style = window.getComputedStyle(el!)
      const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
      const containerWidth = el!.clientWidth - paddingX
      if (containerWidth <= 0) return

      const minW = targetWidth * (1 - tolerance)
      const maxW = targetWidth * (1 + tolerance)

      let N = Math.max(1, Math.round((containerWidth + gap) / (targetWidth + gap)))
      let cardWidth = (containerWidth - (N - 1) * gap) / N

      if (cardWidth < minW || cardWidth > maxW) {
        for (const n of [N - 1, N + 1]) {
          if (n < 1) continue
          const w = (containerWidth - (n - 1) * gap) / n
          if (w >= minW && w <= maxW) { N = n; cardWidth = w; break }
        }
      }

      // Schermo più piccolo della card minima consentita: una sola card riempie
      // esattamente lo schermo (nessun gap da sottrarre, N=1).
      if (N === 1 && (cardWidth > containerWidth || cardWidth < minW)) {
        cardWidth = containerWidth
      }

      cardStrideRef.current = cardWidth + gap
      el!.style.setProperty(varName, `${cardWidth}px`)
      // Il resize non genera un evento 'scroll': senza questo, cambiare la larghezza
      // delle card (es. allargando la finestra del browser) lasciava lo scrollLeft
      // com'era, mostrando uno spicchio di card adiacente invece di riallinearsi.
      scheduleSnap()
    }

    computeWidth()
    const ro = new ResizeObserver(computeWidth)
    ro.observe(el)

    el.addEventListener('scroll', scheduleSnap, { passive: true })

    function onClickCapture(e: MouseEvent) {
      if (!edgeClickZone || !el) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const stride = cardStrideRef.current
      const maxScroll = el.scrollWidth - el.clientWidth

      if (x < edgeClickZone && el.scrollLeft > 0) {
        e.preventDefault()
        e.stopPropagation()
        el.scrollTo({ left: Math.max(0, el.scrollLeft - stride), behavior: 'smooth' })
      } else if (x > rect.width - edgeClickZone && el.scrollLeft < maxScroll) {
        e.preventDefault()
        e.stopPropagation()
        el.scrollTo({ left: Math.min(maxScroll, el.scrollLeft + stride), behavior: 'smooth' })
      }
    }

    if (edgeClickZone) el.addEventListener('click', onClickCapture, { capture: true })

    cleanupRef.current = () => {
      ro.disconnect()
      el.removeEventListener('scroll', scheduleSnap)
      el.removeEventListener('click', onClickCapture, { capture: true })
      if (settleTimer) clearTimeout(settleTimer)
    }
  }, [targetWidth, gap, tolerance, settleMs, varName, edgeClickZone])

  return ref
}
