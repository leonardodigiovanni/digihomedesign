import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Elettricità a Palermo — Impianti, Fotovoltaico e Domotica',
  description: 'Impianti elettrici a Palermo: illuminazione, elettrodomestici, pannelli solari, domotica e videosorveglianza. Tecnici abilitati, preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/elettricita' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Elettricità a Palermo — Impianti, Fotovoltaico e Domotica',
    description: 'Impianti elettrici a Palermo: illuminazione, elettrodomestici, pannelli solari, domotica e videosorveglianza. Tecnici abilitati, preventivo gratuito.',
    url: 'https://www.digi-home-design.com/elettricita',
    type: 'website',
  },
}

const subcategories = [
  { href: '/elettricita/impianti-elettrici',  label: 'Impianti Elettrici',  desc: 'Progettazione e realizzazione di impianti elettrici civili e industriali a norma.' },
  { href: '/elettricita/illuminazione',        label: 'Illuminazione',        desc: 'Sistemi di illuminazione LED per interni ed esterni, design e risparmio energetico.' },
  { href: '/elettricita/elettrodomestici',     label: 'Elettrodomestici',     desc: 'Fornitura, installazione e collegamento di grandi e piccoli elettrodomestici.' },
  { href: '/elettricita/pannelli-solari',      label: 'Pannelli Solari',      desc: 'Impianti fotovoltaici e termici per la produzione di energia rinnovabile.' },
  { href: '/elettricita/domotica',             label: 'Domotica',             desc: 'Sistemi smart home per controllo luci, tapparelle, riscaldamento e sicurezza.' },
  { href: '/elettricita/videosorveglianza',    label: 'Videosorveglianza',    desc: 'Impianti TVCC e sistemi di videosorveglianza IP per casa e ufficio.' },
]

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
        Elettricità a Palermo
      </h1>
      <p style={{ marginBottom: 36 }}>
        Progettiamo e installiamo impianti elettrici, sistemi fotovoltaici, soluzioni domotiche e di sicurezza per abitazioni, uffici e spazi commerciali a Palermo. Tecnici abilitati D.M. 37/08.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {subcategories.map(s => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              flex: '1 1 240px',
              border: '1px solid #e0e0e0',
              borderRadius: 10,
              padding: '24px 20px',
              textDecoration: 'none',
              color: '#1a1a1a',
              background: '#fafafa',
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{s.label}</div>
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
