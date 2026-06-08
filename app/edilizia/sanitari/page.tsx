import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Sanitari a Palermo — Fornitura e Installazione Bagni',
  description: 'Sanitari a Palermo: fornitura e installazione di wc, lavabi, bidet, vasche, box doccia e rubinetteria. Rifacimento bagni completo chiavi in mano.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/sanitari' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Sanitari a Palermo — Fornitura e Installazione Bagni',
    description: 'Sanitari a Palermo: fornitura e installazione di wc, lavabi, bidet, vasche, box doccia e rubinetteria. Rifacimento bagni completo chiavi in mano.',
    url: 'https://www.digi-home-design.com/edilizia/sanitari',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Sanitari
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Sanitari a Palermo</h1>

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
              Forniamo e installiamo <strong>sanitari a Palermo</strong>: wc sospesi e a pavimento, lavabi, bidet, vasche da bagno, piatti doccia, box doccia su misura e rubinetteria di design. Lavoriamo con marchi selezionati — Ideal Standard, Catalano, Duravit, Hansgrohe — per garantire qualità e durata nel tempo.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio di rifacimento bagno è chiavi in mano: demoluiamo i vecchi sanitari, adeguiamo gli scarichi e i sifoni, poniamo i nuovi elementi, siliconiamo i raccordi e collaghiamo i flessibili. Gestiamo anche il collegamento alla rete idrica con miscelatori termostatici e sistemi di scarico a zaino.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Disponibile anche la sola sostituzione di singoli elementi senza demolizioni murarie. Contattaci per un preventivo gratuito a Palermo e provincia.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/edilizia" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>← Torna a Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
