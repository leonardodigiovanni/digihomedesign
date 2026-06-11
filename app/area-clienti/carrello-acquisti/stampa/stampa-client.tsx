'use client'

import React, { useEffect, useRef, useState } from 'react'
import { b } from '@/lib/btn'

export default function StampaAcquistiClient({ pages, tornaHref = '/area-clienti/carrello-acquisti', isApp }: { pages: string[]; tornaHref?: string; isApp?: boolean }) {
  const pageRefs   = useRef<(HTMLDivElement | null)[]>([])
  const [loadingPdf,   setLoadingPdf]   = useState(false)
  const [loadingPrint, setLoadingPrint] = useState(false)
  const [pageZoom, setPageZoom] = useState(1)

  useEffect(() => {
    function calc() {
      const vw = window.innerWidth
      setPageZoom(vw < 842 ? (vw - 32) / 794 : 1)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

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
      pdf.save('ordine-acquisto.pdf')
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

      <div style={{
        display: 'flex', gap: 12, justifyContent: 'center',
        marginBottom: 28, flexWrap: 'wrap',
      }}>
        <a href={tornaHref} className={b('btn-black', isApp)}>
          ← Torna al carrello
        </a>
        <button onClick={handlePDF} disabled={busy} className={b('btn-black', isApp)} style={{
          padding: '0 22px', cursor: busy ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', opacity: busy ? 0.5 : 1,
        }}>
          {loadingPdf ? 'Generazione…' : '⬇ Scarica PDF'}
        </button>
        <button onClick={handlePrint} disabled={busy} className={b('btn-black', isApp)} style={{
          cursor: busy ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', opacity: busy ? 0.5 : 1,
        }}>
          {loadingPrint ? 'Generazione…' : '🖨 Stampa'}
        </button>
        <span style={{ fontSize: 12, color: '#666', alignSelf: 'center' }}>
          {pages.length} pagina{pages.length !== 1 ? 'e' : ''} A4
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {pages.map((pageHtml, i) => (
          <div
            key={i}
            ref={el => { pageRefs.current[i] = el }}
            dangerouslySetInnerHTML={{ __html: pageHtml }}
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.22)', zoom: pageZoom }}
          />
        ))}
      </div>

    </div>
  )
}
