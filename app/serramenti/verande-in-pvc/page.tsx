import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verande in PVC a Palermo — Su Misura ad Alta Efficienza Termica',
  description: 'Verande in PVC a Palermo su misura: profili multicamera ad alta efficienza termica, vetri scorrevoli e fissi. Soluzione economica e isolante. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/verande-in-pvc' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Verande in PVC a Palermo — Su Misura ad Alta Efficienza Termica',
    description: 'Verande in PVC a Palermo su misura: profili multicamera ad alta efficienza termica, vetri scorrevoli e fissi. Soluzione economica e isolante. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/serramenti/verande-in-pvc',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Verande in PVC
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Verande in PVC a Palermo</h1>
      <p>Realizziamo <strong>verande in PVC su misura a Palermo</strong> con profili multicamera ad alta efficienza termica e acustica: verande a vetri scorrevoli, fissi o a battente per trasformare balconi e terrazze in ambienti chiusi e vivibili tutto l&apos;anno. Il PVC garantisce ottimo isolamento e non richiede manutenzione periodica, resistendo a umidità, salsedine e raggi UV.</p>
      <p style={{ marginTop: 12 }}>I profili in PVC rinforzato con barra in acciaio assicurano solidità strutturale e durata nel tempo. Disponibili in diversi colori e finiture — bianco, effetto legno, antracite — per adattarsi all&apos;estetica di ogni edificio. I vetri doppi o tripli camera completano il pacchetto isolante per il massimo comfort nelle stagioni più fredde.</p>
      <p style={{ marginTop: 12 }}>Gestiamo le pratiche SCIA o i permessi necessari in Comune di Palermo e provincia. Contattaci per un sopralluogo gratuito e un preventivo su misura.</p>
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
