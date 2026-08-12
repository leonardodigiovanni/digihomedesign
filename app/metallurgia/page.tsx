import Link from 'next/link'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { readSettings } from '@/lib/settings'

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
  { id: 2119, href: '/metallurgia/porte-corazzate',            label: 'Porte Corazzate',            desc: 'Porte corazzate su misura in acciaio per abitazioni, uffici e locali commerciali.' },
  { id: 2120, href: '/metallurgia/porte-antincendio',          label: 'Porte Antincendio',          desc: 'Porte REI certificate per compartimentazione antincendio in acciaio.' },
  { id: 2171, href: '/metallurgia/saracinesche-manuali',       label: 'Saracinesche Manuali',       desc: 'Saracinesche avvolgibili e a libro manuali per garage e locali commerciali.' },
  { id: 218, href: '/metallurgia/saracinesche-motorizzate',   label: 'Saracinesche Motorizzate',   desc: 'Saracinesche avvolgibili e a libro motorizzate per garage e locali commerciali.' },
  { id: 219, href: '/metallurgia/strutture',                  label: 'Strutture Portanti',         desc: 'Strutture metalliche per tettoie, pensiline, soppalchi e capannoni.' },
  { id: 2203, href: '/metallurgia/scale-antincendio',          label: 'Scale Antincendio',          desc: 'Scale di emergenza esterne in acciaio zincato certificate.' },
  { id: 221, href: '/metallurgia/armadi-blindati',            label: 'Armadi Blindati',            desc: 'Armadi blindati per armi, documenti e valori con serrature di sicurezza.' },
  { id: 222, href: '/metallurgia/casseforti',                 label: 'Casseforti',                 desc: 'Casseforti da incasso e a pavimento per abitazioni e attività commerciali.' },
  { id: 2221, href: '/metallurgia/tetti-coibentati',           label: 'Tetti Coibentati',           desc: 'Coperture metalliche coibentate per residenziale e industriale, sandwich e lamiera.' },
  { id: 2222, href: '/metallurgia/grondaie',                   label: 'Grondaie',                   desc: 'Grondaie e pluviali in alluminio, rame e PVC su misura con posa inclusa.' },
]

export default async function Page() {
  const { disabledPages } = await readSettings()
  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Metallurgia<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Metallurgia a Palermo
      </h1>
      <p className="testo-articoli" style={{ marginBottom: 16 }}>
        Progettiamo e realizziamo lavorazioni in ferro, acciaio e alluminio su misura a Palermo: dalla sicurezza anti-intrusione alle strutture portanti, dalle ringhiere decorative alle saracinesche motorizzate. Artigianato metallurgico dal 1972.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {subcategories.filter(s => !disabledPages.includes(s.id)).map(s => (
          <Link key={s.href} href={s.href} style={{ flex: '1 1 240px', border: '1px solid #c8960c', borderRadius: 10, padding: '16px 14px', textDecoration: 'none', color: '#1a1a1a', background: '#fafafa' }}>
            <div className="fs-17" style={{ fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
            <div className="fs-14" style={{ color: '#555', lineHeight: 1.6 }}>{s.desc}</div>
          </Link>
        ))}
      </div>
      <StickyBottomBarContent>
        <Link href="/" className="btn-black fs-12">← Home</Link>
        <CtaPreventivo />
        <CtaCantiere />
        <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
      </StickyBottomBarContent>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo indice di categoria</p>
    </div>
  )
}
