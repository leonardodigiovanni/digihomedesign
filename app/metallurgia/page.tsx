import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Metallurgia a Palermo — Ferro, Acciaio e Alluminio su Misura',
  description: 'Lavorazioni in metallo a Palermo: porte blindate, cancelli, grate, ringhiere, scale, strutture metalliche, saracinesche e casseforti. Artigianato dal 1972.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Metallurgia a Palermo — Ferro, Acciaio e Alluminio su Misura',
    description: 'Lavorazioni in metallo a Palermo: porte blindate, cancelli, grate, ringhiere, scale, strutture metalliche, saracinesche e casseforti. Artigianato dal 1972.',
    url: 'https://www.digi-home-design.com/metallurgia',
    type: 'website',
  },
}

const subcategories = [
  { href: '/metallurgia/porte-blindate',               label: 'Porte Blindate',               desc: 'Porte blindate di sicurezza classe 3-6 per abitazioni e uffici.' },
  { href: '/metallurgia/pannelli-bugnato-alluminio',   label: 'Pannelli Bugnato Alluminio',   desc: 'Pannelli decorativi in alluminio bugnato per facciate e rivestimenti.' },
  { href: '/metallurgia/cancelli',                     label: 'Cancelli',                     desc: 'Cancelli carrabili e pedonali in ferro battuto e acciaio, manuali o motorizzati.' },
  { href: '/metallurgia/grate',                        label: 'Grate',                        desc: 'Grate di sicurezza per finestre e vani in ferro e acciaio inox.' },
  { href: '/metallurgia/ringhiere',                    label: 'Ringhiere',                    desc: 'Ringhiere per scale e balconi in ferro, acciaio inox e alluminio su misura.' },
  { href: '/metallurgia/balconi',                      label: 'Balconi',                      desc: 'Strutture per balconi in acciaio e ferro con parapetti personalizzati.' },
  { href: '/metallurgia/saracinesche-motorizzate',     label: 'Saracinesche Motorizzate',     desc: 'Saracinesche avvolgibili e a libro motorizzate per garage e locali commerciali.' },
  { href: '/metallurgia/strutture',                    label: 'Strutture',                    desc: 'Strutture metalliche per tettoie, pensiline, soppalchi e capannoni.' },
  { href: '/metallurgia/scale',                        label: 'Scale',                        desc: 'Scale interne ed esterne in ferro, acciaio e acciaio inox su misura.' },
  { href: '/metallurgia/armadi-blindati',              label: 'Armadi Blindati',              desc: 'Armadi blindati per armi, documenti e valori con serrature di sicurezza.' },
  { href: '/metallurgia/casseforti',                   label: 'Casseforti',                   desc: 'Casseforti da incasso e a pavimento per abitazioni e attività commerciali.' },
]

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
        Metallurgia a Palermo
      </h1>
      <p style={{ marginBottom: 36 }}>
        Progettiamo e realizziamo lavorazioni in ferro, acciaio e alluminio su misura a Palermo: dalla sicurezza anti-intrusione alle strutture portanti, dalle ringhiere decorative alle saracinesche motorizzate. Artigianato metallurgico dal 1972.
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
