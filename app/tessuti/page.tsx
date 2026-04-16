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
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
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
              border: '1px solid #e0e0e0',
              borderRadius: 10,
              padding: '24px 20px',
              textDecoration: 'none',
              color: '#1a1a1a',
              background: '#fafafa',
              transition: 'box-shadow 0.15s',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{s.desc}</div>
          </Link>
        ))}
      </div>

      <Link href="/" style={{ display: 'inline-block', marginTop: 40, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna alla home
      </Link>
    </div>
  )
}
