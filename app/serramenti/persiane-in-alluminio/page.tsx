import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Persiane a Palermo — Alluminio, PVC e Legno su Misura',
  description: 'Persiane a Palermo su misura: persiane in alluminio, PVC e legno per oscuramento, ventilazione e protezione solare. A battente, scorrevoli e a pannelli.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/persiane-in-alluminio' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Persiane a Palermo — Alluminio, PVC e Legno su Misura',
    description: 'Persiane a Palermo su misura: persiane in alluminio, PVC e legno per oscuramento, ventilazione e protezione solare. A battente, scorrevoli e a pannelli.',
    url: 'https://www.digi-home-design.com/serramenti/persiane-in-alluminio',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Persiane
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Persiane a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Prima riga: primo articolo + foto */}
          <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
              <p className="testo-articoli" style={{ margin: 0 }}>
                Forniamo e installiamo <strong>persiane su misura a Palermo</strong> in alluminio, PVC e legno: persiane a battente con stecche orientabili o fisse, scorrevoli su binario laterale, a pannelli e a libro. Le persiane proteggono dall&apos;irraggiamento solare estivo — fondamentale in Sicilia — garantendo allo stesso tempo ventilazione e oscuramento regolabile.
              </p>
            </div>
            <div className="storia-foto" style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
              <div className="page-card storia-card-1" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/serramenti/persiane-in-alluminio/photo_2026-04-15_23-25-26.jpg" alt="Persiane in alluminio installate" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
              <div className="page-card storia-card-2" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/serramenti/persiane-in-alluminio/planet45-persiana2.jpg" alt="Persiana in alluminio Planet 45" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Secondo articolo */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le persiane in alluminio sono la soluzione più diffusa per durata e assenza di manutenzione: profili estrusi verniciati a polvere in qualsiasi colore RAL con stecche a 45° o 90°. Le persiane in legno — larice, abete o iroko — offrono un aspetto più tradizionale e sono trattate con impregnante o vernice per resistere alle intemperie.
            </p>
          </div>

        </div>

        {/* Terzo articolo */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Ogni persiana viene misurata sul posto e realizzata su misura con accessori di chiusura inclusi. Contattaci per un preventivo gratuito.
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
