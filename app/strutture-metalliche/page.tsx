import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Strutture Metalliche a Palermo — Tettoie, Pensiline, Pergolati',
  description: 'Strutture metalliche a Palermo: tettoie, pensiline, scale e pergolati su misura in acciaio e alluminio. Progettazione e installazione professionale.',
  alternates: { canonical: 'https://www.digi-home-design.com/strutture-metalliche' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Strutture Metalliche a Palermo — Tettoie, Pensiline, Pergolati',
    description: 'Strutture metalliche a Palermo: tettoie, pensiline, scale e pergolati su misura in acciaio e alluminio. Progettazione e installazione professionale.',
    url: 'https://www.digi-home-design.com/strutture-metalliche',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Strutture Metalliche
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Strutture Metalliche a Palermo</h1>

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
              Progettiamo e installiamo <strong>strutture metalliche a Palermo</strong> su misura: tettoie, pensiline, scale interne ed esterne, pergolati e carport in acciaio zincato e alluminio. Ogni struttura viene dimensionata da tecnici qualificati nel rispetto delle normative antisismiche e delle prescrizioni edilizie locali.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo sia strutture di copertura per spazi esterni — garage, aree commerciali, cortili — sia elementi decorativi e funzionali per abitazioni private. I materiali utilizzati garantiscono resistenza agli agenti atmosferici e durata nel tempo, con finiture zincate, verniciate o in acciaio inox.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Offriamo un servizio completo: progettazione, pratica edilizia se necessaria, fornitura e montaggio con squadre specializzate. Contattaci per un sopralluogo gratuito e un preventivo su misura.
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
