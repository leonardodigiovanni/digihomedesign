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
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Tramezzature
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Tramezzature a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/edilizia" className="btn-black fs-12" style={{ flex: 1 }}>← Torna a Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1 }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
