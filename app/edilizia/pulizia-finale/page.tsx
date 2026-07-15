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
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Pulizia Finale
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Pulizia Finale Cantiere a Palermo</h1>

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

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/edilizia" className="btn-black fs-12" style={{ flex: 1 }}>← Torna a Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1 }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
