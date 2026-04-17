import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Casseforti a Palermo — Da Incasso e a Pavimento',
  description: 'Casseforti a Palermo: fornitura e installazione di casseforti da incasso, a pavimento e da mobile per abitazioni e attività commerciali. Certificazione EN 1143-1.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/casseforti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Casseforti a Palermo — Da Incasso e a Pavimento',
    description: 'Casseforti a Palermo: fornitura e installazione di casseforti da incasso, a pavimento e da mobile per abitazioni e attività commerciali. Certificazione EN 1143-1.',
    url: 'https://www.digi-home-design.com/metallurgia/casseforti',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Casseforti
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Casseforti a Palermo</h1>
      <p>Forniamo e installiamo <strong>casseforti a Palermo</strong> certificate EN 1143-1 per abitazioni private, uffici, alberghi e attività commerciali: modelli da incasso a muro, a pavimento con ancoraggio in cls, da mobile e portatili. Le serrature disponibili sono a chiave doppia mappa, a combinazione meccanica, elettronica con codice PIN e biometrica con impronta digitale.</p>
      <p style={{ marginTop: 12 }}>La classe di resistenza (da I a VI) determina la protezione contro lo scasso: scegliamo insieme la classe più adatta in base al valore dei beni da custodire e al contesto di rischio. Le casseforti ignifughe (classe S60DIS o S120DIS) proteggono anche da incendio e acqua degli sprinkler.</p>
      <p style={{ marginTop: 12 }}>L&apos;installazione include il posizionamento, l&apos;ancoraggio strutturale e la programmazione della serratura. Contattaci per un preventivo gratuito a Palermo e provincia.</p>
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
