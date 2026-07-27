'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import AggiungiArticoloForm, { type ArticoloListino, type ConfirmData } from '@/components/aggiungi-articolo-form'
import { matchesPercorsi, type PercorsoEntry } from '@/lib/percorsi-match'
import {
  salvaComputometrico, type RigaComputometrico,
  addRigaCarrello, addRigheCarrello, removeRigaCarrello, updateRigaCarrello, clearCarrelloComputometrico,
  type RigaCarrello,
} from './actions'

export type ArticoloComputabile = {
  id: number
  categoria: string
  sottocategoria: string | null
  fase: string | null
  materiale: string | null
  tipologia: string | null
  ambiente: string | null
  fascia: string | null
  produttore: string
  serie: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  sconto_articolo: number
  richiede_larghezza: number
  richiede_altezza: number
  richiede_altezza3d: number
  richiede_quantita: number
  richiede_tipo_colore: number
  richiede_tipo_colore_acc: number
  richiede_tipo_vetro: number
  richiede_tipo_montaggio: number
  minimo: number | null
  filtro_1: number
  filtro_2: number
  filtro_3: number
  filtro_4: number
  filtro_5: number
  filtro_6: number
  filtro_7: number
  filtro_8: number
  filtro_9: number
  filtro_10: number
  schema_url: string | null
  logo_url: string | null
  principale: number
  caratteristica: number
  base_calcolo: string | null
}


// Le tre misure di un ambiente: L (larghezza, ex "larghezza"), H2D (ex "altezza",
// la seconda lunghezza del pavimento) e H3D (altezza del soffitto, nuovo campo).
// Ogni voce dichiara con `base_calcolo` quale formula usare per ricavare la sua
// quantità da queste misure — indipendente dall'unità di prezzo (`unita`), che
// resta solo "al mq"/"al ml"/ecc. "diretta" (base_calcolo vuoto) è il comportamento
// di sempre: L×H2D per m², L per ml (usato dagli infissi e da voci non legate a un ambiente).
function misuraAmbiente(basi: string | null | undefined, unita: string, l?: number, h2d?: number, h3d?: number): number | null {
  const L   = (l   ?? 0) / 100
  const H2D = (h2d ?? 0) / 100
  const H3D = (h3d ?? 0) / 100
  if (basi === 'pavimento') return L * H2D
  if (basi === 'pareti')    return 2 * (L + H2D) * H3D
  if (basi === 'perimetro') return 2 * (L + H2D)
  if (unita === 'm²') return L * H2D
  if (unita === 'ml') return L
  return null
}

// Dice quali delle 3 misure dell'ambiente padre servono per la formula di una voce,
// così handleApplicaVoci eredita solo i campi effettivamente usati (le altre voci,
// es. a forfait, restano senza misure mostrate in tabella).
function misureUsate(basi: string | null | undefined, unita: string): { l: boolean; h2d: boolean; h3d: boolean } {
  if (basi === 'pavimento') return { l: true, h2d: true, h3d: false }
  if (basi === 'pareti')    return { l: true, h2d: true, h3d: true }
  if (basi === 'perimetro') return { l: true, h2d: true, h3d: false }
  if (unita === 'm²') return { l: true, h2d: true, h3d: false }
  if (unita === 'ml') return { l: true, h2d: false, h3d: false }
  return { l: false, h2d: false, h3d: false }
}

function calcolaTotale(art: ArticoloComputabile, q: number, l?: number, h?: number, h3d?: number): number {
  const p = art.prezzo_vendita
  const misura = misuraAmbiente(art.base_calcolo, art.unita, l, h, h3d)
  if (misura == null) return Math.round(p * q * 100) / 100
  const misuraMin = Math.max(misura, art.minimo ?? 0)
  return Math.round(p * misuraMin * q * 100) / 100
}

// Stessa formula di calcolaTotale, ma senza bisogno dell'ArticoloComputabile intero
// (usata per ricalcolare il totale di una riga già salvata quando lo staff ne
// corregge il prezzo — il "minimo" non si riapplica, la misura è già quella
// registrata al momento dell'inserimento).
function calcolaTotaleRiga(unita: string, prezzo: number, q: number, l?: number, h?: number, basi?: string | null, h3d?: number): number {
  const misura = misuraAmbiente(basi, unita, l, h, h3d)
  if (misura == null) return Math.round(prezzo * q * 100) / 100
  return Math.round(prezzo * misura * q * 100) / 100
}

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

type ModalState = null | { type: 'aggiungi'; parentUid?: number } | { type: 'voci'; parentUid: number } | { type: 'edit'; uid: number }

export default function CarrelloComputometricoClient({
  articoli,
  isLoggedIn,
  isStaff = false,
  initialRighe,
  filtriLabels,
  percorsiPerListino = {},
}: {
  articoli: ArticoloComputabile[]
  isLoggedIn: boolean
  isStaff?: boolean
  initialRighe: RigaCarrello[]
  filtriLabels?: Record<number, string>
  percorsiPerListino?: Record<number, PercorsoEntry[]>
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editPending, startEdit] = useTransition()
  const [vociPending, startVoci] = useTransition()
  const [clearPending, startClear] = useTransition()

  const [righe, setRighe] = useState<RigaCarrello[]>(initialRighe)
  const [modal, setModal] = useState<ModalState>(null)
  const [expandedUID, setExpandedUID] = useState<number | null>(null)
  const [vociFilter, setVociFilter] = useState('')
  const [vociSelected, setVociSelected] = useState<Set<number>>(new Set())

  function toggleExpand(uid: number) {
    setExpandedUID(prev => prev === uid ? null : uid)
  }
  const [descrizione, setDescrizione] = useState('')
  const [saveError, setSaveError] = useState('')

  // edit state
  const [editNote, setEditNote] = useState('')
  const [editQuantita, setEditQuantita] = useState(1)
  const [editPrezzo, setEditPrezzo] = useState(0)

  const totale = righe.reduce((s, r) => s + r.totale_riga, 0)

  // Aggiorna solo il badge navbar (il carrello vive nel cookie, non serve altro qui)
  React.useEffect(() => {
    try {
      const primaryCount = righe.filter(r => !r.parentUid).length
      localStorage.setItem('computo_count', String(primaryCount))
      window.dispatchEvent(new CustomEvent('computo-count-changed', { detail: { count: primaryCount } }))
    } catch {}
  }, [righe])

  // Il computometrico non ha ancora un concetto di "lacune" come preventivo/acquisti
  // (nessuna caratteristica obbligatoria mancante) — sempre completo per ora. Stesso
  // meccanismo (localStorage + evento) già pronto per quando servirà un vero criterio.
  React.useEffect(() => {
    try {
      localStorage.setItem('computo_completo', '1')
      window.dispatchEvent(new CustomEvent('computo-completo-changed', { detail: { completo: true } }))
    } catch {}
  }, [])

  async function handleConfirm(data: ConfirmData): Promise<{ ok: boolean; error: string }> {
    const art = articoli.find(a => a.id === data.listinoId)
    if (!art) return { ok: false, error: 'Articolo non trovato.' }
    const q = data.quantita ?? 1
    const totaleRiga = calcolaTotale(art, q, data.larghezza, data.altezza, data.altezza3d)
    const parentUid = modal?.type === 'aggiungi' ? modal.parentUid : undefined
    const res = await addRigaCarrello({
      parentUid,
      listino_id: art.id,
      categoria: art.categoria,
      produttore: art.produttore,
      serie: art.serie,
      descrizione: art.descrizione,
      unita: art.unita,
      quantita: q,
      larghezza_cm: data.larghezza,
      altezza_cm: data.altezza,
      altezza3d_cm: data.altezza3d,
      base_calcolo: art.base_calcolo,
      colore: data.colore,
      note: data.note,
      prezzo_unitario: art.prezzo_vendita,
      totale_riga: totaleRiga,
    })
    if (!res.ok) return { ok: false, error: res.error ?? 'Errore.' }
    const riga: RigaCarrello = {
      uid: res.uid!,
      parentUid,
      listino_id: art.id,
      categoria: art.categoria,
      produttore: art.produttore,
      serie: art.serie,
      descrizione: art.descrizione,
      unita: art.unita,
      quantita: q,
      larghezza_cm: data.larghezza,
      altezza_cm: data.altezza,
      altezza3d_cm: data.altezza3d,
      base_calcolo: art.base_calcolo,
      colore: data.colore,
      note: data.note,
      prezzo_unitario: art.prezzo_vendita,
      totale_riga: totaleRiga,
    }
    setRighe(prev => [...prev, riga])
    setModal(null)
    return { ok: true, error: '' }
  }

  function openEdit(uid: number) {
    const r = righe.find(x => x.uid === uid)
    if (!r) return
    setEditNote(r.note ?? '')
    setEditQuantita(r.quantita)
    setEditPrezzo(r.prezzo_unitario)
    setModal({ type: 'edit', uid })
  }

  function handleEditSave() {
    if (modal?.type !== 'edit') return
    const uid = modal.uid
    const r = righe.find(x => x.uid === uid)
    if (!r) return
    const quantita = Math.max(0, editQuantita || 0)
    const prezzo = isStaff ? Math.max(0, editPrezzo || 0) : r.prezzo_unitario
    const totaleRiga = calcolaTotaleRiga(r.unita, prezzo, quantita, r.larghezza_cm, r.altezza_cm, r.base_calcolo, r.altezza3d_cm)
    startEdit(() => {
      setRighe(prev => prev.map(x => x.uid === uid ? { ...x, note: editNote, quantita, prezzo_unitario: prezzo, totale_riga: totaleRiga } : x))
      setModal(null)
    })
    updateRigaCarrello(uid, { note: editNote, quantita, prezzo_unitario: prezzo, totale_riga: totaleRiga })
  }

  function handleRimuovi(uid: number) {
    if (!confirm('Rimuovere l\'articolo?')) return
    setRighe(prev => prev.filter(r => r.uid !== uid && r.parentUid !== uid))
    removeRigaCarrello(uid)
  }

  // Applica le voci spuntate (modal.type === 'voci') all'ambiente da cui è stata
  // aperta la modale ("Applica"), oppure a tutti gli ambienti compatibili
  // ("Applica a tutti"): una voce con sottocategoria specifica viene saltata sugli
  // ambienti di tipo diverso invece di dare errore. Le misure (mq/ml) si ereditano
  // sempre dall'ambiente, non si richiedono di nuovo.
  function handleApplicaVoci(soloCorrente: boolean) {
    if (modal?.type !== 'voci') return
    if (vociSelected.size === 0) return
    const voci = articoli.filter(a => vociSelected.has(a.id))
    const ambienti = soloCorrente
      ? righe.filter(r => r.uid === modal.parentUid)
      : righe.filter(r => !r.parentUid)

    const nuove: Omit<RigaCarrello, 'uid'>[] = []
    for (const ambiente of ambienti) {
      for (const voce of voci) {
        if (!matchesPercorsi(voce.id, voce.categoria, ambiente.listino_id, ambiente.categoria, percorsiPerListino)) continue
        const totaleRiga = calcolaTotale(voce, 1, ambiente.larghezza_cm, ambiente.altezza_cm, ambiente.altezza3d_cm)
        const uso = misureUsate(voce.base_calcolo, voce.unita)
        nuove.push({
          parentUid: ambiente.uid,
          listino_id: voce.id,
          categoria: voce.categoria,
          produttore: voce.produttore,
          serie: voce.serie,
          descrizione: voce.descrizione,
          unita: voce.unita,
          quantita: 1,
          larghezza_cm: uso.l   ? ambiente.larghezza_cm  : undefined,
          altezza_cm:   uso.h2d ? ambiente.altezza_cm    : undefined,
          altezza3d_cm: uso.h3d ? ambiente.altezza3d_cm  : undefined,
          base_calcolo: voce.base_calcolo,
          prezzo_unitario: voce.prezzo_vendita,
          totale_riga: totaleRiga,
        })
      }
    }
    if (nuove.length === 0) { setModal(null); return }

    startVoci(async () => {
      const res = await addRigheCarrello(nuove)
      if (!res.ok || !res.uids) { setModal(null); return }
      const aggiunte: RigaCarrello[] = nuove.map((n, i) => ({ ...n, uid: res.uids![i] }))
      setRighe(prev => [...prev, ...aggiunte])
      setVociSelected(new Set())
      setVociFilter('')
      setModal(null)
    })
  }

  function handleSalva() {
    setSaveError('')
    startTransition(async () => {
      const payload: RigaComputometrico[] = righe.map(r => ({
        uid: r.uid,
        parentUid: r.parentUid,
        listino_id: r.listino_id,
        categoria: r.categoria,
        produttore: r.produttore,
        serie: r.serie,
        descrizione: r.descrizione,
        unita: r.unita,
        quantita: r.quantita,
        larghezza_cm: r.larghezza_cm,
        altezza_cm: r.altezza_cm,
        altezza3d_cm: r.altezza3d_cm,
        base_calcolo: r.base_calcolo,
        colore: r.colore,
        prezzo_unitario: r.prezzo_unitario,
        totale_riga: r.totale_riga,
        note: r.note ?? '',
      }))
      const res = await salvaComputometrico(payload, descrizione)
      if (!res.ok) { setSaveError(res.error ?? 'Errore.'); return }
      await clearCarrelloComputometrico()
      try {
        localStorage.removeItem('computo_count')
        window.dispatchEvent(new CustomEvent('computo-count-changed', { detail: { count: 0 } }))
      } catch {}
      router.push(`/area-clienti/computometrici/${res.id}`)
    })
  }

  function handleSvuota() {
    if (!confirm('Svuotare il carrello?')) return
    startClear(async () => {
      await clearCarrelloComputometrico()
      setRighe([])
      try {
        localStorage.removeItem('computo_count')
        window.dispatchEvent(new CustomEvent('computo-count-changed', { detail: { count: 0 } }))
      } catch {}
      router.refresh()
    })
  }

  // stili identici al carrello-preventivo
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
  const inpS: React.CSSProperties = {
    width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: 6,
    fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
  }
  const lblS: React.CSSProperties = {
    fontSize: 14, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 4,
  }
  const fieldS: React.CSSProperties = { marginBottom: 12 }

  // "+ Aggiungi articolo" propone solo gli ambienti (principale=1); le voci
  // secondarie passano dalla modale a crocette (modal.type === 'voci').
  const listiniAmbienti = articoli.filter(a => a.principale === 1) as unknown as ArticoloListino[]

  // Raggruppa solo le righe primarie (senza parentUid)
  type Gruppo = { key: string; label: string; righe: RigaCarrello[] }
  const gruppi: Gruppo[] = []
  for (const r of righe.filter(r => !r.parentUid)) {
    const key = `${r.categoria}||${r.produttore}||${r.serie}`
    let g = gruppi.find(x => x.key === key)
    if (!g) {
      g = { key, label: [r.categoria, r.produttore, r.serie].filter(Boolean).join(' · '), righe: [] }
      gruppi.push(g)
    }
    g.righe.push(r)
  }

  let globalIdx = 0

  const renderModal = () => {
    if (!modal) return null
    const onClose = () => setModal(null)

    if (modal.type === 'aggiungi') {
      return (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px 0', overflowY: 'auto' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 720, padding: '0 16px', boxSizing: 'border-box', marginTop: 'auto', marginBottom: 'auto' }}
          >
            <AggiungiArticoloForm
              articoli={listiniAmbienti}
              isLoggedIn={isLoggedIn}
              onConfirm={handleConfirm}
              onClose={onClose}
              submitLabel="Aggiungi al computo"
              filtriLabels={filtriLabels}
              percorsiPerListino={percorsiPerListino}
            />
          </div>
        </div>
      )
    }

    if (modal.type === 'voci') {
      const ambiente = righe.find(r => r.uid === modal.parentUid)
      if (!ambiente) return null
      const disponibili = articoli.filter(a =>
        a.principale === 0 &&
        matchesPercorsi(a.id, a.categoria, ambiente.listino_id, ambiente.categoria, percorsiPerListino)
      )
      const filtrate = vociFilter.trim()
        ? disponibili.filter(a => {
            const q = vociFilter.toLowerCase()
            return a.descrizione.toLowerCase().includes(q) || a.produttore.toLowerCase().includes(q) || a.categoria.toLowerCase().includes(q)
          })
        : disponibili
      const altriAmbienti = righe.filter(r => !r.parentUid && r.uid !== ambiente.uid).length > 0

      function toggleVoce(id: number) {
        setVociSelected(prev => {
          const next = new Set(prev)
          next.has(id) ? next.delete(id) : next.add(id)
          return next
        })
      }

      return (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 0, padding: '24px 28px', width: '100%', maxWidth: 560, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>Aggiungi lavorazioni</h3>
            <p style={{ fontSize: 14, color: '#1a1a1a', margin: '0 0 18px' }}>
              Ambiente: <strong>{ambiente.descrizione}</strong>
            </p>

            <div style={fieldS}>
              <label style={lblS}>Spunta le lavorazioni da aggiungere</label>
              <input
                type="text"
                placeholder="Cerca per descrizione, produttore…"
                style={{ ...inpS, marginBottom: 8 }}
                value={vociFilter}
                onChange={e => setVociFilter(e.target.value)}
              />
              <div style={{ border: '1px solid #ddd', borderRadius: 6, maxHeight: 320, overflowY: 'auto' }}>
                {filtrate.length === 0 ? (
                  <p style={{ fontSize: 14, color: '#1a1a1a', margin: 0, padding: '12px 14px' }}>Nessuna lavorazione disponibile per questo ambiente.</p>
                ) : filtrate.map((a, i) => {
                  const isSel = vociSelected.has(a.id)
                  return (
                    <div
                      key={a.id}
                      onClick={() => toggleVoce(a.id)}
                      style={{
                        padding: '10px 14px',
                        borderBottom: i < filtrate.length - 1 ? '1px solid #ececec' : 'none',
                        cursor: 'pointer',
                        background: isSel ? '#e8f4e8' : '#fff',
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        userSelect: 'none',
                      }}
                    >
                      <input type="checkbox" checked={isSel} onChange={() => toggleVoce(a.id)} style={{ marginTop: 3, flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: 14, fontWeight: isSel ? 700 : 400, color: '#1a1a1a', lineHeight: 1.4 }}>
                          {a.produttore ? `${a.produttore} · ` : ''}{a.descrizione}
                        </span>
                        {isStaff && (
                          <span style={{ fontSize: 12, color: '#888', display: 'block' }}>
                            € {a.prezzo_vendita.toFixed(2)}{a.unita !== 'pz' ? ` /${a.unita}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={onClose} className="btn-orange" style={{ padding: '0 18px' }}>Annulla</button>
              <button type="button" onClick={() => handleApplicaVoci(true)} disabled={vociSelected.size === 0 || vociPending}
                className={vociSelected.size === 0 || vociPending ? 'btn-gray' : 'btn-green'} style={{ padding: '0 20px' }}>
                {vociPending ? '…' : 'Applica'}
              </button>
              {altriAmbienti && (
                <button type="button" onClick={() => handleApplicaVoci(false)} disabled={vociSelected.size === 0 || vociPending}
                  className={vociSelected.size === 0 || vociPending ? 'btn-gray' : 'btn-green'} style={{ padding: '0 20px' }}>
                  {vociPending ? '…' : 'Applica a tutti gli ambienti'}
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }

    if (modal.type === 'edit') {
      return (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 0, padding: '24px 28px', width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 18px', color: '#1a1a1a' }}>Modifica articolo</h3>
            <div style={fieldS}>
              <label style={lblS}>Quantità</label>
              <input
                type="number" min={0} step="1"
                value={editQuantita}
                onChange={e => setEditQuantita(Math.max(0, parseInt(e.target.value) || 0))}
                style={inpS}
              />
            </div>
            {isStaff && (
              <div style={fieldS}>
                <label style={lblS}>Prezzo unitario (€)</label>
                <input
                  type="number" min={0} step="0.01"
                  value={editPrezzo}
                  onChange={e => setEditPrezzo(Math.max(0, parseFloat(e.target.value) || 0))}
                  style={inpS}
                />
              </div>
            )}
            <div style={fieldS}>
              <label style={lblS}>Note</label>
              <textarea
                value={editNote}
                onChange={e => setEditNote(e.target.value)}
                rows={3}
                style={{ ...inpS, resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button type="button" onClick={onClose} className="btn-orange" style={{ padding: '0 18px' }}>Annulla</button>
              <button type="button" onClick={handleEditSave} disabled={editPending} className="btn-green" style={{ padding: '0 20px' }}>Salva</button>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {renderModal()}

      {/* Bottone aggiungi */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button type="button" onClick={() => setModal({ type: 'aggiungi' })} className="btn-green"
          style={{ minWidth: 200, padding: '0 8px', fontSize: 14 }}>
          + Aggiungi articolo
        </button>
      </div>

      {/* Gruppi articoli */}
      {gruppi.length > 0 ? (
        <div className="carrello-overflow" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
            {gruppi.map(g => (
              <div key={g.key} style={{ background: '#fff', border: '1px solid #222', borderRadius: 8, overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ background: '#fff', padding: '6px 14px', borderBottom: '1px solid #222', fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>
                  {g.label}
                </div>
                <table className="carrello-table" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: 40 }} />
                    <col />
                    <col style={{ width: 80 }} />
                    <col style={{ width: 70 }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: '#fff' }}>
                      <th style={{ ...thS, textAlign: 'center' }}>#</th>
                      <th style={thS}>Articolo</th>
                      <th style={{ ...thS, textAlign: 'center', textTransform: 'none', letterSpacing: 0 }}>{isStaff ? <>Q.tà<br/>Prezzo €</> : 'Q.tà'}</th>
                      <th style={{ ...thS, textAlign: 'center', padding: '8px 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <span style={{ fontSize: 14, display: 'inline-block', transform: 'rotate(135deg)', lineHeight: 1 }}>✏</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.righe.map(r => {
                      globalIdx++
                      const gi = globalIdx - 1
                      const children = righe.filter(c => c.parentUid === r.uid)
                      const isExpanded = expandedUID === r.uid
                      const parts: string[] = []
                      if (r.larghezza_cm) parts.push(`L:${r.larghezza_cm}`)
                      if (r.altezza_cm) parts.push(`H2D:${r.altezza_cm}`)
                      if (r.altezza3d_cm) parts.push(`H3D:${r.altezza3d_cm}`)
                      if (r.colore) parts.push(r.colore)
                      return (
                        <React.Fragment key={r.uid}>
                          {/* Riga articolo principale */}
                          <tr style={{ background: '#fff' }}>
                            <td style={{ ...tdS, padding: '4px 0', textAlign: 'center' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <span style={{ color: '#888', fontSize: 11 }}>{gi + 1}</span>
                                <button type="button" onClick={() => toggleExpand(r.uid)} className="btn-black btn-icon" style={{ fontFamily: 'inherit', gap: 0 }}>
                                  <svg style={{ position: 'relative', zIndex: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
                                  <span style={{ position: 'relative', zIndex: 1, fontSize: 14, marginLeft: -3 }}>{isExpanded ? '▴' : '▾'}</span>
                                </button>
                              </div>
                            </td>
                            <td style={{ ...tdS, paddingLeft: 8, textAlign: 'left' }}>
                              {r.descrizione}
                              {parts.length > 0 && <div style={{ fontSize: 12, color: '#1a1a1a', marginTop: 1 }}>{parts.join(' · ')}</div>}
                              {r.note && <div style={{ fontSize: 12, color: '#555', marginTop: 1, fontStyle: 'italic' }}>{r.note}</div>}
                            </td>
                            <td style={{ ...tdS, padding: 0, height: 1, textAlign: 'center' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #333', fontSize: 12, color: '#1a1a1a', padding: '0 4px' }}>
                                  N°&nbsp;{r.quantita}
                                </div>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: isStaff ? '1px solid #333' : 'none', fontSize: 12, color: '#1a1a1a', padding: '0 4px' }}>
                                  rif #{String(gi + 1).padStart(3, '0')}
                                </div>
                                {isStaff && (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', whiteSpace: 'nowrap' }}>
                                  {r.totale_riga === 0
                                    ? <span style={{ fontSize: 10, fontStyle: 'italic', color: '#c77700' }}>Da def.</span>
                                    : renderPrezzo(isExpanded ? r.totale_riga : r.totale_riga + children.reduce((s, c) => s + c.totale_riga, 0))
                                  }
                                </div>
                                )}
                              </div>
                            </td>
                            <td style={{ ...tdS, padding: '4px 0', textAlign: 'center' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <button type="button" onClick={() => openEdit(r.uid)} className="btn-black btn-icon" style={{ fontFamily: 'inherit' }}>
                                  <span style={{ position: 'relative', zIndex: 1, fontSize: 14, display: 'inline-block', transform: 'rotate(135deg)' }}>✏</span>
                                </button>
                                <button type="button" onClick={() => handleRimuovi(r.uid)} className="btn-red btn-icon" style={{ fontFamily: 'inherit' }}>
                                  <span style={{ position: 'relative', zIndex: 1, fontSize: 14 }}>✕</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                          {/* Righe caratteristiche figlie — visibili solo se espanso */}
                          {isExpanded && children.map(c => {
                            const cParts: string[] = []
                            if (c.larghezza_cm) cParts.push(`L:${c.larghezza_cm}`)
                            if (c.altezza_cm) cParts.push(`H2D:${c.altezza_cm}`)
                            if (c.altezza3d_cm) cParts.push(`H3D:${c.altezza3d_cm}`)
                            if (c.colore) cParts.push(c.colore)
                            return (
                              <tr key={c.uid} style={{ background: '#ffffff' }}>
                                <td style={{ ...tdS, padding: 4, textAlign: 'center' }} />
                                <td style={{ ...tdS, paddingLeft: 16, textAlign: 'left' }}>
                                  {c.descrizione}{c.note ? ` (${c.note})` : ''}
                                  {cParts.length > 0 && <div style={{ fontSize: 12, color: '#1a1a1a', marginTop: 1 }}>{cParts.join(' · ')}</div>}
                                </td>
                                <td style={{ ...tdS, textAlign: 'center', padding: '4px' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                                    <div style={{ fontSize: 12, color: '#1a1a1a', whiteSpace: 'nowrap' }}>N°&nbsp;{c.quantita}</div>
                                    {isStaff && (
                                    <div style={{ whiteSpace: 'nowrap' }}>
                                      {c.totale_riga === 0
                                        ? <span style={{ fontSize: 10, fontStyle: 'italic', color: '#555' }}>Incluso</span>
                                        : renderPrezzo(c.totale_riga)
                                      }
                                    </div>
                                    )}
                                  </div>
                                </td>
                                <td style={{ ...tdS, padding: '4px 0', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <button type="button" onClick={() => openEdit(c.uid)} className="btn-black btn-icon" style={{ fontFamily: 'inherit' }}>
                                      <span style={{ position: 'relative', zIndex: 1, fontSize: 14, display: 'inline-block', transform: 'rotate(135deg)' }}>✏</span>
                                    </button>
                                    <button type="button" onClick={() => handleRimuovi(c.uid)} className="btn-red btn-icon" style={{ fontFamily: 'inherit' }}>
                                      <span style={{ position: 'relative', zIndex: 1, fontSize: 14 }}>✕</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                          {/* Riga + aggiungi elemento opzionale — solo se espanso */}
                          {isExpanded && (
                            <tr style={{ background: '#ffffff' }}>
                              <td style={{ padding: '4px', textAlign: 'center', borderBottom: '1px solid #333' }}>
                                <button type="button" onClick={() => { setVociSelected(new Set()); setVociFilter(''); setModal({ type: 'voci', parentUid: r.uid }) }}
                                  className="btn-pink btn-icon" style={{ border: 'none' }}>
                                  <span style={{ position: 'relative', zIndex: 1, fontSize: 22, lineHeight: 1, fontWeight: 300 }}>+</span>
                                </button>
                              </td>
                              <td colSpan={3} style={{ padding: '4px 8px', borderBottom: '1px solid #333', fontSize: 11, color: '#555' }}>
                                Aggiungi lavorazioni
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
            <div style={{ background: '#fff', border: '1px solid #222', borderRadius: 8, padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 4, color: '#1a1a1a' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1, fontSize: 12, color: '#1a1a1a', fontWeight: 700 }}>Stima computo (escluso IVA):</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap' }}>{`€ ${fmt(totale)}`}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: '#e8e8e8', borderRadius: 6, overflow: 'hidden', border: '1px solid #9b1c1c' }}>
          <div style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(150,0,0,0.3)' }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: '#9b1c1c', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Computo vuoto
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(150,0,0,0.3)' }} />
          </div>
          <div style={{ background: '#f0f0f0', padding: '5px 10px', textAlign: 'center' }}>
            <p style={{ fontSize: 10, fontWeight: 600, margin: 0, color: '#9b1c1c', textTransform: 'uppercase', textAlign: 'center' }}>
              Aggiungi articoli dal bottone qui sopra.
            </p>
          </div>
        </div>
      )}

      {/* Barra salva */}
      {righe.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #222', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>Descrizione stima (opzionale)</label>
            <input
              type="text"
              value={descrizione}
              onChange={e => setDescrizione(e.target.value)}
              placeholder="es. Ristrutturazione appartamento via Roma"
              style={{ padding: '7px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }}
            />
          </div>
          {saveError && (
            <p style={{ fontSize: 13, color: '#c0392b', margin: 0 }}>{saveError}</p>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {isLoggedIn ? (
              <button type="button" onClick={handleSalva} disabled={isPending}
                className={isPending ? 'btn-gray' : 'btn-green'}
                style={{ flex: 1, minWidth: 200, padding: '0 8px', fontSize: 14, fontFamily: 'inherit' }}>
                {isPending ? 'Salvataggio…' : 'Salva computo metrico →'}
              </button>
            ) : (
              <a href={`/login?redirect_to=/area-clienti/carrello-computometrico`} className="btn-green"
                style={{ flex: 1, minWidth: 200, padding: '0 8px', fontSize: 14, textAlign: 'center' }}>
                Accedi per salvare →
              </a>
            )}
            <button type="button" onClick={handleSvuota} disabled={clearPending}
              className={clearPending ? 'btn-gray' : 'btn-red'}
              style={{ flex: 1, minWidth: 200, padding: '0 8px', fontSize: 14, fontFamily: 'inherit' }}>
              {clearPending ? 'Svuotamento…' : 'Svuota carrello'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
