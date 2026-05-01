'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  rimuoviDaCarrello, salvaCarrelloComePreventivo, svuotaCarrello,
  aggiornaArticoloCarrello, aggiungiArticoloAlCarrello, impostaParentPendente,
} from '@/app/brand/cataloghi/actions'

export type ArticoloCarrello = {
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
  uid: number
  parent?: number
  tipo?: 'articolo' | 'caratteristica'
  desc?: string
}

type ModalState =
  | null
  | { type: 'edit'; item: ArticoloCarrello }
  | { type: 'duplica'; lastItem: ArticoloCarrello }

type EditVals = { q: number; ante: number; l: number; h: number; colore: string; note: string; desc: string }

export default function CarrelloClient({
  articoli,
  isLoggedIn,
  scontoClientePct = 0,
}: {
  articoli: ArticoloCarrello[]
  isLoggedIn: boolean
  scontoClientePct?: number
}) {
  const router = useRouter()
  const [delPending,  startDel]   = useTransition()
  const [savePending, startSave]  = useTransition()
  const [clearPending, startClear] = useTransition()
  const [actPending,  startAct]   = useTransition()
  const [saveError, setSaveError] = useState('')
  const [modal, setModal]         = useState<ModalState>(null)
  const [editVals, setEditVals]   = useState<EditVals>({ q: 1, ante: 1, l: 0, h: 0, colore: '', note: '', desc: '' })
  const [duplicaVals, setDuplicaVals] = useState<Omit<EditVals, 'desc'>>({ q: 1, ante: 1, l: 0, h: 0, colore: '', note: '' })

  // ── helpers ────────────────────────────────────────────────────────────────

  function calcolaPrezzo(a: ArticoloCarrello): number {
    if (a.tipo === 'caratteristica') return 0
    const pb = Number(a.prezzo_vendita)
    const h  = (a.altezza_cm  ?? 0) / 100
    const l  = (a.larghezza_cm ?? 0) / 100
    const q  = a.quantita
    if (a.unita === 'm²') return Math.round(pb * h * l * q * 100) / 100
    if (a.unita === 'ml') return Math.round(pb * l * q * 100) / 100
    return Math.round(pb * q * 100) / 100
  }

  const totale = articoli.reduce((s, a) => s + calcolaPrezzo(a), 0)

  const lastTopLevel = [...articoli].reverse().find(a => !a.parent && a.tipo !== 'caratteristica')

  // ── modal openers ──────────────────────────────────────────────────────────

  function openEdit(item: ArticoloCarrello) {
    setEditVals({
      q:      item.quantita,
      ante:   item.ante ?? 1,
      l:      item.larghezza_cm ?? 0,
      h:      item.altezza_cm ?? 0,
      colore: item.colore ?? '',
      note:   item.note ?? '',
      desc:   item.desc ?? item.descrizione,
    })
    setModal({ type: 'edit', item })
  }

  async function handleAggiungiComeFiglio(a: ArticoloCarrello) {
    await impostaParentPendente(a.uid, a.descrizione)
    router.push('/brand/cataloghi')
  }

  function openDuplica() {
    if (!lastTopLevel) return
    setDuplicaVals({
      q:      lastTopLevel.quantita,
      ante:   lastTopLevel.ante ?? 1,
      l:      lastTopLevel.larghezza_cm ?? 0,
      h:      lastTopLevel.altezza_cm ?? 0,
      colore: lastTopLevel.colore ?? '',
      note:   lastTopLevel.note ?? '',
    })
    setModal({ type: 'duplica', lastItem: lastTopLevel })
  }

  // ── action handlers ────────────────────────────────────────────────────────

  function handleRimuovi(index: number) {
    startDel(async () => { await rimuoviDaCarrello(index); router.refresh() })
  }

  function handleSvuota() {
    if (!confirm('Svuotare il carrello?')) return
    startClear(async () => { await svuotaCarrello(); router.refresh() })
  }

  function handleSalva() {
    setSaveError('')
    startSave(async () => {
      const res = await salvaCarrelloComePreventivo()
      if (!res.ok) { setSaveError(res.error); return }
      router.push(res.redirectUrl)
    })
  }

  function handleEditSave() {
    if (modal?.type !== 'edit') return
    const item = modal.item
    startAct(async () => {
      if (item.tipo === 'caratteristica') {
        await aggiornaArticoloCarrello(item.index, { desc: editVals.desc })
      } else {
        await aggiornaArticoloCarrello(item.index, {
          q:      editVals.q,
          ante:   editVals.ante || undefined,
          l:      editVals.l   || undefined,
          h:      editVals.h   || undefined,
          colore: editVals.colore || undefined,
          note:   editVals.note   || undefined,
        })
      }
      setModal(null)
      router.refresh()
    })
  }

  function handleDuplica() {
    if (modal?.type !== 'duplica') return
    startAct(async () => {
      await aggiungiArticoloAlCarrello(modal.lastItem.listino_id, {
        q:      duplicaVals.q,
        ante:   duplicaVals.ante || undefined,
        l:      duplicaVals.l   || undefined,
        h:      duplicaVals.h   || undefined,
        colore: duplicaVals.colore || undefined,
        note:   duplicaVals.note   || undefined,
      })
      setModal(null)
      router.refresh()
    })
  }

  async function handleAggiungiCaratteristicaUltimo() {
    if (!lastTopLevel) return
    await impostaParentPendente(lastTopLevel.uid, lastTopLevel.descrizione)
    router.push('/brand/cataloghi')
  }

  // ── stili ──────────────────────────────────────────────────────────────────

  const thS: React.CSSProperties = {
    padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#888',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fafafa', borderBottom: '1px solid #e8e8e8', whiteSpace: 'nowrap',
  }
  const tdS: React.CSSProperties = {
    padding: '12px 16px', fontSize: 13, color: '#333',
    borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle',
  }

  const inpS: React.CSSProperties = {
    width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: 6,
    fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box',
  }
  const lblS: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4,
  }
  const fieldS: React.CSSProperties = { marginBottom: 12 }

  // ── empty state ────────────────────────────────────────────────────────────

  if (articoli.length === 0) {
    return (
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '40px 28px', textAlign: 'center', color: '#aaa' }}>
        <p style={{ margin: '0 0 12px', fontSize: 15 }}>Il tuo carrello è vuoto.</p>
        <a href="/brand/cataloghi" style={{ color: '#2b6cb0', fontWeight: 600, fontSize: 13 }}>
          Sfoglia i cataloghi →
        </a>
      </div>
    )
  }

  // ── modal ──────────────────────────────────────────────────────────────────

  const renderModal = () => {
    if (!modal) return null
    const isEdit    = modal.type === 'edit'
    const isDuplica = modal.type === 'duplica'

    const title = isEdit ? 'Modifica articolo' : 'Aggiungi articolo dello stesso tipo'

    const onClose = () => setModal(null)
    const onSave  = isEdit ? handleEditSave : handleDuplica

    const vals    = isEdit ? editVals : duplicaVals
    const setVals = isEdit
      ? (u: Partial<EditVals>) => setEditVals(p => ({ ...p, ...u }))
      : (u: Partial<typeof duplicaVals>) => setDuplicaVals(p => ({ ...p, ...u }))

    return (
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 18px', color: '#1a1a1a' }}>{title}</h3>

          {/* Articolo / Duplica: campi completi */}
          {(isEdit || isDuplica) && (
            <>
              {isDuplica && (
                <p style={{ fontSize: 12, color: '#888', margin: '0 0 14px' }}>
                  Tipo: <strong>{modal.lastItem.produttore} — {modal.lastItem.descrizione}</strong>
                </p>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <div style={fieldS}>
                  <label style={lblS}>Quantità</label>
                  <input type="number" min={1} style={inpS}
                    value={vals.q}
                    onChange={e => setVals({ q: Math.max(1, parseInt(e.target.value) || 1) })} />
                </div>
                <div style={fieldS}>
                  <label style={lblS}>N° ante</label>
                  <input type="number" min={0} style={inpS}
                    value={vals.ante}
                    onChange={e => setVals({ ante: parseInt(e.target.value) || 0 })} />
                </div>
                <div style={fieldS}>
                  <label style={lblS}>Larghezza (cm)</label>
                  <input type="number" min={0} step="0.1" style={inpS}
                    value={vals.l || ''}
                    onChange={e => setVals({ l: parseFloat(e.target.value) || 0 })} />
                </div>
                <div style={fieldS}>
                  <label style={lblS}>Altezza (cm)</label>
                  <input type="number" min={0} step="0.1" style={inpS}
                    value={vals.h || ''}
                    onChange={e => setVals({ h: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
              <div style={fieldS}>
                <label style={lblS}>Colore / finitura</label>
                <input style={inpS} value={vals.colore}
                  onChange={e => setVals({ colore: e.target.value })} />
              </div>
              <div style={fieldS}>
                <label style={lblS}>Note</label>
                <textarea style={{ ...inpS, resize: 'vertical', minHeight: 60 }}
                  value={vals.note}
                  onChange={e => setVals({ note: e.target.value })} />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', color: '#555', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Annulla
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={actPending}
              style={{
                padding: '8px 20px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 700,
                cursor: actPending ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                background: actPending
                  ? '#aaa'
                  : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#1b4d1b 0%,#266626 20%,#3a8f3a 45%,#266626 80%,#1b4d1b 100%)',
                boxShadow: actPending ? 'none' : '0 2px 8px rgba(20,80,20,0.45),inset 0 1px 0 rgba(160,255,160,0.2)',
                color: '#d4f5d4',
              }}
            >
              {actPending ? 'Salvataggio…' : isEdit ? 'Salva' : 'Aggiungi'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── rendering ──────────────────────────────────────────────────────────────

  let parentCounter = 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {renderModal()}

      {/* Barra azioni */}
      <div style={{
        background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10,
        padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
          {isLoggedIn
            ? 'Se non procedi al trasferimento nella tua area personale, ti consigliamo di scaricare il pdf o stamparlo perché non verrà salvato nel nostro sistema.'
            : 'Se non sei registrato, ti consigliamo di scaricare il pdf o stamparlo perché non verrà salvato nel nostro sistema.'}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {isLoggedIn && (
            <button type="button" onClick={handleSalva} disabled={savePending} style={{
              height: 38, padding: '0 22px', fontSize: 13, fontWeight: 700, borderRadius: 6,
              background: savePending ? '#aaa' : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#1b4d1b 0%,#266626 20%,#3a8f3a 45%,#266626 80%,#1b4d1b 100%)',
              boxShadow: savePending ? 'none' : '0 2px 8px rgba(20,80,20,0.45),inset 0 1px 0 rgba(160,255,160,0.2)',
              color: '#d4f5d4', border: 'none', cursor: savePending ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center',
            }}>
              {savePending ? 'Salvataggio…' : 'Salva come preventivo'}
            </button>
          )}
          <a href="/area-clienti/carrello-preventivo/stampa" style={{
            height: 38, padding: '0 22px', fontSize: 13, fontWeight: 700, borderRadius: 6,
            background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#111 0%,#222 20%,#383838 45%,#222 80%,#111 100%)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08)',
            color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
          }}>
            <span className="animato">Genera PDF</span>
          </a>
          <button type="button" onClick={handleSvuota} disabled={clearPending} style={{
            height: 38, padding: '0 22px', fontSize: 13, fontWeight: 700, borderRadius: 6,
            background: clearPending ? '#aaa' : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#5a0000 0%,#8b0000 20%,#a01010 45%,#8b0000 80%,#5a0000 100%)',
            boxShadow: clearPending ? 'none' : '0 4px 14px rgba(100,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.07)',
            color: '#fff', border: 'none', cursor: clearPending ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center',
          }}>
            {clearPending ? 'Svuotamento…' : 'Svuota carrello'}
          </button>
        </div>
      </div>

      {saveError && (
        <div style={{ background: '#fff5f5', color: '#c00', border: '1px solid #fed7d7', borderRadius: 6, padding: '10px 16px', fontSize: 14 }}>
          {saveError}
        </div>
      )}

      {/* Tabella articoli */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thS}>#</th>
              <th style={thS}>Tipo</th>
              <th style={thS}>Produttore</th>
              <th style={thS}>Articolo / Caratteristica</th>
              <th style={{ ...thS, textAlign: 'center' }}>Unità</th>
              <th style={{ ...thS, textAlign: 'right' }}>Prezzo unit.</th>
              <th style={{ ...thS, textAlign: 'center' }}>Qtà</th>
              <th style={{ ...thS, textAlign: 'right' }}>Subtotale</th>
              <th style={thS}></th>
            </tr>
          </thead>
          <tbody>
            {articoli.map((a) => {
              const isChild = !!a.parent
              if (!isChild) parentCounter++
              const num = isChild ? null : parentCounter

              return (
                <tr key={a.index} style={{ background: isChild ? '#fafafa' : '#fff' }}>
                  {/* # */}
                  <td style={{ ...tdS, color: '#aaa', paddingLeft: isChild ? 36 : 16, fontSize: isChild ? 15 : 13 }}>
                    {isChild ? '↳' : num}
                  </td>

                  {/* Tipo */}
                  <td style={{ ...tdS, color: isChild ? '#999' : '#333' }}>
                    {a.categoria}
                  </td>

                  {/* Produttore */}
                  <td style={{ ...tdS, color: '#888' }}>
                    {a.produttore}
                  </td>

                  {/* Descrizione */}
                  <td style={{ ...tdS, paddingLeft: isChild ? 20 : 16 }}>
                    {a.descrizione}
                    {(() => {
                      const parts: string[] = []
                      if (a.ante && a.ante > 1) parts.push(`${a.ante} ante`)
                      if (a.larghezza_cm) parts.push(`L: ${a.larghezza_cm} cm`)
                      if (a.altezza_cm)   parts.push(`H: ${a.altezza_cm} cm`)
                      if (a.colore)        parts.push(a.colore)
                      return parts.length > 0
                        ? <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{parts.join(' · ')}</div>
                        : null
                    })()}
                    {a.note && <div style={{ fontSize: 11, color: '#aaa', marginTop: 1, fontStyle: 'italic' }}>{a.note}</div>}
                  </td>

                  {/* Unità */}
                  <td style={{ ...tdS, textAlign: 'center' }}>
                    {a.unita}
                  </td>

                  {/* Prezzo unit. */}
                  <td style={{ ...tdS, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    € {Number(a.prezzo_vendita).toFixed(2)}
                    <span style={{ fontSize: 10, color: '#aaa', marginLeft: 2 }}>/{a.unita}</span>
                  </td>

                  {/* Qtà */}
                  <td style={{ ...tdS, textAlign: 'center', fontWeight: 600 }}>
                    {a.quantita}
                  </td>

                  {/* Subtotale */}
                  <td style={{ ...tdS, textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    € {calcolaPrezzo(a).toFixed(2)}
                  </td>

                  {/* Azioni */}
                  <td style={{ ...tdS, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
                      {/* Matita */}
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        title="Modifica"
                        style={{ background: 'none', border: 'none', color: '#888', fontSize: 14, cursor: 'pointer', padding: '3px 5px', borderRadius: 4, lineHeight: 1 }}
                      >
                        ✏
                      </button>

                      {/* + (solo su articoli padre, non figli) */}
                      {!isChild && (
                        <button
                          type="button"
                          onClick={() => handleAggiungiComeFiglio(a)}
                          title="Aggiungi caratteristica"
                          style={{ background: 'none', border: 'none', color: '#888', fontSize: 17, cursor: 'pointer', padding: '3px 5px', borderRadius: 4, lineHeight: 1, fontWeight: 400 }}
                        >
                          +
                        </button>
                      )}

                      {/* Rimuovi */}
                      <button
                        type="button"
                        onClick={() => handleRimuovi(a.index)}
                        disabled={delPending}
                        title="Rimuovi"
                        style={{ background: 'none', border: 'none', color: '#c00', fontSize: 14, cursor: delPending ? 'not-allowed' : 'pointer', padding: '3px 6px', borderRadius: 4, lineHeight: 1 }}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: '#fafafa', borderTop: '2px solid #e8e8e8' }}>
              <td colSpan={7} style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, textAlign: 'right', color: '#1a1a1a' }}>
                Totale indicativo
              </td>
              <td style={{ padding: '12px 16px', fontSize: 15, fontWeight: 700, textAlign: 'right', color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                € {totale.toFixed(2)}
              </td>
              <td style={{ padding: '12px 16px' }} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Bottoni aggiunta articoli */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '16px 20px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>
          Aggiungi al carrello
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* Aggiungi articolo → catalogo */}
          <a href="/brand/cataloghi" style={{
            height: 36, padding: '0 18px', fontSize: 12, fontWeight: 700, borderRadius: 6,
            background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#111 0%,#222 20%,#383838 45%,#222 80%,#111 100%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.08)',
            color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
          }}>
            + Aggiungi articolo
          </a>

          {/* Stesso tipo del precedente */}
          {lastTopLevel && (
            <button type="button" onClick={openDuplica} disabled={actPending} style={{
              height: 36, padding: '0 18px', fontSize: 12, fontWeight: 700, borderRadius: 6,
              background: actPending ? '#e8e8e8' : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#3a3a3a 0%,#555 20%,#6e6e6e 45%,#555 80%,#3a3a3a 100%)',
              boxShadow: actPending ? 'none' : '0 2px 8px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.1)',
              color: actPending ? '#999' : '#eee', border: 'none', cursor: actPending ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center',
            }}>
              + Aggiungi articolo del tipo precedente
            </button>
          )}

          {/* Caratteristica dell'ultimo articolo */}
          {lastTopLevel && (
            <button type="button" onClick={handleAggiungiCaratteristicaUltimo} disabled={actPending} style={{
              height: 36, padding: '0 18px', fontSize: 12, fontWeight: 700, borderRadius: 6,
              background: actPending ? '#e8e8e8' : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#3a3a3a 0%,#555 20%,#6e6e6e 45%,#555 80%,#3a3a3a 100%)',
              boxShadow: actPending ? 'none' : '0 2px 8px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.1)',
              color: actPending ? '#999' : '#eee', border: 'none', cursor: actPending ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center',
            }}>
              + Aggiungi caratteristica dell&apos;ultimo articolo
            </button>
          )}
        </div>
      </div>

      {articoli.some(a => a.unita === 'mq' || a.unita === 'ml') && (
        <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
          * Per articoli a m² o m lin. il subtotale è calcolato sul prezzo unitario di listino. Il prezzo finale dipenderà dalle dimensioni effettive.
        </p>
      )}

      {!isLoggedIn && (
        <div style={{ background: '#fdfcf8', border: '1px solid #e8d89a', borderRadius: 10, padding: '20px 24px' }}>
          <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>
            Accedi per sbloccare gli sconti riservati ai nostri clienti
          </p>
          <p style={{ fontSize: 13, color: '#555', margin: '0 0 14px', lineHeight: 1.6 }}>
            I clienti registrati ricevono sconti esclusivi applicati automaticamente sui preventivi — sia per articolo che sul totale. Accedi o registrati, salva il carrello come preventivo e scopri il prezzo finale con i tuoi sconti.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/login" style={{
              padding: '8px 20px', fontSize: 13, fontWeight: 700, borderRadius: 6,
              background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#1b4d1b 0%,#266626 20%,#3a8f3a 45%,#266626 80%,#1b4d1b 100%)',
              boxShadow: '0 2px 8px rgba(20,80,20,0.45),inset 0 1px 0 rgba(160,255,160,0.2)',
              color: '#d4f5d4', textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            }}>Accedi</a>
            <a href="/registrazione" style={{
              padding: '8px 20px', fontSize: 13, fontWeight: 600, borderRadius: 6,
              border: '1px solid #ccc', background: '#fff', color: '#333', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center',
            }}>Registrati →</a>
          </div>
        </div>
      )}

      {isLoggedIn && scontoClientePct > 0 && (
        <div style={{ background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: 10, padding: '14px 20px' }}>
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#276749' }}>
            {scontoClientePct === 5
              ? `Lo sconto del 5% di benvenuto verrà applicato automaticamente al totale quando salvi il preventivo.`
              : `Lo sconto del ${scontoClientePct}% a te riservato verrà applicato automaticamente al totale quando salvi il preventivo.`}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <a href="/brand/cataloghi" style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline' }}>
          Vai ai cataloghi per preventivi →
        </a>
        {!isLoggedIn && (
          <p style={{ margin: 0, fontSize: 12, color: '#555' }}>
            Vuoi capire come funziona il servizio preventivi?{' '}
            <a href="/aiuto/guida-preventivo" style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline' }}>
              Consulta la guida →
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
