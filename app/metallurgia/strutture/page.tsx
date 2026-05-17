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

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/metallurgia/strutture-portanti/photo_2026-04-15_23-19-07.jpg" alt="Struttura metallica realizzata" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Struttura metallica realizzata</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 280, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/metallurgia/strutture-portanti/photo_2026-04-15_23-19-13.jpg" alt="Struttura portante in acciaio" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Struttura portante in acciaio</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Progettiamo e realizziamo <strong>strutture metalliche a Palermo</strong>: tettoie per auto e cortili, pensiline per ingressi e marciapiedi, soppalchi abitativi e di servizio, capannoni industriali prefabbricati, pergolati e gazebo in acciaio verniciato. Ogni struttura è progettata con calcolo agli stati limite e realizzata in officina con profilati in acciaio S275 o S355.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I componenti vengono zincati a caldo o trattati con ciclo epossidico-poliuretanico per la massima durabilità. Le coperture sono realizzate con lamiera grecata, pannelli sandwich coibentati, policarbonato alveolare o vetro strutturale a seconda delle esigenze.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Forniamo il progetto strutturale firmato da ingegnere abilitato per il deposito in Comune. Contattaci per un sopralluogo gratuito e un preventivo dettagliato.
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
