'use client'

import React, { useState, useMemo, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { aggiungiArticolo, rimuoviArticolo, associaCliente, aggiornaDatiPreventivo, inoltroRichiesta, modificaArticolo, aggiornaSconto, modificaPreventivo, inviaAlCliente, accettaPreventivo, rifiutaPreventivo, annullaPreventivo, creaClienteRapido } from '../actions'
import PreviewInfisso from '@/components/preview-infisso'
import { b } from '@/lib/btn'
import SelectLookup from '@/components/select-lookup'

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
  filtro_1?: number
  filtro_2?: number
  filtro_3?: number
  filtro_4?: number
  schema_url?: string | null
  sottocategoria?: string | null
  fase?: string | null
  materiale?: string | null
  tipologia?: string | null
  ambiente?: string | null
  fascia?: string | null
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
  ordine: number
  parent_id: number | null
  abbr: string
  profilo_mm: number
  listino_foto_url: string
  listino_escluso?: number
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
  prezzo_forfait: number
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

function DatiPreventivo({ preventivo, readOnly = false, isStaff = false, isApp }: { preventivo: Preventivo; readOnly?: boolean; isStaff?: boolean; isApp?: boolean }) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [desc, setDesc]             = useState(preventivo.descrizione ?? '')
  const [note, setNote]             = useState(preventivo.note ?? '')
  const [validita, setValidita]     = useState(preventivo.validita_giorni)
  const [forfait, setForfait]       = useState(preventivo.prezzo_forfait ?? 0)
  const [stato, setStato]           = useState(preventivo.stato)
  const [saved, setSaved]           = useState(false)
  const [open, setOpen]             = useState(false)

  const dirty = desc !== (preventivo.descrizione ?? '') || note !== (preventivo.note ?? '') || (isStaff && (validita !== preventivo.validita_giorni || forfait !== (preventivo.prezzo_forfait ?? 0) || stato !== preventivo.stato))

  function handleSave() {
    const fd = new FormData()
    fd.set('preventivo_id', String(preventivo.id))
    fd.set('descrizione', desc)
    fd.set('note', note)
    fd.set('validita_giorni', String(validita))
    fd.set('prezzo_forfait', String(forfait))
    if (isStaff) fd.set('stato', stato)
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
      <div style={{ background: '#fff', border: '1px solid #d0d0d0', borderRadius: 8, padding: '10px 16px' }}>
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
    <div style={{ background: '#fff', border: '1px solid #d0d0d0', borderRadius: 8, padding: '10px 16px' }}>
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
          {isStaff && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prezzo forfait (€)</span>
              <input
                type="number" step="0.01"
                value={forfait}
                onChange={e => { setForfait(parseFloat(e.target.value) || 0); setSaved(false) }}
                style={{ ...inp, width: 150, fontSize: 13 }}
              />
            </div>
          )}
          {isStaff && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#333', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stato</span>
              <SelectLookup
                value={stato}
                onChange={v => { setStato(v as Preventivo['stato']); setSaved(false) }}
                options={(['bozza', 'da inviare', 'richiesto', 'inviato', 'accettato', 'rifiutato', 'scaduto', 'annullato'] as Preventivo['stato'][]).map(s => ({ value: s, label: s }))}
                style={{ ...inp, width: 180, fontSize: 13 }}
              />
            </div>
          )}
          <div>
            <button
              onClick={handleSave}
              disabled={pending || !dirty}
              className={b('btn-green', isApp)}
              style={{ padding: '0 18px', fontSize: 13, opacity: !dirty ? 0.4 : 1 }}
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

function ClienteSelector({ preventivo_id, cliente_id, clienti: clientiInit, isApp }: {
  preventivo_id: number
  cliente_id: number | null
  clienti: ClienteOption[]
  isApp?: boolean
}) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [sel, setSel] = useState(cliente_id?.toString() ?? '')
  const [saved, setSaved] = useState(false)
  const [clienti, setClienti] = useState<ClienteOption[]>(clientiInit)

  // form nuovo cliente
  const [mostraForm, setMostraForm] = useState(false)
  const [nome, setNome]       = useState('')
  const [cognome, setCognome] = useState('')
  const [cellulare, setCellulare] = useState('')
  const [creaPending, setCreaP] = useState(false)
  const [creaErr, setCreaErr]   = useState('')

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

  async function handleCrea() {
    if (!nome.trim()) { setCreaErr('Il nome è obbligatorio.'); return }
    setCreaP(true); setCreaErr('')
    const fd = new FormData()
    fd.set('nome', nome.trim())
    fd.set('cognome', cognome.trim())
    fd.set('cellulare', cellulare.trim())
    const res = await creaClienteRapido(null, fd)
    setCreaP(false)
    if (!res.ok || !res.id) { setCreaErr(res.error ?? 'Errore creazione.'); return }
    const nuovoOpt: ClienteOption = { id: res.id, label: res.label! }
    setClienti(prev => [...prev, nuovoOpt].sort((a, b) => a.label.localeCompare(b.label)))
    setSel(String(res.id))
    setNome(''); setCognome(''); setCellulare('')
    setMostraForm(false)
  }

  const inp: React.CSSProperties = { padding: '5px 8px', border: '1px solid #ccc', borderRadius: 5, fontSize: 13, fontFamily: 'inherit', background: '#fff' }

  return (
    <div style={{
      background: '#fff', border: '1px solid #d0d0d0', borderRadius: 8,
      padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: 13, color: '#555', fontWeight: 600, whiteSpace: 'nowrap' }}>Cliente:</span>
          <SelectLookup
            value={sel}
            onChange={v => { setSel(v); setSaved(false) }}
            options={[{ value: '', label: '— Nessun cliente —' }, ...clienti.map(c => ({ value: String(c.id), label: c.label }))]}
            placeholder="— Nessun cliente —"
            style={{ minWidth: 220 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button
            onClick={() => { setMostraForm(f => !f); setCreaErr('') }}
            disabled={sel !== ''}
            className={b('btn-black', isApp)}
            style={{ padding: '0 14px', fontSize: 13, opacity: sel !== '' ? 0.4 : 1 }}
          >
            {mostraForm ? '✕' : '+ Nuovo cliente'}
          </button>
          <button
            onClick={handleSave}
            disabled={pending || sel === (cliente_id?.toString() ?? '')}
            className={b('btn-black', isApp)}
            style={{ padding: '0 16px', fontSize: 13, opacity: sel === (cliente_id?.toString() ?? '') ? 0.4 : 1 }}
          >
            {saved ? '✓ Salvato' : pending ? '…' : 'Assegna'}
          </button>
        </div>
      </div>

      {mostraForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4, borderTop: '1px solid #ccc' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input value={nome}      onChange={e => setNome(e.target.value)}      placeholder="Nome *"     style={{ ...inp, flex: '1 1 120px' }} />
            <input value={cognome}   onChange={e => setCognome(e.target.value)}   placeholder="Cognome"    style={{ ...inp, flex: '1 1 120px' }} />
            <input value={cellulare} onChange={e => setCellulare(e.target.value)} placeholder="Cellulare"  style={{ ...inp, flex: '1 1 120px' }} />
          </div>
          {creaErr && <span style={{ fontSize: 12, color: '#c00' }}>{creaErr}</span>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCrea} disabled={creaPending} className={b('btn-black', isApp)} style={{ padding: '0 18px', fontSize: 13 }}>
              {creaPending ? '…' : 'Crea'}
            </button>
            <button onClick={() => { setMostraForm(false); setCreaErr('') }} className={b('btn-gray', isApp)} style={{ padding: '0 14px', fontSize: 13 }}>
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Filtri modello (linguette) ───────────────────────────────────────────────

const FILTRI_MODELLO: { label: string; key: 'filtro_1' | 'filtro_2' | 'filtro_3' | 'filtro_4' }[] = [
  { label: '1 Anta',    key: 'filtro_1' },
  { label: '2 Ante',   key: 'filtro_2' },
  { label: '3+ Ante',  key: 'filtro_3' },
  { label: 'Sopraluce', key: 'filtro_4' },
]

// ─── Form aggiunta articolo ───────────────────────────────────────────────────

function ArticoloForm({
  preventivo_id, listini, prefill, parentId = null, parentArt = null, existingChildTypes = [], gapTypeFilter = null, altriParentIds = [], onClose, isStaff = true, isApp, percorsiPerListino = {},
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
  isApp?: boolean
  percorsiPerListino?: Record<number, PercorsoEntry[]>
}) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')

  const isCaratteristicaMode = parentId !== null
  const [tipo, setTipo]         = useState(() =>
    isCaratteristicaMode && parentArt ? parentArt.tipo_prodotto : (prefill?.tipo_prodotto ?? '')
  )
  const [marca, setMarca]       = useState(prefill?.marca ?? '')
  const [serieFiltro, setSerieFiltro] = useState('')
  const [listinoId, setListinoId] = useState(prefill?.listino_id?.toString() ?? '')
  const [sottocatFiltro, setSottocatFiltro] = useState('')
  const [faseFiltro, setFaseFiltro]         = useState('')
  const [materialeFiltro, setMaterialeFiltro] = useState('')
  const [tipologiaFiltro, setTipologiaFiltro] = useState('')
  const [ambienteFiltro, setAmbienteFiltro] = useState('')
  const [fasciaFiltro, setFasciaFiltro]     = useState('')
  const [colore, setColore]     = useState(prefill?.colore ?? '')
  const [tipoVetro, setTipoVetro] = useState(prefill?.tipo_vetro ?? '')
  const [accessoriSel, setAccessoriSel] = useState<string[]>(
    prefill?.accessori ? prefill.accessori.split(',').filter(Boolean) : []
  )

  const listiniFiltrati = useMemo(() => {
    if (parentId !== null) {
      const rootSerie = listini.find(l => l.id === parentArt?.listino_id)?.serie ?? ''
      let filtered = listini.filter(l =>
        (gapTypeFilter !== null ? l.principale === 0 : l.caratteristica === 1) &&
        matchesPercorsi(l.id, l.categoria ?? '', parentArt?.listino_id ?? 0, parentArt?.tipo_prodotto ?? '', percorsiPerListino) &&
        (!l.produttore || l.produttore === (parentArt?.marca ?? '')) &&
        (!l.serie      || l.serie      === rootSerie)
      )
      if (gapTypeFilter) {
        filtered = filtered.filter(l =>
          gapTypeFilter === 'tipo_colore'     ? (l.richiede_tipo_colore     ?? 0) === 1 :
          gapTypeFilter === 'tipo_colore_acc' ? (l.richiede_tipo_colore_acc ?? 0) === 1 :
          gapTypeFilter === 'tipo_vetro'      ? (l.richiede_tipo_vetro      ?? 0) === 1 :
                                                (l.richiede_tipo_montaggio  ?? 0) === 1
        )
      }
      return filtered
    }
    return listini.filter(l => l.principale === 1)
  }, [listini, parentId, parentArt, gapTypeFilter])

  const tipi   = useMemo(() => [...new Set(listiniFiltrati.map(l => l.categoria))].sort(), [listiniFiltrati])

  // ─── Cascata classificazione ────────────────────────────────────────────────
  const listiniPerTipo = useMemo(
    () => isCaratteristicaMode ? listiniFiltrati : (tipo ? listiniFiltrati.filter(l => l.categoria === tipo) : listiniFiltrati),
    [listiniFiltrati, tipo, isCaratteristicaMode]
  )
  const sottocatOptions = useMemo(
    () => [...new Set(listiniPerTipo.map(l => l.sottocategoria).filter(Boolean))].sort() as string[],
    [listiniPerTipo]
  )
  const postSottocat = useMemo(
    () => sottocatFiltro ? listiniPerTipo.filter(l => l.sottocategoria === sottocatFiltro) : listiniPerTipo,
    [listiniPerTipo, sottocatFiltro]
  )
  const faseOptions = useMemo(
    () => [...new Set(postSottocat.map(l => l.fase).filter(Boolean))].sort() as string[],
    [postSottocat]
  )
  const postFase = useMemo(
    () => faseFiltro ? postSottocat.filter(l => l.fase === faseFiltro) : postSottocat,
    [postSottocat, faseFiltro]
  )
  const materialeOptions = useMemo(
    () => [...new Set(postFase.map(l => l.materiale).filter(Boolean))].sort() as string[],
    [postFase]
  )
  const postMateriale = useMemo(
    () => materialeFiltro ? postFase.filter(l => l.materiale === materialeFiltro) : postFase,
    [postFase, materialeFiltro]
  )
  const tipologiaOptions = useMemo(
    () => [...new Set(postMateriale.map(l => l.tipologia).filter(Boolean))].sort() as string[],
    [postMateriale]
  )
  const postTipologia = useMemo(
    () => tipologiaFiltro ? postMateriale.filter(l => l.tipologia === tipologiaFiltro) : postMateriale,
    [postMateriale, tipologiaFiltro]
  )
  const ambienteOptions = useMemo(
    () => [...new Set(postTipologia.map(l => l.ambiente).filter(Boolean))].sort() as string[],
    [postTipologia]
  )
  const postAmbiente = useMemo(
    () => ambienteFiltro ? postTipologia.filter(l => l.ambiente === ambienteFiltro) : postTipologia,
    [postTipologia, ambienteFiltro]
  )
  const fasciaOptions = useMemo(
    () => [...new Set(postAmbiente.map(l => l.fascia).filter(Boolean))].sort() as string[],
    [postAmbiente]
  )
  const postClassifica = useMemo(
    () => fasciaFiltro ? postAmbiente.filter(l => l.fascia === fasciaFiltro) : postAmbiente,
    [postAmbiente, fasciaFiltro]
  )
  const serieOptions = useMemo(() => {
    let base = postClassifica
    if (marca) base = base.filter(l => l.produttore === marca)
    return [...new Set(base.map(l => l.serie).filter(Boolean))].sort() as string[]
  }, [postClassifica, marca])
  // ────────────────────────────────────────────────────────────────────────────

  const [filtriModelloAttivi, setFiltriModelloAttivi] = useState<Set<string>>(new Set())
  const [schemaFiltro, setSchemaFiltro] = useState<string | null>(null)

  const marche = useMemo(() => {
    let base = postClassifica
    if (filtriModelloAttivi.size > 0) {
      base = base.filter(l => [...filtriModelloAttivi].every(lbl => {
        const f = FILTRI_MODELLO.find(f => f.label === lbl)
        return f && (l[f.key] ?? 0) === 1
      }))
    }
    if (schemaFiltro) base = base.filter(l => l.schema_url === schemaFiltro)
    return [...new Set(base.map(l => l.produttore))].filter(Boolean).sort()
  }, [postClassifica, filtriModelloAttivi, schemaFiltro])
  const modelli = useMemo(
    () => isCaratteristicaMode ? listiniFiltrati : postClassifica,
    [listiniFiltrati, postClassifica, isCaratteristicaMode]
  )
  const listinoSel = useMemo(
    () => listiniFiltrati.find(l => l.id === parseInt(listinoId)),
    [listiniFiltrati, listinoId]
  )

  const haVetro = TIPI_CON_VETRO.has(tipo.toLowerCase())

  const haFiltriModello = useMemo(
    () => !isCaratteristicaMode && FILTRI_MODELLO.some(f =>
      postClassifica.some(m => (m[f.key] ?? 0) === 1)
    ),
    [postClassifica, isCaratteristicaMode]
  )

  const modelliFiltrati = useMemo(() => {
    if (isCaratteristicaMode) {
      if (filtriModelloAttivi.size === 0) return modelli
      return modelli.filter(m => [...filtriModelloAttivi].every(lbl => {
        const f = FILTRI_MODELLO.find(f => f.label === lbl)
        return f && (m[f.key] ?? 0) === 1
      }))
    }
    let base = modelli
    if (filtriModelloAttivi.size > 0) {
      base = base.filter(m => [...filtriModelloAttivi].every(lbl => {
        const f = FILTRI_MODELLO.find(f => f.label === lbl)
        return f && (m[f.key] ?? 0) === 1
      }))
    }
    if (marca) base = base.filter(m => m.produttore === marca)
    if (serieFiltro) base = base.filter(m => m.serie === serieFiltro)
    return base
  }, [modelli, filtriModelloAttivi, marca, serieFiltro, isCaratteristicaMode])

  const thumbnailsData = useMemo(() => {
    let base = postClassifica.filter(l => l.principale === 1)
    if (filtriModelloAttivi.size > 0) {
      base = base.filter(m => [...filtriModelloAttivi].every(lbl => {
        const f = FILTRI_MODELLO.find(f => f.label === lbl)
        return f && (m[f.key] ?? 0) === 1
      }))
    }
    if (marca) base = base.filter(l => l.produttore === marca)
    const map = new Map<string, number[]>()
    for (const m of base) {
      if (!m.schema_url) continue
      const ids = map.get(m.schema_url) ?? []
      ids.push(m.id)
      map.set(m.schema_url, ids)
    }
    return [...map.entries()]
      .map(([url, ids]) => ({ url, count: ids.length, singleId: ids.length === 1 ? ids[0] : null }))
      .sort((a, b) => b.count - a.count)
  }, [postClassifica, filtriModelloAttivi, marca])

  const modelliConSchema = useMemo(() => {
    if (!schemaFiltro) return modelliFiltrati
    return modelliFiltrati.filter(m => m.schema_url === schemaFiltro)
  }, [modelliFiltrati, schemaFiltro])

  function toggleAccessorio(nome: string) {
    setAccessoriSel(prev =>
      prev.includes(nome) ? prev.filter(x => x !== nome) : [...prev, nome]
    )
  }

  function handleChangeTipo(t: string) {
    setTipo(t)
    setSottocatFiltro(''); setFaseFiltro(''); setMaterialeFiltro('')
    setTipologiaFiltro(''); setAmbienteFiltro(''); setFasciaFiltro('')
    setMarca(''); setSerieFiltro(''); setListinoId(''); setFiltriModelloAttivi(new Set()); setSchemaFiltro(null)
  }

  function handleChangeMarca(m: string) {
    setMarca(m); setSerieFiltro(''); setListinoId(''); setSchemaFiltro(null)
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
      zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '20px 0', overflowY: 'auto',
    }}>
      <div style={{
        background: '#fff', borderRadius: 0, padding: 28, width: '100%', maxWidth: 720,
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)', marginTop: 'auto', marginBottom: 'auto',
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

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 14 }}>

            {isCaratteristicaMode ? (
              <>
                <input type="hidden" name="tipo_prodotto" value={tipo} />
                <input type="hidden" name="marca" value={marca} />
                <div>
                  <span style={label}>Caratteristica *</span>
                  <SelectLookup
                    value={listinoId}
                    onChange={id => {
                      setListinoId(id)
                      const sel = modelli.find(m => m.id === parseInt(id))
                      if (sel) setMarca(sel.produttore)
                    }}
                    options={[{ value: '', label: '— Seleziona —' }, ...modelli.map(m => {
                      const sc = m.sconto_articolo ?? 0
                      const promo = sc !== 0 ? (sc < 0 ? ` · Magg. +${Math.abs(sc)}%` : ` · Sconto -${sc}%`) : ''
                      const details = isStaff
                        ? ` — acq. €${Number(m.prezzo_acquisto ?? 0).toFixed(2)} / cli. €${Number(m.prezzo_vendita).toFixed(2)}`
                        : ` — €${Number(m.prezzo_vendita).toFixed(2)}`
                      return { value: String(m.id), label: `${m.descrizione}${m.produttore ? ` · ${m.produttore}` : ''} (${m.unita}${details})${promo}` }
                    })]}
                    style={inp}
                  />
                </div>
              </>
            ) : (
              <>
                {/* Tipo prodotto */}
                <div>
                  <span style={label}>Categoria</span>
                  <SelectLookup
                    name="tipo_prodotto"
                    value={tipo}
                    onChange={v => handleChangeTipo(v)}
                    options={[{ value: '', label: '— Seleziona tipo —' }, ...tipi.map(t => ({ value: t, label: t }))]}
                    style={inp}
                  />
                </div>

                {/* Sottocategoria */}
                <div>
                  <span style={label}>Sottocategoria</span>
                  <SelectLookup
                    value={sottocatFiltro}
                    onChange={v => { setSottocatFiltro(v); setFaseFiltro(''); setMaterialeFiltro(''); setTipologiaFiltro(''); setAmbienteFiltro(''); setFasciaFiltro(''); setMarca(''); setListinoId(''); setSchemaFiltro(null) }}
                    options={[{ value: '', label: '— Tutte —' }, ...sottocatOptions.map(v => ({ value: v, label: v }))]}
                    style={inp}
                  />
                </div>

                {/* Fase */}
                <div>
                  <span style={label}>Fase</span>
                  <SelectLookup
                    value={faseFiltro}
                    onChange={v => { setFaseFiltro(v); setMaterialeFiltro(''); setTipologiaFiltro(''); setAmbienteFiltro(''); setFasciaFiltro(''); setMarca(''); setListinoId(''); setSchemaFiltro(null) }}
                    options={[{ value: '', label: '— Tutte —' }, ...faseOptions.map(v => ({ value: v, label: v }))]}
                    style={inp}
                  />
                </div>

                {/* Materiale */}
                <div>
                  <span style={label}>Materiale</span>
                  <SelectLookup
                    value={materialeFiltro}
                    onChange={v => { setMaterialeFiltro(v); setTipologiaFiltro(''); setAmbienteFiltro(''); setFasciaFiltro(''); setMarca(''); setListinoId(''); setSchemaFiltro(null) }}
                    options={[{ value: '', label: '— Tutti —' }, ...materialeOptions.map(v => ({ value: v, label: v }))]}
                    style={inp}
                  />
                </div>

                {/* Tipologia */}
                <div>
                  <span style={label}>Tipologia</span>
                  <SelectLookup
                    value={tipologiaFiltro}
                    onChange={v => { setTipologiaFiltro(v); setAmbienteFiltro(''); setFasciaFiltro(''); setMarca(''); setListinoId(''); setSchemaFiltro(null) }}
                    options={[{ value: '', label: '— Tutte —' }, ...tipologiaOptions.map(v => ({ value: v, label: v }))]}
                    style={inp}
                  />
                </div>

                {/* Ambiente */}
                <div>
                  <span style={label}>Ambiente</span>
                  <SelectLookup
                    value={ambienteFiltro}
                    onChange={v => { setAmbienteFiltro(v); setFasciaFiltro(''); setMarca(''); setListinoId(''); setSchemaFiltro(null) }}
                    options={[{ value: '', label: '— Tutti —' }, ...ambienteOptions.map(v => ({ value: v, label: v }))]}
                    style={inp}
                  />
                </div>

                {/* Fascia */}
                <div>
                  <span style={label}>Fascia</span>
                  <SelectLookup
                    value={fasciaFiltro}
                    onChange={v => { setFasciaFiltro(v); setMarca(''); setListinoId(''); setSchemaFiltro(null) }}
                    options={[{ value: '', label: '— Tutte —' }, ...fasciaOptions.map(v => ({ value: v, label: v }))]}
                    style={inp}
                  />
                </div>

                {/* Marca (filtro opzionale) */}
                <div>
                  <span style={label}>Marca</span>
                  <SelectLookup
                    name="marca"
                    value={marca}
                    onChange={v => handleChangeMarca(v)}
                    options={[{ value: '', label: '— Tutte le marche —' }, ...marche.map(m => ({ value: m, label: m }))]}
                    style={inp}
                  />
                </div>

                {/* Serie */}
                <div>
                  <span style={label}>Serie</span>
                  <SelectLookup
                    value={serieFiltro}
                    onChange={v => { setSerieFiltro(v); setListinoId(''); setSchemaFiltro(null) }}
                    options={[{ value: '', label: '— Tutte le serie —' }, ...serieOptions.map(s => ({ value: s, label: s }))]}
                    style={inp}
                  />
                </div>

                {/* Linguette filtro */}
                {haFiltriModello && (() => {
                  const H = 28, THUMB = 22
                  const chipsDisponibili = FILTRI_MODELLO.filter(f =>
                    postClassifica.some(m => (m[f.key] ?? 0) === 1)
                  )
                  return (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 0,
                      background: '#fff', border: '1px solid #d0d0d0', borderRadius: 10,
                      padding: '6px 12px', overflow: 'hidden',
                    }}>
                      <button type="button" disabled={filtriModelloAttivi.size === 0}
                        className={`${filtriModelloAttivi.size > 0 ? 'btn-red' : 'btn-gray'} btn-icon fs-11`}
                        style={{ flexShrink: 0 }}
                        onClick={() => { setFiltriModelloAttivi(new Set()); setSchemaFiltro(null); setMarca(''); setListinoId('') }}
                      >✕</button>
                      <div style={{ width: 1, height: 20, background: '#ddd', flexShrink: 0, margin: '0 10px' }} />
                      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', WebkitOverflowScrolling: 'touch' as const, paddingBottom: 2 }}>
                        {chipsDisponibili.map(f => {
                          const attiva = filtriModelloAttivi.has(f.label)
                          const W = Math.max(THUMB + 8 + f.label.length * 7, 90)
                          return (
                            <div key={f.label} role="button" tabIndex={0}
                              onClick={() => {
                                setFiltriModelloAttivi(prev => { const n = new Set(prev); n.has(f.label) ? n.delete(f.label) : n.add(f.label); return n })
                                setSchemaFiltro(null); setMarca(''); setListinoId('')
                              }}
                              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setFiltriModelloAttivi(prev => { const n = new Set(prev); n.has(f.label) ? n.delete(f.label) : n.add(f.label); return n }); setSchemaFiltro(null); setMarca(''); setListinoId('') } }}
                              style={{ position: 'relative', width: W, height: H, borderRadius: H / 2, flexShrink: 0, background: attiva ? '#1e5c1e' : '#3a3a3a', transition: 'background 0.2s', cursor: 'pointer', userSelect: 'none' }}
                            >
                              <span style={{ position: 'absolute', left: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 10, fontFamily: 'inherit', fontWeight: 700, color: attiva ? '#7dda7d' : 'transparent', transition: 'color 0.2s', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{f.label}</span>
                              <span style={{ position: 'absolute', right: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 10, fontFamily: 'inherit', fontWeight: 400, color: attiva ? 'transparent' : '#aaaaaa', transition: 'color 0.2s', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{f.label}</span>
                              <div style={{ position: 'absolute', width: THUMB, height: THUMB, borderRadius: '50%', background: '#fff', top: (H - THUMB) / 2, left: attiva ? W - THUMB - 3 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.5)' }} />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })()}

                {/* Disegno — in fondo, dopo tutti i filtri */}
                {thumbnailsData.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
                    {thumbnailsData.map(({ url, count, singleId }) => {
                      const isSelected = schemaFiltro === url || (singleId !== null && listinoId === String(singleId))
                      return (
                        <button
                          key={url}
                          type="button"
                          onClick={() => {
                            if (singleId !== null) {
                              if (isSelected) { setListinoId(''); setSchemaFiltro(null) }
                              else {
                                const item = listiniFiltrati.find(l => l.id === singleId)
                                if (item) setMarca(item.produttore)
                                setListinoId(String(singleId)); setSchemaFiltro(url)
                              }
                            } else {
                              setSchemaFiltro(isSelected ? null : url)
                              setMarca(''); setListinoId('')
                            }
                          }}
                          title={count > 1 ? `${count} modelli` : undefined}
                          style={{
                            padding: 0, background: '#fff', cursor: 'pointer',
                            border: isSelected ? '2px solid #c8960c' : '1px solid #ddd',
                            borderRadius: 6, overflow: 'hidden',
                            boxShadow: isSelected ? '0 0 0 2px rgba(200,150,12,0.25)' : 'none',
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" style={{ display: 'block', width: '100%', height: 70, objectFit: 'contain', background: '#f9f9f9' }} />
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Descrizione — selezione finale articolo */}
                <div>
                  <span style={label}>
                    Descrizione *{modelliConSchema.length !== modelliFiltrati.length ? ` (${modelliConSchema.length} di ${modelliFiltrati.length})` : ''}
                  </span>
                  <SelectLookup
                    value={listinoId}
                    onChange={v => {
                      setListinoId(v)
                      if (!v) { setSchemaFiltro(null) }
                      if (v) {
                        const item = listiniFiltrati.find(l => l.id === parseInt(v))
                        if (item) setMarca(item.produttore)
                      }
                    }}
                    options={[{ value: '', label: '— Seleziona —' }, ...modelliConSchema.map(m => {
                      const sc = m.sconto_articolo ?? 0
                      const promo = sc !== 0 ? (sc < 0 ? ` · Magg. +${Math.abs(sc)}%` : ` · Sconto -${sc}%`) : ''
                      const details = isStaff
                        ? ` — acq. €${Number(m.prezzo_acquisto ?? 0).toFixed(2)} / cli. €${Number(m.prezzo_vendita).toFixed(2)}${m.fornitore_nome ? ` · ${m.fornitore_nome}` : ''}`
                        : ` — €${Number(m.prezzo_vendita).toFixed(2)}${m.fornitore_nome ? ` · ${m.fornitore_nome}` : ''}`
                      return { value: String(m.id), label: `${m.descrizione} (${m.unita}${details})${promo}` }
                    })]}
                    style={inp}
                  />
                </div>
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
                      <SelectLookup name="tipo_vetro" value={tipoVetro} onChange={setTipoVetro} required
                        options={[{ value: '', label: '— Seleziona vetro —' }, ...TIPI_VETRO.map(v => ({ value: v, label: v }))]}
                        style={inp} />
                    </div>
                  )}

                  {/* Figlio: dimensioni e quantità ereditati dal padre, non chiederli */}
                  {!parentArt && isMq && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <div>
                        <span style={label}>Larghezza (cm) *</span>
                        <input type="number" name="larghezza_cm" min={0} step="0.1" defaultValue={prefill?.larghezza_cm || ''} style={inp} required />
                      </div>
                      <div>
                        <span style={label}>Altezza (cm) *</span>
                        <input type="number" name="altezza_cm" min={0} step="0.1" defaultValue={prefill?.altezza_cm || ''} style={inp} required />
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

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', paddingTop: 4 }}>
              <button type="submit" disabled={pending || !listinoId}
                className={pending || !listinoId ? b('btn-gray', isApp) : b('btn-green', isApp)}
                style={{ padding: '0 22px', fontSize: 13 }}>
                {pending ? '…' : isCaratteristicaMode ? 'Applica' : 'Conferma'}
              </button>
              {isCaratteristicaMode && altriParentIds.length > 0 && (
                <button type="button" onClick={handleApplicaATutti} disabled={pending || !listinoId}
                  className={pending || !listinoId ? b('btn-gray', isApp) : b('btn-green', isApp)}
                  style={{ padding: '0 18px', fontSize: 13 }}>
                  {pending ? '…' : 'Applica a tutti'}
                </button>
              )}
              <button type="button" onClick={onClose} className={b('btn-red', isApp)}
                style={{ padding: '0 20px', fontSize: 13 }}>
                Annulla
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Override sconto cliente (staff) ─────────────────────────────────────────

function ScontoClienteEditor({ preventivoId, currentPct, isApp }: { preventivoId: number; currentPct: number; isApp?: boolean }) {
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
        className={b('btn-black', isApp)}
        style={{ padding: '0 14px', fontSize: 12, fontFamily: 'inherit', opacity: !dirty ? 0.4 : 1 }}
      >
        {saved ? '✓' : pending ? '…' : 'Applica'}
      </button>
    </div>
  )
}

// ─── Modale Modifica Articolo (staff) ────────────────────────────────────────

function ModificaArticoloModal({ articolo, parentArt, children = [], listini, onClose, isStaff = true, isApp, percorsiPerListino = {} }: {
  articolo: Articolo
  parentArt?: Articolo | null
  children?: Articolo[]
  listini: ListinoItem[]
  onClose: () => void
  isStaff?: boolean
  isApp?: boolean
  percorsiPerListino?: Record<number, PercorsoEntry[]>
}) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [error, setError] = useState('')
  const [magg, setMagg] = useState(Math.abs(articolo.sconto_articolo_pct))

  const isChild = articolo.parent_id !== null

  // ── Sezione "Cambia articolo" (solo root staff) ──
  const [showCambiaArt, setShowCambiaArt] = useState(false)
  const [nuovoTipo, setNuovoTipo]         = useState('')
  const [nuovaMarca, setNuovaMarca]       = useState('')
  const [nuovoListinoId, setNuovoListinoId] = useState('')

  const listiniPrincipali = useMemo(() => listini.filter(l => l.principale === 1), [listini])
  const tipiDisp   = useMemo(() => [...new Set(listiniPrincipali.map(l => l.categoria))].sort(), [listiniPrincipali])
  const marcheDisp = useMemo(() => [...new Set(listiniPrincipali.filter(l => l.categoria === nuovoTipo).map(l => l.produttore))].filter(Boolean).sort(), [listiniPrincipali, nuovoTipo])
  const modelliDisp = useMemo(() => listiniPrincipali.filter(l => l.categoria === nuovoTipo && l.produttore === nuovaMarca), [listiniPrincipali, nuovoTipo, nuovaMarca])
  const nuovoListinoSel = useMemo(() => listiniPrincipali.find(l => l.id === parseInt(nuovoListinoId)), [listiniPrincipali, nuovoListinoId])

  const childrenCompat = useMemo(() => {
    if (!nuovoListinoSel || !children.length) return null
    return children.map(child => {
      const cl = listini.find(l => l.id === child.listino_id)
      if (!cl) return { child, ok: false }
      const newSerie = nuovoListinoSel.serie ?? ''
      const brandOk = !cl.produttore || cl.produttore === nuovoListinoSel.produttore
      const catOk   = matchesPercorsi(cl.id, cl.categoria ?? '', nuovoListinoSel.id, nuovoListinoSel.categoria ?? '', percorsiPerListino)
      const serieOk = !cl.serie      || cl.serie      === newSerie
      if (!brandOk || !catOk || !serieOk) return { child, ok: false }
      const hasTipedFlag = (cl.richiede_tipo_colore ?? 0) === 1 || (cl.richiede_tipo_colore_acc ?? 0) === 1 ||
                           (cl.richiede_tipo_vetro ?? 0) === 1  || (cl.richiede_tipo_montaggio  ?? 0) === 1
      if (hasTipedFlag) {
        const ok = ((cl.richiede_tipo_colore     ?? 0) !== 1 || (nuovoListinoSel.richiede_tipo_colore     ?? 0) === 1) &&
                   ((cl.richiede_tipo_colore_acc ?? 0) !== 1 || (nuovoListinoSel.richiede_tipo_colore_acc ?? 0) === 1) &&
                   ((cl.richiede_tipo_vetro      ?? 0) !== 1 || (nuovoListinoSel.richiede_tipo_vetro      ?? 0) === 1) &&
                   ((cl.richiede_tipo_montaggio  ?? 0) !== 1 || (nuovoListinoSel.richiede_tipo_montaggio  ?? 0) === 1)
        return { child, ok }
      }
      return { child, ok: true }
    })
  }, [nuovoListinoSel, children, listini])

  function handleToggleCambiaArt() {
    setShowCambiaArt(o => {
      if (!o) setNuovoTipo(articolo.tipo_prodotto)
      return !o
    })
  }

  const uLower  = (articolo.unita ?? '').toLowerCase()
  const isChildUnit = isChild && (uLower === 'm²' || uLower === 'mq' || uLower === 'm2' || uLower === 'ml')
  const childListino = listini.find(l => l.id === articolo.listino_id)
  const isChildMontaggio = isChild && !isChildUnit && (childListino?.richiede_tipo_montaggio ?? 0) === 1
  const isChildPerc = isChild && !isChildUnit && !isChildMontaggio
  const isRootMq = !isChild && (uLower === 'm²' || uLower === 'mq' || uLower === 'm2')
  const isRootMl = !isChild && (uLower === 'ml' || uLower === 'm' || uLower === 'mt')
  const isRootKg = !isChild && uLower === 'kg'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('id',            String(articolo.id))
    fd.set('preventivo_id', String(articolo.preventivo_id))
    if (isChildUnit) {
      fd.set('altezza_cm',    '0')
      fd.set('larghezza_cm',  '0')
      fd.set('formula_diretta', '1')
    } else if (isChild) {
      fd.set('altezza_cm',   String(articolo.altezza_cm))
      fd.set('larghezza_cm', String(articolo.larghezza_cm))
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
      <div style={{ background: '#fff', borderRadius: 0, padding: 28, width: '100%', maxWidth: 720, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Modifica articolo #{articolo.id}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888', lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ fontSize: 12, color: '#333', marginBottom: 16 }}>
          {articolo.tipo_prodotto} — {articolo.marca} {articolo.modello}
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 14 }}>

            {/* Sezione cambio articolo — solo root, solo staff */}
            {!isChild && isStaff && (
              <div style={{ border: '1px solid #d0d0d0', borderRadius: 8, padding: '10px 14px', background: '#fafafa' }}>
                <button
                  type="button"
                  onClick={handleToggleCambiaArt}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', width: '100%' }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', flex: 1, textAlign: 'left' }}>
                    Cambia articolo
                  </span>
                  <span style={{ fontSize: 11, color: '#888' }}>{showCambiaArt ? '▲' : '▼'}</span>
                </button>
                {showCambiaArt && (
                  <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                    {/* Tipo */}
                    <div>
                      <span style={label}>Categoria</span>
                      <SelectLookup value={nuovoTipo} onChange={v => { setNuovoTipo(v); setNuovaMarca(''); setNuovoListinoId('') }}
                        options={[{ value: '', label: '— Seleziona tipo —' }, ...tipiDisp.map(t => ({ value: t, label: t }))]}
                        style={inp} />
                    </div>
                    {/* Marca */}
                    {nuovoTipo && (
                      <div>
                        <span style={label}>Marca</span>
                        <SelectLookup value={nuovaMarca} onChange={v => { setNuovaMarca(v); setNuovoListinoId('') }}
                          options={[{ value: '', label: '— Seleziona marca —' }, ...marcheDisp.map(m => ({ value: m, label: m }))]}
                          style={inp} />
                      </div>
                    )}
                    {/* Modello */}
                    {nuovaMarca && (
                      <div>
                        <span style={label}>Modello / Profilo</span>
                        <SelectLookup value={nuovoListinoId} onChange={setNuovoListinoId}
                          options={[{ value: '', label: '— Seleziona modello —' }, ...modelliDisp.map(m => {
                            const details = ` — acq. €${Number(m.prezzo_acquisto ?? 0).toFixed(2)} / cli. €${Number(m.prezzo_vendita).toFixed(2)}`
                            return { value: String(m.id), label: `${m.descrizione} (${m.unita}${details})` }
                          })]}
                          style={inp} />
                      </div>
                    )}
                    {/* Preview caratteristiche */}
                    {childrenCompat && (
                      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 6, padding: '8px 12px' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', marginBottom: 6 }}>Caratteristiche associate</div>
                        {childrenCompat.length === 0 ? (
                          <div style={{ fontSize: 12, color: '#888', fontStyle: 'italic' }}>Nessuna caratteristica associata</div>
                        ) : childrenCompat.map(({ child, ok }) => (
                          <div key={child.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginBottom: 3 }}>
                            <span style={{ fontWeight: 700, color: ok ? '#2e7d32' : '#c00', fontSize: 13, lineHeight: 1 }}>{ok ? '✓' : '✕'}</span>
                            <span style={{ color: ok ? '#333' : '#aaa', textDecoration: ok ? 'none' : 'line-through' }}>{child.modello || child.tipo_prodotto}</span>
                            {!ok && <span style={{ fontSize: 11, color: '#c00' }}>eliminata</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    {nuovoListinoId && <input type="hidden" name="nuovo_listino_id" value={nuovoListinoId} />}
                  </div>
                )}
              </div>
            )}

            {isChildUnit ? (
              <>
                <div>
                  <span style={label}>Quantità ({articolo.unita})</span>
                  <input type="number" name="quantita" min={0} step="0.01" defaultValue={articolo.quantita > 0 ? articolo.quantita : ''} style={inp} autoFocus />
                </div>
                <div>
                  <span style={label}>Prezzo unitario (€/{articolo.unita})</span>
                  <input type="number" name="prezzo_base" min={0} step="0.01" defaultValue={articolo.prezzo_base} style={inp} />
                </div>
                <div>
                  <span style={label}>Sconto %</span>
                  <input type="number" name="sconto_articolo_pct" min={-100} max={100} step="0.01" defaultValue={articolo.sconto_articolo_pct} style={inp} />
                </div>
                <div>
                  <span style={label}>Nota</span>
                  <input type="text" name="note" defaultValue={articolo.note ?? ''} placeholder="es. bagno" style={inp} />
                </div>
                <div>
                  <span style={label}>Ordine</span>
                  <input type="number" name="ordine" defaultValue={articolo.ordine} style={inp} />
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
                  <span style={label}>Quantità</span>
                  <input type="number" name="quantita" min={1} defaultValue={articolo.quantita > 0 ? articolo.quantita : 1} style={inp} />
                </div>
                <div>
                  <span style={label}>Prezzo unitario ({articolo.unita})</span>
                  <input type="number" name="prezzo_base" min={0} step="0.01" defaultValue={articolo.prezzo_base} style={inp} autoFocus />
                </div>
                <div>
                  <span style={label}>Sconto %</span>
                  <input type="number" name="sconto_articolo_pct" min={-100} max={100} step="0.01" defaultValue={articolo.sconto_articolo_pct} style={inp} />
                </div>
                <div>
                  <span style={label}>Nota</span>
                  <input type="text" name="note" defaultValue={articolo.note ?? ''} placeholder="es. bagno" style={inp} />
                </div>
                <div>
                  <span style={label}>Ordine</span>
                  <input type="number" name="ordine" defaultValue={articolo.ordine} style={inp} />
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
                <div>
                  <span style={label}>Quantità</span>
                  <input type="number" name="quantita" min={1} defaultValue={articolo.quantita > 0 ? articolo.quantita : 1} style={inp} />
                </div>
                <div>
                  <span style={label}>Nota</span>
                  <input type="text" name="note" defaultValue={articolo.note ?? ''} placeholder="es. bagno" style={inp} />
                </div>
                <div>
                  <span style={label}>Ordine</span>
                  <input type="number" name="ordine" defaultValue={articolo.ordine} style={inp} />
                </div>
              </>
            ) : (
              <>
                {isRootMq ? (
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
                ) : isRootMl ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <span style={label}>Lunghezza (cm)</span>
                      <input type="number" name="larghezza_cm" min={0} step="0.1" defaultValue={articolo.larghezza_cm} style={inp} />
                    </div>
                    <div>
                      <span style={label}>Quantità</span>
                      <input type="number" name="quantita" min={1} defaultValue={articolo.quantita} style={inp} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <span style={label}>{isRootKg ? 'Quantità (kg)' : 'Quantità'}</span>
                    <input type="number" name="quantita" min={isRootKg ? 0.1 : 1} step={isRootKg ? '0.1' : '1'} defaultValue={articolo.quantita} style={inp} />
                  </div>
                )}
                {!isRootMq && (
                  <input type="hidden" name="altezza_cm" value={articolo.altezza_cm} />
                )}
                {!isRootMq && !isRootMl && (
                  <input type="hidden" name="larghezza_cm" value={articolo.larghezza_cm} />
                )}
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
              <button type="button" onClick={onClose} className={b('btn-red', isApp)}>Annulla</button>
              <button type="submit" disabled={pending} className={pending ? b('btn-gray', isApp) : b('btn-green', isApp)} style={{ padding: '0 22px', fontSize: 13 }}>
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
  preventivo, clienteEmail, clienteCellulare, onClose, isApp,
}: {
  preventivo: Preventivo
  clienteEmail: string
  clienteCellulare: string
  onClose: () => void
  isApp?: boolean
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
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0',
    }}>
      <div style={{
        background: '#fff', borderRadius: 0, padding: 28, width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Conferma richiesta preventivo</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888', lineHeight: 1 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 14 }}>
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
              <button type="button" onClick={onClose} className={b('btn-red', isApp)}
                style={{ padding: '0 20px' }}>
                Annulla
              </button>
              <button type="submit" disabled={pending}
                className={pending ? b('btn-gray', isApp) : b('btn-green', isApp)}
                style={{ fontSize: 13, paddingLeft: 22, paddingRight: 22 }}>
                {pending ? 'Inoltro…' : 'Inoltra'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Matching percorsi (cat+sottocat, sottocat vuota = wildcard) ──────────────

type PercorsoEntry = { categoria: string; sottocategoria: string }

function matchesPercorsi(
  aId: number, aCat: string,
  bId: number, bCat: string,
  map: Record<number, PercorsoEntry[]>
): boolean {
  const ap = map[aId] ?? []
  const bp = map[bId] ?? []
  if (!ap.length || !bp.length) return aCat === bCat
  return ap.some(a =>
    bp.some(b =>
      a.categoria === b.categoria &&
      (!a.sottocategoria || a.sottocategoria === b.sottocategoria)
    )
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function PreventivoClient({
  preventivo, articoli, listini, clienti, isStaff = true,
  clienteEmail = '', clienteCellulare = '', backHref, stampaHref, isApp,
  percorsiPerListino = {},
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
  isApp?: boolean
  percorsiPerListino?: Record<number, PercorsoEntry[]>
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
      return true
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
      router.push(isApp ? `/app/preventivo/${res.cloneId}` : `/clienti/preventivi/${res.cloneId}`)
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
      router.push(isApp ? `/app/preventivo/${res.cloneId}` : isStaff ? `/clienti/preventivi/${res.cloneId}` : `/area-clienti/preventivi/${res.cloneId}`)
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

  const VERDE = '#fff'
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

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
      <DatiPreventivo preventivo={preventivo} readOnly={!isStaff && preventivo.stato !== 'bozza'} isStaff={isStaff} isApp={isApp} />

      {/* Selettore cliente — solo staff */}
      {isStaff && (
        <ClienteSelector
          preventivo_id={preventivo.id}
          cliente_id={preventivo.cliente_id}
          clienti={clienti}
          isApp={isApp}
        />
      )}

      {/* Pulsanti azione */}
      <div style={{ background: '#fff', border: '1px solid #d0d0d0', borderRadius: 8, padding: '12px 16px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {(preventivo.stato === 'bozza' || (isStaff && preventivo.stato === 'da inviare')) && (
          <>
            <button
              onClick={openNuovo}
              className={b('btn-green', isApp)}
              style={{ flex: 1, minWidth: 'max-content', padding: '0 20px', fontSize: 13 }}
            >
              + Aggiungi articolo
            </button>

            {lastArticolo && (
              <button
                onClick={openTipoPrecedente}
                className={b('btn-green', isApp)}
                style={{ flex: 1, minWidth: 'max-content', padding: '0 20px', fontSize: 13 }}
              >
                + Ripeti articolo
              </button>
            )}
          </>
        )}

        {tuttiSanati ? (
          <a
            href={stampaHref ?? `/area-clienti/preventivi/${preventivo.id}/stampa`}
            className={b('btn-black', isApp)}
            style={{ flex: 1, minWidth: 'max-content', padding: '0 20px', fontSize: 13, textDecoration: 'none' }}
          >
            Stampa / PDF
          </a>
        ) : (
          <span
            className={b('btn-gray', isApp)}
            style={{ flex: 1, minWidth: 'max-content', padding: '0 20px', fontSize: 13, cursor: 'not-allowed', opacity: 0.5 }}
            title="Completa tutte le caratteristiche prima di stampare"
          >
            Stampa / PDF
          </span>
        )}

        {isStaff && tuttiSanati && (
          <a
            href={`/area-clienti/preventivi/${preventivo.id}/stampa?pub=1`}
            className={b('btn-black', isApp)}
            style={{ flex: 1, minWidth: 'max-content', padding: '0 20px', fontSize: 13, textDecoration: 'none' }}
          >
            Stampa con pubblicità
          </a>
        )}
        {isStaff && !tuttiSanati && (
          <span
            className={b('btn-gray', isApp)}
            style={{ flex: 1, minWidth: 'max-content', padding: '0 20px', fontSize: 13, cursor: 'not-allowed', opacity: 0.5 }}
            title="Completa tutte le caratteristiche prima di stampare"
          >
            Stampa con pubblicità
          </span>
        )}

        {!isStaff && preventivo.stato === 'bozza' && (
          <button
            onClick={() => setShowInoltra(true)}
            disabled={!tuttiSanati}
            className={!tuttiSanati ? b('btn-gray', isApp) : b('btn-black', isApp)}
            style={{ flex: 1, minWidth: 'max-content', padding: '0 22px', fontSize: 13, fontFamily: 'inherit', opacity: !tuttiSanati ? 0.5 : 1 }}
            title={!tuttiSanati ? 'Completa tutte le caratteristiche prima di inviare' : undefined}
          >
            <span className={tuttiSanati ? 'animato' : ''}>Inoltra richiesta</span>
          </button>
        )}

        {isStaff && preventivo.stato === 'richiesto' && (
          <button
            onClick={handleModifica}
            disabled={modificaPending}
            className={modificaPending ? b('btn-gray', isApp) : b('btn-black', isApp)}
            style={{ flex: 1, minWidth: 'max-content', padding: '0 22px', fontSize: 13, fontFamily: 'inherit' }}
          >
            {modificaPending ? 'Preparazione…' : 'Modifica'}
          </button>
        )}

        {isStaff && (preventivo.stato === 'bozza' || preventivo.stato === 'da inviare') && (
          <button
            onClick={handleInvia}
            disabled={inviaPending || !tuttiSanati}
            className={inviaPending || !tuttiSanati ? b('btn-gray', isApp) : b('btn-black', isApp)}
            style={{ flex: 1, minWidth: 'max-content', padding: '0 22px', fontSize: 13, fontFamily: 'inherit', opacity: !tuttiSanati ? 0.5 : 1 }}
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
              className={accettaPending ? b('btn-gray', isApp) : b('btn-green', isApp)}
              style={{ flex: 1, minWidth: 'max-content', padding: '0 22px', fontSize: 13, fontFamily: 'inherit' }}
            >
              {accettaPending ? '…' : 'Accetta'}
            </button>
            <button
              onClick={handleRifiuta}
              disabled={rifiutaPending}
              className={rifiutaPending ? b('btn-gray', isApp) : b('btn-red', isApp)}
              style={{ flex: 1, minWidth: 'max-content', padding: '0 22px', fontSize: 13, fontFamily: 'inherit' }}
            >
              {rifiutaPending ? '…' : 'Rifiuta'}
            </button>
          </>
        )}

        {isStaff && statoLocale !== 'annullato' && (
          <button
            onClick={handleAnnulla}
            disabled={annullaPending}
            className={annullaPending ? b('btn-gray', isApp) : b('btn-red', isApp)}
            style={{ flex: 1, minWidth: 'max-content', padding: '0 22px', fontSize: 13, fontFamily: 'inherit' }}
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
        const canEdit = preventivo.stato === 'bozza' || (isStaff && (preventivo.stato === 'richiesto' || preventivo.stato === 'da inviare'))

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
            : false
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
                <table className={`carrello-table${canEdit ? '' : ' no-edit-col'}`} style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: 70 }} />
                    <col />
                    <col style={{ width: 80 }} />
                    {canEdit && <col style={{ width: 70 }} />}
                  </colgroup>
                  <thead>
                    <tr style={{ background: VERDE }}>
                      <th style={{ ...thS, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
                        </div>
                      </th>
                      <th style={{ ...thS }}>Articolo</th>
                      <th style={{ ...thS, textAlign: 'center', width: 80, textTransform: 'none', letterSpacing: 0 }}>Q.tà Rif<br/>Prezzo €</th>
                      {canEdit && (
                        <th style={{ ...thS, textAlign: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <span style={{ fontSize: 14, display: 'inline-block', transform: 'rotate(135deg)', lineHeight: 1 }}>✏</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </div>
                        </th>
                      )}
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
                        : false

                      const rootSerie = rootListino?.serie ?? ''
                      const hasOptionalCaratteristiche = !useTypeGaps && canEdit && listini.some(l =>
                        l.caratteristica === 1 &&
                        matchesPercorsi(l.id, l.categoria ?? '', root.listino_id ?? 0, root.tipo_prodotto, percorsiPerListino) &&
                        (!l.produttore || l.produttore === root.marca) &&
                        (!l.serie      || l.serie      === rootSerie)
                      )
                      const hasDetails = children.length > 0 || hasLacune || hasOptionalCaratteristiche
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
                            <td colSpan={canEdit ? 4 : 3} style={{ padding: 8, borderBottom: '1px solid #333', borderRight: 'none', textAlign: 'left', background: '#ffffff' }}>
                              <div style={{ display: 'flex', gap: 8 }}>
                                {showC  && <button onClick={() => openCaratteristica(root.id, undefined, 'tipo_colore')}     style={{ flex: 1, height: 42, padding: '0 10px', borderRadius: 21, fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>+ Colore</button>}
                                {showCA && <button onClick={() => openCaratteristica(root.id, undefined, 'tipo_colore_acc')} style={{ flex: 1, height: 42, padding: '0 10px', borderRadius: 21, fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>+ Accessori</button>}
                                {showV  && <button onClick={() => openCaratteristica(root.id, undefined, 'tipo_vetro')}      style={{ flex: 1, height: 42, padding: '0 10px', borderRadius: 21, fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>+ Vetro</button>}
                                {showM  && <button onClick={() => openCaratteristica(root.id, undefined, 'tipo_montaggio')}  style={{ flex: 1, height: 42, padding: '0 10px', borderRadius: 21, fontSize: 13, fontWeight: 700, fontFamily: 'inherit', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 1px,transparent 1px,transparent 6px),linear-gradient(135deg,#e0916a 0%,#ffbfa0 30%,#ffd4be 50%,#ffbfa0 70%,#e0916a 100%)', color: '#000', boxShadow: '0 2px 8px rgba(200,100,60,0.3),inset 0 1px 0 rgba(255,220,200,0.4)' }}>+ Montaggio</button>}
                              </div>
                            </td>
                          </tr>
                        ) : null
                      } else {
                        gapRows = hasOptionalCaratteristiche ? (
                          <tr style={{ background: '#ffffff' }}>
                            <td style={{ padding: '4px', textAlign: 'center' }}>
                              <button onClick={() => openCaratteristica(root.id)} className={`${b('btn-pink', isApp)} btn-icon`} style={{ border: 'none' }}>
                                <span style={{ position: 'relative', zIndex: 1, fontSize: 22, lineHeight: 1, fontWeight: 300 }}>+</span>
                              </button>
                            </td>
                            <td colSpan={canEdit ? 3 : 2} style={{ padding: '4px 8px', borderRight: 'none' }}>
                              <span style={{ fontSize: 11, color: '#555' }}>
                                Aggiungi elemento (opzionale)
                              </span>
                            </td>
                          </tr>
                        ) : null
                      }

                      return (
                        <React.Fragment key={root.id}>
                          {/* ── Riga articolo principale ── */}
                          <tr style={{ background: hasLacune ? ROSA : VERDE, borderTop: groupIdx > 0 ? '1px solid #333' : undefined }}>
                            {/* Col 1: eye + expand */}
                            <td style={{ ...tdS, textAlign: 'center', padding: '4px 0' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <button onClick={() => setPreviewArt(root)} disabled={hasLacune || (!root.abbr && !root.listino_foto_url)} className={(hasLacune || (!root.abbr && !root.listino_foto_url)) ? `${b('btn-gray', isApp)} btn-icon` : `${b('btn-black', isApp)} btn-icon`} title="Anteprima infisso"
                                  style={{ fontFamily: 'inherit' }}>
                                  <svg style={{ position: 'relative', zIndex: 1 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                {hasDetails && (
                                  <button type="button" onClick={() => toggleExpand(root.id)}
                                    className={hasLacune ? `${b('btn-red', isApp)} btn-icon` : `${b('btn-black', isApp)} btn-icon`}
                                    style={{ fontFamily: 'inherit', gap: 2 }}>
                                    <svg style={{ position: 'relative', zIndex: 1 }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
                                    <span style={{ position: 'relative', zIndex: 1, fontSize: 10 }}>{isExpanded ? '▴' : '▾'}</span>
                                  </button>
                                )}
                              </div>
                            </td>
                            {/* Col 2: Articolo */}
                            <td style={{ ...tdS, paddingLeft: 8, textAlign: 'left' }}>
                              {root.modello || '—'}
                              {(() => {
                                const parts: string[] = []
                                if (root.larghezza_cm > 0) parts.push(`L:${root.larghezza_cm}`)
                                if (root.altezza_cm > 0)   parts.push(`H:${root.altezza_cm}`)
                                if (root.n_ante > 1) parts.push(`${root.n_ante} ante`)
                                if (root.colore) parts.push(root.colore)
                                return <div style={{ fontSize: 12, color: '#1a1a1a', marginTop: 1, textAlign: 'left' }}>{parts.join(' · ')}</div>
                              })()}
                              {root.note && <div style={{ fontSize: 12, color: '#555', marginTop: 1, fontStyle: 'italic', textAlign: 'left' }}>{root.note}</div>}
                            </td>
                            {/* Col 3: Q.tà + Rif + Prezzo */}
                            <td style={{ ...tdS, padding: 0, textAlign: 'center', position: 'relative' }}>
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #222', fontSize: 12, color: '#1a1a1a', padding: '0 4px' }}>
                                  N°&nbsp;{root.quantita}
                                </div>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #222', fontSize: 12, color: '#1a1a1a', padding: '0 4px' }}>
                                  rif #{String(gi + 1).padStart(3, '0')}
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 4px', whiteSpace: 'nowrap' }}>
                                  {isExpanded ? (
                                    <>
                                      {root.sconto_articolo_pct !== 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, fontFamily: 'monospace' }}>
                                          {root.prezzo_pre_sconto > 0 && (
                                            <span style={{ color: '#aaa', fontSize: 11, textDecoration: 'line-through' }}>{fmt(root.prezzo_pre_sconto)}</span>
                                          )}
                                          <span style={{ fontSize: 11, color: root.sconto_articolo_pct < 0 ? '#1565c0' : '#e65100' }}>
                                            {root.sconto_articolo_pct < 0 ? `+${Math.abs(root.sconto_articolo_pct)}%` : `−${root.sconto_articolo_pct}%`}
                                          </span>
                                        </div>
                                      )}
                                      {root.prezzo_totale === 0 && root.sconto_articolo_pct === 100
                                        ? <span style={{ fontSize: 11, color: '#2e7d32', fontStyle: 'italic' }}>Omaggio</span>
                                        : root.prezzo_totale === 0
                                          ? <span style={{ fontSize: 11, color: '#555', fontStyle: 'italic' }}>A corpo</span>
                                          : renderPrezzo(root.prezzo_totale)}
                                    </>
                                  ) : (() => {
                                    const lordo   = root.prezzo_pre_sconto + children.reduce((s, c) => s + c.prezzo_pre_sconto, 0)
                                    const netto   = root.prezzo_totale     + children.reduce((s, c) => s + c.prezzo_totale,     0)
                                    const hasDiff = Math.abs(lordo - netto) >= 0.01
                                    if (netto === 0 && root.sconto_articolo_pct === 100) return <span style={{ fontSize: 11, color: '#2e7d32', fontStyle: 'italic' }}>Omaggio</span>
                                    if (netto === 0) return <span style={{ fontSize: 11, color: '#c77700', fontStyle: 'italic' }}>Da definire</span>
                                    return (
                                      <>
                                        {hasDiff && <span style={{ color: '#aaa', fontSize: 11, textDecoration: 'line-through', fontFamily: 'monospace' }}>{fmt(lordo)}</span>}
                                        {renderPrezzo(netto)}
                                      </>
                                    )
                                  })()}
                                </div>
                              </div>
                            </td>
                            {/* Col 5: ✏ ✕ */}
                            {canEdit && (
                              <td style={{ ...tdS, padding: '4px 0', textAlign: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                  <button onClick={() => setEditArticolo(root)} className={`${b('btn-black', isApp)} btn-icon`} title="Modifica"
                                    style={{ fontFamily: 'inherit' }}>
                                    <span style={{ position: 'relative', zIndex: 1, fontSize: 13, display: 'inline-block', transform: 'rotate(135deg)' }}>✏</span>
                                  </button>
                                  <button onClick={() => handleElimina(root)} disabled={delPending} className={`${b('btn-red', isApp)} btn-icon`}
                                    style={{ fontFamily: 'inherit' }}>
                                    <span style={{ position: 'relative', zIndex: 1, fontSize: 13 }}>✕</span>
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>

                          {/* ── Righe caratteristiche figlie (espanse) ── */}
                          {isExpanded && children.map(child => (
                            <tr key={child.id} style={{ background: '#ffffff' }}>
                              {/* Col 1: foto */}
                              <td style={{ ...tdS, padding: 4, textAlign: 'center' }}>
                                {child.listino_foto_url && (
                                  <div style={{ position: 'relative', width: 42, height: 42, margin: '0 auto' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={child.listino_foto_url.startsWith('http') ? child.listino_foto_url : child.listino_foto_url.startsWith('/') ? child.listino_foto_url : `/${child.listino_foto_url}`}
                                      alt=""
                                      style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 4, display: 'block', opacity: child.listino_escluso === 1 ? 0.6 : 1 }}
                                    />
                                    {child.listino_escluso === 1 && (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src="/images/app/escluso.png" alt="ESCLUSO" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                                    )}
                                  </div>
                                )}
                              </td>
                              {/* Col 2: descrizione */}
                              <td style={{ ...tdS, paddingLeft: 12, textAlign: 'left' }}>
                                {child.modello || child.tipo_prodotto || '—'}{child.note ? ` (${child.note})` : ''}
                              </td>
                              {/* Col 3: N° (se >1) + prezzo */}
                              <td style={{ ...tdS, padding: 0, textAlign: 'center', position: 'relative' }}>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
                                  {child.quantita > 1 && (
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e0e0e0', fontSize: 12, color: '#1a1a1a', padding: '0 4px', whiteSpace: 'nowrap' }}>
                                      N°&nbsp;{child.quantita}
                                    </div>
                                  )}
                                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2px 4px', whiteSpace: 'nowrap' }}>
                                  {child.prezzo_totale === 0 && child.sconto_articolo_pct === 100 ? (
                                    <span style={{ fontSize: 11, color: '#2e7d32', fontStyle: 'italic' }}>Omaggio</span>
                                  ) : child.prezzo_totale === 0 && (child.tipo_prodotto + ' ' + child.modello).toLowerCase().includes('nessun') ? (
                                    <span style={{ fontSize: 11, color: '#b00020', fontStyle: 'italic' }}>Escluso</span>
                                  ) : child.prezzo_totale === 0 ? (
                                    <span style={{ fontSize: 11, color: '#555', fontStyle: 'italic' }}>Incluso</span>
                                  ) : (
                                    <>
                                      {child.sconto_articolo_pct !== 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, fontFamily: 'monospace' }}>
                                          {child.prezzo_pre_sconto !== 0 && (
                                            <span style={{ color: '#aaa', fontSize: 11, textDecoration: 'line-through' }}>{fmt(Math.abs(child.prezzo_pre_sconto))}</span>
                                          )}
                                          <span style={{ fontSize: 11, color: child.sconto_articolo_pct < 0 ? '#1565c0' : '#e65100' }}>
                                            {child.sconto_articolo_pct < 0 ? `+${Math.abs(child.sconto_articolo_pct)}%` : `−${child.sconto_articolo_pct}%`}
                                          </span>
                                        </div>
                                      )}
                                      {renderPrezzo(child.prezzo_totale)}
                                    </>
                                  )}
                                  </div>
                                </div>
                              </td>
                              {/* Col 5: ✏ ✕ */}
                              {canEdit && (
                                <td style={{ ...tdS, padding: '4px 0', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    {isStaff && (
                                      <button onClick={() => setEditArticolo(child)} className={`${b('btn-black', isApp)} btn-icon`} title="Modifica"
                                        style={{ fontFamily: 'inherit' }}>
                                        <span style={{ position: 'relative', zIndex: 1, fontSize: 13, display: 'inline-block', transform: 'rotate(135deg)' }}>✏</span>
                                      </button>
                                    )}
                                    <button onClick={() => handleElimina(child)} disabled={delPending} className={`${b('btn-red', isApp)} btn-icon`}
                                      style={{ fontFamily: 'inherit' }}>
                                      <span style={{ position: 'relative', zIndex: 1, fontSize: 13 }}>✕</span>
                                    </button>
                                  </div>
                                </td>
                              )}
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
      {(() => {
        const hasArticoliDaDefinire = articoli.filter(a => !a.parent_id).some(root => {
          const figli = articoli.filter(c => c.parent_id === root.id)
          return root.prezzo_totale === 0 && root.sconto_articolo_pct !== 100 && figli.every(c => c.prezzo_totale === 0)
        })
        const importoFinale = importo + (preventivo.prezzo_forfait ?? 0)
        if (importoFinale <= 0 && !hasArticoliDaDefinire) return null
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
          <div style={{ background: VERDE, border: '1px solid #222', borderRadius: 8, padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 4, color: '#1a1a1a' }}>
            {hasScontiPromo && row('Listino (escluso IVA):', `€ ${fmt(lordo)}`)}
            {hasScontiPromo && row('Sconti promozionali:', `− € ${fmt(scontiPromo)}`, { color: '#e65100' })}
            {(hasScontiPromo || scontoCliPct > 0) && row('Subtotale:', `€ ${fmt(subtotale)}`, { separator: hasScontiPromo })}
            {scontoCliPct > 0 && row(
              scontoCliPct === 5 ? 'Sconto di benvenuto (5%):' : `Sconto riservato al cliente (${scontoCliPct}%):`,
              `− € ${fmt(scontoCliAmt)}`,
              { color: '#e65100' }
            )}
            {row(
              'Importo preventivo:',
              importoFinale > 0 ? `€ ${fmt(importoFinale)}` : '—',
              { bold: true, large: true, color: '#111', separator: true }
            )}
            {hasArticoliDaDefinire && (
              <div style={{ textAlign: 'right', fontSize: 11, color: '#c77700', fontStyle: 'italic', fontFamily: 'monospace', marginTop: 1 }}>
                + Prezzi da definire
              </div>
            )}
            {isStaff && <ScontoClienteEditor preventivoId={preventivo.id} currentPct={scontoCliPct} isApp={isApp} />}
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
          isApp={isApp}
          percorsiPerListino={percorsiPerListino}
        />
      )}

      {showInoltra && (
        <InoltraModal
          preventivo={preventivo}
          clienteEmail={clienteEmail}
          clienteCellulare={clienteCellulare}
          onClose={() => setShowInoltra(false)}
          isApp={isApp}
        />
      )}

      {editArticolo && (
        <ModificaArticoloModal
          articolo={editArticolo}
          parentArt={editArticolo.parent_id !== null ? (articoli.find(a => a.id === editArticolo.parent_id) ?? null) : null}
          children={editArticolo.parent_id === null ? articoli.filter(a => a.parent_id === editArticolo.id) : []}
          listini={listini}
          onClose={() => setEditArticolo(null)}
          isStaff={isStaff}
          isApp={isApp}
          percorsiPerListino={percorsiPerListino}
        />
      )}

      {/* Bottone torna ai preventivi */}
      {!isApp && (
        <div>
          <a
            href={backHref ?? (isStaff ? '/clienti/preventivi' : '/area-clienti/preventivi')}
            className={b('btn-black', isApp)}
            style={{ padding: '0 20px', fontSize: 13, textDecoration: 'none' }}
          >
            ← Preventivi
          </a>
        </div>
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
              <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewArt.listino_foto_url.startsWith('http') ? previewArt.listino_foto_url : previewArt.listino_foto_url.startsWith('/') ? previewArt.listino_foto_url : `/${previewArt.listino_foto_url}`}
                  alt={previewArt.modello}
                  style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain', display: 'block', opacity: previewArt.listino_escluso === 1 ? 0.6 : 1 }}
                />
                {previewArt.listino_escluso === 1 && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/images/app/escluso.png" alt="ESCLUSO" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
                )}
              </div>
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
