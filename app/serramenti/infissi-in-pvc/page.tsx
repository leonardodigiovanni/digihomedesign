import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Infissi in PVC a Palermo — Multicamera Alta Efficienza',
  description: 'Infissi in PVC a Palermo: finestre e porte-finestre multicamera con trasmittanza fino a 0,8 W/m²K. Isolamento termico e acustico superiore. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/infissi-in-pvc' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Infissi in PVC a Palermo — Multicamera Alta Efficienza',
    description: 'Infissi in PVC a Palermo: finestre e porte-finestre multicamera con trasmittanza fino a 0,8 W/m²K. Isolamento termico e acustico superiore. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/serramenti/infissi-in-pvc',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Infissi in PVC
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Infissi in PVC a Palermo</h1>
      <p>Gli <strong>infissi in PVC a Palermo</strong> offrono il miglior rapporto qualità-prezzo per l&apos;isolamento termoacustico: i profili multicamera a 5, 6 o 7 camere raggiungono valori di trasmittanza termica Uf fino a 0,95 W/m²K, tra i più bassi sul mercato. Il PVC è un materiale intrinsecamente isolante, non necessita di taglio termico aggiuntivo e garantisce lunga durata senza manutenzione.</p>
      <p style={{ marginTop: 12 }}>Installiamo sistemi dei principali brand europei — VEKA, Rehau, KBE, Aluplast — in versione bianca, foliata in varie essenze di legno e in colorazione integrale. Le ante sono disponibili nelle tipologie a battente, a vasistas, scorrevole parallela e alzante-scorrevole, abbinate a vetrocamera con gas argon e Low-E per la massima efficienza.</p>
      <p style={{ marginTop: 12 }}>Il servizio è chiavi in mano: sopralluogo, rilievo, fornitura, posa e smaltimento dei vecchi infissi. Contattaci per un preventivo gratuito a Palermo e provincia.</p>
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
