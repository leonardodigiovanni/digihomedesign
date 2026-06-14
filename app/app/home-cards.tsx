'use client'

import { useState } from 'react'

const PuntinaSvg = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
  </svg>
)

const SEZIONI = [
  { titolo: 'Cataloghi',  protetto: false, corpo: 'Sfoglia i nostri cataloghi, aggiungi gli articoli che ti interessano e scegli: acquistali subito oppure usali per simulare un preventivo personalizzato per i tuoi infissi, verande o ristrutturazioni.' },
  { titolo: 'Preventivi', protetto: true,  corpo: 'Consulta tutti i preventivi che hai salvato: riepilogo articoli, prezzi e stato di avanzamento.' },
  { titolo: 'Cantieri',   protetto: true,  corpo: 'Segui i tuoi lavori in tempo reale: foto, aggiornamenti e rapporti giornalieri.' },
  { titolo: 'Documenti',  protetto: true,  corpo: 'Consulta fatture, contratti e tutta la documentazione legata ai tuoi interventi.' },
  { titolo: 'Avvisi',     protetto: true,  corpo: 'Riceverai qui i nostri messaggi: aggiornamenti sui lavori, offerte riservate e comunicazioni importanti.' },
  { titolo: 'Contatti',   protetto: false, corpo: 'Trova i nostri recapiti, scrivici o richiedi un appuntamento direttamente da qui.' },
]

function Card({ titolo, corpo, defaultAperto, loggedIn, protetto }: { titolo: string; corpo: string; defaultAperto?: boolean; loggedIn: boolean; protetto: boolean }) {
  const [aperto, setAperto] = useState(defaultAperto ?? false)

  return (
    <div className="sfondo-riquadri-app" style={{ borderRadius: 12, border: '1px solid #222', padding: '18px 16px', marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.5)', cursor: 'default' }}>
      <button
        onClick={() => setAperto(a => !a)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, width: '100%',
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', flex: 1, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <PuntinaSvg />
          {titolo}
          {protetto && !loggedIn && (
            <span style={{ fontSize: 11, fontWeight: 400, color: '#999', fontStyle: 'italic' }}>(richiede l&apos;accesso)</span>
          )}
        </span>
        <span style={{
          fontSize: 16, color: '#888', transition: 'transform 0.2s',
          transform: aperto ? 'rotate(180deg)' : 'rotate(0deg)',
          display: 'inline-block',
        }}>▾</span>
      </button>
      {aperto && (
        <p className="app-card-body" style={{ marginTop: 8 }}>
          {corpo}
        </p>
      )}
    </div>
  )
}

function CardSimulazione({ manutenzione, loggedIn }: { manutenzione: boolean; loggedIn: boolean }) {
  const [aperto, setAperto] = useState(!manutenzione || loggedIn)
  const mostraBottone = !(manutenzione && !loggedIn)

  return (
    <div className="sfondo-riquadri-app" style={{ borderRadius: 12, border: '1px solid #222', padding: '18px 16px', marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.5)', cursor: 'default' }}>
      <button
        onClick={() => setAperto(a => !a)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, width: '100%',
          background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          <PuntinaSvg />
          Simulazione preventivo
        </span>
        <span style={{
          fontSize: 16, color: '#888', transition: 'transform 0.2s',
          transform: aperto ? 'rotate(180deg)' : 'rotate(0deg)',
          display: 'inline-block',
        }}>▾</span>
      </button>
      {aperto && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p className="app-card-body" style={{ margin: 0 }}>
            Calcola subito il costo dei tuoi infissi, verande o ristrutturazioni — senza registrarti. Aggiungi gli articoli dai cataloghi e ottieni una stima in tempo reale.
          </p>
          {mostraBottone && (
            <a href="/app/carrello-preventivo" className="btn-green-app"
              style={{ padding: '0 24px', fontSize: 14, alignSelf: 'center' }}>
              + Nuova simulazione preventivo
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function HomeCards({ loggedIn, manutenzione }: { loggedIn: boolean; manutenzione: boolean }) {
  return (
    <>
      <Card titolo="Cataloghi" corpo={SEZIONI[0].corpo} protetto={false} loggedIn={loggedIn} />
      <CardSimulazione manutenzione={manutenzione} loggedIn={loggedIn} />
      {SEZIONI.slice(1).map(s => <Card key={s.titolo} titolo={s.titolo} corpo={s.corpo} protetto={s.protetto} loggedIn={loggedIn} />)}
    </>
  )
}
