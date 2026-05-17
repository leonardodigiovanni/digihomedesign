import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Infissi in Legno a Palermo — Finestre e Porte-Finestre su Misura',
  description: 'Infissi in legno a Palermo su misura: finestre, porte-finestre e scorrevoli in legno naturale o legno-alluminio. Alta efficienza termica e design senza tempo.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/infissi-in-legno' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Infissi in Legno a Palermo — Finestre e Porte-Finestre su Misura',
    description: 'Infissi in legno a Palermo su misura: finestre, porte-finestre e scorrevoli in legno naturale o legno-alluminio. Alta efficienza termica e design senza tempo.',
    url: 'https://www.digi-home-design.com/legno/infissi-in-legno',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Infissi in Legno
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Infissi in Legno a Palermo
      </h1>

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
              Gli <strong>infissi in legno a Palermo</strong> rappresentano la scelta classica per chi cerca estetica senza tempo unita a eccellenti prestazioni termoacustiche. Realizziamo finestre, porte-finestre e scorrevoli in legno massiccio — larice, meranti, iroko — con vetrocamera a bassa emissività e ferramenta di qualità europea.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Proponiamo anche il sistema <strong>legno-alluminio</strong>: la parte interna in legno garantisce calore e bellezza, mentre il rivestimento esterno in alluminio protegge dall&apos;aggressione degli agenti atmosferici, eliminando quasi del tutto la manutenzione periodica della verniciatura.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni infisso viene realizzato su misura con sopralluogo incluso, installazione professionale e garanzia sul prodotto e sulla posa. Contattaci per un preventivo gratuito a Palermo e provincia.
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

      <Link href="/legno" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Legno
      </Link>
    </div>
  )
}
