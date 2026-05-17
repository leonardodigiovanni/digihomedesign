import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Pulizia Finale Cantiere a Palermo — Post-Lavori Professionale',
  description: 'Pulizia finale post-cantiere a Palermo: rimozione polvere, cemento e residui da pavimenti, infissi e superfici. Consegna dell\'immobile pronto all\'uso.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/pulizia-finale' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pulizia Finale Cantiere a Palermo — Post-Lavori Professionale',
    description: 'Pulizia finale post-cantiere a Palermo: rimozione polvere, cemento e residui da pavimenti, infissi e superfici. Consegna dell\'immobile pronto all\'uso.',
    url: 'https://www.digi-home-design.com/edilizia/pulizia-finale',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Pulizia Finale
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Pulizia Finale Cantiere a Palermo</h1>

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
              Al termine di ogni cantiere di ristrutturazione offriamo il servizio di <strong>pulizia finale post-lavori a Palermo</strong>: rimozione di polvere di cemento, residui di stucco, schizzi di pittura, adesivo per piastrelle e ogni altro residuo di lavorazione da pavimenti, infissi, vetri, sanitari e superfici tinteggiate.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Utilizziamo attrezzatura professionale — aspiratori HEPA, monospazzola, vapore secco — e prodotti specifici per ogni tipo di superficie: detergenti acidi diluiti per il cemento su ceramica, solventi delicati per i vetri, prodotti neutri per i parquet. Il risultato è un immobile consegnato pulito e pronto all&apos;uso.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio è disponibile sia come fase finale dei nostri cantieri che come intervento autonomo su cantieri di terzi. Contattaci per un preventivo in base alla metratura.
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
