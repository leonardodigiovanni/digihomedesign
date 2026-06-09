import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Pitturazioni Decorative a Palermo — Velature e Tecniche Artistiche',
  description: 'Pitturazioni decorative a Palermo: velature, spatolati, marmorini, effetti metallici e tecniche artistiche per pareti di interni di pregio.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/pitturazioni' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pitturazioni Decorative a Palermo — Velature e Tecniche Artistiche',
    description: 'Pitturazioni decorative a Palermo: velature, spatolati, marmorini, effetti metallici e tecniche artistiche per pareti di interni di pregio.',
    url: 'https://www.digi-home-design.com/edilizia/pitturazioni',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Pitturazioni
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Pitturazioni Decorative a Palermo</h1>

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
              Realizziamo <strong>pitturazioni decorative a Palermo</strong> per interni di pregio: velature traslucide, spatolati lisci e sabbiati, marmorino veneziano, effetti metallici, stucco lucido, pittura a calce e tecniche miste. Ogni finitura è applicata a mano da decoratori specializzati con esperienza pluriennale.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le pitturazioni decorative trasformano una semplice parete in un elemento di arredo, con texture, profondità e giochi di luce impossibili da ottenere con pitture standard. Realizziamo campioni su pannello prima dell&apos;applicazione definitiva, così il cliente può valutare l&apos;effetto in luce naturale e artificiale.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Disponibile anche il servizio di restauro e ripristino di affreschi e decorazioni storiche. Contattaci per una consulenza creativa gratuita a Palermo.
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
