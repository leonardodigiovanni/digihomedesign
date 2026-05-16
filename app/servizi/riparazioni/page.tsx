import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'

import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Riparazioni a Palermo — Infissi, Serramenti e Arredi',
  description: 'Servizio di riparazioni a Palermo per infissi, serramenti, porte, finestre e arredi. Interventi rapidi con tecnici qualificati. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/servizi/riparazioni' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Riparazioni a Palermo — Infissi, Serramenti e Arredi',
    description: 'Servizio di riparazioni a Palermo per infissi, serramenti, porte, finestre e arredi. Interventi rapidi con tecnici qualificati. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/servizi/riparazioni',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/servizi" style={{ color: '#888', textDecoration: 'underline' }}>Servizi</Link> / Riparazioni
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Riparazioni a Palermo
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Prima riga: primo articolo + foto */}
          <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
              <p className="testo-articoli" style={{ margin: 0 }}>
                Offriamo un servizio di <strong>riparazioni rapide e affidabili a Palermo</strong> per infissi, serramenti, porte, finestre, persiane, verande e arredi. I nostri tecnici qualificati intervengono con tempi certi, diagnosticano il problema e propongono la soluzione più efficace e conveniente.
              </p>
            </div>
            <div className="storia-foto" style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
              <div className="page-card storia-card-1" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px 14px' }}>
                  <span className="testo-articoli">Fotografia da scegliere</span>
                </div>
              </div>
              <div className="page-card storia-card-2" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px 14px' }}>
                  <span className="testo-articoli">Fotografia da scegliere</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondo articolo */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gestiamo riparazioni di ogni entità: dalla semplice sostituzione di una guarnizione o di un meccanismo di chiusura, fino al ripristino strutturale di ante, telai e strutture danneggiate. Utilizziamo ricambi originali o equivalenti certificati per garantire la durata dell&apos;intervento.
            </p>
          </div>

        </div>

        {/* Terzo articolo */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Il servizio è disponibile per privati, condomini e attività commerciali. Contattaci per un sopralluogo gratuito e un preventivo trasparente senza sorprese.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px 28px', background: '#fdfcf8', border: '1px solid #e8d89a', borderRadius: 10 }}>
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
