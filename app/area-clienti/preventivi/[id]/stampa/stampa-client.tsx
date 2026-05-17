'use client'

import React from 'react'

export default function StampaClient({ pages }: { pages: string[] }) {
  function handlePrint() {
    window.print()
  }

  return (
    <>
      <style>{`
        @media print {
          body > * { display: none !important; }
          #print-area { display: block !important; }
          #print-area .no-print { display: none !important; }
          @page { size: A4 portrait; margin: 0; }
        }
        @media screen {
          #print-area { background: #d0d0d0; min-height: 100vh; padding: 24px 0; }
        }
      `}</style>

      <div id="print-area">
        <div className="no-print" style={{
          display: 'flex', gap: 12, justifyContent: 'center',
          marginBottom: 28, flexWrap: 'wrap',
        }}>
          <a href=".." style={{
            padding: '9px 20px', fontSize: 13, fontWeight: 700, borderRadius: 6, textDecoration: 'none',
            background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#111 0%,#222 20%,#383838 45%,#222 80%,#111 100%)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08)',
            color: '#fff', display: 'inline-flex', alignItems: 'center',
          }}>
            ← Torna al preventivo
          </a>
          <button onClick={handlePrint} style={{
            padding: '9px 22px', fontSize: 13, fontWeight: 700, borderRadius: 6, border: 'none',
            background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#111 0%,#222 20%,#383838 45%,#222 80%,#111 100%)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08)',
            color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            ⬇ Scarica / Stampa PDF
          </button>
          <span style={{ fontSize: 12, color: '#666', alignSelf: 'center' }}>
            {pages.length} pagina{pages.length !== 1 ? 'e' : ''} A4
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {pages.map((pageHtml, i) => (
            <div
              key={i}
              dangerouslySetInnerHTML={{ __html: pageHtml }}
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.22)', breakAfter: 'page' }}
            />
          ))}
        </div>
      </div>
    </>
  )
}
