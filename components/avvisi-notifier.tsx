'use client'

import { useEffect, useRef, useState } from 'react'
import { segnaLetti } from '@/app/area-clienti/avvisi/actions'

type AvvisoPreview = { id: number; oggetto: string; testo: string }

let _lastBellMs = 0
function bell() {
  const now = Date.now()
  if (now - _lastBellMs < 5_000) return   // debounce: una sola campanella ogni 5s
  _lastBellMs = now
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'; osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1.5)
  } catch {}
}

export default function AvvisiNotifier() {
  const [toast, setToast]       = useState(false)
  const [preview, setPreview]   = useState<AvvisoPreview | null>(null)
  const [isTouch, setIsTouch]   = useState(false)
  const countRef                = useRef(-1)

  useEffect(() => { setIsTouch(window.matchMedia('(pointer: coarse)').matches) }, [])

  useEffect(() => {
    async function check() {
      try {
        const res  = await fetch('/api/avvisi/unread', { cache: 'no-store' })
        const data = await res.json() as { count: number }
        if (countRef.current >= 0 && data.count > countRef.current) {
          bell()
          setToast(true)
        }
        countRef.current = data.count
        window.dispatchEvent(new CustomEvent('avvisi-count-changed', { detail: { count: data.count } }))
      } catch {}
    }
    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [])

  async function handleLeggi() {
    setToast(false)
    try {
      const res  = await fetch('/api/avvisi/latest', { cache: 'no-store' })
      const data = await res.json() as { avviso: AvvisoPreview | null }
      if (data.avviso) {
        setPreview(data.avviso)
        await segnaLetti([data.avviso.id])
        const r2 = await fetch('/api/avvisi/unread', { cache: 'no-store' })
        const d2 = await r2.json() as { count: number }
        window.dispatchEvent(new CustomEvent('avvisi-count-changed', { detail: { count: d2.count } }))
      }
    } catch {}
  }

  return (
    <>
      {/* Toast notifica — centrato a tutto schermo */}
      {toast && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        <div style={{
          background: '#fff', border: '2px solid #c8960c', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16,
          minWidth: 280, maxWidth: 360, width: '90%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'monospace' }}>
              Hai ricevuto un avviso
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleLeggi}
              className="btn-black"
              style={{ flex: 1, height: 42, borderRadius: 21, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Leggi
            </button>
            <button
              onClick={() => setToast(false)}
              className="btn-orange"
              style={{ flex: 1, height: 42, borderRadius: 21, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Dopo
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Preview fullscreen — clic ovunque per chiudere */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          onTouchStart={() => setPreview(null)}
          style={{
            position: 'fixed', inset: 0, background: '#fff', zIndex: 2100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 32,
          }}
        >
          {/* Oggetto — fisso in alto, stesso layout di AvvisiCliente */}
          <div style={{ position: 'absolute', top: 20, left: 32, right: 32 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>Oggetto:</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1a1a1a' }}>{preview.oggetto}</span>
            </div>
          </div>
          {/* Testo — centrato */}
          <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 16, color: '#333', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{preview.testo}</p>
          </div>
          <p style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', margin: 0, fontSize: 11, color: '#bbb', fontStyle: 'italic', fontFamily: 'monospace' }}>
            {isTouch ? 'Tocca per chiudere' : 'Clicca per chiudere'}
          </p>
        </div>
      )}
    </>
  )
}
