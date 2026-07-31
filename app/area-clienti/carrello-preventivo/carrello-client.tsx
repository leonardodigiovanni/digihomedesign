'use client'

import React, { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PreviewInfisso from '@/components/preview-infisso'
import { b } from '@/lib/btn'
import {
  rimuoviDaCarrello, salvaCarrelloComePreventivo, svuotaCarrello,
  aggiornaArticoloCarrello, aggiungiArticoloAlCarrello,
  applicaCaratteristicaAlCarrello, fetchCaratteristicheOpt,
  pulisciCarrelloOrfani,
  type OptCarItem,
} from '@/app/brand/cataloghi/actions'
import { DropdownLoginForm } from '@/components/header-auth'
import SelectLookup from '@/components/select-lookup'
import AggiungiArticoloForm, { type ArticoloListino, type ConfirmData as AggConfirmData } from '@/components/aggiungi-articolo-form'
import { matchesPercorsi, type PercorsoEntry } from '@/lib/percorsi-match'

export type ListinoItem = {
  id: number
  categoria: string
  produttore: string
  serie?: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  sconto_articolo?: number
  principale?: number
  caratteristica?: number
  richiede_larghezza?: number
  richiede_altezza?: number
  richiede_tipo_colore?: number
  richiede_tipo_colore_acc?: number
  richiede_tipo_vetro?: number
  richiede_tipo_montaggio?: number
  minimo?: number | null
  filtro_1?: number
  filtro_2?: number
  filtro_3?: number
  filtro_4?: number
  filtro_5?: number
  filtro_6?: number
  filtro_7?: number
  filtro_8?: number
  filtro_9?: number
  filtro_10?: number
  schema_url?: string | null
  logo_url?: string | null
  sottocategoria?: string | null
  fase?: string | null
  materiale?: string | null
  tipologia?: string | null
  ambiente?: string | null
  fascia?: string | null
}

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
  foto_url?: string | null
  escluso?: number
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
  richiede_tipo_colore_acc?: number
  richiede_tipo_vetro?: number
  richiede_tipo_montaggio?: number
  serie?: string
  minimo?: number | null
  abbr?: string
  profilo_mm?: number
  foto_url?: string | null
  escluso?: number
  bar_color?: string | null
  bar_color_acc?: string | null
}


type ModalState =
  | null
  | { type: 'edit'; item: ArticoloCarrello }
  | { type: 'duplica'; lastItem: ArticoloCarrello }
  | { type: 'lacuna'; target: ArticoloCarrello; lacuna: string }
  | { type: 'opt_car'; target: ArticoloCarrello }
  | { type: 'aggiungi' }

type EditVals = { q: number; ante: number; l: number; h: number; colore: string; note: string; desc: string }

function LoginBanner({ hasLacune, cataloghiHref = '/cataloghi', isApp }: { hasLacune: boolean; cataloghiHref?: string; isApp?: boolean }) {
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
    <div className="sfondo-riquadri-app" style={{ border: '1px solid #222', borderRadius: 10, padding: 12 }}>
      <p style={{ fontSize: 14, color: '#1a1a1a', margin: '0 0 14px', lineHeight: 1.6, textAlign: 'justify' }}>
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, flexShrink: 0 }}><path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/></svg>I clienti registrati ricevono sempre degli sconti. Accedi o registrati, salva il carrello come preventivo e scopri il prezzo finale con i tuoi sconti.
      </p>
      <div className={isApp ? undefined : 'btn-grid-4'} style={isApp ? { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, maxWidth: 360, margin: '0 auto' } : undefined}>
        <div ref={ref} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(v => !v)}
            className={open ? b('btn-orange', isApp) : b('btn-black', isApp)}
            style={{ width: '100%', padding: '0 8px', fontSize: 14 }}
          >
            {open ? 'Chiudi ▴' : 'Accedi ▾'}
          </button>
          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0,
              background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)', border: '1px solid #222', borderRadius: 6,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 210, zIndex: 200,
            }}>
              <DropdownLoginForm isApp={isApp} />
            </div>
          )}
        </div>
        <a href={isApp ? '/app/registrazione' : '/registrazione'} className={b('btn-black', isApp)} style={{
          padding: '0 8px', fontSize: 14,
        }}>Registrati →</a>
        {!isApp && <a href={cataloghiHref} className="btn-black" style={{
          padding: '0 8px', fontSize: 14,
        }}>Vai ai cataloghi →</a>}
        {!isApp && <a href="/aiuto/guida-preventivo" className="btn-black" style={{
          padding: '0 8px', fontSize: 14,
        }}>Vai alla guida →</a>}
      </div>
    </div>
  )
}

export default function CarrelloClient({
  articoli,
  isLoggedIn,
  scontoClientePct = 0,
  caratteristiche = [],
  listini = [],
  percorsiPerListino = {},
  cataloghiHref = '/cataloghi',
  stampaHref = '/area-clienti/carrello-preventivo/stampa',
  postSaveHref,
  isApp,
  filtriLabels,
  hasOrfani = false,
}: {
  articoli: ArticoloCarrello[]
  isLoggedIn: boolean
  scontoClientePct?: number
  caratteristiche?: CaratteristicaListino[]
  listini?: ListinoItem[]
  percorsiPerListino?: Record<number, PercorsoEntry[]>
  cataloghiHref?: string
  stampaHref?: string
  postSaveHref?: string
  isApp?: boolean
  filtriLabels?: Record<number, string>
  hasOrfani?: boolean
}) {
  const router = useRouter()

  // Righe cookie non più risolvibili (articolo cancellato dal listino): ripulisce
  // il cookie una volta sola così il badge nella nav torna a coincidere col visibile.
  useEffect(() => {
    if (hasOrfani) pulisciCarrelloOrfani().then(() => router.refresh())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOrfani])
  const [delPending,    startDel]    = useTransition()
  const [savePending,   startSave]   = useTransition()
  const [clearPending,  startClear]  = useTransition()
  const [actPending,    startAct]    = useTransition()
  const [optCarPending, startOptCar] = useTransition()
  const [optCarOpzioni, setOptCarOpzioni] = useState<OptCarItem[]>([])
  const [optCarNote,    setOptCarNote]    = useState('')
  const [saveError, setSaveError] = useState('')
  const [editError, setEditError] = useState('')
  const [modal, setModal]         = useState<ModalState>(null)
  const [editVals, setEditVals]   = useState<EditVals>({ q: 1, ante: 1, l: 0, h: 0, colore: '', note: '', desc: '' })
  const [duplicaVals, setDuplicaVals] = useState<Omit<EditVals, 'desc'>>({ q: 1, ante: 1, l: 0, h: 0, colore: '', note: '' })
  const [lacunaFilter, setLacunaFilter]     = useState('')
  const [lacunaSelected, setLacunaSelected] = useState<number | null>(null)
  const [caratteristicaVista, setCaratteristicaVista] = useState<'elenco' | 'immagini'>('elenco')
  const [previewArt, setPreviewArt] = useState<ArticoloCarrello | null>(null)
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => { setIsTouch(window.matchMedia('(pointer: coarse)').matches) }, [])
  const [expandedUID, setExpandedUID] = useState<number | null>(null)

  function openAggiungi() {
    setModal({ type: 'aggiungi' })
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  function fmt(n: number): string {
    const [int, dec] = n.toFixed(2).split('.')
    return int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec
  }

  function renderPrezzo(value: number) {
    const s = fmt(value)
    const idx = s.lastIndexOf(',')
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 12 }}>
        <span style={{ flex: 1, textAlign: 'right' }}>{s.slice(0, idx)}</span>
        <span>{s.slice(idx)}</span>
      </div>
    )
  }

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
    if (a.unita === 'm²') {
      const mqPerPezzo = a.parent == null ? Math.max(h * l, a.minimo ?? 0) : h * l
      return Math.round(pb * mqPerPezzo * q * costante * 100) / 100
    }
    if (a.unita === 'ml') {
      const mlPerPezzo = a.parent == null ? Math.max(l, a.minimo ?? 0) : l
      return Math.round(pb * mlPerPezzo * q * costante * 100) / 100
    }
    return Math.round(pb * q * 100) / 100
  }

  const totale = articoli.reduce((s, a) => s + calcolaPrezzo(a, articoli), 0)
  const totaleQuantita = articoli.filter(a => !a.parent && a.tipo !== 'caratteristica').reduce((s, a) => s + (Number(a.quantita) || 0), 0)

  const lastTopLevel = [...articoli].reverse().find(a => !a.parent && a.tipo !== 'caratteristica')

  const hasLacuneAperte = articoli.some(a => !a.parent && a.tipo !== 'caratteristica' && getLacuneAperte(a).length > 0)
  const hasDaDefinire = articoli.some(a => !a.parent && a.tipo !== 'caratteristica' && calcolaPrezzo(a, articoli) === 0 && (a.sconto_articolo ?? 0) !== 100)

  // Aggiorna solo il badge navbar (colore verde/arancione in base a lacune aperte)
  useEffect(() => {
    try {
      localStorage.setItem('preventivo_completo', hasLacuneAperte ? '0' : '1')
      window.dispatchEvent(new CustomEvent('preventivo-completo-changed', { detail: { completo: !hasLacuneAperte } }))
    } catch {}
  }, [hasLacuneAperte])

  // ── modal openers ──────────────────────────────────────────────────────────

  function openEdit(item: ArticoloCarrello) {
    setEditError('')
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
    if (a.richiede_tipo_colore     === 1 && !children.some(c => c.richiede_tipo_colore     === 1)) lacune.push('tipo_colore')
    if (a.richiede_tipo_colore_acc === 1 && !children.some(c => c.richiede_tipo_colore_acc === 1)) lacune.push('tipo_colore_acc')
    if (a.richiede_tipo_vetro      === 1 && !children.some(c => c.richiede_tipo_vetro      === 1)) lacune.push('tipo_vetro')
    if (a.richiede_tipo_montaggio  === 1 && !children.some(c => c.richiede_tipo_montaggio  === 1)) lacune.push('tipo_montaggio')
    return lacune
  }

  function handleAggiungiComeFiglio(root: ArticoloCarrello) {
    startOptCar(async () => {
      const opzioni = await fetchCaratteristicheOpt(percorsiPerListino[root.listino_id] ?? [], root.produttore)
      setOptCarOpzioni(opzioni)
      setLacunaFilter('')
      setLacunaSelected(null)
      setOptCarNote('')
      setModal({ type: 'opt_car', target: root })
    })
  }

  function handleApplicaOptCar() {
    if (modal?.type !== 'opt_car') return
    if (!lacunaSelected) return
    const { target } = modal
    const selectedId = lacunaSelected
    const nota = optCarNote.trim() || undefined
    startAct(async () => {
      const result = await applicaCaratteristicaAlCarrello([target.uid], selectedId, nota)
      if (result.ok && result.newCart) {
        document.cookie = `digi_cart=${result.newCart}; max-age=${30 * 24 * 60 * 60}; path=/; samesite=lax`
      }
      setModal(null)
      router.refresh()
    })
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
    if (!confirm('Rimuovere l\'articolo dal carrello?')) return
    startDel(async () => { await rimuoviDaCarrello(index); router.refresh() })
  }

  function handleGeneraPDF() {
    if (hasLacuneAperte) return
    window.location.href = stampaHref
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
      router.push(postSaveHref ?? res.redirectUrl)
    })
  }

  function handleEditSave() {
    if (modal?.type !== 'edit') return
    const item = modal.item
    setEditError('')
    startAct(async () => {
      let res
      if (item.tipo === 'caratteristica') {
        res = await aggiornaArticoloCarrello(item.index, { desc: editVals.desc, note: editVals.note || undefined })
      } else {
        res = await aggiornaArticoloCarrello(item.index, {
          q:      editVals.q,
          ante:   editVals.ante || undefined,
          l:      editVals.l   || undefined,
          h:      editVals.h   || undefined,
          colore: editVals.colore || undefined,
          note:   editVals.note   || undefined,
        })
      }
      if (!res.ok) { setEditError(res.error); return }
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
      const lacunaFlag = lacuna === 'tipo_colore' ? 'richiede_tipo_colore' : lacuna === 'tipo_colore_acc' ? 'richiede_tipo_colore_acc' : lacuna === 'tipo_vetro' ? 'richiede_tipo_vetro' : 'richiede_tipo_montaggio'
      uids = articoli
        .filter(a => !a.parent && a.tipo !== 'caratteristica'
          && (a[lacunaFlag as keyof ArticoloCarrello] as number) === 1
          && matchesPercorsi(a.listino_id, a.categoria, target.listino_id, target.categoria, percorsiPerListino)
          && getLacuneAperte(a).includes(lacuna))
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

  useEffect(() => {
    if (previewArt) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [previewArt])

  function toggleExpand(uid: number) {
    setExpandedUID(prev => prev === uid ? null : uid)
  }


  // ── stili ──────────────────────────────────────────────────────────────────

  const thS: React.CSSProperties = {
    padding: '8px 8px', fontSize: 12, fontWeight: 700, color: '#1a1a1a',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    borderBottom: '1px solid #222', whiteSpace: 'nowrap',
    }
  const tdS: React.CSSProperties = {
    padding: '2px 8px', fontSize: 12, color: '#1a1a1a',
    borderBottom: '1px solid #333', verticalAlign: 'middle',
    overflow: 'hidden', wordBreak: 'break-word',
    }

  const VERDE     = 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)'
  const inpS: React.CSSProperties = {
    width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: 6,
    fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
  }
  const lblS: React.CSSProperties = {
    fontSize: 14, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 4,
  }
  const fieldS: React.CSSProperties = { marginBottom: 12 }

  // ── modal ──────────────────────────────────────────────────────────────────

  const renderModal = () => {
    if (!modal) return null

    const onClose = () => { setModal(null); setEditError('') }

    // ── Modal lacuna ────────────────────────────────────────────────────────────
    if (modal.type === 'lacuna') {
      const { target, lacuna } = modal
      const lacunaFlag = lacuna === 'tipo_colore' ? 'richiede_tipo_colore' : lacuna === 'tipo_colore_acc' ? 'richiede_tipo_colore_acc' : lacuna === 'tipo_vetro' ? 'richiede_tipo_vetro' : 'richiede_tipo_montaggio'
      const disponibili = caratteristiche.filter(c =>
        c[lacunaFlag as keyof CaratteristicaListino] === 1 &&
        matchesPercorsi(c.id, c.categoria, target.listino_id, target.categoria, percorsiPerListino)
      )
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
        .filter(a => matchesPercorsi(a.listino_id, a.categoria, target.listino_id, target.categoria, percorsiPerListino))
      const hasAltri = altriConLacuna.length > 0

      return (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 0, padding: '24px 28px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>Aggiungi caratteristica</h3>
            <p style={{ fontSize: 14, color: '#1a1a1a', margin: '0 0 18px' }}>
              Articolo selezionato: <strong>{target.produttore ? `${target.produttore} — ` : ''}{target.descrizione}</strong>
            </p>

            <div style={fieldS}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                <label style={{ ...lblS, margin: 0 }}>Scegli la caratteristica da applicare</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button type="button" onClick={() => setCaratteristicaVista('elenco')}
                    className={caratteristicaVista === 'elenco' ? b('btn-black', isApp) : b('btn-gray', isApp)}
                    style={{ fontSize: 12, padding: '4px 10px' }}>
                    ☰ Elenco
                  </button>
                  <button type="button" onClick={() => setCaratteristicaVista('immagini')}
                    className={caratteristicaVista === 'immagini' ? b('btn-black', isApp) : b('btn-gray', isApp)}
                    style={{ fontSize: 12, padding: '4px 10px' }}>
                    ▦ Immagini
                  </button>
                </div>
              </div>
              <input
                type="text"
                placeholder="Cerca per descrizione, produttore…"
                style={{ ...inpS, marginBottom: 8 }}
                value={lacunaFilter}
                onChange={e => { setLacunaFilter(e.target.value); setLacunaSelected(null) }}
              />
              {caratteristicaVista === 'elenco' ? (
                <div style={{ border: '1px solid #ddd', borderRadius: 6, maxHeight: 260, overflowY: 'auto' }}>
                  {filtrate.length === 0 ? (
                    <p style={{ fontSize: 14, color: '#1a1a1a', margin: 0, padding: '12px 14px' }}>Nessun risultato.</p>
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
                        <span style={{ fontSize: 14, fontWeight: isSel ? 700 : 400, color: '#1a1a1a', lineHeight: 1.4 }}>
                          {c.produttore ? `${c.produttore} · ` : ''}{c.descrizione}
                          {magg && <span style={{ color: '#b45000', fontWeight: 600 }}> (Magg. del {magg}%)</span>}
                        </span>
                        {c.categoria && <span style={{ fontSize: 14, color: '#1a1a1a', marginTop: 2 }}>{c.categoria}</span>}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ border: '1px solid #ddd', borderRadius: 6, maxHeight: 320, overflowY: 'auto', padding: 10 }}>
                  {filtrate.length === 0 ? (
                    <p style={{ fontSize: 14, color: '#1a1a1a', margin: 0 }}>Nessun risultato.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8 }}>
                      {filtrate.map(c => {
                        const isSel = lacunaSelected === c.id
                        const magg = c.sconto_articolo < 0 ? Math.abs(c.sconto_articolo) : null
                        return (
                          <div
                            key={c.id}
                            onClick={() => setLacunaSelected(c.id)}
                            style={{
                              border: isSel ? '2px solid #266626' : '1px solid #ddd',
                              borderRadius: 6, overflow: 'hidden', cursor: 'pointer', userSelect: 'none',
                              background: isSel ? '#e8f4e8' : '#fff', display: 'flex', flexDirection: 'column',
                            }}
                          >
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {c.foto_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={c.foto_url.startsWith('http') ? c.foto_url : c.foto_url.startsWith('/') ? c.foto_url : `/${c.foto_url}`}
                                  alt={c.descrizione}
                                  style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: c.escluso === 1 ? 0.4 : 1 }}
                                />
                              ) : (
                                <span style={{ fontSize: 10, color: '#bbb', textAlign: 'center', padding: 6 }}>Nessuna foto</span>
                              )}
                              {c.foto_url && c.escluso === 1 && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src="/images/app/escluso.webp" alt="ESCLUSO" style={{ position: 'absolute', top: '-20%', left: '-20%', width: '140%', height: '140%', objectFit: 'contain', pointerEvents: 'none' }} />
                              )}
                            </div>
                            <div style={{ padding: '6px 6px', textAlign: 'center' }}>
                              <span style={{ fontSize: 11, fontWeight: isSel ? 700 : 400, color: '#1a1a1a', lineHeight: 1.3 }}>
                                {c.produttore ? `${c.produttore} · ` : ''}{c.descrizione}
                                {magg && <span style={{ color: '#b45000', fontWeight: 600 }}> (Magg. {magg}%)</span>}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8, alignItems: 'center' }}>
              <button type="button" onClick={onClose} className={b('btn-orange', isApp)}
                style={{ fontSize: 14, paddingLeft: 24, paddingRight: 24 }}>
                Annulla
              </button>
              <button type="button" onClick={() => handleApplicaCaratteristica(false)} disabled={!lacunaSelected || actPending}
                className={(!lacunaSelected || actPending) ? b('btn-gray', isApp) : b('btn-green', isApp)}
                style={{ fontSize: 14, paddingLeft: 24, paddingRight: 24 }}>
                {actPending ? '…' : 'Applica'}
              </button>
              {hasAltri && (
                <button type="button" onClick={() => handleApplicaCaratteristica(true)} disabled={!lacunaSelected || actPending}
                  className={(!lacunaSelected || actPending) ? b('btn-gray', isApp) : b('btn-green', isApp)}
                  style={{ fontSize: 14, paddingLeft: 24, paddingRight: 24 }}>
                  {actPending ? '…' : 'Applica a tutti'}
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }

    // ── Modal opt_car ───────────────────────────────────────────────────────────
    if (modal.type === 'opt_car') {
      const { target } = modal
      return (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 0, padding: '24px 28px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>Aggiungi elemento opzionale</h3>
            <p style={{ fontSize: 14, color: '#1a1a1a', margin: '0 0 18px' }}>
              Articolo selezionato: <strong>{target.produttore ? `${target.produttore} — ` : ''}{target.descrizione}</strong>
            </p>
            <div style={fieldS}>
              <label style={lblS}>Scegli l'elemento da aggiungere</label>
              <SelectLookup
                value={lacunaSelected ? String(lacunaSelected) : ''}
                onChange={v => setLacunaSelected(parseInt(v) || null)}
                placeholder="— Seleziona elemento —"
                options={optCarOpzioni.map(c => {
                  const magg = c.sconto_articolo < 0 ? ` (Magg. del ${Math.abs(c.sconto_articolo)}%)` : ''
                  const prefix = c.produttore ? `${c.produttore} · ` : ''
                  return { value: String(c.id), label: `${prefix}${c.descrizione}${magg}` }
                })}
              />
            </div>
            <div style={fieldS}>
              <label style={lblS}>Note (opzionale)</label>
              <textarea
                value={optCarNote}
                onChange={e => setOptCarNote(e.target.value)}
                rows={3}
                placeholder="Eventuali richieste specifiche…"
                style={{ ...inpS, resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8, alignItems: 'center' }}>
              <button type="button" onClick={onClose} className={b('btn-orange', isApp)}
                style={{ fontSize: 14, paddingLeft: 24, paddingRight: 24 }}>
                Annulla
              </button>
              <button type="button" onClick={handleApplicaOptCar} disabled={!lacunaSelected || actPending}
                className={(!lacunaSelected || actPending) ? b('btn-gray', isApp) : b('btn-green', isApp)}
                style={{ fontSize: 14, paddingLeft: 24, paddingRight: 24 }}>
                {actPending ? '…' : 'Applica'}
              </button>
            </div>
          </div>
        </div>
      )
    }

    // ── Modal aggiungi ─────────────────────────────────────────────────────────
    if (modal.type === 'aggiungi') {
      return (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 0', overflowY: 'auto' }}
        >
          <div
            style={{ width: '100%', maxWidth: 720, padding: '0 16px', boxSizing: 'border-box', marginTop: 'auto', marginBottom: 'auto' }}
          >
            <AggiungiArticoloForm
              articoli={listini as unknown as ArticoloListino[]}
              isLoggedIn={isLoggedIn}
              onConfirm={async (data: AggConfirmData) => {
                const res = await aggiungiArticoloAlCarrello(data.listinoId, {
                  q:      data.quantita ?? 1,
                  l:      data.larghezza,
                  h:      data.altezza,
                  colore: data.colore,
                  note:   data.note,
                })
                if (res.ok) router.refresh()
                return res
              }}
              onClose={onClose}
              isApp={isApp}
              filtriLabels={filtriLabels}
              percorsiPerListino={percorsiPerListino}
              hideColore
              showNote={false}
              forceQuantita
            />
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
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{ background: '#fff', borderRadius: 0, padding: '24px 28px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 18px', color: '#1a1a1a' }}>{title}</h3>

          {(isEdit || isDuplica) && (() => {
            const ref = isEdit ? modal.item : modal.lastItem
            return (
              <>
                {isDuplica && (
                  <p style={{ fontSize: 14, color: '#1a1a1a', margin: '0 0 14px' }}>
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
                {isEdit && (
                  <div style={fieldS}>
                    <label style={lblS}>Note</label>
                    <textarea
                      value={(vals as EditVals).note}
                      onChange={e => setVals({ note: e.target.value })}
                      rows={3}
                      placeholder="Eventuali richieste specifiche…"
                      style={{ ...inpS, resize: 'vertical' }}
                    />
                  </div>
                )}
              </>
            )
          })()}

          {isEdit && editError && (
            <p style={{ fontSize: 14, color: '#c0392b', margin: '0 0 8px' }}>{editError}</p>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 4 }}>
            <button type="button" onClick={onClose} className={b('btn-orange', isApp)}
              style={{ padding: '0 18px' }}>
              Annulla
            </button>
            <button type="button" onClick={onSave} disabled={actPending}
              className={actPending ? b('btn-gray', isApp) : b('btn-green', isApp)}
              style={{ padding: '0 20px' }}>
              {actPending ? 'Salvataggio…' : isEdit ? 'Salva' : 'Aggiungi'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── rendering ──────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {renderModal()}

      {/* Bottoni aggiunta articoli */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button type="button" onClick={openAggiungi} className={b('btn-green', isApp)} style={{
          minWidth: 200, padding: '0 8px', fontSize: 14,
        }}>
          + Aggiungi articolo
        </button>
        {lastTopLevel && (
          <button type="button" onClick={openDuplica} disabled={actPending}
            className={actPending ? b('btn-gray', isApp) : b('btn-green', isApp)}
            style={{ minWidth: 200, padding: '0 8px', fontSize: 14 }}>
            + Ripeti articolo
          </button>
        )}
      </div>

      {saveError && (
        <div style={{ background: '#fff5f5', color: '#c00', border: '1px solid #fed7d7', borderRadius: 6, padding: '10px 16px', fontSize: 14 }}>
          {saveError}
        </div>
      )}


      {/* Articoli a card */}
      {(() => {
        function childTypeOrder(c: ArticoloCarrello): number {
          if (c.richiede_tipo_colore     === 1) return 0
          if (c.richiede_tipo_colore_acc === 1) return 1
          if (c.richiede_tipo_vetro      === 1) return 2
          if (c.richiede_tipo_montaggio  === 1) return 3
          return 4
        }
        const groups: ArticoloCarrello[][] = []
        for (const a of articoli) {
          if (!a.parent) {
            groups.push([a])
          } else {
            const g = groups.find(grp => grp[0].uid === a.parent)
            if (g) g.push(a)
          }
        }
        for (const g of groups) {
          if (g.length > 1) g.splice(1, g.length - 1, ...g.slice(1).sort((a, b) => childTypeOrder(a) - childTypeOrder(b)))
        }

        const catGroups: { key: string; label: string; groups: ArticoloCarrello[][] }[] = []
        for (const group of groups) {
          const root = group[0]
          const key = `${root.categoria}||${root.produttore}||${root.serie ?? ''}`
          let cg = catGroups.find(c => c.key === key)
          if (!cg) {
            cg = { key, label: [root.categoria, root.produttore, root.serie].filter(Boolean).join(' · '), groups: [] }
            catGroups.push(cg)
          }
          cg.groups.push(group)
        }

        const renderColgroup = () => (
          <colgroup>
            <col style={{ width: 70 }} />
            <col />
            <col style={{ width: 80 }} />
            <col style={{ width: 70 }} />
          </colgroup>
        )

        let globalIdx = 0
        return (
          <div className="carrello-overflow" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
            {catGroups.map(cg => {
              const groupComplete = cg.groups.every(grp => getLacuneAperte(grp[0]).length === 0)
              return (
              <div key={cg.key} className={groupComplete ? undefined : 'sfondo-orange-app'} style={{ background: groupComplete ? '#fff' : undefined, border: '1px solid #222', borderRadius: 8, overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
                {/* Label gruppo */}
                <div style={{ background: '#fff', padding: '6px 14px', borderBottom: '1px solid #222', fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>
                  {cg.label}
                </div>
                <table className="carrello-table" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  {renderColgroup()}
                  <thead>
                    <tr style={{ background: '#fff' }}>
                      <th style={{ ...thS, textAlign: 'center', width: 70 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
                        </div>
                      </th>
                      <th style={{ ...thS }}>Articolo</th>
                      <th style={{ ...thS, textAlign: 'center', width: 80, textTransform: 'none', letterSpacing: 0 }}>Q.tà Rif<br/>Prezzo €</th>
                      <th style={{ ...thS, textAlign: 'center', padding: '8px 0', width: 70 }}>
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
                      const hasOptPure  = caratteristiche.some(c =>
                        matchesPercorsi(c.id, c.categoria, root.listino_id, root.categoria, percorsiPerListino) &&
                        c.richiede_tipo_colore     === 0 &&
                        c.richiede_tipo_colore_acc === 0 &&
                        c.richiede_tipo_vetro      === 0 &&
                        c.richiede_tipo_montaggio  === 0
                      )
                      const hasDetails  = true
                      const isExpanded  = expandedUID === root.uid
                      const expandBg     = isExpanded ? (hasLacune ? '#fdecea' : '#d6ecd6') : undefined
                      const expandBgRoot = isExpanded ? (hasLacune ? '#f5b8b4' : '#b8d9b8') : undefined
                      return (
                        <React.Fragment key={root.index}>
                          {/* Riga articolo principale */}
                          <tr className={hasLacune ? 'sfondo-orange-app' : undefined} style={{ background: hasLacune ? undefined : '#fff', borderTop: groupIdx > 0 ? '1px solid #333' : undefined }}>
                            <td style={{ ...tdS, textAlign: 'center', padding: '4px 0' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <button type="button" onClick={() => setPreviewArt(root)} disabled={hasLacune || (!root.abbr && !root.foto_url)} className={(hasLacune || (!root.abbr && !root.foto_url)) ? `${b('btn-gray', isApp)} btn-icon` : `${b('btn-black', isApp)} btn-icon`} title="Anteprima infisso"
                                  style={{ fontFamily: 'inherit' }}>
                                  <svg style={{ position: 'relative', zIndex: 1 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                {hasDetails && (
                                  <button type="button" onClick={() => toggleExpand(root.uid)}
                                    className={hasLacune ? `${b('btn-red', isApp)} btn-icon` : `${b('btn-black', isApp)} btn-icon`}
                                    style={{ fontFamily: 'inherit', gap: 0 }}>
                                    <svg style={{ position: 'relative', zIndex: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
                                    <span style={{ position: 'relative', zIndex: 1, fontSize: 14, marginLeft: -3 }}>{isExpanded ? '▴' : '▾'}</span>
                                  </button>
                                )}
                              </div>
                            </td>
                            <td style={{ ...tdS, paddingLeft: 8, textAlign: 'left' }}>
                              {root.descrizione}
                              {(() => {
                                const parts: string[] = []
                                if (root.ante && root.ante > 1) parts.push(`${root.ante} ante`)
                                if (root.larghezza_cm) parts.push(`L:${root.larghezza_cm}`)
                                if (root.altezza_cm)   parts.push(`H:${root.altezza_cm}`)
                                if (root.colore)       parts.push(root.colore)
                                return <div style={{ fontSize: 12, color: '#1a1a1a', marginTop: 1, textAlign: 'left' }}>{parts.join(' · ')}</div>
                              })()}
                              {root.note && <div style={{ fontSize: 12, color: '#1a1a1a', marginTop: 1, fontStyle: 'italic', textAlign: 'left' }}>{root.note}</div>}
                            </td>
                            <td style={{ ...tdS, padding: 0, height: 1, textAlign: 'center' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #333', fontSize: 12, color: '#1a1a1a', padding: '0 4px' }}>
                                  N°&nbsp;{root.quantita}
                                </div>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #333', fontSize: 12, color: '#1a1a1a', padding: '0 4px' }}>
                                  rif #{String(gi + 1).padStart(3, '0')}
                                </div>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', whiteSpace: 'nowrap' }}>
                                  {calcolaPrezzo(root, articoli) === 0
                                    ? ((root.sconto_articolo ?? 0) === 100
                                        ? <span style={{ fontSize: 10, fontStyle: 'italic', color: '#2e7d32' }}>Omaggio</span>
                                        : <span style={{ fontSize: 10, fontStyle: 'italic', color: '#c77700' }}>Da def.</span>
                                      )
                                    : renderPrezzo(isExpanded
                                        ? calcolaPrezzo(root, articoli)
                                        : calcolaPrezzo(root, articoli) + children.reduce((s, c) => s + calcolaPrezzo(c, articoli), 0)
                                      )
                                  }
                                </div>
                              </div>
                            </td>
                            <td style={{ ...tdS, padding: '4px 0', textAlign: 'center' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <button type="button" onClick={() => openEdit(root)} className={`${b('btn-black', isApp)} btn-icon`}
                                  style={{ fontFamily: 'inherit' }}>
                                  <span style={{ position: 'relative', zIndex: 1, fontSize: 14, display: 'inline-block', transform: 'rotate(135deg)' }}>✏</span>
                                </button>
                                <button type="button" onClick={() => handleRimuovi(root.index)} disabled={delPending} className={`${b('btn-red', isApp)} btn-icon`}
                                  style={{ fontFamily: 'inherit' }}>
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
                                  <div style={{ position: 'relative', width: 42, height: 42, margin: '0 auto' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={child.foto_url.startsWith('http') ? child.foto_url : child.foto_url.startsWith('/') ? child.foto_url : `/${child.foto_url}`}
                                      alt=""
                                      style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 4, display: 'block', opacity: child.escluso === 1 ? 0.4 : 1 }}
                                    />
                                    {child.escluso === 1 && (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src="/images/app/escluso.webp" alt="ESCLUSO" style={{ position: 'absolute', top: '-20%', left: '-20%', width: '140%', height: '140%', objectFit: 'contain', pointerEvents: 'none' }} />
                                    )}
                                  </div>
                                )}
                              </td>
                              <td style={{ ...tdS, paddingLeft: 8, textAlign: 'left' }}>
                                {child.descrizione}{child.note ? ` (${child.note})` : ''}
                                {(() => {
                                  const parts: string[] = []
                                  if (child.ante && child.ante > 1) parts.push(`${child.ante} ante`)
                                  if (child.larghezza_cm && !child.richiede_tipo_vetro) parts.push(`L:${child.larghezza_cm}`)
                                  if (child.altezza_cm   && !child.richiede_tipo_vetro) parts.push(`H:${child.altezza_cm}`)
                                  if (child.colore)       parts.push(child.colore)
                                  return <div style={{ fontSize: 12, color: '#1a1a1a', marginTop: 1, textAlign: 'left' }}>{parts.join(' · ')}</div>
                                })()}
                              </td>
                              <td style={{ ...tdS, textAlign: 'center', padding: '4px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                                  <div style={{ fontSize: 12, color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                                    {child.richiede_tipo_colore     === 1 ? 'Colore'
                                    : child.richiede_tipo_colore_acc === 1 ? 'Accessori'
                                    : child.richiede_tipo_vetro      === 1 ? 'Vetro'
                                    : child.richiede_tipo_montaggio  === 1 ? 'Montaggio'
                                    : ''}
                                  </div>
                                  <div style={{ whiteSpace: 'nowrap' }}>
                                    {calcolaPrezzo(child, articoli) === 0
                                      ? ((child.sconto_articolo ?? 0) === 100
                                          ? <span style={{ fontSize: 10, fontStyle: 'italic', color: '#2e7d32' }}>Omaggio</span>
                                          : (child.descrizione ?? '').toLowerCase().includes('nessun')
                                            ? <span style={{ fontSize: 10, fontStyle: 'italic', color: '#b00020' }}>Escluso</span>
                                            : <span style={{ fontSize: 10, fontStyle: 'italic', color: '#555' }}>Incluso</span>
                                        )
                                      : renderPrezzo(calcolaPrezzo(child, articoli))
                                    }
                                  </div>
                                </div>
                              </td>
                              <td style={{ ...tdS, padding: '4px 0', textAlign: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                  <button type="button" onClick={() => openEdit(child)} className={`${b('btn-black', isApp)} btn-icon`}
                                    style={{ fontFamily: 'inherit' }}>
                                    <span style={{ position: 'relative', zIndex: 1, fontSize: 14, display: 'inline-block', transform: 'rotate(135deg)' }}>✏</span>
                                  </button>
                                  <button type="button" onClick={() => handleRimuovi(child.index)} disabled={delPending} className={`${b('btn-red', isApp)} btn-icon`}
                                    style={{ fontFamily: 'inherit' }}>
                                    <span style={{ position: 'relative', zIndex: 1, fontSize: 14 }}>✕</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {/* Riga bottoni lacune */}
                          {isExpanded && hasLacune && (() => {
                            return (
                              <tr style={{ background: '#ffffff' }}>
                                <td colSpan={4} style={{ padding: 12, borderBottom: '1px solid #333', borderRight: 'none', textAlign: 'left', background: '#ffffff' }}>
                                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                                    {showColore && (
                                      <button type="button" onClick={() => handleAggiungiLacuna(root, 'tipo_colore')} className={b('btn-orange', isApp)} style={{ minWidth: 140 }}>
                                        + Colore
                                      </button>
                                    )}
                                    {showColoreAcc && (
                                      <button type="button" onClick={() => handleAggiungiLacuna(root, 'tipo_colore_acc')} className={b('btn-orange', isApp)} style={{ minWidth: 140 }}>
                                        + Accessori
                                      </button>
                                    )}
                                    {showVetro && (
                                      <button type="button" onClick={() => handleAggiungiLacuna(root, 'tipo_vetro')} className={b('btn-orange', isApp)} style={{ minWidth: 140 }}>
                                        + Vetro
                                      </button>
                                    )}
                                    {showMontaggio && (
                                      <button type="button" onClick={() => handleAggiungiLacuna(root, 'tipo_montaggio')} className={b('btn-orange', isApp)} style={{ minWidth: 140 }}>
                                        + Montaggio
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )
                          })()}
                          {/* Riga + aggiungi: solo se esistono caratteristiche pure (tutti 4 flag = 0) per questa categoria */}
                          {isExpanded && !hasLacune && hasOptPure && (
                            <tr style={{ background: '#ffffff' }}>
                              <td style={{ padding: '4px', textAlign: 'center', borderBottom: '1px solid #333' }}>
                                <button type="button" onClick={() => handleAggiungiComeFiglio(root)}
                                  disabled={optCarPending}
                                  className={`${optCarPending ? b('btn-gray', isApp) : b('btn-pink', isApp)} btn-icon`}
                                  style={{ border: 'none' }}>
                                  <span style={{ position: 'relative', zIndex: 1, fontSize: 22, lineHeight: 1, fontWeight: 300 }}>
                                    {optCarPending ? '…' : '+'}
                                  </span>
                                </button>
                              </td>
                              <td colSpan={3} style={{ padding: '4px 8px', borderBottom: '1px solid #333', fontSize: 11, color: '#555' }}>
                                Aggiungi elemento (opzionale)
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )})}

            {/* Totale */}
            <div style={{ background: '#fff', border: '1px solid #222', borderRadius: 8, padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 4, color: '#1a1a1a' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1, fontSize: 12, color: '#1a1a1a', fontWeight: 700 }}>Listino (escluso IVA):</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap' }}>{`€ ${fmt(totale)}`}</span>
              </div>
              {hasDaDefinire && (
                <div style={{ textAlign: 'right', fontSize: 11, color: '#c77700', fontStyle: 'italic' }}>
                  + Prezzi da definire
                </div>
              )}
            </div>
          </div>
          </div>
        )
      })()}

      {/* Messaggi stato — fuori dal riquadro bottoni */}
      {articoli.length === 0 ? (
        <div style={{ background: '#e8e8e8', borderRadius: 6, overflow: 'hidden', border: '1px solid #9b1c1c' }}>
          <div style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(150,0,0,0.3)' }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: '#9b1c1c', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Carrello vuoto
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(150,0,0,0.3)' }} />
          </div>
          <div style={{ background: '#f0f0f0', padding: '5px 10px', textAlign: 'center' }}>
            <p style={{ fontSize: 10, fontWeight: 600, margin: 0, color: '#9b1c1c', textTransform: 'uppercase', textAlign: 'center' }}>
              Aggiungi articoli dal bottone qui sopra oppure sfoglia i cataloghi.
            </p>
            {!isApp && <a href={cataloghiHref} style={{ color: '#9b1c1c', fontWeight: 700, fontSize: 10 }}>
              Vai ai cataloghi →
            </a>}
          </div>
        </div>
      ) : hasLacuneAperte ? (
        <div style={{ background: '#e8e8e8', borderRadius: 6, overflow: 'hidden', border: '1px solid #9b1c1c' }}>
          <div style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(150,0,0,0.3)' }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: '#9b1c1c', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Dati incompleti
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(150,0,0,0.3)' }} />
          </div>
          <div style={{ background: '#f0f0f0', padding: '5px 10px' }}>
            <p style={{ fontSize: 10, fontWeight: 600, margin: 0, color: '#9b1c1c', textTransform: 'uppercase', textAlign: 'justify' }}>
              Alcuni articoli hanno caratteristiche mancanti. Completali prima di procedere con la stampa o il salvataggio del preventivo.
            </p>
          </div>
        </div>
      ) : null}
      {articoli.length > 0 && !hasLacuneAperte && (
        <div style={{ background: '#e8e8e8', borderRadius: 6, overflow: 'hidden', border: '1px solid #9b1c1c' }}>
          <div style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(150,0,0,0.3)' }} />
            <span style={{ fontSize: 9, fontWeight: 800, color: '#9b1c1c', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Prezzo da scontare
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(150,0,0,0.3)' }} />
          </div>
        </div>
      )}
      {articoli.length > 0 && !hasLacuneAperte && isLoggedIn && (
        <div style={{ background: '#e8e8e8', borderRadius: 6, overflow: 'hidden', border: '1px solid #1e4d2b' }}>
          <div style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,100,0,0.3)' }} />
            <span style={{ fontSize: 9, fontWeight: 800, color: '#1e4d2b', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Applica gli sconti
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,100,0,0.3)' }} />
          </div>
          <div style={{ background: '#f0f0f0', padding: '5px 10px' }}>
            <p style={{ fontSize: 9, fontWeight: 600, margin: 0, color: '#1e4d2b', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.04em' }}>
              Salva il carrello del simulatore come preventivo e scopri il prezzo finale con i tuoi sconti.
            </p>
          </div>
        </div>
      )}

      {!isLoggedIn && !hasLacuneAperte && articoli.length > 0 && (
        <div style={{ background: '#e8e8e8', borderRadius: 6, overflow: 'hidden', border: '1px solid #1e4d2b', padding: '3px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,100,0,0.3)' }} />
            <span style={{ fontSize: 9, fontWeight: 800, color: '#1e4d2b', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Complimenti!</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,100,0,0.3)' }} />
          </div>
          <p style={{ fontSize: 9, fontWeight: 400, color: '#1e4d2b', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', margin: '2px 0', lineHeight: 1.2 }}>I dati del preventivo sono completi.</p>
          <p style={{ fontSize: 9, fontWeight: 600, margin: '2px 0', color: '#1e4d2b', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2 }}>Accedi per applicare gli sconti.</p>
          <p style={{ fontSize: 9, fontWeight: 600, margin: '2px 0', color: '#1e4d2b', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2 }}>Salva il preventivo e recuperalo quando vuoi.</p>
        </div>
      )}

      {/* Barra azioni */}
      <div style={{ background: '#fff', border: '1px solid #222', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ fontSize: 14, color: '#1a1a1a', margin: 0 }}>
          {isLoggedIn
            ? <><svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, flexShrink: 0 }}><path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/></svg>Se non procedi al trasferimento nella tua area personale, ti consigliamo di scaricare il pdf o stamparlo perché non verrà salvato nel nostro sistema.</>
            : <><svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, flexShrink: 0 }}><path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/></svg>Genera il PDF del preventivo perché, se non lo salvi, non sarà recuperabile successivamente.</>}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {isLoggedIn && (
            <button type="button" onClick={handleSalva} disabled={savePending || hasLacuneAperte || articoli.length === 0}
              className={(savePending || hasLacuneAperte || articoli.length === 0) ? b('btn-gray', isApp) : b('btn-green', isApp)}
              style={{ flex: 1, minWidth: 200, padding: '0 8px', fontSize: 14, fontFamily: 'inherit' }}>
              {savePending ? 'Salvataggio…' : 'Salva preventivo'}
            </button>
          )}
          <button type="button" onClick={handleGeneraPDF} disabled={hasLacuneAperte || articoli.length === 0}
            className={(hasLacuneAperte || articoli.length === 0) ? b('btn-gray', isApp) : b('btn-black', isApp)}
            style={{ flex: 1, minWidth: 200, padding: '0 8px', fontSize: 14 }}>
            <span className={(hasLacuneAperte || articoli.length === 0) ? undefined : 'animato'}>Genera PDF</span>
          </button>
          <button type="button" onClick={handleSvuota} disabled={clearPending || articoli.length === 0}
            className={(clearPending || articoli.length === 0) ? b('btn-gray', isApp) : b('btn-red', isApp)}
            style={{ flex: 1, minWidth: 200, padding: '0 8px', fontSize: 14 }}>
            {clearPending ? 'Svuotamento…' : 'Svuota carrello'}
          </button>
        </div>
      </div>

      {!isLoggedIn && <LoginBanner hasLacune={hasLacuneAperte || articoli.length === 0} cataloghiHref={cataloghiHref} isApp={isApp} />}

      {articoli.some(a => a.unita === 'mq' || a.unita === 'ml') && (
        <p style={{ fontSize: 14, color: '#1a1a1a', margin: 0 }}>
          * Per articoli a m² o m lin. il subtotale è calcolato sul prezzo unitario di listino. Il prezzo finale dipenderà dalle dimensioni effettive.
        </p>
      )}

      {previewArt && (
        <div
          onClick={() => setPreviewArt(null)}
          onTouchStart={() => setPreviewArt(null)}
          style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            {previewArt.abbr ? (
              <PreviewInfisso
                larghezza_cm={previewArt.larghezza_cm ?? 100}
                altezza_cm={previewArt.altezza_cm ?? 150}
                colore={previewArt.colore ?? 'Bianco'}
                descrizione={previewArt.descrizione}
                tipo_prodotto={previewArt.categoria}
                n_ante={previewArt.ante ?? 1}
                abbr={previewArt.abbr}
                profilo_mm={previewArt.profilo_mm}
                bar_color={previewArt.bar_color ?? undefined}
                bar_color_acc={previewArt.bar_color_acc ?? undefined}
                maxHeight="100vh"
              />
            ) : previewArt.foto_url ? (
              <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewArt.foto_url.startsWith('http') ? previewArt.foto_url : previewArt.foto_url.startsWith('/') ? previewArt.foto_url : `/${previewArt.foto_url}`}
                  alt={previewArt.descrizione}
                  style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain', display: 'block', opacity: previewArt.escluso === 1 ? 0.4 : 1 }}
                />
                {previewArt.escluso === 1 && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/images/app/escluso.webp" alt="ESCLUSO" style={{ position: 'absolute', top: '-20%', left: '-20%', width: '140%', height: '140%', objectFit: 'contain', pointerEvents: 'none' }} />
                )}
              </div>
            ) : null}
          </div>
          <p style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', margin: 0, fontSize: 14, color: '#bbb', fontStyle: 'italic', pointerEvents: 'none' }}>
            {isTouch ? 'Tocca per chiudere' : 'Clicca per chiudere'}
          </p>
        </div>
      )}
    </div>
  )
}
