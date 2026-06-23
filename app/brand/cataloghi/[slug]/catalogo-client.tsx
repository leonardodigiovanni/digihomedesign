'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Document, Page, pdfjs } from 'react-pdf'
import { b } from '@/lib/btn'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

type Voce = { id: number; nome: string; serie?: string; pdf_filename: string; pdf_label: string; listino_categoria: string | null; descrizione?: string | null; filtro_battente?: number; filtro_scorrevole?: number; filtro_taglio_termico?: number; filtro_taglio_freddo?: number; filtro_economico?: number; filtro_fascia_alta?: number }

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

function PdfViewer({ voce, onClose, isApp }: { voce: Voce; onClose: () => void; isApp?: boolean }) {
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
    const obs = new ResizeObserver(entries => { setContainerWidth(entries[0].contentRect.width) })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const measure = () => {
      const top = el.getBoundingClientRect().top
      setCardHeight(`${Math.floor(window.innerHeight - top)}px`)
    }
    const timer = setTimeout(measure, 450)
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    return () => { clearTimeout(timer); window.removeEventListener('resize', onResize) }
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
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '4px 12px', minHeight: 50 }}>
          <span className="fs-14" style={{ fontWeight: 700, color: '#1a1a1a', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {voce.pdf_label || voce.nome}
          </span>
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={arrowBtn(page <= 1)} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹</button>
            <span className="fs-13" style={{ color: '#555', whiteSpace: 'nowrap', minWidth: 36, textAlign: 'center' }}>{page} / {numPages || '…'}</span>
            <button style={arrowBtn(page >= numPages)} disabled={page >= numPages} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <a href={pdfSrc(voce.pdf_filename)} download className={`${b('btn-black', isApp)} fs-13`}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 34, padding: '0 16px', borderRadius: 17, textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
              Scarica
            </a>
            <button onClick={onClose} title="Chiudi" className={`${b('btn-red btn-icon', isApp)} fs-13`}
              style={{ flexShrink: 0 }}>
              ✕
            </button>
          </div>
        </div>
      </div>
      <div style={{
        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        background: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: '8px 5px', zIndex: 10,
      }}>
        <span style={{ fontSize: 9, color: '#fff', fontFamily: 'monospace', lineHeight: 1 }}>{Math.round(scale * 100)}%</span>
        <input type="range" min={50} max={300} step={25} value={Math.round(scale * 100)}
          onChange={e => setScale(Number(e.target.value) / 100)}
          style={{ writingMode: 'vertical-lr', direction: 'rtl', WebkitAppearance: 'slider-vertical', width: 16, height: 100, cursor: 'pointer', accentColor: '#c8960c' } as React.CSSProperties}
        />
      </div>
      <div ref={containerRef} style={{ overflow: 'auto', background: '#666', padding: '16px 0', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', minWidth: 'max-content', padding: '0 16px' }}>
          <Document
            file={pdfSrc(voce.pdf_filename)}
            onLoadSuccess={handleDocLoad}
            loading={<div className="fs-14" style={{ color: '#fff', padding: '40px 20px' }}>Caricamento PDF…</div>}
            error={<div className="fs-14" style={{ color: '#fcc', padding: '40px 20px' }}>Impossibile caricare il PDF.{' '}<a href={pdfSrc(voce.pdf_filename)} style={{ color: '#fdd', textDecoration: 'underline' }}>Apri direttamente</a></div>}
          >
            <Page pageNumber={page} width={Math.max(300, containerWidth - 32) * scale} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
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

export default function CatalogoClient({ voci, onSelect, categorySlug, basePath = '/brand/cataloghi', isApp }: {
  voci: Voce[]
  onSelect?: (v: Voce | null) => void
  categorySlug?: string
  basePath?: string
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

  const isFirst = currentIdx === 0
  const isLast = currentIdx === voci.length - 1

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

  const v = voci[currentIdx]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {voci.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} style={arrowBtn(isFirst)} disabled={isFirst} aria-label="Precedente">‹</button>
          <span className="fs-13" style={{ color: '#888' }}>{currentIdx + 1} / {voci.length}</span>
          <button onClick={() => setCurrentIdx(i => Math.min(voci.length - 1, i + 1))} style={arrowBtn(isLast)} disabled={isLast} aria-label="Successivo">›</button>
        </div>
      )}

      {categorySlug ? (
        <Link href={`${basePath}/${categorySlug}/${v.id}`} style={{ ...cardBase, border: '1px solid #c8960c', display: 'block', padding: '14px 16px' }}>
          <div style={{ float: 'left', width: 80, marginRight: 14, marginBottom: 4, borderRadius: 3, overflow: 'hidden', border: '1px solid #e8e8e8', flexShrink: 0 }}>
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
        </Link>
      ) : (
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
      )}

      {!categorySlug && selected && (
        <PdfViewer key={selected.id} voce={selected} onClose={() => handleSelect(null)} isApp={isApp} />
      )}
    </div>
  )
}
