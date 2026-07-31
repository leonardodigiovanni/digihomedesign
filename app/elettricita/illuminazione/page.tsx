import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Illuminazione a Palermo — LED e Sistemi per Interni ed Esterni',
  description: 'Illuminazione LED a Palermo per interni ed esterni: progettazione, fornitura e installazione di sistemi luce per casa, ufficio e spazi commerciali.',
  alternates: { canonical: 'https://www.digi-home-design.com/elettricita/illuminazione' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Illuminazione a Palermo — LED e Sistemi per Interni ed Esterni',
    description: 'Illuminazione LED a Palermo per interni ed esterni: progettazione, fornitura e installazione di sistemi luce per casa, ufficio e spazi commerciali.',
    url: 'https://www.digi-home-design.com/elettricita/illuminazione',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/elettricita" style={{ color: '#888', textDecoration: 'underline' }}>Elettricità</Link> / Illuminazione<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Illuminazione a Palermo</h1>

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
              Progettiamo sistemi di <strong>illuminazione LED a Palermo</strong> per ogni tipo di ambiente: abitazioni, uffici, negozi, ristoranti e spazi esterni. La luce giusta valorizza gli spazi, riduce i consumi e migliora il benessere visivo. Ogni progetto parte dall&apos;analisi delle esigenze illuminotecniche specifiche.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Installiamo faretti da incasso, binari elettrificati, strip LED, lampade a sospensione, illuminazione di sicurezza e sistemi di controllo intelligente (dimmer, sensori di presenza, timer). Per gli esterni progettiamo illuminazione di giardini, facciate, vialetti e aree parcheggio.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              La sostituzione con tecnologia LED consente risparmi fino all&apos;80% sui consumi rispetto alle lampade tradizionali. Contattaci per un progetto luce gratuito.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/elettricita" className="btn-black fs-12">← Torna a Elettricità</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
