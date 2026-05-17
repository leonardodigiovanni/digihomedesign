import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Opere Murarie a Palermo — Costruzione e Modifica Muri',
  description: 'Opere murarie a Palermo: costruzione di muri portanti e di tamponamento, aperture di vani e modifiche strutturali. Muratori esperti con progettazione inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/opere-murarie' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Opere Murarie a Palermo — Costruzione e Modifica Muri',
    description: 'Opere murarie a Palermo: costruzione di muri portanti e di tamponamento, aperture di vani e modifiche strutturali. Muratori esperti con progettazione inclusa.',
    url: 'https://www.digi-home-design.com/edilizia/opere-murarie',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Opere Murarie
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Opere Murarie a Palermo</h1>

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
              Realizziamo <strong>opere murarie a Palermo</strong> di ogni tipo: costruzione di nuovi muri portanti e di tamponamento, apertura di vani porta e finestra con posa di architravi, rinforzi strutturali, sopraelevazioni e ricostruzioni. Lavoriamo con laterizio, blocchi in cls, pietra naturale e sistemi a secco.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Per le modifiche strutturali collaboriamo con tecnici abilitati (ingegneri e geometri) per la redazione dei calcoli e il deposito delle pratiche in Comune. Ogni opera è eseguita a regola d&apos;arte con materiali certificati e garanzia sul lavoro.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Operiamo su tutto il territorio palermitano con sopralluogo gratuito e preventivo dettagliato. Contattaci per valutare il tuo intervento.
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

      <Link href="/edilizia" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Edilizia</Link>
    </div>
  )
}
