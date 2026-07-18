import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Intonaci a Palermo — Civili, Rasature e Intonaci Esterni',
  description: 'Intonaci a Palermo: intonaci civili e rustici per interni ed esterni, rasature al gesso e intonaci termoisolanti. Posa manuale e meccanizzata.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/intonaci' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Intonaci a Palermo — Civili, Rasature e Intonaci Esterni',
    description: 'Intonaci a Palermo: intonaci civili e rustici per interni ed esterni, rasature al gesso e intonaci termoisolanti. Posa manuale e meccanizzata.',
    url: 'https://www.digi-home-design.com/edilizia/intonaci',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Intonaci<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Intonaci a Palermo</h1>

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
              Applichiamo <strong>intonaci a Palermo</strong> per interni ed esterni: intonaci rustici in sabbia e cemento, civili a tre strati, rasature al gesso per superfici lisce pronte per la tinteggiatura, e intonaci termoisolanti per il miglioramento energetico dell&apos;involucro edilizio.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Operiamo con posa manuale per superfici ridotte e con macchine intonacatrici per grandi superfici, riducendo i tempi di cantiere e garantendo uno strato omogeneo. Per gli esterni utilizziamo intonaci idrorepellenti e deumidificanti adatti al clima siciliano.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Prima della posa verifichiamo lo stato del supporto e provvediamo alla rimozione dell&apos;intonaco ammalorato. Contattaci per un sopralluogo gratuito a Palermo e provincia.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/edilizia" className="btn-black fs-12">← Torna a Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
