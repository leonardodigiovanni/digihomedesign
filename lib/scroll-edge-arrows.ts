// Sopra alla sticky-bottom-bar (z-index 200) e a qualunque contenuto di pagina,
// ma sotto alle modali (che partono da 2000+). Vince comunque il controllo
// "sotto l'header sticky" in reposition(), che nasconde la freccia a prescindere
// dallo z-index quando finirebbe dietro l'header (zIndex 100 — vedi layout.tsx).
const Z_INDEX = 250

// Stessa doppia freccia (icona "«"/"»") e stesse dimensioni (14x12) della navbar
// (components/navbar.tsx, nav-arrow-btn) — qui però solo grafica, nessun bottone.
const SVG_LEFT  = '<svg viewBox="0 0 14 12" width="14" height="12" fill="currentColor"><path d="M14 0 L8 6 L14 12 Z M6 0 L0 6 L6 12 Z"/></svg>'
const SVG_RIGHT = '<svg viewBox="0 0 14 12" width="14" height="12" fill="currentColor"><path d="M0 0 L6 6 L0 12 Z M8 0 L14 6 L8 12 Z"/></svg>'

function makeArrow(side: 'left' | 'right'): HTMLDivElement {
  const el = document.createElement('div')
  el.style.position = 'fixed'
  el.style.pointerEvents = 'none'
  el.style.display = 'none'
  el.style.color = '#333'
  el.style.filter = 'drop-shadow(0 1px 2px rgba(255,255,255,0.8))'
  el.style.zIndex = String(Z_INDEX)
  el.innerHTML = side === 'left' ? SVG_LEFT : SVG_RIGHT
  return el
}

/**
 * Aggancia una freccia sinistra e una destra a document.body, sempre position:fixed
 * — così la posizione si calcola solo da getBoundingClientRect() dell'elemento
 * scrollabile, indipendentemente da quanti fratelli/antenati posizionati ci siano
 * (niente assunzioni sul genitore, niente problemi con elementi già position:fixed
 * come la sticky-bottom-bar). Riposizionate anche sullo scroll di <body>, che in
 * questo sito è il vero elemento che scrolla (non window) — necessario anche solo
 * per capire se l'elemento tracciato è finito dietro l'header sticky.
 */
export function attachScrollArrows(el: HTMLElement) {
  const left = makeArrow('left')
  const right = makeArrow('right')
  document.body.appendChild(left)
  document.body.appendChild(right)

  let wantLeft = false
  let wantRight = false

  function reposition() {
    const rect = el.getBoundingClientRect()
    const top = rect.top + rect.height / 2 - 6
    left.style.top  = `${top}px`
    right.style.top = `${top}px`
    left.style.left  = `${rect.left + 10}px`
    right.style.left = `${rect.right - 10 - 14}px`

    // Se l'elemento tracciato è scorso (in verticale) dietro l'header sticky,
    // la freccia va nascosta indipendentemente dallo z-index — altrimenti
    // resta a galleggiare sopra header/banner/nav durante lo scroll di pagina.
    const header = document.getElementById('site-sticky-header')
    const headerBottom = header ? header.getBoundingClientRect().bottom : 0
    const hiddenByHeader = rect.bottom < headerBottom || top < headerBottom
    left.style.display  = (wantLeft  && !hiddenByHeader) ? 'block' : 'none'
    right.style.display = (wantRight && !hiddenByHeader) ? 'block' : 'none'
  }

  function onPageScroll() { reposition() }
  document.body.addEventListener('scroll', onPageScroll, { passive: true })
  window.addEventListener('scroll', onPageScroll, { passive: true })

  return {
    setVisible(showLeft: boolean, showRight: boolean) {
      wantLeft = showLeft
      wantRight = showRight
      reposition()
    },
    cleanup() {
      document.body.removeEventListener('scroll', onPageScroll)
      window.removeEventListener('scroll', onPageScroll)
      left.remove()
      right.remove()
    },
  }
}
