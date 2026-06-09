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
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Allacci
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Allacci a Palermo</h1>

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

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/termodinamica" className="btn-black fs-12" style={{ flex: 1 }}>← Torna a Termodinamica</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1 }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
