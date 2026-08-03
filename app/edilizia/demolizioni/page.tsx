import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

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
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Demolizioni<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Demolizioni a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.webp" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.webp" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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

        <StickyBottomBarContent>
          <Link href="/edilizia" className="btn-black fs-12">← Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
