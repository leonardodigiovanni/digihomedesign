import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Porte Scrigno a Palermo — Porte a Scomparsa su Misura',
  description: 'Porte scrigno a Palermo: porte a scomparsa nel muro per ambienti moderni e funzionali. Installazione su muratura esistente o in fase di costruzione.',
  alternates: { canonical: 'https://www.digi-home-design.com/legno/porte-scrigno' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Porte Scrigno a Palermo — Porte a Scomparsa su Misura',
    description: 'Porte scrigno a Palermo: porte a scomparsa nel muro per ambienti moderni e funzionali. Installazione su muratura esistente o in fase di costruzione.',
    url: 'https://www.digi-home-design.com/legno/porte-scrigno',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/legno" style={{ color: '#888', textDecoration: 'underline' }}>Legno</Link> / Porte Scrigno
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Porte Scrigno a Palermo
      </h1>

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
              La <strong>porta scrigno</strong> — o porta a scomparsa — è la soluzione ideale per chi vuole massimizzare lo spazio e ottenere un effetto visivo pulito e continuo. L&apos;anta scorre all&apos;interno del controtelaio nascosto nella muratura, eliminando lo spazio occupato da battente e maniglia quando la porta è aperta.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Installiamo sistemi scrigno a Palermo per vani di qualsiasi dimensione, sia in fase di nuova costruzione che su muratura esistente con apertura del vano. I controtelai sono in acciaio zincato con guide silenziate; le ante possono essere in qualsiasi essenza, laccate o rivestite in vetro per effetto continuità con la parete.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il sistema è disponibile anche in versione a doppia anta per aperture ampie. Contattaci per un sopralluogo gratuito e scopri la soluzione più adatta al tuo spazio.
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

      <Link href="/legno" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Legno
      </Link>
    </div>
  )
}
