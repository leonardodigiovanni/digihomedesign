import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edilizia a Palermo — Ristrutturazioni e Lavori Edili Completi',
  description: 'Edilizia a Palermo: demolizioni, murature, intonaci, pavimenti, tetti, impermeabilizzazioni, tinteggiature, piscine e molto altro. Un unico referente.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Edilizia a Palermo — Ristrutturazioni e Lavori Edili Completi',
    description: 'Edilizia a Palermo: demolizioni, murature, intonaci, pavimenti, tetti, impermeabilizzazioni, tinteggiature, piscine e molto altro. Un unico referente.',
    url: 'https://www.digi-home-design.com/edilizia',
    type: 'website',
  },
}

const subcategories = [
  { href: '/edilizia/demolizioni',           label: 'Demolizioni',           desc: 'Demolizioni selettive e totali con smaltimento a norma dei materiali.' },
  { href: '/edilizia/opere-murarie',         label: 'Opere Murarie',         desc: 'Costruzione e modifica di muri portanti e di tamponamento.' },
  { href: '/edilizia/tramezzature',          label: 'Tramezzature',          desc: 'Realizzazione di tramezzi in laterizio, cartongesso e blocchi.' },
  { href: '/edilizia/intonaci',              label: 'Intonaci',              desc: 'Intonaci civili e rasature per interni ed esterni.' },
  { href: '/edilizia/massetti',              label: 'Massetti',              desc: 'Massetti in sabbia-cemento, autolivellanti e riscaldanti.' },
  { href: '/edilizia/tracce',               label: 'Tracce',               desc: 'Tracce e canalette per impianti elettrici, idraulici e gas.' },
  { href: '/edilizia/pavimenti',             label: 'Pavimenti',             desc: 'Posa di pavimenti in ceramica, gres, marmo e materiali naturali.' },
  { href: '/edilizia/piastrelle',            label: 'Piastrelle',            desc: 'Rivestimenti in piastrelle per bagni, cucine e ambienti umidi.' },
  { href: '/edilizia/sanitari',              label: 'Sanitari',              desc: 'Fornitura e installazione di sanitari, vasche e docce.' },
  { href: '/edilizia/tetti',                label: 'Tetti',                label2: '', desc: 'Rifacimento coperture in tegole, lamiera e guaine.' },
  { href: '/edilizia/impermeabilizzazioni',  label: 'Impermeabilizzazioni',  desc: 'Impermeabilizzazione di terrazzi, balconi, bagni e fondamenta.' },
  { href: '/edilizia/tinteggiatura',         label: 'Tinteggiatura',         desc: 'Tinteggiatura di interni ed esterni con pitture traspiranti.' },
  { href: '/edilizia/antimuffa',             label: 'Antimuffa',             desc: 'Trattamenti antimuffa e deumidificazione di pareti umide.' },
  { href: '/edilizia/smaltimento-calcinacci', label: 'Smaltimento Calcinacci', desc: 'Raccolta, trasporto e smaltimento dei detriti da cantiere.' },
  { href: '/edilizia/pitturazioni',          label: 'Pitturazioni',          desc: 'Pitturazioni decorative, velature e tecniche artistiche.' },
  { href: '/edilizia/indoratura',            label: 'Indoratura',            desc: 'Indoratura e decorazioni dorate per cornici, soffitti e arredi.' },
  { href: '/edilizia/pulizia-finale',        label: 'Pulizia Finale',        desc: 'Pulizia post-cantiere professionale per la consegna dell\'immobile.' },
  { href: '/edilizia/piscine',               label: 'Piscine',               desc: 'Costruzione e ristrutturazione di piscine interrate e fuori terra.' },
  { href: '/edilizia/solarium',              label: 'Solarium',              desc: 'Realizzazione di solarium e terrazze attrezzate per l\'esposizione solare.' },
]

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
        Edilizia a Palermo
      </h1>
      <p style={{ marginBottom: 36 }}>
        Gestiamo ogni fase del cantiere edile: dalla demolizione alla pulizia finale. Squadre specializzate, materiali certificati e un unico referente per tutti i lavori a Palermo e provincia.
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
