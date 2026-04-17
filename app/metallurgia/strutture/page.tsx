import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strutture Metalliche a Palermo — Tettoie, Pensiline e Soppalchi',
  description: 'Strutture metalliche a Palermo: tettoie, pensiline, soppalchi, capannoni e pergolati in ferro e acciaio. Progettazione, carpenteria e posa in opera.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/strutture' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Strutture Metalliche a Palermo — Tettoie, Pensiline e Soppalchi',
    description: 'Strutture metalliche a Palermo: tettoie, pensiline, soppalchi, capannoni e pergolati in ferro e acciaio. Progettazione, carpenteria e posa in opera.',
    url: 'https://www.digi-home-design.com/metallurgia/strutture',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Strutture
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Strutture Metalliche a Palermo</h1>
      <p>Progettiamo e realizziamo <strong>strutture metalliche a Palermo</strong>: tettoie per auto e cortili, pensiline per ingressi e marciapiedi, soppalchi abitativi e di servizio, capannoni industriali prefabbricati, pergolati e gazebo in acciaio verniciato. Ogni struttura è progettata con calcolo agli stati limite e realizzata in officina con profilati in acciaio S275 o S355.</p>
      <p style={{ marginTop: 12 }}>I componenti vengono zincati a caldo o trattati con ciclo epossidico-poliuretanico per la massima durabilità. Le coperture sono realizzate con lamiera grecata, pannelli sandwich coibentati, policarbonato alveolare o vetro strutturale a seconda delle esigenze.</p>
      <p style={{ marginTop: 12 }}>Forniamo il progetto strutturale firmato da ingegnere abilitato per il deposito in Comune. Contattaci per un sopralluogo gratuito e un preventivo dettagliato.</p>
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
