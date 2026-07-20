import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Elettrodomestici a Palermo — Fornitura e Installazione',
  description: 'Elettrodomestici a Palermo: fornitura, installazione e collegamento di grandi elettrodomestici da incasso e liberi. Assistenza post-vendita garantita.',
  alternates: { canonical: 'https://www.digi-home-design.com/elettricita/elettrodomestici' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Elettrodomestici a Palermo — Fornitura e Installazione',
    description: 'Elettrodomestici a Palermo: fornitura, installazione e collegamento di grandi elettrodomestici da incasso e liberi. Assistenza post-vendita garantita.',
    url: 'https://www.digi-home-design.com/elettricita/elettrodomestici',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/elettricita" style={{ color: '#888', textDecoration: 'underline' }}>Elettricità</Link> / Elettrodomestici<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Elettrodomestici a Palermo</h1>

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
              Forniamo e installiamo <strong>grandi elettrodomestici a Palermo</strong>: forni, piani cottura, lavastoviglie, frigoriferi, lavatrici e asciugatrici da incasso o liberi. Lavoriamo con i principali marchi — Bosch, Siemens, Whirlpool, Samsung, AEG — garantendo prodotti di qualità con garanzia ufficiale.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio comprende la fornitura, il trasporto, la posa in opera e il collegamento elettrico e idraulico a regola d&apos;arte. Per gli elettrodomestici da incasso gestiamo anche l&apos;adattamento del mobile e i fori di aerazione, in coordinamento con i mobilieri.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ritiriamo e smaltiamo il vecchio elettrodomestico nel rispetto della normativa RAEE. Contattaci per un preventivo comprensivo di fornitura e installazione.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/elettricita" className="btn-black fs-12">← Torna a Elettricità</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
