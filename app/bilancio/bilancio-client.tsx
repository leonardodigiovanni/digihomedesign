'use client'

import React, { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  addMovimento, deleteMovimento,
  type AddMovimentoResult, type DeleteMovimentoResult,
} from './actions'
import FlashSuccess from '@/components/flash-success'

// ─── Tipi ────────────────────────────────────────────────────────────────────

export type Movimento = {
  id: number
  data: string
  anno: number
  tipo: 'entrata' | 'uscita'
  sezione_ce: string
  sezione_sp: string
  descrizione: string | null
  importo: number
  created_by: string
  created_at: string
}

// ─── Costanti categorie ───────────────────────────────────────────────────────

const CE_ENTRATE = [
  'Ricavi delle vendite',
  'Prestazioni di servizi',
  'Altri ricavi',
  'Proventi finanziari',
]

const CE_USCITE = [
  'Materie prime e materiali',
  'Servizi',
  'Personale',
  'Ammortamenti',
  'Oneri finanziari',
  'Oneri diversi',
  'Imposte',
]

const SP_ATTIVO = [
  'Disponibilità liquide',
  'Crediti',
  'Rimanenze',
  'Immobilizzazioni',
]

const SP_PASSIVO = [
  'Debiti',
  'Fondi e TFR',
  'Capitale sociale',
]

// ─── Utility ──────────────────────────────────────────────────────────────────

function eur(n: number) {
  return n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function sumBy(movimenti: Movimento[], tipo: 'entrata' | 'uscita', sezione: string) {
  return movimenti
    .filter(m => m.tipo === tipo && m.sezione_ce === sezione)
    .reduce((acc, m) => acc + Number(m.importo), 0)
}

function sumSP(movimenti: Movimento[], tipo: 'entrata' | 'uscita', sezione: string) {
  return movimenti
    .filter(m => m.tipo === tipo && m.sezione_sp === sezione)
    .reduce((acc, m) => acc + Number(m.importo), 0)
}

// ─── Stili condivisi ──────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: 10,
  overflow: 'hidden',
}

const cardHeader: React.CSSProperties = {
  padding: '14px 20px',
  borderBottom: '1px solid #f0f0f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 14,
  border: '1px solid #ccc',
  borderRadius: 6,
  fontFamily: 'inherit',
  background: '#fff',
}

// ─── Conto Economico ──────────────────────────────────────────────────────────

function ContoEconomico({ movimenti }: { movimenti: Movimento[] }) {
  const totRicavi = CE_ENTRATE.reduce((a, s) => a + sumBy(movimenti, 'entrata', s), 0)
  const totCosti  = CE_USCITE.reduce((a, s) => a + sumBy(movimenti, 'uscita', s), 0)
  const risultato = totRicavi - totCosti
  const isUtile   = risultato >= 0

  const rowStyle = (bold = false): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    padding: '7px 20px',
    fontSize: bold ? 14 : 13,
    fontWeight: bold ? 700 : 400,
    borderBottom: '1px solid #f5f5f5',
    color: bold ? '#1a1a1a' : '#444',
  })

  const sectionHeader = (label: string): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    padding: '8px 20px',
    fontSize: 12,
    fontWeight: 600,
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    background: '#fafafa',
    borderBottom: '1px solid #ececec',
  })

  return (
    <div style={card}>
      <div style={cardHeader}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Conto Economico</h3>
      </div>

      {/* A — Ricavi */}
      <div style={sectionHeader('a')}>
        <span>A — Valore della produzione</span>
        <span>€ {eur(totRicavi)}</span>
      </div>
      {CE_ENTRATE.map(s => {
        const val = sumBy(movimenti, 'entrata', s)
        if (val === 0) return null
        return (
          <div key={s} style={rowStyle()}>
            <span style={{ paddingLeft: 12 }}>• {s}</span>
            <span style={{ color: '#1a7a3a', fontWeight: 600 }}>€ {eur(val)}</span>
          </div>
        )
      })}
      {CE_ENTRATE.every(s => sumBy(movimenti, 'entrata', s) === 0) && (
        <div style={{ padding: '10px 20px 10px 32px', fontSize: 13, color: '#bbb' }}>Nessun ricavo registrato</div>
      )}

      {/* B — Costi */}
      <div style={{ ...sectionHeader('b'), marginTop: 4 }}>
        <span>B — Costi della produzione</span>
        <span>€ {eur(totCosti)}</span>
      </div>
      {CE_USCITE.map(s => {
        const val = sumBy(movimenti, 'uscita', s)
        if (val === 0) return null
        return (
          <div key={s} style={rowStyle()}>
            <span style={{ paddingLeft: 12 }}>• {s}</span>
            <span style={{ color: '#c00', fontWeight: 600 }}>€ {eur(val)}</span>
          </div>
        )
      })}
      {CE_USCITE.every(s => sumBy(movimenti, 'uscita', s) === 0) && (
        <div style={{ padding: '10px 20px 10px 32px', fontSize: 13, color: '#bbb' }}>Nessun costo registrato</div>
      )}

      {/* Risultato */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        padding: '12px 20px',
        fontSize: 15,
        fontWeight: 700,
        background: isUtile ? '#f0fff4' : '#fff5f5',
        borderTop: `2px solid ${isUtile ? '#22c55e' : '#ef4444'}`,
        color: isUtile ? '#166534' : '#991b1b',
      }}>
        <span>{isUtile ? 'Utile d\'esercizio (A − B)' : 'Perdita d\'esercizio (A − B)'}</span>
        <span>{isUtile ? '+' : ''}€ {eur(risultato)}</span>
      </div>
    </div>
  )
}

// ─── Stato Patrimoniale ───────────────────────────────────────────────────────

function StatoPatrimoniale({ movimenti, risultatoCE }: { movimenti: Movimento[]; risultatoCE: number }) {
  const totAttivo   = SP_ATTIVO.reduce((a, s) => a + sumSP(movimenti, 'entrata', s), 0)
  const totPassivo  = SP_PASSIVO.reduce((a, s) => a + sumSP(movimenti, 'uscita', s), 0)
  const totPatr     = totPassivo + risultatoCE

  const colLabel: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: '#888',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    padding: '10px 16px', background: '#fafafa',
    borderBottom: '1px solid #ececec',
  }

  const spRow = (label: string, val: number, accent?: string): React.CSSProperties => ({})

  const renderSPRow = (label: string, val: number, accent?: string) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '7px 16px', borderBottom: '1px solid #f5f5f5', fontSize: 13, color: '#444' }}>
      <span>• {label}</span>
      <span style={{ fontWeight: 600, color: accent ?? '#1a1a1a' }}>€ {eur(val)}</span>
    </div>
  )

  const totRow = (label: string, val: number, color: string) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '10px 16px', fontSize: 14, fontWeight: 700, color, borderTop: '2px solid #e0e0e0' }}>
      <span>{label}</span>
      <span>€ {eur(val)}</span>
    </div>
  )

  return (
    <div style={card}>
      <div style={cardHeader}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Stato Patrimoniale</h3>
        <span style={{ fontSize: 12, color: '#aaa' }}>dati dell'anno selezionato</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #f0f0f0' }}>
        {/* ATTIVO */}
        <div style={{ borderRight: '1px solid #e8e8e8' }}>
          <div style={colLabel}>Attivo</div>
          {SP_ATTIVO.map(s => {
            const val = sumSP(movimenti, 'entrata', s)
            if (val === 0) return null
            return <React.Fragment key={s}>{renderSPRow(s, val, '#1a7a3a')}</React.Fragment>
          })}
          {SP_ATTIVO.every(s => sumSP(movimenti, 'entrata', s) === 0) && (
            <div style={{ padding: '10px 16px', fontSize: 13, color: '#bbb' }}>Nessuna voce</div>
          )}
          {totRow('Totale Attivo', totAttivo, '#1a1a1a')}
        </div>

        {/* PASSIVO + PATRIMONIO NETTO */}
        <div>
          <div style={colLabel}>Passivo</div>
          {SP_PASSIVO.map(s => {
            const val = sumSP(movimenti, 'uscita', s)
            if (val === 0) return null
            return <React.Fragment key={s}>{renderSPRow(s, val, '#c00')}</React.Fragment>
          })}
          {SP_PASSIVO.every(s => sumSP(movimenti, 'uscita', s) === 0) && (
            <div style={{ padding: '10px 16px', fontSize: 13, color: '#bbb' }}>Nessuna voce</div>
          )}

          {/* Patrimonio netto: utile/perdita CE */}
          <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '10px 16px 4px', borderTop: '1px solid #ececec' }}>
            Patrimonio netto
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '7px 16px', borderBottom: '1px solid #f5f5f5', fontSize: 13, color: risultatoCE >= 0 ? '#166534' : '#991b1b' }}>
            <span>• {risultatoCE >= 0 ? 'Utile' : 'Perdita'} d'esercizio</span>
            <span style={{ fontWeight: 600 }}>€ {eur(risultatoCE)}</span>
          </div>

          {totRow('Totale Passivo + PN', totPatr, '#1a1a1a')}
        </div>
      </div>
    </div>
  )
}

// ─── Form aggiunta movimento ──────────────────────────────────────────────────

function AddMovimentoForm() {
  const router = useRouter()
  const [tipo, setTipo]       = useState<'entrata' | 'uscita'>('entrata')
  const [sezCe, setSezCe]     = useState(CE_ENTRATE[0])
  const [sezSp, setSezSp]     = useState(SP_ATTIVO[0])
  const [formKey, setFormKey] = useState(0)
  const [dirty, setDirty]     = useState(false)

  const [result, formAction, pending] = useActionState<AddMovimentoResult | null, FormData>(addMovimento, null)

  useEffect(() => {
    if (result?.ok) {
      router.refresh()
      handleReset()
    }
  }, [result])

  function handleReset() {
    setFormKey(k => k + 1)
    setTipo('entrata')
    setSezCe(CE_ENTRATE[0])
    setSezSp(SP_ATTIVO[0])
    setDirty(false)
  }

  function handleTipoChange(t: 'entrata' | 'uscita') {
    setTipo(t)
    setSezCe(t === 'entrata' ? CE_ENTRATE[0] : CE_USCITE[0])
    setSezSp(t === 'entrata' ? SP_ATTIVO[0] : SP_PASSIVO[0])
    setDirty(true)
  }

  const oggi    = new Date().toISOString().slice(0, 10)
  const ceCats  = tipo === 'entrata' ? CE_ENTRATE : CE_USCITE
  const spCats  = tipo === 'entrata' ? SP_ATTIVO  : SP_PASSIVO

  return (
    <div style={card}>
      <div style={cardHeader}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Registra movimento</h3>
      </div>

      <form key={formKey} action={formAction} onChange={() => setDirty(true)} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Tipo */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['entrata', 'uscita'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => handleTipoChange(t)}
              className={tipo === t ? (t === 'entrata' ? 'btn-green' : 'btn-red') : 'btn-gray'}
              style={{ padding: '8px 24px', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}
            >
              {t === 'entrata' ? '▲ Entrata' : '▼ Uscita'}
            </button>
          ))}
        </div>

        {/* Campi principali */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: 12, alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Data *</label>
            <input
              name="data"
              type="date"
              defaultValue={oggi}
              required
              style={{ ...inputStyle, width: 140 }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Importo (€) *</label>
            <input
              name="importo"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0,00"
              required
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Descrizione</label>
            <input
              name="descrizione"
              type="text"
              placeholder="Nota libera (opzionale)"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Categorie */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Categoria Conto Economico *</label>
            <select
              name="sezione_ce"
              value={sezCe}
              onChange={e => setSezCe(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {ceCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>Categoria Stato Patrimoniale *</label>
            <select
              name="sezione_sp"
              value={sezSp}
              onChange={e => setSezSp(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {spCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Hidden tipo */}
        <input type="hidden" name="tipo" value={tipo} />

        {/* Feedback */}
        {result && !result.ok && (
          <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 6, padding: '8px 14px', fontSize: 13, color: '#c00' }}>
            {result.error}
          </div>
        )}
        <FlashSuccess result={result} message="Movimento registrato." />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          {dirty && (
            <button
              type="button"
              disabled={pending}
              onClick={handleReset}
              className="btn-red"
              style={{ padding: '9px 22px', fontSize: 14, fontFamily: 'inherit', fontWeight: 600 }}
            >
              Annulla
            </button>
          )}
          <button
            type="submit"
            disabled={pending}
            className={pending ? 'btn-gray' : 'btn-green'}
            style={{ padding: '9px 28px', fontSize: 14, fontFamily: 'inherit', fontWeight: 600 }}
          >
            {pending ? 'Salvataggio…' : tipo === 'entrata' ? '▲ Salva entrata' : '▼ Salva uscita'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Lista movimenti ──────────────────────────────────────────────────────────

function MovimentiList({ movimenti, role }: { movimenti: Movimento[]; role: string }) {
  const router = useRouter()

  if (movimenti.length === 0) return null

  return (
    <div style={card}>
      <div style={cardHeader}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
          Movimenti — {movimenti.length} registrazioni
        </h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
              {['Data', 'Tipo', 'Categoria CE', 'Categoria SP', 'Descrizione', 'Importo', ...(role === 'admin' ? [''] : [])].map(h => (
                <th key={h} style={{ padding: '9px 14px', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: h === 'Importo' ? 'right' : 'left', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {movimenti.map(m => (
              <MovimentoRow key={m.id} m={m} role={role} onDeleted={() => router.refresh()} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MovimentoRow({ m, role, onDeleted }: { m: Movimento; role: string; onDeleted: () => void }) {
  const [result, action, pending] = useActionState<DeleteMovimentoResult | null, FormData>(deleteMovimento, null)
  useEffect(() => { if (result?.ok) onDeleted() }, [result])

  const isEntrata = m.tipo === 'entrata'

  return (
    <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
      <td style={{ padding: '9px 14px', fontSize: 13, color: '#888', whiteSpace: 'nowrap' }}>{formatDate(m.data)}</td>
      <td style={{ padding: '9px 14px' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
          background: isEntrata ? '#dcfce7' : '#fee2e2',
          color: isEntrata ? '#166534' : '#991b1b',
        }}>
          {isEntrata ? '▲ Entrata' : '▼ Uscita'}
        </span>
      </td>
      <td style={{ padding: '9px 14px', fontSize: 13, color: '#444' }}>{m.sezione_ce}</td>
      <td style={{ padding: '9px 14px', fontSize: 13, color: '#444' }}>{m.sezione_sp}</td>
      <td style={{ padding: '9px 14px', fontSize: 13, color: '#888', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {m.descrizione || <span style={{ color: '#ccc' }}>—</span>}
      </td>
      <td style={{ padding: '9px 14px', fontSize: 14, fontWeight: 700, textAlign: 'right', whiteSpace: 'nowrap', color: isEntrata ? '#166534' : '#991b1b' }}>
        {isEntrata ? '+' : '−'} € {eur(Number(m.importo))}
      </td>
      {role === 'admin' && (
        <td style={{ padding: '9px 14px' }}>
          <form action={action} onSubmit={e => { if (!confirm('Eliminare questo movimento?')) e.preventDefault() }}>
            <input type="hidden" name="id" value={m.id} />
            <button
              type="submit"
              disabled={pending}
              className={pending ? 'btn-gray' : 'btn-red'}
              style={{ padding: '3px 10px', fontSize: 11, borderRadius: 4, fontFamily: 'inherit' }}
            >
              {pending ? '…' : 'Elimina'}
            </button>
          </form>
        </td>
      )}
    </tr>
  )
}

// ─── KPI cards ────────────────────────────────────────────────────────────────

function KpiCards({ movimenti }: { movimenti: Movimento[] }) {
  const totEntrate = movimenti.filter(m => m.tipo === 'entrata').reduce((a, m) => a + Number(m.importo), 0)
  const totUscite  = movimenti.filter(m => m.tipo === 'uscita').reduce((a, m) => a + Number(m.importo), 0)
  const risultato  = totEntrate - totUscite

  const kCard: React.CSSProperties = {
    background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '18px 22px',
    display: 'flex', flexDirection: 'column', gap: 4,
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      <div style={kCard}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Totale entrate</span>
        <span style={{ fontSize: 24, fontWeight: 700, color: '#166534' }}>€ {eur(totEntrate)}</span>
        <span style={{ fontSize: 12, color: '#aaa' }}>{movimenti.filter(m => m.tipo === 'entrata').length} movimenti</span>
      </div>
      <div style={kCard}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Totale uscite</span>
        <span style={{ fontSize: 24, fontWeight: 700, color: '#991b1b' }}>€ {eur(totUscite)}</span>
        <span style={{ fontSize: 12, color: '#aaa' }}>{movimenti.filter(m => m.tipo === 'uscita').length} movimenti</span>
      </div>
      <div style={{ ...kCard, borderLeft: `4px solid ${risultato >= 0 ? '#22c55e' : '#ef4444'}` }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {risultato >= 0 ? 'Utile' : 'Perdita'} d'esercizio
        </span>
        <span style={{ fontSize: 24, fontWeight: 700, color: risultato >= 0 ? '#166534' : '#991b1b' }}>
          {risultato >= 0 ? '+' : ''}€ {eur(risultato)}
        </span>
        <span style={{ fontSize: 12, color: '#aaa' }}>{movimenti.length} movimenti totali</span>
      </div>
    </div>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function BilancioClient({ movimenti, anno, anni, role }: {
  movimenti: Movimento[]
  anno: number
  anni: number[]
  role: string
}) {
  const router = useRouter()

  const totEntrate = movimenti.filter(m => m.tipo === 'entrata').reduce((a, m) => a + Number(m.importo), 0)
  const totUscite  = movimenti.filter(m => m.tipo === 'uscita').reduce((a, m) => a + Number(m.importo), 0)
  const risultatoCE = totEntrate - totUscite

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header con selettore anno */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, color: '#555', fontWeight: 500 }}>Anno di riferimento:</span>
        <select
          value={anno}
          onChange={e => router.push(`/bilancio?anno=${e.target.value}`)}
          style={{ ...inputStyle, fontSize: 15, fontWeight: 700, padding: '6px 12px', cursor: 'pointer' }}
        >
          {anni.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* KPI */}
      <KpiCards movimenti={movimenti} />

      {/* Form inserimento */}
      <AddMovimentoForm />

      {/* Conto Economico */}
      <ContoEconomico movimenti={movimenti} />

      {/* Stato Patrimoniale */}
      <StatoPatrimoniale movimenti={movimenti} risultatoCE={risultatoCE} />

      {/* Lista movimenti */}
      <MovimentiList movimenti={movimenti} role={role} />
    </div>
  )
}
