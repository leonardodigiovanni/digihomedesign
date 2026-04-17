import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tetti Coibentati a Palermo — Coperture Metalliche su Misura',
  description: 'Tetti coibentati a Palermo: pannelli sandwich, lamiera grecata e coperture metalliche per abitazioni e capannoni industriali. Posa e coibentazione incluse.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/tetti-coibentati' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tetti Coibentati a Palermo — Coperture Metalliche su Misura',
    description: 'Tetti coibentati a Palermo: pannelli sandwich, lamiera grecata e coperture metalliche per abitazioni e capannoni industriali. Posa e coibentazione incluse.',
    url: 'https://www.digi-home-design.com/metallurgia/tetti-coibentati',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Tetti Coibentati
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Tetti Coibentati a Palermo</h1>
      <p>Realizziamo e installiamo <strong>coperture metalliche coibentate a Palermo</strong> per abitazioni, ville, tettoie e capannoni industriali: pannelli sandwich con anima in poliuretano o lana di roccia, lamiera grecata zincata con strato isolante, coperture in alluminio e acciaio preverniciato. I tetti coibentati garantiscono ottimo isolamento termico, eliminano i ponti freddi e riducono significativamente il carico degli impianti di climatizzazione.</p>
      <p style={{ marginTop: 12 }}>I pannelli sandwich sono disponibili in spessori da 40 a 120 mm, con rivestimento esterno in acciaio zincato o alluminio in vari colori RAL. Realizziamo anche interventi di coibentazione su coperture esistenti con pannelli aggiuntivi o materassini isolanti sotto lamiera.</p>
      <p style={{ marginTop: 12 }}>Gestiamo la posa completa dalla struttura portante alla copertura finita. Contattaci per un sopralluogo e un preventivo gratuito a Palermo e provincia.</p>
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
