'use client'

import React, { useState, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { Cantiere, Task, Media } from '@/app/area-lavoro/cantieri/cantieri-client'
import ApriCantiereBtn from './apri-btn'
import ApriTaskBtn from './apri-task-btn'
import { b } from '@/lib/btn'
import { addMedia, addTask, addCantiere } from '@/app/area-lavoro/cantieri/actions'
import SetActionBar from '@/app/app/set-action-bar'
import InfoCard from '@/app/app/info-card'

const STATI_TASK: Record<string, { label: string; color: string; bg: string }> = {
  da_fare:    { label: 'Da fare',    color: '#1565c0', bg: '#e3f2fd' },
  in_corso:   { label: 'In corso',   color: '#e65100', bg: '#fff3e0' },
  completato: { label: 'Completato', color: '#276749', bg: '#f0fff4' },
  sospeso:    { label: 'Sospeso',    color: '#666',    bg: '#f5f5f5' },
}

// ─── Viewer multimediale ──────────────────────────────────────────────────────



// ─── Form nuovo cantiere (solo dipendenti) ───────────────────────────────────

type ClienteOpt = { id: number; label: string }

function AddCantiereForm({ clienti, isApp }: { clienti: ClienteOpt[]; isApp?: boolean }) {
  const router = useRouter()
  const [aperto,  setAperto]  = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [errore,  setErrore]  = useState('')
  const [titolo,  setTitolo]  = useState('')
  const [clienteId, setClienteId] = useState('')
  const [indirizzo, setIndirizzo] = useState('')
  const [stato,   setStato]   = useState('in_corso')
  const [inizio,  setInizio]  = useState('')
  const [fine,    setFine]    = useState('')

  async function salva() {
    if (!titolo.trim()) { setErrore('Il titolo è obbligatorio.'); return }
    setSaving(true); setErrore('')
    try {
      const fd = new FormData()
      fd.append('titolo',    titolo.trim())
      fd.append('stato',     stato)
      fd.append('indirizzo', indirizzo)
      if (clienteId) fd.append('cliente_id', clienteId)
      if (inizio)    fd.append('inizio_lavori', inizio)
      if (fine)      fd.append('fine_lavori',   fine)
      const res = await addCantiere(null, fd)
      if (res?.error) { setErrore(res.error); return }
      setTitolo(''); setClienteId(''); setIndirizzo(''); setStato('in_corso')
      setInizio(''); setFine(''); setAperto(false)
      router.refresh()
    } catch { setErrore('Errore salvataggio.') }
    finally { setSaving(false) }
  }

  const inp: React.CSSProperties = {
    padding: '7px 10px', border: '1px solid #555', borderRadius: 6,
    fontSize: 13, fontFamily: 'inherit', background: '#f5f5f5',
    boxSizing: 'border-box', width: '100%',
  }

  if (!aperto) return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button onClick={() => setAperto(true)} className={b('btn-green', isApp)}
        style={{ padding: '0 28px', fontSize: 13 }}>
        + Aggiungi cantiere
      </button>
    </div>
  )

  return (
    <div className="sfondo-riquadri-app" style={{ border: '1px solid #444', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Nuovo cantiere</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, color: '#555' }}>Titolo *</label>
        <input style={inp} value={titolo} onChange={e => setTitolo(e.target.value)} placeholder="es. Ristrutturazione Rossi" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, color: '#555' }}>Cliente</label>
        <select style={inp} value={clienteId} onChange={e => setClienteId(e.target.value)}>
          <option value="">— Nessun cliente —</option>
          {clienti.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, color: '#555' }}>Indirizzo</label>
        <input style={inp} value={indirizzo} onChange={e => setIndirizzo(e.target.value)} placeholder="Via..." />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, color: '#555' }}>Stato</label>
        <select style={inp} value={stato} onChange={e => setStato(e.target.value)}>
          <option value="preventivo">Preventivo</option>
          <option value="in_corso">In corso</option>
          <option value="completato">Completato</option>
          <option value="sospeso">Sospeso</option>
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#555' }}>Inizio lavori</label>
          <input type="date" style={inp} value={inizio} onChange={e => setInizio(e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#555' }}>Fine lavori</label>
          <input type="date" style={inp} value={fine} onChange={e => setFine(e.target.value)} />
        </div>
      </div>
      {errore && <div style={{ fontSize: 12, color: '#c00' }}>{errore}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={salva} disabled={saving} className={b('btn-green', isApp)}
          style={{ flex: 1, fontSize: 13 }}>
          {saving ? '…' : 'Salva'}
        </button>
        <button onClick={() => { setAperto(false); setErrore('') }} className={b('btn-gray', isApp)}
          style={{ flex: 1, fontSize: 13 }}>
          Annulla
        </button>
      </div>
    </div>
  )
}

// ─── Upload button (solo dipendenti) ─────────────────────────────────────────

function UploadBtn({ taskId }: { taskId: number }) {
  const router     = useRouter()
  const fotoRef    = useRef<HTMLInputElement>(null)
  const videoRef   = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [errore,    setErrore]    = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setErrore('')
    try {
      const uf = new FormData()
      uf.append('file', file)
      uf.append('task_id', String(taskId))
      const res  = await fetch('/api/upload-cantiere', { method: 'POST', body: uf })
      const data = await res.json()
      if (data.error) { setErrore(data.error); return }
      const fd = new FormData()
      fd.append('task_id',     String(taskId))
      fd.append('filename',    data.filename)
      fd.append('tipo',        data.tipo)
      fd.append('descrizione', '')
      await addMedia(null, fd)
      router.refresh()
    } catch { setErrore('Errore upload.') }
    finally {
      setUploading(false)
      if (fotoRef.current)    fotoRef.current.value    = ''
      if (videoRef.current)   videoRef.current.value   = ''
      if (galleryRef.current) galleryRef.current.value = ''
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {/* foto: solo image/*, capture → fotocamera in modalità foto */}
      <input ref={fotoRef}    type="file" accept="image/*" capture="environment"
        style={{ display: 'none' }} onChange={handleFile} />
      {/* video: solo video/*, capture → fotocamera in modalità video */}
      <input ref={videoRef}   type="file" accept="video/*" capture="environment"
        style={{ display: 'none' }} onChange={handleFile} />
      {/* galleria: nessun capture → file picker / rullino */}
      <input ref={galleryRef} type="file" accept="image/*,video/*"
        style={{ display: 'none' }} onChange={handleFile} />

      {uploading ? (
        <span style={{ fontSize: 13, color: '#888' }}>…</span>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
          <button onClick={() => fotoRef.current?.click()}
            className="btn-green-app" style={{ flex: 1, fontSize: 12, whiteSpace: 'nowrap' }}>
            + Foto
          </button>
          <button onClick={() => videoRef.current?.click()}
            className="btn-green-app" style={{ flex: 1, fontSize: 12, whiteSpace: 'nowrap' }}>
            + Video
          </button>
          <button onClick={() => galleryRef.current?.click()}
            className="btn-green-app" style={{ flex: 1, fontSize: 12, whiteSpace: 'nowrap' }}>
            + Galleria
          </button>
        </div>
      )}
      {errore && <div style={{ fontSize: 11, color: '#c00' }}>{errore}</div>}
    </div>
  )
}

// ─── Form nuovo task (solo dipendenti) ───────────────────────────────────────

function AddTaskForm({ cantiereId, isApp }: { cantiereId: number; isApp?: boolean }) {
  const router = useRouter()
  const [aperto,   setAperto]   = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [errore,   setErrore]   = useState('')
  const [descr,    setDescr]    = useState('')
  const [inizio,   setInizio]   = useState('')
  const [fine,     setFine]     = useState('')
  const [stato,    setStato]    = useState('da_fare')

  async function salva() {
    if (!descr.trim()) { setErrore('La descrizione è obbligatoria.'); return }
    setSaving(true); setErrore('')
    try {
      const fd = new FormData()
      fd.append('cantiere_id', String(cantiereId))
      fd.append('descrizione', descr.trim())
      fd.append('stato',       stato)
      if (inizio) fd.append('data_inizio', inizio)
      if (fine)   fd.append('data_fine',   fine)
      const res = await addTask(null, fd)
      if (res?.error) { setErrore(res.error); return }
      setDescr(''); setInizio(''); setFine(''); setStato('da_fare'); setAperto(false)
      router.refresh()
    } catch { setErrore('Errore salvataggio.') }
    finally { setSaving(false) }
  }

  const inp: React.CSSProperties = {
    padding: '7px 10px', border: '1px solid #555', borderRadius: 6,
    fontSize: 13, fontFamily: 'inherit', background: '#f5f5f5',
    boxSizing: 'border-box', width: '100%',
  }

  if (!aperto) return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button onClick={() => setAperto(true)} className={b('btn-green', isApp)}
        style={{ padding: '0 28px', fontSize: 13 }}>
        + Aggiungi task
      </button>
    </div>
  )

  return (
    <div className="sfondo-riquadri-app" style={{ border: '1px solid #444', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Aggiungi task</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, color: '#555' }}>Descrizione *</label>
        <input style={inp} value={descr} onChange={e => setDescr(e.target.value)} placeholder="es. Posa infissi piano terra" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#555' }}>Data inizio</label>
          <input type="date" style={inp} value={inizio} onChange={e => setInizio(e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, color: '#555' }}>Data fine</label>
          <input type="date" style={inp} value={fine} onChange={e => setFine(e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, color: '#555' }}>Stato</label>
        <select style={inp} value={stato} onChange={e => setStato(e.target.value)}>
          <option value="da_fare">Da fare</option>
          <option value="in_corso">In corso</option>
          <option value="completato">Completato</option>
          <option value="sospeso">Sospeso</option>
        </select>
      </div>
      {errore && <div style={{ fontSize: 12, color: '#c00' }}>{errore}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={salva} disabled={saving} className={b('btn-green', isApp)}
          style={{ flex: 1, fontSize: 13 }}>
          {saving ? '…' : 'Salva'}
        </button>
        <button onClick={() => { setAperto(false); setErrore('') }} className={b('btn-gray', isApp)}
          style={{ flex: 1, fontSize: 13 }}>
          Annulla
        </button>
      </div>
    </div>
  )
}

// ─── Griglia task ─────────────────────────────────────────────────────────────

const TH_S: React.CSSProperties = {
  padding: '9px 14px', fontSize: 14, fontWeight: 700, color: '#1a1a1a',
  textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
  borderBottom: '1px solid #333', whiteSpace: 'nowrap',
}
const TD_S: React.CSSProperties = {
  padding: '10px 14px', fontSize: 14, color: '#333',
  borderBottom: '1px solid #333', verticalAlign: 'middle',
}

function TaskGrid({
  cantiere, tasks, media, onBack, isApp, isDipendente,
}: {
  cantiere: Cantiere; tasks: Task[]; media: Media[]
  onBack: () => void; isApp?: boolean; isDipendente?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 3, marginRight: 3 }}>
      <div className="sfondo-riquadri-app" style={{ border: '1px solid #222', borderRadius: 12, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.5)' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' }}>Task cantiere · {cantiere.titolo}</p>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: 0 }}>
          {isDipendente
            ? 'Seleziona un task per aprirlo oppure carica foto/video direttamente.'
            : 'Seleziona un task per vedere le lavorazioni e i relativi documenti fotografici.'}
        </p>
      </div>

      {/* Torna — posizione normale quando non-app */}
      {!isApp && (
        <div className="sfondo-riquadri-app" style={{ border: '1px solid #222', borderRadius: 10, padding: 12 }}>
          <button onClick={onBack} className="btn-black" style={{ padding: '0 24px', fontSize: 14 }}>
            ← Torna ai cantieri
          </button>
        </div>
      )}

      {/* Torna — action bar fissa quando app */}
      {isApp && (
        <SetActionBar>
          <button onClick={onBack} className="btn-black-app" style={{ margin: '0 auto', padding: '0 32px' }}>
            ← Torna ai cantieri
          </button>
        </SetActionBar>
      )}

      {/* +Nuovo task in cima — solo dipendente */}
      {isDipendente && <AddTaskForm cantiereId={cantiere.id} isApp={isApp} />}

      {tasks.length > 0 && (
        <div style={{ overflowX: 'auto', overflowY: 'hidden', borderRadius: '8px 8px 0 0', border: '1px solid #222', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="sfondo-riquadri-app">
                <th style={TH_S}>Lavorazione</th>
                <th style={TH_S}>Dal</th>
                <th style={TH_S}>Al</th>
                <th style={{ ...TH_S, textAlign: 'center' }}>N° Files</th>
                <th style={{ ...TH_S, textAlign: 'center' }}>Stato</th>
                {isDipendente && <th style={{ ...TH_S, textAlign: 'center' }}></th>}
              </tr>
            </thead>
            <tbody>
              {tasks.map((t, i) => {
                const tMedia     = media.filter(m => m.task_id === t.id)
                const isLast     = i === tasks.length - 1
                const td         = isLast ? { ...TD_S, borderBottom: 'none' } : TD_S
                const statoStyle = STATI_TASK[t.stato] ?? STATI_TASK.da_fare
                return (
                  <tr key={t.id} className="sfondo-riquadri-app" style={{ height: 84 }}>
                    <td style={td}><ApriTaskBtn task={t} isApp={isApp} /></td>
                    <td style={{ ...td, whiteSpace: 'nowrap', color: '#777' }}>{t.data_inizio?.slice(0,10) || '—'}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap', color: '#777' }}>{t.data_fine?.slice(0,10) || '—'}</td>
                    <td style={{ ...td, textAlign: 'center', color: '#777' }}>{tMedia.length > 0 ? tMedia.length : '—'}</td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <span style={{ background: statoStyle.bg, color: statoStyle.color, padding: '2px 10px', borderRadius: 12, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{statoStyle.label}</span>
                    </td>
                    {isDipendente && (
                      <td style={{ ...td, textAlign: 'center' }}>
                        <UploadBtn taskId={t.id} />
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {tasks.length === 0 && !isDipendente && (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessuna lavorazione presente.</p>
      )}
    </div>
  )
}

// ─── Griglia cantieri ─────────────────────────────────────────────────────────

const STATI_CANTIERE: Record<string, { label: string; color: string; bg: string }> = {
  preventivo: { label: 'Preventivo', color: '#1565c0', bg: '#e3f2fd' },
  in_corso:   { label: 'In corso',   color: '#e65100', bg: '#fff3e0' },
  completato: { label: 'Completato', color: '#276749', bg: '#f0fff4' },
  sospeso:    { label: 'Sospeso',    color: '#666',    bg: '#f5f5f5' },
}

function CantiereGrid({
  cantieri, tasks, onSelectCantiere, isApp, isDipendente,
}: {
  cantieri: Cantiere[]; tasks: Task[]
  onSelectCantiere: (c: Cantiere) => void; isApp?: boolean; isDipendente?: boolean
}) {
  const [filtro, setFiltro] = useState('')

  if (cantieri.length === 0) {
    return <p style={{ color: '#aaa', fontSize: 14 }}>Nessun cantiere attivo.</p>
  }

  const visibili = filtro.trim()
    ? cantieri.filter(c => {
        const q = filtro.toLowerCase()
        return c.titolo?.toLowerCase().includes(q) ||
               (c.cliente_nome as string | null)?.toLowerCase().includes(q)
      })
    : cantieri

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {isDipendente && (
        <input
          type="search"
          placeholder="Cerca per cliente o cantiere…"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{
            padding: '9px 12px', fontSize: 14, border: '1px solid #444',
            borderRadius: 8, fontFamily: 'inherit', background: '#f5f5f5',
            boxSizing: 'border-box', width: '100%',
          }}
        />
      )}
      {visibili.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun cantiere trovato.</p>
      ) : (
        <div style={{ overflowX: 'auto', overflowY: 'hidden', borderRadius: '8px 8px 0 0', border: '1px solid #222', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="sfondo-riquadri-app">
                <th style={TH_S}>Cantiere</th>
                {isDipendente && <th style={{ ...TH_S, minWidth: 160 }}>Cliente</th>}
                <th style={{ ...TH_S, textAlign: 'center' }}>Stato</th>
                <th style={TH_S}>Inizio</th>
                <th style={{ ...TH_S, textAlign: 'center' }}>Task</th>
              </tr>
            </thead>
            <tbody>
              {visibili.map((c, i) => {
                const mieiTask = tasks.filter(t => t.cantiere_id === c.id)
                const stato    = STATI_CANTIERE[c.stato] ?? STATI_CANTIERE.preventivo
                const isLast   = i === visibili.length - 1
                const td       = isLast ? { ...TD_S, borderBottom: 'none' } : TD_S
                return (
                  <tr key={c.id} className="sfondo-riquadri-app" style={{ height: 84 }}>
                    <td style={td}><ApriCantiereBtn cantiere={c} onSelect={onSelectCantiere} isApp={isApp} /></td>
                    {isDipendente && <td style={{ ...td, minWidth: 160, fontSize: 13, color: '#555' }}>{(c.cliente_nome as string | null) || '—'}</td>}
                    <td style={{ ...td, textAlign: 'center', color: '#333' }}>{stato.label}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap', color: '#777' }}>{c.inizio_lavori?.slice(0,10) || '—'}</td>
                    <td style={{ ...td, textAlign: 'center', color: '#888' }}>{mieiTask.length}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function CantieriClienteClient({
  cantieri, tasks, media, isApp, isDipendente, clienti = [],
}: {
  cantieri: Cantiere[]; tasks: Task[]; media: Media[]
  isApp?: boolean; isDipendente?: boolean; clienti?: ClienteOpt[]
}) {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const [selectedCantiere, setSelectedCantiere] = useState<Cantiere | null>(() => {
    const id = Number(searchParams.get('cantiere'))
    return cantieri.find(c => c.id === id) ?? null
  })

  function selectCantiere(c: Cantiere) {
    setSelectedCantiere(c)
    router.replace(`${pathname}?cantiere=${c.id}`)
  }

  function deselect() {
    setSelectedCantiere(null)
    router.replace(pathname)
  }

  if (selectedCantiere) {
    const cantiereTask = tasks.filter(t => t.cantiere_id === selectedCantiere.id)
    return (
      <TaskGrid
        cantiere={selectedCantiere}
        tasks={cantiereTask}
        media={media}
        onBack={deselect}
        isApp={isApp}
        isDipendente={isDipendente}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 3, marginRight: 3 }}>
      <InfoCard
        titolo="Cantieri"
        corpo="Segui i tuoi lavori in tempo reale: foto, aggiornamenti e rapporti giornalieri."
      />
      {isDipendente && <AddCantiereForm clienti={clienti} isApp={isApp} />}
      <CantiereGrid
        cantieri={cantieri}
        tasks={tasks}
        onSelectCantiere={selectCantiere}
        isApp={isApp}
        isDipendente={isDipendente}
      />
    </div>
  )
}
