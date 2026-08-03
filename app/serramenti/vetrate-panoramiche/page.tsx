import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { readSettings } from '@/lib/settings'
import { getComfortNeighbors } from '@/lib/nav-config'
import NavDropdownTriggerButton from '@/components/nav-dropdown-trigger-button'

export const metadata: Metadata = {
  title: 'Vetrate Panoramiche a Palermo — Pareti Vetrate Scorrevoli su Misura',
  description: 'Vetrate panoramiche a Palermo: pareti vetrate scorrevoli e pieghevoli in alluminio a taglio termico per aprire verande, terrazzi e soggiorni sul giardino, senza montanti a vista.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/vetrate-panoramiche' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Vetrate Panoramiche a Palermo — Pareti Vetrate Scorrevoli su Misura',
    description: 'Vetrate panoramiche a Palermo: pareti vetrate scorrevoli e pieghevoli in alluminio a taglio termico per aprire verande, terrazzi e soggiorni sul giardino, senza montanti a vista.',
    url: 'https://www.digi-home-design.com/serramenti/vetrate-panoramiche',
    type: 'website',
  },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getComfortNeighbors(2082, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Vetrate Panoramiche<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Vetrate Panoramiche a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/serramenti/vetrate/panoramica-scorrevole.webp" alt="Vetrata panoramica scorrevole" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Scorrevole</span>
              </div>
            </div>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/serramenti/vetrate/panoramica-libro.webp" alt="Vetrata panoramica a libro" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">A libro</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le vetrate panoramiche sono pareti vetrate scorrevoli o pieghevoli che permettono di aprire completamente verande, terrazzi e soggiorni verso il giardino o la vista, azzerando la distinzione tra interno ed esterno quando il tempo lo permette.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/serramenti" className="btn-black fs-12">← Serramenti</Link>
          {prev ? <Link href={prev.href} className="btn-blue fs-12">← {prev.label}</Link> : <NavDropdownTriggerButton dropdownId="prodotti" label="← Riqualificazione Energetica" />}
          <CtaPreventivo />
          <CtaCantiere />
          {next ? <Link href={next.href} className="btn-blue fs-12">{next.label} →</Link> : <NavDropdownTriggerButton dropdownId="antintrusione" label="Antintrusione e Sicurezza →" />}
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti (contenuto nuovo, nessun catalogo DB collegato ancora)</p>
    </div>
  )
}
