import Link from 'next/link'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { readSettings } from '@/lib/settings'

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
  { id: 201, href: '/serramenti/infissi-in-alluminio-freddo',         label: 'Infissi in Alluminio Freddo',           desc: 'Infissi in alluminio senza taglio termico per verande, box e ambienti non riscaldati.' },
  { id: 2052, href: '/serramenti/tapparelle-motorizzazione', label: 'Tapparelle Motorizzazione', desc: 'Motorizzazione con telecomando, timer e integrazione domotica, per ogni materiale.' },
  { id: 206, href: '/serramenti/veneziane',                label: 'Veneziane',                desc: 'Veneziane in alluminio da interni ed esterni per il controllo della luce.' },
  { id: 208, href: '/serramenti/vetrine',                  label: 'Vetrine',                  desc: 'Vetrate commerciali in alluminio per negozi, show-room e attività.' },
  { id: 209, href: '/serramenti/lucernai',                 label: 'Lucernai',                 desc: 'Lucernai e shed per l\'illuminazione naturale di soffitti e coperture.' },
  { id: 207, href: '/serramenti/box-doccia',               label: 'Box Doccia',               desc: 'Box doccia in vetro temperato su misura: scorrevoli, a battente e walk-in.' },
]

export default async function Page() {
  const { disabledPages } = await readSettings()
  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Serramenti<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>
        Serramenti a Palermo
      </h1>
      <p className="testo-articoli" style={{ marginBottom: 16 }}>
        Forniamo e installiamo serramenti su misura a Palermo per ogni esigenza: dall&apos;infisso ad alta efficienza energetica alla veranda abitabile, dalla veneziana alla zanzariera. Materiali certificati, tecnici specializzati e garanzia su prodotto e posa.
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
