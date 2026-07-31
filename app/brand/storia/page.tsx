import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'La Nostra Storia — Digi Home Design Palermo',
  description: 'La storia di Digi Home Design: chi siamo, la nostra missione e i valori che guidano il nostro lavoro a Palermo dal primo giorno.',
  alternates: { canonical: 'https://www.digi-home-design.com/chi-siamo/storia' },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/chi-siamo" style={{ color: '#888', textDecoration: 'underline' }}>Chi Siamo</Link> / Storia<ShortcutStar />
      </p>

      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 24, marginTop: 0 }}>La Nostra Storia</h1>

      <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: 24 }}>

        {/* Foto 1 — Francesco */}
        <div className="page-card storia-card-1" style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.25)', marginBottom: 32, width: 240, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ width: '100%' }}>
            <Image src="/images/storia/francesco.webp" alt="Francesco" width={240} height={148} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <div style={{ padding: '14px 16px' }}>
            <span className="testo-articoli">Francesco</span>
          </div>
        </div>

        {/* Testo — piena larghezza */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 32 }}>
          <p className="testo-articoli" style={{ margin: 0 }}>La nostra storia nasce dalla vita di un grande lavoratore e grandissimo uomo.</p>
          <p className="testo-articoli" style={{ margin: 0 }}><strong>Francesco Di Giovanni</strong>, classe 1947.</p>
          <p className="testo-articoli" style={{ margin: 0 }}>Le sue innate e straordinarie doti manuali e intellettive lo hanno condotto ai vertici dell&apos;arte artigiana nella lavorazione dei metalli.</p>
          <p className="testo-articoli" style={{ margin: 0 }}>Da bambino, orfano di madre insieme ad altri cinque fratelli e figlio di un operaio, cresce in un contesto in cui le possibilità economiche sono scarse. Dopo la scuola si arrangia con piccoli lavori, come consegnare caffè. Ed è proprio durante una di queste consegne, in un&apos;officina, che la sua vita cambia direzione.</p>
          <p className="testo-articoli" style={{ margin: 0 }}>In quell&apos;ambiente rumoroso, fatto di ferro, olio e fatica, resta incantato nel vedere la materia prendere forma, trasformarsi sotto le mani esperte degli artigiani. La curiosità lo spinge a chiedere se ci sia posto per qualcuno disposto a imparare. Ottiene qualche nozione mentre pulisce macchinari e riordina attrezzi, ma è ancora troppo giovane perché gli venga affidato qualcosa di più.</p>
          <p className="testo-articoli" style={{ margin: 0 }}>Osserva, assimila, impara da solo. Con i primi guadagni compra libri e, con ostinazione, studia da autodidatta. Scopre le proprietà dei metalli e delle plastiche, apprende le tecniche di fusione, tranciatura, l&apos;uso del tornio e molto altro.</p>
          <p className="testo-articoli" style={{ margin: 0 }}>Impara in fretta e si fa notare. A soli 16 anni diventa capofficina in un&apos;azienda di Palermo specializzata nella produzione di componenti in pressofusione destinati alla costruzione di treni.</p>
          <p className="testo-articoli" style={{ margin: 0 }}>Qualche anno dopo incontra la donna della sua vita e costruisce una famiglia. Le sue qualità — l&apos;attenzione maniacale ai dettagli, la ricerca costante della perfezione, la precisione nelle misurazioni al decimo e al centesimo di millimetro — diventano il suo marchio distintivo quando decide di mettersi in proprio, avviando un&apos;attività di produzione di stampi.</p>
          <p className="testo-articoli" style={{ margin: 0 }}>Con le proprie mani fonde il metallo e realizza i singoli componenti per costruire un pantografo a copiare. Acquista tornio, pialla, flessibile, trapano a colonna, banco da lavoro: tutto ciò che serve per dare vita alla sua officina artigiana, in un locale preso in affitto in via Cesare Airoldi, vicino alla sua casa e alla sua famiglia.</p>
          <p className="testo-articoli" style={{ margin: 0 }}>Negli anni amplia l&apos;attività includendo anche il lavoro di fabbro e serramentista. Realizza per lungo tempo opere diverse, sempre funzionali e a regola d&apos;arte, distinguendosi per competenza, gusto e affidabilità.</p>
          <p className="testo-articoli" style={{ margin: 0 }}>Per decenni, la soddisfazione dei clienti accompagna il suo percorso e quello della sua famiglia: anno dopo anno viene scelto, apprezzato e consigliato attraverso la forma più autentica di riconoscimento, il passaparola.</p>
          <p className="testo-articoli" style={{ margin: 0 }}>Ancora oggi, con i suoi consigli e la sua capacità di trovare soluzioni concrete, rappresenta un punto di riferimento, oltre che un esempio di etica e professionalità.</p>
          <p className="testo-articoli" style={{ margin: 0 }}>DIGI Home Design deve tutto a lui.</p>
          <p className="testo-articoli" style={{ margin: 0 }}>
            <strong>Grazie, Papà.</strong>{' '}
            <span style={{ fontSize: 24, color: '#c0392b', WebkitTextFillColor: '#c0392b', verticalAlign: 'middle' }}>♥</span>
            <span style={{ fontSize: 24, color: '#c0392b', WebkitTextFillColor: '#c0392b', verticalAlign: 'middle' }}>♥</span>
            <span style={{ fontSize: 24, color: '#c0392b', WebkitTextFillColor: '#c0392b', verticalAlign: 'middle' }}>♥</span>
          </p>
        </div>

        {/* Foto 2 — I pupi stampati */}
        <div className="page-card storia-card-2" style={{ boxShadow: '0 6px 22px rgba(0,0,0,0.2)', width: 240, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ width: '100%' }}>
            <Image src="/images/storia/pupi-carretto-siciliano.webp" alt="Pupi e carretto siciliano" width={240} height={148} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
          <div style={{ padding: '14px 16px' }}>
            <span className="testo-articoli">I pupi stampati</span>
          </div>
        </div>

      </div>

      <StickyBottomBarContent>
        <Link href="/chi-siamo" className="btn-black fs-12">← Torna a Chi Siamo</Link>
      </StickyBottomBarContent>

      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>pagina revisionata</p>
    </div>
  )
}
