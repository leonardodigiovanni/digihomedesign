'use client'

import { useState } from 'react'
import { markRead, attivaUtente } from './actions'

type Messaggio = {
  id: number
  tipo: string
  oggetto: string
  corpo: string
  letto: number
  created_at: string
  utente_attivo: number | null
  username_ref: string | null
  utente_nome: string | null
  utente_cognome: string | null
}

const TIPO_LABELS: Record<string, string> = {
  nuova_registrazione: 'Nuova registrazione',
  contatto:            'Richiesta contatto',
}

const TIPO_COLORS: Record<string, string> = {
  nuova_registrazione: '#4a8fa8',
  contatto:            '#6b8f71',
}

export default function EmailClient({
  messaggi,
  isAdmin,
}: {
  messaggi: Messaggio[]
  isAdmin: boolean
}) {
  const [aperto, setAperto] = useState<number | null>(null)
  const [letti, setLetti] = useState<Set<number>>(
    () => new Set(messaggi.filter(m => m.letto).map(m => m.id))
  )
  // mappa username_ref -> is_active (aggiornata localmente dopo attivazione)
  const [attiviMap, setAttiviMap] = useState<Record<string, number>>(
    () => {
      const map: Record<string, number> = {}
      for (const m of messaggi) {
        if (m.username_ref !== null && m.utente_attivo !== null) {
          map[m.username_ref] = m.utente_attivo
        }
      }
      return map
    }
  )

  function toggleApri(id: number) {
    const nuovoAperto = aperto === id ? null : id
    setAperto(nuovoAperto)
    if (nuovoAperto !== null && !letti.has(nuovoAperto)) {
      setLetti(s => new Set([...s, nuovoAperto]))
      markRead(nuovoAperto)
    }
  }

  async function handleAttiva(username: string) {
    const res = await attivaUtente(username)
    if (res.ok) {
      setAttiviMap(prev => ({ ...prev, [username]: 1 }))
    }
  }

  const nonLetti = messaggi.filter(m => !letti.has(m.id)).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
            Messaggi — {messaggi.length} totali
          </h3>
          {nonLetti > 0 && (
            <span style={{
              background: '#c00', color: '#fff', fontSize: 11, fontWeight: 700,
              borderRadius: 10, padding: '1px 8px',
            }}>
              {nonLetti} non {nonLetti === 1 ? 'letto' : 'letti'}
            </span>
          )}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        {messaggi.length === 0 ? (
          <p style={{ padding: 24, textAlign: 'center', color: '#aaa', fontSize: 14 }}>
            Nessun messaggio.
          </p>
        ) : (
          messaggi.map(m => {
            const isLetto   = letti.has(m.id)
            const isAperto  = aperto === m.id
            const tipoColor = TIPO_COLORS[m.tipo] ?? '#888'

            // colore oggetto: verde se attivo, rosso se non attivo, neutro altrimenti
            let oggettoColor = '#1a1a1a'
            if (m.username_ref !== null) {
              const attivo = attiviMap[m.username_ref] ?? m.utente_attivo
              oggettoColor = attivo ? '#2e7d32' : '#c00'
            }

            const isAttivo = m.username_ref !== null
              ? (attiviMap[m.username_ref] ?? m.utente_attivo) === 1
              : true

            return (
              <div key={m.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <div
                  onClick={() => toggleApri(m.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 20px', cursor: 'pointer',
                    background: isAperto ? '#fafafa' : '#fff',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* pallino non letto */}
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: isLetto ? 'transparent' : '#c00',
                    border: isLetto ? '1px solid #ddd' : 'none',
                  }} />

                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 10,
                    fontSize: 11, fontWeight: 600, color: '#fff',
                    background: tipoColor, flexShrink: 0,
                  }}>
                    {TIPO_LABELS[m.tipo] ?? m.tipo}
                  </span>

                  <span style={{
                    flex: 1, fontSize: 13,
                    color: oggettoColor,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {m.tipo === 'nuova_registrazione' && m.username_ref
                      ? <>
                          <span style={{ fontWeight: isLetto ? 400 : 500 }}>Nuovo utente: </span>
                          <strong>{m.username_ref}</strong>
                          {m.utente_nome && m.utente_cognome && (
                            <span style={{ fontWeight: 400 }}> ({m.utente_nome} {m.utente_cognome})</span>
                          )}
                        </>
                      : <span style={{ fontWeight: isLetto ? 400 : 600 }}>{m.oggetto}</span>
                    }
                  </span>

                  <span style={{ fontSize: 12, color: '#aaa', flexShrink: 0 }}>
                    {new Date(m.created_at).toLocaleString('it-IT', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>

                  <span style={{ fontSize: 12, color: '#aaa', flexShrink: 0 }}>
                    {isAperto ? '▲' : '▼'}
                  </span>
                </div>

                {isAperto && (
                  <div
                    style={{
                      padding: '16px 20px 20px 40px',
                      borderTop: '1px solid #f0f0f0',
                      background: '#fafafa',
                      fontSize: 13,
                      color: '#333',
                      lineHeight: 1.6,
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: m.corpo }} />

                    {/* bottone Abilita subito — solo admin, solo registrazioni, solo se non attivo */}
                    {isAdmin && m.username_ref !== null && !isAttivo && (
                      <div style={{ marginTop: 16 }}>
                        <button
                          onClick={e => { e.stopPropagation(); handleAttiva(m.username_ref!) }}
                          style={{
                            padding: '7px 18px', fontSize: 13, border: 'none', borderRadius: 6,
                            background: '#2e7d32', color: '#fff', cursor: 'pointer',
                            fontFamily: 'inherit', fontWeight: 600,
                          }}
                        >
                          Abilita subito
                        </button>
                      </div>
                    )}
                    {isAdmin && m.username_ref !== null && isAttivo && (
                      <div style={{ marginTop: 12, fontSize: 12, color: '#2e7d32', fontWeight: 600 }}>
                        Utente attivo
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
