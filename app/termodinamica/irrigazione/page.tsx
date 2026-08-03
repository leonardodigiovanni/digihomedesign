import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import { readSettings } from '@/lib/settings'
import { getCategoryGroupNeighbors } from '@/lib/nav-config'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Irrigazione a Palermo — Impianti Automatici per Giardini',
  description: 'Impianti di irrigazione automatica a Palermo per giardini, terrazzi e spazi verdi. Progettazione, installazione e programmazione di sistemi a goccia e a pioggia.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/irrigazione' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Irrigazione a Palermo — Impianti Automatici per Giardini',
    description: 'Impianti di irrigazione automatica a Palermo per giardini, terrazzi e spazi verdi. Progettazione, installazione e programmazione di sistemi a goccia e a pioggia.',
    url: 'https://www.digi-home-design.com/termodinamica/irrigazione',
    type: 'website',
  },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getCategoryGroupNeighbors('termodinamica', 262, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Irrigazione<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Irrigazione a Palermo</h1>

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
              Progettiamo e installiamo <strong>impianti di irrigazione automatica a Palermo</strong> per giardini privati, terrazzi, aiuole condominiali e spazi verdi commerciali. Sistemi a goccia per orti e aiuole, irrigatori a pioggia per prati, e microirrigatori per vasi e fioriere: ogni soluzione è dimensionata sulle reali esigenze della vegetazione.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli impianti sono dotati di programmatori digitali o smart (controllabili da smartphone) per ottimizzare i consumi idrici in base alla stagione e alle condizioni climatiche. Integriamo sensori di pioggia e umidità per evitare sprechi.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio comprende sopralluogo gratuito, progettazione del layout, posa delle tubazioni interrate, collegamento alla rete idrica e collaudo finale. Contattaci per un preventivo su misura.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/termodinamica" className="btn-black fs-12">← Termodinamica</Link>
          {prev && <Link href={prev.href} className="btn-blue fs-12">← {prev.label}</Link>}
          <CtaPreventivo />
          <CtaCantiere />
          {next && <Link href={next.href} className="btn-blue fs-12">{next.label} →</Link>}
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
