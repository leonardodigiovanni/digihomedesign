import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tessuti a Palermo — Divani e Tendaggi su Misura',
  description: 'Tessuti su misura a Palermo: rivestimenti divani, tendaggi e tende da interno. Artigianato di qualità, fornitura e posa in opera. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/tessuti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tessuti a Palermo — Divani e Tendaggi su Misura',
    description: 'Tessuti su misura a Palermo: rivestimenti divani, tendaggi e tende da interno. Artigianato di qualità, fornitura e posa in opera. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/tessuti',
    type: 'website',
  },
}

const subcategories = [
  {
    href: '/tessuti/divani',
    label: 'Divani',
    desc: 'Rivestimenti in tessuto su misura, rifacimento imbottitura e personalizzazione completa per ogni stile.',
  },
  {
    href: '/tessuti/tendaggi',
    label: 'Tendaggi',
    desc: 'Tende da interno, a rullo, oscuranti e sistemi filtranti su misura per casa e ufficio.',
  },
]

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Tessuti
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Tessuti a Palermo
      </h1>
      <p style={{ marginBottom: 36 }}>
        Dalla tradizione artigiana nata nel 1972, il nostro reparto tessuti offre soluzioni su misura per arredare e personalizzare ogni ambiente. Scegli la categoria per scoprire i nostri servizi.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {subcategories.map(s => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              flex: '1 1 280px',
              border: '2px solid #c8960c',
              borderRadius: 10,
              padding: '24px 20px',
              textDecoration: 'none',
              color: '#1a1a1a',
              background: '#fafafa',
              transition: 'box-shadow 0.15s',
            }}
          >
            <div className="fs-18" style={{ fontWeight: 700, marginBottom: 8 }}>{s.label}</div>
            <div className="fs-14" style={{ color: '#555', lineHeight: 1.6 }}>{s.desc}</div>
          </Link>
        ))}
      </div>

      <Link href="/" className="fs-12" style={{ display: 'inline-block', marginTop: 40, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna alla home
      </Link>
    </div>
  )
}
