import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Allacci a Palermo — Acqua, Gas ed Elettricità',
  description: 'Allacci idrici, gas ed elettrici a Palermo: gestione pratiche, scavi, posa tubazioni e collaudi per nuove utenze e variazioni di contratto.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/allacci' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Allacci a Palermo — Acqua, Gas ed Elettricità',
    description: 'Allacci idrici, gas ed elettrici a Palermo: gestione pratiche, scavi, posa tubazioni e collaudi per nuove utenze e variazioni di contratto.',
    url: 'https://www.digi-home-design.com/termodinamica/allacci',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Allacci
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Allacci a Palermo
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
              Gestiamo le pratiche e i lavori per <strong>allacci idrici, gas ed elettrici a Palermo</strong>: dalle richieste agli enti erogatori fino alla posa delle tubazioni e al collaudo finale. Un unico interlocutore per tutte le utenze, con gestione completa della burocrazia e dei rapporti con i gestori di rete.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              I servizi includono: nuovi allacci per costruzioni e ristrutturazioni, spostamento di contatori e derivazioni, adeguamento degli impianti a nuove normative, scavi e ripristino del manto stradale in coordinamento con il Comune di Palermo.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Disponiamo di tecnici abilitati per lavori su gas (patentino installatori), impianti elettrici (D.M. 37/08) e impianti idrosanitari. Contattaci per una consulenza gratuita e un preventivo trasparente.
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
