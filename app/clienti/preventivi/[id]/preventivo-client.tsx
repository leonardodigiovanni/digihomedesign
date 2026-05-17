'use client'

import React, { useState, useMemo, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { aggiungiArticolo, rimuoviArticolo, associaCliente, aggiornaDatiPreventivo, inoltroRichiesta, modificaArticolo, aggiornaSconto, inviaAlCliente, accettaPreventivo, rifiutaPreventivo, annullaPreventivo } from '../actions'

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type ListinoItem = {
  id: number
  categoria: string
  produttore: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  prezzo_acquisto?: number
  sconto_articolo?: number
  fornitore_nome?: string
  principale?: number
  caratteristica?: number
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
}

export type Preventivo = {
  id: number
  numero: string
  cliente_id: number | null
  descrizione: string
  stato: 'bozza' | 'richiesto' | 'inviato' | 'accettato' | 'rifiutato' | 'scaduto' | 'annullato'
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

const STATO_COLORS: Record<string, string> = {
  bozza: '#000', richiesto: '#b7791f', inviato: '#2b6cb0', accettato: '#276749',
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

function DatiPreventivo({ preventivo, readOnly = false }: { preventivo: Preventivo; readOnly?: boolean }) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [desc, setDesc]   = useState(preventivo.descrizione ?? '')
  const [note, setNote]   = useState(preventivo.note ?? '')
  const [saved, setSaved] = useState(false)

  const dirty = desc !== (preventivo.descrizione ?? '') || note !== (preventivo.note ?? '')

  function handleSave() {
    const fd = new FormData()
    fd.set('preventivo_id', String(preventivo.id))
    fd.set('descrizione', desc)
    fd.set('note', note)
    startT(async () => {
      await aggiornaDatiPreventivo(null, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    })
  }

  if (readOnly) {
    return (
      <div style={{
        background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 8,
        padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {preventivo.descrizione && (
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descrizione</span>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#444' }}>{preventivo.descrizione}</p>
          </div>
        )}
        {preventivo.note && (
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Note</span>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666', whiteSpace: 'pre-wrap' }}>{preventivo.note}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8,
      padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descrizione</span>
        <input
          value={desc}
          onChange={e => { setDesc(e.target.value); setSaved(false) }}
          placeholder="Descrizione preventivo…"
          style={{ ...inp, fontSize: 14 }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Note</span>
        <textarea
          value={note}
          onChange={e => { setNote(e.target.value); setSaved(false) }}
          placeholder="Note interne o per il cliente…"
          rows={3}
          style={{ ...inp, resize: 'vertical', fontSize: 13 }}
        />
      </div>
      <div>
        <button
          onClick={handleSave}
          disabled={pending || !dirty}
          className="btn-green"
          style={{
            padding: '6px 18px', fontSize: 13, fontWeight: 600,
            opacity: !dirty ? 0.4 : 1,
          }}
        >
          {saved ? '✓ Salvato' : pending ? '…' : 'Salva'}
        </button>
      </div>
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
      background: '#f7f9fc', border: '1px solid #dde3ed', borderRadius: 8,
      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 13, color: '#555', fontWeight: 600, whiteSpace: 'nowrap' }}>Cliente:</span>
      {current && sel === cliente_id?.toString() ? (
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1a4a8a' }}>{current.label}</span>
      ) : (
        <span style={{ fontSize: 13, color: '#aaa' }}>— non assegnato —</span>
      )}
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
          padding: '6px 16px', fontSize: 13, fontWeight: 600,
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
  preventivo_id, listini, prefill, parentId = null, parentArt = null, onClose, isStaff = true,
}: {
  preventivo_id: number
  listini: ListinoItem[]
  prefill: Partial<Articolo> | null
  parentId?: number | null
  parentArt?: Articolo | null
  onClose: () => void
  isStaff?: boolean
}) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')

  const [tipo, setTipo]         = useState(prefill?.tipo_prodotto ?? '')
  const [marca, setMarca]       = useState(prefill?.marca ?? '')
  const [listinoId, setListinoId] = useState(prefill?.listino_id?.toString() ?? '')
  const [colore, setColore]     = useState(prefill?.colore ?? '')
  const [tipoVetro, setTipoVetro] = useState(prefill?.tipo_vetro ?? '')
  const [accessoriSel, setAccessoriSel] = useState<string[]>(
    prefill?.accessori ? prefill.accessori.split(',').filter(Boolean) : []
  )

  const listiniFiltrati = useMemo(
    () => parentId !== null
      ? listini.filter(l => l.caratteristica === 1)
      : listini.filter(l => l.principale === 1),
    [listini, parentId]
  )

  const tipi   = useMemo(() => [...new Set(listiniFiltrati.map(l => l.categoria))].sort(), [listiniFiltrati])
  const marche = useMemo(
    () => [...new Set(listiniFiltrati.filter(l => l.categoria === tipo).map(l => l.produttore))].filter(Boolean).sort(),
    [listiniFiltrati, tipo]
  )
  const modelli = useMemo(
    () => listiniFiltrati.filter(l => l.categoria === tipo && l.produttore === marca),
    [listiniFiltrati, tipo, marca]
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!e.currentTarget.checkValidity()) { e.currentTarget.reportValidity(); return }
    if (!listinoId) { setError('Seleziona un modello.'); return }
    const fd = new FormData(e.currentTarget)
    fd.set('accessori', accessoriSel.join(','))
    if (parentId) fd.set('parent_id', String(parentId))
    if (listinoSel) {
      fd.set('modello',     listinoSel.descrizione)
      fd.set('prezzo_base', String(listinoSel.prezzo_vendita))
      fd.set('unita',       listinoSel.unita)
    }
    setError('')
    startT(async () => {
      const res = await aggiungiArticolo(null, fd)
      if (!res.ok) { setError(res.error); return }
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                      <div>
                        <span style={label}>Larghezza (cm) *</span>
                        <input type="number" name="larghezza_cm" min={0} step="0.1" defaultValue={prefill?.larghezza_cm || ''} style={inp} placeholder="es. 120" required />
                      </div>
                      <div>
                        <span style={label}>Altezza (cm) *</span>
                        <input type="number" name="altezza_cm" min={0} step="0.1" defaultValue={prefill?.altezza_cm || ''} style={inp} placeholder="es. 210" required />
                      </div>
                      <div>
                        <span style={label}>N° ante (0 = da definire) *</span>
                        <input type="number" name="n_ante" min={0} defaultValue={prefill?.n_ante ?? 0} style={inp} required />
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
                      <input type="number" name="quantita" min={0.1} step="0.1" defaultValue={prefill?.quantita ?? ''} style={inp} placeholder="es. 5" required />
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

                  <div>
                    <span style={label}>Note articolo</span>
                    <textarea name="note" rows={2} defaultValue={''} style={{ ...inp, resize: 'vertical' }} placeholder="Eventuali note..." />
                  </div>
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
                padding: '8px 20px', fontSize: 13, fontWeight: 600,
                border: '1px solid #ccc', borderRadius: 6, background: '#f5f5f5', cursor: 'pointer',
              }}>
                Annulla
              </button>
              <button type="submit" disabled={pending || !tipo || !marca || !listinoId}
                className={pending || !tipo || !marca || !listinoId ? 'btn-gray' : 'btn-green'}
                style={{ padding: '8px 22px', fontSize: 13, fontWeight: 700 }}>
                {pending ? 'Salvataggio…' : 'Salva articolo'}
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
        style={{ padding: '0 14px', fontSize: 12, fontFamily: 'inherit', opacity: !dirty ? 0.4 : 1 }}
      >
        {saved ? '✓' : pending ? '…' : 'Applica'}
      </button>
    </div>
  )
}

// ─── Modale Modifica Articolo (staff) ────────────────────────────────────────

function ModificaArticoloModal({ articolo, onClose }: { articolo: Articolo; onClose: () => void }) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('id',            String(articolo.id))
    fd.set('preventivo_id', String(articolo.preventivo_id))
    setError('')
    startT(async () => {
      const res = await modificaArticolo(null, fd)
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
        background: '#fff', borderRadius: 10, padding: 28, width: '100%', maxWidth: 540,
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Modifica articolo #{articolo.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888', lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
          {articolo.tipo_prodotto} — {articolo.marca} {articolo.modello}
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <div>
                <span style={label}>Altezza (cm)</span>
                <input type="number" name="altezza_cm" min={0} step="0.1" defaultValue={articolo.altezza_cm} style={inp} />
              </div>
              <div>
                <span style={label}>Larghezza (cm)</span>
                <input type="number" name="larghezza_cm" min={0} step="0.1" defaultValue={articolo.larghezza_cm} style={inp} />
              </div>
              <div>
                <span style={label}>N° ante</span>
                <input type="number" name="n_ante" min={1} defaultValue={articolo.n_ante} style={inp} />
              </div>
              <div>
                <span style={label}>Quantità</span>
                <input type="number" name="quantita" min={1} defaultValue={articolo.quantita} style={inp} />
              </div>
            </div>
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
            <div>
              <span style={label}>Note</span>
              <textarea name="note" rows={2} defaultValue={articolo.note ?? ''} style={{ ...inp, resize: 'vertical' }} />
            </div>
            {error && (
              <p style={{ color: '#c00', fontSize: 13, margin: 0, background: '#fff5f5', padding: '8px 12px', borderRadius: 5 }}>{error}</p>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
              <button type="button" onClick={onClose} className="btn-red" style={{ padding: '0 20px', fontSize: 13, fontFamily: 'inherit' }}>
                Annulla
              </button>
              <button type="submit" disabled={pending} className={pending ? 'btn-gray' : 'btn-green'} style={{ padding: '0 22px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
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
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
              <button type="button" onClick={onClose} style={{
                padding: '8px 20px', fontSize: 13, fontWeight: 600, borderRadius: 6, border: 'none',
                background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#5a0000 0%,#8c0808 20%,#a01212 45%,#8c0808 80%,#5a0000 100%)',
                boxShadow: '0 4px 14px rgba(100,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.07)',
                color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Annulla
              </button>
              <button type="submit" disabled={pending}
                className={pending ? 'btn-gray' : 'btn-green'}
                style={{ padding: '8px 22px', fontSize: 13, fontWeight: 700 }}>
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
  clienteEmail = '', clienteCellulare = '',
}: {
  preventivo: Preventivo
  articoli: Articolo[]
  listini: ListinoItem[]
  clienti: ClienteOption[]
  isStaff?: boolean
  clienteEmail?: string
  clienteCellulare?: string
}) {
  const router = useRouter()
  const [showForm, setShowForm]         = useState(false)
  const [showInoltra, setShowInoltra]   = useState(false)
  const [editArticolo, setEditArticolo] = useState<Articolo | null>(null)
  const [prefill, setPrefill]           = useState<Partial<Articolo> | null>(null)
  const [parentId, setParentId]         = useState<number | null>(null)
  const [parentArt, setParentArt]       = useState<Articolo | null>(null)
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

  const lastArticolo = articoli.filter(a => !a.parent_id).at(-1) ?? null

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

  function openCaratteristica(artId: number) {
    const art = articoli.find(a => a.id === artId) ?? null
    setPrefill(null)
    setParentId(artId)
    setParentArt(art)
    setShowForm(true)
  }

  function handleElimina(art: Articolo) {
    const fd = new FormData()
    fd.set('id',            String(art.id))
    fd.set('preventivo_id', String(preventivo.id))
    startDel(async () => {
      await rimuoviArticolo(null, fd)
      router.refresh()
    })
  }

  function handleInvia() {
    if (!confirm('Inviare il preventivo al cliente? Questo preventivo sarà annullato e verrà creata una copia in stato "inviato".')) return
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
    padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#888',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em',
    background: '#fafafa', borderBottom: '1px solid #e8e8e8', whiteSpace: 'nowrap',
  }
  const tdS: React.CSSProperties = {
    padding: '9px 12px', fontSize: 13, color: '#333',
    borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Breadcrumb + header */}
      <div>
        <a href={isStaff ? '/clienti/preventivi' : '/area-clienti/preventivi'} style={{ fontSize: 13, color: '#2b6cb0', textDecoration: 'none' }}>
          ← Preventivi
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            Preventivo {preventivo.numero || `#${preventivo.id}`}
          </h2>
          <span style={{
            fontSize: 12, fontWeight: 700, color: STATO_COLORS[statoLocale] ?? '#888',
            borderBottom: `3px solid ${STATO_COLORS[statoLocale] ?? '#888'}`,
            paddingBottom: 1, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {statoLocale}
          </span>
        </div>
        <p style={{ color: '#000', fontSize: 13, margin: '4px 0 0' }}>
          {preventivo.descrizione} — {preventivo.data}
        </p>
      </div>

      {/* Descrizione e note */}
      <DatiPreventivo preventivo={preventivo} readOnly={!isStaff && preventivo.stato !== 'bozza'} />

      {/* Selettore cliente — solo staff */}
      {isStaff && (
        <ClienteSelector
          preventivo_id={preventivo.id}
          cliente_id={preventivo.cliente_id}
          clienti={clienti}
        />
      )}

      {/* Pulsanti azione */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {(preventivo.stato === 'bozza' || (isStaff && preventivo.stato === 'richiesto')) && (
          <>
            <button
              onClick={openNuovo}
              className="btn-green"
              style={{ padding: '9px 20px', fontSize: 13, fontWeight: 700 }}
            >
              + Aggiungi articolo
            </button>

            {lastArticolo && (
              <button
                onClick={openTipoPrecedente}
                className="btn-green"
                style={{ padding: '9px 20px', fontSize: 13, fontWeight: 600 }}
              >
                + Articolo del tipo precedente
              </button>
            )}
            {lastArticolo && (
              <button
                onClick={() => openCaratteristica(lastArticolo.id)}
                className="btn-green"
                style={{ padding: '9px 20px', fontSize: 13, fontWeight: 600 }}
              >
                + Caratteristica dell&apos;articolo precedente
              </button>
            )}
          </>
        )}

        <a
          href={`/area-clienti/preventivi/${preventivo.id}/stampa`}
          className="btn-black"
          style={{
            padding: '9px 20px', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-block',
          }}
        >
          Stampa / PDF
        </a>

        {!isStaff && preventivo.stato === 'bozza' && (
          <button
            onClick={() => setShowInoltra(true)}
            className="btn-black"
            style={{ padding: '0 22px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}
          >
            <span className="animato">Inoltra richiesta</span>
          </button>
        )}

        {isStaff && (preventivo.stato === 'bozza' || preventivo.stato === 'richiesto') && (
          <button
            onClick={handleInvia}
            disabled={inviaPending}
            className={inviaPending ? 'btn-gray' : 'btn-green'}
            style={{ padding: '0 22px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}
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
              style={{ padding: '0 22px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}
            >
              {accettaPending ? '…' : 'Accetta'}
            </button>
            <button
              onClick={handleRifiuta}
              disabled={rifiutaPending}
              className={rifiutaPending ? 'btn-gray' : 'btn-red'}
              style={{ padding: '0 22px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}
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
            style={{ padding: '0 22px', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}
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

      {/* Totale corrente */}
      {importo > 0 && (() => {
        const subtotale = articoli.reduce((s, a) => s + a.prezzo_totale, 0)
        const scontoCliPct = preventivo.sconto_cliente_pct ?? 0
        const scontoAmt = Math.round(subtotale * scontoCliPct / 100 * 100) / 100
        return (
          <div style={{ background: '#f7f9fc', border: '1px solid #dde3ed', borderRadius: 8, padding: '12px 20px' }}>
            {scontoCliPct > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, color: '#555', minWidth: 200 }}>Subtotale (escluso IVA):</span>
                  <span style={{ fontSize: 15, color: '#444' }}>€ {subtotale.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, color: '#e65100', minWidth: 200 }}>{scontoCliPct === 5 ? `Sconto di benvenuto (5%):` : `Sconto riservato al cliente (${scontoCliPct}%):`}</span>
                  <span style={{ fontSize: 15, color: '#e65100' }}>− € {scontoAmt.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid #dde3ed', paddingTop: 6, marginTop: 2 }}>
                  <span style={{ fontSize: 13, color: '#555', minWidth: 200, fontWeight: 600 }}>Importo preventivo:</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#1a4a8a' }}>€ {importo.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, color: '#555' }}>Importo preventivo:</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#1a4a8a' }}>€ {importo.toFixed(2)}</span>
              </div>
            )}
            {isStaff && <ScontoClienteEditor preventivoId={preventivo.id} currentPct={scontoCliPct} />}
          </div>
        )
      })()}

      {/* Tabella articoli */}
      {articoli.length === 0 ? (
        <p style={{ color: '#000', fontSize: 14 }}>
          Nessun articolo aggiunto. Usa «Aggiungi articolo» per iniziare.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8 }}>
            <thead>
              <tr>
                <th style={thS}>#</th>
                <th style={thS}>Tipo</th>
                <th style={thS}>Marca</th>
                <th style={thS}>Modello</th>
                <th style={thS}>Colore</th>
                <th style={thS}>Vetro</th>
                <th style={thS}>H×L (cm)</th>
                <th style={{ ...thS, textAlign: 'center' }}>Ante</th>
                <th style={{ ...thS, textAlign: 'center' }}>Qtà</th>
                <th style={{ ...thS, textAlign: 'right' }}>Prezzo</th>
                <th style={thS}></th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const roots = articoli.filter(a => !a.parent_id)
                const childrenOf = (id: number) => articoli.filter(a => a.parent_id === id)
                const canEdit = preventivo.stato === 'bozza' || preventivo.stato === 'richiesto'

                function renderRow(a: Articolo, label: string | number, isChild: boolean) {
                  const h = a.altezza_cm / 100
                  const l = a.larghezza_cm / 100
                  const q = a.quantita
                  const pb = a.prezzo_base
                  let prezzoBase = 0
                  if (a.unita === 'm²')      prezzoBase = Math.round(pb * h * l * q * 100) / 100
                  else if (a.unita === 'ml') prezzoBase = Math.round(pb * l * q * 100) / 100
                  else                       prezzoBase = Math.round(pb * q * 100) / 100

                  const rowStyle: React.CSSProperties = isChild
                    ? { background: '#f5f8ff', borderLeft: '3px solid #c3d4f0' }
                    : {}
                  return (
                    <tr key={a.id} style={rowStyle}>
                      <td style={{ ...tdS, color: '#aaa', width: 32, paddingRight: 4 }}>
                        {isChild ? '' : label}
                      </td>
                      <td style={{ ...tdS, paddingLeft: isChild ? 48 : 12 }}>
                        {isChild && (
                          <span style={{ color: '#b0bec5', fontWeight: 700, marginRight: 6, fontSize: 14 }}>└</span>
                        )}
                        {a.tipo_prodotto}
                      </td>
                      <td style={tdS}>{a.marca || '—'}</td>
                      <td style={{ ...tdS, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={a.modello}>
                        {a.modello || '—'}
                      </td>
                      <td style={tdS}>{a.colore || '—'}</td>
                      <td style={tdS}>{a.tipo_vetro || '—'}</td>
                      <td style={{ ...tdS, whiteSpace: 'nowrap' }}>
                        {a.altezza_cm > 0 ? `${a.altezza_cm}×${a.larghezza_cm}` : '—'}
                      </td>
                      <td style={{ ...tdS, textAlign: 'center' }}>{a.n_ante || '—'}</td>
                      <td style={{ ...tdS, textAlign: 'center' }}>{a.quantita || '—'}</td>
                      <td style={{ ...tdS, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {a.sconto_articolo_pct !== 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            {(isChild ? a.prezzo_pre_sconto : prezzoBase) > 0 && <span style={{ color: '#aaa', fontSize: 11, textDecoration: 'line-through' }}>€ {(isChild ? a.prezzo_pre_sconto : prezzoBase).toFixed(2)}</span>}
                            <span style={{ color: a.sconto_articolo_pct < 0 ? '#1565c0' : '#e65100', fontSize: 11 }}>
                              {a.sconto_articolo_pct < 0 ? `Magg. +${Math.abs(a.sconto_articolo_pct)}%` : `Promo −${a.sconto_articolo_pct}%`}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: 13 }}>
                              {a.prezzo_totale < 0
                                ? `−€ ${Math.abs(a.prezzo_totale).toFixed(2)}`
                                : `€ ${a.prezzo_totale.toFixed(2)}`}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontWeight: 600, color: isChild && a.prezzo_totale < 0 ? '#c44' : 'inherit' }}>
                            {a.prezzo_totale < 0
                              ? `−€ ${Math.abs(a.prezzo_totale).toFixed(2)}`
                              : a.prezzo_totale > 0
                                ? `${isChild ? '+' : ''}€ ${a.prezzo_totale.toFixed(2)}`
                                : '—'}
                          </span>
                        )}
                      </td>
                      <td style={{ ...tdS, whiteSpace: 'nowrap' }}>
                        {isStaff && canEdit && (
                          <button onClick={() => setEditArticolo(a)} style={{ background: 'none', border: 'none', color: '#2b6cb0', fontSize: 15, cursor: 'pointer', padding: '2px 6px' }} title="Modifica articolo">✎</button>
                        )}
                        {canEdit && !isChild && (
                          <button onClick={() => openCaratteristica(a.id)} style={{ background: 'none', border: 'none', color: '#2b6cb0', fontSize: 16, fontWeight: 700, cursor: 'pointer', padding: '2px 6px' }} title="Aggiungi caratteristica">+</button>
                        )}
                        {(preventivo.stato === 'bozza' || (isStaff && preventivo.stato === 'richiesto')) && (
                          <button onClick={() => handleElimina(a)} disabled={delPending} style={{ background: 'none', border: 'none', color: '#c00', fontSize: 16, cursor: 'pointer', padding: '2px 6px' }} title="Elimina articolo">✕</button>
                        )}
                      </td>
                    </tr>
                  )
                }

                let idx = 0
                return roots.flatMap(a => {
                  idx++
                  return [renderRow(a, idx, false), ...childrenOf(a.id).map(c => renderRow(c, idx, true))]
                })
              })()}
            </tbody>
          </table>
        </div>
      )}

      {/* Accessori mostrati in tooltip/dettaglio sotto la tabella se presenti */}
      {articoli.some(a => a.accessori) && (
        <div style={{ fontSize: 12, color: '#888' }}>
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
          onClose={() => { setShowForm(false); setParentId(null); setParentArt(null) }}
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
          onClose={() => setEditArticolo(null)}
        />
      )}
    </div>
  )
}
