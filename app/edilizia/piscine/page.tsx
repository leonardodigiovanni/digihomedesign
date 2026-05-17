import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Piscine a Palermo — Costruzione e Ristrutturazione',
  description: 'Piscine a Palermo: costruzione di piscine interrate su misura, ristrutturazione e impermeabilizzazione di vasche esistenti. Impianti di filtrazione inclusi.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/piscine' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Piscine a Palermo — Costruzione e Ristrutturazione',
    description: 'Piscine a Palermo: costruzione di piscine interrate su misura, ristrutturazione e impermeabilizzazione di vasche esistenti. Impianti di filtrazione inclusi.',
    url: 'https://www.digi-home-design.com/edilizia/piscine',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Piscine
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Piscine a Palermo</h1>

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
              Realizziamo <strong>piscine a Palermo</strong> su misura: interrate in cls armato con rivestimento in liner PVC, in mosaico di vetro, in resina o in gres porcellanato. Progettiamo la vasca in base allo spazio disponibile, alle normative locali e alle preferenze estetiche del cliente, con forme libere o geometriche.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio è chiavi in mano: scavo, opere in cls, impermeabilizzazione, rivestimento, impianto di filtrazione e circolazione, skimmer, scalette, luci subacquee e automatismi per la copertura. Installiamo anche sistemi di trattamento acqua a sale, UV o ozono per ridurre l&apos;uso di cloro.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Eseguiamo anche il rifacimento e l&apos;impermeabilizzazione di piscine esistenti con sostituzione del liner o applicazione di rivestimenti in resina poliuretanica. Contattaci per un sopralluogo e un progetto gratuito.
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
