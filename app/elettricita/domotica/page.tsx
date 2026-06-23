import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Domotica a Palermo — Smart Home e Automazione Edifici',
  description: 'Domotica a Palermo: sistemi smart home per controllo luci, tapparelle, riscaldamento, irrigazione e sicurezza da smartphone. Soluzioni su misura.',
  alternates: { canonical: 'https://www.digi-home-design.com/elettricita/domotica' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Domotica a Palermo — Smart Home e Automazione Edifici',
    description: 'Domotica a Palermo: sistemi smart home per controllo luci, tapparelle, riscaldamento, irrigazione e sicurezza da smartphone. Soluzioni su misura.',
    url: 'https://www.digi-home-design.com/elettricita/domotica',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/elettricita" style={{ color: '#888', textDecoration: 'underline' }}>Elettricità</Link> / Domotica
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Domotica a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="240px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="240px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Trasformiamo la tua abitazione in una <strong>smart home a Palermo</strong>: sistemi domotici per il controllo centralizzato di luci, tapparelle, riscaldamento, climatizzazione, irrigazione e antifurto, tutti gestibili da smartphone o tablet ovunque tu sia.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Lavoriamo con le principali piattaforme del mercato — KNX, BTicino Living Now, Philips Hue, Google Home, Amazon Alexa — adattando la soluzione alle caratteristiche dell&apos;immobile e al budget del cliente. I sistemi wireless sono installabili anche senza opere murarie, ideali per appartamenti in affitto o in ristrutturazione leggera.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              La domotica non è solo comodità: riduce i consumi energetici attraverso scenari automatizzati e programmazioni intelligenti. Contattaci per una demo gratuita e un preventivo su misura.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/elettricita" className="btn-black fs-12" style={{ flex: 1 }}>← Torna a Elettricità</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1 }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
