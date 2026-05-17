import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Tapparelle Motorizzate a Palermo — Automazione e Domotica',
  description: 'Tapparelle motorizzate a Palermo: motori tubulari Somfy, Nice, Came con telecomando, timer e integrazione domotica. Retrofit su avvolgibili esistenti. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/tapparelle-motorizzate' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tapparelle Motorizzate a Palermo — Automazione e Domotica',
    description: 'Tapparelle motorizzate a Palermo: motori tubulari Somfy, Nice, Came con telecomando, timer e integrazione domotica. Retrofit su avvolgibili esistenti. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/serramenti/tapparelle-motorizzate',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Tapparelle Motorizzate
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Tapparelle Motorizzate a Palermo</h1>

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
              Installiamo <strong>tapparelle motorizzate a Palermo</strong> con motori tubulari silenziosi integrati nell&apos;avvolgitore: comando tramite pulsante a parete, telecomando radio o app da smartphone. Compatibili con i principali sistemi domotici — KNX, BTicino, Google Home, Alexa — per l&apos;automazione programmata in base all&apos;ora, alla luce solare e al vento.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I motori — Somfy, Nice, Came, Rolly — sono dotati di finecorsa meccanico o elettronico e di sistema anti-ostacolo per la sicurezza di bambini e animali. Le tapparelle sono disponibili in doghe di PVC coibentato, alluminio estruso e acciaio zincato per applicazioni di sicurezza rinforzata.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Installiamo motorizzazioni su avvolgibili esistenti (retrofit) senza sostituire l&apos;intera tapparella, riducendo i costi di intervento. Contattaci per un sopralluogo gratuito e un preventivo a Palermo e provincia.
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
