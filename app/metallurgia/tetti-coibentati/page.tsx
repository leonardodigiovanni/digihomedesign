import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Tetti Coibentati a Palermo — Coperture Metalliche su Misura',
  description: 'Tetti coibentati a Palermo: pannelli sandwich, lamiera grecata e coperture metalliche per abitazioni e capannoni industriali. Posa e coibentazione incluse.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/tetti-coibentati' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tetti Coibentati a Palermo — Coperture Metalliche su Misura',
    description: 'Tetti coibentati a Palermo: pannelli sandwich, lamiera grecata e coperture metalliche per abitazioni e capannoni industriali. Posa e coibentazione incluse.',
    url: 'https://www.digi-home-design.com/metallurgia/tetti-coibentati',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Tetti Coibentati
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Tetti Coibentati a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/metallurgia/tetti-coibentati/photo_2026-04-15_23-21-19.jpg" alt="Tetto coibentato realizzato" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Tetto coibentato realizzato</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 280, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/metallurgia/tetti-coibentati/photo_2026-04-15_23-21-22.jpg" alt="Copertura metallica coibentata" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Copertura metallica coibentata</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo e installiamo <strong>coperture metalliche coibentate a Palermo</strong> per abitazioni, ville, tettoie e capannoni industriali: pannelli sandwich con anima in poliuretano o lana di roccia, lamiera grecata zincata con strato isolante, coperture in alluminio e acciaio preverniciato. I tetti coibentati garantiscono ottimo isolamento termico, eliminano i ponti freddi e riducono significativamente il carico degli impianti di climatizzazione.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I pannelli sandwich sono disponibili in spessori da 40 a 120 mm, con rivestimento esterno in acciaio zincato o alluminio in vari colori RAL. Realizziamo anche interventi di coibentazione su coperture esistenti con pannelli aggiuntivi o materassini isolanti sotto lamiera.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gestiamo la posa completa dalla struttura portante alla copertura finita. Contattaci per un sopralluogo e un preventivo gratuito a Palermo e provincia.
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

      <Link href="/metallurgia" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Metallurgia</Link>
    </div>
  )
}
