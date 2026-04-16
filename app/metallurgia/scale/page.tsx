import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scale in Ferro a Palermo — Interne ed Esterne su Misura',
  description: 'Scale in ferro e acciaio a Palermo su misura: scale a giorno, elicoidali, retrattili e scale esterne di servizio. Design e sicurezza in ogni realizzazione.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/scale' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Scale in Ferro a Palermo — Interne ed Esterne su Misura',
    description: 'Scale in ferro e acciaio a Palermo su misura: scale a giorno, elicoidali, retrattili e scale esterne di servizio. Design e sicurezza in ogni realizzazione.',
    url: 'https://www.digi-home-design.com/metallurgia/scale',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Scale
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Scale in Ferro a Palermo</h1>
      <p>Realizziamo <strong>scale in ferro e acciaio su misura a Palermo</strong>: scale a giorno con gradini in legno o in lamiera mandorlata, scale elicoidali compatte per spazi ridotti, scale retrattili per accesso a soppalchi e sottotetti, e scale esterne di servizio in acciaio zincato per edifici e terrazze.</p>
      <p style={{ marginTop: 12 }}>Ogni scala viene progettata rispettando le proporzioni ergonomiche (alzata 17–18 cm, pedata 28–30 cm) e i requisiti di sicurezza della normativa UNI EN 14975. Le strutture portanti in ferro piatto o tubolare vengono saldate in officina, verniciate a polvere e assemblate in opera con tasselli chimici ad alta resistenza.</p>
      <p style={{ marginTop: 12 }}>I corrimano e i parapetti possono essere abbinati alle ringhiere dello stesso stile per una coerenza estetica totale. Contattaci per un progetto gratuito a Palermo e provincia.</p>
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
