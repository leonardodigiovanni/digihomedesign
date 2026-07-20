import Link from 'next/link'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

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
  { href: '/tessuti/divani',    label: 'Divani',    desc: 'Rivestimenti in tessuto su misura, rifacimento imbottitura e personalizzazione completa per ogni stile.' },
  { href: '/tessuti/tendaggi',  label: 'Tendaggi',  desc: 'Tende da interno, a rullo, oscuranti e sistemi filtranti su misura per casa e ufficio.' },
]

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Tessuti<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Tessuti a Palermo
      </h1>
      <p className="testo-articoli" style={{ marginBottom: 16 }}>
        Dalla tradizione artigiana nata nel 1972, il nostro reparto tessuti offre soluzioni su misura per arredare e personalizzare ogni ambiente. Scegli la categoria per scoprire i nostri servizi.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {subcategories.map(s => (
          <Link key={s.href} href={s.href} style={{ flex: '1 1 240px', border: '1px solid #c8960c', borderRadius: 10, padding: '16px 14px', textDecoration: 'none', color: '#1a1a1a', background: '#fafafa' }}>
            <div className="fs-17" style={{ fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
            <div className="fs-14" style={{ color: '#555', lineHeight: 1.6 }}>{s.desc}</div>
          </Link>
        ))}
      </div>
      <StickyBottomBarContent>
        <Link href="/" className="btn-black fs-12">← Home</Link>
        <CtaPreventivo />
        <CtaCantiere />
        <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
      </StickyBottomBarContent>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo indice di categoria</p>
    </div>
  )
}
