import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Scale a Chiocciola a Palermo — Ferro e Acciaio su Misura',
  description: 'Scale a chiocciola in ferro e acciaio a Palermo su misura: scale elicoidali compatte per soppalchi, sottotetti e spazi ridotti. Gradini in legno o metallo.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/scale-a-chiocciola' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Scale a Chiocciola a Palermo — Ferro e Acciaio su Misura',
    description: 'Scale a chiocciola in ferro e acciaio a Palermo su misura: scale elicoidali compatte per soppalchi, sottotetti e spazi ridotti. Gradini in legno o metallo.',
    url: 'https://www.digi-home-design.com/metallurgia/scale-a-chiocciola',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Scale a Chiocciola
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Scale a Chiocciola a Palermo</h1>

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
              Realizziamo <strong>scale a chiocciola in ferro e acciaio su misura a Palermo</strong>: scale elicoidali compatte con palo centrale in tubo di acciaio, gradini a ventaglio in legno massello, lamiera mandorlata o acciaio inox, ideali per collegare soppalchi, sottotetti e livelli in spazi dove una scala tradizionale a rampe non è realizzabile.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il diametro è personalizzabile da 120 a 200 cm per adattarsi all&apos;ingombro disponibile. I gradini vengono calcolati per garantire una pedata utile adeguata e un&apos;alzata regolare su tutta la rotazione. Corrimano e ringhiera elicoidale sono saldati al palo centrale e alle punte dei gradini per la massima rigidità strutturale.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Finitura a polvere in qualsiasi colore RAL. Contattaci per un sopralluogo gratuito e un preventivo su misura a Palermo e provincia.
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

      <Link href="/metallurgia" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Metallurgia</Link>
    </div>
  )
}
