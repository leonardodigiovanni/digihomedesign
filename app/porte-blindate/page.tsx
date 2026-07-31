import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Porte Blindate a Palermo — Sicurezza e Blindature',
  description: 'Porte blindate a Palermo: blindature antintrusione, porte corazzate e sistemi di sicurezza per abitazioni e uffici. Installazione professionale e preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/porte-blindate' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Porte Blindate a Palermo — Sicurezza e Blindature',
    description: 'Porte blindate a Palermo: blindature antintrusione, porte corazzate e sistemi di sicurezza per abitazioni e uffici. Installazione professionale e preventivo gratuito.',
    url: 'https://www.digi-home-design.com/porte-blindate',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Porte Blindate<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Porte Blindate a Palermo</h1>

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
              Installiamo <strong>porte blindate a Palermo</strong> per abitazioni, uffici e locali commerciali: porte corazzate di classe 3, 4 e 5, con serrature multiblindo, cerniere antisvillo e pannelli in acciaio ad alta resistenza. La sicurezza della tua famiglia e dei tuoi beni è la nostra priorità.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Collaboriamo con i principali produttori italiani di porte blindate e offriamo un&apos;ampia gamma di finiture, colori e rivestimenti interni per integrare la porta di sicurezza nell&apos;arredo della tua casa senza rinunciare all&apos;estetica.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il nostro servizio comprende sopralluogo gratuito, rimozione della vecchia porta, posa in opera certificata e garanzia post-installazione. Contattaci per scoprire la soluzione antintrusione più adatta alle tue esigenze.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/" className="btn-black fs-12">← Home</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
