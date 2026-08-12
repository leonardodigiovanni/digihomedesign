import Link from 'next/link'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { readSettings } from '@/lib/settings'
import { getRistrutturazioniNeighbors } from '@/lib/nav-config'

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
  { id: 223, href: '/edilizia/demolizioni',            label: 'Demolizioni' },
  { id: 224, href: '/edilizia/opere-murarie',          label: 'Opere Murarie' },
  { id: 225, href: '/edilizia/tramezzature',           label: 'Tramezzature' },
  { id: 226, href: '/edilizia/intonaci',               label: 'Intonaci' },
  { id: 227, href: '/edilizia/massetti',               label: 'Massetti' },
  { id: 228, href: '/edilizia/tracce',                 label: 'Tracce' },
  { id: 229, href: '/edilizia/pavimenti',              label: 'Pavimenti' },
  { id: 230, href: '/edilizia/piastrelle',             label: 'Piastrelle' },
  { id: 231, href: '/edilizia/sanitari',               label: 'Sanitari' },
  { id: 232, href: '/edilizia/tetti',                  label: 'Tetti' },
  { id: 233, href: '/edilizia/impermeabilizzazioni',   label: 'Impermeabilizzazioni' },
  { id: 234, href: '/edilizia/tinteggiatura',          label: 'Tinteggiatura' },
  { id: 235, href: '/edilizia/antimuffa',              label: 'Antimuffa' },
  { id: 236, href: '/edilizia/smaltimento-calcinacci', label: 'Smaltimento Calcinacci' },
  { id: 237, href: '/edilizia/pitturazioni',           label: 'Pitturazioni' },
  { id: 238, href: '/edilizia/indoratura',             label: 'Indoratura' },
  { id: 239, href: '/edilizia/pulizia-finale',         label: 'Pulizia Finale' },
]

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getRistrutturazioniNeighbors(301, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Edilizia<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Edilizia a Palermo
      </h1>
      <p className="testo-articoli" style={{ marginBottom: 16 }}>
        Gestiamo ogni fase del cantiere edile: dalla demolizione alla pulizia finale. Squadre specializzate, materiali certificati e un unico referente per tutti i lavori a Palermo e provincia.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {subcategories.filter(s => !disabledPages.includes(s.id)).map(s => (
          <Link key={s.href} href={s.href} style={{ flex: '1 1 240px', border: '1px solid #c8960c', borderRadius: 10, padding: '16px 14px', textDecoration: 'none', color: '#1a1a1a', background: '#fafafa' }}>
            <div className="fs-17" style={{ fontWeight: 700 }}>{s.label}</div>
          </Link>
        ))}
      </div>
      <StickyBottomBarContent>
        <Link href="/" className="btn-black fs-12">← Home</Link>
        {prev && <Link href={prev.href} className="btn-blue fs-12">← {prev.label}</Link>}
        <CtaPreventivo />
        <CtaCantiere />
        {next && <Link href={next.href} className="btn-blue fs-12">{next.label} →</Link>}
        <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
      </StickyBottomBarContent>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo indice di categoria</p>
    </div>
  )
}
