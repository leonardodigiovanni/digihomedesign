import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'

import CtaCantiere from '@/components/cta-cantiere'
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
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/servizi" style={{ color: '#888', textDecoration: 'underline' }}>Servizi</Link> / Montaggio
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Montaggio a Palermo
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

      <Link href="/servizi" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Servizi
      </Link>
    </div>
  )
}
