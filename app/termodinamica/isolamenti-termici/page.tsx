import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Isolamenti Termici a Palermo — Cappotto e Soluzioni Energetiche',
  description: 'Isolamento termico a Palermo: cappotto esterno, isolamento sottotetto e pareti interne per ridurre le dispersioni e migliorare la classe energetica.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/isolamenti-termici' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Isolamenti Termici a Palermo — Cappotto e Soluzioni Energetiche',
    description: 'Isolamento termico a Palermo: cappotto esterno, isolamento sottotetto e pareti interne per ridurre le dispersioni e migliorare la classe energetica.',
    url: 'https://www.digi-home-design.com/termodinamica/isolamenti-termici',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Isolamenti Termici
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Isolamenti Termici a Palermo
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
              Un buon <strong>isolamento termico</strong> riduce drasticamente i consumi energetici, migliora il comfort abitativo e aumenta la classe energetica dell&apos;edificio. Realizziamo cappotti termici esterni, isolamenti di sottotetti, solai, pareti interne e contropareti con materiali certificati ad alta performance.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Utilizziamo pannelli in EPS, lana di roccia, fibra di legno e soluzioni a cappotto ventilato, scelti in base alle caratteristiche dell&apos;edificio e agli obiettivi energetici del cliente. Ogni intervento viene preceduto da una diagnosi energetica gratuita.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli interventi possono beneficiare degli incentivi fiscali vigenti (Superbonus, Ecobonus). Forniamo assistenza completa per la gestione delle pratiche. Contattaci per un sopralluogo gratuito a Palermo e provincia.
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

      <Link href="/termodinamica" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Termodinamica
      </Link>
    </div>
  )
}
