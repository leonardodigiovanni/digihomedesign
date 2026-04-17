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
  partnership:         'Richiesta partnership',
}

const TIPO_COLORS: Record<string, string> = {
  nuova_registrazione: '#4a8fa8',
  contatto:            '#6b8f71',
  partnership:         '#7b5ea7',
}

const TUTTI_TIPI = Object.keys(TIPO_LABELS)

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
  const [filtroTipo, setFiltroTipo] = useState<string>('tutti')
  const [filtroStato, setFiltroStato] = useState<'tutti' | 'letti' | 'non_letti'>('tutti')

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

  const messaggiFiltrati = messaggi.filter(m => {
    if (filtroTipo !== 'tutti' && m.tipo !== filtroTipo) return false
    if (filtroStato === 'letti'     && !letti.has(m.id)) return false
    if (filtroStato === 'non_letti' &&  letti.has(m.id)) return false
    return true
  })

  const chipBase: React.CSSProperties = {
    padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 600,
    cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.15s',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, marginRight: 4 }}>
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

        {/* Filtri tipo */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', alignSelf: 'center', marginRight: 2 }}>Tipo</span>
          {(['tutti', ...TUTTI_TIPI] as string[]).map(t => {
            const attivo = filtroTipo === t
            const colore = t === 'tutti' ? '#555' : (TIPO_COLORS[t] ?? '#555')
            return (
              <button
                key={t}
                onClick={() => setFiltroTipo(t)}
                style={{
                  ...chipBase,
                  background: attivo ? colore : '#f5f5f5',
                  color:      attivo ? '#fff'  : '#444',
                  borderColor: attivo ? colore : '#e0e0e0',
                }}
              >
                {t === 'tutti' ? 'Tutti' : (TIPO_LABELS[t] ?? t)}
              </button>
            )
          })}
        </div>

        {/* Filtri stato letto */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', alignSelf: 'center', marginRight: 2 }}>Stato</span>
          {([
            { v: 'tutti',     label: 'Tutti'     },
            { v: 'non_letti', label: 'Non letti' },
            { v: 'letti',     label: 'Letti'     },
          ] as { v: 'tutti' | 'letti' | 'non_letti'; label: string }[]).map(({ v, label }) => {
            const attivo = filtroStato === v
            return (
              <button
                key={v}
                onClick={() => setFiltroStato(v)}
                style={{
                  ...chipBase,
                  background: attivo ? '#444' : '#f5f5f5',
                  color:      attivo ? '#fff' : '#444',
                  borderColor: attivo ? '#444' : '#e0e0e0',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        {messaggiFiltrati.length === 0 ? (
          <p style={{ padding: 24, textAlign: 'center', color: '#aaa', fontSize: 14 }}>
            Nessun messaggio.
          </p>
        ) : (
          messaggiFiltrati.map(m => {
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
                    display: 'grid',
                    gridTemplateColumns: '14px 160px 1fr auto auto',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 20px', cursor: 'pointer',
                    background: isAperto ? '#fafafa' : '#fff',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* pallino non letto */}
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', justifySelf: 'center',
                    background: isLetto ? 'transparent' : '#c00',
                    border: isLetto ? '1px solid #ddd' : 'none',
                  }} />

                  {/* Tipo — centrato */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: 10,
                      fontSize: 11, fontWeight: 600, color: '#fff',
                      background: tipoColor, whiteSpace: 'nowrap',
                    }}>
                      {TIPO_LABELS[m.tipo] ?? m.tipo}
                    </span>
                  </div>

                  {/* Oggetto — allineato a sinistra */}
                  <span style={{
                    fontSize: 13, textAlign: 'left',
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

                  <span style={{ fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>
                    {new Date(m.created_at).toLocaleString('it-IT', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>

                  <span style={{ fontSize: 12, color: '#aaa' }}>
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
                          className="btn-green"
                          style={{ padding: '7px 18px', fontSize: 13, fontFamily: 'inherit' }}
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
