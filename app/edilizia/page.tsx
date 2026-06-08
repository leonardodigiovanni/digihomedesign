import Link from 'next/link'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

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
  { href: '/edilizia/demolizioni',            label: 'Demolizioni',            desc: 'Demolizioni selettive e totali con smaltimento a norma dei materiali.' },
  { href: '/edilizia/opere-murarie',          label: 'Opere Murarie',          desc: 'Costruzione e modifica di muri portanti e di tamponamento.' },
  { href: '/edilizia/tramezzature',           label: 'Tramezzature',           desc: 'Realizzazione di tramezzi in laterizio, cartongesso e blocchi.' },
  { href: '/edilizia/intonaci',               label: 'Intonaci',               desc: 'Intonaci civili e rasature per interni ed esterni.' },
  { href: '/edilizia/massetti',               label: 'Massetti',               desc: 'Massetti in sabbia-cemento, autolivellanti e riscaldanti.' },
  { href: '/edilizia/tracce',                 label: 'Tracce',                 desc: 'Tracce e canalette per impianti elettrici, idraulici e gas.' },
  { href: '/edilizia/pavimenti',              label: 'Pavimenti',              desc: 'Posa di pavimenti in ceramica, gres, marmo e materiali naturali.' },
  { href: '/edilizia/piastrelle',             label: 'Piastrelle',             desc: 'Rivestimenti in piastrelle per bagni, cucine e ambienti umidi.' },
  { href: '/edilizia/sanitari',               label: 'Sanitari',               desc: 'Fornitura e installazione di sanitari, vasche e docce.' },
  { href: '/edilizia/tetti',                  label: 'Tetti',                  desc: 'Rifacimento coperture in tegole, lamiera e guaine.' },
  { href: '/edilizia/impermeabilizzazioni',   label: 'Impermeabilizzazioni',   desc: 'Impermeabilizzazione di terrazzi, balconi, bagni e fondamenta.' },
  { href: '/edilizia/tinteggiatura',          label: 'Tinteggiatura',          desc: 'Tinteggiatura di interni ed esterni con pitture traspiranti.' },
  { href: '/edilizia/antimuffa',              label: 'Antimuffa',              desc: 'Trattamenti antimuffa e deumidificazione di pareti umide.' },
  { href: '/edilizia/smaltimento-calcinacci', label: 'Smaltimento Calcinacci', desc: 'Raccolta, trasporto e smaltimento dei detriti da cantiere.' },
  { href: '/edilizia/pitturazioni',           label: 'Pitturazioni',           desc: 'Pitturazioni decorative, velature e tecniche artistiche.' },
  { href: '/edilizia/indoratura',             label: 'Indoratura',             desc: 'Indoratura e decorazioni dorate per cornici, soffitti e arredi.' },
  { href: '/edilizia/pulizia-finale',         label: 'Pulizia Finale',         desc: 'Pulizia post-cantiere professionale per la consegna dell\'immobile.' },
  { href: '/edilizia/piscine',                label: 'Piscine',                desc: 'Costruzione e ristrutturazione di piscine interrate e fuori terra.' },
  { href: '/edilizia/solarium',               label: 'Solarium',               desc: 'Realizzazione di solarium e terrazze attrezzate per l\'esposizione solare.' },
]

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Edilizia
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Edilizia a Palermo
      </h1>
      <p className="testo-articoli" style={{ marginBottom: 16 }}>
        Gestiamo ogni fase del cantiere edile: dalla demolizione alla pulizia finale. Squadre specializzate, materiali certificati e un unico referente per tutti i lavori a Palermo e provincia.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {subcategories.map(s => (
          <Link key={s.href} href={s.href} style={{ flex: '1 1 240px', border: '1px solid #c8960c', borderRadius: 10, padding: '16px 14px', textDecoration: 'none', color: '#1a1a1a', background: '#fafafa' }}>
            <div className="fs-17" style={{ fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
            <div className="fs-14" style={{ color: '#555', lineHeight: 1.6 }}>{s.desc}</div>
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link href="/" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>← Home</Link>
        <CtaPreventivo />
        <CtaCantiere />
        <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>Chiedi info</Link>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo indice di categoria</p>
    </div>
  )
}
