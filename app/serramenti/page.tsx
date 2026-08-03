import Link from 'next/link'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

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
  { href: '/serramenti/infissi-in-alluminio-taglio-termico', label: 'Infissi in Alluminio a Taglio Termico', desc: 'Finestre e porte-finestre in alluminio a taglio termico, eleganti e durevoli.' },
  { href: '/serramenti/infissi-in-alluminio-freddo',         label: 'Infissi in Alluminio Freddo',           desc: 'Infissi in alluminio senza taglio termico per verande, box e ambienti non riscaldati.' },
  { href: '/serramenti/infissi-in-pvc',           label: 'Infissi in PVC',           desc: 'Infissi in PVC multicamera ad alta efficienza termica e acustica.' },
  { href: '/serramenti/infissi-in-legno-alluminio', label: 'Infissi in Legno-Alluminio', desc: 'Interno in legno naturale, esterno in alluminio resistente agli agenti atmosferici.' },
  { href: '/serramenti/verande-in-alluminio',     label: 'Verande in Alluminio',     desc: 'Verande in alluminio e vetro per vivere gli spazi esterni tutto l\'anno.' },
  { href: '/serramenti/verande-in-pvc',           label: 'Verande in PVC',           desc: 'Verande in PVC multicamera ad alta efficienza termica e acustica.' },
  { href: '/serramenti/persiane-in-alluminio',    label: 'Persiane in Alluminio',    desc: 'Persiane in alluminio per oscuramento e protezione solare.' },
  { href: '/serramenti/persiane-in-pvc',          label: 'Persiane in PVC',          desc: 'Persiane in PVC leggere e a zero manutenzione per oscuramento e protezione solare.' },
  { href: '/serramenti/monoblocchi',              label: 'Monoblocchi',              desc: 'Monoblocchi in alluminio e PVC per il rivestimento dei vani finestra.' },
  { href: '/serramenti/cassonetti-in-pvc',        label: 'Cassonetti in PVC',        desc: 'Cassonetti coibentati in PVC per eliminare il ponte termico dei cassonetti tradizionali.' },
  { href: '/serramenti/tapparelle-in-alluminio',  label: 'Tapparelle in Alluminio',  desc: 'Tapparelle manuali in alluminio a manovella, cinghia o moschettone.' },
  { href: '/serramenti/tapparelle-in-pvc',        label: 'Tapparelle in PVC',        desc: 'Tapparelle manuali in PVC coibentato ad alta efficienza termoacustica.' },
  { href: '/serramenti/tapparelle-motorizzazione', label: 'Tapparelle Motorizzazione', desc: 'Motorizzazione con telecomando, timer e integrazione domotica, per ogni materiale.' },
  { href: '/serramenti/veneziane',                label: 'Veneziane',                desc: 'Veneziane in alluminio da interni ed esterni per il controllo della luce.' },
  { href: '/serramenti/vetrine',                  label: 'Vetrine',                  desc: 'Vetrate commerciali in alluminio per negozi, show-room e attività.' },
  { href: '/serramenti/vetrate-panoramiche',      label: 'Vetrate Panoramiche',      desc: 'Pareti vetrate scorrevoli e pieghevoli per aprire verande e soggiorni sul giardino.' },
  { href: '/serramenti/pergole-bioclimatiche',    label: 'Pergole Bioclimatiche',    desc: 'Pergole bioclimatiche con lamelle orientabili per vivere l\'esterno tutto l\'anno.' },
  { href: '/serramenti/lucernai',                 label: 'Lucernai',                 desc: 'Lucernai e shed per l\'illuminazione naturale di soffitti e coperture.' },
  { href: '/serramenti/zanzariere',               label: 'Zanzariere',               desc: 'Zanzariere a rullo, plissé e con telaio fisso su misura per ogni apertura.' },
  { href: '/serramenti/box-doccia',               label: 'Box Doccia',               desc: 'Box doccia in vetro temperato su misura: scorrevoli, a battente e walk-in.' },
]

export default function Page() {
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
        {subcategories.map(s => (
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
