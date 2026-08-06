'use client'

import { useState } from 'react'

const COOKIE_NAME = 'header_claim_dismesso'

interface HeaderClaimProps {
  dismesso: boolean
}

// Rigo claim sopra logo/somma nell'header, con una ✕ che lo chiude e
// risparmia spazio: la scelta è ricordata in un cookie (un anno, come gli
// altri cookie di preferenza del sito) finché non viene cancellato — un
// solo click, non richiesta di nuovo. Lo stato iniziale arriva già letto
// dal cookie lato server (via app/layout.tsx → components/header.tsx), così
// non c'è nessun lampeggio del rigo al caricamento pagina.
export default function HeaderClaim({ dismesso }: HeaderClaimProps) {
  const [hidden, setHidden] = useState(dismesso)

  if (hidden) return null

  function chiudi() {
    document.cookie = `${COOKIE_NAME}=1; path=/; max-age=31536000; SameSite=Lax`
    setHidden(true)
  }

  return (
    <div style={{ position: 'relative', zIndex: 1, margin: '0 -4px', borderBottom: '1px solid #999', paddingBottom: 4, textAlign: 'center' }}>
      <button
        onClick={chiudi}
        title="Chiudi"
        aria-label="Chiudi"
        style={{
          position: 'absolute', top: 1, right: 1,
          width: 13, height: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent',
          border: '1px solid #999',
          borderRadius: '50%',
          color: '#999',
          fontSize: 8,
          lineHeight: 1,
          padding: 0,
          cursor: 'pointer',
        }}
      >
        ✕
      </button>
      <div style={{ display: 'inline-block', color: '#e0b030', fontWeight: 700, fontSize: 'clamp(11px, 1.1vw, 14px)', lineHeight: 1.3, textWrap: 'balance', padding: '0 16px' }}>
        La formula vincente che quadra i conti dei lavori di CASA TUA è DIGI Home Design!
      </div>
    </div>
  )
}
