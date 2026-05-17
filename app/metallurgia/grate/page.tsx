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

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/metallurgia/grate/photo_2026-04-15_23-16-19.jpg" alt="Grata di sicurezza" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Grata di sicurezza</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 280, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/metallurgia/grate/photo_2026-04-15_23-16-22.jpg" alt="Grata installata" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Grata installata</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo e installiamo <strong>grate di sicurezza a Palermo</strong> per la protezione di finestre, vani cantina, bocche di lupo e aperture di qualsiasi dimensione. Lavoriamo con ferro quadro, piatto e tondo, acciaio inox AISI 304 e alluminio, con saldature a piena penetrazione e verniciatura a polvere epossidica.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le grate sono disponibili in versione fissa a muro, apribile a cardine con serratura di sicurezza (obbligatoria come via di fuga secondo il D.M. 9/04/1994), o scorrevole su binario. I pattern decorativi spaziano dal classico a lancia al moderno geometrico, con possibilità di inserire motivi personalizzati in ferro battuto.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni grata viene misurata sul posto e realizzata su misura. Contattaci per un sopralluogo gratuito e un preventivo a Palermo e provincia.
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
