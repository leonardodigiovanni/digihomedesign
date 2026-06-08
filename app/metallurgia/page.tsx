import Link from 'next/link'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

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
  { href: '/metallurgia/porte-corazzate',            label: 'Porte Corazzate',            desc: 'Porte corazzate su misura in acciaio per abitazioni, uffici e locali commerciali.' },
  { href: '/metallurgia/porte-blindate',             label: 'Porte Blindate',             desc: 'Porte blindate di sicurezza classe 3-6 per abitazioni e uffici.' },
  { href: '/metallurgia/porte-antincendio',          label: 'Porte Antincendio',          desc: 'Porte REI certificate per compartimentazione antincendio in acciaio.' },
  { href: '/metallurgia/pannelli-bugnato-alluminio', label: 'Pannelli Bugnato Alluminio', desc: 'Pannelli decorativi in alluminio bugnato per facciate e rivestimenti.' },
  { href: '/metallurgia/cancelli',                   label: 'Cancelli',                   desc: 'Cancelli carrabili e pedonali in ferro battuto e acciaio, manuali o motorizzati.' },
  { href: '/metallurgia/grate',                      label: 'Grate',                      desc: 'Grate di sicurezza per finestre e vani in ferro e acciaio inox.' },
  { href: '/metallurgia/ringhiere',                  label: 'Ringhiere',                  desc: 'Ringhiere per scale e balconi in ferro, acciaio inox e alluminio su misura.' },
  { href: '/metallurgia/balconi',                    label: 'Balconi',                    desc: 'Strutture per balconi in acciaio e ferro con parapetti personalizzati.' },
  { href: '/metallurgia/saracinesche-manuali',       label: 'Saracinesche Manuali',       desc: 'Saracinesche avvolgibili e a libro manuali per garage e locali commerciali.' },
  { href: '/metallurgia/saracinesche-motorizzate',   label: 'Saracinesche Motorizzate',   desc: 'Saracinesche avvolgibili e a libro motorizzate per garage e locali commerciali.' },
  { href: '/metallurgia/strutture',                  label: 'Strutture Portanti',         desc: 'Strutture metalliche per tettoie, pensiline, soppalchi e capannoni.' },
  { href: '/metallurgia/scale-a-rampe',              label: 'Scale a Rampe',              desc: 'Scale a rampe in ferro e acciaio su misura per interni ed esterni.' },
  { href: '/metallurgia/scale-a-chiocciola',         label: 'Scale a Chiocciola',         desc: 'Scale elicoidali in ferro e acciaio compatte per spazi ridotti.' },
  { href: '/metallurgia/scale-antincendio',          label: 'Scale Antincendio',          desc: 'Scale di emergenza esterne in acciaio zincato certificate.' },
  { href: '/metallurgia/armadi-blindati',            label: 'Armadi Blindati',            desc: 'Armadi blindati per armi, documenti e valori con serrature di sicurezza.' },
  { href: '/metallurgia/casseforti',                 label: 'Casseforti',                 desc: 'Casseforti da incasso e a pavimento per abitazioni e attività commerciali.' },
  { href: '/metallurgia/tetti-coibentati',           label: 'Tetti Coibentati',           desc: 'Coperture metalliche coibentate per residenziale e industriale, sandwich e lamiera.' },
  { href: '/metallurgia/grondaie',                   label: 'Grondaie',                   desc: 'Grondaie e pluviali in alluminio, rame e PVC su misura con posa inclusa.' },
]

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Metallurgia
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Metallurgia a Palermo
      </h1>
      <p className="testo-articoli" style={{ marginBottom: 16 }}>
        Progettiamo e realizziamo lavorazioni in ferro, acciaio e alluminio su misura a Palermo: dalla sicurezza anti-intrusione alle strutture portanti, dalle ringhiere decorative alle saracinesche motorizzate. Artigianato metallurgico dal 1972.
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
