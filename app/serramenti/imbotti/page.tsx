import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Imbotti a Palermo — Rivestimento Vani Finestra in Alluminio e PVC',
  description: 'Imbotti a Palermo in alluminio e PVC per il rivestimento dei vani finestra: eliminano ponti termici, proteggono la muratura e danno un aspetto finito all\'infisso.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/imbotti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Imbotti a Palermo — Rivestimento Vani Finestra in Alluminio e PVC',
    description: 'Imbotti a Palermo in alluminio e PVC per il rivestimento dei vani finestra: eliminano ponti termici, proteggono la muratura e danno un aspetto finito all\'infisso.',
    url: 'https://www.digi-home-design.com/serramenti/imbotti',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Imbotti
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Imbotti a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/serramenti/imbotti-in-alluminio/20240802_183635.jpg" alt="Imbotti in alluminio installati" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Imbotti in alluminio installati</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 280, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/serramenti/imbotti-in-alluminio/cassonetto_mediterraneo-800x533.jpg" alt="Cassonetto mediterraneo in alluminio" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Cassonetto mediterraneo in alluminio</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli <strong>imbotti in alluminio e PVC a Palermo</strong> rivestono il vano finestra tra il telaio dell&apos;infisso e la muratura esterna, eliminando i ponti termici perimetrali, proteggendo l&apos;intonaco dall&apos;umidità di infiltrazione e conferendo all&apos;apertura un aspetto pulito e rifinito. Sono realizzati su misura per adattarsi a qualsiasi spessore di muro e profondità del vano.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli imbotti in alluminio vengono verniciati nello stesso colore dell&apos;infisso per continuità estetica, mentre quelli in PVC sono disponibili in bianco e in versione foliata. La posa avviene con aggancio a clips o con viti a scomparsa, senza bisogno di opere murarie aggiuntive, e il giunto perimetrale viene sigillato con silicone neutro per la tenuta all&apos;acqua.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Vengono installati contestualmente alla posa degli infissi o come intervento autonomo su serramenti esistenti. Contattaci per un preventivo gratuito.
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
