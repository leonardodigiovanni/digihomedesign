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
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Indoratura
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Indoratura a Palermo</h1>

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

      <Link href="/edilizia" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Edilizia</Link>
    </div>
  )
}
