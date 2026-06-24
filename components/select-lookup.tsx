'use client'
import { useState, useEffect, useRef } from 'react'

type Option = { value: string; label: string }

type Props = {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  style?: React.CSSProperties
  disabled?: boolean
}

export default function SelectLookup({ value, onChange, options, placeholder = '— Seleziona —', style, disabled }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = options.find(o => o.value === value)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  function handleOpen() {
    if (disabled) return
    setQuery('')
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function handleSelect(opt: Option) {
    onChange(opt.value)
    setOpen(false)
    setQuery('')
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange('')
    setOpen(false)
    setQuery('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); setQuery('') }
  }

  const filtered = query.trim()
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  const base: React.CSSProperties = {
    padding: '5px 28px 5px 8px', border: '1px solid #ccc', borderRadius: 5,
    fontSize: 13, fontFamily: 'inherit', background: '#fff', color: '#333',
    width: '100%', boxSizing: 'border-box', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, outline: 'none', userSelect: 'none',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    ...style,
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block', width: style?.width ?? style?.minWidth ? undefined : '100%', minWidth: style?.minWidth, maxWidth: style?.maxWidth }}>
      {/* campo chiuso */}
      {!open && (
        <div onClick={handleOpen} style={base}>
          <span style={{ color: selected ? '#333' : '#aaa' }}>
            {selected ? selected.label : placeholder}
          </span>
          {value ? (
            <span
              onMouseDown={handleClear}
              style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888', fontSize: 14, lineHeight: 1 }}
            >✕</span>
          ) : (
            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 10, pointerEvents: 'none' }}>▾</span>
          )}
        </div>
      )}

      {/* campo aperto con filtro */}
      {open && (
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cerca..."
          style={{ ...base, cursor: 'text', paddingRight: 8 }}
        />
      )}

      {/* dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999,
          background: '#fff', border: '1px solid #ccc', borderRadius: 5,
          boxShadow: '0 4px 16px rgba(0,0,0,0.14)', maxHeight: 240,
          overflowY: 'auto', marginTop: 2,
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '8px 10px', color: '#aaa', fontSize: 13 }}>Nessun risultato</div>
          ) : filtered.map(opt => (
            <div
              key={opt.value}
              onMouseDown={() => handleSelect(opt)}
              style={{
                padding: '7px 10px', fontSize: 13, cursor: 'pointer', color: '#333',
                background: opt.value === value ? '#e8f0fe' : '#fff',
              }}
              onMouseEnter={e => { if (opt.value !== value) (e.currentTarget as HTMLDivElement).style.background = '#f0f0f0' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = opt.value === value ? '#e8f0fe' : '#fff' }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
