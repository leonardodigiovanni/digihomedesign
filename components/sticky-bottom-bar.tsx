'use client'

import { useEffect, useState } from 'react'
import { useEdgeAutoScroll } from '@/lib/use-edge-auto-scroll'
import { useScrollEdgeMask } from '@/lib/use-scroll-edge-mask'
import { mergeRefs } from '@/lib/merge-refs'
import { useStickyBottomBarValue } from '@/lib/sticky-bottom-bar-context'

export const BAR_HEIGHT = 44

/**
 * Barra oro (stesso colore della navbar) fissa in fondo allo schermo, su ogni pagina del sito (non la
 * PWA /app). Visibile SOLO se la pagina corrente ha registrato un contenuto
 * tramite useStickyBottomBarContent (lib/sticky-bottom-bar-context.tsx) — ogni
 * pagina decide per conto suo; se non c'è nulla da mostrare, niente barra e
 * niente spazio riservato (nessuno spazio inutile).
 *
 * Quando visibile: fissa da subito (position:fixed), indipendente dallo
 * scroll. Include uno spazio vuoto della stessa altezza subito dopo il
 * Footer (va renderizzata dopo Footer nel layout), così scrollando fino in
 * fondo il footer resta comunque interamente visibile sopra la barra invece
 * di restarne coperto.
 *
 * In questo sito è <body> (non la finestra) l'elemento che scrolla, quindi la
 * sua scrollbar verticale occupa gli ultimi px a destra dello schermo: la
 * barra si ferma prima invece di coprirla (larghezza misurata via JS).
 */
export default function StickyBottomBar() {
  const content = useStickyBottomBarValue()
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  useEffect(() => {
    function measure() {
      setScrollbarWidth(document.body.offsetWidth - document.body.clientWidth)
    }
    measure()
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('resize', measure)
      ro.disconnect()
    }
  }, [])

  const autoScrollRef = useEdgeAutoScroll<HTMLDivElement>({ axis: 'x' })
  const maskRef = useScrollEdgeMask<HTMLDivElement>(40)

  if (!content) return null

  return (
    <>
      <div aria-hidden style={{ height: BAR_HEIGHT, flexShrink: 0 }} />
      <div
        ref={mergeRefs(autoScrollRef, maskRef)}
        className="sticky-bottom-bar-row"
        style={{
          position: 'fixed',
          left: 0,
          right: scrollbarWidth,
          bottom: 0,
          zIndex: 200,
          height: BAR_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'safe center',
          gap: 16,
          padding: '0 16px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          boxSizing: 'border-box',
        }}
      >
        {content}
      </div>
    </>
  )
}
