'use client'

import React, { useRef, useState } from 'react'

export default function StampaClient({ pages }: { pages: string[] }) {
  const pageRefs   = useRef<(HTMLDivElement | null)[]>([])
  const [loadingPdf,   setLoadingPdf]   = useState(false)
  const [loadingPrint, setLoadingPrint] = useState(false)

  async function buildPDF() {
    await document.fonts.ready
    const html2canvas = (await import('html2canvas')).default
    const { jsPDF }   = await import('jspdf')

    const pdf  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pdfW = pdf.internal.pageSize.getWidth()
    const pdfH = pdf.internal.pageSize.getHeight()

    for (let i = 0; i < pages.length; i++) {
      const el = pageRefs.current[i]
      if (!el) continue
      if (i > 0) pdf.addPage()

      // Ogni pagina è esattamente 794×1123 px — cattura diretta, nessun slicing
      const canvas = await html2canvas(el, {
        scale:           2,
        useCORS:         true,
        allowTaint:      true,
        backgroundColor: '#ffffff',
        logging:         false,
        imageTimeout:    15000,
        width:           794,
        height:          1123,
        windowWidth:     794,
        windowHeight:    1123,
      })

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH)
    }

    return pdf
  }

  async function handlePDF() {
    setLoadingPdf(true)
    try {
      const pdf = await buildPDF()
      pdf.save('preventivo.pdf')
    } finally {
      setLoadingPdf(false)
    }
  }

  async function handlePrint() {
    setLoadingPrint(true)
    try {
      const pdf = await buildPDF()
      pdf.autoPrint()
      const url = URL.createObjectURL(pdf.output('blob'))
      window.open(url, '_blank')
    } finally {
      setLoadingPrint(false)
    }
  }

  const busy = loadingPdf || loadingPrint

  return (
    <div style={{ background: '#d0d0d0', minHeight: '100vh', padding: '24px 0' }}>

      {/* Barra azioni */}
      <div style={{
        display: 'flex', gap: 12, justifyContent: 'center',
        marginBottom: 28, flexWrap: 'wrap',
      }}>
        <a href=".." className="btn-black" style={{ padding: '9px 20px', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          ← Torna al preventivo
        </a>
        <button onClick={handlePDF} disabled={busy} className="btn-black" style={{
          padding: '9px 22px', fontSize: 13, fontWeight: 700,
          border: 'none', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.5 : 1,
        }}>
          {loadingPdf ? 'Generazione…' : 'Scarica PDF'}
        </button>
        <button onClick={handlePrint} disabled={busy} className="btn-black" style={{
          padding: '9px 20px', fontSize: 13, fontWeight: 600,
          border: 'none', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.5 : 1,
        }}>
          {loadingPrint ? 'Generazione…' : 'Stampa'}
        </button>
        <span style={{ fontSize: 12, color: '#666', alignSelf: 'center' }}>
          {pages.length} pagina{pages.length !== 1 ? 'e' : ''} A4
        </span>
      </div>

      {/* Anteprima: pagine A4 impilate */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {pages.map((pageHtml, i) => (
          <div
            key={i}
            ref={el => { pageRefs.current[i] = el }}
            dangerouslySetInnerHTML={{ __html: pageHtml }}
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.22)' }}
          />
        ))}
      </div>

    </div>
  )
}
