'use client'

import React, { useState, useMemo, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { aggiungiArticolo, rimuoviArticolo, associaCliente, aggiornaDatiPreventivo, inoltroRichiesta, modificaArticolo, aggiornaSconto, modificaPreventivo, inviaAlCliente, accettaPreventivo, rifiutaPreventivo, annullaPreventivo } from '../actions'
import PreviewInfisso from '@/components/preview-infisso'

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type ListinoItem = {
  id: number
  categoria: string
  produttore: string
  serie?: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  prezzo_acquisto?: number
  sconto_articolo?: number
  fornitore_nome?: string
  principale?: number
  caratteristica?: number
  richiede_tipo_colore?: number
  richiede_tipo_colore_acc?: number
  richiede_tipo_vetro?: number
  richiede_tipo_montaggio?: number
  minimo?: number | null
}

export type Articolo = {
  id: number
  preventivo_id: number
  tipo_prodotto: string
  marca: string
  modello: string
  listino_id: number | null
  prezzo_base: number
  unita: string
  colore: string
  tipo_vetro: string
  accessori: string
  altezza_cm: number
  larghezza_cm: number
  n_ante: number
  quantita: number
  prezzo_totale: number
  prezzo_pre_sconto: number
  sconto_articolo_pct: number
  note: string | null
  parent_id: number | null
  abbr: string
  profilo_mm: number
  listino_foto_url: string
  bar_color: string | null
  bar_color_acc: string | null
}

export type Preventivo = {
  id: number
  numero: string
  cliente_id: number | null
  descrizione: string
  stato: 'bozza' | 'richiesto' | 'inviato' | 'accettato' | 'rifiutato' | 'scaduto' | 'annullato' | 'da inviare'
  importo: number
  data: string
  validita_giorni: number
  note: string | null
  visibile_cliente: number
  sconto_cliente_pct: number
}

export type ClienteOption = { id: number; label: string }

// ─── Dati statici ─────────────────────────────────────────────────────────────

const COLORI = [
  'Bianco RAL 9016', 'Avorio RAL 1015', 'Bruno bronzo', 'Antracite RAL 7016',
  'Grigio metallizzato', 'Nero RAL 9005', 'Oro chiaro', 'Champagne',
  'Silver', 'Inox satinato', 'RAL personalizzato',
]

const TIPI_VETRO = [
  'Singolo 4mm', 'Camera 4+12+4', 'Camera basso-emissivo 4+16+4',
  'Triplo 4+12+4+12+4', 'Acidato', 'Temperato',
  'Stratificato 33.1', 'Stratificato 44.2', 'Opaco sabbiato',
]

const ACCESSORI_LIST = [
  'Maniglia', 'Serratura multipunto', 'Cerniere rinforzate',
  'Zanzariera fissa', 'Zanzariera scorrevole', 'Cassonetto',
  'Tapparella', 'Persiana avvolgibile', 'Sensore apertura', 'Maniglione antipanico',
]

const TIPI_CON_VETRO = new Set([
  'infissi alluminio', 'infissi pvc', 'infissi legno', 'finestre',
  'porte vetrate', 'box doccia', 'verande', 'porte-finestra',
  'scorrevoli', 'alzanti scorrevoli', 'lucernari',
])

function fmt(n: number): string {
  const [int, dec] = Math.abs(n).toFixed(2).split('.')
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec
}

const STATO_COLORS: Record<string, string> = {
  bozza: '#8C0808', richiesto: '#b7791f', inviato: '#2b6cb0', accettato: '#276749',
  rifiutato: '#c00', scaduto: '#8a6d3b', annullato: '#718096',
}

// ─── Stili condivisi ──────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  padding: '7px 10px', border: '1px solid #d0d0d0', borderRadius: 5,
  fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
  background: '#fff',
}

const label: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase',
  letterSpacing: '0.05em', display: 'block', marginBottom: 4,
}

// ─── Dati preventivo (descrizione + note) ────────────────────────────────────

function DatiPreventivo({ preventivo, readOnly = false, isStaff = false }: { preventivo: Preventivo; readOnly?: boolean; isStaff?: boolean }) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [desc, setDesc]       = useState(preventivo.descrizione ?? '')
  const [note, setNote]       = useState(preventivo.note ?? '')
  const [validita, setValidita] = useState(preventivo.validita_giorni)
  const [saved, setSaved]     = useState(false)
  const [open, setOpen]       = useState(false)

  const dirty = desc !== (preventivo.descrizione ?? '') || note !== (preventivo.note ?? '') || (isStaff && validita !== preventivo.validita_giorni)

  function handleSave() {
    const fd = new FormData()
    fd.set('preventivo_id', String(preventivo.id))
    fd.set('descrizione', desc)
    fd.set('note', note)
    fd.set('validita_giorni', String(validita))
    startT(async () => {
      await aggiornaDatiPreventivo(null, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    })
  }

  const header = (
    <button
      type="button"
      onClick={() => setOpen(o => !o)}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}
    >
      <span style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Riferimento e note</span>
      <span style={{ fontSize: 12, color: '#333' }}>{open ? '▲' : '▼'}</span>
    </button>
  )

  if (readOnly) {
    return (
      <div style={{ background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)', border: '1px solid #222', borderRadius: 8, padding: '10px 16px' }}>
        {header}
        {open && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {preventivo.descrizione && (
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Riferimento</span>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#444' }}>{preventivo.descrizione}</p>
              </div>
            )}
            {preventivo.note && (
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Note</span>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666', whiteSpace: 'pre-wrap' }}>{preventivo.note}</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)', border: '1px solid #222', borderRadius: 8, padding: '10px 16px' }}>
      {header}
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Riferimento</span>
            <input
              value={desc}
              onChange={e => { setDesc(e.target.value); setSaved(false) }}
              placeholder="Riferimento…"
              style={{ ...inp, fontSize: 14 }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Note</span>
            <textarea
              value={note}
              onChange={e => { setNote(e.target.value); setSaved(false) }}
              placeholder="Note interne o per il cliente…"
              rows={3}
              style={{ ...inp, resize: 'vertical', fontSize: 13 }}
            />
          </div>
          {isStaff && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Validità (giorni)</span>
              <input
                type="number" min={1} max={365}
                value={validita}
                onChange={e => { setValidita(parseInt(e.target.value) || 5); setSaved(false) }}
                style={{ ...inp, width: 100, fontSize: 13 }}
              />
            </div>
          )}
          <div>
            <button
              onClick={handleSave}
              disabled={pending || !dirty}
              className="btn-green"
              style={{ height: 42, padding: '0 18px', borderRadius: 21, fontSize: 13, fontWeight: 600, opacity: !dirty ? 0.4 : 1 }}
            >
              {saved ? '✓ Salvato' : pending ? '…' : 'Salva'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Selettore cliente ────────────────────────────────────────────────────────

function ClienteSelector({ preventivo_id, cliente_id, clienti }: {
  preventivo_id: number
  cliente_id: number | null
  clienti: ClienteOption[]
}) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [sel, setSel] = useState(cliente_id?.toString() ?? '')
  const [saved, setSaved] = useState(false)

  const current = clienti.find(c => c.id === cliente_id)

  function handleSave() {
    const fd = new FormData()
    fd.set('preventivo_id', String(preventivo_id))
    fd.set('cliente_id', sel)
    startT(async () => {
      await associaCliente(null, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    })
  }

  return (
    <div style={{
      background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)', border: '1px solid #222', borderRadius: 8,
      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 13, color: '#555', fontWeight: 600, whiteSpace: 'nowrap' }}>Cliente:</span>
      <select
        value={sel}
        onChange={e => { setSel(e.target.value); setSaved(false) }}
        style={{
          padding: '5px 8px', border: '1px solid #ccc', borderRadius: 5,
          fontSize: 13, fontFamily: 'inherit', minWidth: 220,
        }}
      >
        <option value="">— Nessun cliente —</option>
        {clienti.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <button
        onClick={handleSave}
        disabled={pending || sel === (cliente_id?.toString() ?? '')}
        className="btn-green"
        style={{
          height: 42, padding: '0 16px', fontSize: 13, fontWeight: 600, borderRadius: 21,
          opacity: sel === (cliente_id?.toString() ?? '') ? 0.4 : 1,
        }}
      >
        {saved ? '✓ Salvato' : pending ? '…' : 'Assegna'}
      </button>
    </div>
  )
}

// ─── Form aggiunta articolo ───────────────────────────────────────────────────

function ArticoloForm({
  preventivo_id, listini, prefill, parentId = null, parentArt = null, existingChildTypes = [], gapTypeFilter = null, altriParentIds = [], onClose, isStaff = true,
}: {
  preventivo_id: number
  listini: ListinoItem[]
  prefill: Partial<Articolo> | null
  parentId?: number | null
  parentArt?: Articolo | null
  existingChildTypes?: string[]
  gapTypeFilter?: 'tipo_colore' | 'tipo_colore_acc' | 'tipo_vetro' | 'tipo_montaggio' | null
  altriParentIds?: number[]
  onClose: () => void
  isStaff?: boolean
}) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')

  const isCaratteristicaMode = parentId !== null && !!gapTypeFilter
  const [tipo, setTipo]         = useState(() =>
    isCaratteristicaMode && parentArt ? parentArt.tipo_prodotto : (prefill?.tipo_prodotto ?? '')
  )
  const [marca, setMarca]       = useState(prefill?.marca ?? '')
  const [listinoId, setListinoId] = useState(prefill?.listino_id?.toString() ?? '')
  const [colore, setColore]     = useState(prefill?.colore ?? '')
  const [tipoVetro, setTipoVetro] = useState(prefill?.tipo_vetro ?? '')
  const [accessoriSel, setAccessoriSel] = useState<string[]>(
    prefill?.accessori ? prefill.accessori.split(',').filter(Boolean) : []
  )

  const listiniFiltrati = useMemo(() => {
    if (parentId !== null) {
      let filtered = listini.filter(l =>
        l.caratteristica === 1 &&
        (parentArt ? l.categoria === parentArt.tipo_prodotto : true)
      )
      if (gapTypeFilter) {
        filtered = filtered.filter(l =>
          gapTypeFilter === 'tipo_colore'     ? (l.richiede_tipo_colore     ?? 0) === 1 :
          gapTypeFilter === 'tipo_colore_acc' ? (l.richiede_tipo_colore_acc ?? 0) === 1 :
          gapTypeFilter === 'tipo_vetro'      ? (l.richiede_tipo_vetro      ?? 0) === 1 :
                                                (l.richiede_tipo_montaggio  ?? 0) === 1
        )
      } else {
        const usedMarche = new Set(existingChildTypes)
        filtered = filtered.filter(l => !usedMarche.has(l.produttore))
      }
      return filtered
    }
    return listini.filter(l => l.principale === 1)
  }, [listini, parentId, parentArt, existingChildTypes, gapTypeFilter])

  const tipi   = useMemo(() => [...new Set(listiniFiltrati.map(l => l.categoria))].sort(), [listiniFiltrati])
  const marche = useMemo(
    () => [...new Set(listiniFiltrati.filter(l => l.categoria === tipo).map(l => l.produttore))].filter(Boolean).sort(),
    [listiniFiltrati, tipo]
  )
  const modelli = useMemo(
    () => isCaratteristicaMode
      ? listiniFiltrati
      : listiniFiltrati.filter(l => l.categoria === tipo && l.produttore === marca),
    [listiniFiltrati, tipo, marca, isCaratteristicaMode]
  )
  const listinoSel = useMemo(
    () => listiniFiltrati.find(l => l.id === parseInt(listinoId)),
    [listiniFiltrati, listinoId]
  )

  const haVetro = TIPI_CON_VETRO.has(tipo.toLowerCase())

  function toggleAccessorio(nome: string) {
    setAccessoriSel(prev =>
      prev.includes(nome) ? prev.filter(x => x !== nome) : [...prev, nome]
    )
  }

  function handleChangeTipo(t: string) {
    setTipo(t); setMarca(''); setListinoId('')
  }

  function handleChangeMarca(m: string) {
    setMarca(m); setListinoId('')
  }

  function buildFd(targetParentId: number | null): FormData {
    const fd = new FormData()
    fd.set('preventivo_id', String(preventivo_id))
    fd.set('listino_id',    listinoId)
    fd.set('prezzo_base',   String(listinoSel?.prezzo_vendita ?? 0))
    fd.set('unita',         listinoSel?.unita ?? 'pz')
    fd.set('modello',       listinoSel?.descrizione ?? '')
    fd.set('tipo_prodotto', tipo)
    fd.set('marca',         marca)
    fd.set('accessori',     accessoriSel.join(','))
    if (targetParentId) fd.set('parent_id', String(targetParentId))
    return fd
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!e.currentTarget.checkValidity()) { e.currentTarget.reportValidity(); return }
    if (!listinoId) { setError('Seleziona un elemento.'); return }
    const fd = isCaratteristicaMode ? buildFd(parentId) : new FormData(e.currentTarget)
    if (!isCaratteristicaMode) {
      fd.set('accessori', accessoriSel.join(','))
      if (parentId) fd.set('parent_id', String(parentId))
      if (listinoSel) {
        fd.set('modello',     listinoSel.descrizione)
        fd.set('prezzo_base', String(listinoSel.prezzo_vendita))
        fd.set('unita',       listinoSel.unita)
      }
    }
    setError('')
    startT(async () => {
      const res = await aggiungiArticolo(null, fd)
      if (!res.ok) { setError(res.error); return }
      router.refresh()
      onClose()
    })
  }

  function handleApplicaATutti() {
    if (!listinoId) { setError('Seleziona una caratteristica.'); return }
    setError('')
    startT(async () => {
      for (const pid of [parentId!, ...altriParentIds]) {
        const res = await aggiungiArticolo(null, buildFd(pid))
        if (!res.ok) { setError(res.error); return }
      }
      router.refresh()
      onClose()
    })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 10, padding: 28, width: '100%', maxWidth: 620,
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: parentId ? 4 : 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
            {parentId ? 'Aggiungi caratteristica' : 'Aggiungi articolo'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888', lineHeight: 1 }}>✕</button>
        </div>
        {parentId && (
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#888' }}>
            Verrà associata all&apos;articolo selezionato come caratteristica.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="preventivo_id" value={preventivo_id} />
          <input type="hidden" name="listino_id"    value={listinoId} />
          {parentId && <input type="hidden" name="parent_id" value={parentId} />}
          <input type="hidden" name="prezzo_base"   value={listinoSel?.prezzo_vendita ?? 0} />
          <input type="hidden" name="unita"         value={listinoSel?.unita ?? 'pz'} />
          <input type="hidden" name="modello"       value={listinoSel?.descrizione ?? ''} />
          <input type="hidden" name="accessori"     value={accessoriSel.join(',')} />

          <div style={{ display: 'grid', gap: 14 }}>

            {isCaratteristicaMode ? (
              <>
                <input type="hidden" name="tipo_prodotto" value={tipo} />
                <input type="hidden" name="marca" value={marca} />
                <div>
                  <span style={label}>Caratteristica *</span>
                  <select
                    value={listinoId}
                    onChange={e => {
                      const id = e.target.value
                      setListinoId(id)
                      const sel = modelli.find(m => m.id === parseInt(id))
                      if (sel) setMarca(sel.produttore)
                    }}
                    style={inp}
                  >
                    <option value="">— Seleziona —</option>
                    {modelli.map(m => {
                      const sc = m.sconto_articolo ?? 0
                      const promo = sc !== 0 ? (sc < 0 ? ` · Magg. +${Math.abs(sc)}%` : ` · Sconto -${sc}%`) : ''
                      const details = isStaff
                        ? ` — acq. €${Number(m.prezzo_acquisto ?? 0).toFixed(2)} / cli. €${Number(m.prezzo_vendita).toFixed(2)}`
                        : ` — €${Number(m.prezzo_vendita).toFixed(2)}`
                      return (
                        <option key={m.id} value={m.id}>
                          {m.descrizione}{m.produttore ? ` · ${m.produttore}` : ''} ({m.unita}{details}){promo}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </>
            ) : (
              <>
                {/* Tipo prodotto */}
                <div>
                  <span style={label}>Tipo prodotto *</span>
                  <select
                    name="tipo_prodotto"
                    value={tipo}
                    onChange={e => handleChangeTipo(e.target.value)}
                    required
                    style={inp}
                  >
                    <option value="">— Seleziona tipo —</option>
                    {tipi.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Marca */}
                {tipo && (
                  <div>
                    <span style={label}>Marca *</span>
                    <select
                      name="marca"
                      value={marca}
                      onChange={e => handleChangeMarca(e.target.value)}
                      required
                      style={inp}
                    >
                      <option value="">— Seleziona marca —</option>
                      {marche.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                )}

                {/* Modello */}
                {marca && (
                  <div>
                    <span style={label}>Modello / Profilo *</span>
                    <select
                      value={listinoId}
                      onChange={e => setListinoId(e.target.value)}
                      style={inp}
                    >
                      <option value="">— Seleziona modello —</option>
                      {modelli.map(m => {
                        const sc = m.sconto_articolo ?? 0
                        const promo = sc !== 0 ? (sc < 0 ? ` · Magg. +${Math.abs(sc)}%` : ` · Sconto -${sc}%`) : ''
                        const details = isStaff
                          ? ` — acq. €${Number(m.prezzo_acquisto ?? 0).toFixed(2)} / cli. €${Number(m.prezzo_vendita).toFixed(2)}${m.fornitore_nome ? ` · ${m.fornitore_nome}` : ''}`
                          : ` — €${Number(m.prezzo_vendita).toFixed(2)}${m.fornitore_nome ? ` · ${m.fornitore_nome}` : ''}`
                        return (
                          <option key={m.id} value={m.id}>
                            {m.descrizione} ({m.unita}{details}){promo}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                )}
              </>
            )}

            {/* Campi dettaglio — visibili solo dopo aver selezionato il modello */}
            {listinoSel && (() => {
              const u = listinoSel.unita?.toLowerCase() ?? ''
              const isMq = u === 'm²' || u === 'mq' || u === 'm2'
              const isMl = u === 'ml' || u === 'm' || u === 'mt'
              const isKg = u === 'kg'
              return (
                <div key={listinoId} style={{ display: 'contents' }}>
                  {haVetro && (
                    <div>
                      <span style={label}>Tipo vetro *</span>
                      <select name="tipo_vetro" value={tipoVetro} onChange={e => setTipoVetro(e.target.value)} required style={inp}>
                        <option value="">— Seleziona vetro —</option>
                        {TIPI_VETRO.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Figlio: dimensioni e quantità ereditati dal padre, non chiederli */}
                  {!parentArt && isMq && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <div>
                        <span style={label}>Larghezza (cm) *</span>
                        <input type="number" name="larghezza_cm" min={0} step="0.1" defaultValue={prefill?.larghezza_cm || ''} style={inp} placeholder="es. 120" required />
                      </div>
                      <div>
                        <span style={label}>Altezza (cm) *</span>
                        <input type="number" name="altezza_cm" min={0} step="0.1" defaultValue={prefill?.altezza_cm || ''} style={inp} placeholder="es. 210" required />
                      </div>
                      <div>
                        <span style={label}>Quantità *</span>
                        <input type="number" name="quantita" min={1} defaultValue={prefill?.quantita ?? 1} style={inp} required />
                      </div>
                    </div>
                  )}

                  {!parentArt && isMl && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <span style={label}>Lunghezza (cm) *</span>
                        <input type="number" name="larghezza_cm" min={0} step="0.1" defaultValue={prefill?.larghezza_cm || ''} style={inp} placeholder="es. 300" required />
                      </div>
                      <div>
                        <span style={label}>Quantità *</span>
                        <input type="number" name="quantita" min={1} defaultValue={prefill?.quantita ?? 1} style={inp} required />
                      </div>
                    </div>
                  )}

                  {!parentArt && isKg && (
                    <div>
                      <span style={label}>Quantità (kg) *</span>
                      <input type="number" name="quantita" min={0.1} step="0.1" defaultValue={prefill?.quantita ?? 1} style={inp} placeholder="es. 5" required />
                    </div>
                  )}

                  {!parentArt && !isMq && !isMl && !isKg && (
                    <div>
                      <span style={label}>Quantità *</span>
                      <input type="number" name="quantita" min={1} defaultValue={prefill?.quantita ?? 1} style={inp} required />
                    </div>
                  )}

                  {parentArt && (
                    <p style={{ margin: 0, fontSize: 12, color: '#888', background: '#f5f5f5', padding: '8px 12px', borderRadius: 5 }}>
                      Dimensioni e quantità ereditati dall&apos;articolo principale ({parentArt.larghezza_cm}×{parentArt.altezza_cm} cm, qtà {parentArt.quantita}).
                    </p>
                  )}

                </div>
              )
            })()}

            {error && (
              <p style={{ color: '#c00', fontSize: 13, margin: 0, background: '#fff5f5', padding: '8px 12px', borderRadius: 5 }}>
                {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
              <button type="button" onClick={onClose} style={{
                height: 42, padding: '0 20px', fontSize: 13, fontWeight: 600,
                border: '1px solid #ccc', borderRadius: 21, background: '#f5f5f5', cursor: 'pointer',
              }}>
                Annulla
              </button>
              {isCaratteristicaMode && altriParentIds.length > 0 && (
                <button type="button" onClick={handleApplicaATutti} disabled={pending || !listinoId}
                  className={pending || !listinoId ? 'btn-gray' : 'btn-green'}
                  style={{ height: 42, padding: '0 18px', fontSize: 13, fontWeight: 700, borderRadius: 21 }}>
                  {pending ? '…' : 'Applica a tutti'}
                </button>
              )}
              <button type="submit" disabled={pending || (isCaratteristicaMode ? !listinoId : (!tipo || !marca || !listinoId))}
                className={pending || (isCaratteristicaMode ? !listinoId : (!tipo || !marca || !listinoId)) ? 'btn-gray' : 'btn-green'}
                style={{ height: 42, padding: '0 22px', fontSize: 13, fontWeight: 700, borderRadius: 21 }}>
                {pending ? '…' : isCaratteristicaMode ? 'Applica' : 'Aggiungi'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Override sconto cliente (staff) ─────────────────────────────────────────

function ScontoClienteEditor({ preventivoId, currentPct }: { preventivoId: number; currentPct: number }) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [val, setVal] = useState(String(currentPct))
  const [saved, setSaved] = useState(false)

  const dirty = parseFloat(val) !== currentPct

  function handleSave() {
    const fd = new FormData()
    fd.set('preventivo_id',      String(preventivoId))
    fd.set('sconto_cliente_pct', val)
    startT(async () => {
      await aggiornaSconto(null, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid #dde3ed' }}>
      <span style={{ fontSize: 12, color: '#888' }}>Override sconto cliente %:</span>
      <input
        type="number" min={0} max={100} step="0.5"
        value={val}
        onChange={e => { setVal(e.target.value); setSaved(false) }}
        style={{ width: 70, padding: '4px 8px', fontSize: 13, border: '1px solid #ccc', borderRadius: 5, fontFamily: 'inherit' }}
      />
      <button
        onClick={handleSave}
        disabled={pending || !dirty}
        className="btn-green"
        style={{ height: 42, padding: '0 14px', fontSize: 12, borderRadius: 21, fontFamily: 'inherit', opacity: !dirty ? 0.4 : 1 }}
      >
        {saved ? '✓' : pending ? '…' : 'Applica'}
      </button>
    </div>
  )
}

// ─── Modale Modifica Articolo (staff) ────────────────────────────────────────

function ModificaArticoloModal({ articolo, parentArt, listini, onClose, isStaff = true }: {
  articolo: Articolo
  parentArt?: Articolo | null
  listini: ListinoItem[]
  onClose: () => void
  isStaff?: boolean
}) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')
  const [magg, setMagg] = useState(Math.abs(articolo.sconto_articolo_pct))

  const isChild = articolo.parent_id !== null
  const uLower  = (articolo.unita ?? '').toLowerCase()
  const isChildUnit = isChild && (uLower === 'm²' || uLower === 'mq' || uLower === 'm2' || uLower === 'ml')
  const childListino = listini.find(l => l.id === articolo.listino_id)
  const isChildMontaggio = isChild && !isChildUnit && (childListino?.richiede_tipo_montaggio ?? 0) === 1
  const isChildPerc = isChild && !isChildUnit && !isChildMontaggio

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('id',            String(articolo.id))
    fd.set('preventivo_id', String(articolo.preventivo_id))
    if (isChild) {
      fd.set('altezza_cm',   String(articolo.altezza_cm))
      fd.set('larghezza_cm', String(articolo.larghezza_cm))
      fd.set('quantita',     String(articolo.quantita))
    }
    if (isChildPerc) {
      fd.set('sconto_articolo_pct', String(-Math.abs(magg)))
      fd.set('prezzo_base',  String(articolo.prezzo_base))
    }
    setError('')
    startT(async () => {
      const res = await modificaArticolo(null, fd)
      if (!res.ok) { setError(res.error); return }
      router.refresh()
      onClose()
    })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 10, padding: 28, width: '100%', maxWidth: isChild ? 400 : 540, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Modifica articolo #{articolo.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888', lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ fontSize: 12, color: '#333', marginBottom: 16 }}>
          {articolo.tipo_prodotto} — {articolo.marca} {articolo.modello}
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 14 }}>
            {isChildUnit ? (
              <>
                {articolo.altezza_cm > 0 && (
                  <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#555' }}>
                    Dimensioni: <strong>{articolo.altezza_cm} × {articolo.larghezza_cm} cm</strong>
                    {parentArt && parentArt.quantita > 0 && <> · Qtà <strong>{parentArt.quantita}</strong></>}
                  </div>
                )}
                <div>
                  <span style={label}>Prezzo unitario ({articolo.unita})</span>
                  <input type="number" name="prezzo_base" min={0} step="0.01" defaultValue={articolo.prezzo_base} style={inp} autoFocus />
                </div>
                <div>
                  <span style={label}>Sconto %</span>
                  <input type="number" name="sconto_articolo_pct" min={-100} max={100} step="0.01" defaultValue={articolo.sconto_articolo_pct} style={inp} />
                </div>
              </>
            ) : isChildMontaggio ? (
              <>
                {parentArt && parentArt.quantita > 0 && (
                  <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#555' }}>
                    Qtà primario: <strong>{parentArt.quantita}</strong>
                  </div>
                )}
                <div>
                  <span style={label}>Prezzo unitario ({articolo.unita})</span>
                  <input type="number" name="prezzo_base" min={0} step="0.01" defaultValue={articolo.prezzo_base} style={inp} autoFocus />
                </div>
                <div>
                  <span style={label}>Sconto %</span>
                  <input type="number" name="sconto_articolo_pct" min={-100} max={100} step="0.01" defaultValue={articolo.sconto_articolo_pct} style={inp} />
                </div>
              </>
            ) : isChildPerc ? (
              <>
                {parentArt && (
                  <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 6, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ ...label, marginBottom: 0 }}>Prezzo articolo primario</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                      <span style={{ fontSize: 14, color: '#aaa', textDecoration: 'line-through' }}>€ {parentArt.prezzo_pre_sconto.toFixed(2)}</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#1a4a8a' }}>€ {parentArt.prezzo_totale.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <div>
                  <span style={label}>Maggiorazione %</span>
                  <input
                    type="number" min={0} max={100} step="0.01"
                    value={magg}
                    onChange={e => setMagg(parseFloat(e.target.value) || 0)}
                    style={inp}
                    autoFocus
                  />
                  {parentArt && magg > 0 && (
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 13, color: '#aaa', textDecoration: 'line-through' }}>
                        € {(parentArt.prezzo_pre_sconto * magg / 100).toFixed(2)}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#1a4a8a' }}>
                        € {(parentArt.prezzo_totale * magg / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <span style={label}>Altezza (cm)</span>
                    <input type="number" name="altezza_cm" min={0} step="0.1" defaultValue={articolo.altezza_cm} style={inp} />
                  </div>
                  <div>
                    <span style={label}>Larghezza (cm)</span>
                    <input type="number" name="larghezza_cm" min={0} step="0.1" defaultValue={articolo.larghezza_cm} style={inp} />
                  </div>
                  <div>
                    <span style={label}>Quantità</span>
                    <input type="number" name="quantita" min={1} defaultValue={articolo.quantita} style={inp} />
                  </div>
                </div>
                {isStaff ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <span style={label}>Prezzo base ({articolo.unita})</span>
                      <input type="number" name="prezzo_base" min={0} step="0.01" defaultValue={articolo.prezzo_base} style={inp} />
                    </div>
                    <div>
                      <span style={label}>Sconto articolo %</span>
                      <input type="number" name="sconto_articolo_pct" min={-100} max={100} step="0.01" defaultValue={articolo.sconto_articolo_pct} style={inp} />
                    </div>
                  </div>
                ) : (
                  <>
                    <input type="hidden" name="prezzo_base" value={articolo.prezzo_base} />
                    <input type="hidden" name="sconto_articolo_pct" value={articolo.sconto_articolo_pct} />
                  </>
                )}
              </>
            )}
            {error && <p style={{ color: '#c00', fontSize: 13, margin: 0, background: '#fff5f5', padding: '8px 12px', borderRadius: 5 }}>{error}</p>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
              <button type="button" onClick={onClose} className="btn-red">Annulla</button>
              <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={{ padding: '0 22px' }}>
                {pending ? 'Salvataggio…' : 'Salva modifiche'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Modale Inoltra Richiesta ─────────────────────────────────────────────────

function InoltraModal({
  preventivo, clienteEmail, clienteCellulare, onClose,
}: {
  preventivo: Preventivo
  clienteEmail: string
  clienteCellulare: string
  onClose: () => void
}) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')
  const [email, setEmail]         = useState(clienteEmail)
  const [cellulare, setCellulare] = useState(clienteCellulare)
  const [note, setNote]           = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.set('preventivo_id', String(preventivo.id))
    fd.set('email',     email)
    fd.set('cellulare', cellulare)
    fd.set('note',      note)
    setError('')
    startT(async () => {
      const res = await inoltroRichiesta(null, fd)
      if (!res.ok) { setError(res.error); return }
      router.refresh()
      onClose()
    })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 10, padding: 28, width: '100%', maxWidth: 480,
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Conferma richiesta preventivo</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888', lineHeight: 1 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <span style={label}>N° Preventivo</span>
              <input value={preventivo.numero || `#${preventivo.id}`} readOnly style={{ ...inp, background: '#f5f5f5', color: '#888' }} />
            </div>
            <div>
              <span style={label}>Email *</span>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inp} />
            </div>
            <div>
              <span style={label}>Cellulare</span>
              <input type="tel" value={cellulare} onChange={e => setCellulare(e.target.value)} style={inp} placeholder="+39 000 0000000" />
            </div>
            <div>
              <span style={label}>Note (opzionale)</span>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="Eventuali richieste specifiche…" />
            </div>
            {error && (
              <p style={{ color: '#c00', fontSize: 13, margin: 0, background: '#fff5f5', padding: '8px 12px', borderRadius: 5 }}>{error}</p>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4, alignItems: 'center' }}>
              <button type="button" onClick={onClose} style={{
                height: 42, borderRadius: 21, fontSize: 13, fontWeight: 600, border: 'none',
                background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#5a0000 0%,#8c0808 20%,#a01212 45%,#8c0808 80%,#5a0000 100%)',
                boxShadow: '0 4px 14px rgba(100,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.07)',
                color: '#fff', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 20, paddingRight: 20,
              }}>
                Annulla
              </button>
              <button type="submit" disabled={pending}
                className={pending ? 'btn-gray' : 'btn-green'}
                style={{ height: 42, borderRadius: 21, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 22, paddingRight: 22 }}>
                {pending ? 'Inoltro…' : 'Inoltra'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function PreventivoClient({
  preventivo, articoli, listini, clienti, isStaff = true,
  clienteEmail = '', clienteCellulare = '', backHref, stampaHref,
}: {
  preventivo: Preventivo
  articoli: Articolo[]
  listini: ListinoItem[]
  clienti: ClienteOption[]
  isStaff?: boolean
  clienteEmail?: string
  clienteCellulare?: string
  backHref?: string
  stampaHref?: string
}) {
  const router = useRouter()
  const [showForm, setShowForm]         = useState(false)
  const [showInoltra, setShowInoltra]   = useState(false)
  const [editArticolo, setEditArticolo] = useState<Articolo | null>(null)
  const [prefill, setPrefill]           = useState<Partial<Articolo> | null>(null)
  const [parentId, setParentId]         = useState<number | null>(null)
  const [parentArt, setParentArt]       = useState<Articolo | null>(null)
  const [gapType, setGapType]           = useState<'tipo_colore' | 'tipo_colore_acc' | 'tipo_vetro' | 'tipo_montaggio' | null>(null)
  const [modificaPending, startModifica]  = useTransition()
  const [inviaPending, startInvia]        = useTransition()
  const [inviaError, setInviaError]       = useState('')
  const [accettaPending, startAccetta]    = useTransition()
  const [rifiutaPending, startRifiuta]    = useTransition()
  const [annullaPending, startAnnulla]    = useTransition()
  const [statoLocale, setStatoLocale]     = useState(preventivo.stato)
  const [importo, setImporto]             = useState(preventivo.importo)
  useEffect(() => { setImporto(preventivo.importo) }, [preventivo.importo])
  useEffect(() => { setStatoLocale(preventivo.stato) }, [preventivo.stato])
  const [delPending, startDel]            = useTransition()
  const [previewArt, setPreviewArt]        = useState<Articolo | null>(null)
  const [isTouch, setIsTouch]              = useState(false)
  useEffect(() => { setIsTouch(window.matchMedia('(pointer: coarse)').matches) }, [])
  const [expandedIds, setExpandedIds]      = useState<Set<number>>(() => new Set())
  function toggleExpand(id: number) {
    setExpandedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const lastArticolo = articoli.filter(a => !a.parent_id).at(-1) ?? null

  const altriParentIds = useMemo(() => {
    if (!gapType || parentId === null) return []
    const currentRoot = articoli.find(a => a.id === parentId)
    if (!currentRoot) return []
    const fl = gapType === 'tipo_colore' ? 'richiede_tipo_colore' as const : gapType === 'tipo_colore_acc' ? 'richiede_tipo_colore_acc' as const : gapType === 'tipo_vetro' ? 'richiede_tipo_vetro' as const : 'richiede_tipo_montaggio' as const
    return articoli
      .filter(a => !a.parent_id && a.id !== parentId && a.tipo_prodotto === currentRoot.tipo_prodotto)
      .filter(a => {
        const rootListino = listini.find(l => l.id === a.listino_id)
        if ((rootListino?.[fl] ?? 0) !== 1) return false
        const kids = articoli.filter(c => c.parent_id === a.id)
        return !kids.map(c => listini.find(l => l.id === c.listino_id)).some(l => (l?.[fl] ?? 0) === 1)
      })
      .map(a => a.id)
  }, [articoli, listini, gapType, parentId])

  const tuttiSanati = useMemo(() => {
    const roots = articoli.filter(a => !a.parent_id)
    if (roots.length === 0) return false
    return roots.every(a => {
      const children = articoli.filter(c => c.parent_id === a.id)
      const rootListino = listini.find(l => l.id === a.listino_id)
      const needsC  = (rootListino?.richiede_tipo_colore     ?? 0) === 1
      const needsCA = (rootListino?.richiede_tipo_colore_acc ?? 0) === 1
      const needsV  = (rootListino?.richiede_tipo_vetro      ?? 0) === 1
      const needsM  = (rootListino?.richiede_tipo_montaggio  ?? 0) === 1
      if (needsC || needsCA || needsV || needsM) {
        const cl = children.map(c => listini.find(l => l.id === c.listino_id))
        const okC  = !needsC  || cl.some(l => (l?.richiede_tipo_colore     ?? 0) === 1)
        const okCA = !needsCA || cl.some(l => (l?.richiede_tipo_colore_acc ?? 0) === 1)
        const okV  = !needsV  || cl.some(l => (l?.richiede_tipo_vetro      ?? 0) === 1)
        const okM  = !needsM  || cl.some(l => (l?.richiede_tipo_montaggio  ?? 0) === 1)
        return okC && okCA && okV && okM
      }
      const usedMarche = new Set(children.map(c => c.marca))
      return !listini.some(l => l.caratteristica === 1 && l.categoria === a.tipo_prodotto && !usedMarche.has(l.produttore))
    })
  }, [articoli, listini])

  function openNuovo() {
    setPrefill(null)
    setParentId(null)
    setShowForm(true)
  }

  function openTipoPrecedente() {
    if (!lastArticolo) return
    setPrefill({
      tipo_prodotto: lastArticolo.tipo_prodotto,
      marca:         lastArticolo.marca,
      listino_id:    lastArticolo.listino_id,
      colore:        lastArticolo.colore,
      tipo_vetro:    lastArticolo.tipo_vetro,
      accessori:     lastArticolo.accessori,
    })
    setParentId(null)
    setShowForm(true)
  }

  function openCaratteristica(artId: number, marcaPrefill?: string, gap?: 'tipo_colore' | 'tipo_colore_acc' | 'tipo_vetro' | 'tipo_montaggio') {
    const art = articoli.find(a => a.id === artId) ?? null
    setPrefill(marcaPrefill ? { marca: marcaPrefill, tipo_prodotto: art?.tipo_prodotto ?? '' } : null)
    setGapType(gap ?? null)
    setParentId(artId)
    setParentArt(art)
    setShowForm(true)
  }

  function handleElimina(art: Articolo) {
    const label = art.parent_id ? `la caratteristica "${art.modello || art.tipo_prodotto}"` : `l'articolo "${art.modello || art.tipo_prodotto}"`
    if (!confirm(`Eliminare ${label}?`)) return
    const fd = new FormData()
    fd.set('id',            String(art.id))
    fd.set('preventivo_id', String(preventivo.id))
    startDel(async () => {
      await rimuoviArticolo(null, fd)
      router.refresh()
    })
  }

  function handleModifica() {
    const fd = new FormData()
    fd.set('preventivo_id', String(preventivo.id))
    startModifica(async () => {
      const res = await modificaPreventivo(null, fd)
      if (!res.ok) { alert('Errore: ' + res.error); return }
      router.push(`/clienti/preventivi/${res.cloneId}`)
    })
  }

  function handleInvia() {
    if (!confirm('Inviare il preventivo al cliente?')) return
    const fd = new FormData()
    fd.set('preventivo_id', String(preventivo.id))
    setInviaError('')
    startInvia(async () => {
      const res = await inviaAlCliente(null, fd)
      if (!res.ok) { setInviaError(res.error); return }
      router.push(isStaff ? `/clienti/preventivi/${res.cloneId}` : `/area-clienti/preventivi/${res.cloneId}`)
    })
  }

  function handleAccetta() {
    if (!confirm('Accettare questo preventivo?')) return
    const fd = new FormData()
    fd.set('preventivo_id', String(preventivo.id))
    startAccetta(async () => {
      const res = await accettaPreventivo(null, fd)
      if (res.ok) { setStatoLocale('accettato'); router.refresh() }
    })
  }

  function handleRifiuta() {
    if (!confirm('Rifiutare questo preventivo?')) return
    const fd = new FormData()
    fd.set('preventivo_id', String(preventivo.id))
    startRifiuta(async () => {
      const res = await rifiutaPreventivo(null, fd)
      if (res.ok) { setStatoLocale('rifiutato'); router.refresh() }
    })
  }

  function handleAnnulla() {
    if (!confirm('Annullare questo preventivo? L\'operazione è irreversibile.')) return
    const fd = new FormData()
    fd.set('preventivo_id', String(preventivo.id))
    startAnnulla(async () => {
      const res = await annullaPreventivo(null, fd)
      if (res.ok) { setStatoLocale('annullato'); router.refresh() }
    })
  }


  const thS: React.CSSProperties = {
    padding: '8px 8px', fontSize: 12, fontWeight: 700, color: '#1a1a1a',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    borderBottom: '1px solid #222', whiteSpace: 'nowrap',
    fontFamily: 'monospace',
  }
  const tdS: React.CSSProperties = {
    padding: '2px 8px', fontSize: 12, color: '#1a1a1a',
    borderBottom: '1px solid #222', verticalAlign: 'middle',
    overflow: 'hidden', wordBreak: 'break-word', fontFamily: 'monospace',
  }

  const VERDE = 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)'
  const ROSA  = 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)'

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h2 className="effetto-3d" style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            Preventivo {preventivo.numero || `#${preventivo.id}`}
          </h2>
          <span style={{
            fontSize: 12, fontWeight: 700, color: STATO_COLORS[statoLocale] ?? '#888',
            borderBottom: `3px solid ${STATO_COLORS[statoLocale] ?? '#888'}`,
            paddingBottom: 1, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {statoLocale === 'bozza' ? 'provvisorio' : statoLocale}
          </span>
        </div>
      </div>

      {/* Riferimento e note */}
      <DatiPreventivo preventivo={preventivo} readOnly={!isStaff && preventivo.stato !== 'bozza'} isStaff={isStaff} />

      {/* Selettore cliente — solo staff */}
      {isStaff && (
        <ClienteSelector
          preventivo_id={preventivo.id}
          cliente_id={preventivo.cliente_id}
          clienti={clienti}
        />
      )}

      {/* Pulsanti azione */}
      <div style={{ background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)', border: '1px solid #222', borderRadius: 8, padding: '12px 16px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {(preventivo.stato === 'bozza' || (isStaff && preventivo.stato === 'da inviare')) && (
          <>
            <button
              onClick={openNuovo}
              className="btn-green"
              style={{ flex: 1, minWidth: 'max-content', height: 42, padding: '0 20px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', borderRadius: 21 }}
            >
              + Aggiungi articolo
            </button>

            {lastArticolo && (
              <button
                onClick={openTipoPrecedente}
                className="btn-green"
                style={{ flex: 1, minWidth: 'max-content', height: 42, padding: '0 20px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', borderRadius: 21 }}
              >
                + Ripeti articolo
              </button>
            )}
          </>
        )}

        {tuttiSanati ? (
          <a
            href={stampaHref ?? `/area-clienti/preventivi/${preventivo.id}/stampa`}
            className="btn-black"
            style={{ flex: 1, minWidth: 'max-content', height: 42, padding: '0 20px', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', borderRadius: 21 }}
          >
            Stampa / PDF
          </a>
        ) : (
          <span
            className="btn-gray"
            style={{ flex: 1, minWidth: 'max-content', height: 42, padding: '0 20px', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'not-allowed', opacity: 0.5, whiteSpace: 'nowrap', borderRadius: 21 }}
            title="Completa tutte le caratteristiche prima di stampare"
          >
            Stampa / PDF
          </span>
        )}

        {!isStaff && preventivo.stato === 'bozza' && (
          <button
            onClick={() => setShowInoltra(true)}
            disabled={!tuttiSanati}
            className={!tuttiSanati ? 'btn-gray' : 'btn-black'}
            style={{ flex: 1, minWidth: 'max-content', height: 42, padding: '0 22px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', opacity: !tuttiSanati ? 0.5 : 1, cursor: !tuttiSanati ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', borderRadius: 21 }}
            title={!tuttiSanati ? 'Completa tutte le caratteristiche prima di inviare' : undefined}
          >
            <span className={tuttiSanati ? 'animato' : ''}>Inoltra richiesta</span>
          </button>
        )}

        {isStaff && preventivo.stato === 'richiesto' && (
          <button
            onClick={handleModifica}
            disabled={modificaPending}
            className={modificaPending ? 'btn-gray' : 'btn-black'}
            style={{ flex: 1, minWidth: 'max-content', height: 42, padding: '0 22px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', borderRadius: 21 }}
          >
            {modificaPending ? 'Preparazione…' : 'Modifica'}
          </button>
        )}

        {isStaff && (preventivo.stato === 'bozza' || preventivo.stato === 'da inviare') && (
          <button
            onClick={handleInvia}
            disabled={inviaPending || !tuttiSanati}
            className={inviaPending || !tuttiSanati ? 'btn-gray' : 'btn-green'}
            style={{ flex: 1, minWidth: 'max-content', height: 42, padding: '0 22px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', opacity: !tuttiSanati ? 0.5 : 1, cursor: !tuttiSanati ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', borderRadius: 21 }}
            title={!tuttiSanati ? 'Completa tutte le caratteristiche prima di inviare' : undefined}
          >
            {inviaPending ? 'Invio…' : 'Invia al cliente'}
          </button>
        )}

        {!isStaff && statoLocale === 'inviato' && (
          <>
            <button
              onClick={handleAccetta}
              disabled={accettaPending}
              className={accettaPending ? 'btn-gray' : 'btn-green'}
              style={{ flex: 1, minWidth: 'max-content', height: 42, padding: '0 22px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', borderRadius: 21 }}
            >
              {accettaPending ? '…' : 'Accetta'}
            </button>
            <button
              onClick={handleRifiuta}
              disabled={rifiutaPending}
              className={rifiutaPending ? 'btn-gray' : 'btn-red'}
              style={{ flex: 1, minWidth: 'max-content', height: 42, padding: '0 22px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', borderRadius: 21 }}
            >
              {rifiutaPending ? '…' : 'Rifiuta'}
            </button>
          </>
        )}

        {isStaff && statoLocale !== 'annullato' && (
          <button
            onClick={handleAnnulla}
            disabled={annullaPending}
            className={annullaPending ? 'btn-gray' : 'btn-red'}
            style={{ flex: 1, minWidth: 'max-content', height: 42, padding: '0 22px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', borderRadius: 21 }}
          >
            {annullaPending ? '…' : 'Annulla preventivo'}
          </button>
        )}
      </div>

      {inviaError && (
        <div style={{ background: '#fff5f5', color: '#c00', border: '1px solid #fed7d7', borderRadius: 6, padding: '10px 16px', fontSize: 13 }}>
          {inviaError}
        </div>
      )}

      {/* Tabella articoli */}
      {articoli.length === 0 ? (
        <p style={{ color: '#000', fontSize: 14 }}>
          Nessun articolo aggiunto. Usa «Aggiungi articolo» per iniziare.
        </p>
      ) : (() => {
        const roots = articoli.filter(a => !a.parent_id)
        const childrenOf = (id: number) => articoli.filter(a => a.parent_id === id)
        const canEdit = preventivo.stato === 'bozza' || preventivo.stato === 'richiesto' || (isStaff && preventivo.stato === 'da inviare')

        function childTypeOrder(child: Articolo): number {
          const l = listini.find(li => li.id === child.listino_id)
          if ((l?.richiede_tipo_colore     ?? 0) === 1) return 0
          if ((l?.richiede_tipo_colore_acc ?? 0) === 1) return 1
          if ((l?.richiede_tipo_vetro      ?? 0) === 1) return 2
          if ((l?.richiede_tipo_montaggio  ?? 0) === 1) return 3
          return 4
        }
        const groups: Articolo[][] = roots.map(root => {
          const kids = childrenOf(root.id).slice().sort((a, b) => childTypeOrder(a) - childTypeOrder(b))
          return [root, ...kids]
        })

        const catGroups: { key: string; label: string; groups: Articolo[][] }[] = []
        for (const group of groups) {
          const root = group[0]
          const serie = listini.find(l => l.id === root.listino_id)?.serie ?? ''
          const key = `${root.tipo_prodotto}||${root.marca}||${serie}`
          let cg = catGroups.find(c => c.key === key)
          if (!cg) {
            cg = { key, label: [root.tipo_prodotto, root.marca, serie].filter(Boolean).join(' · '), groups: [] }
            catGroups.push(cg)
          }
          cg.groups.push(group)
        }

        const artHasLacune = (root: Articolo, childs: Articolo[]) => {
          const rl = listini.find(l => l.id === root.listino_id)
          const nC  = (rl?.richiede_tipo_colore     ?? 0) === 1
          const nCA = (rl?.richiede_tipo_colore_acc ?? 0) === 1
          const nV  = (rl?.richiede_tipo_vetro      ?? 0) === 1
          const nM  = (rl?.richiede_tipo_montaggio  ?? 0) === 1
          const tg  = nC || nCA || nV || nM
          const cl  = childs.map(c => listini.find(l => l.id === c.listino_id))
          return tg
            ? ((nC  && !cl.some(l => (l?.richiede_tipo_colore     ?? 0) === 1)) ||
               (nCA && !cl.some(l => (l?.richiede_tipo_colore_acc ?? 0) === 1)) ||
               (nV  && !cl.some(l => (l?.richiede_tipo_vetro      ?? 0) === 1)) ||
               (nM  && !cl.some(l => (l?.richiede_tipo_montaggio  ?? 0) === 1)))
            : canEdit && [...new Set(listini.filter(l => l.caratteristica === 1 && l.categoria === root.tipo_prodotto && l.produttore).map(l => l.produttore))].some(p => !childs.some(c => c.marca === p))
        }
        const anyLacune = groups.some(grp => artHasLacune(grp[0], grp.slice(1)))

        let globalIdx = 0
        return (
          <div className="carrello-overflow" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            {catGroups.map(cg => {
              const groupComplete = cg.groups.every(grp => !artHasLacune(grp[0], grp.slice(1)))
              const groupBg = groupComplete ? VERDE : ROSA
              return (
              <div key={cg.key} style={{ background: groupBg, border: '1px solid #222', borderRadius: 8, overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ padding: '6px 14px', background: VERDE, borderBottom: '1px solid #222', fontSize: 12, fontWeight: 700, color: '#1a1a1a', fontFamily: 'monospace' }}>
                  {cg.label}
                </div>
                <table className="carrello-table" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: 50 }} />
                    <col style={{ width: 54 }} />
                    <col />
                    <col style={{ width: 70 }} />
                    <col style={{ width: 50 }} />
                  </colgroup>
                  <thead>
                    <tr style={{ background: VERDE }}>
                      <th style={{ ...thS, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
                        </div>
                      </th>
                      <th style={{ ...thS, textAlign: 'center' }}>Q.tà<br/>Rif.</th>
                      <th style={{ ...thS }}>Articolo</th>
                      <th style={{ ...thS, textAlign: 'center', width: 70, textTransform: 'none', letterSpacing: 0 }}>Prezzo €</th>
                      <th style={{ ...thS, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <span style={{ fontSize: 14, display: 'inline-block', transform: 'rotate(135deg)', lineHeight: 1 }}>✏</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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
                      const isExpanded = expandedIds.has(root.id)
                      const rootListino = listini.find(l => l.id === root.listino_id)
                      const needsC  = (rootListino?.richiede_tipo_colore     ?? 0) === 1
                      const needsCA = (rootListino?.richiede_tipo_colore_acc ?? 0) === 1
                      const needsV  = (rootListino?.richiede_tipo_vetro      ?? 0) === 1
                      const needsM  = (rootListino?.richiede_tipo_montaggio  ?? 0) === 1
                      const useTypeGaps = needsC || needsCA || needsV || needsM

                      // calcola lacune
                      const cl = children.map(c => listini.find(l => l.id === c.listino_id))
                      const hasLacune = useTypeGaps
                        ? (
                          (needsC  && !cl.some(l => (l?.richiede_tipo_colore     ?? 0) === 1)) ||
                          (needsCA && !cl.some(l => (l?.richiede_tipo_colore_acc ?? 0) === 1)) ||
                          (needsV  && !cl.some(l => (l?.richiede_tipo_vetro      ?? 0) === 1)) ||
                          (needsM  && !cl.some(l => (l?.richiede_tipo_montaggio  ?? 0) === 1))
                        )
                        : canEdit && [...new Set(listini.filter(l => l.caratteristica === 1 && l.categoria === root.tipo_prodotto && l.produttore).map(l => l.produttore))].some(p => !children.some(c => c.marca === p))

                      const hasDetails = children.length > 0 || hasLacune
                      const expandBgRoot = isExpanded ? (hasLacune ? '#f5b8b4' : '#b8d9b8') : undefined
                      const expandBg    = isExpanded ? (hasLacune ? '#fdecea' : '#d6ecd6') : undefined

                      // gap rows
                      let gapRows: React.ReactNode
                      if (canEdit && useTypeGaps) {
                        const showC  = needsC  && !cl.some(l => (l?.richiede_tipo_colore     ?? 0) === 1)
                        const showCA = needsCA && !cl.some(l => (l?.richiede_tipo_colore_acc ?? 0) === 1)
                        const showV  = needsV  && !cl.some(l => (l?.richiede_tipo_vetro      ?? 0) === 1)
                        const showM  = needsM  && !cl.some(l => (l?.richiede_tipo_montaggio  ?? 0) === 1)
                        gapRows = (showC || showCA || showV || showM) ? (
                          <tr style={{ background: '#ffffff' }}>
                            <td colSpan={5} style={{ padding: 8, borderBottom: '1px solid #333', borderRight: 'none', textAlign: 'left', background: '#ffffff' }}>
                              <div style={{ display: 'flex', gap: 8 }}>
                                {showC  && <button onClick={() => openCaratteristica(root.id, undefined, 'tipo_colore')}     style={{ flex: 1, height: 42, padding: '0 10px', borderRadius: 21, fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', border: '1px solid #000', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>+ Colore</button>}
                                {showCA && <button onClick={() => openCaratteristica(root.id, undefined, 'tipo_colore_acc')} style={{ flex: 1, height: 42, padding: '0 10px', borderRadius: 21, fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', border: '1px solid #000', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>+ Accessori</button>}
                                {showV  && <button onClick={() => openCaratteristica(root.id, undefined, 'tipo_vetro')}      style={{ flex: 1, height: 42, padding: '0 10px', borderRadius: 21, fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', border: '1px solid #000', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>+ Vetro</button>}
                                {showM  && <button onClick={() => openCaratteristica(root.id, undefined, 'tipo_montaggio')}  style={{ flex: 1, height: 42, padding: '0 10px', borderRadius: 21, fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', border: '1px solid #000', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>+ Montaggio</button>}
                              </div>
                            </td>
                          </tr>
                        ) : null
                      } else {
                        const usedMarche = new Set(children.map(c => c.marca))
                        const gapProduttori = canEdit
                          ? ([...new Set(listini.filter(l => l.caratteristica === 1 && l.categoria === root.tipo_prodotto && l.produttore && !usedMarche.has(l.produttore)).map(l => l.produttore))] as string[])
                          : [] as string[]
                        gapRows = gapProduttori.map(prod => (
                          <tr key={`gap-${root.id}-${prod}`} style={{ background: '#ffffff' }}>
                            <td style={{ padding: '4px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
                              <button onClick={() => openCaratteristica(root.id, prod)}
                                style={{ width: 42, height: 42, padding: 0, borderRadius: 21, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>
                                <span style={{ position: 'relative', zIndex: 1, fontSize: 22, lineHeight: 1, fontWeight: 300 }}>+</span>
                              </button>
                            </td>
                            <td colSpan={4} style={{ padding: '4px 8px', borderBottom: '1px solid #f0f0f0' }}>
                              <span style={{ fontSize: 11, color: '#8b0000', background: '#fff', border: '1px solid #e53e3e', borderRadius: 4, padding: '3px 8px', display: 'inline-block' }}>
                                {root.tipo_prodotto} — {prod}
                              </span>
                            </td>
                          </tr>
                        ))
                      }

                      return (
                        <React.Fragment key={root.id}>
                          {/* ── Riga articolo principale ── */}
                          <tr style={{ background: hasLacune ? ROSA : VERDE, borderTop: groupIdx > 0 ? '1px solid #333' : undefined }}>
                            {/* Col 1: eye + expand */}
                            <td style={{ ...tdS, textAlign: 'center', padding: '4px 0' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <button onClick={() => setPreviewArt(root)} disabled={hasLacune || (!root.abbr && !root.listino_foto_url)} className={(hasLacune || (!root.abbr && !root.listino_foto_url)) ? 'btn-gray' : 'btn-black'} title="Anteprima infisso"
                                  style={{ width: 42, height: 42, padding: 0, borderRadius: 21, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <svg style={{ position: 'relative', zIndex: 1 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                {hasDetails && (
                                  <button type="button" onClick={() => toggleExpand(root.id)}
                                    className={hasLacune ? 'btn-red' : 'btn-black'}
                                    style={{ width: 42, height: 42, padding: 0, borderRadius: 21, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                    <svg style={{ position: 'relative', zIndex: 1 }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
                                    <span style={{ position: 'relative', zIndex: 1, fontSize: 10 }}>{isExpanded ? '▴' : '▾'}</span>
                                  </button>
                                )}
                              </div>
                            </td>
                            {/* Col 2: N°qty / Rif# */}
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
                            {/* Col 3: Articolo */}
                            <td style={{ ...tdS, paddingLeft: 8 }}>
                              {root.modello || '—'}
                              {(() => {
                                const parts: string[] = []
                                if (root.larghezza_cm > 0) parts.push(`L:${root.larghezza_cm}`)
                                if (root.altezza_cm > 0)   parts.push(`H:${root.altezza_cm}`)
                                if (root.n_ante > 1) parts.push(`${root.n_ante} ante`)
                                if (root.colore) parts.push(root.colore)
                                return <div style={{ fontSize: 12, color: '#1a1a1a', marginTop: 1 }}>{parts.join(' · ')}</div>
                              })()}
                              {root.note && <div style={{ fontSize: 12, color: '#555', marginTop: 1, fontStyle: 'italic' }}>{root.note}</div>}
                            </td>
                            {/* Col 4: Prezzo */}
                            <td style={{ ...tdS, whiteSpace: 'nowrap', padding: '2px 0 2px 4px' }}>
                              {isExpanded ? (
                                <>
                                  {root.sconto_articolo_pct !== 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0, fontFamily: 'monospace' }}>
                                      {root.prezzo_pre_sconto > 0 && (
                                        <span style={{ color: '#aaa', fontSize: 12, textDecoration: 'line-through' }}>{fmt(root.prezzo_pre_sconto)}</span>
                                      )}
                                      <span style={{ fontSize: 12, color: root.sconto_articolo_pct < 0 ? '#1565c0' : '#e65100' }}>
                                        {root.sconto_articolo_pct < 0 ? `+${Math.abs(root.sconto_articolo_pct)}%` : `−${root.sconto_articolo_pct}%`}
                                      </span>
                                    </div>
                                  )}
                                  {renderPrezzo(root.prezzo_totale)}
                                </>
                              ) : (() => {
                                const lordo   = root.prezzo_pre_sconto + children.reduce((s, c) => s + c.prezzo_pre_sconto, 0)
                                const netto   = root.prezzo_totale     + children.reduce((s, c) => s + c.prezzo_totale,     0)
                                const hasDiff = Math.abs(lordo - netto) >= 0.01
                                return (
                                  <>
                                    {hasDiff && (
                                      <div style={{ display: 'flex', justifyContent: 'flex-end', fontFamily: 'monospace' }}>
                                        <span style={{ color: '#aaa', fontSize: 12, textDecoration: 'line-through' }}>{fmt(lordo)}</span>
                                      </div>
                                    )}
                                    {renderPrezzo(netto)}
                                  </>
                                )
                              })()}
                            </td>
                            {/* Col 5: ✏ ✕ */}
                            <td style={{ ...tdS, padding: '4px 0', textAlign: 'center' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                {canEdit && (
                                  <button onClick={() => setEditArticolo(root)} className="btn-black" title="Modifica"
                                    style={{ width: 42, height: 42, padding: 0, borderRadius: 21, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ position: 'relative', zIndex: 1, fontSize: 13, display: 'inline-block', transform: 'rotate(135deg)' }}>✏</span>
                                  </button>
                                )}
                                {canEdit && (
                                  <button onClick={() => handleElimina(root)} disabled={delPending} className="btn-red"
                                    style={{ width: 42, height: 42, padding: 0, borderRadius: 21, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ position: 'relative', zIndex: 1, fontSize: 13 }}>✕</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* ── Righe caratteristiche figlie (espanse) ── */}
                          {isExpanded && children.map(child => (
                            <tr key={child.id} style={{ background: '#ffffff' }}>
                              {/* Col 1: foto */}
                              <td style={{ ...tdS, padding: 4, textAlign: 'center' }}>
                                {child.listino_foto_url && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={child.listino_foto_url.startsWith('/') ? child.listino_foto_url : `/${child.listino_foto_url}`}
                                    alt=""
                                    style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 4, display: 'block', margin: '0 auto' }}
                                  />
                                )}
                              </td>
                              {/* Col 2: tipo caratteristica */}
                              <td style={{ ...tdS, textAlign: 'center', whiteSpace: 'nowrap', padding: '2px 4px' }}>
                                {(() => {
                                  const l = listini.find(li => li.id === child.listino_id)
                                  return (l?.richiede_tipo_colore     ?? 0) === 1 ? 'Colore'
                                    : (l?.richiede_tipo_colore_acc ?? 0) === 1 ? 'Accessori'
                                    : (l?.richiede_tipo_vetro      ?? 0) === 1 ? 'Vetro'
                                    : (l?.richiede_tipo_montaggio  ?? 0) === 1 ? 'Montaggio'
                                    : ''
                                })()}
                              </td>
                              {/* Col 3: descrizione */}
                              <td style={{ ...tdS, paddingLeft: 12 }}>
                                <span style={{ fontSize: 11, color: '#777' }}>↳</span>{' '}
                                {child.modello || child.tipo_prodotto || '—'}
                                {child.note && <div style={{ fontSize: 12, color: '#555', marginTop: 1, fontStyle: 'italic' }}>{child.note}</div>}
                              </td>
                              {/* Col 4: contributo prezzo */}
                              <td style={{ ...tdS, whiteSpace: 'nowrap', padding: '2px 0 2px 4px' }}>
                                {child.sconto_articolo_pct !== 0 && (
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0, fontFamily: 'monospace' }}>
                                    {child.prezzo_pre_sconto !== 0 && (
                                      <span style={{ color: '#aaa', fontSize: 12, textDecoration: 'line-through' }}>{fmt(Math.abs(child.prezzo_pre_sconto))}</span>
                                    )}
                                    <span style={{ fontSize: 12, color: child.sconto_articolo_pct < 0 ? '#1565c0' : '#e65100' }}>
                                      {child.sconto_articolo_pct < 0 ? `+${Math.abs(child.sconto_articolo_pct)}%` : `−${child.sconto_articolo_pct}%`}
                                    </span>
                                  </div>
                                )}
                                {renderPrezzo(child.prezzo_totale)}
                              </td>
                              {/* Col 5: ✏ ✕ */}
                              <td style={{ ...tdS, padding: '4px 0', textAlign: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                  {isStaff && canEdit && (
                                    <button onClick={() => setEditArticolo(child)} className="btn-black" title="Modifica"
                                      style={{ width: 42, height: 42, padding: 0, borderRadius: 21, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <span style={{ position: 'relative', zIndex: 1, fontSize: 13, display: 'inline-block', transform: 'rotate(135deg)' }}>✏</span>
                                    </button>
                                  )}
                                  {canEdit && (
                                    <button onClick={() => handleElimina(child)} disabled={delPending} className="btn-red"
                                      style={{ width: 42, height: 42, padding: 0, borderRadius: 21, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <span style={{ position: 'relative', zIndex: 1, fontSize: 13 }}>✕</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}

                          {/* ── Gap rows (visibili solo se espanso) ── */}
                          {isExpanded && gapRows}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )})}
          </div>
          </div>
        )
      })()}

      {/* Totale corrente */}
      {importo > 0 && (() => {
        const lordo       = articoli.reduce((s, a) => s + a.prezzo_pre_sconto, 0)
        const subtotale   = articoli.reduce((s, a) => s + a.prezzo_totale, 0)
        const scontiPromo = Math.round((lordo - subtotale) * 100) / 100
        const scontoCliPct = preventivo.sconto_cliente_pct ?? 0
        const scontoCliAmt = Math.round(subtotale * scontoCliPct / 100 * 100) / 100
        const hasScontiPromo = scontiPromo >= 0.01
        const anyLacune = articoli.filter(a => !a.parent_id).some(root => {
          const rl = listini.find(l => l.id === root.listino_id)
          const nC = (rl?.richiede_tipo_colore ?? 0) === 1, nCA = (rl?.richiede_tipo_colore_acc ?? 0) === 1
          const nV = (rl?.richiede_tipo_vetro ?? 0) === 1, nM = (rl?.richiede_tipo_montaggio ?? 0) === 1
          if (!(nC || nCA || nV || nM)) return false
          const cl = articoli.filter(c => c.parent_id === root.id).map(c => listini.find(l => l.id === c.listino_id))
          return (nC && !cl.some(l => (l?.richiede_tipo_colore ?? 0) === 1)) ||
                 (nCA && !cl.some(l => (l?.richiede_tipo_colore_acc ?? 0) === 1)) ||
                 (nV && !cl.some(l => (l?.richiede_tipo_vetro ?? 0) === 1)) ||
                 (nM && !cl.some(l => (l?.richiede_tipo_montaggio ?? 0) === 1))
        })

        const row = (label: string, value: string, opts?: { color?: string; bold?: boolean; separator?: boolean; large?: boolean }) => (
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', ...(opts?.separator ? { borderTop: '1px solid #333', paddingTop: 6, marginTop: 2 } : {}) }}>
            <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: opts?.color ?? '#1a1a1a', fontFamily: 'monospace' }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: opts?.color ?? '#1a1a1a', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{value}</span>
          </div>
        )

        return (
          <div style={{ background: VERDE, border: '1px solid #222', borderRadius: 8, padding: '12px 50px 12px 20px', display: 'flex', flexDirection: 'column', gap: 4, color: '#1a1a1a' }}>
            {hasScontiPromo && row('Listino (escluso IVA):', `€ ${fmt(lordo)}`)}
            {hasScontiPromo && row('Sconti promozionali:', `− € ${fmt(scontiPromo)}`, { color: '#e65100' })}
            {(hasScontiPromo || scontoCliPct > 0) && row('Subtotale:', `€ ${fmt(subtotale)}`, { separator: hasScontiPromo })}
            {scontoCliPct > 0 && row(
              scontoCliPct === 5 ? 'Sconto di benvenuto (5%):' : `Sconto riservato al cliente (${scontoCliPct}%):`,
              `− € ${fmt(scontoCliAmt)}`,
              { color: '#e65100' }
            )}
            {row('Importo preventivo:', `€ ${fmt(importo)}`, { bold: true, large: true, color: '#111', separator: true })}
            {isStaff && <ScontoClienteEditor preventivoId={preventivo.id} currentPct={scontoCliPct} />}
          </div>
        )
      })()}

      {/* Accessori mostrati in tooltip/dettaglio sotto la tabella se presenti */}
      {articoli.some(a => a.accessori) && (
        <div style={{ fontSize: 12, color: '#333' }}>
          <strong>Accessori per articolo:</strong>{' '}
          {articoli.filter(a => a.accessori).map((a, i) => (
            <span key={a.id}>#{i + 1} {a.accessori}{i < articoli.length - 1 ? ' · ' : ''}</span>
          ))}
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <ArticoloForm
          preventivo_id={preventivo.id}
          listini={listini}
          prefill={prefill}
          parentId={parentId}
          parentArt={parentArt}
          existingChildTypes={parentId !== null ? articoli.filter(a => a.parent_id === parentId).map(a => a.marca) : []}
          gapTypeFilter={gapType}
          altriParentIds={altriParentIds}
          onClose={() => { setShowForm(false); setParentId(null); setParentArt(null); setGapType(null) }}
          isStaff={isStaff}
        />
      )}

      {showInoltra && (
        <InoltraModal
          preventivo={preventivo}
          clienteEmail={clienteEmail}
          clienteCellulare={clienteCellulare}
          onClose={() => setShowInoltra(false)}
        />
      )}

      {editArticolo && (
        <ModificaArticoloModal
          articolo={editArticolo}
          parentArt={editArticolo.parent_id !== null ? (articoli.find(a => a.id === editArticolo.parent_id) ?? null) : null}
          listini={listini}
          onClose={() => setEditArticolo(null)}
          isStaff={isStaff}
        />
      )}

      {/* Bottone torna ai preventivi */}
      <div>
        <a
          href={backHref ?? (isStaff ? '/clienti/preventivi' : '/area-clienti/preventivi')}
          className="btn-black"
          style={{ height: 42, padding: '0 20px', fontSize: 13, fontWeight: 700, borderRadius: 21, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
        >
          ← Preventivi
        </a>
      </div>

      {previewArt && (
        <div
          onClick={() => setPreviewArt(null)}
          onTouchStart={() => setPreviewArt(null)}
          style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            {previewArt.abbr ? (
              <PreviewInfisso
                larghezza_cm={previewArt.larghezza_cm || 100}
                altezza_cm={previewArt.altezza_cm || 150}
                colore={previewArt.colore || 'Bianco'}
                descrizione={previewArt.modello}
                tipo_prodotto={previewArt.tipo_prodotto}
                n_ante={previewArt.n_ante || 1}
                abbr={previewArt.abbr}
                profilo_mm={previewArt.profilo_mm}
                bar_color={previewArt.bar_color ?? undefined}
                bar_color_acc={previewArt.bar_color_acc ?? undefined}
                maxHeight="100vh"
              />
            ) : previewArt.listino_foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewArt.listino_foto_url.startsWith('/') ? previewArt.listino_foto_url : `/${previewArt.listino_foto_url}`}
                alt={previewArt.modello}
                style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain', display: 'block' }}
              />
            ) : null}
          </div>
          <p style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', margin: 0, fontSize: 11, color: '#bbb', fontStyle: 'italic', pointerEvents: 'none' }}>
            {isTouch ? 'Tocca per chiudere' : 'Clicca per chiudere'}
          </p>
        </div>
      )}
    </div>
  )
}
