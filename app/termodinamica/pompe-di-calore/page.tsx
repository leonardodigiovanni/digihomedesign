import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import { readSettings } from '@/lib/settings'
import { getCategoryGroupNeighbors } from '@/lib/nav-config'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Pompe di Calore a Palermo — Riscaldamento ad Alta Efficienza',
  description: 'Pompe di calore a Palermo: installazione di sistemi aria-aria, aria-acqua e geotermici per riscaldamento e raffrescamento a basso consumo energetico.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/pompe-di-calore' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Pompe di Calore a Palermo — Riscaldamento ad Alta Efficienza',
    description: 'Pompe di calore a Palermo: installazione di sistemi aria-aria, aria-acqua e geotermici per riscaldamento e raffrescamento a basso consumo energetico.',
    url: 'https://www.digi-home-design.com/termodinamica/pompe-di-calore',
    type: 'website',
  },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getCategoryGroupNeighbors('termodinamica', 260, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Pompe di Calore<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Pompe di Calore a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.webp" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.webp" alt="Anteprima" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le <strong>pompe di calore</strong> sono la soluzione più efficiente per riscaldare e raffrescare gli ambienti, con consumi energetici fino a 4 volte inferiori rispetto ai sistemi tradizionali. Installiamo sistemi aria-aria, aria-acqua e geotermici per abitazioni e uffici a Palermo, integrabili con pannelli solari e sistemi fotovoltaici.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Progettiamo l&apos;impianto in base alle caratteristiche dell&apos;edificio, al fabbisogno termico e all&apos;utilizzo previsto. I sistemi aria-acqua possono alimentare pannelli radianti a pavimento, fan coil o radiatori a bassa temperatura, garantendo il massimo comfort in ogni stagione.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli impianti a pompa di calore possono accedere al Conto Termico e ad altri incentivi statali. Ti assistiamo in tutte le pratiche burocratiche. Contattaci per un sopralluogo gratuito.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/termodinamica" className="btn-black fs-12">← Termodinamica</Link>
          {prev && <Link href={prev.href} className="btn-blue fs-12">← {prev.label}</Link>}
          <CtaPreventivo />
          <CtaCantiere />
          {next && <Link href={next.href} className="btn-blue fs-12">{next.label} →</Link>}
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
