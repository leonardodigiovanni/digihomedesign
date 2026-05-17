import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Veneziane a Palermo — Interne ed Esterne su Misura',
  description: 'Veneziane a Palermo su misura: veneziane in alluminio da interni, veneziane esterne in alluminio e veneziane integrate nel vetrocamera. Controllo luce perfetto.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/veneziane' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Veneziane a Palermo — Interne ed Esterne su Misura',
    description: 'Veneziane a Palermo su misura: veneziane in alluminio da interni, veneziane esterne in alluminio e veneziane integrate nel vetrocamera. Controllo luce perfetto.',
    url: 'https://www.digi-home-design.com/serramenti/veneziane',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Veneziane
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Veneziane a Palermo</h1>

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
              Forniamo e installiamo <strong>veneziane su misura a Palermo</strong> in tre configurazioni: veneziane da interno in alluminio con stecche da 16, 25 o 50 mm per uffici e abitazioni; veneziane esterne in alluminio estruso ad alta resistenza per la protezione solare delle facciate; e veneziane integrate nel vetrocamera — racchiuse tra i due vetri — per il controllo della luce senza polvere e senza manutenzione.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le stecche sono orientabili e sollevabili tramite cordino, catena o motorizzazione. I colori disponibili coprono l&apos;intera gamma RAL con finiture opache, lucide e in legno vero per le versioni da interno di pregio. Le veneziane esterne sono motorizzabili e integrabili nei sistemi domotici per il controllo automatico in base all&apos;irraggiamento.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni veneziana viene misurata sul posto e realizzata su misura. Contattaci per un preventivo gratuito a Palermo e provincia.
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

      <Link href="/serramenti" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Serramenti</Link>
    </div>
  )
}
