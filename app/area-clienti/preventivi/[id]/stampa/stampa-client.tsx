'use client'

import React, { useEffect, useState } from 'react'

export interface StampaBlock {
  html: string
  htmlMain?: string
  htmlCaratt?: string
  forceNewPage?: boolean
}

export interface StampaData {
  blocks: StampaBlock[]
  header1: string
  headerN: string
  footerTemplate: string
  layout: { pageW: number; pageH: number; padTop: number; padSide: number; padBot: number }
}

export default function StampaClient({ data }: { data: StampaData }) {
  const [pages, setPages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [pageZoom, setPageZoom] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [scaricando, setScaricando] = useState(false)
  const [condividendo, setCondividendo] = useState(false)

  useEffect(() => {
    function calc() {
      const vw = window.innerWidth
      setPageZoom(vw < 842 ? (vw - 32) / 794 : 1)
      setIsMobile(vw < 768)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  useEffect(() => {
    const { blocks, header1, headerN, footerTemplate, layout } = data
    const { pageW, pageH, padTop, padSide, padBot } = layout
    const contentW = pageW - padSide * 2
    const contentH = pageH - padTop - padBot

    const container = document.createElement('div')
    container.style.cssText = `position:fixed;left:-9999px;top:0;width:${contentW}px;padding-bottom:1px;font-family:'Times New Roman',Times,serif;visibility:hidden;pointer-events:none;`
    document.body.appendChild(container)

    async function measure(html: string): Promise<number> {
      container.innerHTML = html
      const imgs = Array.from(container.querySelectorAll<HTMLImageElement>('img'))
      await Promise.all(imgs.map(img =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res() })
      ))
      return container.getBoundingClientRect().height
    }

    async function paginate() {
      // header1 first child has margin:-padTop; add padTop back to get true page usage
      const header1H = (await measure(header1)) + padTop
      const headerNH = await measure(headerN)

      type MB = {
        html: string; h: number
        htmlMain?: string; mainH?: number
        htmlCaratt?: string; caratH?: number
        forceNewPage?: boolean
      }
      const measured: MB[] = []
      for (const b of blocks) {
        const h = await measure(b.html)
        if (b.htmlMain && b.htmlCaratt) {
          measured.push({
            html: b.html, h,
            htmlMain: b.htmlMain, mainH: await measure(b.htmlMain),
            htmlCaratt: b.htmlCaratt, caratH: await measure(b.htmlCaratt),
            forceNewPage: b.forceNewPage,
          })
        } else {
          measured.push({ html: b.html, h, forceNewPage: b.forceNewPage })
        }
      }
      document.body.removeChild(container)

      const pageContents: { html: string }[][] = []
      let current: { html: string }[] = []
      let usedH = 0
      let avail = contentH - header1H

      function flush() {
        if (current.length > 0) pageContents.push(current)
        current = []
        usedH = 0
        avail = contentH - headerNH
      }

      for (const mb of measured) {
        if (mb.forceNewPage && current.length > 0) flush()
        if (mb.caratH == null) {
          if (current.length > 0 && usedH + mb.h > avail) flush()
          current.push({ html: mb.html })
          usedH += mb.h
        } else {
          const mainH = mb.mainH!, caratH = mb.caratH!
          if (usedH + mb.h <= avail) {
            current.push({ html: mb.html })
            usedH += mb.h
          } else if (usedH + mainH <= avail) {
            const rem = avail - usedH - mainH
            if (caratH <= rem) {
              current.push({ html: mb.html })
              usedH += mb.h
            } else {
              current.push({ html: mb.htmlMain! })
              flush()
              current.push({ html: mb.htmlCaratt! })
              usedH += caratH
            }
          } else {
            if (current.length > 0) flush()
            if (mainH + caratH <= avail) {
              current.push({ html: mb.html })
              usedH += mb.h
            } else {
              current.push({ html: mb.htmlMain! })
              flush()
              current.push({ html: mb.htmlCaratt! })
              usedH += caratH
            }
          }
        }
      }
      if (current.length > 0) pageContents.push(current)

      const total = pageContents.length
      const built = pageContents.map((content, idx) => {
        const pageNum = idx + 1
        const hdr = idx === 0 ? header1 : headerN
        const footer = footerTemplate
          .replace('{{PAGE}}', String(pageNum))
          .replace('{{TOTAL}}', String(total))
        const body = content.map(c => c.html).join('\n')
        return `<div style="font-family:'Times New Roman',Times,serif;width:${pageW}px;height:${pageH}px;padding:${padTop}px ${padSide}px ${padBot}px;position:relative;background:#fff;box-sizing:border-box;overflow:hidden;">
${hdr}
${body}
${footer}
</div>`
      })

      setPages(built)
      setLoading(false)
    }

    paginate()
  }, [data])

  async function buildPDF() {
    const html2canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;overflow:hidden;pointer-events:none;'
    document.body.appendChild(container)
    try {
      for (let i = 0; i < pages.length; i++) {
        container.innerHTML = pages[i]
        const pageEl = container.firstElementChild as HTMLElement
        const imgs = Array.from(container.querySelectorAll<HTMLImageElement>('img'))
        await Promise.all(imgs.map(img =>
          img.complete ? Promise.resolve() :
          new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res() })
        ))
        const canvas = await html2canvas(pageEl, { scale: 300 / 96, useCORS: true, backgroundColor: '#ffffff', logging: false })
        if (i > 0) pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297)
      }
    } finally {
      document.body.removeChild(container)
    }
    return pdf
  }

  async function handleScarica() {
    setScaricando(true)
    try {
      const pdf = await buildPDF()
      pdf.save('preventivo.pdf')
    } finally {
      setScaricando(false)
    }
  }

  async function handleCondividi() {
    if (!navigator.share) { alert('La condivisione non è supportata su questo browser.'); return }
    setCondividendo(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const container = document.createElement('div')
      container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;overflow:hidden;pointer-events:none;'
      document.body.appendChild(container)
      const files: File[] = []
      try {
        for (let i = 0; i < pages.length; i++) {
          container.innerHTML = pages[i]
          const pageEl = container.firstElementChild as HTMLElement
          const imgs = Array.from(container.querySelectorAll<HTMLImageElement>('img'))
          await Promise.all(imgs.map(img =>
            img.complete ? Promise.resolve() :
            new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res() })
          ))
          const canvas = await html2canvas(pageEl, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false })
          const blob = await new Promise<Blob>((resolve, reject) =>
            canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/jpeg', 0.92)
          )
          files.push(new File([blob], `preventivo-p${i + 1}.jpg`, { type: 'image/jpeg' }))
        }
      } finally {
        document.body.removeChild(container)
      }
      const shareData = navigator.canShare?.({ files })
        ? { files, title: 'Preventivo' }
        : { title: 'Preventivo', url: window.location.href }
      await navigator.share(shareData)
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') console.error(err)
    } finally {
      setCondividendo(false)
    }
  }

  function handleStampa() {
    const win = window.open('', '_blank')
    if (!win) { alert('Popup bloccato — abilita i popup per questo sito e riprova.'); return }
    const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8"/>
<base href="${window.location.origin}"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { background: #fff; }
  @page { size: A4 portrait; margin: 0; }
  .page-break { break-after: page; }
  .page-break:last-child { break-after: auto; }
  a { text-decoration: none !important; color: inherit !important; }
</style>
</head><body>
${pages.map(p => `<div class="page-break">${p}</div>`).join('\n')}
</body></html>`
    win.document.write(html)
    win.document.close()
    const imgs = Array.from(win.document.querySelectorAll<HTMLImageElement>('img'))
    Promise.all(imgs.map(img =>
      img.complete ? Promise.resolve() :
      new Promise<void>(res => { img.onload = () => res(); img.onerror = () => res() })
    )).then(() => {
      win.focus()
      win.onafterprint = () => win.close()
      win.print()
    })
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#d0d0d0' }}>
        <div style={{ fontSize: 15, color: '#555', fontFamily: 'sans-serif' }}>Preparazione documento…</div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        #print-area { background: #d0d0d0; min-height: 100vh; padding: 24px 0; }
        @media print {
          body > *:not(main) { display: none !important; }
          main { padding: 0 !important; }
          main > *:not(#print-area) { display: none !important; }
          .no-print { display: none !important; }
          #print-area { background: white !important; padding: 0 !important; min-height: 0 !important; }
          #pages-container { gap: 0 !important; }
          #pages-container > div { zoom: 1 !important; box-shadow: none !important; }
          body { background: white !important; margin: 0 !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        @page { size: A4 portrait; margin: 0; }
      `}</style>

      <div id="print-area">
        <div className="no-print" style={{
          display: 'flex', gap: 12, justifyContent: 'center',
          marginBottom: 28, flexWrap: 'wrap',
        }}>
          <a href=".." style={{
            padding: '0 20px', height: 42, fontSize: 13, fontWeight: 700, borderRadius: 21, textDecoration: 'none',
            background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#111 0%,#222 20%,#383838 45%,#222 80%,#111 100%)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08)',
            color: '#fff', display: 'inline-flex', alignItems: 'center',
          }}>
            ← Torna al preventivo
          </a>
          <button onClick={handleScarica} disabled={scaricando} style={{
            padding: '0 22px', height: 42, fontSize: 13, fontWeight: 700, borderRadius: 21, border: 'none',
            background: scaricando ? '#555' : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#111 0%,#222 20%,#383838 45%,#222 80%,#111 100%)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08)',
            color: '#fff', cursor: scaricando ? 'default' : 'pointer', fontFamily: 'inherit',
          }}>
            {scaricando ? 'Generazione PDF…' : '⬇ Scarica PDF'}
          </button>
          {isMobile ? (
            <button onClick={handleCondividi} disabled={condividendo} style={{
              padding: '0 22px', height: 42, fontSize: 13, fontWeight: 700, borderRadius: 21, border: 'none',
              background: condividendo ? '#555' : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#111 0%,#222 20%,#383838 45%,#222 80%,#111 100%)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08)',
              color: '#fff', cursor: condividendo ? 'default' : 'pointer', fontFamily: 'inherit',
            }}>
              {condividendo ? 'Generazione…' : '↗ Condividi'}
            </button>
          ) : (
            <button onClick={handleStampa} style={{
              padding: '0 22px', height: 42, fontSize: 13, fontWeight: 700, borderRadius: 21, border: 'none',
              background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#111 0%,#222 20%,#383838 45%,#222 80%,#111 100%)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08)',
              color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              🖨 Stampa
            </button>
          )}
          <span style={{ fontSize: 12, color: '#666', alignSelf: 'center' }}>
            {pages.length} pagina{pages.length !== 1 ? 'e' : ''} A4
          </span>
        </div>

        <div id="pages-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {pages.map((pageHtml, i) => (
            <div
              key={i}
              dangerouslySetInnerHTML={{ __html: pageHtml }}
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.22)', breakAfter: 'page', zoom: pageZoom }}
            />
          ))}
        </div>
      </div>
    </>
  )
}
