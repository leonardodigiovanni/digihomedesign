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
  title: 'Antimuffa a Palermo — Trattamenti e Deumidificazione Pareti',
  description: 'Trattamenti antimuffa a Palermo: rimozione della muffa, deumidificazione delle pareti e applicazione di pitture antimuffa permanenti per interni umidi.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/antimuffa' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Antimuffa a Palermo — Trattamenti e Deumidificazione Pareti',
    description: 'Trattamenti antimuffa a Palermo: rimozione della muffa, deumidificazione delle pareti e applicazione di pitture antimuffa permanenti per interni umidi.',
    url: 'https://www.digi-home-design.com/edilizia/antimuffa',
    type: 'website',
  },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getCategoryGroupNeighbors('edilizia', 235, disabledPages)
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Antimuffa<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Antimuffa a Palermo</h1>

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
              La muffa sulle pareti non è solo un problema estetico: danneggia la struttura e compromette la qualità dell&apos;aria indoor. Offriamo <strong>trattamenti antimuffa a Palermo</strong> con approccio a ciclo completo: rimozione meccanica della muffa esistente, disinfezione con biocidi certificati, trattamento della causa (umidità di risalita o di condensa) e applicazione di pitture antimuffa a lunga durata.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Per i casi di umidità di risalita capillare realizziamo barriere chimiche orizzontali con iniezione di silicone neutro o resine idrofobe. Per la condensa miglioriamo l&apos;isolamento termico delle superfici fredde con intonaci deumidificanti o pannelli termoisolanti sottili.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni intervento è preceduto da un&apos;analisi della causa dell&apos;umidità. Contattaci per un sopralluogo gratuito a Palermo e provincia.
            </p>
          </div>
        </div>

        <StickyBottomBarContent>
          <Link href="/edilizia" className="btn-black fs-12">← Edilizia</Link>
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
