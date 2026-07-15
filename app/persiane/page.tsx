import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Persiane in Alluminio a Palermo — Fornitura e Installazione',
  description: 'Persiane in alluminio a Palermo: avvolgibili, veneziane e scuri su misura. Resistenti, eleganti e durevoli. Installazione professionale e preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/persiane' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Persiane in Alluminio a Palermo — Fornitura e Installazione',
    description: 'Persiane in alluminio a Palermo: avvolgibili, veneziane e scuri su misura. Resistenti, eleganti e durevoli. Installazione professionale e preventivo gratuito.',
    url: 'https://www.digi-home-design.com/persiane',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Persiane
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Persiane in Alluminio a Palermo</h1>

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
              Le nostre <strong>persiane in alluminio a Palermo</strong> coniugano design moderno, durabilità e funzionalità: avvolgibili motorizzati, veneziane orientabili e scuri a battente realizzati con profili in alluminio pressofuso, resistenti alla corrosione e agli agenti atmosferici tipici del clima siciliano.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Disponibili in un&apos;ampia gamma di colori RAL e finiture, le nostre persiane si adattano a qualsiasi stile architettonico, dal classico al contemporaneo. Offriamo anche soluzioni motorizzate con comando a distanza o integrazione con sistemi domotici.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio include sopralluogo, rilevazione misure, fornitura e montaggio professionale con pulizia finale del cantiere. Richiedi il tuo preventivo gratuito e personalizzato.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/" className="btn-black fs-12" style={{ flex: 1 }}>← Home</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1 }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
