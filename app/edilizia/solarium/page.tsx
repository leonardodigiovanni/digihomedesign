import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import { readSettings } from '@/lib/settings'
import { getComfortNeighbors } from '@/lib/nav-config'
import NavDropdownTriggerButton from '@/components/nav-dropdown-trigger-button'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Solarium a Palermo — Terrazze Attrezzate per l\'Esposizione Solare',
  description: 'Solarium a Palermo: realizzazione di aree solarium su terrazze, giardini e bordo piscina. Pavimentazioni drenanti, arredi fissi e schermature solari.',
  alternates: { canonical: 'https://www.digi-home-design.com/comfort-e-spazi-esterni/solarium' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Solarium a Palermo — Terrazze Attrezzate per l\'Esposizione Solare',
    description: 'Solarium a Palermo: realizzazione di aree solarium su terrazze, giardini e bordo piscina. Pavimentazioni drenanti, arredi fissi e schermature solari.',
    url: 'https://www.digi-home-design.com/comfort-e-spazi-esterni/solarium',
    type: 'website',
  },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getComfortNeighbors(241, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <span style={{ color: '#888' }}>Comfort e Spazi Esterni</span> / Solarium<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Solarium a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/edilizia/solarium/sdraio-ombrellone.jpg" alt="Sdraio e ombrellone" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Sdraio e ombrellone</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/edilizia/solarium/tavolo-sedia.jpg" alt="Tavolo e sedute" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Tavolo e sedute</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Progettiamo e realizziamo aree solarium.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <NavDropdownTriggerButton dropdownId="comfort" label="← Comfort e Spazi Esterni" />
          {prev && <Link href={prev.href} className="btn-blue fs-12">← {prev.label}</Link>}
          <CtaPreventivo />
          <CtaCantiere />
          {next ? <Link href={next.href} className="btn-blue fs-12">{next.label} →</Link> : <NavDropdownTriggerButton dropdownId="antintrusione" label="Antintrusione e Sicurezza →" />}
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
