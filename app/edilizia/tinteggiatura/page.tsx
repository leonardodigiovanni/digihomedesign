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
  title: 'Tinteggiatura a Palermo — Interni ed Esterni Professionali',
  description: 'Tinteggiatura a Palermo per interni ed esterni: pitture traspiranti, lavabili, ai silicati e termoriflettenti. Preparazione superfici e finitura garantita.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/tinteggiatura' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tinteggiatura a Palermo — Interni ed Esterni Professionali',
    description: 'Tinteggiatura a Palermo per interni ed esterni: pitture traspiranti, lavabili, ai silicati e termoriflettenti. Preparazione superfici e finitura garantita.',
    url: 'https://www.digi-home-design.com/edilizia/tinteggiatura',
    type: 'website',
  },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getCategoryGroupNeighbors('edilizia', 234, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Tinteggiatura<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Tinteggiatura a Palermo</h1>

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
              Eseguiamo <strong>tinteggiature a Palermo</strong> per interni ed esterni: pitture traspiranti per ambienti abitativi, lavabili per cucine e bagni, ai silicati per facciate, termoriflettenti per terrazzi e coperture. Ogni ciclo include la preparazione delle superfici con stucco, carta vetrata e fondo isolante.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Lavoriamo con tintometro digitale per la riproduzione precisa di qualsiasi colore da campione o codice RAL/NCS. Operiamo con rullo, pennello e airless per grandi superfici. La protezione dei pavimenti, degli infissi e degli arredi è inclusa nel servizio.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Disponibile anche il servizio di consulenza colore gratuito per la scelta delle tonalità più adatte a ogni ambiente. Contattaci per un preventivo al metro quadro.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/edilizia" className="btn-black fs-12">← Edilizia</Link>
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
