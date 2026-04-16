import Link from 'next/link'
import type { Metadata } from 'next'

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
  { href: '/termodinamica/climatizzazione',     label: 'Climatizzazione',       desc: 'Installazione e manutenzione di condizionatori e sistemi di climatizzazione.' },
  { href: '/termodinamica/isolamenti-termici',  label: 'Isolamenti Termici',    desc: 'Cappotti termici e soluzioni per ridurre le dispersioni di calore.' },
  { href: '/termodinamica/isolamenti-acustici', label: 'Isolamenti Acustici',   desc: 'Pannelli e sistemi fonoassorbenti per ambienti silenziosi e confortevoli.' },
  { href: '/termodinamica/caldaie',             label: 'Caldaie',               desc: 'Fornitura, installazione e manutenzione di caldaie a gas e a condensazione.' },
  { href: '/termodinamica/pompe-di-calore',     label: 'Pompe di Calore',       desc: 'Sistemi ad alta efficienza per riscaldamento e raffrescamento con energia rinnovabile.' },
  { href: '/termodinamica/impianti-idraulici',  label: 'Impianti Idraulici',    desc: 'Progettazione e realizzazione di impianti idraulici civili e industriali.' },
  { href: '/termodinamica/irrigazione',         label: 'Irrigazione',           desc: 'Impianti di irrigazione automatica per giardini, terrazzi e spazi verdi.' },
  { href: '/termodinamica/allacci',             label: 'Allacci',               desc: 'Allacci idrici, gas ed elettrici: pratiche, scavi e collaudi.' },
]

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
        Termodinamica a Palermo
      </h1>
      <p style={{ marginBottom: 36 }}>
        Progettiamo e installiamo impianti termici, idraulici e di climatizzazione per abitazioni, uffici e spazi commerciali a Palermo. Un unico referente per tutto il comfort dell&apos;edificio.
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
