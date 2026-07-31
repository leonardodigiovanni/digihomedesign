import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Ristrutturazioni Chiavi in Mano a Palermo — Unico Referente',
  description: 'Ristrutturazioni chiavi in mano a Palermo: dal progetto alla consegna, un unico referente gestisce ogni fase. Preventivo gratuito e cantiere seguito online.',
  alternates: { canonical: 'https://www.digi-home-design.com/ristrutturazioni-chiavi-in-mano' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Ristrutturazioni Chiavi in Mano a Palermo — Unico Referente',
    description: 'Ristrutturazioni chiavi in mano a Palermo: dal progetto alla consegna, un unico referente gestisce ogni fase. Preventivo gratuito e cantiere seguito online.',
    url: 'https://www.digi-home-design.com/ristrutturazioni-chiavi-in-mano',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Ristrutturazioni Chiavi in Mano<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Ristrutturazioni Chiavi in Mano a Palermo</h1>

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
              Le nostre <strong>ristrutturazioni chiavi in mano a Palermo</strong> ti permettono di rinnovare casa o ufficio senza stress: un unico referente coordina tutte le lavorazioni — muratura, impianti, pavimenti, infissi, tinteggiatura — dalla progettazione alla consegna delle chiavi.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gestiamo pratiche edilizie, coordinamento delle maestranze e approvvigionamento dei materiali, garantendo rispetto dei tempi e del budget concordato. Grazie al nostro sistema di monitoraggio cantiere online, puoi seguire l&apos;avanzamento dei lavori in tempo reale dal tuo smartphone o computer.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Siamo operativi su tutto il territorio di Palermo e provincia. Contattaci per un sopralluogo gratuito e scopri come possiamo trasformare il tuo immobile con un servizio completo, trasparente e senza pensieri.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/" className="btn-black fs-12">← Home</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
