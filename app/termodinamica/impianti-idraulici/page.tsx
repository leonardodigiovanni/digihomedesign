import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Impianti Idraulici a Palermo — Progettazione e Installazione',
  description: 'Impianti idraulici a Palermo: progettazione, installazione e manutenzione di impianti idrosanitari per abitazioni, uffici e strutture commerciali.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/impianti-idraulici' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Impianti Idraulici a Palermo — Progettazione e Installazione',
    description: 'Impianti idraulici a Palermo: progettazione, installazione e manutenzione di impianti idrosanitari per abitazioni, uffici e strutture commerciali.',
    url: 'https://www.digi-home-design.com/termodinamica/impianti-idraulici',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Impianti Idraulici<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Impianti Idraulici a Palermo</h1>

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
              Progettiamo e realizziamo <strong>impianti idraulici a Palermo</strong> per nuove costruzioni e ristrutturazioni: impianti idrosanitari, distribuzione acqua calda e fredda, sistemi di scarico e fognatura interna, impianti termici a pannelli radianti. Operiamo sia su edifici residenziali che commerciali e industriali.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni impianto viene progettato nel rispetto della normativa UNI e realizzato con materiali certificati (tubi in rame, PPR, multicstrato). Al termine dei lavori forniamo la dichiarazione di conformità impianto (modulo CPI) e il collaudo con certificazione di tenuta.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gestiamo anche interventi di manutenzione e riparazione urgente per perdite, intasamenti e guasti. Pronto intervento disponibile a Palermo e provincia. Contattaci per un preventivo gratuito.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/termodinamica" className="btn-black fs-12">← Torna a Termodinamica</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
