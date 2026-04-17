import Link from 'next/link'
import type { Metadata } from 'next'

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
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Tracce
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Tracce a Palermo</h1>
      <p>Eseguiamo <strong>tracce e canalette a Palermo</strong> per il passaggio di impianti elettrici, idraulici, del gas e di climatizzazione: fresatura meccanica con carotatrice e flessibile, o demolizione manuale per interventi localizzati. Tracciamo pareti e soffitti seguendo il percorso ottimale indicato dall&apos;impiantista.</p>
      <p style={{ marginTop: 12 }}>Dopo la posa delle tubazioni e dei corrugati da parte degli impiantisti, provvediamo alla chiusura delle tracce con malta di cemento o gesso, alla rasatura e all&apos;intonacatura di raccordo per un risultato pulito e pronto per la tinteggiatura.</p>
      <p style={{ marginTop: 12 }}>Utilizziamo aspiratori industriali collegati alle frese per ridurre al minimo la polvere durante la lavorazione. Contattaci per un preventivo gratuito.</p>
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
      <Link href="/edilizia" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Edilizia</Link>
    </div>
  )
}
