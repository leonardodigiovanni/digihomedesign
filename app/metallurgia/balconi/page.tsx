import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Balconi in Ferro a Palermo — Strutture e Parapetti su Misura',
  description: 'Balconi in ferro e acciaio a Palermo: realizzazione di strutture portanti, solette e parapetti su misura per nuove costruzioni e ristrutturazioni.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/balconi' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Balconi in Ferro a Palermo — Strutture e Parapetti su Misura',
    description: 'Balconi in ferro e acciaio a Palermo: realizzazione di strutture portanti, solette e parapetti su misura per nuove costruzioni e ristrutturazioni.',
    url: 'https://www.digi-home-design.com/metallurgia/balconi',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Balconi
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Balconi in Ferro a Palermo</h1>
      <p>Realizziamo <strong>strutture per balconi a Palermo</strong> in ferro e acciaio: mensole portanti, lamiere grecate per il piano di calpestio, profili perimetrali e parapetti decorativi. Interveniamo sia su nuove costruzioni che su ristrutturazioni, dove il vecchio balcone in cls risulta ammalorato e va sostituito con una struttura metallica più leggera e durabile.</p>
      <p style={{ marginTop: 12 }}>Ogni struttura viene progettata con calcolo strutturale e trattata con zincatura a caldo o primer antiruggine più verniciatura a polvere per la massima resistenza agli agenti atmosferici, soprattutto in ambiente marino come quello palermitano. I parapetti possono essere in ferro battuto classico, acciaio inox moderno o con pannelli di vetro.</p>
      <p style={{ marginTop: 12 }}>Collaboriamo con ingegneri strutturisti per le pratiche di SCIA o permesso di costruire ove necessario. Contattaci per un sopralluogo gratuito.</p>
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
