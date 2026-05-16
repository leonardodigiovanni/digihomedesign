import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Ringhiere a Palermo — Scale e Balconi in Ferro e Acciaio Inox',
  description: 'Ringhiere su misura a Palermo per scale interne, balconi e terrazze: ferro battuto, acciaio inox, alluminio e vetro. Design classico e moderno.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/ringhiere' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Ringhiere a Palermo — Scale e Balconi in Ferro e Acciaio Inox',
    description: 'Ringhiere su misura a Palermo per scale interne, balconi e terrazze: ferro battuto, acciaio inox, alluminio e vetro. Design classico e moderno.',
    url: 'https://www.digi-home-design.com/metallurgia/ringhiere',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Ringhiere
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Ringhiere a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Prima riga: primo articolo + foto */}
          <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
              <p className="testo-articoli" style={{ margin: 0 }}>
                Progettiamo e installiamo <strong>ringhiere su misura a Palermo</strong> per scale interne ed esterne, balconi, terrazze e soppalchi: in ferro verniciato, acciaio inox AISI 316L, alluminio anodizzato o sistemi misti acciaio-vetro per un effetto contemporaneo di massima luminosità.
              </p>
            </div>
            <div className="storia-foto" style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
              <div className="page-card storia-card-1" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/metallurgia/ringhiere/photo_2026-04-15_23-15-39.jpg" alt="Ringhiera su misura" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
              <div className="page-card storia-card-2" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/metallurgia/ringhiere/photo_2026-04-15_23-15-42.jpg" alt="Ringhiera installata" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Secondo articolo */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le ringhiere in ferro battuto vengono lavorate artigianalmente con motivi classici — a lancia, a torciglione, con rosoni — o moderne con piattina e quadro geometrico. I sistemi in acciaio inox con cavi o pannelli in vetro temperato laminato sono ideali per ambienti di design dove si vuole mantenere la continuità visiva dello spazio.
            </p>
          </div>

        </div>

        {/* Terzo articolo */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Ogni ringhiera rispetta le norme UNI EN 13374 sull&apos;altezza e la resistenza ai carichi. Contattaci per un sopralluogo gratuito e un preventivo personalizzato.
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
