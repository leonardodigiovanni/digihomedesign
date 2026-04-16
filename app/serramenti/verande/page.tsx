import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verande a Palermo — Alluminio e Vetro su Misura',
  description: 'Verande a Palermo su misura in alluminio e vetro: verande a vetri fissi, scorrevoli e con tetto apribile. Vivi il terrazzo tutto l\'anno. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/verande' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Verande a Palermo — Alluminio e Vetro su Misura',
    description: 'Verande a Palermo su misura in alluminio e vetro: verande a vetri fissi, scorrevoli e con tetto apribile. Vivi il terrazzo tutto l\'anno. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/serramenti/verande',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Verande
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Verande a Palermo</h1>
      <p>Realizziamo <strong>verande su misura a Palermo</strong> in alluminio e vetro temperato o stratificato: verande a pannelli fissi, a vetri scorrevoli su binario, con ante a libro e sistemi bioclimatici con tetto a lamelle orientabili per la ventilazione naturale. Trasformiamo balconi, terrazze e giardini in ambienti vivibili tutto l&apos;anno, protetti dal vento, dalla pioggia e dal sole estivo.</p>
      <p style={{ marginTop: 12 }}>I profili in alluminio a taglio termico garantiscono comfort termoacustico anche nei mesi invernali, mentre i vetri basso-emissivi riducono il surriscaldamento estivo. Le tende interne o integrate nel vetro (vetro con veneziana incorporata) completano il controllo solare senza interventi successivi.</p>
      <p style={{ marginTop: 12 }}>Gestiamo le pratiche SCIA o i permessi necessari in Comune di Palermo e provincia. Contattaci per un sopralluogo gratuito e un progetto su misura.</p>
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
      <Link href="/serramenti" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Serramenti</Link>
    </div>
  )
}
