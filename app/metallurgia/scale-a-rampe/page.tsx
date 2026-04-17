import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scale a Rampe a Palermo — Ferro e Acciaio su Misura',
  description: 'Scale a rampe in ferro e acciaio a Palermo su misura: gradini in legno o lamiera mandorlata, strutture portanti saldate, parapetti e corrimano inclusi.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/scale-a-rampe' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Scale a Rampe a Palermo — Ferro e Acciaio su Misura',
    description: 'Scale a rampe in ferro e acciaio a Palermo su misura: gradini in legno o lamiera mandorlata, strutture portanti saldate, parapetti e corrimano inclusi.',
    url: 'https://www.digi-home-design.com/metallurgia/scale-a-rampe',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Scale a Rampe
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Scale a Rampe a Palermo</h1>
      <p>Realizziamo <strong>scale a rampe in ferro e acciaio su misura a Palermo</strong>: scale a una, due o tre rampe con pianerottolo intermedio, struttura portante in ferro piatto o tubolare saldata in officina, gradini in legno massello, legno lamellare o lamiera mandorlata antiscivolo. Adatte per interni residenziali, soppalchi e accessi esterni.</p>
      <p style={{ marginTop: 12 }}>Ogni scala viene progettata rispettando le proporzioni ergonomiche (alzata 17–18 cm, pedata 28–30 cm) e i requisiti della normativa UNI EN 14975. Le strutture vengono verniciate a polvere in qualsiasi colore RAL e assemblate in opera con tasselli chimici ad alta resistenza. Parapetti e corrimano sono abbinabili alle ringhiere dello stesso stile.</p>
      <p style={{ marginTop: 12 }}>Contattaci per un sopralluogo gratuito e un preventivo su misura a Palermo e provincia.</p>
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
