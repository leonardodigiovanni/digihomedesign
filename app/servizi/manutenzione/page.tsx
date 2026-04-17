import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manutenzione a Palermo — Casa e Ufficio in Perfetto Stato',
  description: 'Servizi di manutenzione ordinaria e straordinaria a Palermo per casa e ufficio. Infissi, serramenti, impianti e strutture sempre efficienti.',
  alternates: { canonical: 'https://www.digi-home-design.com/servizi/manutenzione' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Manutenzione a Palermo — Casa e Ufficio in Perfetto Stato',
    description: 'Servizi di manutenzione ordinaria e straordinaria a Palermo per casa e ufficio. Infissi, serramenti, impianti e strutture sempre efficienti.',
    url: 'https://www.digi-home-design.com/servizi/manutenzione',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/servizi" style={{ color: '#888', textDecoration: 'underline' }}>Servizi</Link> / Manutenzione
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Manutenzione a Palermo
      </h1>
      <p>
        La <strong>manutenzione regolare</strong> prolunga la vita di infissi, serramenti, verande, persiane e strutture metalliche, prevenendo guasti costosi e mantenendo l&apos;efficienza energetica dell&apos;edificio. Offriamo piani di manutenzione ordinaria personalizzati per privati, condomini e attività commerciali a Palermo.
      </p>
      <p style={{ marginTop: 12 }}>
        Gli interventi di manutenzione includono: lubrificazione e regolazione delle parti mobili, controllo delle guarnizioni e dei sigillanti, verifica delle chiusure di sicurezza, pulizia dei profili e degli spazi di drenaggio, e ispezione generale dello stato di conservazione.
      </p>
      <p style={{ marginTop: 12 }}>
        Proponiamo anche contratti di manutenzione annuale con visite programmate, per avere sempre tutto sotto controllo senza pensieri. Contattaci per un sopralluogo gratuito e un piano di manutenzione su misura.
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
      <Link href="/servizi" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Servizi
      </Link>
    </div>
  )
}
