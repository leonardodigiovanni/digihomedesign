import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Condizioni di Vendita — Digi Home Design Palermo',
  description: 'Condizioni generali di vendita e fornitura di Digi Home Design: modalità di pagamento, garanzie, tempi di consegna e politica di reso.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/condizioni-di-vendita' },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Condizioni di Vendita
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Condizioni di Vendita</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Le presenti condizioni generali di vendita disciplinano i rapporti tra Digi Home Design e i propri clienti in merito alla fornitura di prodotti e servizi. L&apos;accettazione del preventivo ufficiale implica la piena accettazione delle condizioni riportate all&apos;interno dei seguenti allegati in esso contenuti.</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { label: 'Condizioni Generali di Vendita',      file: 'condizioni-generali-di-vendita.pdf'     },
          { label: 'Condizioni Generali del Preventivo',  file: 'condizioni-generali-del-preventivo.pdf' },
        ].map(d => (
          <a
            key={d.file}
            href={`/docs/${d.file}`}
            download
            className="fs-14"
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px',
              background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8,
              textDecoration: 'none', color: '#1a1a1a', fontWeight: 500,
            }}
          >
            <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <rect width="28" height="34" rx="3" fill="#e53935"/>
              <path d="M17 0 L17 8 L28 8 Z" fill="#b71c1c"/>
              <text x="14" y="24" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="system-ui,sans-serif">PDF</text>
            </svg>
            {d.label}
            <span className="fs-12" style={{ marginLeft: 'auto', color: '#888' }}>Scarica</span>
          </a>
        ))}
      </div>

      <Link href="/brand" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Brand</Link>
    </div>
  )
}
