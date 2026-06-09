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
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Piscine
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Piscine a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/edilizia" className="btn-black fs-12" style={{ flex: 1 }}>← Torna a Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1 }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
