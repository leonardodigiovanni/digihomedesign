import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Saracinesche Motorizzate a Palermo — Garage e Locali Commerciali',
  description: 'Saracinesche motorizzate a Palermo: avvolgibili in acciaio, alluminio e PVC con motorizzazione per garage, negozi e magazzini. Installazione e assistenza.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/saracinesche-motorizzate' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Saracinesche Motorizzate a Palermo — Garage e Locali Commerciali',
    description: 'Saracinesche motorizzate a Palermo: avvolgibili in acciaio, alluminio e PVC con motorizzazione per garage, negozi e magazzini. Installazione e assistenza.',
    url: 'https://www.digi-home-design.com/metallurgia/saracinesche-motorizzate',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Saracinesche Motorizzate
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Saracinesche Motorizzate a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/metallurgia/saracinesche-motorizzate/photo_2026-04-15_23-13-23.jpg" alt="Saracinesca motorizzata installata" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Saracinesca motorizzata installata</span>
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
              Installiamo <strong>saracinesche motorizzate a Palermo</strong> per garage privati, negozi, magazzini e locali commerciali: avvolgibili in doghe di acciaio zincato, alluminio estruso e PVC coibentato, con motorizzazione a soffitto o laterale dei principali marchi — Hörmann, Novoferm, Grün, FAAC.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I sistemi sono dotati di telecomando multi-frequenza, fotocellule di sicurezza e fermo meccanico anti-sollevamento. Su richiesta integriamo tastiere a codice, lettori badge e sistemi di apertura da smartphone. Per i locali commerciali proponiamo saracinesche con inserti in policarbonato per la vetrinatura notturna.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Offriamo anche il servizio di manutenzione e riparazione di saracinesche esistenti: sostituzione motore, guide, doghe danneggiate e centraline. Contattaci per un sopralluogo gratuito e un preventivo a Palermo e provincia.
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

      <Link href="/metallurgia" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Metallurgia</Link>
    </div>
  )
}
