import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'

import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Contratti di Pulizia a Palermo — Residenziale e Commerciale',
  description: 'Contratti di pulizia periodica a Palermo per abitazioni, uffici e spazi commerciali. Squadre professionali, prodotti certificati e pianificazione flessibile.',
  alternates: { canonical: 'https://www.digi-home-design.com/servizi/contratti-di-pulizia' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Contratti di Pulizia a Palermo — Residenziale e Commerciale',
    description: 'Contratti di pulizia periodica a Palermo per abitazioni, uffici e spazi commerciali. Squadre professionali, prodotti certificati e pianificazione flessibile.',
    url: 'https://www.digi-home-design.com/servizi/contratti-di-pulizia',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/servizi" style={{ color: '#888', textDecoration: 'underline' }}>Servizi</Link> / Contratti di Pulizia
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Contratti di Pulizia a Palermo
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
              Proponiamo <strong>contratti di pulizia periodica a Palermo</strong> per abitazioni private, uffici, studi professionali e spazi commerciali. Le nostre squadre operano con prodotti certificati e attrezzatura professionale, garantendo igiene e cura in ogni ambiente.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I contratti sono completamente personalizzabili: scegli la frequenza degli interventi (settimanale, bisettimanale, mensile), gli ambienti da includere e il tipo di pulizia (ordinaria, straordinaria, post-cantiere). Ogni contratto include un referente dedicato e un piano di interventi concordato.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Operiamo a Palermo e provincia. Il sopralluogo iniziale è gratuito e senza impegno: ti forniamo un preventivo dettagliato con il piano degli interventi prima di qualsiasi accordo.
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
