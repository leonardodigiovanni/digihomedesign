import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Montaggio a Palermo — Mobili, Arredi e Infissi',
  description: 'Servizio di montaggio professionale a Palermo: mobili, arredi, infissi, serramenti e strutture. Tecnici esperti, tempi certi e lavoro garantito.',
  alternates: { canonical: 'https://www.digi-home-design.com/servizi/montaggio' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Montaggio a Palermo — Mobili, Arredi e Infissi',
    description: 'Servizio di montaggio professionale a Palermo: mobili, arredi, infissi, serramenti e strutture. Tecnici esperti, tempi certi e lavoro garantito.',
    url: 'https://www.digi-home-design.com/servizi/montaggio',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/servizi" style={{ color: '#888', textDecoration: 'underline' }}>Servizi</Link> / Montaggio<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Montaggio a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il nostro servizio di <strong>montaggio professionale a Palermo</strong> copre ogni esigenza: mobili, armadi, cucine, arredi su misura, infissi, serramenti, tende, lampadari e strutture metalliche. Che tu abbia acquistato da noi o altrove, i nostri montatori esperti garantiscono un lavoro preciso e curato.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Operiamo con attrezzatura professionale e rispettiamo i tempi concordati. Ogni montaggio include la verifica del corretto funzionamento del prodotto installato e la pulizia dell&apos;area di lavoro al termine dell&apos;intervento.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Disponibile per privati, imprese e condomini a Palermo e provincia. Richiedi un preventivo gratuito: ti forniremo un prezzo chiaro prima di iniziare qualsiasi lavoro.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/servizi" className="btn-black fs-12">← Torna a Servizi</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
