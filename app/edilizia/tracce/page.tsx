import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Tracce a Palermo — Canalette per Impianti Elettrici e Idraulici',
  description: 'Tracce e canalette a Palermo per impianti elettrici, idraulici e gas: fresatura manuale e meccanica, ripristino dell\'intonaco e pulizia del cantiere.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/tracce' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tracce a Palermo — Canalette per Impianti Elettrici e Idraulici',
    description: 'Tracce e canalette a Palermo per impianti elettrici, idraulici e gas: fresatura manuale e meccanica, ripristino dell\'intonaco e pulizia del cantiere.',
    url: 'https://www.digi-home-design.com/edilizia/tracce',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Tracce<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Tracce a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.webp" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.webp" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Eseguiamo <strong>tracce e canalette a Palermo</strong> per il passaggio di impianti elettrici, idraulici, del gas e di climatizzazione: fresatura meccanica con carotatrice e flessibile, o demolizione manuale per interventi localizzati. Tracciamo pareti e soffitti seguendo il percorso ottimale indicato dall&apos;impiantista.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Dopo la posa delle tubazioni e dei corrugati da parte degli impiantisti, provvediamo alla chiusura delle tracce con malta di cemento o gesso, alla rasatura e all&apos;intonacatura di raccordo per un risultato pulito e pronto per la tinteggiatura.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Utilizziamo aspiratori industriali collegati alle frese per ridurre al minimo la polvere durante la lavorazione. Contattaci per un preventivo gratuito.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/edilizia" className="btn-black fs-12">← Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
