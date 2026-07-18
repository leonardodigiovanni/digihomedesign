import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Sanitari a Palermo — Fornitura e Installazione Bagni',
  description: 'Sanitari a Palermo: fornitura e installazione di wc, lavabi, bidet, vasche, box doccia e rubinetteria. Rifacimento bagni completo chiavi in mano.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/sanitari' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Sanitari a Palermo — Fornitura e Installazione Bagni',
    description: 'Sanitari a Palermo: fornitura e installazione di wc, lavabi, bidet, vasche, box doccia e rubinetteria. Rifacimento bagni completo chiavi in mano.',
    url: 'https://www.digi-home-design.com/edilizia/sanitari',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Sanitari<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Sanitari a Palermo</h1>

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
              Forniamo e installiamo <strong>sanitari a Palermo</strong>: wc sospesi e a pavimento, lavabi, bidet, vasche da bagno, piatti doccia, box doccia su misura e rubinetteria di design. Lavoriamo con marchi selezionati — Ideal Standard, Catalano, Duravit, Hansgrohe — per garantire qualità e durata nel tempo.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio di rifacimento bagno è chiavi in mano: demoluiamo i vecchi sanitari, adeguiamo gli scarichi e i sifoni, poniamo i nuovi elementi, siliconiamo i raccordi e collaghiamo i flessibili. Gestiamo anche il collegamento alla rete idrica con miscelatori termostatici e sistemi di scarico a zaino.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Disponibile anche la sola sostituzione di singoli elementi senza demolizioni murarie. Contattaci per un preventivo gratuito a Palermo e provincia.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/edilizia" className="btn-black fs-12">← Torna a Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
