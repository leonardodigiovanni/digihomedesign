import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Box Doccia a Palermo — Vetro Temperato su Misura',
  description: 'Box doccia a Palermo su misura in vetro temperato: scorrevoli, a battente, walk-in e nicchia. Profili in alluminio anodizzato o finitura nera opaca.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/box-doccia' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Box Doccia a Palermo — Vetro Temperato su Misura',
    description: 'Box doccia a Palermo su misura in vetro temperato: scorrevoli, a battente, walk-in e nicchia. Profili in alluminio anodizzato o finitura nera opaca.',
    url: 'https://www.digi-home-design.com/serramenti/box-doccia',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Box Doccia
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Box Doccia a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 280, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo <strong>box doccia su misura a Palermo</strong> in vetro temperato da 6, 8 e 10 mm: a battente, scorrevole su binario, a libro e walk-in senza telaio per il massimo effetto minimalista. Ogni box viene misurato sul posto e tagliato alla dimensione esatta del piatto o della doccia a pavimento, senza spazi di infiltrazione.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I profili di supporto sono in alluminio anodizzato argento, oro satinato, cromo lucido o nella moderna finitura nera opaca — abbinabile alla rubinetteria dark di tendenza. Il vetro è disponibile trasparente, acidato satinato o con pellicola decorativa, ed è trattato con anti-calcare permanente per facilitare la pulizia.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Installiamo anche docce in muratura con sola parete laterale e nicchie senza telaio. Contattaci per un sopralluogo gratuito e un preventivo su misura a Palermo.
            </p>
          </div>

        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px 28px', background: '#fdfcf8', border: '2px solid #c8960c', borderRadius: 10 }}>
        <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
          <p className="testo-articoli" style={{ margin: '0 0 12px' }}>Hai un progetto in mente?</p>
          <CtaPreventivo />
        </div>
        <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
          <p className="testo-articoli" style={{ margin: '0 0 12px' }}>Hai già un cantiere aperto?</p>
          <CtaCantiere />
        </div>
      </div>

      </div>

      <Link href="/serramenti" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Serramenti</Link>
    </div>
  )
}
