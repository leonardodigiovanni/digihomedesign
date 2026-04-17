import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pannelli Bugnato Alluminio a Palermo — Facciate e Rivestimenti',
  description: 'Pannelli in alluminio bugnato a Palermo per facciate, cancelli e recinzioni. Leggeri, resistenti alla corrosione e disponibili in ogni colore RAL.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/pannelli-bugnato-alluminio' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pannelli Bugnato Alluminio a Palermo — Facciate e Rivestimenti',
    description: 'Pannelli in alluminio bugnato a Palermo per facciate, cancelli e recinzioni. Leggeri, resistenti alla corrosione e disponibili in ogni colore RAL.',
    url: 'https://www.digi-home-design.com/metallurgia/pannelli-bugnato-alluminio',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Pannelli Bugnato Alluminio
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Pannelli Bugnato Alluminio a Palermo</h1>
      <p>I <strong>pannelli in alluminio bugnato</strong> sono elementi decorativi e funzionali ampiamente utilizzati per rivestimenti di facciate, tamponamenti di cancelli e recinzioni, pannellature per saracinesche e portoni industriali. La lavorazione bugnata conferisce rigidità strutturale al pannello pur mantenendo il peso ridotto tipico dell&apos;alluminio.</p>
      <p style={{ marginTop: 12 }}>Lavoriamo con lamiere in alluminio da 1 a 3 mm in vari pattern di bugne — quadra, tonda, elongata — con finitura grezza, anodizzata o verniciata a polvere in qualsiasi colore RAL. I pannelli vengono tagliati su misura e forati per il fissaggio a telai in ferro o alluminio estruso.</p>
      <p style={{ marginTop: 12 }}>Ideali per ambienti costieri grazie alla totale resistenza alla ruggine. Contattaci per un preventivo gratuito con campionatura delle finiture disponibili.</p>
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
