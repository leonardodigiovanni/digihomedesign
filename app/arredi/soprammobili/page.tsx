import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Soprammobili a Palermo — Complementi d\'Arredo Selezionati',
  description: 'Soprammobili e complementi d\'arredo a Palermo: oggetti decorativi di qualità per completare e personalizzare ogni ambiente della casa.',
  alternates: { canonical: 'https://www.digi-home-design.com/arredi/soprammobili' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Soprammobili a Palermo — Complementi d\'Arredo Selezionati',
    description: 'Soprammobili e complementi d\'arredo a Palermo: oggetti decorativi di qualità per completare e personalizzare ogni ambiente della casa.',
    url: 'https://www.digi-home-design.com/arredi/soprammobili',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/arredi" style={{ color: '#888', textDecoration: 'underline' }}>Arredi</Link> / Soprammobili
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Soprammobili a Palermo
      </h1>

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
              I <strong>soprammobili</strong> sono i dettagli che completano un arredo e rivelano la personalità di chi abita uno spazio. Proponiamo una selezione di complementi d&apos;arredo di qualità: vasi, sculture, centrotavola, oggettistica etnica e moderna, scelti per abbinarsi a ogni stile abitativo.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Collaboriamo con fornitori selezionati per offrirti pezzi originali e di qualità, con un occhio sempre attento al rapporto tra estetica e prezzo. Il servizio di consulenza è gratuito: ti aiutiamo a scegliere gli oggetti giusti in base agli ambienti da arredare e al budget disponibile.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Disponibile anche la fornitura per ambienti professionali, reception, uffici e spazi commerciali a Palermo e provincia.
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

      <Link href="/arredi" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna ad Arredi
      </Link>
    </div>
  )
}
