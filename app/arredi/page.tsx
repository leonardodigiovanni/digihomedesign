import Link from 'next/link'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { readSettings } from '@/lib/settings'
import { getRistrutturazioniNeighbors } from '@/lib/nav-config'

export const metadata: Metadata = {
  title: 'Arredi a Palermo — Quadri, Soprammobili e Lampadari',
  description: 'Arredi su misura a Palermo: quadri, soprammobili e lampadari selezionati per valorizzare ogni ambiente. Consulenza e fornitura a domicilio.',
  alternates: { canonical: 'https://www.digi-home-design.com/arredi' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Arredi a Palermo — Quadri, Soprammobili e Lampadari',
    description: 'Arredi su misura a Palermo: quadri, soprammobili e lampadari selezionati per valorizzare ogni ambiente. Consulenza e fornitura a domicilio.',
    url: 'https://www.digi-home-design.com/arredi',
    type: 'website',
  },
}

const subcategories = [
  { href: '/arredi/quadri',       label: 'Quadri',       desc: 'Quadri e opere d\'arte per decorare pareti e ambienti con stile e personalità.' },
  { href: '/arredi/soprammobili', label: 'Soprammobili', desc: 'Soprammobili e oggetti decorativi selezionati per completare l\'arredo di ogni stanza.' },
  { href: '/arredi/lampadari',    label: 'Lampadari',    desc: 'Lampadari e punti luce design per illuminare e valorizzare ogni spazio.' },
]

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getRistrutturazioniNeighbors(304, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Arredi<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Arredi a Palermo
      </h1>
      <p className="testo-articoli" style={{ marginBottom: 16 }}>
        Completiamo ogni progetto di ristrutturazione con una selezione curata di arredi e complementi d&apos;arredo. Quadri, soprammobili e lampadari scelti per armonizzarsi con lo stile della tua casa.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {subcategories.map(s => (
          <Link key={s.href} href={s.href} style={{ flex: '1 1 240px', border: '1px solid #c8960c', borderRadius: 10, padding: '16px 14px', textDecoration: 'none', color: '#1a1a1a', background: '#fafafa' }}>
            <div className="fs-17" style={{ fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
            <div className="fs-14" style={{ color: '#555', lineHeight: 1.6 }}>{s.desc}</div>
          </Link>
        ))}
      </div>
      <StickyBottomBarContent>
        <Link href="/" className="btn-black fs-12">← Home</Link>
        {prev && <Link href={prev.href} className="btn-blue fs-12">← {prev.label}</Link>}
        <CtaPreventivo />
        <CtaCantiere />
        {next ? <Link href={next.href} className="btn-blue fs-12">{next.label} →</Link> : <Link href="/shop" className="btn-gold fs-12">Shop On Line →</Link>}
        <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
      </StickyBottomBarContent>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo indice di categoria</p>
    </div>
  )
}
