import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Arredi a Palermo — Quadri, Soprammobili e Lampadari',
  description: 'Arredi su misura a Palermo: quadri, soprammobili e lampadari selezionati per valorizzare ogni ambiente. Consulenza e fornitura a domicilio.',
  alternates: { canonical: 'https://www.digi-home-design.com/arredi' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Arredi a Palermo — Quadri, Soprammobili e Lampadari',
    description: 'Arredi su misura a Palermo: quadri, soprammobili e lampadari selezionati per valorizzare ogni ambiente. Consulenza e fornitura a domicilio.',
    url: 'https://www.digi-home-design.com/arredi',
    type: 'website',
  },
}

const subcategories = [
  {
    href: '/arredi/quadri',
    label: 'Quadri',
    desc: 'Quadri e opere d\'arte per decorare pareti e ambienti con stile e personalità.',
  },
  {
    href: '/arredi/soprammobili',
    label: 'Soprammobili',
    desc: 'Soprammobili e oggetti decorativi selezionati per completare l\'arredo di ogni stanza.',
  },
  {
    href: '/arredi/lampadari',
    label: 'Lampadari',
    desc: 'Lampadari e punti luce design per illuminare e valorizzare ogni spazio.',
  },
]

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Arredi
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Arredi a Palermo
      </h1>
      <p style={{ marginBottom: 36 }}>
        Completiamo ogni progetto di ristrutturazione con una selezione curata di arredi e complementi d&apos;arredo. Quadri, soprammobili e lampadari scelti per armonizzarsi con lo stile della tua casa.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {subcategories.map(s => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              flex: '1 1 240px',
              border: '2px solid #c8960c',
              borderRadius: 10,
              padding: '24px 20px',
              textDecoration: 'none',
              color: '#1a1a1a',
              background: '#fafafa',
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
