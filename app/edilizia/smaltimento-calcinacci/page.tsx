import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
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

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Smaltimento Calcinacci
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Smaltimento Calcinacci a Palermo</h1>

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

      <Link href="/edilizia" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Edilizia</Link>
    </div>
  )
}
