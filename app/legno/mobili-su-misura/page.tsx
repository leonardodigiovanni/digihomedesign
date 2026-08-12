import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { readSettings } from '@/lib/settings'
import { getCategoryGroupNeighbors } from '@/lib/nav-config'

export const metadata: Metadata = {
  title: 'Mobili su Misura a Palermo — Cucine, Camere e Zone Giorno',
  description: 'Mobili su misura a Palermo per cucine, camere e zone giorno, in legno massello o tamburato. Progettazione, fornitura e montaggio nell\'ambito di ogni ristrutturazione.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/mobili-su-misura' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mobili su Misura a Palermo — Cucine, Camere e Zone Giorno',
    description: 'Mobili su misura a Palermo per cucine, camere e zone giorno, in legno massello o tamburato. Progettazione, fornitura e montaggio nell\'ambito di ogni ristrutturazione.',
    url: 'https://www.digi-home-design.com/legno/mobili-su-misura',
    type: 'website',
  },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getCategoryGroupNeighbors('legno', 303, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Mobili su Misura<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Mobili su Misura</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/legno/credenza.webp" alt="Credenza su misura" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Forniamo mobili su misura per cucine, camere e zone giorno, in massello o tamburato.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/legno" className="btn-black fs-12">← Legno</Link>
          {prev && <Link href={prev.href} className="btn-blue fs-12">← {prev.label}</Link>}
          <CtaPreventivo />
          <CtaCantiere />
          {next && <Link href={next.href} className="btn-blue fs-12">{next.label} →</Link>}
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
