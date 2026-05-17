import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'

import CtaCantiere from '@/components/cta-cantiere'
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
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Verande
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Verande a Palermo
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 280, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo <strong>verande a Palermo</strong> su misura per terrazzi, giardini e balconi: strutture in alluminio con vetrate scorrevoli, sistemi a doppia anta e coperture pergolate che ti permettono di vivere gli spazi esterni in ogni stagione dell&apos;anno, al riparo da sole, vento e pioggia.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni verandina viene progettata in base alle dimensioni e alle caratteristiche dello spazio, rispettando i regolamenti edilizi locali e valorizzando l&apos;estetica dell&apos;immobile. Utilizziamo materiali resistenti alla salsedine e alle condizioni climatiche tipiche della Sicilia.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Siamo a tua disposizione per un sopralluogo gratuito e un preventivo personalizzato. Dalla progettazione all&apos;installazione, seguiamo ogni fase del lavoro con un unico referente dedicato.
            </p>
          </div>

        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px 28px', background: '#fdfcf8', border: '2px solid #c8960c', borderRadius: 10 }}>
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
            <p className="testo-articoli" style={{ margin: '0 0 12px' }}>Hai un progetto in mente?</p>
            <CtaPreventivo />
          </div>
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
            <p className="testo-articoli" style={{ margin: '0 0 12px' }}>Hai già un cantiere aperto?</p>
            <CtaCantiere />
          </div>
        </div>

      </div>

      <Link href="/" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna alla home
      </Link>
    </div>
  )
}
