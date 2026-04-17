import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sanitari a Palermo — Fornitura e Installazione Bagni',
  description: 'Sanitari a Palermo: fornitura e installazione di wc, lavabi, bidet, vasche, box doccia e rubinetteria. Rifacimento bagni completo chiavi in mano.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/sanitari' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Sanitari a Palermo — Fornitura e Installazione Bagni',
    description: 'Sanitari a Palermo: fornitura e installazione di wc, lavabi, bidet, vasche, box doccia e rubinetteria. Rifacimento bagni completo chiavi in mano.',
    url: 'https://www.digi-home-design.com/edilizia/sanitari',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Sanitari
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Sanitari a Palermo</h1>
      <p>Forniamo e installiamo <strong>sanitari a Palermo</strong>: wc sospesi e a pavimento, lavabi, bidet, vasche da bagno, piatti doccia, box doccia su misura e rubinetteria di design. Lavoriamo con marchi selezionati — Ideal Standard, Catalano, Duravit, Hansgrohe — per garantire qualità e durata nel tempo.</p>
      <p style={{ marginTop: 12 }}>Il servizio di rifacimento bagno è chiavi in mano: demoluiamo i vecchi sanitari, adeguiamo gli scarichi e i sifoni, poniamo i nuovi elementi, siliconiamo i raccordi e collaghiamo i flessibili. Gestiamo anche il collegamento alla rete idrica con miscelatori termostatici e sistemi di scarico a zaino.</p>
      <p style={{ marginTop: 12 }}>Disponibile anche la sola sostituzione di singoli elementi senza demolizioni murarie. Contattaci per un preventivo gratuito a Palermo e provincia.</p>
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
      <Link href="/edilizia" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Edilizia</Link>
    </div>
  )
}
