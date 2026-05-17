import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Porte Interne a Palermo — Legno su Misura Battenti e Scorrevoli',
  description: 'Porte interne in legno a Palermo: battenti, scorrevoli e filomuro su misura. Ampia scelta di essenze, finiture e accessori. Posa in opera inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/porte-interne' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Porte Interne a Palermo — Legno su Misura Battenti e Scorrevoli',
    description: 'Porte interne in legno a Palermo: battenti, scorrevoli e filomuro su misura. Ampia scelta di essenze, finiture e accessori. Posa in opera inclusa.',
    url: 'https://www.digi-home-design.com/legno/porte-interne',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Porte Interne
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Porte Interne a Palermo
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
              Forniamo e installiamo <strong>porte interne in legno a Palermo</strong> su misura: battenti singoli e doppi, scorrevoli a binario esterno o con kit filomuro, e soluzioni a soffietto. Lavoriamo con essenze naturali — rovere, noce, ciliegio, faggio — e con pannelli laccati o rivestiti in laminato per ogni gusto e budget.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              La posa in opera include la rimozione della vecchia porta, la preparazione del vano, il montaggio del telaio e dell&apos;anta, la regolazione delle cerniere e dei maniglioni, e il ritocco della tinteggiatura circostante. Lavoriamo in coordinamento con gli altri artigiani del cantiere per non creare ritardi.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Offriamo sopralluogo gratuito con campionario fisico delle finiture. Contattaci per un preventivo personalizzato.
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
