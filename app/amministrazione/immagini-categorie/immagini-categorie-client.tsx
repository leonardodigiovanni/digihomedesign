'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { CategoriaImmagine, SottocategoriaImmagine, TipoCategoriaImmagini, TipoConSottocategoria, SlotImmagine } from '@/lib/categoria-immagini'
import { rimuoviImmagineCategoria } from './actions'

// Un solo listener "paste" globale (in ImmaginiCategorieClient) smista il file
// incollato allo slot attualmente attivo — stesso meccanismo di ImgUploadRow in
// listini-client.tsx (click per attivare, poi Ctrl+V), generalizzato con un
// registro di handler perché qui gli slot sono molti (una riga per categoria/coppia).
type RegistraPasteHandler = (key: string, handler: ((f: File) => void) | null) => void

function ImmagineSlotBox({ tipo, categoria, sottocategoria, slot, urlIniziale, activeKey, onActivate, registraPasteHandler }: {
  tipo: TipoCategoriaImmagini
  categoria: string
  sottocategoria: string // '' per lo slot "categoria" (o per "Generale" nei cataloghi)
  slot: SlotImmagine
  urlIniziale: string | null
  activeKey: string | null
  onActivate: (key: string) => void
  registraPasteHandler: RegistraPasteHandler
}) {
  const router = useRouter()
  const [url, setUrl] = useState(urlIniziale)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [pasteFlash, setPasteFlash] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const key = `${tipo}|||${categoria}|||${sottocategoria}|||${slot}`
  const isTarget = activeKey === key

  async function handleFile(f: File) {
    setErr(null)
    setUploading(true)
    const fd = new FormData()
    fd.set('tipo', tipo)
    fd.set('categoria', categoria)
    fd.set('sottocategoria', sottocategoria)
    fd.set('slot', slot)
    fd.set('foto', f)
    try {
      const res = await fetch('/api/categoria-immagini', { method: 'POST', body: fd })
      const data = await res.json() as { ok: boolean; url?: string; error?: string }
      if (data.ok && data.url) setUrl(`${data.url}?t=${Date.now()}`)
      else setErr(data.error ?? 'Errore upload')
    } catch {
      setErr('Errore di rete durante l\'upload')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    registraPasteHandler(key, (f: File) => {
      setPasteFlash(true)
      setTimeout(() => setPasteFlash(false), 600)
      handleFile(f)
    })
    return () => registraPasteHandler(key, null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  async function handleRimuovi() {
    setUploading(true)
    await rimuoviImmagineCategoria(tipo, categoria, sottocategoria, slot)
    setUrl(null)
    setUploading(false)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', width: 104, flexShrink: 0 }}>
      <div style={{ width: 84, height: 84, borderRadius: 6, overflow: 'hidden', border: '1px solid #e3e3e3', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <span className="fs-11" style={{ color: '#bbb' }}>Nessuna</span>
        )}
      </div>
      <input
        ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
      />
      <div style={{ display: 'flex', gap: 4 }}>
        <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} className="btn-gray fs-11" style={{ padding: '4px 8px' }}>
          Carica
        </button>
        {url && (
          <button type="button" disabled={uploading} onClick={handleRimuovi} className="btn-red fs-11" style={{ padding: '4px 8px' }}>
            ✕
          </button>
        )}
      </div>
      <div
        onClick={() => onActivate(key)}
        style={{
          border: `1px ${isTarget ? 'solid' : 'dashed'} ${pasteFlash ? '#2b6cb0' : isTarget ? '#2b6cb0' : '#ccc'}`,
          borderRadius: 4, padding: '3px 6px', width: '100%', boxSizing: 'border-box',
          background: pasteFlash ? '#ebf4ff' : isTarget ? '#f0f6ff' : '#fafafa',
          textAlign: 'center', fontSize: 10,
          color: pasteFlash ? '#2b6cb0' : isTarget ? '#2b6cb0' : '#aaa',
          transition: 'all 0.2s', userSelect: 'none', cursor: 'pointer',
        }}
      >
        {pasteFlash ? '✓ Incollata' : isTarget ? '📋 Ctrl+V qui' : '📋 Attiva Ctrl+V'}
      </div>
      {err && <span className="fs-11" style={{ color: '#c00', textAlign: 'center' }}>{err}</span>}
    </div>
  )
}

function GrigliaCategorie({ titolo, tipo, righe, activeKey, onActivate, registraPasteHandler }: {
  titolo: string
  tipo: TipoCategoriaImmagini
  righe: CategoriaImmagine[]
  activeKey: string | null
  onActivate: (key: string) => void
  registraPasteHandler: RegistraPasteHandler
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 className="fs-16" style={{ fontWeight: 700, marginBottom: 8 }}>{titolo}</h3>
      {righe.length === 0 ? (
        <p className="fs-13" style={{ color: '#aaa' }}>Nessuna categoria trovata.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {righe.map(r => (
            <div key={r.categoria} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: '1px solid #e3e3e3', borderRadius: 8, padding: '10px 14px', flexWrap: 'wrap' }}>
              <div className="fs-14" style={{ fontWeight: 700, flex: 1, minWidth: 140 }}>{r.categoria}</div>
              <ImmagineSlotBox tipo={tipo} categoria={r.categoria} sottocategoria="" slot="categoria" urlIniziale={r.immagine_url} activeKey={activeKey} onActivate={onActivate} registraPasteHandler={registraPasteHandler} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function GrigliaSottocategorie({ titolo, tipo, righe, activeKey, onActivate, registraPasteHandler }: {
  titolo: string
  tipo: TipoConSottocategoria
  righe: SottocategoriaImmagine[]
  activeKey: string | null
  onActivate: (key: string) => void
  registraPasteHandler: RegistraPasteHandler
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 className="fs-16" style={{ fontWeight: 700, marginBottom: 8 }}>{titolo}</h3>
      {righe.length === 0 ? (
        <p className="fs-13" style={{ color: '#aaa' }}>Nessuna sottocategoria trovata.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {righe.map(r => (
            <div key={`${r.categoria}|||${r.sottocategoria}`} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: '1px solid #e3e3e3', borderRadius: 8, padding: '10px 14px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div className="fs-14" style={{ fontWeight: 700 }}>{r.sottocategoria || 'Generale'}</div>
                <div className="fs-12" style={{ color: '#888' }}>{r.categoria}</div>
              </div>
              <ImmagineSlotBox tipo={tipo} categoria={r.categoria} sottocategoria={r.sottocategoria} slot="sottocategoria" urlIniziale={r.immagine_url} activeKey={activeKey} onActivate={onActivate} registraPasteHandler={registraPasteHandler} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ImmaginiCategorieClient({ shopCategorie, shopSottocategorie, promoCategorie, promoSottocategorie, catalogiCategorie, catalogiSottocategorie }: {
  shopCategorie: CategoriaImmagine[]
  shopSottocategorie: SottocategoriaImmagine[]
  promoCategorie: CategoriaImmagine[]
  promoSottocategorie: SottocategoriaImmagine[]
  catalogiCategorie: CategoriaImmagine[]
  catalogiSottocategorie: SottocategoriaImmagine[]
}) {
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const handlersRef = useRef<Map<string, (f: File) => void>>(new Map())

  function registraPasteHandler(key: string, handler: ((f: File) => void) | null) {
    if (handler) handlersRef.current.set(key, handler)
    else handlersRef.current.delete(key)
  }

  useEffect(() => {
    function handlePaste(e: ClipboardEvent) {
      if (!activeKey) return
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) handlersRef.current.get(activeKey)?.(file)
          break
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [activeKey])

  const props = { activeKey, onActivate: setActiveKey, registraPasteHandler }

  return (
    <div>
      <h2 className="fs-18" style={{ fontWeight: 700, marginBottom: 8 }}>Shop</h2>
      <GrigliaCategorie titolo="Categorie" tipo="shop" righe={shopCategorie} {...props} />
      <GrigliaSottocategorie titolo="Sottocategorie" tipo="shop" righe={shopSottocategorie} {...props} />

      <h2 className="fs-18" style={{ fontWeight: 700, marginBottom: 8 }}>Promozioni</h2>
      <GrigliaCategorie titolo="Categorie" tipo="promo" righe={promoCategorie} {...props} />
      <GrigliaSottocategorie titolo="Sottocategorie" tipo="promo" righe={promoSottocategorie} {...props} />

      <h2 className="fs-18" style={{ fontWeight: 700, marginBottom: 8 }}>Cataloghi</h2>
      <GrigliaCategorie titolo="Categorie" tipo="cataloghi" righe={catalogiCategorie} {...props} />
      <GrigliaSottocategorie titolo="Sottocategorie" tipo="cataloghi" righe={catalogiSottocategorie} {...props} />
    </div>
  )
}
