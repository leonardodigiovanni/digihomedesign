import Link from 'next/link'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Termodinamica a Palermo — Climatizzazione, Caldaie e Impianti',
  description: 'Impianti termodinamici a Palermo: climatizzazione, caldaie, pompe di calore, isolamenti termici e acustici, impianti idraulici, irrigazione e allacci.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Termodinamica a Palermo — Climatizzazione, Caldaie e Impianti',
    description: 'Impianti termodinamici a Palermo: climatizzazione, caldaie, pompe di calore, isolamenti termici e acustici, impianti idraulici, irrigazione e allacci.',
    url: 'https://www.digi-home-design.com/termodinamica',
    type: 'website',
  },
}

const subcategories = [
  { href: '/termodinamica/climatizzazione',     label: 'Climatizzazione',    desc: 'Installazione e manutenzione di condizionatori e sistemi di climatizzazione.' },
  { href: '/termodinamica/isolamenti-termici',  label: 'Isolamenti Termici', desc: 'Cappotti termici e soluzioni per ridurre le dispersioni di calore.' },
  { href: '/termodinamica/isolamenti-acustici', label: 'Isolamenti Acustici',desc: 'Pannelli e sistemi fonoassorbenti per ambienti silenziosi e confortevoli.' },
  { href: '/termodinamica/caldaie',             label: 'Caldaie',            desc: 'Fornitura, installazione e manutenzione di caldaie a gas e a condensazione.' },
  { href: '/termodinamica/pompe-di-calore',     label: 'Pompe di Calore',   desc: 'Sistemi ad alta efficienza per riscaldamento e raffrescamento con energia rinnovabile.' },
  { href: '/termodinamica/impianti-idraulici',  label: 'Impianti Idraulici', desc: 'Progettazione e realizzazione di impianti idraulici civili e industriali.' },
  { href: '/termodinamica/irrigazione',         label: 'Irrigazione',        desc: 'Impianti di irrigazione automatica per giardini, terrazzi e spazi verdi.' },
  { href: '/termodinamica/allacci',             label: 'Allacci',            desc: 'Allacci idrici, gas ed elettrici: pratiche, scavi e collaudi.' },
]

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Termodinamica
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Termodinamica a Palermo
      </h1>
      <p className="testo-articoli" style={{ marginBottom: 16 }}>
        Progettiamo e installiamo impianti termici, idraulici e di climatizzazione per abitazioni, uffici e spazi commerciali a Palermo. Un unico referente per tutto il comfort dell&apos;edificio.
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
