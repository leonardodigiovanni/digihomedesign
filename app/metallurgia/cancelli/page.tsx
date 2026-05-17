import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Cancelli a Palermo — Ferro Battuto e Acciaio Manuali o Motorizzati',
  description: 'Cancelli a Palermo su misura: carrabili e pedonali in ferro, acciaio e alluminio, manuali o con automazione. Scorrevoli, a battente e a libro.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/cancelli' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Cancelli a Palermo — Ferro Battuto e Acciaio Manuali o Motorizzati',
    description: 'Cancelli a Palermo su misura: carrabili e pedonali in ferro, acciaio e alluminio, manuali o con automazione. Scorrevoli, a battente e a libro.',
    url: 'https://www.digi-home-design.com/metallurgia/cancelli',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Cancelli
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Cancelli a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/metallurgia/cancelli/photo_2026-04-15_23-23-34.jpg" alt="Cancello su misura" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Cancello su misura</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 280, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/metallurgia/cancelli/scorrevole.jpg" alt="Cancello scorrevole" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Cancello scorrevole</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Progettiamo e installiamo <strong>cancelli su misura a Palermo</strong>: carrabili scorrevoli, a battente singolo e doppio, a libro e sollevabili in ferro zincato, acciaio inox o alluminio estruso. I cancelli vengono realizzati in officina su disegno tecnico e verniciati a polvere epossidica per la massima resistenza agli agenti atmosferici.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Installiamo automazioni per apertura motorizzata con operatori interrati o a braccio dei principali marchi — FAAC, Nice, BFT, Came — con telecomandi, tastiere a codice, videocitofoni e lettori di transponder. I sistemi sono predisposti per l&apos;integrazione con impianti domotici e videosorveglianza.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo anche cancelletti pedonali a fianco e recinzioni perimetrali abbinate. Contattaci per un sopralluogo gratuito e un progetto con rendering 3D.
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
