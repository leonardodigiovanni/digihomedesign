'use client'

import { useEffect, useRef, useState } from 'react'
import { useEdgeAutoScroll } from '@/lib/use-edge-auto-scroll'
import { useScrollEdgeMask } from '@/lib/use-scroll-edge-mask'
import { mergeRefs } from '@/lib/merge-refs'

type MiniCard = { el: HTMLElement; src: string; label: string }

const THUMB_W = 64
const THUMB_H = 40
const GAP = 8
const SLOT = THUMB_W + GAP

export default function HeroCardsScroll({ children }: { children: React.ReactNode }) {
  const autoScrollRef = useEdgeAutoScroll<HTMLDivElement>({ axis: 'x' })
  const maskRef = useScrollEdgeMask<HTMLDivElement>(40)
  const containerRef = useRef<HTMLDivElement>(null)
  const [minis, setMinis] = useState<MiniCard[]>([])
  const [visibleCount, setVisibleCount] = useState(0)
  const [windowStart, setWindowStart] = useState(0)
  // Posizione/estensione dello scroll reale, in "coordinate contenuto" (px, non
  // scalate) — da qui si ricava sia la finestra di miniature sia il rettangolo,
  // che rappresenta esattamente (in scala) la porzione visibile, comprese le
  // percentuali parziali sulle card ai bordi (es. 20% + 100% + 50%).
  const [scroll, setScroll] = useState({ left: 0, clientWidth: 0 })

  // Legge dal DOM le card .page-card effettivamente renderizzate dopo il mount
  // (anche quelle fuori schermo). .src (non .currentSrc) perché le immagini
  // offscreen sono lazy-load e currentSrc resterebbe vuoto finché non caricate.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const cards = Array.from(container.querySelectorAll<HTMLElement>(':scope > .page-card'))
    setMinis(cards.map(el => ({
      el,
      src: el.querySelector('img')?.src ?? '',
      label: el.querySelector('.testo-articoli')?.textContent ?? '',
    })))
  }, [children])

  // Scroll/estensione reali della riga principale + quante miniature entrano
  // nello spazio disponibile (calcolato sulla larghezza della riga stessa,
  // non della mini-mappa — la mini-mappa si dimensiona sul proprio contenuto).
  useEffect(() => {
    const container = containerRef.current
    if (!container || minis.length === 0) return

    function update() {
      if (!container) return
      setScroll({ left: container.scrollLeft, clientWidth: container.clientWidth })
      setVisibleCount(Math.max(1, Math.floor(container.clientWidth / SLOT)))
    }
    update()
    container.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(container)
    return () => {
      container.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [minis])

  const total = minis.length
  // Passo reale tra una card e la successiva (larghezza card + gap) — le card
  // homepage hanno tutte la stessa larghezza (.home-hero-cards .page-card).
  const cardStride = total > 1
    ? minis[1].el.offsetLeft - minis[0].el.offsetLeft
    : (minis[0]?.el.offsetWidth ?? SLOT)

  const startFrac = cardStride > 0 ? scroll.left / cardStride : 0
  const endFrac   = cardStride > 0 ? (scroll.left + scroll.clientWidth) / cardStride : 0
  const minIndexVisible = Math.floor(startFrac)
  const maxIndexVisible = Math.max(minIndexVisible, Math.ceil(endFrac) - 1)

  // Ricentra la finestra di miniature solo quando lo scroll reale si avvicina
  // al suo bordo — le miniature restano sempre alla stessa dimensione, mai
  // compresse: con poche card la finestra copre tutto e non si sposta mai.
  // Aggiornamento durante il render (pattern "adjust state" di React) invece di
  // useEffect+setState, per evitare un giro di render extra.
  const rangeKey = `${minIndexVisible}-${maxIndexVisible}-${visibleCount}`
  const [prevRangeKey, setPrevRangeKey] = useState<string | null>(null)
  if (rangeKey !== prevRangeKey && visibleCount > 0 && total > 0) {
    setPrevRangeKey(rangeKey)
    const windowEnd = windowStart + visibleCount - 1
    const BUFFER = 1
    const needsShift = minIndexVisible < windowStart + BUFFER || maxIndexVisible > windowEnd - BUFFER
    if (needsShift) {
      const center = Math.round((minIndexVisible + maxIndexVisible) / 2)
      setWindowStart(Math.max(0, Math.min(total - visibleCount, center - Math.floor(visibleCount / 2))))
    }
  }

  const windowItems = visibleCount > 0 ? minis.slice(windowStart, windowStart + visibleCount) : []
  const hiddenBefore = windowStart
  const hiddenAfter = Math.max(0, total - windowStart - visibleCount)

  // Rettangolo in scala: mappa 1:1 la porzione di contenuto reale visibile
  // (scroll.left .. scroll.left+clientWidth, in px "contenuto") sulle coordinate
  // della mini-mappa, dove ogni card+gap (cardStride px reali) occupa SLOT px.
  const scale = cardStride > 0 ? SLOT / cardStride : 0
  const windowWidthPx = visibleCount * SLOT - GAP
  const rectLeft  = Math.max(0, (scroll.left - windowStart * cardStride) * scale)
  const rectRight = Math.min(windowWidthPx, (scroll.left + scroll.clientWidth - windowStart * cardStride) * scale)
  const rectStyle: React.CSSProperties | null = total > 0 && rectRight > rectLeft
    ? {
        position: 'absolute', top: 0, bottom: 0,
        left: rectLeft, width: rectRight - rectLeft,
        border: '2px solid #fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.3)', borderRadius: 4,
        pointerEvents: 'none',
      }
    : null

  return (
    <div>
      <div
        ref={mergeRefs(autoScrollRef, maskRef, containerRef)}
        className="home-hero-cards"
        style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '8px 4px', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        {children}
      </div>
      {minis.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 8, padding: '0 4px' }}>
          {hiddenBefore > 0 && (
            <button type="button" className="btn-gray" style={{ fontSize: 11, padding: '2px 6px', flexShrink: 0 }}
              onClick={() => minis[0]?.el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })}>
              +{hiddenBefore}
            </button>
          )}
          <div style={{ position: 'relative', display: 'flex', gap: GAP, flexShrink: 0 }}>
            {rectStyle && <div style={rectStyle} />}
            {windowItems.map((m, i) => (
              <button
                key={windowStart + i}
                type="button"
                onClick={() => m.el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })}
                title={m.label}
                style={{
                  width: THUMB_W, height: THUMB_H, padding: 0, border: '1px solid #c8960c', borderRadius: 4,
                  overflow: 'hidden', cursor: 'pointer', background: '#f5f5f5', flexShrink: 0,
                }}
              >
                {m.src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                )}
              </button>
            ))}
          </div>
          {hiddenAfter > 0 && (
            <button type="button" className="btn-gray" style={{ fontSize: 11, padding: '2px 6px', flexShrink: 0 }}
              onClick={() => minis[minis.length - 1]?.el.scrollIntoView({ behavior: 'smooth', inline: 'end', block: 'nearest' })}>
              +{hiddenAfter}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
