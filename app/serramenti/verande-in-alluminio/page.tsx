import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Verande in Alluminio a Palermo — Su Misura con Vetro Temperato',
  description: 'Verande in alluminio a Palermo su misura: vetri fissi, scorrevoli, ante a libro e sistemi bioclimatici. Profili a taglio termico, vetri basso-emissivi. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/verande-in-alluminio' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Verande in Alluminio a Palermo — Su Misura con Vetro Temperato',
    description: 'Verande in alluminio a Palermo su misura: vetri fissi, scorrevoli, ante a libro e sistemi bioclimatici. Profili a taglio termico, vetri basso-emissivi. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/serramenti/verande-in-alluminio',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Verande in Alluminio
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Verande in Alluminio a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Prima riga: primo articolo + foto */}
          <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
              <p className="testo-articoli" style={{ margin: 0 }}>
                Realizziamo <strong>verande in alluminio su misura a Palermo</strong> con vetro temperato o stratificato: verande a pannelli fissi, a vetri scorrevoli su binario, con ante a libro e sistemi bioclimatici con tetto a lamelle orientabili per la ventilazione naturale. Trasformiamo balconi, terrazze e giardini in ambienti vivibili tutto l&apos;anno, protetti dal vento, dalla pioggia e dal sole estivo.
              </p>
            </div>
            <div className="storia-foto" style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
              <div className="page-card storia-card-1" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/serramenti/verande-in-alluminio/20251108_120024.jpg" alt="Veranda in alluminio installata" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
              <div className="page-card storia-card-2" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/serramenti/verande-in-alluminio/photo_2026-04-15_23-21-54.jpg" alt="Veranda in alluminio su misura" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Secondo articolo */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I profili in alluminio a taglio termico garantiscono comfort termoacustico anche nei mesi invernali, mentre i vetri basso-emissivi riducono il surriscaldamento estivo. Le tende interne o integrate nel vetro (vetro con veneziana incorporata) completano il controllo solare senza interventi successivi.
            </p>
          </div>

        </div>

        {/* Terzo articolo */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Gestiamo le pratiche SCIA o i permessi necessari in Comune di Palermo e provincia. Contattaci per un sopralluogo gratuito e un progetto su misura.
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

      <Link href="/serramenti" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Serramenti</Link>
    </div>
  )
}
