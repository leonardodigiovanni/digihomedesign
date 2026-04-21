'use client'

import React, { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { aggiungiArticolo, rimuoviArticolo, generaPreventivo, associaCliente, aggiornaDatiPreventivo } from '../actions'

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export type ListinoItem = {
  id: number
  categoria: string
  produttore: string
  descrizione: string
  unita: string
  prezzo_vendita: number
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
  note: string | null
}

export type Preventivo = {
  id: number
  numero: string
  cliente_id: number | null
  descrizione: string
  stato: 'bozza' | 'inviato' | 'accettato' | 'rifiutato' | 'scaduto'
  importo: number
  data: string
  validita_giorni: number
  note: string | null
  visibile_cliente: number
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
  bozza: '#888', inviato: '#2b6cb0', accettato: '#276749', rifiutato: '#c00', scaduto: '#8a6d3b',
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

function DatiPreventivo({ preventivo }: { preventivo: Preventivo }) {
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
          style={{
            padding: '6px 18px', fontSize: 13, fontWeight: 600, borderRadius: 5,
            background: saved ? '#276749' : '#1a4a8a', color: '#fff',
            border: 'none', cursor: pending || !dirty ? 'not-allowed' : 'pointer',
            opacity: !dirty ? 0.4 : 1, transition: 'background 0.3s',
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
        style={{
          padding: '6px 16px', fontSize: 13, fontWeight: 600, borderRadius: 5,
          background: saved ? '#276749' : '#1a4a8a', color: '#fff',
          border: 'none', cursor: pending ? 'not-allowed' : 'pointer',
          opacity: sel === (cliente_id?.toString() ?? '') ? 0.4 : 1,
          transition: 'background 0.3s',
        }}
      >
        {saved ? '✓ Salvato' : pending ? '…' : 'Assegna'}
      </button>
    </div>
  )
}

// ─── Form aggiunta articolo ───────────────────────────────────────────────────

function ArticoloForm({
  preventivo_id, listini, prefill, onClose,
}: {
  preventivo_id: number
  listini: ListinoItem[]
  prefill: Partial<Articolo> | null
  onClose: () => void
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

  const tipi   = useMemo(() => [...new Set(listini.map(l => l.categoria))].sort(), [listini])
  const marche = useMemo(
    () => [...new Set(listini.filter(l => l.categoria === tipo).map(l => l.produttore))].filter(Boolean).sort(),
    [listini, tipo]
  )
  const modelli = useMemo(
    () => listini.filter(l => l.categoria === tipo && l.produttore === marca),
    [listini, tipo, marca]
  )
  const listinoSel = useMemo(
    () => listini.find(l => l.id === parseInt(listinoId)),
    [listini, listinoId]
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
    const fd = new FormData(e.currentTarget)
    fd.set('accessori', accessoriSel.join(','))
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Aggiungi articolo</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888', lineHeight: 1 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="preventivo_id" value={preventivo_id} />
          <input type="hidden" name="listino_id"    value={listinoId} />
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
                <span style={label}>Marca</span>
                <select
                  name="marca"
                  value={marca}
                  onChange={e => handleChangeMarca(e.target.value)}
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
                <span style={label}>Modello / Profilo</span>
                <select
                  value={listinoId}
                  onChange={e => setListinoId(e.target.value)}
                  style={inp}
                >
                  <option value="">— Seleziona modello —</option>
                  {modelli.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.descrizione} ({m.unita} — €{Number(m.prezzo_vendita).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Colore */}
            <div>
              <span style={label}>Colore</span>
              <select
                name="colore"
                value={colore}
                onChange={e => setColore(e.target.value)}
                style={inp}
              >
                <option value="">— Nessun colore —</option>
                {COLORI.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Tipo vetro (solo se tipo prevede vetro) */}
            {haVetro && (
              <div>
                <span style={label}>Tipo vetro</span>
                <select
                  name="tipo_vetro"
                  value={tipoVetro}
                  onChange={e => setTipoVetro(e.target.value)}
                  style={inp}
                >
                  <option value="">— Nessun vetro —</option>
                  {TIPI_VETRO.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            )}

            {/* Allestimento / Accessori */}
            <div>
              <span style={label}>Allestimento / Accessori</span>
              <div style={{
                border: '1px solid #d0d0d0', borderRadius: 5, padding: '8px 12px',
                display: 'flex', flexWrap: 'wrap', gap: '6px 16px',
              }}>
                {ACCESSORI_LIST.map(acc => (
                  <label key={acc} style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={accessoriSel.includes(acc)}
                      onChange={() => toggleAccessorio(acc)}
                    />
                    {acc}
                  </label>
                ))}
              </div>
            </div>

            {/* Dimensioni */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <div>
                <span style={label}>Altezza (cm)</span>
                <input type="number" name="altezza_cm" min={0} step="0.1" defaultValue={prefill?.altezza_cm || ''} style={inp} placeholder="es. 210" />
              </div>
              <div>
                <span style={label}>Larghezza (cm)</span>
                <input type="number" name="larghezza_cm" min={0} step="0.1" defaultValue={prefill?.larghezza_cm || ''} style={inp} placeholder="es. 120" />
              </div>
              <div>
                <span style={label}>N° ante</span>
                <input type="number" name="n_ante" min={1} defaultValue={prefill?.n_ante ?? 1} style={inp} />
              </div>
              <div>
                <span style={label}>Quantità</span>
                <input type="number" name="quantita" min={1} defaultValue={prefill?.quantita ?? 1} style={inp} required />
              </div>
            </div>

            {/* Note articolo */}
            <div>
              <span style={label}>Note articolo</span>
              <textarea name="note" rows={2} defaultValue={''} style={{ ...inp, resize: 'vertical' }} placeholder="Eventuali note..." />
            </div>

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
              <button type="submit" disabled={pending || !tipo} style={{
                padding: '8px 22px', fontSize: 13, fontWeight: 700,
                background: pending ? '#aaa' : '#1a6e3b', color: '#fff',
                border: 'none', borderRadius: 6, cursor: pending ? 'not-allowed' : 'pointer',
              }}>
                {pending ? 'Salvataggio…' : 'Salva articolo'}
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
}: {
  preventivo: Preventivo
  articoli: Articolo[]
  listini: ListinoItem[]
  clienti: ClienteOption[]
  isStaff?: boolean
}) {
  const router = useRouter()
  const [showForm, setShowForm]   = useState(false)
  const [prefill, setPrefill]     = useState<Partial<Articolo> | null>(null)
  const [importo, setImporto]     = useState(preventivo.importo)
  const [genPending, startGen]    = useTransition()
  const [delPending, startDel]    = useTransition()
  const [genMsg, setGenMsg]       = useState('')

  const lastArticolo = articoli.length > 0 ? articoli[articoli.length - 1] : null

  function openNuovo() {
    setPrefill(null)
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

  function handleGenera() {
    const fd = new FormData()
    fd.set('preventivo_id', String(preventivo.id))
    setGenMsg('')
    startGen(async () => {
      const res = await generaPreventivo(null, fd)
      if (!res.ok) { setGenMsg(res.error); return }
      setImporto(res.importo)
      setGenMsg(`Totale calcolato: € ${res.importo.toFixed(2)}`)
      router.refresh()
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
            fontSize: 12, fontWeight: 700, color: STATO_COLORS[preventivo.stato] ?? '#888',
            borderBottom: `3px solid ${STATO_COLORS[preventivo.stato] ?? '#888'}`,
            paddingBottom: 1, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {preventivo.stato}
          </span>
        </div>
        <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>
          {preventivo.descrizione} — {preventivo.data}
        </p>
      </div>

      {/* Descrizione e note */}
      <DatiPreventivo preventivo={preventivo} />

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
        <button
          onClick={openNuovo}
          style={{
            padding: '9px 20px', fontSize: 13, fontWeight: 700, borderRadius: 6,
            background: '#1a6e3b', color: '#fff', border: 'none', cursor: 'pointer',
          }}
        >
          + Aggiungi articolo
        </button>

        {lastArticolo && (
          <button
            onClick={openTipoPrecedente}
            style={{
              padding: '9px 20px', fontSize: 13, fontWeight: 600, borderRadius: 6,
              background: '#e8f4ec', color: '#1a6e3b', border: '1px solid #a3d4b3', cursor: 'pointer',
            }}
          >
            + Articolo del tipo precedente
          </button>
        )}

        <a
          href={`/area-clienti/preventivi/${preventivo.id}/stampa`}
          style={{
            padding: '9px 20px', fontSize: 13, fontWeight: 600, borderRadius: 6,
            background: '#4a4a6a', color: '#fff', textDecoration: 'none', display: 'inline-block',
          }}
        >
          🖨 Stampa / PDF
        </a>

        <button
          onClick={handleGenera}
          disabled={genPending || articoli.length === 0}
          style={{
            padding: '9px 22px', fontSize: 13, fontWeight: 700, borderRadius: 6,
            background: genPending ? '#aaa' : '#1a4a8a', color: '#fff',
            border: 'none', cursor: genPending || articoli.length === 0 ? 'not-allowed' : 'pointer',
            opacity: articoli.length === 0 ? 0.5 : 1,
          }}
        >
          {genPending ? 'Calcolo…' : '⚡ Genera preventivo'}
        </button>
      </div>

      {/* Messaggio totale */}
      {genMsg && (
        <div style={{
          background: genMsg.startsWith('Totale') ? '#f0fff4' : '#fff5f5',
          color: genMsg.startsWith('Totale') ? '#276749' : '#c00',
          border: `1px solid ${genMsg.startsWith('Totale') ? '#9ae6b4' : '#fed7d7'}`,
          borderRadius: 6, padding: '10px 16px', fontSize: 14, fontWeight: 600,
        }}>
          {genMsg}
        </div>
      )}

      {/* Totale corrente */}
      {importo > 0 && (
        <div style={{
          background: '#f7f9fc', border: '1px solid #dde3ed', borderRadius: 8,
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 13, color: '#555' }}>Importo preventivo:</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#1a4a8a' }}>
            € {importo.toFixed(2)}
          </span>
        </div>
      )}

      {/* Tabella articoli */}
      {articoli.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>
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
                <th style={{ ...thS, textAlign: 'right' }}>Prezzo tot.</th>
                <th style={thS}></th>
              </tr>
            </thead>
            <tbody>
              {articoli.map((a, i) => (
                <tr key={a.id}>
                  <td style={{ ...tdS, color: '#aaa' }}>{i + 1}</td>
                  <td style={tdS}>{a.tipo_prodotto}</td>
                  <td style={tdS}>{a.marca || '—'}</td>
                  <td style={{ ...tdS, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={a.modello}>
                    {a.modello || '—'}
                  </td>
                  <td style={tdS}>{a.colore || '—'}</td>
                  <td style={tdS}>{a.tipo_vetro || '—'}</td>
                  <td style={{ ...tdS, whiteSpace: 'nowrap' }}>
                    {a.altezza_cm > 0 ? `${a.altezza_cm}×${a.larghezza_cm}` : '—'}
                  </td>
                  <td style={{ ...tdS, textAlign: 'center' }}>{a.n_ante}</td>
                  <td style={{ ...tdS, textAlign: 'center' }}>{a.quantita}</td>
                  <td style={{ ...tdS, textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 600 }}>
                    {a.prezzo_totale > 0 ? `€ ${a.prezzo_totale.toFixed(2)}` : '—'}
                  </td>
                  <td style={tdS}>
                    <button
                      onClick={() => handleElimina(a)}
                      disabled={delPending}
                      style={{
                        background: 'none', border: 'none', color: '#c00',
                        fontSize: 16, cursor: 'pointer', padding: '2px 6px',
                      }}
                      title="Elimina articolo"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
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
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
