'use client'

import { useState } from 'react'

type BlobItem = { url: string; nome: string; size: number }

export default function GestioneBlob({ prefix, label }: { prefix: string; label?: string }) {
  const [aperto, setAperto] = useState(false)
  const [blobs, setBlobs] = useState<BlobItem[]>([])
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState<string | null>(null)
  const [errore, setErrore] = useState('')

  async function carica() {
    setLoading(true); setErrore('')
    try {
      const res = await fetch(`/api/blob/lista?prefix=${encodeURIComponent(prefix)}`)
      const data = await res.json()
      setBlobs(data.blobs ?? [])
    } finally { setLoading(false) }
  }

  async function elimina(url: string, nome: string) {
    if (!confirm(`Eliminare "${nome}" da Vercel Blob?`)) return
    setPending(url); setErrore('')
    try {
      const res = await fetch('/api/blob/elimina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (data.ok) setBlobs(b => b.filter(x => x.url !== url))
      else setErrore(data.error ?? 'Errore.')
    } finally { setPending(null) }
  }

  function fmt(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div style={{ marginTop: 32, borderTop: '2px solid #e0e0e0', paddingTop: 16 }}>
      <button className="btn-gray" style={{ fontSize: 12 }}
        onClick={() => { setAperto(o => !o); if (!aperto) carica() }}>
        {aperto ? '▲ Chiudi' : '▼'} {label ?? 'Gestione Vercel Blob'}
      </button>

      {aperto && (
        <div style={{ marginTop: 12 }}>
          <button className="btn-gray" style={{ fontSize: 11, marginBottom: 8 }} onClick={carica}>↺ Aggiorna</button>
          {errore && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{errore}</div>}
          {loading && <div style={{ fontSize: 12, color: '#888' }}>Caricamento…</div>}
          {!loading && blobs.length === 0 && <div style={{ fontSize: 12, color: '#888' }}>Nessun file su Vercel Blob.</div>}
          {blobs.map(b => (
            <div key={b.url} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ flex: 1, fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all', color: '#333' }}>
                {b.nome}
              </span>
              <span style={{ fontSize: 11, color: '#aaa', flexShrink: 0 }}>{fmt(b.size)}</span>
              <a href={b.url} target="_blank" rel="noreferrer" className="btn-black"
                style={{ fontSize: 11, padding: '2px 8px', flexShrink: 0 }}>Apri</a>
              <button className="btn-red" style={{ fontSize: 11, padding: '2px 8px', flexShrink: 0 }}
                disabled={pending === b.url} onClick={() => elimina(b.url, b.nome)}>
                {pending === b.url ? '…' : 'Elimina'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
