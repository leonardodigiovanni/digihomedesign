'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Cantiere, Task, Media } from '@/app/area-lavoro/cantieri/cantieri-client'
import ApriCantiereBtn from './apri-btn'
import ApriTaskBtn from './apri-task-btn'

const STATI_TASK: Record<string, { label: string; color: string; bg: string }> = {
  da_fare:    { label: 'Da fare',    color: '#1565c0', bg: '#e3f2fd' },
  in_corso:   { label: 'In corso',   color: '#e65100', bg: '#fff3e0' },
  completato: { label: 'Completato', color: '#276749', bg: '#f0fff4' },
  sospeso:    { label: 'Sospeso',    color: '#666',    bg: '#f5f5f5' },
}

// ─── Viewer multimediale ──────────────────────────────────────────────────────



// ─── Griglia task ─────────────────────────────────────────────────────────────

const BRUSHED = 'repeating-linear-gradient(90deg,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.06) 1px,transparent 1px,transparent 3px),linear-gradient(160deg,#e8e8e8 0%,#d0d0d0 30%,#c4c4c4 50%,#d8d8d8 70%,#e4e4e4 100%)'

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
  cantiere, tasks, media, onBack,
}: {
  cantiere: Cantiere; tasks: Task[]; media: Media[]
  onBack: () => void
}) {
  const router = useRouter()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 3 }}>
      <div style={{ background: BRUSHED, border: '1px solid #222', borderRadius: 12, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.5)' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' }}>Task cantiere · {cantiere.titolo}</p>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: 0 }}>Seleziona un task per vedere le lavorazioni e i relativi documenti fotografici.</p>
      </div>
      <div style={{ background: BRUSHED, border: '1px solid #222', borderRadius: 10, padding: 12 }}>
        <button onClick={onBack} className="btn-black" style={{ height: 42, padding: '0 24px', borderRadius: 21, fontSize: 14 }}>
          ← Torna ai cantieri
        </button>
      </div>
      {tasks.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessuna lavorazione presente.</p>
      ) : (
        <div style={{ overflowX: 'auto', overflowY: 'hidden', borderRadius: 8, border: '1px solid #222', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: BRUSHED }}>
                <th style={TH_S}>Lavorazione</th>
                <th style={TH_S}>Dal</th>
                <th style={TH_S}>Al</th>
                <th style={{ ...TH_S, textAlign: 'center' }}>N° Files</th>
                <th style={{ ...TH_S, textAlign: 'center' }}>Stato</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t, i) => {
                const tMedia  = media.filter(m => m.task_id === t.id)
                const isLast  = i === tasks.length - 1
                const td      = isLast ? { ...TD_S, borderBottom: 'none' } : TD_S
                const statoStyle = STATI_TASK[t.stato] ?? STATI_TASK.da_fare
                return (
                  <tr key={t.id} style={{ height: 84, background: BRUSHED }}>
                    <td style={td}><ApriTaskBtn task={t} /></td>
                    <td style={{ ...td, whiteSpace: 'nowrap', color: '#777' }}>{t.data_inizio?.slice(0,10) || '—'}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap', color: '#777' }}>{t.data_fine?.slice(0,10) || '—'}</td>
                    <td style={{ ...td, textAlign: 'center', color: '#777' }}>{tMedia.length > 0 ? tMedia.length : '—'}</td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <span style={{ background: statoStyle.bg, color: statoStyle.color, padding: '2px 10px', borderRadius: 12, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{statoStyle.label}</span>
                    </td>
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

// ─── Griglia cantieri ─────────────────────────────────────────────────────────

const STATI_CANTIERE: Record<string, { label: string; color: string; bg: string }> = {
  preventivo: { label: 'Preventivo', color: '#1565c0', bg: '#e3f2fd' },
  in_corso:   { label: 'In corso',   color: '#e65100', bg: '#fff3e0' },
  completato: { label: 'Completato', color: '#276749', bg: '#f0fff4' },
  sospeso:    { label: 'Sospeso',    color: '#666',    bg: '#f5f5f5' },
}

function CantiereGrid({
  cantieri, tasks, media, onSelectCantiere,
}: {
  cantieri: Cantiere[]; tasks: Task[]; media: Media[]
  onSelectCantiere: (c: Cantiere) => void
}) {
  if (cantieri.length === 0) {
    return <p style={{ color: '#aaa', fontSize: 14 }}>Nessun cantiere attivo.</p>
  }

  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden', borderRadius: 8, border: '1px solid #222', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: BRUSHED }}>
            <th style={TH_S}>Cantiere</th>
            <th style={{ ...TH_S, textAlign: 'center' }}>Stato</th>
            <th style={TH_S}>Inizio</th>
            <th style={{ ...TH_S, textAlign: 'center' }}>Task</th>
          </tr>
        </thead>
        <tbody>
          {cantieri.map((c, i) => {
            const mieiTask = tasks.filter(t => t.cantiere_id === c.id)
            const stato    = STATI_CANTIERE[c.stato] ?? STATI_CANTIERE.preventivo
            const isLast   = i === cantieri.length - 1
            const td       = isLast ? { ...TD_S, borderBottom: 'none' } : TD_S
            return (
              <tr key={c.id} style={{ height: 84, background: BRUSHED }}>
                <td style={td}><ApriCantiereBtn cantiere={c} onSelect={onSelectCantiere} /></td>
                <td style={{ ...td, textAlign: 'center', color: '#333' }}>{stato.label}</td>
                <td style={{ ...td, whiteSpace: 'nowrap', color: '#777' }}>{c.inizio_lavori?.slice(0,10) || '—'}</td>
                <td style={{ ...td, textAlign: 'center', color: '#888' }}>{mieiTask.length}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function CantieriClienteClient({
  cantieri, tasks, media,
}: {
  cantieri: Cantiere[]; tasks: Task[]; media: Media[]
}) {
  const [selectedCantiere, setSelectedCantiere] = useState<Cantiere | null>(null)

  if (selectedCantiere) {
    const cantiereTask = tasks.filter(t => t.cantiere_id === selectedCantiere.id)
    return (
      <TaskGrid
        cantiere={selectedCantiere}
        tasks={cantiereTask}
        media={media}
        onBack={() => setSelectedCantiere(null)}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 3 }}>
      <div style={{ background: BRUSHED, border: '1px solid #222', borderRadius: 12, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.5)' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' }}>I miei cantieri</p>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: 0 }}>Seleziona un cantiere per vedere le lavorazioni e i relativi documenti fotografici.</p>
      </div>
      <CantiereGrid
        cantieri={cantieri}
        tasks={tasks}
        media={media}
        onSelectCantiere={c => setSelectedCantiere(c)}
      />
    </div>
  )
}
