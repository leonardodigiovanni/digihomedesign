import Link from 'next/link'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Legno a Palermo — Porte, Cucine, Mobili e Parquet',
  description: 'Lavorazioni in legno a Palermo: porte interne, porte scrigno, cucine, mobili in massello, parquet, rivestimenti e infissi. Artigianato e qualità dal 1972.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Legno a Palermo — Porte, Cucine, Mobili e Parquet',
    description: 'Lavorazioni in legno a Palermo: porte interne, porte scrigno, cucine, mobili in massello, parquet, rivestimenti e infissi. Artigianato e qualità dal 1972.',
    url: 'https://www.digi-home-design.com/legno',
    type: 'website',
  },
}

const subcategories = [
  { href: '/legno/porte-interne',           label: 'Porte Interne',           desc: 'Porte interne in legno su misura, battenti e scorrevoli per ogni stile.' },
  { href: '/legno/porte-scrigno',           label: 'Porte Scrigno',           desc: 'Porte a scomparsa nel muro per spazi moderni e privi di ingombri.' },
  { href: '/legno/cucine',                  label: 'Cucine',                  desc: 'Cucine in legno su misura: componibili e in muratura, dal classico al moderno.' },
  { href: '/legno/mobili-in-massello',      label: 'Mobili in Massello',      desc: 'Mobili artigianali in legno massello, solidi e duraturi nel tempo.' },
  { href: '/legno/mobili-tamburati',        label: 'Mobili Tamburati',        desc: 'Mobili in legno tamburato: leggerezza e design a prezzi accessibili.' },
  { href: '/legno/parquet',                 label: 'Parquet',                 desc: 'Pavimenti in parquet: posa, levigatura e trattamento di tutte le essenze.' },
  { href: '/legno/rivestimento-compensato', label: 'Rivestimento Compensato', desc: 'Rivestimenti in compensato per pareti, soffitti e superfici decorative.' },
  { href: '/legno/infissi-in-legno',        label: 'Infissi in Legno',        desc: 'Finestre e porte-finestre in legno su misura, classic o legno-alluminio.' },
]

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Legno
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Legno a Palermo
      </h1>
      <p className="testo-articoli" style={{ marginBottom: 16 }}>
        Il legno è il materiale che più di ogni altro trasmette calore e carattere agli ambienti. Dalla tradizione artigiana del 1972 proponiamo porte, cucine, mobili, parquet e infissi in legno realizzati su misura a Palermo.
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
