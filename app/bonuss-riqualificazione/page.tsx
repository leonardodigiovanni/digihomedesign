import Link from 'next/link'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Bonus e Detrazioni Fiscali — Riqualificazione Energetica',
  description: 'Bonus e detrazioni fiscali per interventi di riqualificazione energetica a Palermo. Pagina in aggiornamento: contattaci per le informazioni più recenti.',
  alternates: { canonical: 'https://www.digi-home-design.com/bonuss-riqualificazione' },
  robots: { index: true, follow: true },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Bonus e Detrazioni Fiscali<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Bonus e Detrazioni Fiscali</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Contenuto in aggiornamento. Le agevolazioni fiscali per la riqualificazione energetica cambiano spesso normativa dopo normativa: per non fornire informazioni non aggiornate, questa pagina sarà completata a breve con i dati verificati sui bonus attualmente in vigore.
          </p>
          <p className="testo-articoli" style={{ margin: '16px 0 0' }}>
            Nel frattempo, contattaci direttamente: ti aiutiamo a capire quali agevolazioni si applicano al tuo intervento.
          </p>
        </div>

        <StickyBottomBarContent>
          <Link href="/" className="btn-black fs-12">← Home</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/chi-siamo/contatti" className="btn-black fs-12">Chiedi info</Link>
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina segnaposto contenuto in aggiornamento</p>
    </div>
  )
}
