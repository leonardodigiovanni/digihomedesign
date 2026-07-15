import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Indoratura a Palermo — Dorature su Cornici, Soffitti e Arredi',
  description: 'Indoratura artigianale a Palermo: applicazione di foglia d\'oro e metalli preziosi su cornici, soffitti, capitelli e mobili. Restauro e nuove realizzazioni.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/indoratura' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Indoratura a Palermo — Dorature su Cornici, Soffitti e Arredi',
    description: 'Indoratura artigianale a Palermo: applicazione di foglia d\'oro e metalli preziosi su cornici, soffitti, capitelli e mobili. Restauro e nuove realizzazioni.',
    url: 'https://www.digi-home-design.com/edilizia/indoratura',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Indoratura
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Indoratura a Palermo</h1>

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
              L&apos;<strong>indoratura artigianale</strong> è una delle arti decorative più raffinate: l&apos;applicazione di foglia d&apos;oro, argento, rame e altri metalli preziosi su superfici architettoniche e mobili trasforma ogni ambiente in uno spazio di grande impatto visivo. Realizziamo indorature a Palermo su cornici, soffitti a cassettoni, capitelli, colonne, altari, specchiere e mobili antichi e moderni.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Utilizziamo la tecnica tradizionale a missione (olio o acqua) con foglia oro in libro da 23,75 carati, o tecniche moderne con polveri metalliche per grandi superfici. Ogni intervento è preceduto dalla preparazione del supporto con gesso e bolo armeno per garantire la massima brillantezza del metallo.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Eseguiamo anche restauro e ripristino di dorature esistenti scolorite o danneggiate. Contattaci per un preventivo gratuito a Palermo e provincia.
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
