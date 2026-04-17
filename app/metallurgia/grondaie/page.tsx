import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Grondaie a Palermo — Alluminio, Rame e PVC su Misura',
  description: 'Grondaie e pluviali a Palermo su misura in alluminio, rame e PVC: fornitura e posa con staffaggi e giunzioni. Sostituzione grondaie esistenti e nuove installazioni.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/grondaie' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Grondaie a Palermo — Alluminio, Rame e PVC su Misura',
    description: 'Grondaie e pluviali a Palermo su misura in alluminio, rame e PVC: fornitura e posa con staffaggi e giunzioni. Sostituzione grondaie esistenti e nuove installazioni.',
    url: 'https://www.digi-home-design.com/metallurgia/grondaie',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Grondaie
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Grondaie a Palermo</h1>
      <p>Forniamo e installiamo <strong>grondaie e pluviali su misura a Palermo</strong> in alluminio preverniciato, rame e PVC: grondaie semicircolari e rettangolari con pluviali a sezione quadra o tonda, staffaggi in acciaio zincato e giunzioni a saldatura o a guarnizione. Gestiamo sia nuove installazioni che la sostituzione di grondaie esistenti deteriorate o inadeguate.</p>
      <p style={{ marginTop: 12 }}>Le grondaie in alluminio preverniciato sono la soluzione più diffusa per durata e assenza di manutenzione: disponibili in oltre 20 colori RAL, resistenti alla corrosione e al sole siciliano. Le grondaie in rame offrono un aspetto più pregiato e una durata eccezionale, ideali per edifici storici o di pregio. Il PVC è la scelta economica per installazioni semplici.</p>
      <p style={{ marginTop: 12 }}>Interveniamo anche per riparazioni, pulizia e adeguamento di grondaie esistenti. Contattaci per un sopralluogo e un preventivo gratuito a Palermo e provincia.</p>
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
