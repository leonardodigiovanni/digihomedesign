import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { readSettings } from '@/lib/settings'
import AccediDropdown from '@/components/accedi-dropdown'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Guida Computo Metrico Online',
  description: 'Scopri come creare un computo metrico estimativo online in autonomia. Seleziona gli articoli, configura le quantità e ottieni la tua stima in tempo reale.',
  alternates: { canonical: 'https://www.digi-home-design.com/aiuto/guida-computometrico' },
}

export default async function GuidaComputometrico() {
  const { registrazioniDisabilitate } = await readSettings()
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null

  return (
    <div style={{ padding: '0 0 64px' }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Aiuto / Guida Computo Metrico<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Computo metrico online</h1>
      <p className="sottotitolo-3d fs-14" style={{ marginBottom: 8 }}>
        Un servizio esclusivo per costruire il tuo computo metrico estimativo in autonomia, voce per voce.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        <div className="vetrina-foto-row">
          <div className="page-card" style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
            <div style={{ position: 'relative', width: '100%', height: 148 }}>
              <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima computo" fill sizes="300px" style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '14px 16px' }}>
              <span className="testo-articoli">Fotografia da scegliere</span>
            </div>
          </div>
          <div className="page-card" style={{ boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
            <div style={{ position: 'relative', width: '100%', height: 148 }}>
              <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima computo" fill sizes="300px" style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '14px 16px' }}>
              <span className="testo-articoli">Fotografia da scegliere</span>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ lineHeight: 1.8, margin: 0 }}>
            Il nostro sistema di computo metrico online ti permette di costruire un elenco prezzi voci per voce,
            selezionando articoli dal nostro listino con quantità, dimensioni e finiture.
            Riceverai un totale aggiornato in tempo reale e, se soddisfatto, potrai salvare o stampare il documento finale.
          </p>
        </div>

        {/* Come funziona */}
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { n: '1', titolo: 'Seleziona gli articoli', testo: 'Naviga il listino e aggiungi le voci che ti interessano al carrello computo. Per ogni articolo puoi specificare quantità, larghezza, altezza e colore.' },
              { n: '2', titolo: 'Configura le caratteristiche opzionali', testo: 'Alcuni articoli prevedono accessori o varianti. Espandi la riga per aggiungere le caratteristiche opzionali al tuo computo.' },
              { n: '3', titolo: 'Ricevi la stima in tempo reale', testo: 'Il sistema calcola il totale aggiornato ad ogni modifica. Puoi rivedere, correggere e annotare ciascuna voce prima di salvare. (*)' },
              { n: '4', titolo: 'Salva o contattaci', testo: 'Salva il computo in formato PDF oppure contattaci direttamente: ci occuperemo di trasformarlo in un preventivo definitivo con tutte le verifiche tecniche necessarie.' },
            ].map(({ n, titolo, testo }) => (
              <div key={n} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div className="fs-15" style={{ width: 32, height: 32, borderRadius: '50%', background: '#c8960c', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {n}
                </div>
                <div>
                  <div className="testo-articoli" style={{ marginBottom: 4 }}>{titolo}</div>
                  <div className="testo-articoli" style={{ lineHeight: 1.6 }}>{testo}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="testo-articoli" style={{ margin: '8px 0 0' }}>
            (*) Il servizio è riservato agli utenti registrati e abilitati dall&apos;amministratore.
          </p>
        </div>

        {/* Banner accesso — solo per utenti non loggati */}
        {!username && (
          <div style={{ background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Per accedere al computo metrico online è necessario <span style={{ textDecoration: 'underline' }}>registrarsi</span>.
            </p>
            <p className="testo-articoli" style={{ margin: 0, lineHeight: 1.6 }}>
              La registrazione è gratuita e richiede meno di un minuto. Una volta registrato, l&apos;amministratore potrà abilitarti al servizio. Avrai anche accesso a preventivi online, cronologia ordini e molto altro.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <AccediDropdown />
              <Link href={registrazioniDisabilitate ? '/chi-siamo/contatti' : '/registrazione'} className="btn-black fs-12">
                {registrazioniDisabilitate ? 'Richiedi registrazione' : 'Registrati'}
              </Link>
            </div>
          </div>
        )}

        <StickyBottomBarContent>
          <Link href="/" className="btn-black fs-12">← Home</Link>
          <Link href="/chi-siamo/cataloghi" className="btn-black fs-12">Cataloghi →</Link>
        </StickyBottomBarContent>

      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo aiuto</p>
    </div>
  )
}
