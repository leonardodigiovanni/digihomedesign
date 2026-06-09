import Link from 'next/link'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

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
  { href: '/elettricita/impianti-elettrici', label: 'Impianti Elettrici', desc: 'Progettazione e realizzazione di impianti elettrici civili e industriali a norma.' },
  { href: '/elettricita/illuminazione',      label: 'Illuminazione',      desc: 'Sistemi di illuminazione LED per interni ed esterni, design e risparmio energetico.' },
  { href: '/elettricita/elettrodomestici',   label: 'Elettrodomestici',   desc: 'Fornitura, installazione e collegamento di grandi e piccoli elettrodomestici.' },
  { href: '/elettricita/pannelli-solari',    label: 'Pannelli Solari',    desc: 'Impianti fotovoltaici e termici per la produzione di energia rinnovabile.' },
  { href: '/elettricita/domotica',           label: 'Domotica',           desc: 'Sistemi smart home per controllo luci, tapparelle, riscaldamento e sicurezza.' },
  { href: '/elettricita/videosorveglianza',  label: 'Videosorveglianza',  desc: 'Impianti TVCC e sistemi di videosorveglianza IP per casa e ufficio.' },
]

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Elettricità
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Elettricità a Palermo
      </h1>
      <p className="testo-articoli" style={{ marginBottom: 16 }}>
        Progettiamo e installiamo impianti elettrici, sistemi fotovoltaici, soluzioni domotiche e di sicurezza per abitazioni, uffici e spazi commerciali a Palermo. Tecnici abilitati D.M. 37/08.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {subcategories.map(s => (
          <Link key={s.href} href={s.href} style={{ flex: '1 1 240px', border: '1px solid #c8960c', borderRadius: 10, padding: '16px 14px', textDecoration: 'none', color: '#1a1a1a', background: '#fafafa' }}>
            <div className="fs-17" style={{ fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
            <div className="fs-14" style={{ color: '#555', lineHeight: 1.6 }}>{s.desc}</div>
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link href="/" className="btn-black fs-12" style={{ flex: 1 }}>← Home</Link>
        <CtaPreventivo />
        <CtaCantiere />
        <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1 }}>Chiedi info</Link>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo indice di categoria</p>
    </div>
  )
}
