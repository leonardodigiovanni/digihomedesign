import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pompe di Calore a Palermo — Riscaldamento ad Alta Efficienza',
  description: 'Pompe di calore a Palermo: installazione di sistemi aria-aria, aria-acqua e geotermici per riscaldamento e raffrescamento a basso consumo energetico.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/pompe-di-calore' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pompe di Calore a Palermo — Riscaldamento ad Alta Efficienza',
    description: 'Pompe di calore a Palermo: installazione di sistemi aria-aria, aria-acqua e geotermici per riscaldamento e raffrescamento a basso consumo energetico.',
    url: 'https://www.digi-home-design.com/termodinamica/pompe-di-calore',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Pompe di Calore
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Pompe di Calore a Palermo
      </h1>
      <p>
        Le <strong>pompe di calore</strong> sono la soluzione più efficiente per riscaldare e raffrescare gli ambienti, con consumi energetici fino a 4 volte inferiori rispetto ai sistemi tradizionali. Installiamo sistemi aria-aria, aria-acqua e geotermici per abitazioni e uffici a Palermo, integrabili con pannelli solari e sistemi fotovoltaici.
      </p>
      <p style={{ marginTop: 12 }}>
        Progettiamo l&apos;impianto in base alle caratteristiche dell&apos;edificio, al fabbisogno termico e all&apos;utilizzo previsto. I sistemi aria-acqua possono alimentare pannelli radianti a pavimento, fan coil o radiatori a bassa temperatura, garantendo il massimo comfort in ogni stagione.
      </p>
      <p style={{ marginTop: 12 }}>
        Gli impianti a pompa di calore possono accedere al Conto Termico e ad altri incentivi statali. Ti assistiamo in tutte le pratiche burocratiche. Contattaci per un sopralluogo gratuito.
      </p>
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
      <Link href="/termodinamica" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Termodinamica
      </Link>
    </div>
  )
}
