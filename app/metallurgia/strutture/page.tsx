import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Strutture Metalliche a Palermo — Tettoie, Pensiline e Soppalchi',
  description: 'Strutture metalliche a Palermo: tettoie, pensiline, soppalchi, capannoni e pergolati in ferro e acciaio. Progettazione, carpenteria e posa in opera.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/strutture' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Strutture Metalliche a Palermo — Tettoie, Pensiline e Soppalchi',
    description: 'Strutture metalliche a Palermo: tettoie, pensiline, soppalchi, capannoni e pergolati in ferro e acciaio. Progettazione, carpenteria e posa in opera.',
    url: 'https://www.digi-home-design.com/metallurgia/strutture',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Strutture
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Strutture Metalliche a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Prima riga: primo articolo + foto */}
          <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
              <p className="testo-articoli" style={{ margin: 0 }}>
                Progettiamo e realizziamo <strong>strutture metalliche a Palermo</strong>: tettoie per auto e cortili, pensiline per ingressi e marciapiedi, soppalchi abitativi e di servizio, capannoni industriali prefabbricati, pergolati e gazebo in acciaio verniciato. Ogni struttura è progettata con calcolo agli stati limite e realizzata in officina con profilati in acciaio S275 o S355.
              </p>
            </div>
            <div className="storia-foto" style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
              <div className="page-card storia-card-1" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/metallurgia/strutture-portanti/photo_2026-04-15_23-19-07.jpg" alt="Struttura metallica realizzata" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
              <div className="page-card storia-card-2" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/metallurgia/strutture-portanti/photo_2026-04-15_23-19-13.jpg" alt="Struttura portante in acciaio" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Secondo articolo */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I componenti vengono zincati a caldo o trattati con ciclo epossidico-poliuretanico per la massima durabilità. Le coperture sono realizzate con lamiera grecata, pannelli sandwich coibentati, policarbonato alveolare o vetro strutturale a seconda delle esigenze.
            </p>
          </div>

        </div>

        {/* Terzo articolo */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Forniamo il progetto strutturale firmato da ingegnere abilitato per il deposito in Comune. Contattaci per un sopralluogo gratuito e un preventivo dettagliato.
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

      <Link href="/metallurgia" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Metallurgia</Link>
    </div>
  )
}
