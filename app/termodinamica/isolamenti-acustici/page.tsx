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
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Isolamenti Acustici
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Isolamenti Acustici a Palermo</h1>

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

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/termodinamica" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>← Torna a Termodinamica</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
