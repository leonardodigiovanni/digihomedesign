'use client'

import React, { useState, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  rimuoviDaCarrelloAcquisti,
  svuotaCarrelloAcquisti,
  aggiornaArticoloCarrelloAcquisti,
  applicaCaratteristicaAlCarrelloAcquisti,
  aggiungiArticoloAlCarrelloAcquisti,
} from '@/app/brand/cataloghi/actions'
import { DropdownLoginForm } from '@/components/header-auth'
import PreviewInfisso from '@/components/preview-infisso'


export type CaratteristicaListino = {
  id: number
  categoria: string
  produttore: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  sconto_articolo: number
  richiede_tipo_colore: number
  richiede_tipo_colore_acc: number
  richiede_tipo_vetro: number
  richiede_tipo_montaggio: number
}

export type ArticoloCarrelloAcquisti = {
  index: number
  listino_id: number
  categoria: string
  produttore: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  sconto_articolo: number
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
  richiede_tipo_colore: number
  richiede_tipo_colore_acc: number
  richiede_tipo_vetro: number
  richiede_tipo_montaggio: number
  foto_url: string | null
  abbr?: string
  profilo_mm?: number
  bar_color?: string | null
  bar_color_acc?: string | null
}

type ModalState =
  | null
  | { type: 'edit'; item: ArticoloCarrelloAcquisti }
  | { type: 'duplica'; lastItem: ArticoloCarrelloAcquisti }
  | { type: 'lacuna'; target: ArticoloCarrelloAcquisti; lacuna: string }

type EditVals = { q: number; l: number; h: number; colore: string; note: string }

export default function CarrelloAcquistiClient({
  articoli,
  isLoggedIn,
  caratteristiche = [],
  registrazioniDisabilitate = false,
  scontoClientePct = 0,
  cataloghiHref = '/brand/cataloghi',
  pagamentoHref = '/area-clienti/carrello-acquisti/pagamento',
  stampaHref = '/area-clienti/carrello-acquisti/stampa',
  loginRedirectHref = '/area-clienti/carrello-acquisti',
}: {
  articoli: ArticoloCarrelloAcquisti[]
  isLoggedIn: boolean
  caratteristiche?: CaratteristicaListino[]
  registrazioniDisabilitate?: boolean
  scontoClientePct?: number
  cataloghiHref?: string
  pagamentoHref?: string
  stampaHref?: string
  loginRedirectHref?: string
}) {
  const router = useRouter()
  const [delPending,   startDel]   = useTransition()
  const [clearPending, startClear] = useTransition()
  const [actPending,   startAct]   = useTransition()
  const [modal,        setModal]   = useState<ModalState>(null)
  const [editVals,     setEditVals]   = useState<EditVals>({ q: 1, l: 0, h: 0, colore: '', note: '' })
  const [duplicaVals,  setDuplicaVals] = useState<EditVals>({ q: 1, l: 0, h: 0, colore: '', note: '' })
  const [editError,    setEditError] = useState('')
  const [lacunaFilter,   setLacunaFilter]   = useState('')
  const [lacunaSelected, setLacunaSelected] = useState<number | null>(null)
  const [previewItem,  setPreviewItem] = useState<ArticoloCarrelloAcquisti | null>(null)
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => { setIsTouch(window.matchMedia('(pointer: coarse)').matches) }, [])
  const [expandedUID,    setExpandedUID]    = useState<number | null>(null)
  const [showLoginPanel,  setShowLoginPanel]  = useState(false)
  const [showAccediPanel, setShowAccediPanel] = useState(false)
  const loginPanelRef  = useRef<HTMLDivElement>(null)
  const accediPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showLoginPanel) return
    const handle = (e: MouseEvent) => {
      if (loginPanelRef.current && !loginPanelRef.current.contains(e.target as Node)) {
        setShowLoginPanel(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [showLoginPanel])

  useEffect(() => {
    if (!showAccediPanel) return
    const handle = (e: MouseEvent) => {
      if (accediPanelRef.current && !accediPanelRef.current.contains(e.target as Node)) {
        setShowAccediPanel(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [showAccediPanel])

  function toggleLoginPanel() {
    setShowLoginPanel(v => !v)
  }

  function toggleExpand(uid: number) { setExpandedUID(p => p === uid ? null : uid) }

  function fmt(n: number): string {
    const [int, dec] = n.toFixed(2).split('.')
    return int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec
  }

  function renderPrezzo(value: number) {
    const s = fmt(value)
    const idx = s.lastIndexOf(',')
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'monospace', fontSize: 12 }}>
        <span style={{ flex: 1, textAlign: 'right' }}>{s.slice(0, idx)}</span>
        <span>{s.slice(idx)}</span>
      </div>
    )
  }

  function calcolaPrezzoLordo(a: ArticoloCarrelloAcquisti): number {
    if (a.tipo === 'caratteristica') return 0
    const pb = Number(a.prezzo_vendita)
    const sc = a.sconto_articolo ?? 0
    if (a.parent != null && pb === 0 && sc < 0) {
      const padre = articoli.find(x => x.uid === a.parent)
      if (padre) return Math.round(-(calcolaPrezzoLordo(padre) * sc / 100) * 100) / 100
      return 0
    }
    const h = (a.altezza_cm  ?? 0) / 100
    const l = (a.larghezza_cm ?? 0) / 100
    const q = a.quantita
    if (a.unita === 'm²') return Math.round(pb * h * l * q * 100) / 100
    if (a.unita === 'ml') return Math.round(pb * l * q * 100) / 100
    return Math.round(pb * q * 100) / 100
  }

  function calcolaPrezzo(a: ArticoloCarrelloAcquisti): number {
    if (a.tipo === 'caratteristica') return 0
    const pb = Number(a.prezzo_vendita)
    const sc = a.sconto_articolo ?? 0
    if (a.parent != null && pb === 0 && sc < 0) {
      const padre = articoli.find(x => x.uid === a.parent)
      if (padre) return Math.round(-(calcolaPrezzo(padre) * sc / 100) * 100) / 100
      return 0
    }
    const pbScontato = (isLoggedIn && sc > 0) ? pb * (1 - sc / 100) : pb
    const h = (a.altezza_cm  ?? 0) / 100
    const l = (a.larghezza_cm ?? 0) / 100
    const q = a.quantita
    if (a.unita === 'm²') return Math.round(pbScontato * h * l * q * 100) / 100
    if (a.unita === 'ml') return Math.round(pbScontato * l * q * 100) / 100
    return Math.round(pbScontato * q * 100) / 100
  }

  function getLacuneAperte(a: ArticoloCarrelloAcquisti): string[] {
    const children = articoli.filter(x => x.parent === a.uid)
    const lacune: string[] = []
    if (a.richiede_tipo_colore     === 1 && !children.some(c => c.richiede_tipo_colore     === 1)) lacune.push('tipo_colore')
    if (a.richiede_tipo_colore_acc === 1 && !children.some(c => c.richiede_tipo_colore_acc === 1)) lacune.push('tipo_colore_acc')
    if (a.richiede_tipo_vetro      === 1 && !children.some(c => c.richiede_tipo_vetro      === 1)) lacune.push('tipo_vetro')
    if (a.richiede_tipo_montaggio  === 1 && !children.some(c => c.richiede_tipo_montaggio  === 1)) lacune.push('tipo_montaggio')
    return lacune
  }

  const lordo    = isLoggedIn ? articoli.reduce((s, a) => s + calcolaPrezzoLordo(a), 0) : 0
  const subtotale = articoli.reduce((s, a) => s + calcolaPrezzo(a), 0)
  const totale    = subtotale
  const scontiPromo = isLoggedIn ? Math.round((lordo - subtotale) * 100) / 100 : 0
  const scontoCliAmt = (isLoggedIn && scontoClientePct > 0) ? Math.round(subtotale * scontoClientePct / 100 * 100) / 100 : 0
  const totaleFinale = Math.round((subtotale - scontoCliAmt) * 100) / 100
  const totaleQuantita = articoli.filter(a => !a.parent && a.tipo !== 'caratteristica').reduce((s, a) => s + (Number(a.quantita) || 0), 0)
  const hasLacuneAperte = articoli.some(a => !a.parent && a.tipo !== 'caratteristica' && getLacuneAperte(a).length > 0)

  function hasEditableFields(_a: ArticoloCarrelloAcquisti): boolean {
    return true
  }

  function openEdit(a: ArticoloCarrelloAcquisti) {
    setEditVals({ q: a.quantita, l: a.larghezza_cm ?? 0, h: a.altezza_cm ?? 0, colore: a.colore ?? '', note: a.note ?? '' })
    setEditError('')
    setModal({ type: 'edit', item: a })
  }

  function handleEditSave() {
    if (modal?.type !== 'edit') return
    setEditError('')
    startAct(async () => {
      const res = await aggiornaArticoloCarrelloAcquisti(modal.item.index, {
        q:      editVals.q,
        l:      editVals.l || undefined,
        h:      editVals.h || undefined,
        colore: editVals.colore || undefined,
        note:   editVals.note   || undefined,
      })
      if (!res.ok) { setEditError(res.error); return }
      setModal(null)
      router.refresh()
    })
  }

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


  function handleAggiungiLacuna(a: ArticoloCarrelloAcquisti, lacuna: string) {
    setLacunaFilter('')
    setLacunaSelected(null)
    setModal({ type: 'lacuna', target: a, lacuna })
  }

  function handleApplicaCaratteristica(tuttiConStessaLacuna: boolean) {
    if (modal?.type !== 'lacuna') return
    if (!lacunaSelected) return
    const { target, lacuna } = modal
    let uids: number[]
    if (tuttiConStessaLacuna) {
      const lacunaFlag = lacuna === 'tipo_colore' ? 'richiede_tipo_colore' : lacuna === 'tipo_colore_acc' ? 'richiede_tipo_colore_acc' : lacuna === 'tipo_vetro' ? 'richiede_tipo_vetro' : 'richiede_tipo_montaggio'
      uids = articoli
        .filter(a => !a.parent && a.tipo !== 'caratteristica'
          && (a[lacunaFlag as keyof ArticoloCarrelloAcquisti] as number) === 1
          && a.categoria === target.categoria
          && getLacuneAperte(a).includes(lacuna))
        .map(a => a.uid)
    } else {
      uids = [target.uid]
    }
    const selectedId = lacunaSelected
    startAct(async () => {
      const result = await applicaCaratteristicaAlCarrelloAcquisti(uids, selectedId)
      if (result.ok && result.newCart) {
        document.cookie = `digi_cart_acquisti=${result.newCart}; max-age=${30 * 24 * 60 * 60}; path=/; samesite=lax`
      }
      setModal(null)
      router.refresh()
    })
  }

  const thS: React.CSSProperties = {
    padding: '8px 8px', fontSize: 12, fontWeight: 700, color: '#1a1a1a',
    textAlign: 'left', borderBottom: '1px solid #222',
    whiteSpace: 'nowrap', fontFamily: 'monospace',
  }
  const tdS: React.CSSProperties = {
    padding: '2px 8px', fontSize: 12, color: '#1a1a1a',
    borderBottom: '1px solid #222', verticalAlign: 'middle',
    overflow: 'hidden', wordBreak: 'break-word',
    fontFamily: 'monospace',
  }
  const VERDE = 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)'
  const ROSA  = 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)'
  const inpS: React.CSSProperties = {
    width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: 6,
    fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
  }
  const lblS: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 4 }
  const fieldS: React.CSSProperties = { marginBottom: 12 }

  if (articoli.length === 0) {
    return (
      <div style={{ background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)', border: '1px solid #222', borderRadius: 10, padding: '40px 28px', textAlign: 'center', color: '#aaa' }}>
        <p style={{ margin: '0 0 12px', fontSize: 14 }}>Il tuo carrello acquisti è vuoto.</p>
        <a href={cataloghiHref} style={{ color: '#2b6cb0', fontWeight: 600, fontSize: 14 }}>Sfoglia i cataloghi →</a>
      </div>
    )
  }

  const lastTopLevel = [...articoli].reverse().find(a => !a.parent && a.tipo !== 'caratteristica')

  function openDuplica() {
    if (!lastTopLevel) return
    setDuplicaVals({ q: lastTopLevel.quantita, l: lastTopLevel.larghezza_cm ?? 0, h: lastTopLevel.altezza_cm ?? 0, colore: lastTopLevel.colore ?? '', note: lastTopLevel.note ?? '' })
    setEditError('')
    setModal({ type: 'duplica', lastItem: lastTopLevel })
  }

  function handleDuplica() {
    if (modal?.type !== 'duplica') return
    setEditError('')
    startAct(async () => {
      const res = await aggiungiArticoloAlCarrelloAcquisti(modal.lastItem.listino_id, {
        q:      duplicaVals.q,
        l:      duplicaVals.l || undefined,
        h:      duplicaVals.h || undefined,
        colore: duplicaVals.colore || undefined,
        note:   duplicaVals.note   || undefined,
      })
      if (!res.ok) { setEditError(res.error); return }
      setModal(null)
      router.refresh()
    })
  }

  // Build parent/child groups
  const groups: ArticoloCarrelloAcquisti[][] = []
  for (const a of articoli) {
    if (!a.parent) {
      groups.push([a])
    } else {
      const g = groups.find(grp => grp[0].uid === a.parent)
      if (g) g.push(a)
    }
  }

  // Raggruppa per categoria · produttore · descrizione
  const catGroups: { key: string; label: string; groups: ArticoloCarrelloAcquisti[][] }[] = []
  for (const group of groups) {
    const root = group[0]
    if (root.tipo === 'caratteristica') continue
    const key = `${root.categoria}||${root.produttore}||${root.descrizione}`
    let cg = catGroups.find(c => c.key === key)
    if (!cg) {
      cg = { key, label: [root.categoria, root.produttore, root.descrizione].filter(Boolean).join(' · '), groups: [] }
      catGroups.push(cg)
    }
    cg.groups.push(group)
  }

  const renderModal = () => {
    if (!modal) return null
    const onClose = () => { setModal(null); setEditError('') }

    if (modal.type === 'lacuna') {
      const { target, lacuna } = modal
      const lacunaFlag = lacuna === 'tipo_colore' ? 'richiede_tipo_colore' : lacuna === 'tipo_colore_acc' ? 'richiede_tipo_colore_acc' : lacuna === 'tipo_vetro' ? 'richiede_tipo_vetro' : 'richiede_tipo_montaggio'
      const disponibili = caratteristiche.filter(c => c[lacunaFlag as keyof CaratteristicaListino] === 1 && c.categoria === target.categoria)
      const filtrate = lacunaFilter.trim()
        ? disponibili.filter(c => {
            const q = lacunaFilter.toLowerCase()
            return c.descrizione.toLowerCase().includes(q) || c.produttore.toLowerCase().includes(q) || c.categoria.toLowerCase().includes(q)
          })
        : disponibili
      const altriConLacuna = articoli
        .filter(a => !a.parent && a.tipo !== 'caratteristica' && a.uid !== target.uid)
        .filter(a => (a[lacunaFlag as keyof ArticoloCarrelloAcquisti] as number) === 1)
        .filter(a => getLacuneAperte(a).includes(lacuna))
        .filter(a => a.categoria === target.categoria)
      const hasAltri = altriConLacuna.length > 0

      return (
        <div onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', maxWidth: 520, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>Aggiungi caratteristica</h3>
            <p style={{ fontSize: 14, color: '#1a1a1a', margin: '0 0 18px' }}>
              Articolo: <strong>{target.produttore ? `${target.produttore} — ` : ''}{target.descrizione}</strong>
            </p>
            <div style={fieldS}>
              <label style={lblS}>Scegli la caratteristica da applicare</label>
              <input type="text" placeholder="Cerca per descrizione, produttore…"
                style={{ ...inpS, marginBottom: 8 }}
                value={lacunaFilter}
                onChange={e => { setLacunaFilter(e.target.value); setLacunaSelected(null) }}
              />
              <div style={{ border: '1px solid #ddd', borderRadius: 6, maxHeight: 260, overflowY: 'auto' }}>
                {filtrate.length === 0 ? (
                  <p style={{ fontSize: 14, color: '#1a1a1a', margin: 0, padding: '12px 14px' }}>Nessun risultato.</p>
                ) : filtrate.map((c, i) => {
                  const isSel = lacunaSelected === c.id
                  const magg = c.sconto_articolo < 0 ? Math.abs(c.sconto_articolo) : null
                  return (
                    <div key={c.id} onClick={() => setLacunaSelected(c.id)}
                      style={{ padding: '10px 14px', borderBottom: i < filtrate.length - 1 ? '1px solid #ececec' : 'none', cursor: 'pointer', background: isSel ? '#e8f4e8' : '#fff', minHeight: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center', userSelect: 'none' }}>
                      <span style={{ fontSize: 14, fontWeight: isSel ? 700 : 400, color: '#1a1a1a', lineHeight: 1.4 }}>
                        {c.produttore ? `${c.produttore} · ` : ''}{c.descrizione}
                        {magg && <span style={{ color: '#b45000', fontWeight: 600 }}> (Magg. del {magg}%)</span>}
                        {c.prezzo_vendita > 0 && <span style={{ color: '#555' }}> — € {fmt(Number(c.prezzo_vendita))}/{c.unita}</span>}
                      </span>
                      {c.categoria && <span style={{ fontSize: 14, color: '#1a1a1a', marginTop: 2 }}>{c.categoria}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8, alignItems: 'center' }}>
              <button type="button" onClick={() => handleApplicaCaratteristica(false)} disabled={!lacunaSelected || actPending}
                className={(!lacunaSelected || actPending) ? 'btn-gray' : 'btn-green'}
                style={{ height: 42, padding: '0 18px', borderRadius: 21, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                {actPending ? '…' : 'Applica'}
              </button>
              {hasAltri && (
                <button type="button" onClick={() => handleApplicaCaratteristica(true)} disabled={!lacunaSelected || actPending}
                  className={(!lacunaSelected || actPending) ? 'btn-gray' : 'btn-green'}
                  style={{ height: 42, padding: '0 16px', borderRadius: 21, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  {actPending ? '…' : 'Applica a tutti'}
                </button>
              )}
              <button type="button" onClick={onClose} className="btn-orange"
                style={{ height: 42, padding: '0 18px', borderRadius: 21, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                Annulla
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Edit / Duplica modal
    const isEdit    = modal.type === 'edit'
    const isDuplica = modal.type === 'duplica'
    const ref       = isEdit ? modal.item : modal.lastItem
    const vals      = isEdit ? editVals : duplicaVals
    const setVals   = isEdit
      ? (u: Partial<EditVals>) => setEditVals(p => ({ ...p, ...u }))
      : (u: Partial<EditVals>) => setDuplicaVals(p => ({ ...p, ...u }))
    const onSave    = isEdit ? handleEditSave : handleDuplica
    const title     = isEdit ? 'Modifica articolo' : 'Aggiungi articolo dello stesso tipo'
    const saveLabel = isEdit ? 'Salva' : 'Aggiungi'

    return (
      <div onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div onClick={e => e.stopPropagation()}
          style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', maxWidth: 460, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>{title}</h3>
          {isDuplica && (
            <p style={{ fontSize: 14, color: '#1a1a1a', margin: '0 0 14px' }}>
              Tipo: <strong>{ref.produttore ? `${ref.produttore} — ` : ''}{ref.descrizione}</strong>
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div style={{ ...fieldS, gridColumn: '1 / -1' }}>
              <label style={lblS}>Quantità</label>
              <input type="number" min={1} style={inpS}
                value={vals.q}
                onChange={e => setVals({ q: Math.max(1, parseInt(e.target.value) || 1) })} />
            </div>
            {(ref.unita === 'm²' || ref.unita === 'mq' || ref.unita === 'm2') && (
              <>
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
              </>
            )}
            {(ref.unita === 'ml' || ref.unita === 'm' || ref.unita === 'mt') && (
              <div style={{ ...fieldS, gridColumn: '1 / -1' }}>
                <label style={lblS}>Lunghezza (cm)</label>
                <input type="number" min={0} step="0.1" style={inpS}
                  value={vals.l || ''}
                  onChange={e => setVals({ l: parseFloat(e.target.value) || 0 })} />
              </div>
            )}
          </div>
          {editError && (
            <p style={{ fontSize: 14, color: '#c0392b', margin: '0 0 8px', fontFamily: 'monospace' }}>{editError}</p>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose}
              style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', color: '#1a1a1a', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
              Annulla
            </button>
            <button type="button" onClick={onSave} disabled={actPending}
              style={{
                padding: '8px 20px', borderRadius: 6, border: 'none', fontSize: 14, fontWeight: 700,
                cursor: actPending ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                background: actPending ? '#aaa' : 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#1b4d1b 0%,#266626 20%,#3a8f3a 45%,#266626 80%,#1b4d1b 100%)',
                boxShadow: actPending ? 'none' : '0 2px 8px rgba(20,80,20,0.45),inset 0 1px 0 rgba(160,255,160,0.2)',
                color: '#d4f5d4',
              }}>
              {actPending ? 'Salvataggio…' : saveLabel}
            </button>
          </div>
        </div>
      </div>
    )
  }

  let globalIdx = 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {renderModal()}

      {/* Preview fullscreen */}
      {previewItem && (
        <div onClick={() => setPreviewItem(null)} onTouchStart={() => setPreviewItem(null)}
          style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {previewItem.abbr ? (
              <PreviewInfisso
                larghezza_cm={previewItem.larghezza_cm ?? 100}
                altezza_cm={previewItem.altezza_cm ?? 150}
                colore={previewItem.colore ?? 'Bianco'}
                descrizione={previewItem.descrizione}
                tipo_prodotto={previewItem.categoria}
                n_ante={previewItem.ante ?? 1}
                abbr={previewItem.abbr}
                profilo_mm={previewItem.profilo_mm}
                bar_color={previewItem.bar_color ?? undefined}
                bar_color_acc={previewItem.bar_color_acc ?? undefined}
                maxHeight="100vh"
              />
            ) : previewItem.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewItem.foto_url.startsWith('/') ? previewItem.foto_url : `/${previewItem.foto_url}`}
                alt={previewItem.descrizione}
                style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain', display: 'block' }}
              />
            ) : null}
          </div>
          <p style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', margin: 0, fontSize: 14, color: '#bbb', fontStyle: 'italic', pointerEvents: 'none' }}>
            {isTouch ? 'Tocca per chiudere' : 'Clicca per chiudere'}
          </p>
        </div>
      )}

      {/* Bottoni aggiunta articoli */}
      <div style={{ background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)', border: '1px solid #222', borderRadius: 10, padding: 12 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href={cataloghiHref} className="btn-green" style={{
            flex: 1, minWidth: 140, padding: '0 8px', fontSize: 14,
          }}>
            + Aggiungi articolo
          </a>
          {lastTopLevel && (
            <button type="button" onClick={openDuplica} disabled={actPending}
              className={actPending ? 'btn-gray' : 'btn-green'}
              style={{
                flex: 1, minWidth: 140, padding: '0 8px', fontSize: 14,
              }}>
              + Ripeti articolo
            </button>
          )}
        </div>
      </div>

      {/* Tabella */}
      <div className="carrello-overflow" style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          {catGroups.map(cg => {
            const groupComplete = cg.groups.every(grp => getLacuneAperte(grp[0]).length === 0)
            const groupBg = groupComplete ? VERDE : ROSA
            return (
            <div key={cg.key} style={{ background: groupBg, border: '1px solid #222', borderRadius: 8, overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
              {/* Label gruppo */}
              <div style={{ padding: '6px 14px', background: VERDE, borderBottom: '1px solid #222', fontSize: 12, fontWeight: 700, color: '#1a1a1a', fontFamily: 'monospace' }}>
                {cg.label}
              </div>
              <table className="carrello-table" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: 58 }} />
                  <col style={{ width: 52 }} />
                  <col />
                  <col style={{ width: 84 }} />
                  <col style={{ width: 58 }} />
                </colgroup>
                <thead>
                  <tr style={{ background: VERDE }}>
                    <th style={{ ...thS, textAlign: 'center', width: 58 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
                      </div>
                    </th>
                    <th style={{ ...thS, textAlign: 'center', width: 52 }}>Q.tà<br/>Rif.</th>
                    <th style={{ ...thS }}>Articolo</th>
                    <th style={{ ...thS, textAlign: 'center', width: 84, textTransform: 'none', letterSpacing: 0 }}>Prezzo €</th>
                    <th style={{ ...thS, textAlign: 'center', padding: '8px 0', width: 58 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <span style={{ fontSize: 14, display: 'inline-block', transform: 'rotate(135deg)', lineHeight: 1 }}>✏</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                {cg.groups.map((group, groupIdx) => {
                  globalIdx++
                  const gi = globalIdx - 1
                  const root = group[0]
                  const children = group.slice(1)
                  const childrenOfRoot = articoli.filter(x => x.parent === root.uid)
                  const showColore    = root.richiede_tipo_colore     === 1 && !childrenOfRoot.some(c => c.richiede_tipo_colore     === 1)
                  const showColoreAcc = root.richiede_tipo_colore_acc === 1 && !childrenOfRoot.some(c => c.richiede_tipo_colore_acc === 1)
                  const showVetro     = root.richiede_tipo_vetro      === 1 && !childrenOfRoot.some(c => c.richiede_tipo_vetro      === 1)
                  const showMontaggio = root.richiede_tipo_montaggio  === 1 && !childrenOfRoot.some(c => c.richiede_tipo_montaggio  === 1)
                  const hasLacune   = showColore || showColoreAcc || showVetro || showMontaggio
                  const hasDetails  = children.length > 0 || hasLacune
                  const isExpanded  = expandedUID === root.uid
                  const expandBg     = isExpanded ? (hasLacune ? '#fdecea' : '#d6ecd6') : undefined
                  const expandBgRoot = isExpanded ? (hasLacune ? '#f5b8b4' : '#b8d9b8') : undefined
                  const canEdit     = hasEditableFields(root)
                  const rootPrezzo  = calcolaPrezzo(root)
                  const totGruppo   = rootPrezzo + children.reduce((s, c) => s + calcolaPrezzo(c), 0)

                  return (
                    <React.Fragment key={root.index}>
                      {/* Riga articolo principale */}
                      <tr style={{ background: hasLacune ? ROSA : VERDE, borderTop: groupIdx > 0 ? '1px solid #333' : undefined }}>
                        <td style={{ ...tdS, textAlign: 'center', padding: '4px 0' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            {(root.abbr || root.foto_url) && (
                              <button type="button" onClick={() => setPreviewItem(root)} className="btn-black" title="Anteprima articolo"
                                style={{ width: 42, height: 42, padding: 0, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                <svg style={{ position: 'relative', zIndex: 1 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              </button>
                            )}
                            {hasDetails && (
                              <button type="button" onClick={() => toggleExpand(root.uid)}
                                className={hasLacune ? 'btn-red' : 'btn-black'}
                                style={{ width: 42, height: 42, padding: 0, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', gap: 2 }}>
                                <svg style={{ position: 'relative', zIndex: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
                                <span style={{ position: 'relative', zIndex: 1, fontSize: 14 }}>{isExpanded ? '▴' : '▾'}</span>
                              </button>
                            )}
                          </div>
                        </td>
                        <td style={{ ...tdS, padding: 0, height: 1 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #222', fontSize: 12, color: '#1a1a1a', padding: '0 4px' }}>
                              N°&nbsp;{root.quantita}
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#1a1a1a', padding: '0 4px' }}>
                              rif #{String(gi + 1).padStart(3, '0')}
                            </div>
                          </div>
                        </td>
                        <td style={{ ...tdS, paddingLeft: 8 }}>
                          {root.descrizione}
                          {(() => {
                            const parts: string[] = []
                            if (root.produttore) parts.push(root.produttore)
                            if (root.categoria)  parts.push(root.categoria)
                            if (root.ante && root.ante > 1) parts.push(`${root.ante} ante`)
                            if (root.larghezza_cm) parts.push(`L:${root.larghezza_cm}`)
                            if (root.altezza_cm)   parts.push(`H:${root.altezza_cm}`)
                            if (root.colore)       parts.push(root.colore)
                            if (root.prezzo_vendita > 0) parts.push(`€${fmt(Number(root.prezzo_vendita))}/${root.unita}`)
                            return <div style={{ fontSize: 12, color: '#1a1a1a', marginTop: 1 }}>{parts.join(' · ')}</div>
                          })()}
                          {root.note && <div style={{ fontSize: 12, color: '#1a1a1a', marginTop: 1, fontStyle: 'italic' }}>{root.note}</div>}
                        </td>
                        <td style={{ ...tdS, whiteSpace: 'nowrap', padding: '2px 0 2px 4px' }}>
                          {renderPrezzo(isExpanded ? rootPrezzo : totGruppo)}
                        </td>
                        <td style={{ ...tdS, padding: '4px 0', textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <button type="button" onClick={() => canEdit && openEdit(root)}
                              disabled={!canEdit || actPending}
                              className={!canEdit ? 'btn-gray' : 'btn-black'}
                              style={{ width: 42, height: 42, padding: 0, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', opacity: !canEdit ? 0.4 : 1 }}>
                              <span style={{ position: 'relative', zIndex: 1, fontSize: 14, display: 'inline-block', transform: 'rotate(135deg)' }}>✏</span>
                            </button>
                            <button type="button" onClick={() => handleRimuovi(root.index)} disabled={delPending} className="btn-red"
                              style={{ width: 42, height: 42, padding: 0, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                              <span style={{ position: 'relative', zIndex: 1, fontSize: 14 }}>✕</span>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Righe caratteristiche figlie */}
                      {isExpanded && children.map(child => (
                        <tr key={child.index} style={{ background: '#ffffff' }}>
                          <td style={{ ...tdS, padding: 4, textAlign: 'center' }}>
                            {child.foto_url && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={child.foto_url.startsWith('/') ? child.foto_url : `/${child.foto_url}`}
                                alt=""
                                style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 4, display: 'block', margin: '0 auto' }}
                              />
                            )}
                          </td>
                          <td style={{ ...tdS, textAlign: 'center', whiteSpace: 'nowrap', padding: '2px 4px' }}>
                            {child.richiede_tipo_colore     === 1 ? 'Colore'
                            : child.richiede_tipo_colore_acc === 1 ? 'Accessori'
                            : child.richiede_tipo_vetro      === 1 ? 'Vetro'
                            : child.richiede_tipo_montaggio  === 1 ? 'Montaggio'
                            : ''}
                          </td>
                          <td style={{ ...tdS, paddingLeft: 8 }}>
                            {child.descrizione}
                            {(() => {
                              const parts: string[] = []
                              if (child.larghezza_cm) parts.push(`L:${child.larghezza_cm}`)
                              if (child.altezza_cm)   parts.push(`H:${child.altezza_cm}`)
                              if (child.colore)       parts.push(child.colore)
                              if (child.prezzo_vendita > 0) parts.push(`€${fmt(Number(child.prezzo_vendita))}/${child.unita}`)
                              return parts.length > 0 ? <div style={{ fontSize: 12, color: '#1a1a1a', marginTop: 1 }}>{parts.join(' · ')}</div> : null
                            })()}
                            {child.note && <div style={{ fontSize: 12, color: '#1a1a1a', marginTop: 1, fontStyle: 'italic' }}>{child.note}</div>}
                          </td>
                          <td style={{ ...tdS, whiteSpace: 'nowrap', padding: '2px 0 2px 4px' }}>
                            {renderPrezzo(calcolaPrezzo(child))}
                          </td>
                          <td style={{ ...tdS, padding: '4px 0', textAlign: 'center' }}>
                            <button type="button" onClick={() => handleRimuovi(child.index)} disabled={delPending} className="btn-red"
                              style={{ width: 42, height: 42, padding: 0, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                              <span style={{ position: 'relative', zIndex: 1, fontSize: 14 }}>✕</span>
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* Riga bottoni lacune */}
                      {isExpanded && hasLacune && (() => {
                        const lacuneCount = [showColore, showColoreAcc, showVetro, showMontaggio].filter(Boolean).length
                        const cols = lacuneCount <= 3 ? lacuneCount : 2
                        return (
                          <tr style={{ background: '#ffffff' }}>
                            <td colSpan={5} style={{ padding: 8, borderBottom: '1px solid #333', background: '#ffffff' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
                                {showColore && (
                                  <button type="button" onClick={() => handleAggiungiLacuna(root, 'tipo_colore')}
                                    style={{ height: 42, padding: '0 8px', fontSize: 14, fontWeight: 700, fontFamily: 'monospace', whiteSpace: 'nowrap', borderRadius: 21, border: '1px solid #000', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>
                                    + Colore
                                  </button>
                                )}
                                {showColoreAcc && (
                                  <button type="button" onClick={() => handleAggiungiLacuna(root, 'tipo_colore_acc')}
                                    style={{ height: 42, padding: '0 8px', fontSize: 14, fontWeight: 700, fontFamily: 'monospace', whiteSpace: 'nowrap', borderRadius: 21, border: '1px solid #000', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>
                                    + Accessori
                                  </button>
                                )}
                                {showVetro && (
                                  <button type="button" onClick={() => handleAggiungiLacuna(root, 'tipo_vetro')}
                                    style={{ height: 42, padding: '0 8px', fontSize: 14, fontWeight: 700, fontFamily: 'monospace', whiteSpace: 'nowrap', borderRadius: 21, border: '1px solid #000', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>
                                    + Vetro
                                  </button>
                                )}
                                {showMontaggio && (
                                  <button type="button" onClick={() => handleAggiungiLacuna(root, 'tipo_montaggio')}
                                    style={{ height: 42, padding: '0 8px', fontSize: 14, fontWeight: 700, fontFamily: 'monospace', whiteSpace: 'nowrap', borderRadius: 21, border: '1px solid #000', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>
                                    + Montaggio
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })()}
                    </React.Fragment>
                  )
                })}
                </tbody>
              </table>
            </div>
          )})}

          {/* Totale */}
          <div style={{ background: VERDE, border: '1px solid #222', borderRadius: 8, padding: '12px 58px 12px 20px', display: 'flex', flexDirection: 'column', gap: 4, color: '#1a1a1a' }}>
            {(() => {
              const hasScontiPromo = isLoggedIn && scontiPromo >= 0.01
              const hasScontoCliente = isLoggedIn && scontoCliAmt >= 0.01
              function row(label: string, val: string, opts?: { color?: string; separator?: boolean }) {
                return (
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', ...(opts?.separator ? { borderTop: '1px solid #333', paddingTop: 6, marginTop: 2 } : {}) }}>
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: opts?.color ?? '#1a1a1a', fontFamily: 'monospace' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: opts?.color ?? '#1a1a1a', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{val}</span>
                  </div>
                )
              }
              return (
                <>
                  {isLoggedIn && row('Listino (escluso IVA):', `€ ${fmt(lordo)}`)}
                  {hasScontiPromo && row('Sconti promozionali:', `− € ${fmt(scontiPromo)}`, { color: '#e65100' })}
                  {hasScontiPromo && row('Subtotale:', `€ ${fmt(subtotale)}`)}
                  {hasScontoCliente && row(
                    scontoClientePct === 5 ? 'Sconto di benvenuto (5%):' : `Sconto riservato al cliente (${scontoClientePct}%):`,
                    `− € ${fmt(scontoCliAmt)}`,
                    { color: '#e65100' }
                  )}
                  {row('Totale (escluso IVA):', `€ ${fmt(totaleFinale)}`, { separator: isLoggedIn })}
                </>
              )
            })()}
          </div>
        </div>
      </div>

      {articoli.some(a => a.unita === 'mq' || a.unita === 'ml') && (
        <p style={{ fontSize: 14, color: '#1a1a1a', margin: 0, fontFamily: 'monospace' }}>
          * Per articoli a m² o m lin. il subtotale è calcolato sul prezzo unitario di listino. Il prezzo finale dipenderà dalle dimensioni effettive.
        </p>
      )}

      {/* Barra azioni */}
      <div style={{ background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)', border: '1px solid #222', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {hasLacuneAperte && (
          <p style={{ fontSize: 14, color: '#c0392b', margin: 0, fontFamily: 'monospace', fontWeight: 600 }}>
            Completa le caratteristiche mancanti (articoli in rosso) prima di procedere al pagamento.
          </p>
        )}
        {isLoggedIn && !hasLacuneAperte && (
          <p style={{ fontSize: 14, color: '#1a1a1a', margin: 0, fontFamily: 'monospace' }}>
            Pagamenti sicuri gestiti da Stripe. I tuoi dati di pagamento non vengono mai memorizzati sul nostro sito.
          </p>
        )}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div ref={loginPanelRef} style={{ flex: 1, minWidth: 140, position: 'relative' }}>
            <button
              type="button"
              disabled={hasLacuneAperte}
              onClick={hasLacuneAperte ? undefined : isLoggedIn
                ? () => router.push(pagamentoHref)
                : toggleLoginPanel
              }
              className={hasLacuneAperte ? 'btn-gray' : showLoginPanel ? 'btn-orange' : 'btn-green'}
              style={{ width: '100%', height: 42, padding: '0 8px', fontSize: 14, fontWeight: 700, borderRadius: 21, whiteSpace: 'nowrap', fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {!isLoggedIn && showLoginPanel ? 'Chiudi ▴' : 'Paga ora'}
            </button>
            {!isLoggedIn && showLoginPanel && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 200,
                background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6,
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 210,
              }}>
                <DropdownLoginForm
                  registrazioniDisabilitate={registrazioniDisabilitate}
                  redirectTo={pagamentoHref}
                />
              </div>
            )}
          </div>
          <a href={stampaHref} className="btn-black"
            style={{ flex: 1, minWidth: 140, height: 42, padding: '0 8px', fontSize: 14, fontWeight: 700, borderRadius: 21, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
            Stampa memo
          </a>
          <button type="button" onClick={handleSvuota} disabled={clearPending}
            className={clearPending ? 'btn-gray' : 'btn-red'}
            style={{ flex: 1, minWidth: 140, height: 42, padding: '0 8px', fontSize: 14, fontWeight: 700, borderRadius: 21, whiteSpace: 'nowrap', fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {clearPending ? 'Svuotamento…' : 'Svuota carrello'}
          </button>
        </div>
      </div>

      {!isLoggedIn && (
        <div style={{ background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)', border: '1px solid #222', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, flexShrink: 0, marginTop: 2 }}><path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/></svg>
            <p style={{ margin: 0, fontSize: 14, color: '#1a1a1a', fontFamily: 'monospace', lineHeight: 1.5 }}>
              Per procedere all&apos;acquisto è necessario essere un utente registrato.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div ref={accediPanelRef} style={{ flex: 1, minWidth: 140, position: 'relative' }}>
              <button type="button"
                onClick={() => setShowAccediPanel(v => !v)}
                className={showAccediPanel ? 'btn-orange' : 'btn-black'}
                style={{ width: '100%', height: 42, padding: '0 8px', fontSize: 14, fontWeight: 700, borderRadius: 21, whiteSpace: 'nowrap', fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {showAccediPanel ? 'Chiudi ▴' : 'Accedi ▾'}
              </button>
              {showAccediPanel && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 200,
                  background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 210,
                }}>
                  <DropdownLoginForm
                    registrazioniDisabilitate={registrazioniDisabilitate}
                    redirectTo={loginRedirectHref}
                  />
                </div>
              )}
            </div>
            <a href="/registrazione" className="btn-black"
              style={{ flex: 1, minWidth: 140, height: 42, padding: '0 8px', fontSize: 14, fontWeight: 700, borderRadius: 21, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
              Registrati
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
