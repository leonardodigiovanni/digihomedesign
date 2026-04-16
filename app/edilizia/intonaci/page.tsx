import Link from 'next/link'
import type { Metadata } from 'next'

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
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Intonaci
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Intonaci a Palermo</h1>
      <p>Applichiamo <strong>intonaci a Palermo</strong> per interni ed esterni: intonaci rustici in sabbia e cemento, civili a tre strati, rasature al gesso per superfici lisce pronte per la tinteggiatura, e intonaci termoisolanti per il miglioramento energetico dell&apos;involucro edilizio.</p>
      <p style={{ marginTop: 12 }}>Operiamo con posa manuale per superfici ridotte e con macchine intonacatrici per grandi superfici, riducendo i tempi di cantiere e garantendo uno strato omogeneo. Per gli esterni utilizziamo intonaci idrorepellenti e deumidificanti adatti al clima siciliano.</p>
      <p style={{ marginTop: 12 }}>Prima della posa verifichiamo lo stato del supporto e provvediamo alla rimozione dell&apos;intonaco ammalorato. Contattaci per un sopralluogo gratuito a Palermo e provincia.</p>
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
