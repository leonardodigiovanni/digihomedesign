import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serramenti a Palermo — Infissi, Verande, Persiane e Molto Altro',
  description: 'Serramenti a Palermo su misura: infissi in alluminio e PVC, verande, persiane, veneziane, box doccia, zanzariere e avvolgibili motorizzati. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Serramenti a Palermo — Infissi, Verande, Persiane e Molto Altro',
    description: 'Serramenti a Palermo su misura: infissi in alluminio e PVC, verande, persiane, veneziane, box doccia, zanzariere e avvolgibili motorizzati. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/serramenti',
    type: 'website',
  },
}

const subcategories = [
  { href: '/serramenti/infissi-in-alluminio',     label: 'Infissi in Alluminio',     desc: 'Finestre e porte-finestre in alluminio a taglio termico, eleganti e durevoli.' },
  { href: '/serramenti/infissi-in-pvc',           label: 'Infissi in PVC',           desc: 'Infissi in PVC multicamera ad alta efficienza termica e acustica.' },
  { href: '/serramenti/verande',                  label: 'Verande',                  desc: 'Verande in alluminio e vetro per vivere gli spazi esterni tutto l\'anno.' },
  { href: '/serramenti/persiane',                 label: 'Persiane',                 desc: 'Persiane in alluminio, PVC e legno per oscuramento e protezione solare.' },
  { href: '/serramenti/imbotti',                  label: 'Imbotti',                  desc: 'Imbotti in alluminio e PVC per il rivestimento dei vani finestra.' },
  { href: '/serramenti/veneziane',                label: 'Veneziane',                desc: 'Veneziane in alluminio da interni ed esterni per il controllo della luce.' },
  { href: '/serramenti/box-doccia',               label: 'Box Doccia',               desc: 'Box doccia in vetro temperato su misura: scorrevoli, a battente e walk-in.' },
  { href: '/serramenti/vetrine',                  label: 'Vetrine',                  desc: 'Vetrine commerciali in alluminio per negozi, show-room e attività.' },
  { href: '/serramenti/lucernai',                 label: 'Lucernai',                 desc: 'Lucernai e shed per l\'illuminazione naturale di soffitti e coperture.' },
  { href: '/serramenti/zanzariere',               label: 'Zanzariere',               desc: 'Zanzariere a rullo, plissé e con telaio fisso su misura per ogni apertura.' },
  { href: '/serramenti/avvolgibili-motorizzati',  label: 'Avvolgibili Motorizzati',  desc: 'Tapparelle e avvolgibili motorizzati con controllo da remoto e domotica.' },
]

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
        Serramenti a Palermo
      </h1>
      <p style={{ marginBottom: 36 }}>
        Forniamo e installiamo serramenti su misura a Palermo per ogni esigenza: dall&apos;infisso ad alta efficienza energetica alla veranda abitabile, dalla veneziana alla zanzariera. Materiali certificati, tecnici specializzati e garanzia su prodotto e posa.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {subcategories.map(s => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              flex: '1 1 240px',
              border: '1px solid #e0e0e0',
              borderRadius: 10,
              padding: '24px 20px',
              textDecoration: 'none',
              color: '#1a1a1a',
              background: '#fafafa',
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{s.desc}</div>
          </Link>
        ))}
      </div>
      <Link href="/" style={{ display: 'inline-block', marginTop: 40, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna alla home
      </Link>
    </div>
  )
}
