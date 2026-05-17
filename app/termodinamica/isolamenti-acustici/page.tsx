import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Isolamenti Acustici a Palermo — Fonoisolamento e Fonoassorbimento',
  description: 'Isolamento acustico a Palermo per abitazioni, uffici e studi: pannelli fonoassorbenti, contropareti, pavimenti galleggianti e soluzioni su misura.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/isolamenti-acustici' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Isolamenti Acustici a Palermo — Fonoisolamento e Fonoassorbimento',
    description: 'Isolamento acustico a Palermo per abitazioni, uffici e studi: pannelli fonoassorbenti, contropareti, pavimenti galleggianti e soluzioni su misura.',
    url: 'https://www.digi-home-design.com/termodinamica/isolamenti-acustici',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Isolamenti Acustici
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Isolamenti Acustici a Palermo
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
              Il <strong>comfort acustico</strong> è parte integrante della qualità abitativa. Progettiamo e installiamo soluzioni di isolamento acustico su misura per appartamenti, uffici, studi di registrazione, sale riunioni e locali commerciali a Palermo.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le nostre soluzioni comprendono: contropareti con pannelli in lana di roccia o fibra di vetro, pavimenti galleggianti per ridurre i rumori da calpestio, controsoffitti fonoassorbenti e trattamenti delle giunzioni strutturali per eliminare i ponti acustici. Ogni soluzione viene progettata dopo un&apos;analisi delle frequenze e dei percorsi del rumore.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Rispettiamo la normativa DPCM 5/12/1997 sui requisiti acustici passivi degli edifici. Contattaci per una valutazione gratuita del tuo spazio.
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
