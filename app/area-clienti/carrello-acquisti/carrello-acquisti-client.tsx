'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { rimuoviDaCarrelloAcquisti, svuotaCarrelloAcquisti } from '@/app/brand/cataloghi/actions'
import { creaCheckoutSession } from './checkout-action'

export type ArticoloCarrelloAcquisti = {
  index: number
  listino_id: number
  categoria: string
  produttore: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  quantita: number
  ante?: number
  larghezza_cm?: number
  altezza_cm?: number
  colore?: string
  note?: string
}

export default function CarrelloAcquistiClient({
  articoli,
  isLoggedIn,
}: {
  articoli: ArticoloCarrelloAcquisti[]
  isLoggedIn: boolean
}) {
  const router = useRouter()
  const [delPending,   startDel]   = useTransition()
  const [clearPending, startClear] = useTransition()
  const [payPending,   startPay]   = useTransition()

  function calcolaPrezzo(a: ArticoloCarrelloAcquisti): number {
    const pb = Number(a.prezzo_vendita)
    const h  = (a.altezza_cm  ?? 0) / 100
    const l  = (a.larghezza_cm ?? 0) / 100
    const q  = a.quantita
    if (a.unita === 'm²')      return Math.round(pb * h * l * q * 100) / 100
    if (a.unita === 'ml')      return Math.round(pb * l * q * 100) / 100
    return Math.round(pb * q * 100) / 100
  }

  const totale = articoli.reduce((s, a) => s + calcolaPrezzo(a), 0)

  function handleRimuovi(index: number) {
    startDel(async () => {
      await rimuoviDaCarrelloAcquisti(index)
      router.refresh()
    })
  }

  function handleSvuota() {
    if (!confirm('Svuotare il carrello acquisti?')) return
    startClear(async () => {
      await svuotaCarrelloAcquisti()
      router.refresh()
    })
  }

  function handlePaga() {
    startPay(async () => { await creaCheckoutSession() })
  }

  const thS: React.CSSProperties = {
    padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#888',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fafafa', borderBottom: '1px solid #e8e8e8', whiteSpace: 'nowrap',
  }
  const tdS: React.CSSProperties = {
    padding: '12px 16px', fontSize: 13, color: '#333',
    borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle',
  }

  if (articoli.length === 0) {
    return (
      <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '40px 28px', textAlign: 'center', color: '#aaa' }}>
        <p style={{ margin: '0 0 12px', fontSize: 15 }}>Il tuo carrello acquisti è vuoto.</p>
        <a href="/brand/cataloghi" style={{ color: '#e65100', fontWeight: 600, fontSize: 13 }}>
          Sfoglia i cataloghi →
        </a>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Barra azioni */}
      <div style={{
        background: '#fff', border: '2px solid #c8960c', borderRadius: 10,
        padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {!isLoggedIn && (
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
            <a href="/login" style={{ color: '#e65100', fontWeight: 600 }}>Accedi</a> o{' '}
            <a href="/registrazione" style={{ color: '#e65100', fontWeight: 600 }}>registrati</a> per
            completare l&apos;acquisto con carta di credito o PayPal.
          </p>
        )}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {isLoggedIn && (
            <button
              onClick={handlePaga}
              disabled={payPending}
              style={{
                height: 38, padding: '0 26px', fontSize: 14, fontWeight: 700, borderRadius: 6,
                background: payPending
                  ? '#aaa'
                  : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#1b4d1b 0%,#266626 20%,#3a8f3a 45%,#266626 80%,#1b4d1b 100%)',
                boxShadow: payPending ? 'none' : '0 2px 10px rgba(20,80,20,0.45),inset 0 1px 0 rgba(160,255,160,0.2)',
                color: '#d4f5d4', border: 'none',
                cursor: payPending ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              {payPending ? 'Reindirizzamento…' : 'Paga ora'}
            </button>
          )}
          <a
            href="/area-clienti/carrello-acquisti/stampa"
            style={{
              height: 38, padding: '0 22px', fontSize: 13, fontWeight: 700, borderRadius: 6,
              background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#111 0%,#222 20%,#383838 45%,#222 80%,#111 100%)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08)',
              color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
            }}
          >
            <span className="animato">Genera PDF</span>
          </a>
          <button
            onClick={handleSvuota}
            disabled={clearPending}
            style={{
              height: 38, padding: '0 22px', fontSize: 13, fontWeight: 700, borderRadius: 6,
              background: clearPending
                ? '#aaa'
                : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#5a0000 0%,#8b0000 20%,#a01010 45%,#8b0000 80%,#5a0000 100%)',
              boxShadow: clearPending ? 'none' : '0 4px 14px rgba(100,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.07)',
              color: '#fff', border: 'none',
              cursor: clearPending ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center',
            }}
          >
            {clearPending ? 'Svuotamento…' : 'Svuota carrello'}
          </button>
        </div>
        {isLoggedIn && (
          <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>
            Pagamenti sicuri gestiti da Stripe. I tuoi dati di pagamento non vengono mai memorizzati sul nostro sito.
          </p>
        )}
      </div>

      {/* Tabella articoli */}
      <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thS}>#</th>
              <th style={thS}>Tipo</th>
              <th style={thS}>Produttore</th>
              <th style={thS}>Articolo</th>
              <th style={{ ...thS, textAlign: 'center' }}>Unità</th>
              <th style={{ ...thS, textAlign: 'right' }}>Prezzo unit.</th>
              <th style={{ ...thS, textAlign: 'center' }}>Qtà</th>
              <th style={{ ...thS, textAlign: 'right' }}>Subtotale</th>
              <th style={thS}></th>
            </tr>
          </thead>
          <tbody>
            {articoli.map((a, i) => (
              <tr key={a.index}>
                <td style={{ ...tdS, color: '#aaa' }}>{i + 1}</td>
                <td style={tdS}>{a.categoria}</td>
                <td style={{ ...tdS, color: '#888' }}>{a.produttore}</td>
                <td style={tdS}>
                  {a.descrizione}
                  {(() => {
                    const parts: string[] = []
                    if (a.ante && a.ante > 1) parts.push(`${a.ante} ante`)
                    if (a.larghezza_cm) parts.push(`L: ${a.larghezza_cm} cm`)
                    if (a.altezza_cm) parts.push(`H: ${a.altezza_cm} cm`)
                    if (a.colore) parts.push(a.colore)
                    return parts.length > 0
                      ? <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{parts.join(' · ')}</div>
                      : null
                  })()}
                  {a.note && <div style={{ fontSize: 11, color: '#aaa', marginTop: 1, fontStyle: 'italic' }}>{a.note}</div>}
                </td>
                <td style={{ ...tdS, textAlign: 'center' }}>{a.unita}</td>
                <td style={{ ...tdS, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  € {Number(a.prezzo_vendita).toFixed(2)}
                  <span style={{ fontSize: 10, color: '#aaa', marginLeft: 2 }}>/{a.unita}</span>
                </td>
                <td style={{ ...tdS, textAlign: 'center', fontWeight: 600 }}>{a.quantita}</td>
                <td style={{ ...tdS, textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  € {calcolaPrezzo(a).toFixed(2)}
                </td>
                <td style={{ ...tdS, textAlign: 'center' }}>
                  <button
                    onClick={() => handleRimuovi(a.index)}
                    disabled={delPending}
                    style={{
                      background: 'none', border: 'none', color: '#c00',
                      fontSize: 16, cursor: delPending ? 'not-allowed' : 'pointer',
                      padding: '2px 6px',
                    }}
                    title="Rimuovi dal carrello"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: '#fafafa', borderTop: '2px solid #e8e8e8' }}>
              <td colSpan={7} style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, textAlign: 'right', color: '#1a1a1a' }}>
                Totale
              </td>
              <td style={{ padding: '12px 16px', fontSize: 15, fontWeight: 700, textAlign: 'right', color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                € {totale.toFixed(2)}
              </td>
              <td style={{ padding: '12px 16px' }} />
            </tr>
          </tfoot>
        </table>
      </div>

      {articoli.some(a => a.unita === 'mq' || a.unita === 'ml') && (
        <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
          * Per articoli a m² o m lin. il subtotale è calcolato sul prezzo unitario di listino. Il prezzo finale dipenderà dalle dimensioni effettive.
        </p>
      )}
    </div>
  )
}
