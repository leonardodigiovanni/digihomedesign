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
  title: 'Smaltimento Calcinacci a Palermo — Trasporto a Norma',
  description: 'Smaltimento calcinacci e macerie a Palermo: raccolta, insaccamento, trasporto e conferimento a discarica autorizzata con formulario di trasporto rifiuti.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/smaltimento-calcinacci' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Smaltimento Calcinacci a Palermo — Trasporto a Norma',
    description: 'Smaltimento calcinacci e macerie a Palermo: raccolta, insaccamento, trasporto e conferimento a discarica autorizzata con formulario di trasporto rifiuti.',
    url: 'https://www.digi-home-design.com/edilizia/smaltimento-calcinacci',
    type: 'website',
  },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getCategoryGroupNeighbors('edilizia', 236, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Smaltimento Calcinacci<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Smaltimento Calcinacci a Palermo</h1>

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
              Offriamo il servizio di <strong>smaltimento calcinacci e macerie a Palermo</strong>: raccolta dei detriti prodotti durante i lavori di demolizione, ristrutturazione o manutenzione, insaccamento o carico su cassone, trasporto e conferimento a discarica autorizzata per inerti nel rispetto della normativa sui rifiuti speciali.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Forniamo il formulario di identificazione rifiuti (FIR) per ogni trasporto, garantendo al cliente la tracciabilità completa dello smaltimento. Disponiamo di cassoni scarrabili di varie dimensioni per cantieri di qualsiasi entità, con ritiro su prenotazione o programmato.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio è disponibile anche in forma autonoma, indipendentemente da altri lavori edili. Contattaci per un preventivo basato sul volume stimato dei materiali.
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
