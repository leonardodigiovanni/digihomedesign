import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'

import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Infissi a Palermo — Finestre e Porte-Finestre su Misura',
  description: 'Infissi a Palermo: finestre, porte-finestre e scorrevoli su misura in alluminio e PVC. Installazione e garanzia incluse. Richiedi un preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/infissi' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Infissi a Palermo — Finestre e Porte-Finestre su Misura',
    description: 'Infissi a Palermo: finestre, porte-finestre e scorrevoli su misura in alluminio e PVC. Installazione e garanzia incluse. Richiedi un preventivo gratuito.',
    url: 'https://www.digi-home-design.com/infissi',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Infissi
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Infissi a Palermo
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
              Siamo specialisti nella fornitura e installazione di <strong>infissi a Palermo</strong>: finestre, porte-finestre e vetrate scorrevoli realizzate su misura per ogni tipo di abitazione o ufficio. Utilizziamo profili in alluminio e PVC di alta qualità, con vetri a bassa emissività per il massimo isolamento termico e acustico.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni progetto parte da un sopralluogo gratuito: misuriamo, consigliamo i materiali più adatti e gestiamo la posa in opera con squadre specializzate. I nostri infissi sono installati a regola d&apos;arte e corredati da garanzia su prodotto e manodopera.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Che si tratti di una singola finestra o di una ristrutturazione completa, siamo il tuo referente unico a Palermo per infissi di qualità a prezzi competitivi. Contattaci per un preventivo personalizzato.
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

      <Link href="/" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna alla home
      </Link>
    </div>
  )
}
