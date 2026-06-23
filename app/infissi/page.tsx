import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Infissi a Palermo — Finestre e Porte-Finestre su Misura',
  description: 'Infissi a Palermo: finestre, porte-finestre e scorrevoli su misura in alluminio e PVC. Installazione e garanzia incluse. Richiedi un preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/infissi' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Infissi a Palermo — Finestre e Porte-Finestre su Misura',
    description: 'Infissi a Palermo: finestre, porte-finestre e scorrevoli su misura in alluminio e PVC. Installazione e garanzia incluse. Richiedi un preventivo gratuito.',
    url: 'https://www.digi-home-design.com/infissi',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Infissi
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Infissi a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
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
              Siamo specialisti nella fornitura e installazione di <strong>infissi a Palermo</strong>: finestre, porte-finestre e vetrate scorrevoli realizzate su misura per ogni tipo di abitazione o ufficio. Utilizziamo profili in alluminio e PVC di alta qualità, con vetri a bassa emissività per il massimo isolamento termico e acustico.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni progetto parte da un sopralluogo gratuito: misuriamo, consigliamo i materiali più adatti e gestiamo la posa in opera con squadre specializzate. I nostri infissi sono installati a regola d&apos;arte e corredati da garanzia su prodotto e manodopera.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Che si tratti di una singola finestra o di una ristrutturazione completa, siamo il tuo referente unico a Palermo per infissi di qualità a prezzi competitivi. Contattaci per un preventivo personalizzato.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/" className="btn-black fs-12" style={{ flex: 1 }}>← Home</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1 }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
