import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Zanzariere a Palermo — A Rullo, Plissé e Telaio Fisso su Misura',
  description: 'Zanzariere su misura a Palermo: a rullo verticale, plissé, a telaio fisso e scorrevoli. Per finestre, porte e aperture di qualsiasi dimensione. Posa inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/zanzariere' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Zanzariere a Palermo — A Rullo, Plissé e Telaio Fisso su Misura',
    description: 'Zanzariere su misura a Palermo: a rullo verticale, plissé, a telaio fisso e scorrevoli. Per finestre, porte e aperture di qualsiasi dimensione. Posa inclusa.',
    url: 'https://www.digi-home-design.com/serramenti/zanzariere',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Zanzariere
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Zanzariere a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/serramenti/zanzariere/zanzariera.jpg" alt="Zanzariera su misura" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Zanzariera su misura</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 280, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/serramenti/zanzariere/zanzariere.jpg" alt="Zanzariere installate" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Zanzariere installate</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo e installiamo <strong>zanzariere su misura a Palermo</strong> per ogni tipo di apertura: a telaio fisso estraibile per finestre standard, a rullo verticale con molla a richiamoautomatico, plissé orizzontale per porte-finestre e balconi, scorrevoli su binario laterale per grandi aperture e zanzariere a soffitto per verande e porticati.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I telai sono in alluminio anodizzato o verniciato, abbinabili al colore degli infissi esistenti. Le reti sono disponibili in fibra di vetro standard, in acciaio inox per ambienti marini, anti-polline ad alta densità e con trattamento antizanzara larvicida. I sistemi a rullo con cassonetto integrato nell&apos;infisso sono la soluzione più elegante perché invisibili quando non in uso.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni zanzariera viene misurata sul posto e prodotta su misura in pochi giorni. Contattaci per un preventivo gratuito a Palermo e provincia.
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

      <Link href="/serramenti" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Serramenti</Link>
    </div>
  )
}
