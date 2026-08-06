import Link from 'next/link'
import type { Metadata } from 'next'
import { readSettings } from '@/lib/settings'
import { getAiutoNeighbors } from '@/lib/nav-config'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import NavDropdownTriggerButton from '@/components/nav-dropdown-trigger-button'

export const metadata: Metadata = {
  title: 'Guida alla Navigazione',
  description: 'Come salvare le pagine che ti interessano come scorciatoie nella Homepage, con il doppio click.',
  alternates: { canonical: 'https://www.digi-home-design.com/aiuto/guida-navigazione' },
}

export default async function GuidaNavigazione() {
  const { disabledPages } = await readSettings()
  const { prev } = getAiutoNeighbors(104, disabledPages)
  return (
    <div style={{ padding: '0 0 64px' }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Aiuto / Guida alla Navigazione<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Scorciatoie nella Homepage</h1>
      <p className="sottotitolo-3d fs-14" style={{ marginBottom: 8 }}>
        Salva le pagine che ti interessano di più e ritrovale con un click dalla Home.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ marginBottom: 8 }}>Di cosa si tratta</p>
          <p className="testo-articoli" style={{ lineHeight: 1.8, margin: 0 }}>
            Mentre navighi il sito, ogni pagina (tranne la Home) può essere salvata come
            <strong> scorciatoia</strong>: un piccolo bottone che comparirà in fondo alla
            Homepage, per tornarci subito senza doverla ricercare di nuovo.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ marginBottom: 8 }}>Come si aggiunge</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { titolo: 'Doppio click sulla pagina', testo: 'Fai doppio click in un punto qualsiasi della pagina (non su un bottone, un link o un campo) mentre navighi. Comparirà un bottone verde con un breve conto alla rovescia: cliccalo per salvare la pagina come scorciatoia.' },
              { titolo: 'Ritrovala in Home', testo: 'Torna alla Homepage: la tua scorciatoia sarà nella barra in fondo alla pagina, sempre a portata di click.' },
              { titolo: 'Rimuovila quando vuoi', testo: 'Dalla Home, ogni scorciatoia ha una piccola ✕ per rimuoverla. In alternativa, fai di nuovo doppio click sulla stessa pagina: il bottone questa volta sarà rosso, "Elimina dalla Home".' },
            ].map(({ titolo, testo }) => (
              <div key={titolo} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div className="fs-18" style={{ color: '#c8960c', flexShrink: 0, lineHeight: 1.4 }}>◆</div>
                <div>
                  <div className="testo-articoli" style={{ marginBottom: 2 }}>{titolo}</div>
                  <div className="testo-articoli" style={{ lineHeight: 1.6 }}>{testo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ marginBottom: 8 }}>Se sei registrato e hai fatto il login</p>
          <p className="testo-articoli" style={{ lineHeight: 1.8, margin: 0 }}>
            Le tue scorciatoie vengono conservate sul tuo account: le ritrovi anche cambiando
            browser o dispositivo. Inoltre, se resti per un paio di minuti su una pagina che
            sembra interessarti, potrebbe comparire un piccolo promemoria che ti propone di
            salvarla — puoi chiuderlo subito, oppure scegliere &ldquo;Non mostrare mai
            più&rdquo; per non vederlo più.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ marginBottom: 8 }}>Se navighi senza registrarti</p>
          <p className="testo-articoli" style={{ lineHeight: 1.8, margin: 0 }}>
            Puoi comunque usare il doppio click: le scorciatoie restano salvate nel tuo
            browser per tutta la visita, ma andranno perse se pulisci i dati di navigazione
            (o cambi dispositivo). Torna comunque utile per orientarti mentre esplori il sito.
          </p>
        </div>

        <StickyBottomBarContent>
          <Link href="/" className="btn-black fs-12">← Home</Link>
          {prev && <Link href={prev.href} className="btn-blue fs-12">← {prev.label}</Link>}
          <NavDropdownTriggerButton dropdownId="chi-siamo" label="Chi Siamo →" />
        </StickyBottomBarContent>

      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo aiuto</p>
    </div>
  )
}
