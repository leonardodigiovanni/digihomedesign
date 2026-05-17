import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'

import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Strutture Metalliche a Palermo — Tettoie, Pensiline, Pergolati',
  description: 'Strutture metalliche a Palermo: tettoie, pensiline, scale e pergolati su misura in acciaio e alluminio. Progettazione e installazione professionale.',
  alternates: { canonical: 'https://www.digi-home-design.com/strutture-metalliche' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Strutture Metalliche a Palermo — Tettoie, Pensiline, Pergolati',
    description: 'Strutture metalliche a Palermo: tettoie, pensiline, scale e pergolati su misura in acciaio e alluminio. Progettazione e installazione professionale.',
    url: 'https://www.digi-home-design.com/strutture-metalliche',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Strutture Metalliche
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Strutture Metalliche a Palermo
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
              Progettiamo e installiamo <strong>strutture metalliche a Palermo</strong> su misura: tettoie, pensiline, scale interne ed esterne, pergolati e carport in acciaio zincato e alluminio. Ogni struttura viene dimensionata da tecnici qualificati nel rispetto delle normative antisismiche e delle prescrizioni edilizie locali.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo sia strutture di copertura per spazi esterni — garage, aree commerciali, cortili — sia elementi decorativi e funzionali per abitazioni private. I materiali utilizzati garantiscono resistenza agli agenti atmosferici e durata nel tempo, con finiture zincate, verniciate o in acciaio inox.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Offriamo un servizio completo: progettazione, pratica edilizia se necessaria, fornitura e montaggio con squadre specializzate. Contattaci per un sopralluogo gratuito e un preventivo su misura.
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
