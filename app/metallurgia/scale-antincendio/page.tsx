import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scale Antincendio a Palermo — Acciaio Zincato Certificate',
  description: 'Scale antincendio esterne a Palermo in acciaio zincato: scale di emergenza per edifici residenziali e commerciali, certificate secondo normativa VVF. Posa inclusa.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/scale-antincendio' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Scale Antincendio a Palermo — Acciaio Zincato Certificate',
    description: 'Scale antincendio esterne a Palermo in acciaio zincato: scale di emergenza per edifici residenziali e commerciali, certificate secondo normativa VVF. Posa inclusa.',
    url: 'https://www.digi-home-design.com/metallurgia/scale-antincendio',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Scale Antincendio
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Scale Antincendio a Palermo</h1>
      <p>Progettiamo e installiamo <strong>scale antincendio esterne a Palermo</strong> in acciaio zincato a caldo: scale di emergenza per edifici residenziali, condomini, uffici e attività commerciali soggette a controllo dei Vigili del Fuoco. La struttura portante in profilati UPN e IPE viene zincata a caldo per garantire la massima resistenza alla corrosione in ambiente esterno.</p>
      <p style={{ marginTop: 12 }}>I gradini sono in lamiera mandorlata antiscivolo da 3–4 mm con battitacco. Il parapetto perimetrale raggiunge l&apos;altezza minima di 100 cm con corrente intermedio e mancorrente in tubo tondo, come previsto dalla normativa UNI EN ISO 14122. Ogni scala viene progettata in conformità al D.M. 3 agosto 2015 e alle prescrizioni specifiche del SUAP e dei VVF.</p>
      <p style={{ marginTop: 12 }}>Collaboriamo con tecnici abilitati per la pratica SCIA antincendio. Contattaci per un sopralluogo gratuito e un preventivo a Palermo e provincia.</p>
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
