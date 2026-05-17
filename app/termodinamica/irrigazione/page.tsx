import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Irrigazione a Palermo — Impianti Automatici per Giardini',
  description: 'Impianti di irrigazione automatica a Palermo per giardini, terrazzi e spazi verdi. Progettazione, installazione e programmazione di sistemi a goccia e a pioggia.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/irrigazione' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Irrigazione a Palermo — Impianti Automatici per Giardini',
    description: 'Impianti di irrigazione automatica a Palermo per giardini, terrazzi e spazi verdi. Progettazione, installazione e programmazione di sistemi a goccia e a pioggia.',
    url: 'https://www.digi-home-design.com/termodinamica/irrigazione',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Irrigazione
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Irrigazione a Palermo
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
              Progettiamo e installiamo <strong>impianti di irrigazione automatica a Palermo</strong> per giardini privati, terrazzi, aiuole condominiali e spazi verdi commerciali. Sistemi a goccia per orti e aiuole, irrigatori a pioggia per prati, e microirrigatori per vasi e fioriere: ogni soluzione è dimensionata sulle reali esigenze della vegetazione.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli impianti sono dotati di programmatori digitali o smart (controllabili da smartphone) per ottimizzare i consumi idrici in base alla stagione e alle condizioni climatiche. Integriamo sensori di pioggia e umidità per evitare sprechi.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio comprende sopralluogo gratuito, progettazione del layout, posa delle tubazioni interrate, collegamento alla rete idrica e collaudo finale. Contattaci per un preventivo su misura.
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

      <Link href="/termodinamica" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Termodinamica
      </Link>
    </div>
  )
}
