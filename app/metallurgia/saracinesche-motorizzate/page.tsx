import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Saracinesche Motorizzate a Palermo — Garage e Locali Commerciali',
  description: 'Saracinesche motorizzate a Palermo: avvolgibili in acciaio, alluminio e PVC con motorizzazione per garage, negozi e magazzini. Installazione e assistenza.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/saracinesche-motorizzate' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Saracinesche Motorizzate a Palermo — Garage e Locali Commerciali',
    description: 'Saracinesche motorizzate a Palermo: avvolgibili in acciaio, alluminio e PVC con motorizzazione per garage, negozi e magazzini. Installazione e assistenza.',
    url: 'https://www.digi-home-design.com/metallurgia/saracinesche-motorizzate',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Saracinesche Motorizzate
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Saracinesche Motorizzate a Palermo</h1>
      <p>Installiamo <strong>saracinesche motorizzate a Palermo</strong> per garage privati, negozi, magazzini e locali commerciali: avvolgibili in doghe di acciaio zincato, alluminio estruso e PVC coibentato, con motorizzazione a soffitto o laterale dei principali marchi — Hörmann, Novoferm, Grün, FAAC.</p>
      <p style={{ marginTop: 12 }}>I sistemi sono dotati di telecomando multi-frequenza, fotocellule di sicurezza e fermo meccanico anti-sollevamento. Su richiesta integriamo tastiere a codice, lettori badge e sistemi di apertura da smartphone. Per i locali commerciali proponiamo saracinesche con inserti in policarbonato per la vetrinatura notturna.</p>
      <p style={{ marginTop: 12 }}>Offriamo anche il servizio di manutenzione e riparazione di saracinesche esistenti: sostituzione motore, guide, doghe danneggiate e centraline. Contattaci per un sopralluogo gratuito e un preventivo a Palermo e provincia.</p>
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
