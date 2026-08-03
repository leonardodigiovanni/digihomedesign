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
  title: 'Videosorveglianza a Palermo — Impianti TVCC e IP',
  description: 'Impianti di videosorveglianza a Palermo: telecamere IP, TVCC, sistemi di registrazione e accesso remoto per abitazioni, uffici e attività commerciali.',
  alternates: { canonical: 'https://www.digi-home-design.com/elettricita/videosorveglianza' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Videosorveglianza a Palermo — Impianti TVCC e IP',
    description: 'Impianti di videosorveglianza a Palermo: telecamere IP, TVCC, sistemi di registrazione e accesso remoto per abitazioni, uffici e attività commerciali.',
    url: 'https://www.digi-home-design.com/elettricita/videosorveglianza',
    type: 'website',
  },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getCategoryGroupNeighbors('elettricita', 255, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/elettricita" style={{ color: '#888', textDecoration: 'underline' }}>Elettricità</Link> / Videosorveglianza<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Videosorveglianza a Palermo</h1>

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
              Installiamo <strong>impianti di videosorveglianza a Palermo</strong> per abitazioni, condomini, uffici e attività commerciali: telecamere IP ad alta definizione, sistemi TVCC analogici, NVR e DVR con archiviazione locale o cloud, e accesso remoto da smartphone in tempo reale.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Progettiamo il posizionamento ottimale delle telecamere per massimizzare la copertura, minimizzare i punti ciechi e rispettare la normativa sulla privacy (GDPR). Installiamo sistemi con visione notturna, rilevazione del movimento, audio bidirezionale e notifiche push in caso di allarme.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I sistemi sono integrabili con impianti antifurto, citofoni video e sistemi domotici. Forniamo tutta la documentazione per la conformità al Garante della Privacy. Contattaci per un sopralluogo gratuito e un preventivo su misura.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/elettricita" className="btn-black fs-12">← Elettricità</Link>
          {prev && <Link href={prev.href} className="btn-blue fs-12">← {prev.label}</Link>}
          <CtaPreventivo />
          <CtaCantiere />
          {next ? <Link href={next.href} className="btn-blue fs-12">{next.label} →</Link> : <NavDropdownTriggerButton dropdownId="cat-termodinamica" label="Termodinamica →" />}
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
