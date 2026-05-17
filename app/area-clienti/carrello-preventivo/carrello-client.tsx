'use client'

import React, { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  rimuoviDaCarrello, salvaCarrelloComePreventivo, svuotaCarrello,
  aggiornaArticoloCarrello, aggiungiArticoloAlCarrello, impostaParentPendente,
  applicaCaratteristicaAlCarrello,
} from '@/app/brand/cataloghi/actions'
import { logPdfRequest } from './actions'
import { DropdownLoginForm } from '@/components/header-auth'

export type CaratteristicaListino = {
  id: number
  categoria: string
  produttore: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  sconto_articolo: number
  richiede_tipo_colore: number
  richiede_tipo_vetro: number
}

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
  sconto_articolo?: number
  costante?: number
  richiede_larghezza?: number
  richiede_altezza?: number
  richiede_quantita?: number
  richiede_tipo_colore?: number
  richiede_tipo_vetro?: number
}

type ModalState =
  | null
  | { type: 'edit'; item: ArticoloCarrello }
  | { type: 'duplica'; lastItem: ArticoloCarrello }
  | { type: 'lacuna'; target: ArticoloCarrello; lacuna: string }

type EditVals = { q: number; ante: number; l: number; h: number; colore: string; note: string; desc: string }

function LoginBanner() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div style={{ background: '#fdfcf8', border: '1px solid #e8d89a', borderRadius: 10, padding: '20px 24px' }}>
      <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>
        Accedi per sbloccare gli sconti riservati ai nostri clienti
      </p>
      <p style={{ fontSize: 13, color: '#555', margin: '0 0 14px', lineHeight: 1.6 }}>
        I clienti registrati ricevono sconti esclusivi applicati automaticamente sui preventivi — sia per articolo che sul totale. Accedi o registrati, salva il carrello come preventivo e scopri il prezzo finale con i tuoi sconti.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div ref={ref} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(v => !v)}
            className={open ? 'btn-orange' : 'btn-black'}
            style={{ padding: '8px 20px', fontSize: 13, fontWeight: 700, borderRadius: 6, fontFamily: 'inherit' }}
          >
            {open ? 'Chiudi ▴' : 'Accedi ▾'}
          </button>
          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0,
              background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 210, zIndex: 200,
            }}>
              <DropdownLoginForm />
            </div>
          )}
        </div>
        <a href="/registrazione" className="btn-black" style={{
          padding: '8px 20px', fontSize: 13, fontWeight: 700, borderRadius: 6,
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', fontFamily: 'inherit',
        }}>Registrati →</a>
      </div>
    </div>
  )
}

export default function CarrelloClient({
  articoli,
  isLoggedIn,
  scontoClientePct = 0,
  caratteristiche = [],
}: {
  articoli: ArticoloCarrello[]
  isLoggedIn: boolean
  scontoClientePct?: number
  caratteristiche?: CaratteristicaListino[]
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
  const [lacunaFilter, setLacunaFilter]     = useState('')
  const [lacunaSelected, setLacunaSelected] = useState<number | null>(null)

  // ── helpers ────────────────────────────────────────────────────────────────

  function calcolaPrezzo(a: ArticoloCarrello, tutti: ArticoloCarrello[]): number {
    if (a.tipo === 'caratteristica') return 0
    const pb = Number(a.prezzo_vendita)
    const sc = a.sconto_articolo ?? 0
    if (a.parent != null && pb === 0 && sc < 0) {
      const padre = tutti.find(x => x.uid === a.parent)
      if (padre) {
        const subtotalePadre = calcolaPrezzo(padre, tutti)
        return Math.round(-(subtotalePadre * sc / 100) * 100) / 100
      }
      return 0
    }
    const h  = (a.altezza_cm  ?? 0) / 100
    const l  = (a.larghezza_cm ?? 0) / 100
    const q  = a.quantita
    const costante = a.parent != null
      ? (tutti.find(x => x.uid === a.parent)?.costante || 1)
      : 1
    if (a.unita === 'm²') return Math.round(pb * h * l * q * costante * 100) / 100
    if (a.unita === 'ml') return Math.round(pb * l * q * costante * 100) / 100
    return Math.round(pb * q * 100) / 100
  }

  const totale = articoli.reduce((s, a) => s + calcolaPrezzo(a, articoli), 0)

  const lastTopLevel = [...articoli].reverse().find(a => !a.parent && a.tipo !== 'caratteristica')

  const hasLacuneAperte = articoli.some(a => !a.parent && a.tipo !== 'caratteristica' && getLacuneAperte(a).length > 0)

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

  function getLacuneAperte(a: ArticoloCarrello): string[] {
    const children = articoli.filter(x => x.parent === a.uid)
    const lacune: string[] = []
    if (a.richiede_tipo_colore === 1 && !children.some(c => c.richiede_tipo_colore === 1)) lacune.push('tipo_colore')
    if (a.richiede_tipo_vetro  === 1 && !children.some(c => c.richiede_tipo_vetro  === 1)) lacune.push('tipo_vetro')
    return lacune
  }

  async function handleAggiungiComeFiglio(a: ArticoloCarrello) {
    await impostaParentPendente(a.uid, a.descrizione, getLacuneAperte(a))
    router.push('/brand/cataloghi')
  }

  function handleAggiungiLacuna(a: ArticoloCarrello, lacuna: string) {
    setLacunaFilter('')
    setLacunaSelected(null)
    setModal({ type: 'lacuna', target: a, lacuna })
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

  function handleGeneraPDF() {
    if (hasLacuneAperte) return
    logPdfRequest(articoli.map(a => ({
      categoria: a.categoria,
      produttore: a.produttore,
      descrizione: a.descrizione,
      unita: a.unita,
      prezzo_vendita: a.prezzo_vendita,
      quantita: a.quantita,
      sconto_articolo: a.sconto_articolo,
      tipo: a.tipo,
    }))).catch(() => {})
    window.location.href = '/area-clienti/carrello-preventivo/stampa'
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

  function handleApplicaCaratteristica(tuttiConStessaLacuna: boolean) {
    if (modal?.type !== 'lacuna') return
    if (!lacunaSelected) return
    const { target, lacuna } = modal
    let uids: number[]
    if (tuttiConStessaLacuna) {
      const lacunaFlag = lacuna === 'tipo_colore' ? 'richiede_tipo_colore' : 'richiede_tipo_vetro'
      uids = articoli
        .filter(a => !a.parent && a.tipo !== 'caratteristica' && (a[lacunaFlag as keyof ArticoloCarrello] as number) === 1)
        .map(a => a.uid)
    } else {
      uids = [target.uid]
    }
    const selectedId = lacunaSelected
    startAct(async () => {
      const result = await applicaCaratteristicaAlCarrello(uids, selectedId)
      if (result.ok && result.newCart) {
        document.cookie = `digi_cart=${result.newCart}; max-age=${30 * 24 * 60 * 60}; path=/; samesite=lax`
      }
      setModal(null)
      router.refresh()
    })
  }

  async function handleAggiungiCaratteristicaUltimo() {
    if (!lastTopLevel) return
    await impostaParentPendente(lastTopLevel.uid, lastTopLevel.descrizione, getLacuneAperte(lastTopLevel))
    router.push('/brand/cataloghi')
  }

  // ── stili ──────────────────────────────────────────────────────────────────

  const thS: React.CSSProperties = {
    padding: '8px 8px', fontSize: 11, fontWeight: 600, color: '#888',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fafafa', borderBottom: '1px solid #e8e8e8', whiteSpace: 'nowrap',
  }
  const tdS: React.CSSProperties = {
    padding: '2px 8px', fontSize: 13, color: '#333',
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

    const onClose = () => setModal(null)

    // ── Modal lacuna ────────────────────────────────────────────────────────────
    if (modal.type === 'lacuna') {
      const { target, lacuna } = modal
      const lacunaFlag = lacuna === 'tipo_colore' ? 'richiede_tipo_colore' : 'richiede_tipo_vetro'
      const disponibili = caratteristiche.filter(c => c[lacunaFlag as keyof CaratteristicaListino] === 1)
      const filtrate = lacunaFilter.trim()
        ? disponibili.filter(c => {
            const q = lacunaFilter.toLowerCase()
            return c.descrizione.toLowerCase().includes(q) || c.produttore.toLowerCase().includes(q) || c.categoria.toLowerCase().includes(q)
          })
        : disponibili

      const altriConLacuna = articoli
        .filter(a => !a.parent && a.tipo !== 'caratteristica' && a.uid !== target.uid)
        .filter(a => (a[lacunaFlag as keyof ArticoloCarrello] as number) === 1)
        .filter(a => getLacuneAperte(a).includes(lacuna))
      const hasAltri = altriConLacuna.length > 0

      return (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', maxWidth: 520, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>Aggiungi caratteristica</h3>
            <p style={{ fontSize: 12, color: '#666', margin: '0 0 18px' }}>
              Articolo selezionato: <strong>{target.produttore ? `${target.produttore} — ` : ''}{target.descrizione}</strong>
            </p>

            <div style={fieldS}>
              <label style={lblS}>Scegli la caratteristica da applicare</label>
              <input
                type="text"
                placeholder="Cerca per descrizione, produttore…"
                style={{ ...inpS, marginBottom: 8 }}
                value={lacunaFilter}
                onChange={e => { setLacunaFilter(e.target.value); setLacunaSelected(null) }}
              />
              <div style={{ border: '1px solid #ddd', borderRadius: 6, maxHeight: 260, overflowY: 'auto' }}>
                {filtrate.length === 0 ? (
                  <p style={{ fontSize: 12, color: '#aaa', margin: 0, padding: '12px 14px' }}>Nessun risultato.</p>
                ) : filtrate.map((c, i) => {
                  const isSel = lacunaSelected === c.id
                  const magg = c.sconto_articolo < 0 ? Math.abs(c.sconto_articolo) : null
                  return (
                    <div
                      key={c.id}
                      onClick={() => setLacunaSelected(c.id)}
                      style={{
                        padding: '10px 14px',
                        borderBottom: i < filtrate.length - 1 ? '1px solid #ececec' : 'none',
                        cursor: 'pointer',
                        background: isSel ? '#e8f4e8' : '#fff',
                        minHeight: 48,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        userSelect: 'none',
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: isSel ? 700 : 400, color: '#1a1a1a', lineHeight: 1.4 }}>
                        {c.produttore ? `${c.produttore} · ` : ''}{c.descrizione}
                        {magg && <span style={{ color: '#b45000', fontWeight: 600 }}> (Magg. del {magg}%)</span>}
                        {c.prezzo_vendita > 0 && <span style={{ color: '#555' }}> — € {Number(c.prezzo_vendita).toFixed(2)}/{c.unita}</span>}
                      </span>
                      {c.categoria && <span style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{c.categoria}</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8, alignItems: 'center' }}>
              <button type="button" onClick={() => handleApplicaCaratteristica(false)} disabled={!lacunaSelected || actPending}
                className={(!lacunaSelected || actPending) ? 'btn-gray' : 'btn-green'}
                style={{ padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {actPending ? '…' : 'Applica'}
              </button>
              {hasAltri && (
                <button type="button" onClick={() => handleApplicaCaratteristica(true)} disabled={!lacunaSelected || actPending}
                  className={(!lacunaSelected || actPending) ? 'btn-gray' : 'btn-green'}
                  style={{ padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  {actPending ? '…' : 'Applica a tutti'}
                </button>
              )}
              <button type="button" onClick={onClose} className="btn-orange"
                style={{ padding: '8px 18px', borderRadius: 6, fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                Annulla
              </button>
            </div>
          </div>
        </div>
      )
    }

    // ── Modal edit / duplica ────────────────────────────────────────────────────
    const isEdit    = modal.type === 'edit'
    const isDuplica = modal.type === 'duplica'

    const title = isEdit ? 'Modifica articolo' : 'Aggiungi articolo dello stesso tipo'

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

          {(isEdit || isDuplica) && (() => {
            const ref = isEdit ? modal.item : modal.lastItem
            return (
              <>
                {isDuplica && (
                  <p style={{ fontSize: 12, color: '#888', margin: '0 0 14px' }}>
                    Tipo: <strong>{modal.lastItem.produttore} — {modal.lastItem.descrizione}</strong>
                  </p>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  {ref.richiede_quantita === 1 && (
                    <div style={fieldS}>
                      <label style={lblS}>Quantità</label>
                      <input type="number" min={1} style={inpS}
                        value={vals.q}
                        onChange={e => setVals({ q: Math.max(1, parseInt(e.target.value) || 1) })} />
                    </div>
                  )}
                  {ref.richiede_larghezza === 1 && (
                    <div style={{ ...fieldS, gridColumn: '1 / -1' }}>
                      <label style={lblS}>Larghezza (cm)</label>
                      <input type="number" min={0} step="0.1" style={inpS}
                        value={vals.l || ''}
                        onChange={e => setVals({ l: parseFloat(e.target.value) || 0 })} />
                    </div>
                  )}
                  {ref.richiede_altezza === 1 && (
                    <div style={{ ...fieldS, gridColumn: '1 / -1' }}>
                      <label style={lblS}>Altezza (cm)</label>
                      <input type="number" min={0} step="0.1" style={inpS}
                        value={vals.h || ''}
                        onChange={e => setVals({ h: parseFloat(e.target.value) || 0 })} />
                    </div>
                  )}
                </div>
              </>
            )
          })()}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose}
              style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', color: '#555', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              Annulla
            </button>
            <button type="button" onClick={onSave} disabled={actPending}
              style={{
                padding: '8px 20px', borderRadius: 6, border: 'none', fontSize: 13, fontWeight: 700,
                cursor: actPending ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                background: actPending
                  ? '#aaa'
                  : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#1b4d1b 0%,#266626 20%,#3a8f3a 45%,#266626 80%,#1b4d1b 100%)',
                boxShadow: actPending ? 'none' : '0 2px 8px rgba(20,80,20,0.45),inset 0 1px 0 rgba(160,255,160,0.2)',
                color: '#d4f5d4',
              }}>
              {actPending ? 'Salvataggio…' : isEdit ? 'Salva' : 'Aggiungi'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── rendering ──────────────────────────────────────────────────────────────

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
            <button type="button" onClick={handleSalva} disabled={savePending || hasLacuneAperte} style={{
              height: 38, padding: '0 22px', fontSize: 13, fontWeight: 700, borderRadius: 6,
              background: (savePending || hasLacuneAperte) ? '#aaa' : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#1b4d1b 0%,#266626 20%,#3a8f3a 45%,#266626 80%,#1b4d1b 100%)',
              boxShadow: (savePending || hasLacuneAperte) ? 'none' : '0 2px 8px rgba(20,80,20,0.45),inset 0 1px 0 rgba(160,255,160,0.2)',
              color: (savePending || hasLacuneAperte) ? '#fff' : '#d4f5d4', border: 'none', cursor: (savePending || hasLacuneAperte) ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center',
            }}>
              {savePending ? 'Salvataggio…' : 'Salva come preventivo'}
            </button>
          )}
          <button type="button" onClick={handleGeneraPDF} disabled={hasLacuneAperte} style={{
            height: 38, padding: '0 22px', fontSize: 13, fontWeight: 700, borderRadius: 6,
            background: hasLacuneAperte ? '#aaa' : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#111 0%,#222 20%,#383838 45%,#222 80%,#111 100%)',
            boxShadow: hasLacuneAperte ? 'none' : '0 4px 16px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08)',
            color: '#fff', border: 'none', cursor: hasLacuneAperte ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center',
          }}>
            <span className={hasLacuneAperte ? undefined : 'animato'}>Genera PDF</span>
          </button>
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

      {/* Messaggi sconto */}
      {(() => {
        const hasPromo = articoli.some(a => (a.sconto_articolo ?? 0) > 0)
        const msgs: string[] = []
        if (isLoggedIn && scontoClientePct > 5) {
          msgs.push(`Complimenti! Hai diritto ad uno sconto personalizzato del ${scontoClientePct}% sul totale! Basta salvare il preventivo per ottenerlo.`)
        } else {
          msgs.push('Complimenti! Hai diritto ad uno sconto di benvenuto del 5% sul totale! Basta salvare il preventivo per ottenerlo.')
        }
        if (hasPromo) msgs.push('Complimenti! Hai selezionato degli articoli in promozione! Basta salvare il preventivo per attivarla.')
        return msgs.map((msg, i) => (
          <div key={i} style={{ background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: 10, padding: '14px 20px' }}>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#276749' }}>{msg}</p>
          </div>
        ))
      })()}

      {/* Avviso trasporto e montaggio */}
      <div style={{ background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: 10, padding: '14px 20px' }}>
        <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: '#9b2c2c' }}>
          Salvando il preventivo riceverai il prezzo scontato degli articoli ma è escluso trasporto e montaggio perché abbiamo bisogno di conoscere il luogo di destinazione. Contattaci per avere il preventivo ufficiale.
        </p>
      </div>

      {/* Articoli a card */}
      {(() => {
        const groups: ArticoloCarrello[][] = []
        for (const a of articoli) {
          if (!a.parent) {
            groups.push([a])
          } else {
            const g = groups.find(grp => grp[0].uid === a.parent)
            if (g) g.push(a)
          }
        }
        const renderColgroup = () => (
          <colgroup>
            <col style={{ width: 40 }} />
            <col style={{ width: 40 }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '13%' }} />
            <col />
            <col style={{ width: 58 }} />
            <col style={{ width: 105 }} />
            <col style={{ width: 52 }} />
            <col style={{ width: 105 }} />
            <col style={{ width: 76 }} />
          </colgroup>
        )
        return (
          <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 900 }}>
            {/* Header */}
            <div style={{ background: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                {renderColgroup()}
                <thead>
                  <tr>
                    <th style={thS}>#</th>
                    <th style={thS}></th>
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
              </table>
            </div>

            {/* Group cards */}
            {groups.map((group, gi) => (
              <div key={group[0].index} className="class_silver_D_safe" style={{ border: '1px solid #c8960c', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  {renderColgroup()}
                  <tbody>
                    {group.map(a => {
                      const isChild = !!a.parent
                      const num = isChild ? null : gi + 1

                      const childrenOfA = !isChild ? articoli.filter(x => x.parent === a.uid) : []
                      const showColore  = !isChild && a.richiede_tipo_colore === 1 && !childrenOfA.some(c => c.richiede_tipo_colore === 1)
                      const showVetro   = !isChild && a.richiede_tipo_vetro  === 1 && !childrenOfA.some(c => c.richiede_tipo_vetro  === 1)
                      const hasWarning  = showColore || showVetro
                      const tdRow: React.CSSProperties = tdS

                      return (
                        <React.Fragment key={a.index}>
                          <tr style={{ background: isChild ? 'rgba(0,0,0,0.04)' : 'transparent' }}>
                            <td style={{ ...tdRow, color: '#aaa', paddingLeft: isChild ? 36 : 8, fontSize: isChild ? 15 : 13 }}>
                              {isChild ? '↳' : num}
                            </td>
                            <td style={{ ...tdRow, whiteSpace: 'nowrap', padding: '2px 4px', width: 1 }}>
                              {!isChild && (
                                <button type="button" onClick={() => openEdit(a)} className="btn-black"
                                  style={{ width: 32, padding: 0, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <span style={{ position: 'relative', zIndex: 1, fontSize: 14, display: 'inline-block', transform: 'rotate(135deg)' }}>✏</span>
                                </button>
                              )}
                            </td>
                            <td style={{ ...tdRow, color: isChild ? '#999' : '#333' }}>
                              {a.categoria}
                            </td>
                            <td style={{ ...tdRow, color: '#888' }}>
                              {a.produttore}
                            </td>
                            <td style={{ ...tdRow, paddingLeft: isChild ? 20 : 16 }}>
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
                            <td style={{ ...tdRow, textAlign: 'center' }}>
                              {a.unita}
                            </td>
                            <td style={{ ...tdRow, textAlign: 'right', whiteSpace: 'nowrap' }}>
                              € {Number(a.prezzo_vendita).toFixed(2)}
                              <span style={{ fontSize: 10, color: '#aaa', marginLeft: 2 }}>/{a.unita}</span>
                            </td>
                            <td style={{ ...tdRow, textAlign: 'center', fontWeight: 600 }}>
                              {a.quantita}
                            </td>
                            <td style={{ ...tdRow, textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              € {calcolaPrezzo(a, articoli).toFixed(2)}
                            </td>
                            <td style={{ ...tdRow, whiteSpace: 'nowrap', padding: '2px 4px' }}>
                              <button type="button" onClick={() => handleRimuovi(a.index)} disabled={delPending} className="btn-red"
                                style={{ width: 32, padding: 0, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ position: 'relative', zIndex: 1, fontSize: 14 }}>✕</span>
                              </button>
                            </td>
                          </tr>
                          {showColore && (
                            <tr style={{ background: 'transparent' }}>
                              <td style={{ padding: '2px 4px 4px', borderBottom: '1px solid #f0f0f0' }} />
                              <td style={{ padding: '2px 4px 4px', borderBottom: '1px solid #f0f0f0' }}>
                                <button type="button" onClick={() => handleAggiungiLacuna(a, 'tipo_colore')} title="Aggiungi colore" className="btn-green" style={{ width: 32, padding: 0, fontWeight: 700, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ position: 'relative', zIndex: 1, fontSize: 24, lineHeight: 1, fontWeight: 300 }}>+</span></button>
                              </td>
                              <td colSpan={8} style={{ padding: '2px 8px 4px', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: 11, color: '#8b0000', background: '#fff', border: '1px solid #e53e3e', borderRadius: 4, padding: '3px 8px', display: 'inline-block' }}>
                                  Scegliere tra Colori standard (prezzo base) o Colori particolari (maggiorazione di prezzo)
                                </span>
                              </td>
                            </tr>
                          )}
                          {showVetro && (
                            <tr style={{ background: 'transparent' }}>
                              <td style={{ padding: '2px 4px 4px', borderBottom: '1px solid #f0f0f0' }} />
                              <td style={{ padding: '2px 4px 4px', borderBottom: '1px solid #f0f0f0' }}>
                                <button type="button" onClick={() => handleAggiungiLacuna(a, 'tipo_vetro')} title="Aggiungi vetro" className="btn-green" style={{ width: 32, padding: 0, fontWeight: 700, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ position: 'relative', zIndex: 1, fontSize: 24, lineHeight: 1, fontWeight: 300 }}>+</span></button>
                              </td>
                              <td colSpan={8} style={{ padding: '2px 8px 4px', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: 11, color: '#8b0000', background: '#fff', border: '1px solid #e53e3e', borderRadius: 4, padding: '3px 8px', display: 'inline-block' }}>
                                  Scegliere la tipologia di Vetri o la fornitura Senza Vetri
                                </span>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ))}

            {/* Totale */}
            <div style={{ background: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                {renderColgroup()}
                <tbody>
                  <tr>
                    <td colSpan={7} style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, textAlign: 'right', color: '#1a1a1a' }}>
                      Totale indicativo
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 15, fontWeight: 700, textAlign: 'right', color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        € {totale.toFixed(2)}
                        {articoli.length > 0 && (
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#276749', background: '#f0fff4', border: '1px solid #9ae6b4', borderRadius: 8, padding: '3px 10px', whiteSpace: 'nowrap' }}>DA SCONTARE</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }} />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )
      })()}

      {/* Bottoni aggiunta articoli */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '16px 20px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>
          Aggiungi al carrello
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* Aggiungi articolo → catalogo */}
          <a href="/brand/cataloghi" className="btn-green" style={{
            height: 36, padding: '0 18px', fontSize: 12, fontWeight: 700, borderRadius: 6,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
          }}>
            + Aggiungi articolo
          </a>

          {/* Stesso tipo del precedente */}
          {lastTopLevel && (
            <button type="button" onClick={openDuplica} disabled={actPending}
              className={actPending ? 'btn-gray' : 'btn-green'}
              style={{ height: 36, padding: '0 18px', fontSize: 12, fontWeight: 700, borderRadius: 6, whiteSpace: 'nowrap', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center' }}>
              + Aggiungi articolo del tipo precedente
            </button>
          )}

          {/* Caratteristica dell'ultimo articolo */}
          {lastTopLevel && (() => {
            const lacune = getLacuneAperte(lastTopLevel)
            const disab = actPending || lacune.length === 0
            return (
              <button type="button" onClick={handleAggiungiCaratteristicaUltimo} disabled={disab}
                className={disab ? 'btn-gray' : 'btn-green'}
                style={{ height: 36, padding: '0 18px', fontSize: 12, fontWeight: 700, borderRadius: 6, whiteSpace: 'nowrap', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center' }}>
                + Aggiungi caratteristica dell&apos;ultimo articolo
              </button>
            )
          })()}
        </div>
      </div>

      {articoli.some(a => a.unita === 'mq' || a.unita === 'ml') && (
        <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
          * Per articoli a m² o m lin. il subtotale è calcolato sul prezzo unitario di listino. Il prezzo finale dipenderà dalle dimensioni effettive.
        </p>
      )}

      {!isLoggedIn && <LoginBanner />}


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
