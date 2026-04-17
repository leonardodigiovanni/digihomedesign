import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vetrine Commerciali a Palermo — Alluminio su Misura per Negozi',
  description: 'Vetrine commerciali a Palermo in alluminio su misura: ingressi con porta e vetrina fissa, sistemi scorrevoli e pieghevoli per negozi, show-room e ristoranti.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/vetrine' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Vetrine Commerciali a Palermo — Alluminio su Misura per Negozi',
    description: 'Vetrine commerciali a Palermo in alluminio su misura: ingressi con porta e vetrina fissa, sistemi scorrevoli e pieghevoli per negozi, show-room e ristoranti.',
    url: 'https://www.digi-home-design.com/serramenti/vetrine',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Vetrine
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Vetrine Commerciali a Palermo</h1>
      <p>Progettiamo e installiamo <strong>vetrine commerciali a Palermo</strong> su misura per negozi, show-room, ristoranti, banche e uffici: sistemi in alluminio strutturale con vetro stratificato di sicurezza, ingressi con porta a battente o scorrevole automatica, facciate continue vetrate e sistemi a libro per l&apos;apertura totale del fronte su strada.</p>
      <p style={{ marginTop: 12 }}>I profili in alluminio sono disponibili in sezione sottile per la massima visibilità del prodotto esposto, con finitura in qualsiasi colore RAL o anodizzatura. Il vetro viene scelto in base alle esigenze di sicurezza (stratificato 33.1 o 44.2), isolamento termico e resistenza al vento (calcolo NTC 2018).</p>
      <p style={{ marginTop: 12 }}>Ogni progetto viene accompagnato da un disegno tecnico in pianta e prospetto per l&apos;approvazione prima della produzione. Contattaci per un sopralluogo gratuito a Palermo e provincia.</p>
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
