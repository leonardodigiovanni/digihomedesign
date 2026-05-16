import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Grate di Sicurezza a Palermo — Finestre e Vani in Ferro',
  description: 'Grate di sicurezza a Palermo per finestre, vani e aperture: in ferro quadro, tondo e acciaio inox. Fisse, apribili a cardine e scorrevoli. Su misura.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/grate' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Grate di Sicurezza a Palermo — Finestre e Vani in Ferro',
    description: 'Grate di sicurezza a Palermo per finestre, vani e aperture: in ferro quadro, tondo e acciaio inox. Fisse, apribili a cardine e scorrevoli. Su misura.',
    url: 'https://www.digi-home-design.com/metallurgia/grate',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Grate
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Grate di Sicurezza a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Prima riga: primo articolo + foto */}
          <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
              <p className="testo-articoli" style={{ margin: 0 }}>
                Realizziamo e installiamo <strong>grate di sicurezza a Palermo</strong> per la protezione di finestre, vani cantina, bocche di lupo e aperture di qualsiasi dimensione. Lavoriamo con ferro quadro, piatto e tondo, acciaio inox AISI 304 e alluminio, con saldature a piena penetrazione e verniciatura a polvere epossidica.
              </p>
            </div>
            <div className="storia-foto" style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
              <div className="page-card storia-card-1" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/metallurgia/grate/photo_2026-04-15_23-16-19.jpg" alt="Grata di sicurezza" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
              <div className="page-card storia-card-2" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/metallurgia/grate/photo_2026-04-15_23-16-22.jpg" alt="Grata installata" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Secondo articolo */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le grate sono disponibili in versione fissa a muro, apribile a cardine con serratura di sicurezza (obbligatoria come via di fuga secondo il D.M. 9/04/1994), o scorrevole su binario. I pattern decorativi spaziano dal classico a lancia al moderno geometrico, con possibilità di inserire motivi personalizzati in ferro battuto.
            </p>
          </div>

        </div>

        {/* Terzo articolo */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Ogni grata viene misurata sul posto e realizzata su misura. Contattaci per un sopralluogo gratuito e un preventivo a Palermo e provincia.
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
