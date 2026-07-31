import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Contratti di Pulizia a Palermo — Residenziale e Commerciale',
  description: 'Contratti di pulizia periodica a Palermo per abitazioni, uffici e spazi commerciali. Squadre professionali, prodotti certificati e pianificazione flessibile.',
  alternates: { canonical: 'https://www.digi-home-design.com/servizi/contratti-di-pulizia' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Contratti di Pulizia a Palermo — Residenziale e Commerciale',
    description: 'Contratti di pulizia periodica a Palermo per abitazioni, uffici e spazi commerciali. Squadre professionali, prodotti certificati e pianificazione flessibile.',
    url: 'https://www.digi-home-design.com/servizi/contratti-di-pulizia',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/servizi" style={{ color: '#888', textDecoration: 'underline' }}>Servizi</Link> / Contratti di Pulizia<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Contratti di Pulizia a Palermo</h1>

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
              Proponiamo <strong>contratti di pulizia periodica a Palermo</strong> per abitazioni private, uffici, studi professionali e spazi commerciali. Le nostre squadre operano con prodotti certificati e attrezzatura professionale, garantendo igiene e cura in ogni ambiente.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I contratti sono completamente personalizzabili: scegli la frequenza degli interventi (settimanale, bisettimanale, mensile), gli ambienti da includere e il tipo di pulizia (ordinaria, straordinaria, post-cantiere). Ogni contratto include un referente dedicato e un piano di interventi concordato.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Operiamo a Palermo e provincia. Il sopralluogo iniziale è gratuito e senza impegno: ti forniamo un preventivo dettagliato con il piano degli interventi prima di qualsiasi accordo.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/servizi" className="btn-black fs-12">← Torna a Servizi</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
