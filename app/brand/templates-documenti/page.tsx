import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documenti Legali — Digi Home Design Palermo',
  description: 'Scarica i documenti legali ufficiali Digi Home Design: privacy policy, cookie policy, condizioni generali di vendita e altro.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/templates-documenti' },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Documenti Legali
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Documenti Legali</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Raccolta dei modelli di documento ufficiali Digi Home Design: contratti di appalto, moduli di accettazione preventivo, dichiarazioni di conformità impianti, verbali di consegna lavori e liberatorie per accesso cantiere.</p>
        </div>
        <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>I template sono disponibili in formato PDF, pronti per essere scaricati. Per modelli personalizzati o versioni aggiornate contatta il nostro ufficio amministrativo.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { label: 'Privacy Policy',                        file: 'privacy-policy.pdf'                    },
          { label: 'Cookie Policy',                         file: 'cookie-policy.pdf'                     },
          { label: 'Consenso Marketing Newsletter e SMS',   file: 'consenso-marketing-newsletter-sms.pdf' },
        ].map(d => (
          <a
            key={d.file}
            href={`/docs/${d.file}`}
            download
            className="fs-14"
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px',
              background: '#fff', border: '2px solid #c8960c', borderRadius: 8,
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
