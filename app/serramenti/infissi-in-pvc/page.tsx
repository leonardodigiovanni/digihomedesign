import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Infissi in PVC a Palermo — Multicamera Alta Efficienza',
  description: 'Infissi in PVC a Palermo: finestre e porte-finestre multicamera con trasmittanza fino a 0,8 W/m²K. Isolamento termico e acustico superiore. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/infissi-in-pvc' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Infissi in PVC a Palermo — Multicamera Alta Efficienza',
    description: 'Infissi in PVC a Palermo: finestre e porte-finestre multicamera con trasmittanza fino a 0,8 W/m²K. Isolamento termico e acustico superiore. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/serramenti/infissi-in-pvc',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Infissi in PVC
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Infissi in PVC a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/serramenti/infissi-in-pvc/pvc-alphaluce.jpg" alt="Infissi in PVC Alphaluce" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Infissi in PVC Alphaluce</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 280, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/serramenti/infissi-in-pvc/Inalpha-Prestigio21.jpg" alt="Infissi in PVC Inalpha Prestigio" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Infissi in PVC Inalpha Prestigio</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli <strong>infissi in PVC a Palermo</strong> offrono il miglior rapporto qualità-prezzo per l&apos;isolamento termoacustico: i profili multicamera a 5, 6 o 7 camere raggiungono valori di trasmittanza termica Uf fino a 0,95 W/m²K, tra i più bassi sul mercato. Il PVC è un materiale intrinsecamente isolante, non necessita di taglio termico aggiuntivo e garantisce lunga durata senza manutenzione.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Installiamo sistemi dei principali brand europei — VEKA, Rehau, KBE, Aluplast — in versione bianca, foliata in varie essenze di legno e in colorazione integrale. Le ante sono disponibili nelle tipologie a battente, a vasistas, scorrevole parallela e alzante-scorrevole, abbinate a vetrocamera con gas argon e Low-E per la massima efficienza.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio è chiavi in mano: sopralluogo, rilievo, fornitura, posa e smaltimento dei vecchi infissi. Contattaci per un preventivo gratuito a Palermo e provincia.
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
