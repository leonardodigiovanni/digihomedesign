import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import { readSettings } from '@/lib/settings'
import { getCategoryGroupNeighbors } from '@/lib/nav-config'
import NavDropdownTriggerButton from '@/components/nav-dropdown-trigger-button'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Riparazioni a Palermo — Infissi, Serramenti e Arredi',
  description: 'Servizio di riparazioni a Palermo per infissi, serramenti, porte, finestre e arredi. Interventi rapidi con tecnici qualificati. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/servizi/riparazioni' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Riparazioni a Palermo — Infissi, Serramenti e Arredi',
    description: 'Servizio di riparazioni a Palermo per infissi, serramenti, porte, finestre e arredi. Interventi rapidi con tecnici qualificati. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/servizi/riparazioni',
    type: 'website',
  },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getCategoryGroupNeighbors('servizi', 269, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/servizi" style={{ color: '#888', textDecoration: 'underline' }}>Servizi</Link> / Riparazioni<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Riparazioni a Palermo</h1>

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
              Offriamo un servizio di riparazioni.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/servizi" className="btn-black fs-12">← Servizi</Link>
          {prev ? <Link href={prev.href} className="btn-blue fs-12">← {prev.label}</Link> : <NavDropdownTriggerButton dropdownId="cat-tessuti" label="← Tessuti" />}
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
