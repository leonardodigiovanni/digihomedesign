import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Mobili Tamburati a Palermo — Design Leggero e Moderno',
  description: 'Mobili tamburati a Palermo: armadi, librerie e sistemi componibili in legno tamburato con finiture laccate o impiallacciate. Leggeri, moderni e su misura.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/mobili-tamburati' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mobili Tamburati a Palermo — Design Leggero e Moderno',
    description: 'Mobili tamburati a Palermo: armadi, librerie e sistemi componibili in legno tamburato con finiture laccate o impiallacciate. Leggeri, moderni e su misura.',
    url: 'https://www.digi-home-design.com/legno/mobili-tamburati',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Mobili Tamburati
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Mobili Tamburati a Palermo
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
              I <strong>mobili tamburati</strong> combinano la struttura in legno con pannelli alleggeriti internamente, ottenendo superfici ampie e regolari con un peso ridotto rispetto al massello. Sono ideali per armadi con ante lisce e specchiate, librerie a tutta parete, sistemi componibili per ufficio e camerette.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le finiture disponibili spaziano dal laccato lucido o opaco, all&apos;impiallacciato in essenza naturale, al rivestimento in melamminico per ambienti ad alto utilizzo. I bordi vengono rifiniti con ABS o impiallacciatura per un aspetto pulito e resistente all&apos;usura.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo su misura in base alle dimensioni del tuo spazio, con accessori interni (cassetti, portabiti, moduli scarpe) scelti insieme al cliente. Contattaci per un preventivo gratuito con progetto 3D.
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
