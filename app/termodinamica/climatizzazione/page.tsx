import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Climatizzazione a Palermo — Condizionatori e Impianti',
  description: 'Climatizzazione a Palermo: vendita, installazione e manutenzione di condizionatori monosplit, multisplit e sistemi centralizzati. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/climatizzazione' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Climatizzazione a Palermo — Condizionatori e Impianti',
    description: 'Climatizzazione a Palermo: vendita, installazione e manutenzione di condizionatori monosplit, multisplit e sistemi centralizzati. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/termodinamica/climatizzazione',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Climatizzazione
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Climatizzazione a Palermo</h1>

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
              Installiamo e manuteniamo <strong>impianti di climatizzazione a Palermo</strong> per abitazioni, uffici e locali commerciali: sistemi monosplit, multisplit e VRF per edifici con più unità. Lavoriamo con i principali marchi del settore — Daikin, Mitsubishi, Fujitsu, Samsung — garantendo efficienza energetica e silenziosità.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio comprende sopralluogo gratuito, progettazione dell&apos;impianto, fornitura delle unità, posa dei circuiti frigoriferi e collaudo finale. Ci occupiamo anche della ricarica del gas refrigerante e della manutenzione periodica per mantenere le prestazioni nel tempo.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Tutti gli impianti vengono installati da tecnici certificati F-Gas in conformità alla normativa vigente. Contattaci per un preventivo gratuito.
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
