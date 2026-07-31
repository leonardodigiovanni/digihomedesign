import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Opere Murarie a Palermo — Costruzione e Modifica Muri',
  description: 'Opere murarie a Palermo: costruzione di muri portanti e di tamponamento, aperture di vani e modifiche strutturali. Muratori esperti con progettazione inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/opere-murarie' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Opere Murarie a Palermo — Costruzione e Modifica Muri',
    description: 'Opere murarie a Palermo: costruzione di muri portanti e di tamponamento, aperture di vani e modifiche strutturali. Muratori esperti con progettazione inclusa.',
    url: 'https://www.digi-home-design.com/edilizia/opere-murarie',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Opere Murarie<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Opere Murarie a Palermo</h1>

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
              Realizziamo <strong>opere murarie a Palermo</strong> di ogni tipo: costruzione di nuovi muri portanti e di tamponamento, apertura di vani porta e finestra con posa di architravi, rinforzi strutturali, sopraelevazioni e ricostruzioni. Lavoriamo con laterizio, blocchi in cls, pietra naturale e sistemi a secco.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Per le modifiche strutturali collaboriamo con tecnici abilitati (ingegneri e geometri) per la redazione dei calcoli e il deposito delle pratiche in Comune. Ogni opera è eseguita a regola d&apos;arte con materiali certificati e garanzia sul lavoro.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Operiamo su tutto il territorio palermitano con sopralluogo gratuito e preventivo dettagliato. Contattaci per valutare il tuo intervento.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/edilizia" className="btn-black fs-12">← Torna a Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
