import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verande a Palermo — Progettazione e Installazione',
  description: 'Verande a Palermo su misura: alluminio, vetro e strutture pergolate per vivere gli spazi esterni tutto l\'anno. Preventivo gratuito e installazione inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/verande' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Verande a Palermo — Progettazione e Installazione',
    description: 'Verande a Palermo su misura: alluminio, vetro e strutture pergolate per vivere gli spazi esterni tutto l\'anno. Preventivo gratuito e installazione inclusa.',
    url: 'https://www.digi-home-design.com/verande',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
        Verande a Palermo
      </h1>
      <p>
        Realizziamo <strong>verande a Palermo</strong> su misura per terrazzi, giardini e balconi: strutture in alluminio con vetrate scorrevoli, sistemi a doppia anta e coperture pergolate che ti permettono di vivere gli spazi esterni in ogni stagione dell&apos;anno, al riparo da sole, vento e pioggia.
      </p>
      <p style={{ marginTop: 12 }}>
        Ogni verandina viene progettata in base alle dimensioni e alle caratteristiche dello spazio, rispettando i regolamenti edilizi locali e valorizzando l&apos;estetica dell&apos;immobile. Utilizziamo materiali resistenti alla salsedine e alle condizioni climatiche tipiche della Sicilia.
      </p>
      <p style={{ marginTop: 12 }}>
        Siamo a tua disposizione per un sopralluogo gratuito e un preventivo personalizzato. Dalla progettazione all&apos;installazione, seguiamo ogni fase del lavoro con un unico referente dedicato.
      </p>
      {/* CTA esclusivi */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 40, padding: '20px', background: '#fdfcf8', border: '1px solid #e8d89a', borderRadius: 10 }}>
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px' }}>Hai un progetto in mente?</p>
          <Link href="/aiuto/guida-preventivo" style={{ display: 'inline-block', padding: '10px 20px', background: '#c8960c', color: '#fff', borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            Calcola il tuo preventivo
          </Link>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px' }}>Hai già un cantiere aperto?</p>
          <Link href="/aiuto/guida-cantiere" style={{ display: 'inline-block', padding: '10px 20px', background: '#1a1a1a', color: '#fff', borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            Segui il tuo cantiere online
          </Link>
        </div>
      </div>
      <Link href="/" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna alla home
      </Link>
    </div>
  )
}
