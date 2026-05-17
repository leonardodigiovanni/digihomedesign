import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Solarium a Palermo — Terrazze Attrezzate per l\'Esposizione Solare',
  description: 'Solarium a Palermo: realizzazione di aree solarium su terrazze, giardini e bordo piscina. Pavimentazioni drenanti, arredi fissi e schermature solari.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/solarium' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Solarium a Palermo — Terrazze Attrezzate per l\'Esposizione Solare',
    description: 'Solarium a Palermo: realizzazione di aree solarium su terrazze, giardini e bordo piscina. Pavimentazioni drenanti, arredi fissi e schermature solari.',
    url: 'https://www.digi-home-design.com/edilizia/solarium',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Solarium
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Solarium a Palermo</h1>

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
              Progettiamo e realizziamo <strong>aree solarium a Palermo</strong> su terrazze, lastrici solari, giardini e bordo piscina: spazi attrezzati per il relax e l&apos;esposizione solare, con pavimentazioni drenanti antiscivolo in gres, pietra lavica, teak o composito WPC resistente ai raggi UV e all&apos;acqua.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il progetto include la sistemazione del piano di calpestio con pendenze di deflusso, l&apos;impermeabilizzazione del sottofondo, l&apos;installazione di docce esterne, punti luce, prese di corrente IP67 e schermature solari — tende a vela, pergolati bioclimatici o gazebo in alluminio — per il comfort nelle ore più calde.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni solarium è progettato su misura in base alle dimensioni dello spazio e alle esigenze del cliente. Contattaci per un sopralluogo e un progetto gratuito a Palermo e provincia.
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
