import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

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
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Isolamenti Termici<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Isolamenti Termici a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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

        <StickyBottomBarContent>
          <Link href="/termodinamica" className="btn-black fs-12">← Torna a Termodinamica</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
