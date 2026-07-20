import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Impermeabilizzazioni a Palermo — Terrazzi, Bagni e Fondamenta',
  description: 'Impermeabilizzazioni a Palermo: guaine liquide e bituminose per terrazzi, balconi, bagni, coperture e fondamenta. Interventi su infiltrazioni e perdite.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/impermeabilizzazioni' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Impermeabilizzazioni a Palermo — Terrazzi, Bagni e Fondamenta',
    description: 'Impermeabilizzazioni a Palermo: guaine liquide e bituminose per terrazzi, balconi, bagni, coperture e fondamenta. Interventi su infiltrazioni e perdite.',
    url: 'https://www.digi-home-design.com/edilizia/impermeabilizzazioni',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Impermeabilizzazioni<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Impermeabilizzazioni a Palermo</h1>

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
              Realizziamo <strong>impermeabilizzazioni a Palermo</strong> per terrazzi praticabili e non, balconi, bagni, docce, coperture piane, fondamenta e pareti interrate. Utilizziamo guaine bituminose a caldo, membrane liquide poliuretaniche, guaine in EPDM e sistemi cristallizzanti per murature.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Prima di ogni impermeabilizzazione effettuiamo la diagnosi dell&apos;umidità e delle perdite attive, la rimozione del vecchio manto e la preparazione del supporto. Applichiamo i primer di aggrappaggio e il ciclo impermeabilizzante in più strati per garantire la tenuta nel tempo. Tutti gli interventi sono garantiti.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Disponiamo anche di sistemi di impermeabilizzazione sotto-piastrella per docce e terrazze rivestite. Contattaci per un sopralluogo gratuito a Palermo e provincia.
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
