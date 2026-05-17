import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Tapparelle Manuali a Palermo — PVC, Alluminio e Acciaio su Misura',
  description: 'Tapparelle manuali a Palermo su misura: cinghia, manovella o moschettone in PVC coibentato, alluminio estruso e acciaio. Fornitura e posa con garanzia.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/tapparelle-manuali' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tapparelle Manuali a Palermo — PVC, Alluminio e Acciaio su Misura',
    description: 'Tapparelle manuali a Palermo su misura: cinghia, manovella o moschettone in PVC coibentato, alluminio estruso e acciaio. Fornitura e posa con garanzia.',
    url: 'https://www.digi-home-design.com/serramenti/tapparelle-manuali',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Tapparelle Manuali
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Tapparelle Manuali a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/serramenti/tapparelle-manuali/20240802_170856.jpg" alt="Tapparelle manuali installate" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Tapparelle manuali installate</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 280, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/serramenti/tapparelle-manuali/photo_2026-04-15_23-14-37.jpg" alt="Tapparelle manuali su misura" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Tapparelle manuali su misura</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Forniamo e installiamo <strong>tapparelle manuali su misura a Palermo</strong> in PVC coibentato, alluminio estruso e acciaio zincato: a cinghia, a manovella laterale o a moschettone, con avvolgitore a cassonetto incassato o a vista. Le tapparelle manuali sono la soluzione più semplice e affidabile per oscuramento, isolamento termoacustico e sicurezza delle aperture.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le doghe in PVC coibentato garantiscono ottimo isolamento termico e acustico, riducendo i ponti freddi e il rumore esterno. Le doghe in alluminio estruso sono più leggere e resistenti alla corrosione, ideali per ambienti marini o ad alta umidità. Disponibili in tutti i colori RAL e con finiture effetto legno.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni tapparella viene misurata sul posto e realizzata su misura. Contattaci per un preventivo gratuito a Palermo e provincia.
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
