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
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Verande
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Verande a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>← Home</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
