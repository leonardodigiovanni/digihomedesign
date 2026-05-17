import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Quadri a Palermo — Decorazioni e Arte per la Casa',
  description: 'Quadri e decorazioni per la casa a Palermo: selezione di opere d\'arte, stampe e dipinti su misura per valorizzare ogni ambiente.',
  alternates: { canonical: 'https://www.digi-home-design.com/arredi/quadri' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Quadri a Palermo — Decorazioni e Arte per la Casa',
    description: 'Quadri e decorazioni per la casa a Palermo: selezione di opere d\'arte, stampe e dipinti su misura per valorizzare ogni ambiente.',
    url: 'https://www.digi-home-design.com/arredi/quadri',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/arredi" style={{ color: '#888', textDecoration: 'underline' }}>Arredi</Link> / Quadri
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Quadri a Palermo
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
              La scelta giusta di un <strong>quadro</strong> può trasformare completamente l&apos;atmosfera di una stanza. Proponiamo una selezione curata di opere d&apos;arte, stampe fotografiche, dipinti e decorazioni murali adatte a ogni stile: dal classico al contemporaneo, dal minimalista al ricco di colore.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Offriamo consulenza personalizzata per abbinare il quadro giusto alle dimensioni della parete, ai colori dell&apos;ambiente e allo stile generale dell&apos;arredo. Il servizio include la fornitura, la cornice su misura e il montaggio professionale a domicilio.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Operiamo su tutto il territorio palermitano. Contattaci per una consulenza gratuita e scopri come valorizzare i tuoi spazi con l&apos;arte giusta.
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
