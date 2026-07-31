import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Tetti a Palermo — Rifacimento Coperture e Manutenzione',
  description: 'Tetti a Palermo: rifacimento e manutenzione di coperture in tegole, lamiera, guaine e lastrico solare. Interventi su perdite e impermeabilizzazione inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/tetti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tetti a Palermo — Rifacimento Coperture e Manutenzione',
    description: 'Tetti a Palermo: rifacimento e manutenzione di coperture in tegole, lamiera, guaine e lastrico solare. Interventi su perdite e impermeabilizzazione inclusa.',
    url: 'https://www.digi-home-design.com/edilizia/tetti',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Tetti<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Tetti a Palermo</h1>

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
              Realizziamo il <strong>rifacimento e la manutenzione di tetti a Palermo</strong>: coperture a falde con tegole marsigliesi, portoghesi e in laterizio, tetti piani con guaine bituminose o liquide, lastrici solari e coperture in lamiera grecata o sandwich. Interveniamo su infiltrazioni, tegole rotte e strutture in legno danneggiate.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Prima di ogni intervento eseguiamo una diagnosi della copertura per individuare i punti di perdita. Le lavorazioni vengono eseguite in sicurezza con ponteggi o linee vita certificate. Per i tetti in legno forniamo anche trattamenti antitarlo, antifungini e ignifughi.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio include lo smaltimento del materiale rimosso e il ripristino degli elementi di gronda e pluviali. Contattaci per un sopralluogo gratuito.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/edilizia" className="btn-black fs-12">← Torna a Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
