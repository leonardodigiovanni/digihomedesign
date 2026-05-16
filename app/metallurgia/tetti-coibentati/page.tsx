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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Prima riga: primo articolo + foto */}
          <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
              <p className="testo-articoli" style={{ margin: 0 }}>
                Realizziamo e installiamo <strong>coperture metalliche coibentate a Palermo</strong> per abitazioni, ville, tettoie e capannoni industriali: pannelli sandwich con anima in poliuretano o lana di roccia, lamiera grecata zincata con strato isolante, coperture in alluminio e acciaio preverniciato. I tetti coibentati garantiscono ottimo isolamento termico, eliminano i ponti freddi e riducono significativamente il carico degli impianti di climatizzazione.
              </p>
            </div>
            <div className="storia-foto" style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
              <div className="page-card storia-card-1" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/metallurgia/tetti-coibentati/photo_2026-04-15_23-21-19.jpg" alt="Tetto coibentato realizzato" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
              <div className="page-card storia-card-2" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/metallurgia/tetti-coibentati/photo_2026-04-15_23-21-22.jpg" alt="Copertura metallica coibentata" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Secondo articolo */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I pannelli sandwich sono disponibili in spessori da 40 a 120 mm, con rivestimento esterno in acciaio zincato o alluminio in vari colori RAL. Realizziamo anche interventi di coibentazione su coperture esistenti con pannelli aggiuntivi o materassini isolanti sotto lamiera.
            </p>
          </div>

        </div>

        {/* Terzo articolo */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Gestiamo la posa completa dalla struttura portante alla copertura finita. Contattaci per un sopralluogo e un preventivo gratuito a Palermo e provincia.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px 28px', background: '#fdfcf8', border: '1px solid #e8d89a', borderRadius: 10 }}>
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
