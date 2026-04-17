import Link from 'next/link'
import type { Metadata } from 'next'

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
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Scale a Chiocciola
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Scale a Chiocciola a Palermo</h1>
      <p>Realizziamo <strong>scale a chiocciola in ferro e acciaio su misura a Palermo</strong>: scale elicoidali compatte con palo centrale in tubo di acciaio, gradini a ventaglio in legno massello, lamiera mandorlata o acciaio inox, ideali per collegare soppalchi, sottotetti e livelli in spazi dove una scala tradizionale a rampe non è realizzabile.</p>
      <p style={{ marginTop: 12 }}>Il diametro è personalizzabile da 120 a 200 cm per adattarsi all&apos;ingombro disponibile. I gradini vengono calcolati per garantire una pedata utile adeguata e un&apos;alzata regolare su tutta la rotazione. Corrimano e ringhiera elicoidale sono saldati al palo centrale e alle punte dei gradini per la massima rigidità strutturale.</p>
      <p style={{ marginTop: 12 }}>Finitura a polvere in qualsiasi colore RAL. Contattaci per un sopralluogo gratuito e un preventivo su misura a Palermo e provincia.</p>
      {/* CTA esclusivi */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 40, padding: '20px', background: '#fdfcf8', border: '1px solid #e8d89a', borderRadius: 10 }}>
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px' }}>Hai un progetto in mente?</p>
          <Link href="/aiuto/guida-preventivo" style={{ display: 'inline-block', padding: '10px 20px', background: '#c8960c', color: '#fff', borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            Calcola il tuo preventivo
          </Link>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px' }}>Hai già un cantiere aperto?</p>
          <Link href="/aiuto/guida-cantiere" style={{ display: 'inline-block', padding: '10px 20px', background: '#1a1a1a', color: '#fff', borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            Segui il tuo cantiere online
          </Link>
        </div>
      </div>
      <Link href="/metallurgia" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Metallurgia</Link>
    </div>
  )
}
