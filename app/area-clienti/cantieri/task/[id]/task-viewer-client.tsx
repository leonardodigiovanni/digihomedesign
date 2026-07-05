'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { markVisto } from '@/app/area-lavoro/cantieri/actions'
import { cantiereSrc } from '@/lib/media-src'

// ─── Immagine zoomabile con pinch + drag ──────────────────────────────────────

function ZoomableImage({ src, alt, zoomLevel = 0, onZoomChange }: { src: string; alt: string; zoomLevel?: number; onZoomChange?: (z: number) => void }) {
  const [offset, setOffset]   = useState({ x: 0, y: 0 })
  const containerDim          = useRef({ w: 0, h: 0 })
  const imgDimRef             = useRef({ w: 0, h: 0 })
  const dragging              = useRef(false)
  const lastPos               = useRef({ x: 0, y: 0 })
  const lastDist              = useRef(0)
  const zoomRef               = useRef(zoomLevel)
  const containerRef          = useRef<HTMLDivElement>(null)

  zoomRef.current = zoomLevel

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      containerDim.current = { w: width, h: height }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (zoomLevel === 0) setOffset({ x: 0, y: 0 })
  }, [zoomLevel])

  function clamp(ox: number, oy: number, zf: number) {
    const { w: L, h: H } = containerDim.current
    const { w: iw, h: ih } = imgDimRef.current
    if (L === 0 || iw === 0) return { x: ox, y: oy }
    const s = Math.min(L / iw, H / ih)
    const maxX = Math.max(0, (iw * s * zf - L) / 2)
    const maxY = Math.max(0, (ih * s * zf - H) / 2)
    return {
      x: Math.min(maxX, Math.max(-maxX, ox)),
      y: Math.min(maxY, Math.max(-maxY, oy)),
    }
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        lastDist.current = Math.hypot(dx, dy)
        dragging.current = false
      } else if (e.touches.length === 1) {
        lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        dragging.current = true
      }
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault()
      const zf = zoomRef.current / 100 + 1
      if (e.touches.length === 2 && onZoomChange) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const newDist = Math.hypot(dx, dy)
        const ratio = newDist / lastDist.current
        lastDist.current = newDist
        const newZf = Math.min(5, Math.max(1, zf * ratio))
        onZoomChange(Math.round((newZf - 1) * 100))
      } else if (e.touches.length === 1 && dragging.current && zf > 1) {
        const dx = e.touches[0].clientX - lastPos.current.x
        const dy = e.touches[0].clientY - lastPos.current.y
        lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        setOffset(o => clamp(o.x + dx, o.y + dy, zf))
      }
    }

    function onTouchEnd() { dragging.current = false }

    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove',  onTouchMove,  { passive: false })
    el.addEventListener('touchend',   onTouchEnd)
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
      el.removeEventListener('touchend',   onTouchEnd)
    }
  }, [onZoomChange])

  function onMouseDown(e: React.MouseEvent) {
    if (zoomLevel <= 0) return
    dragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return
    const zf = zoomLevel / 100 + 1
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setOffset(o => clamp(o.x + dx, o.y + dy, zf))
  }
  function onMouseUp() { dragging.current = false }

  const zoomFactor = zoomLevel / 100 + 1

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{
        width: '100%', height: '100%',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: zoomFactor > 1 ? 'grab' : 'default',
        userSelect: 'none', touchAction: 'none',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src} alt={alt}
        draggable={false}
        onLoad={(e) => {
          const i = e.currentTarget
          imgDimRef.current = { w: i.naturalWidth, h: i.naturalHeight }
        }}
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain', display: 'block',
          transform: `scale(${zoomFactor}) translate(${offset.x / zoomFactor}px, ${offset.y / zoomFactor}px)`,
          transformOrigin: 'center center',
          transition: dragging.current ? 'none' : 'transform 0.1s ease',
        }}
      />
    </div>
  )
}

type Task = {
  id: number; cantiere_id: number; descrizione: string
  data_inizio: string | null; data_fine: string | null
  stato: string; note: string | null
}
type Media = {
  id: number; task_id: number; tipo: 'foto' | 'video'
  filename: string; descrizione: string | null; visto: number
}

function VideoPlayer({ src, onPlayed }: { src: string; onPlayed?: () => void }) {
  const videoRef              = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  function handlePlay() {
    videoRef.current?.play()
    setPlaying(true)
    onPlayed?.()
  }

  return (
    <div style={{ position: 'relative', width: '100%', lineHeight: 0 }}>
      <video
        ref={videoRef}
        src={src}
        controls={playing}
        style={{ width: '100%', maxHeight: 'calc(100svh - 180px)', objectFit: 'contain', display: 'block', background: '#000' }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && (
        <button onClick={handlePlay} style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(0,0,0,0.72)', border: '3px solid rgba(255,255,255,0.85)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 24 24" width="34" height="34" fill="white">
            <polygon points="6,3 20,12 6,21" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default function TaskViewerClient({ task, media }: { task: Task; media: Media[] }) {
  const router                    = useRouter()
  const [current, setCurrent]     = useState(0)
  const [imgKey, setImgKey]       = useState(0)
  const [zoomLevel, setZoomLevel] = useState(0)
  const markedRef                 = useRef<Set<number>>(new Set())

  useEffect(() => {
    const m = media[current]
    if (!m || markedRef.current.has(m.id)) return
    markedRef.current.add(m.id)
    markVisto(m.id)
  }, [current, media])

  const STATI: Record<string, { label: string; color: string; bg: string }> = {
    da_fare:    { label: 'Da fare',    color: '#1565c0', bg: '#e3f2fd' },
    in_corso:   { label: 'In corso',   color: '#e65100', bg: '#fff3e0' },
    completato: { label: 'Completato', color: '#276749', bg: '#f0fff4' },
    sospeso:    { label: 'Sospeso',    color: '#666',    bg: '#f5f5f5' },
  }
  const statoStyle = STATI[task.stato] ?? STATI.da_fare

  const m       = media[current]
  const isFirst = current === 0
  const isLast  = current === media.length - 1
  const label   = `x${parseFloat((1 + zoomLevel / 100).toFixed(1))}`

  function goTo(i: number) { setCurrent(i); setImgKey(k => k + 1); setZoomLevel(0) }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#fff',
      display: 'flex', flexDirection: 'column',
      padding: '6px', boxSizing: 'border-box',
      overflow: 'hidden', '--gap': '6px',
    } as React.CSSProperties}>

      {/* TOP */}
      <div style={{ flex: '0 0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{task.descrizione}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
              <span style={{
                background: statoStyle.bg, color: statoStyle.color,
                padding: '1px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
              }}>{statoStyle.label}</span>
              {task.data_inizio && <span style={{ fontSize: 12, color: '#777' }}>Dal {task.data_inizio}</span>}
              {task.data_fine   && <span style={{ fontSize: 12, color: '#777' }}>Al {task.data_fine}</span>}
            </div>
          </div>
          {media.length > 0 && (
            <div style={{ fontSize: 20, fontWeight: 800, color: '#c8960c', letterSpacing: '0.06em' }}>
              {current + 1} / {media.length}
            </div>
          )}
        </div>
      </div>

      {/* CENTRO: riquadro rosso */}
      <div style={{
        flex: 1, width: '100%',
        marginTop: 'var(--gap)', marginBottom: 'var(--gap)',
        border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 0, overflow: 'hidden', position: 'relative',
      }}>
        {media.length === 0 ? (
          <p style={{ color: '#888', fontSize: 15 }}>Nessun file caricato per questo task.</p>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
            {m.tipo === 'foto' ? (
              <ZoomableImage
                key={imgKey}
                src={cantiereSrc(m.task_id, m.filename)}
                alt={m.descrizione ?? ''}
                zoomLevel={zoomLevel}
                onZoomChange={setZoomLevel}
              />
            ) : (
              <VideoPlayer
                src={cantiereSrc(m.task_id, m.filename)}
                onPlayed={() => { if (!markedRef.current.has(m.id)) { markedRef.current.add(m.id); markVisto(m.id) } }}
              />
            )}

            {!isFirst && (
              <button onClick={() => goTo(current - 1)} style={{
                position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(21,101,192,0.5)', border: '2px solid rgba(255,255,255,0.4)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 24, lineHeight: 1,
              }}>‹</button>
            )}
            {!isLast && (
              <button onClick={() => goTo(current + 1)} style={{
                position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(21,101,192,0.5)', border: '2px solid rgba(255,255,255,0.4)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 24, lineHeight: 1,
              }}>›</button>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM */}
      <div style={{ flex: '0 0 auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        {m?.descrizione && (
          <div style={{ fontSize: 13, color: '#555', textAlign: 'center' }}>{m.descrizione}</div>
        )}

        {/* Slider zoom — solo per foto */}
        {m?.tipo === 'foto' && (() => {
          const TRACK = 200, THUMB = 42
          const thumbCenterX = (zoomLevel / 400) * (TRACK - THUMB) + THUMB / 2
          return (
            <div style={{ position: 'relative', width: TRACK, height: THUMB }}>
              <style>{`
                .zoom-sl { -webkit-appearance:none; appearance:none; width:${TRACK}px; height:3px; background:rgba(0,0,0,0.2); border-radius:2px; outline:none; cursor:pointer; position:absolute; top:50%; transform:translateY(-50%); margin:0; }
                .zoom-sl::-webkit-slider-thumb { -webkit-appearance:none; width:${THUMB}px; height:${THUMB}px; border-radius:50%; background:rgba(21,101,192,0.5); cursor:pointer; }
                .zoom-sl::-moz-range-thumb { width:${THUMB}px; height:${THUMB}px; border-radius:50%; background:rgba(21,101,192,0.5); border:none; cursor:pointer; }
              `}</style>
              <input className="zoom-sl" type="range" min="0" max="400" step="1"
                value={zoomLevel} onChange={e => setZoomLevel(+e.target.value)} />
              <span style={{
                position: 'absolute',
                left: thumbCenterX,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 11, fontWeight: 700, color: '#fff',
                pointerEvents: 'none', userSelect: 'none',
              }}>{label}</span>
            </div>
          )
        })()}

        {media.length > 1 && (
          <div style={{ display: 'flex', gap: 8 }}>
            {media.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === current ? 20 : 8, height: 8,
                borderRadius: 4, border: 'none', cursor: 'pointer',
                background: i === current ? '#c8960c' : '#444',
                transition: 'all 0.2s', padding: 0,
              }} />
            ))}
          </div>
        )}
        <button onClick={() => router.back()} className="btn-orange-app"
          style={{ padding: '0 32px', marginTop: 4 }}>
          Chiudi
        </button>
      </div>
    </div>
  )
}
