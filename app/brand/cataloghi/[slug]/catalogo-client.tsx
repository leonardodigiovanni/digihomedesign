'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Link from 'next/link'
import { Document, Page, pdfjs } from 'react-pdf'
import { b } from '@/lib/btn'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

type Voce = { id: number; nome: string; serie?: string; pdf_filename: string; pdf_label: string; descrizione?: string | null; filtro_c1?: number; filtro_c2?: number; filtro_c3?: number; filtro_c4?: number; filtro_c5?: number; filtro_c6?: number }

function pdfSrc(filename: string): string {
  return filename.startsWith('https://') ? filename : `/uploads/cataloghi/${filename}`
}

function toSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const RENDER_HEADROOM = 3 // il PDF si disegna una sola volta a questo multiplo del 100%; lo zoom sopra/sotto e' solo CSS transform, niente re-render

function PdfViewer({ voce, onClose, isApp }: { voce: Voce; onClose: () => void; isApp?: boolean }) {
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [baseWidth, setBaseWidth] = useState(700)
  const [pageAspect, setPageAspect] = useState<number | null>(null)
  const [cardHeight, setCardHeight] = useState('80vh')
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const hasFit = useRef(false)
  const titleWrapRef = useRef<HTMLDivElement>(null)
  const titleSpanRef = useRef<HTMLSpanElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const panStart = useRef<{ x: number; scrollLeft: number; overscroll: number } | null>(null)
  const pinchStart = useRef<{ dist: number; scale: number; contentX: number; contentY: number; viewX: number; viewY: number } | null>(null)
  const mouseStart = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null)

  function onMouseDown(e: React.MouseEvent) {
    if (e.button !== 0 || !containerRef.current) return
    mouseStart.current = { x: e.clientX, y: e.clientY, scrollLeft: containerRef.current.scrollLeft, scrollTop: containerRef.current.scrollTop }
    containerRef.current.style.cursor = 'grabbing'
    e.preventDefault()
  }

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const start = mouseStart.current
      const container = containerRef.current
      if (!start || !container) return
      container.scrollLeft = start.scrollLeft - (e.clientX - start.x)
      container.scrollTop = start.scrollTop - (e.clientY - start.y)
    }
    function onUp() {
      mouseStart.current = null
      if (containerRef.current) containerRef.current.style.cursor = 'grab'
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  function pinchDist(e: React.TouchEvent) {
    const [a, b] = [e.touches[0], e.touches[1]]
    return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
  }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      touchStart.current = null
      panStart.current = null
      const container = containerRef.current
      if (!container) return
      const [t0, t1] = [e.touches[0], e.touches[1]]
      const midX = (t0.clientX + t1.clientX) / 2
      const midY = (t0.clientY + t1.clientY) / 2
      const cRect = container.getBoundingClientRect()
      const viewX = midX - cRect.left
      const viewY = midY - cRect.top
      pinchStart.current = {
        dist: pinchDist(e), scale,
        contentX: container.scrollLeft + viewX, contentY: container.scrollTop + viewY,
        viewX, viewY,
      }
      return
    }
    pinchStart.current = null
    const container = containerRef.current
    if (e.touches.length !== 1 || !container) { touchStart.current = null; return }
    if (container.scrollWidth > container.clientWidth + 2) {
      panStart.current = { x: e.touches[0].clientX, scrollLeft: container.scrollLeft, overscroll: 0 }
      touchStart.current = null
      return
    }
    panStart.current = null
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinchStart.current) {
      const ratio = pinchDist(e) / pinchStart.current.dist
      setScale(Math.min(Math.max(pinchStart.current.scale * ratio, 0.5), 3))
      return
    }
    if (e.touches.length === 1 && panStart.current && containerRef.current) {
      const container = containerRef.current
      const dx = e.touches[0].clientX - panStart.current.x
      const rawTarget = panStart.current.scrollLeft - dx
      const maxScroll = container.scrollWidth - container.clientWidth
      panStart.current.overscroll = rawTarget < 0 ? rawTarget : rawTarget > maxScroll ? rawTarget - maxScroll : 0
      container.scrollLeft = rawTarget
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) pinchStart.current = null
    if (panStart.current) {
      if (e.touches.length === 0) {
        const over = panStart.current.overscroll
        panStart.current = null
        if (over < -50) setPage(p => Math.max(1, p - 1))
        else if (over > 50) setPage(p => Math.min(numPages, p + 1))
      }
      return
    }
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx < 0) setPage(p => Math.min(numPages, p + 1))
    else setPage(p => Math.max(1, p - 1))
  }

  // durante/dopo un pinch, ancora lo scroll al punto sotto le dita mentre lo zoom (CSS) cambia
  useLayoutEffect(() => {
    const anchor = pinchStart.current
    const container = containerRef.current
    if (!anchor || !container) return
    const ratio = scale / anchor.scale
    container.scrollLeft = anchor.contentX * ratio - anchor.viewX
    container.scrollTop = anchor.contentY * ratio - anchor.viewY
  }, [scale])

  function fitScale() {
    if (hasFit.current) return
    const container = containerRef.current
    if (!container) return
    const availW = container.clientWidth - 12
    if (availW <= 0) return
    setBaseWidth(availW)
    setScale(1)
    hasFit.current = true
  }

  useEffect(() => {
    const wrap = titleWrapRef.current
    const span = titleSpanRef.current
    if (!wrap || !span) return
    const measure = () => {
      span.style.fontSize = '14px'
      const natural = span.scrollWidth
      const ratio = (wrap.clientWidth * 0.94) / natural
      span.style.fontSize = `${Math.min(Math.max(14 * ratio, 9), 18)}px`
    }
    measure()
    const obs = new ResizeObserver(measure)
    obs.observe(wrap)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const header = document.getElementById('site-sticky-header')
    el.style.scrollMarginTop = `${(header?.offsetHeight ?? 0) + 8}px`
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const measure = () => {
      const top = el.getBoundingClientRect().top
      setCardHeight(`${Math.floor(window.innerHeight - top)}px`)
    }
    const timer = setTimeout(() => { measure(); fitScale() }, 450)
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    return () => { clearTimeout(timer); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => { fitScale() }, [cardHeight])

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.scrollTop = 0
    containerRef.current.scrollLeft = 0
  }, [page])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleDocLoad(pdf: any) {
    setNumPages(pdf.numPages)
    setPage(1)
    try {
      const p = await pdf.getPage(1)
      const vp = p.getViewport({ scale: 1 })
      if (vp.height > 0 && vp.width > 0) {
        setPageAspect(vp.height / vp.width)
        fitScale()
      }
    } catch {}
  }

  const nativeWidth = baseWidth * RENDER_HEADROOM
  const nativeHeight = nativeWidth * (pageAspect ?? 1.414)
  const displayScale = scale / RENDER_HEADROOM

  const arrowBtn = (disabled: boolean): React.CSSProperties => ({
    width: 42, height: 42, borderRadius: 21, fontWeight: 700,
    border: `1px solid ${disabled ? '#e0e0e0' : '#c8960c'}`,
    background: '#fff', fontSize: 20, padding: 0,
    color: disabled ? '#ccc' : '#7a6000', cursor: disabled ? 'default' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  })

  return (
    <div ref={cardRef} style={{
      border: '1px solid #c8960c', borderRadius: 10, overflow: 'hidden', background: '#fff',
      position: 'relative', display: 'flex', flexDirection: 'column', height: cardHeight,
    }}>
      <div style={{ borderBottom: '1px solid #e0e0e0', background: '#fafafa', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0', minHeight: 50, gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button style={arrowBtn(page <= 1)} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹</button>
            <span className="fs-13" style={{ color: '#555', whiteSpace: 'nowrap', minWidth: 36, textAlign: 'center' }}>{page} / {numPages || '…'}</span>
            <button style={arrowBtn(page >= numPages)} disabled={page >= numPages} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
          <div ref={titleWrapRef} style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <span ref={titleSpanRef} className="fs-14" style={{ fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap', display: 'inline-block' }}>
              {voce.pdf_label || voce.nome}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <a href={pdfSrc(voce.pdf_filename)} download title="Scarica" className={`${b('btn-black btn-icon', isApp)} fs-13`}
              style={{ flexShrink: 0, textDecoration: 'none' }}>
              ↓
            </a>
            <button onClick={onClose} title="Chiudi" className={`${b('btn-red btn-icon', isApp)} fs-13`}
              style={{ flexShrink: 0 }}>
              ✕
            </button>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <div ref={containerRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onMouseDown={onMouseDown} style={{ overflow: 'auto', background: '#666', padding: '16px 0', flex: 1, touchAction: 'pan-y', cursor: 'grab' }}>
        <div style={{ display: 'flex', justifyContent: 'center', minWidth: 'max-content', padding: '0 6px' }}>
          <Document
            file={pdfSrc(voce.pdf_filename)}
            onLoadSuccess={handleDocLoad}
            loading={<div className="fs-14" style={{ color: '#fff', padding: '40px 20px' }}>Caricamento PDF…</div>}
            error={<div className="fs-14" style={{ color: '#fcc', padding: '40px 20px' }}>Impossibile caricare il PDF.{' '}<a href={pdfSrc(voce.pdf_filename)} style={{ color: '#fdd', textDecoration: 'underline' }}>Apri direttamente</a></div>}
          >
            <div style={{ width: nativeWidth * displayScale, height: nativeHeight * displayScale, overflow: 'hidden', position: 'relative' }}>
              {[page - 1, page, page + 1].filter(p => p >= 1 && p <= numPages).map(p => (
                <div key={p} style={{ position: 'absolute', inset: 0, visibility: p === page ? 'visible' : 'hidden' }}>
                  <div style={{ width: nativeWidth, transform: `scale(${displayScale})`, transformOrigin: 'top left' }}>
                    <Page pageNumber={p} width={nativeWidth} renderTextLayer={false} renderAnnotationLayer={false}
                      loading={<div style={{ width: nativeWidth, height: nativeHeight, background: '#fff' }} />} />
                  </div>
                </div>
              ))}
            </div>
          </Document>
        </div>
      </div>
      <div style={{
        width: 40, flexShrink: 0, background: '#555',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        borderLeft: '1px solid #444',
      }}>
        <span style={{ fontSize: 9, color: '#fff', lineHeight: 1 }}>{Math.round(scale * 100)}%</span>
        <input type="range" min={50} max={300} step={1} value={Math.round(scale * 100)}
          onChange={e => setScale(Number(e.target.value) / 100)}
          style={{ writingMode: 'vertical-lr', direction: 'rtl', WebkitAppearance: 'slider-vertical', width: 16, height: 260, cursor: 'pointer', accentColor: '#c8960c' } as React.CSSProperties}
        />
      </div>
      </div>
    </div>
  )
}

function PdfThumbnail({ pdfFilename, width = 160 }: { pdfFilename: string; width?: number }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <svg width="36" height="44" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="34" rx="3" fill="#e53935"/>
        <path d="M17 0 L17 8 L28 8 Z" fill="#b71c1c"/>
        <text x="14" y="24" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="system-ui,sans-serif">PDF</text>
      </svg>
    )
  }

  return (
    <div style={{ width: '100%', overflow: 'hidden', borderRadius: 3, border: '1px solid #e8e8e8', background: '#f5f5f5', lineHeight: 0 }}>
      <Document
        file={pdfSrc(pdfFilename)}
        onLoadError={() => setError(true)}
        onSourceError={() => setError(true)}
        loading={<div style={{ height: 180, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="fs-11" style={{ color: '#bbb' }}>…</span></div>}
        error={null}
      >
        <Page pageNumber={1} width={width} renderTextLayer={false} renderAnnotationLayer={false} onRenderError={() => setError(true)} />
      </Document>
    </div>
  )
}

export default function CatalogoClient({ voci, onSelect, isApp }: {
  voci: Voce[]
  onSelect?: (v: Voce | null) => void
  isApp?: boolean
}) {
  const [selected, setSelected] = useState<Voce | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)

  function handleSelect(v: Voce | null) {
    setSelected(v)
    onSelect?.(v)
  }

  if (voci.length === 0) {
    return <p className="fs-14" style={{ color: '#aaa' }}>Nessun catalogo disponibile per questa categoria.</p>
  }

  // voci può restringersi (filtri) mentre currentIdx resta quello vecchio: evita accessi fuori range
  const safeIdx = Math.min(currentIdx, voci.length - 1)

  const isFirst = safeIdx === 0
  const isLast = safeIdx === voci.length - 1

  const arrowBtn = (disabled: boolean): React.CSSProperties => ({
    width: 42, height: 42, borderRadius: 21,
    border: `1px solid ${disabled ? '#e0e0e0' : '#c8960c'}`,
    background: '#fff', fontSize: 20, fontWeight: 700,
    cursor: disabled ? 'default' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 0, color: disabled ? '#ccc' : '#7a6000',
    flexShrink: 0,
  })

  const cardBase: React.CSSProperties = {
    display: 'flex', flexDirection: 'row', alignItems: 'stretch',
    background: '#fff', borderRadius: 10, color: '#1a1a1a',
    padding: 0, overflow: 'hidden',
    cursor: 'pointer', textDecoration: 'none',
    width: '100%',
  }

  const v = voci[safeIdx]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {voci.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} style={arrowBtn(isFirst)} disabled={isFirst} aria-label="Precedente">‹</button>
          <span className="fs-13" style={{ color: '#888' }}>{safeIdx + 1} / {voci.length}</span>
          <button onClick={() => setCurrentIdx(i => Math.min(voci.length - 1, i + 1))} style={arrowBtn(isLast)} disabled={isLast} aria-label="Successivo">›</button>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => handleSelect(selected?.id === v.id ? null : v)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelect(selected?.id === v.id ? null : v) }}
        style={{ ...cardBase, border: selected?.id === v.id ? '2px solid #c8960c' : '1px solid #c8960c', display: 'block', padding: '14px 16px', cursor: 'pointer' }}
      >
        <div style={{ float: 'left', width: 80, marginRight: 14, marginBottom: 4, borderRadius: 3, overflow: 'hidden', border: '1px solid #e8e8e8' }}>
          <PdfThumbnail pdfFilename={v.pdf_filename} width={80} />
        </div>
        <span className="fs-14" style={{ fontWeight: 700, lineHeight: 1.4, color: '#1a1a1a', display: 'block' }}>
          {v.pdf_label || v.nome}
        </span>
        {v.pdf_label && v.nome !== v.pdf_label && (
          <span className="fs-12" style={{ color: '#888', display: 'block' }}>{v.nome}</span>
        )}
        {v.descrizione && (
          <span className="fs-12" style={{ color: '#555', lineHeight: 1.6, display: 'block' }}>
            {v.descrizione}
          </span>
        )}
        <div style={{ clear: 'both' }} />
      </div>

      {selected && (
        <PdfViewer key={selected.id} voce={selected} onClose={() => handleSelect(null)} isApp={isApp} />
      )}
    </div>
  )
}
