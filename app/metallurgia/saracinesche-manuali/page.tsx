import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Saracinesche Manuali a Palermo — Garage e Locali Commerciali',
  description: 'Saracinesche manuali a Palermo: avvolgibili in acciaio, alluminio e PVC con manovra manuale per garage, negozi e magazzini. Fornitura, posa e assistenza.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/saracinesche-manuali' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Saracinesche Manuali a Palermo — Garage e Locali Commerciali',
    description: 'Saracinesche manuali a Palermo: avvolgibili in acciaio, alluminio e PVC con manovra manuale per garage, negozi e magazzini. Fornitura, posa e assistenza.',
    url: 'https://www.digi-home-design.com/metallurgia/saracinesche-manuali',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Saracinesche Manuali
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Saracinesche Manuali a Palermo</h1>
      <p>Forniamo e installiamo <strong>saracinesche manuali a Palermo</strong> per garage privati, negozi, magazzini e locali commerciali: avvolgibili in doghe di acciaio zincato, alluminio estruso e PVC coibentato con manovra a cinghia, molla di bilanciamento o moschettone. Soluzione affidabile e senza componenti elettrici, ideale dove non è disponibile l&apos;alimentazione o si preferisce la semplicità di utilizzo.</p>
      <p style={{ marginTop: 12 }}>Le saracinesche manuali sono disponibili in larghezze fino a 4 m e altezze fino a 3,5 m. Le guide in acciaio zincato e il cassonetto di contenimento sono verniciati a polvere in qualsiasi colore RAL. Su richiesta installiamo serrature a lucchetto o cilindro per la chiusura di sicurezza notturna.</p>
      <p style={{ marginTop: 12 }}>Offriamo anche il servizio di manutenzione e riparazione di saracinesche esistenti: sostituzione guide, doghe danneggiate e molle di bilanciamento. Contattaci per un sopralluogo gratuito e un preventivo a Palermo e provincia.</p>
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
