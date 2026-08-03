import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { readSettings } from '@/lib/settings'
import { getRistrutturazioniNeighbors } from '@/lib/nav-config'

export const metadata: Metadata = {
  title: 'Impianti a Palermo — Ristrutturazioni Chiavi in Mano',
  description: 'Realizzazione e rifacimento impianti (elettrico, idraulico, termico) a Palermo nell\'ambito di una ristrutturazione chiavi in mano.',
  alternates: { canonical: 'https://www.digi-home-design.com/ristrutturazioni-chiavi-in-mano/impianti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Impianti a Palermo — Ristrutturazioni Chiavi in Mano',
    description: 'Realizzazione e rifacimento impianti (elettrico, idraulico, termico) a Palermo nell\'ambito di una ristrutturazione chiavi in mano.',
    url: 'https://www.digi-home-design.com/ristrutturazioni-chiavi-in-mano/impianti',
    type: 'website',
  },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getRistrutturazioniNeighbors(302, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Ristrutturazioni Chiavi in Mano / Impianti<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Impianti</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.webp" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Nell&apos;ambito di una <strong>ristrutturazione chiavi in mano a Palermo</strong> ci occupiamo di impianti elettrici, idraulici e termici, dal progetto alla certificazione di conformità.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Contenuto in fase di definizione — pagina segnaposto in attesa dei dettagli definitivi sul servizio (a quali impianti/categorie collegarla).
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/" className="btn-black fs-12">← Home</Link>
          {prev && <Link href={prev.href} className="btn-blue fs-12">← {prev.label}</Link>}
          <CtaPreventivo />
          <CtaCantiere />
          {next && <Link href={next.href} className="btn-blue fs-12">{next.label} →</Link>}
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti (contenuto generico, da definire — valutare link a /elettricita o /termodinamica)</p>
    </div>
  )
}
