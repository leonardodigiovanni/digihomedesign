import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
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

export default function Page() {
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
              Offriamo un servizio di <strong>riparazioni rapide e affidabili a Palermo</strong> per infissi, serramenti, porte, finestre, persiane, verande e arredi. I nostri tecnici qualificati intervengono con tempi certi, diagnosticano il problema e propongono la soluzione più efficace e conveniente.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gestiamo riparazioni di ogni entità: dalla semplice sostituzione di una guarnizione o di un meccanismo di chiusura, fino al ripristino strutturale di ante, telai e strutture danneggiate. Utilizziamo ricambi originali o equivalenti certificati per garantire la durata dell&apos;intervento.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio è disponibile per privati, condomini e attività commerciali. Contattaci per un sopralluogo gratuito e un preventivo trasparente senza sorprese.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/servizi" className="btn-black fs-12">← Torna a Servizi</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
