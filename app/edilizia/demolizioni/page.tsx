import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Demolizioni a Palermo — Selettive e Totali con Smaltimento',
  description: 'Demolizioni a Palermo: abbattimento di muri, tramezzi, solai e strutture. Smaltimento dei calcinacci a norma e ripristino del cantiere. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/demolizioni' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Demolizioni a Palermo — Selettive e Totali con Smaltimento',
    description: 'Demolizioni a Palermo: abbattimento di muri, tramezzi, solai e strutture. Smaltimento dei calcinacci a norma e ripristino del cantiere. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/edilizia/demolizioni',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Demolizioni
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Demolizioni a Palermo</h1>

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
              Eseguiamo <strong>demolizioni selettive e totali a Palermo</strong>: abbattimento di tramezzi, muri non portanti, solai, pavimenti, rivestimenti e strutture in cls armato. Operiamo con attrezzatura meccanica e manuale a seconda delle condizioni del cantiere e delle strutture adiacenti da preservare.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Prima di ogni demolizione effettuiamo un sopralluogo tecnico per verificare la natura strutturale delle pareti, la presenza di impianti nascosti e le eventuali necessità di puntellamento. Lavoriamo in sicurezza nel rispetto del D.Lgs. 81/08.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio comprende la raccolta e il conferimento dei materiali di risulta a discarica autorizzata con formulario di trasporto. Contattaci per un preventivo gratuito.
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
