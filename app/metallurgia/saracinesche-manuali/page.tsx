import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Saracinesche Manuali a Palermo — Garage e Locali Commerciali',
  description: 'Saracinesche manuali a Palermo: avvolgibili in acciaio, alluminio e PVC con manovra manuale per garage, negozi e magazzini. Fornitura, posa e assistenza.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/saracinesche-manuali' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Saracinesche Manuali a Palermo — Garage e Locali Commerciali',
    description: 'Saracinesche manuali a Palermo: avvolgibili in acciaio, alluminio e PVC con manovra manuale per garage, negozi e magazzini. Fornitura, posa e assistenza.',
    url: 'https://www.digi-home-design.com/metallurgia/saracinesche-manuali',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Saracinesche Manuali
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Saracinesche Manuali a Palermo</h1>

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
              Forniamo e installiamo <strong>saracinesche manuali a Palermo</strong> per garage privati, negozi, magazzini e locali commerciali: avvolgibili in doghe di acciaio zincato, alluminio estruso e PVC coibentato con manovra a cinghia, molla di bilanciamento o moschettone. Soluzione affidabile e senza componenti elettrici, ideale dove non è disponibile l&apos;alimentazione o si preferisce la semplicità di utilizzo.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le saracinesche manuali sono disponibili in larghezze fino a 4 m e altezze fino a 3,5 m. Le guide in acciaio zincato e il cassonetto di contenimento sono verniciati a polvere in qualsiasi colore RAL. Su richiesta installiamo serrature a lucchetto o cilindro per la chiusura di sicurezza notturna.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Offriamo anche il servizio di manutenzione e riparazione di saracinesche esistenti: sostituzione guide, doghe danneggiate e molle di bilanciamento. Contattaci per un sopralluogo gratuito e un preventivo a Palermo e provincia.
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
