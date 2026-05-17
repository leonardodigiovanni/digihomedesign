'use client'

import { useState, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

type Voce = { id: number; nome: string; pdf_filename: string; pdf_label: string }

function PdfViewer({ voce, onClose }: { voce: Voce; onClose: () => void }) {
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [containerWidth, setContainerWidth] = useState(800)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width)
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const btnStyle = (disabled?: boolean): React.CSSProperties => ({
    padding: '4px 10px', fontWeight: 700, borderRadius: 5,
    border: '1px solid #ddd', background: disabled ? '#f5f5f5' : '#fff',
    color: disabled ? '#bbb' : '#333', cursor: disabled ? 'default' : 'pointer',
  })

  return (
    <div style={{ border: '2px solid #c8960c', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
      {/* Toolbar */}
      <div style={{ borderBottom: '1px solid #e0e0e0', background: '#fafafa' }}>
        {/* Riga 1: titolo + azioni */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px 8px' }}>
          <span className="fs-15" style={{ fontWeight: 700, color: '#1a1a1a', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {voce.pdf_label || voce.nome}
          </span>
          <a
            href={`/uploads/cataloghi/${voce.pdf_filename}`}
            download
            className="fs-13"
            style={{
              padding: '7px 18px', fontWeight: 600, borderRadius: 6, textDecoration: 'none', whiteSpace: 'nowrap',
              background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#1b4d1b 0%,#266626 20%,#3a8f3a 45%,#266626 80%,#1b4d1b 100%)',
              boxShadow: '0 2px 8px rgba(20,80,20,0.45),inset 0 1px 0 rgba(160,255,160,0.2)',
              color: '#d4f5d4', border: 'none',
            }}
          >
            Scarica
          </a>
          <button
            onClick={onClose}
            title="Chiudi"
            className="fs-16"
            style={{
              width: 34, height: 34, fontWeight: 700, borderRadius: 6, border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#5a0000 0%,#8c0808 20%,#a81818 45%,#8c0808 80%,#5a0000 100%)',
              boxShadow: '0 2px 8px rgba(140,8,8,0.45),inset 0 1px 0 rgba(255,255,255,0.07)',
              color: '#ffd4d4',
            }}
          >
            ✕
          </button>
        </div>
        {/* Riga 2: navigazione pagine + zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 16px 12px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="fs-14" style={btnStyle(page <= 1)} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹</button>
            <span className="fs-13" style={{ color: '#555', whiteSpace: 'nowrap' }}>Pagina {page} / {numPages || '…'}</span>
            <button className="fs-14" style={btnStyle(page >= numPages)} disabled={page >= numPages} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
          <div style={{ width: 1, height: 20, background: '#ddd' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="fs-14" style={btnStyle(scale <= 0.5)} disabled={scale <= 0.5} onClick={() => setScale(s => Math.max(0.5, s - 0.25))}>–</button>
            <span className="fs-13" style={{ color: '#555', minWidth: 42, textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
            <button className="fs-14" style={btnStyle(scale >= 3)} disabled={scale >= 3} onClick={() => setScale(s => Math.min(3, s + 0.25))}>+</button>
          </div>
        </div>
      </div>

      {/* PDF */}
      <div ref={containerRef} style={{ overflow: 'auto', background: '#666', padding: '16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', minWidth: 'max-content', padding: '0 16px' }}>
        <Document
          file={`/uploads/cataloghi/${voce.pdf_filename}`}
          onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPage(1) }}
          loading={
            <div className="fs-14" style={{ color: '#fff', padding: '40px 20px' }}>Caricamento PDF…</div>
          }
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

function PdfThumbnail({ pdfFilename }: { pdfFilename: string }) {
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
    <div style={{
      width: '100%', overflow: 'hidden', borderRadius: 3,
      border: '1px solid #e8e8e8', background: '#f5f5f5',
      lineHeight: 0,
    }}>
      <Document
        file={`/uploads/cataloghi/${pdfFilename}`}
        onLoadError={() => setError(true)}
        loading={
          <div style={{ height: 180, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="fs-11" style={{ color: '#bbb' }}>…</span>
          </div>
        }
        error={null}
      >
        <Page
          pageNumber={1}
          width={160}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          onRenderError={() => setError(true)}
        />
      </Document>
    </div>
  )
}

export default function CatalogoClient({ voci }: { voci: Voce[] }) {
  const [selected, setSelected] = useState<Voce | null>(null)

  if (voci.length === 0) {
    return <p className="fs-14" style={{ color: '#aaa' }}>Nessun catalogo disponibile per questa categoria.</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {voci.map(v => {
          const isActive = selected?.id === v.id
          return (
            <button
              key={v.id}
              onClick={() => setSelected(isActive ? null : v)}
              style={{
                flex: '1 1 160px', maxWidth: 210,
                display: 'flex', flexDirection: 'column', alignItems: 'stretch',
                gap: 0, background: '#fff',
                border: isActive ? '2px solid #c8960c' : '1px solid #c8960c',
                borderRadius: 10, color: '#1a1a1a',
                padding: '10px 10px 12px', textAlign: 'center', cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              <PdfThumbnail pdfFilename={v.pdf_filename} />
              <span className="fs-13" style={{ fontWeight: 600, lineHeight: 1.3, marginTop: 10, display: 'block' }}>
                {v.pdf_label || v.nome}
              </span>
              {v.pdf_label && v.nome !== v.pdf_label && (
                <span className="fs-11" style={{ color: '#888', marginTop: 2, display: 'block' }}>{v.nome}</span>
              )}
              <span className="fs-11" style={{ color: isActive ? '#2b6cb0' : '#888', marginTop: 4, display: 'block' }}>
                {isActive ? 'Aperto' : 'Sfoglia'}
              </span>
            </button>
          )
        })}
      </div>

      {selected && <PdfViewer key={selected.id} voce={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
