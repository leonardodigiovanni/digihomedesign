import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Rivestimento Compensato a Palermo — Pareti e Soffitti in Legno',
  description: 'Rivestimenti in compensato a Palermo per pareti, soffitti e superfici decorative. Pannelli idrorepellenti, ignifughi e personalizzabili per ogni ambiente.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/rivestimento-compensato' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Rivestimento Compensato a Palermo — Pareti e Soffitti in Legno',
    description: 'Rivestimenti in compensato a Palermo per pareti, soffitti e superfici decorative. Pannelli idrorepellenti, ignifughi e personalizzabili per ogni ambiente.',
    url: 'https://www.digi-home-design.com/legno/rivestimento-compensato',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Rivestimento Compensato
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Rivestimento Compensato a Palermo
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
              I <strong>rivestimenti in compensato</strong> offrono versatilità e calore a pareti, soffitti e superfici decorative, con un peso contenuto e una posa più rapida rispetto al massello. Utilizziamo pannelli multistrato di betulla, okumé e pioppo in diversi spessori, con finiture impiallacciate in essenza naturale, laccate o con pellicole decorative.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le applicazioni sono molteplici: boiserie per soggiorni e camere, rivestimenti per scale e battiscopa, controsoffitti in legno, pareti attrezzate e fondali per librerie e armadi. Realizziamo anche pannelli sagomati e fresati a CNC per effetti decorativi su misura.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Disponibili pannelli idrorepellenti per bagni e cucine, e versioni ignifughe per ambienti pubblici e commerciali. Contattaci per un preventivo gratuito a Palermo e provincia.
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
