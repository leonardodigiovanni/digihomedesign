import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

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
        <Link href="/elettricita" style={{ color: '#888', textDecoration: 'underline' }}>Elettricità</Link> / Impianti Elettrici
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Impianti Elettrici a Palermo</h1>

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

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/elettricita" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>← Torna a Elettricità</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
