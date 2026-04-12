'use client'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveSettings, saveHeaderBg, saveFooterBg, savePageBg, saveDisabledPages, saveAccessControls, saveRolePermissions, type SaveResult, type SaveBgResult, type SaveAccessResult } from './actions'
import { clientPages, internalPages } from '@/lib/nav-config'
import FlashSuccess from '@/components/flash-success'
import type { Rgba, BgMode } from '@/lib/settings'
import { rgbGradient, rgbGradientInv, rgbBrushedBackground, rgbBrushedBackgroundInv, rgbLuminance } from '@/lib/bg-utils'

const ALL_ROLES = [
  'cliente',
  'dipendente',
  'ragioniere',
  'commercialista',
  'venditore',
  'operaio',
  'magazzino',
  'direttore',
  'marketing',
  'email',
] as const

interface Props {
  inactivityMinutes: number
  countdownSeconds: number
  headerBg: Rgba
  headerBgMode: BgMode
  footerBg: Rgba
  footerBgMode: BgMode
  pageBg: Rgba
  pageBgMode: BgMode
  disabledPages: number[]
  registrazioniDisabilitate: boolean
  loginClientiDisabilitato: boolean
  loginDipendentiDisabilitato: boolean
  rolePermissions: Record<string, number[]>
}

const MODE_OPTIONS: { value: BgMode; label: string; cls?: string }[] = [
  { value: 'rgb',          label: 'RGB' },
  { value: 'gold_a',       label: 'Oro A',      cls: 'class_gold_A'       },
  { value: 'gold_b',       label: 'Oro B',      cls: 'class_gold_B'       },
  { value: 'gold_c',         label: 'Oro C',          cls: 'class_gold_C'         },
  { value: 'gold_d',         label: 'Oro D',          cls: 'class_gold_D'         },
  { value: 'gold_a_inv',     label: 'Oro A inv',      cls: 'class_gold_A_inv'     },
  { value: 'gold_b_inv',     label: 'Oro B inv',      cls: 'class_gold_B_inv'     },
  { value: 'gold_c_inv',     label: 'Oro C inv',      cls: 'class_gold_C_inv'     },
  { value: 'gold_d_inv',     label: 'Oro D inv',      cls: 'class_gold_D_inv'     },
  { value: 'silver_a',       label: 'Arg. A',         cls: 'class_silver_A'       },
  { value: 'silver_b',       label: 'Arg. B',         cls: 'class_silver_B'       },
  { value: 'silver_c',       label: 'Arg. C',         cls: 'class_silver_C'       },
  { value: 'silver_d',       label: 'Arg. D',         cls: 'class_silver_D'       },
  { value: 'silver_a_inv',   label: 'Arg. A inv',     cls: 'class_silver_A_inv'   },
  { value: 'silver_b_inv',   label: 'Arg. B inv',     cls: 'class_silver_B_inv'   },
  { value: 'silver_c_inv',   label: 'Arg. C inv',     cls: 'class_silver_C_inv'   },
  { value: 'silver_d_inv',   label: 'Arg. D inv',     cls: 'class_silver_D_inv'   },
]

function RgbaChannel({
  label, name, value, max, onChange,
}: {
  label: string; name: string; value: number; max: number; onChange: (v: number) => void
}) {
  const clamp = (v: number) => Math.min(max, Math.max(0, v))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#555', textAlign: 'center' }}>{label}</span>
      <input
        name={name}
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={e => onChange(clamp(Number(e.target.value)))}
        required
        style={{ padding: '6px 8px', fontSize: 14, border: '1px solid #ccc', borderRadius: 5, width: '100%', textAlign: 'center', fontFamily: 'inherit', boxSizing: 'border-box' }}
      />
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  )
}

const btnBase: React.CSSProperties = {
  padding: '9px 20px', fontSize: 14, borderRadius: 6,
  fontFamily: 'inherit',
}

function BgColorPanel({
  title,
  initial,
  initialMode,
  action,
}: {
  title: string
  initial: Rgba
  initialMode: BgMode
  action: (prev: SaveBgResult | null, formData: FormData) => Promise<SaveBgResult>
}) {
  const router = useRouter()
  const [saved, setSaved]         = useState<Rgba>(initial)
  const [savedMode, setSavedMode] = useState<BgMode>(initialMode)
  const [color, setColor]         = useState<Rgba>(initial)
  const [mode, setMode]           = useState<BgMode>(initialMode)

  const dirty =
    mode !== savedMode ||
    (mode === 'rgb' && (color.r !== saved.r || color.g !== saved.g || color.b !== saved.b || color.a !== saved.a))

  const [result, formAction, pending] = useActionState<SaveBgResult | null, FormData>(action, null)

  useEffect(() => {
    if (result?.ok) {
      setSaved(result.color)
      setSavedMode(result.mode)
      setColor(result.color)
      setMode(result.mode)
      router.refresh()
    }
  }, [result])

  const previewBg = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 100})`
  const hex = '#' + [color.r, color.g, color.b].map(v => v.toString(16).padStart(2, '0')).join('')

  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '28px 32px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>{title}</h3>

      {/* Selettore mode — ordine: RGB statico | RGB A/B/C | Oro A/B/C | Arg A/B/C */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 16 }}>

        {/* 1. RGB statico — colore piatto, nessun effetto */}
        {(() => {
          const lum = rgbLuminance(color.r, color.g, color.b)
          return (
            <button
              type="button"
              onClick={() => setMode('rgb')}
              style={{ width: 62, padding: '5px 0', fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', background: `rgb(${color.r},${color.g},${color.b})`, color: lum > 0.55 ? '#111' : '#fff', border: mode === 'rgb' ? '2.5px solid #1a1a1a' : '2.5px solid transparent', outline: 'none' }}
            >RGB</button>
          )
        })()}

        {/* 2. RGB A / B / C / D */}
        {(['rgb_a', 'rgb_b', 'rgb_c', 'rgb_d'] as BgMode[]).map(v => {
          const lum = rgbLuminance(color.r, color.g, color.b)
          const bg = (v === 'rgb_c' || v === 'rgb_d') ? rgbBrushedBackground(color.r, color.g, color.b) : rgbGradient(color.r, color.g, color.b)
          return (
            <button key={v} type="button" onClick={() => setMode(v)}
              style={{ width: 62, padding: '5px 0', fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', background: bg, color: lum > 0.55 ? '#111' : '#fff', border: mode === v ? '2.5px solid #1a1a1a' : '2.5px solid transparent', outline: 'none' }}
            >{v === 'rgb_a' ? 'RGB A' : v === 'rgb_b' ? 'RGB B' : v === 'rgb_c' ? 'RGB C' : 'RGB D'}</button>
          )
        })}

        {/* 2b. RGB A / B / C / D inv */}
        {(['rgb_a_inv', 'rgb_b_inv', 'rgb_c_inv', 'rgb_d_inv'] as BgMode[]).map(v => {
          const lum = rgbLuminance(color.r, color.g, color.b)
          const bg = (v === 'rgb_c_inv' || v === 'rgb_d_inv') ? rgbBrushedBackgroundInv(color.r, color.g, color.b) : rgbGradientInv(color.r, color.g, color.b)
          return (
            <button key={v} type="button" onClick={() => setMode(v)}
              style={{ width: 62, padding: '5px 0', fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', background: bg, color: lum > 0.55 ? '#111' : '#fff', border: mode === v ? '2.5px solid #1a1a1a' : '2.5px solid transparent', outline: 'none' }}
            >{v === 'rgb_a_inv' ? 'RGB A inv' : v === 'rgb_b_inv' ? 'RGB B inv' : v === 'rgb_c_inv' ? 'RGB C inv' : 'RGB D inv'}</button>
          )
        })}

        {/* 3. Oro A / B / C + inv */}
        {MODE_OPTIONS.filter(o => o.value.startsWith('gold')).map(opt => (
          <button key={opt.value} type="button" onClick={() => setMode(opt.value)} className={opt.cls ?? ''}
            style={{ width: 62, padding: '5px 0', fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', color: '#4a2800', border: mode === opt.value ? '2.5px solid #1a1a1a' : '2.5px solid transparent', outline: 'none' }}
          >{opt.label}</button>
        ))}

        {/* 4. Argento A / B / C + inv */}
        {MODE_OPTIONS.filter(o => o.value.startsWith('silver')).map(opt => (
          <button key={opt.value} type="button" onClick={() => setMode(opt.value)} className={opt.cls ?? ''}
            style={{ width: 62, padding: '5px 0', fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', color: '#222', border: mode === opt.value ? '2.5px solid #1a1a1a' : '2.5px solid transparent', outline: 'none' }}
          >{opt.label}</button>
        ))}

      </div>

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
        <input type="hidden" name="mode" value={mode} />
        <input type="hidden" name="r" value={color.r} />
        <input type="hidden" name="g" value={color.g} />
        <input type="hidden" name="b" value={color.b} />
        <input type="hidden" name="a" value={color.a} />

        {mode === 'rgb' ? (
          <>
            <div style={{ display: 'flex', gap: 12 }}>
              <RgbaChannel label="R" name="r_vis" max={255} value={color.r} onChange={v => setColor(p => ({ ...p, r: v }))} />
              <RgbaChannel label="G" name="g_vis" max={255} value={color.g} onChange={v => setColor(p => ({ ...p, g: v }))} />
              <RgbaChannel label="B" name="b_vis" max={255} value={color.b} onChange={v => setColor(p => ({ ...p, b: v }))} />
              <RgbaChannel label="A %" name="a_vis" max={100} value={color.a} onChange={v => setColor(p => ({ ...p, a: v }))} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 64, height: 40, borderRadius: 6, border: '1px solid #e0e0e0', flexShrink: 0,
                background: `repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 10px 10px`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: previewBg }} />
              </div>
              <span style={{ fontSize: 12, color: '#888', fontFamily: 'monospace' }}>
                rgba({color.r}, {color.g}, {color.b}, {(color.a / 100).toFixed(2)})<br />{hex} / {color.a}%
              </span>
            </div>
          </>
        ) : (
          <div style={{ flex: 1 }}>
            {mode.startsWith('rgb_') ? (
              <div style={{ height: 64, borderRadius: 8, overflow: 'hidden', position: 'relative',
                background: (mode === 'rgb_c' || mode === 'rgb_d') ? rgbBrushedBackground(color.r, color.g, color.b)
                  : (mode === 'rgb_c_inv' || mode === 'rgb_d_inv') ? rgbBrushedBackgroundInv(color.r, color.g, color.b)
                  : mode.endsWith('_inv') ? rgbGradientInv(color.r, color.g, color.b)
                  : rgbGradient(color.r, color.g, color.b),
              }}>
                {(mode === 'rgb_c' || mode === 'rgb_c_inv' || mode === 'rgb_d' || mode === 'rgb_d_inv') && (
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,255,255,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />
                )}
                {(mode === 'rgb_b' || mode === 'rgb_b_inv' || mode === 'rgb_c' || mode === 'rgb_c_inv') && (
                  <div className="gold-shimmer-wrap" />
                )}
              </div>
            ) : (
              <div
                className={MODE_OPTIONS.find(o => o.value === mode)?.cls ?? ''}
                style={{ height: 64, borderRadius: 8, overflow: 'hidden' }}
              />
            )}
            <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
              Effetto attivo: <strong>
                {MODE_OPTIONS.find(o => o.value === mode)?.label
                  ?? (mode === 'rgb_a' ? 'RGB A' : mode === 'rgb_b' ? 'RGB B' : mode === 'rgb_c' ? 'RGB C' : mode === 'rgb_d' ? 'RGB D'
                  : mode === 'rgb_a_inv' ? 'RGB A inv' : mode === 'rgb_b_inv' ? 'RGB B inv' : mode === 'rgb_c_inv' ? 'RGB C inv' : mode === 'rgb_d_inv' ? 'RGB D inv'
                  : mode)}
              </strong>
            </p>
          </div>
        )}

        {result && !result.ok && (
          <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>
            {result.error}
          </div>
        )}
        <FlashSuccess result={result} message="Salvato." />

        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <button
            type="submit"
            disabled={!dirty || pending}
            className={!dirty || pending ? 'btn-gray' : 'btn-green'}
            style={btnBase}
          >
            {pending ? 'Salvataggio...' : 'Salva'}
          </button>
          <button
            type="button"
            disabled={!dirty}
            onClick={() => { setColor(saved); setMode(savedMode) }}
            className={!dirty ? 'btn-gray' : 'btn-red'}
            style={btnBase}
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  )
}

export default function SettingsForm({ inactivityMinutes, countdownSeconds, headerBg, headerBgMode, footerBg, footerBgMode, pageBg, pageBgMode, disabledPages, registrazioniDisabilitate, loginClientiDisabilitato, loginDipendentiDisabilitato, rolePermissions }: Props) {
  const [savedMinutes, setSavedMinutes] = useState(inactivityMinutes)
  const [savedSeconds, setSavedSeconds] = useState(countdownSeconds)
  const [minutes, setMinutes] = useState(inactivityMinutes)
  const [seconds, setSeconds] = useState(countdownSeconds)
  const sessionDirty = minutes !== savedMinutes || seconds !== savedSeconds

  const [sessionResult, sessionAction, sessionPending] = useActionState<SaveResult | null, FormData>(saveSettings, null)

  useEffect(() => {
    if (sessionResult?.ok) {
      setSavedMinutes(sessionResult.inactivityMinutes)
      setSavedSeconds(sessionResult.countdownSeconds)
      setMinutes(sessionResult.inactivityMinutes)
      setSeconds(sessionResult.countdownSeconds)
    }
  }, [sessionResult])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <style>{`
        .settings-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          align-items: stretch;
        }
        .settings-grid-3 > * {
          height: 100%;
          box-sizing: border-box;
        }
        @media (max-width: 900px) {
          .settings-grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Riga 1: sfondi */}
      <div className="settings-grid-3">
        <BgColorPanel title="Sfondo header" initial={headerBg} initialMode={headerBgMode} action={saveHeaderBg} />
        <BgColorPanel title="Sfondo pagina" initial={pageBg}   initialMode={pageBgMode}   action={savePageBg}   />
        <BgColorPanel title="Sfondo footer" initial={footerBg} initialMode={footerBgMode} action={saveFooterBg} />
      </div>

      {/* Riga 2: inattività + registrazioni/accessi + pagine visibili */}
      <div className="settings-grid-3">

        {/* Pannello sessione */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '28px 32px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Sessione utente</h3>
          <form action={sessionAction} style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 500, color: '#444' }}>
            Minuti di inattività prima dell&apos;avviso
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                name="inactivityMinutes"
                type="number"
                min={1}
                max={480}
                value={minutes}
                onChange={e => setMinutes(Number(e.target.value))}
                required
                style={{ padding: '7px 10px', fontSize: 15, border: '1px solid #ccc', borderRadius: 5, width: 90, fontFamily: 'inherit' }}
              />
              <span style={{ fontSize: 13, color: '#888' }}>min (1–480)</span>
            </div>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 500, color: '#444' }}>
            Secondi del conto alla rovescia
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                name="countdownSeconds"
                type="number"
                min={5}
                max={300}
                value={seconds}
                onChange={e => setSeconds(Number(e.target.value))}
                required
                style={{ padding: '7px 10px', fontSize: 15, border: '1px solid #ccc', borderRadius: 5, width: 90, fontFamily: 'inherit' }}
              />
              <span style={{ fontSize: 13, color: '#888' }}>sec (5–300)</span>
            </div>
          </label>

          {sessionResult && !sessionResult.ok && (
            <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>
              {sessionResult.error}
            </div>
          )}
          <FlashSuccess result={sessionResult} message="Impostazioni salvate." />

          <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
            <button
              type="submit"
              disabled={!sessionDirty || sessionPending}
              className={!sessionDirty || sessionPending ? 'btn-gray' : 'btn-green'}
              style={btnBase}
            >
              {sessionPending ? 'Salvataggio...' : 'Salva'}
            </button>
            <button
              type="button"
              disabled={!sessionDirty}
              onClick={() => { setMinutes(savedMinutes); setSeconds(savedSeconds) }}
              className={!sessionDirty ? 'btn-gray' : 'btn-red'}
              style={btnBase}
            >
              Annulla
            </button>
          </div>
        </form>
        </div>

        <RegistrazioniLoginPanel
          registrazioniDisabilitate={registrazioniDisabilitate}
          loginClientiDisabilitato={loginClientiDisabilitato}
          loginDipendentiDisabilitato={loginDipendentiDisabilitato}
        />

        <PagesPanel disabledPages={disabledPages} />

      </div>

      {/* Riga 3: matrice permessi a tutta larghezza */}
      <RolePermissionsPanel rolePermissions={rolePermissions} />

    </div>
  )
}

const panelStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: 10,
  padding: '24px 28px 28px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  flex: 1,
  boxSizing: 'border-box',
}

function CheckRow({ label, checked, onChange, name }: { label: string; checked: boolean; onChange: (v: boolean) => void; name: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer', userSelect: 'none' }}>
      <input
        type="checkbox"
        name={name}
        value="1"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#1a1a1a' }}
      />
      {label}
    </label>
  )
}

function initPages(disabledPages: number[]): Record<number, boolean> {
  const init: Record<number, boolean> = {}
  for (const p of clientPages) init[p.id] = !disabledPages.includes(p.id)
  return init
}

function PagesPanel({ disabledPages }: { disabledPages: number[] }) {
  const router = useRouter()
  const [saved, setSaved] = useState(() => initPages(disabledPages))
  const [pages, setPages] = useState(() => initPages(disabledPages))
  const dirty = clientPages.some(p => pages[p.id] !== saved[p.id])
  const [result, formAction, pending] = useActionState<SaveAccessResult | null, FormData>(saveDisabledPages, null)

  useEffect(() => {
    if (result?.ok) { setSaved({ ...pages }); router.refresh() }
  }, [result])

  return (
    <form action={formAction} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={panelStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Pagine visibili (2–15)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 16px' }}>
          {clientPages.map(p => (
            <CheckRow key={p.id} label={p.label} checked={pages[p.id] ?? true} onChange={v => setPages(prev => ({ ...prev, [p.id]: v }))} name={`page_${p.id}`} />
          ))}
        </div>

        {result && !result.ok && (
          <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>{result.error}</div>
        )}
        <FlashSuccess result={result} message="Pagine salvate." />

        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <button
            type="submit"
            disabled={!dirty || pending}
            className={!dirty || pending ? 'btn-gray' : 'btn-green'}
            style={btnBase}
          >
            {pending ? 'Salvataggio...' : 'Salva'}
          </button>
          <button
            type="button"
            disabled={!dirty}
            onClick={() => setPages({ ...saved })}
            className={!dirty ? 'btn-gray' : 'btn-red'}
            style={btnBase}
          >
            Annulla
          </button>
        </div>
      </div>
    </form>
  )
}

function RegistrazioniLoginPanel({
  registrazioniDisabilitate,
  loginClientiDisabilitato,
  loginDipendentiDisabilitato,
}: {
  registrazioniDisabilitate: boolean
  loginClientiDisabilitato: boolean
  loginDipendentiDisabilitato: boolean
}) {
  const router = useRouter()
  const [savedReg, setSavedReg]         = useState(!registrazioniDisabilitate)
  const [savedCli, setSavedCli]         = useState(!loginClientiDisabilitato)
  const [savedDip, setSavedDip]         = useState(!loginDipendentiDisabilitato)
  const [regEnabled, setRegEnabled]     = useState(!registrazioniDisabilitate)
  const [loginClienti, setLoginClienti] = useState(!loginClientiDisabilitato)
  const [loginDip, setLoginDip]         = useState(!loginDipendentiDisabilitato)
  const dirty = regEnabled !== savedReg || loginClienti !== savedCli || loginDip !== savedDip
  const [result, formAction, pending]   = useActionState<SaveAccessResult | null, FormData>(saveAccessControls, null)

  useEffect(() => {
    if (result?.ok) {
      setSavedReg(regEnabled); setSavedCli(loginClienti); setSavedDip(loginDip)
      router.refresh()
    }
  }, [result])

  return (
    <form action={formAction} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={panelStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Registrazioni e accessi</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Registrazioni</span>
          <CheckRow label="Consenti nuove registrazioni" checked={regEnabled} onChange={setRegEnabled} name="registrazioni" />
        </div>

        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Accessi per ruolo</span>
          <CheckRow label="Consenti login clienti" checked={loginClienti} onChange={setLoginClienti} name="loginClienti" />
          <CheckRow label="Consenti login dipendenti" checked={loginDip} onChange={setLoginDip} name="loginDipendenti" />
        </div>

        {result && !result.ok && (
          <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>{result.error}</div>
        )}
        <FlashSuccess result={result} message="Impostazioni salvate." />

        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <button
            type="submit"
            disabled={!dirty || pending}
            className={!dirty || pending ? 'btn-gray' : 'btn-green'}
            style={btnBase}
          >
            {pending ? 'Salvataggio...' : 'Salva'}
          </button>
          <button
            type="button"
            disabled={!dirty}
            onClick={() => { setRegEnabled(savedReg); setLoginClienti(savedCli); setLoginDip(savedDip) }}
            className={!dirty ? 'btn-gray' : 'btn-red'}
            style={btnBase}
          >
            Annulla
          </button>
        </div>
      </div>
    </form>
  )
}

// ─── Matrice permessi ruolo × pagina ─────────────────────────────────────────

type PermMatrix = Record<string, Record<number, boolean>>

function buildMatrix(rolePermissions: Record<string, number[]>): PermMatrix {
  const m: PermMatrix = {}
  for (const role of ALL_ROLES) {
    m[role] = {}
    for (const p of internalPages) {
      m[role][p.id] = (rolePermissions[role] ?? []).includes(p.id)
    }
  }
  return m
}

const ROLE_LABELS: Record<string, string> = {
  admin:          'Admin',
  cliente:        'Cliente',
  dipendente:     'Dipendente',
  ragioniere:     'Ragioniere',
  commercialista: 'Commercialista',
  venditore:      'Venditore',
  operaio:        'Operaio',
  magazzino:      'Magazzino',
  direttore:      'Direttore',
  marketing:      'Marketing',
  email:          'Email',
}

function RolePermissionsPanel({ rolePermissions }: { rolePermissions: Record<string, number[]> }) {
  const router = useRouter()
  const [saved, setSaved]   = useState(() => buildMatrix(rolePermissions))
  const [matrix, setMatrix] = useState(() => buildMatrix(rolePermissions))

  const dirty = ALL_ROLES.some(role =>
    internalPages.some(p => matrix[role][p.id] !== saved[role][p.id])
  )

  const [result, formAction, pending] = useActionState<SaveAccessResult | null, FormData>(saveRolePermissions, null)

  useEffect(() => {
    if (result?.ok) { setSaved(JSON.parse(JSON.stringify(matrix))); router.refresh() }
  }, [result])

  const toggle = (role: string, pageId: number) =>
    setMatrix(prev => ({ ...prev, [role]: { ...prev[role], [pageId]: !prev[role][pageId] } }))

  const thStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: '#666', padding: '6px 8px',
    textAlign: 'center', background: '#fafafa', border: '1px solid #e8e8e8',
  }
  const tdRole: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: '#333', padding: '6px 10px',
    whiteSpace: 'nowrap', background: '#fafafa', border: '1px solid #e8e8e8',
  }
  const tdCell: React.CSSProperties = {
    textAlign: 'center', padding: '4px', border: '1px solid #e8e8e8',
  }

  return (
    <form action={formAction}>
      {/* Hidden inputs per la submission */}
      {ALL_ROLES.map(role =>
        internalPages.map(p => matrix[role][p.id] ? (
          <input key={`${role}_${p.id}`} type="hidden" name={`perm_${role}_${p.id}`} value="1" />
        ) : null)
      )}

      <div style={{ ...panelStyle, maxWidth: '100%' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Matrice permessi ruolo × pagina</h3>
        <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
          Seleziona quali pagine interne sono accessibili per ogni ruolo. La riga Admin è in sola lettura: vede sempre tutto.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 12, width: '100%' }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign: 'left', width: 110 }}>Ruolo</th>
                {internalPages.map(p => (
                  <th key={p.id} style={{ ...thStyle, width: `${(100 / (internalPages.length + 1)).toFixed(1)}%` }}>{p.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Riga Admin: sola lettura, tutte abilitate */}
              <tr style={{ background: '#f5f5f5' }}>
                <td style={{ ...tdRole, color: '#1a1a1a', fontStyle: 'italic' }}>Admin</td>
                {internalPages.map(p => (
                  <td key={p.id} style={tdCell}>
                    <input
                      type="checkbox"
                      checked
                      disabled
                      style={{ width: 14, height: 14, accentColor: '#1a1a1a', opacity: 0.5 }}
                    />
                  </td>
                ))}
              </tr>
              {ALL_ROLES.map(role => (
                <tr key={role}>
                  <td style={tdRole}>{ROLE_LABELS[role] ?? role}</td>
                  {internalPages.map(p => (
                    <td key={p.id} style={tdCell}>
                      <input
                        type="checkbox"
                        checked={matrix[role][p.id] ?? false}
                        onChange={() => toggle(role, p.id)}
                        style={{ width: 14, height: 14, cursor: 'pointer', accentColor: '#1a1a1a' }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result && !result.ok && (
          <div style={{ background: '#fff3f3', border: '1px solid #f5c2c2', borderRadius: 5, padding: '8px 12px', fontSize: 13, color: '#c00' }}>{result.error}</div>
        )}
        <FlashSuccess result={result} message="Permessi salvati." />

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="submit"
            disabled={!dirty || pending}
            className={!dirty || pending ? 'btn-gray' : 'btn-green'}
            style={btnBase}
          >
            {pending ? 'Salvataggio...' : 'Salva'}
          </button>
          <button
            type="button"
            disabled={!dirty}
            onClick={() => setMatrix(JSON.parse(JSON.stringify(saved)))}
            className={!dirty ? 'btn-gray' : 'btn-red'}
            style={btnBase}
          >
            Annulla
          </button>
        </div>
      </div>
    </form>
  )
}
