import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Impianti Elettrici a Palermo — Civili e Industriali a Norma',
  description: 'Impianti elettrici a Palermo: progettazione, realizzazione e messa a norma per abitazioni, uffici e strutture commerciali. Dichiarazione di conformità inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/elettricita/impianti-elettrici' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Impianti Elettrici a Palermo — Civili e Industriali a Norma',
    description: 'Impianti elettrici a Palermo: progettazione, realizzazione e messa a norma per abitazioni, uffici e strutture commerciali. Dichiarazione di conformità inclusa.',
    url: 'https://www.digi-home-design.com/elettricita/impianti-elettrici',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/elettricita" style={{ color: '#888', textDecoration: 'underline' }}>Elettricità</Link> / Impianti Elettrici<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Impianti Elettrici a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo <strong>impianti elettrici civili e industriali a Palermo</strong> nel pieno rispetto della normativa CEI e del D.M. 37/08. Dalla progettazione alla messa in servizio, ogni intervento è eseguito da elettricisti abilitati con rilascio della dichiarazione di conformità (DICO).
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I nostri servizi comprendono: nuovi impianti per costruzioni e ristrutturazioni, messa a norma di impianti obsoleti, ampliamenti e modifiche, installazione di quadri elettrici, impianti di terra e protezione da scariche atmosferiche, cablaggi strutturati e impianti speciali.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Operiamo su tutto il territorio palermitano con sopralluogo gratuito e preventivo trasparente. Contattaci per valutare il tuo intervento.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/elettricita" className="btn-black fs-12">← Torna a Elettricità</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
