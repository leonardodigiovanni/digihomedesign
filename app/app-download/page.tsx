import type { Metadata } from 'next'
import QRCode from 'qrcode'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Installa l\'App',
  description: 'Installa DIGI Home Design sul tuo telefono in pochi secondi.',
  robots: { index: false, follow: false },
}

const APP_URL = 'https://digi-home-design.com/app'

const stepStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  marginBottom: 10,
}

const numStyle: React.CSSProperties = {
  flexShrink: 0,
  width: 26,
  height: 26,
  borderRadius: '50%',
  background: '#1c1c1c',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 13,
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '2px solid #c8960c',
  borderRadius: 12,
  padding: '20px 22px',
  flex: '1 1 360px',
}

function AndroidLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {/* antenne */}
      <line x1="8.5" y1="3.5" x2="6.5" y2="1.5" stroke="#3DDC84" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="15.5" y1="3.5" x2="17.5" y2="1.5" stroke="#3DDC84" strokeWidth="1.4" strokeLinecap="round"/>
      {/* testa */}
      <path fill="#3DDC84" d="M5 10.5A7 7 0 0 1 19 10.5v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3Z"/>
      {/* occhi */}
      <circle cx="9.5" cy="11.5" r="1" fill="#fff"/>
      <circle cx="14.5" cy="11.5" r="1" fill="#fff"/>
    </svg>
  )
}

function AppleLogo() {
  return (
    <svg width="20" height="22" viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg">
      <path fill="#555" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 66.6 0 122.2 43.4 164.4 43.4 40.4 0 103.4-46 176.8-46 28.5 0 130.9 2.6 198.3 99zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
    </svg>
  )
}

export default async function AppDownloadPage() {
  const qrDataUrl = await QRCode.toDataURL(APP_URL, {
    width: 180,
    margin: 2,
    color: { dark: '#1c1c1c', light: '#ffffff' },
  })

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>
          Installa DIGI Home Design
        </h1>
        <p style={{ fontSize: 14, color: '#666', margin: 0, lineHeight: 1.6 }}>
          Aggiungi l&apos;app alla schermata home del tuo telefono.<br />
          Nessun download, nessun app store. Funziona su Android e iPhone.
        </p>
      </div>

      {/* QR centrato */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ ...cardStyle, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: '0 0 auto', width: 'fit-content' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="QR Code DIGI App" width={180} height={180} style={{ display: 'block' }} />
          <p style={{ fontSize: 12, color: '#888', margin: 0, textAlign: 'center' }}>
            Inquadra con la fotocamera
          </p>
        </div>
      </div>

      {/* Istruzioni Android + iOS affiancate */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>

        {/* Istruzioni Android */}
        <div style={cardStyle}>
          <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AndroidLogo /> Android (Chrome)
          </p>
          {[
            'Apri il sito con Chrome',
            'Tocca il menu ⋮ in alto a destra',
            'Seleziona "Aggiungi a schermata Home"',
            'Conferma con "Aggiungi"',
          ].map((s, i) => (
            <div key={i} style={stepStyle}>
              <div style={numStyle}>{i + 1}</div>
              <span style={{ fontSize: 13, lineHeight: 1.5, paddingTop: 4 }}>{s}</span>
            </div>
          ))}
          <p style={{ fontSize: 12, color: '#888', marginTop: 10, marginBottom: 0 }}>
            In alternativa: Chrome mostra in automatico il banner &quot;Installa app&quot; dopo alcune visite.
          </p>
        </div>

        {/* Istruzioni iOS */}
        <div style={cardStyle}>
          <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AppleLogo /> iPhone / iPad (Safari)
          </p>
          {[
            'Apri il sito con Safari',
            'Tocca l\'icona Condividi ↑ in basso',
            'Scorri e seleziona "Aggiungi a schermata Home"',
            'Tocca "Aggiungi" in alto a destra',
          ].map((s, i) => (
            <div key={i} style={stepStyle}>
              <div style={numStyle}>{i + 1}</div>
              <span style={{ fontSize: 13, lineHeight: 1.5, paddingTop: 4 }}>{s}</span>
            </div>
          ))}
          <p style={{ fontSize: 12, color: '#888', marginTop: 10, marginBottom: 0 }}>
            Su iOS è necessario usare Safari. Chrome e altri browser non supportano l&apos;installazione.
          </p>
        </div>

      </div>

      {/* CTA apri app */}
      <div style={{ textAlign: 'center' }}>
        <a href="/" className="btn-black fs-12" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 28px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>
          Vai al sito
        </a>
      </div>

    </div>
  )
}
