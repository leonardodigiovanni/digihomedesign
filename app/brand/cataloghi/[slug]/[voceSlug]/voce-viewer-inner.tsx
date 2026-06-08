'use client'

import { useState, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

type Voce = { nome: string; pdf_filename: string; pdf_label: string }

export default function VoceViewerInner({ voce }: { voce: Voce }) {
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [containerWidth, setContainerWidth] = useState(800)
  const [cardHeight, setCardHeight] = useState('80vh')
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const hasFit = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width)
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const update = () => {
      const el = cardRef.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      setCardHeight(`${Math.floor(window.innerHeight - top)}px`)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleDocLoad(pdf: any) {
    setNumPages(pdf.numPages)
    setPage(1)
    if (hasFit.current) return
    try {
      const p = await pdf.getPage(1)
      const vp = p.getViewport({ scale: 1 })
      if (vp.height > 0 && vp.width > 0) {
        const availH = window.innerHeight - 160
        const availW = (containerRef.current?.clientWidth ?? window.innerWidth) - 32
        const scaleH = availH / vp.height
        const scaleW = availW / vp.width
        setScale(Math.min(Math.max(Math.min(scaleH, scaleW), 0.5), 3))
        hasFit.current = true
      }
    } catch {}
  }

  const btnStyle = (disabled?: boolean): React.CSSProperties => ({
    width: 42, height: 42, borderRadius: 21, fontWeight: 700,
    border: `1px solid ${disabled ? '#e0e0e0' : '#c8960c'}`,
    background: '#fff', fontSize: 20, padding: 0,
    color: disabled ? '#ccc' : '#7a6000', cursor: disabled ? 'default' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  })

  return (
    <div ref={cardRef} style={{ border: '1px solid #c8960c', borderRadius: 10, overflow: 'hidden', background: '#fff', marginTop: 8, position: 'relative', display: 'flex', flexDirection: 'column', height: cardHeight }}>
      <div style={{ borderBottom: '1px solid #e0e0e0', background: '#fafafa' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '4px 12px', minHeight: 50 }}>
          <span className="fs-14" style={{ fontWeight: 700, color: '#1a1a1a', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {voce.pdf_label || voce.nome}
          </span>
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={btnStyle(page <= 1)} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹</button>
            <span className="fs-13" style={{ color: '#555', whiteSpace: 'nowrap', minWidth: 36, textAlign: 'center' }}>{page} / {numPages || '…'}</span>
            <button style={btnStyle(page >= numPages)} disabled={page >= numPages} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
          <a
            href={`/uploads/cataloghi/${voce.pdf_filename}`}
            download
            className="btn-black fs-13"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              height: 34, padding: '0 16px', borderRadius: 17,
              textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'monospace', flexShrink: 0,
            }}
          >
            Scarica
          </a>
        </div>
      </div>
      {/* leva zoom verticale — sovrapposta alla card, non scorre col PDF */}
      <div style={{
        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        background: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: '8px 5px', zIndex: 10,
        pointerEvents: 'auto',
      }}>
        <span style={{ fontSize: 9, color: '#fff', fontFamily: 'monospace', lineHeight: 1 }}>{Math.round(scale * 100)}%</span>
        <input
          type="range"
          min={50} max={300} step={25}
          value={Math.round(scale * 100)}
          onChange={e => setScale(Number(e.target.value) / 100)}
          style={{
            writingMode: 'vertical-lr',
            direction: 'rtl',
            WebkitAppearance: 'slider-vertical',
            width: 16,
            height: 100,
            cursor: 'pointer',
            accentColor: '#c8960c',
          } as React.CSSProperties}
        />
      </div>
      <div
        ref={containerRef}
        style={{ overflow: 'auto', background: '#666', padding: '16px 0', flex: 1 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', minWidth: 'max-content', padding: '0 16px' }}>
          <Document
            file={`/uploads/cataloghi/${voce.pdf_filename}`}
            onLoadSuccess={handleDocLoad}
            loading={<div className="fs-14" style={{ color: '#fff', padding: '40px 20px' }}>Caricamento PDF…</div>}
            error={
              <div className="fs-14" style={{ color: '#fcc', padding: '40px 20px' }}>
                Impossibile caricare il PDF.{' '}
                <a href={`/uploads/cataloghi/${voce.pdf_filename}`} style={{ color: '#fdd', textDecoration: 'underline' }}>Apri direttamente</a>
              </div>
            }
          >
            <Page
              pageNumber={page}
              width={Math.max(300, containerWidth - 32) * scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      </div>
    </div>
  )
}
