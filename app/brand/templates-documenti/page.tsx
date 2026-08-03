import Link from 'next/link'
import type { Metadata } from 'next'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Documenti Legali — Digi Home Design Palermo',
  description: 'Scarica i documenti legali ufficiali Digi Home Design: privacy policy, cookie policy, condizioni generali di vendita e altro.',
  alternates: { canonical: 'https://www.digi-home-design.com/chi-siamo/templates-documenti' },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/chi-siamo" style={{ color: '#888', textDecoration: 'underline' }}>Chi Siamo</Link> / Documenti Legali<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Documenti Legali</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Raccolta dei modelli di documento ufficiali Digi Home Design: contratti di appalto, moduli di accettazione preventivo, dichiarazioni di conformità impianti, verbali di consegna lavori e liberatorie per accesso cantiere.</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>I template sono disponibili in formato PDF, pronti per essere scaricati. Per modelli personalizzati o versioni aggiornate contatta il nostro ufficio amministrativo.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Privacy Policy & Cookie Policy',        file: 'privacy-cookie-policy.pdf'              },
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
              background: '#fff', border: '1px solid #c8960c', borderRadius: 8,
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

      <StickyBottomBarContent>
        <Link href="/chi-siamo" className="btn-black fs-12">← Chi Siamo</Link>
      </StickyBottomBarContent>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>trovare i pdf online e capire come vengono accettati dal cliente</p>
    </div>
  )
}
