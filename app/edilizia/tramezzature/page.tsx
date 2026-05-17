import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Tramezzature a Palermo — Laterizio, Cartongesso e Blocchi',
  description: 'Tramezzature a Palermo: realizzazione di pareti divisorie in laterizio forato, cartongesso e blocchi in cls. Rapide, economiche e con isolamento incluso.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/tramezzature' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tramezzature a Palermo — Laterizio, Cartongesso e Blocchi',
    description: 'Tramezzature a Palermo: realizzazione di pareti divisorie in laterizio forato, cartongesso e blocchi in cls. Rapide, economiche e con isolamento incluso.',
    url: 'https://www.digi-home-design.com/edilizia/tramezzature',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Tramezzature
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Tramezzature a Palermo</h1>

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
              Realizziamo <strong>tramezzature a Palermo</strong> per suddividere e ridistribuire gli spazi interni: pareti divisorie in laterizio forato da 8 o 12 cm, sistemi in cartongesso con intercapedine isolante, e blocchi in cls alleggerito per spessori ridotti. Ogni soluzione viene scelta in base alle esigenze di isolamento termico, acustico e di spazio.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le tramezzature in cartongesso sono particolarmente indicate per interventi rapidi: si posano a secco senza opere bagnate, riducendo i tempi di cantiere e la produzione di polvere. Possono ospitare canaline per impianti e intercapedini per lana di roccia fonoassorbente.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio include la posa, la rasatura delle superfici e la preparazione per la tinteggiatura finale. Contattaci per un preventivo gratuito.
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
