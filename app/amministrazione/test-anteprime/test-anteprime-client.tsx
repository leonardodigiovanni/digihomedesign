'use client'

import { useState, useEffect } from 'react'
import PreviewInfisso from '@/components/preview-infisso'

const ESEMPI_ABBR: { label: string; abbr: string }[] = [
  { label: 'Fisso',                                  abbr: 'Tc(F())' },
  { label: 'Anta cerniera sx + maniglia dx',           abbr: 'Tc(cAm(F()))' },
  { label: 'Anta cerniera dx + maniglia sx',           abbr: 'Tc(mAc(F()))' },
  { label: 'Ribalta con maniglia',                     abbr: 'Tc(mRc(F()))' },
  { label: 'Vasistas',                                abbr: 'Tc(V(F()))' },
  { label: '2 ante affiancate',                        abbr: 'Tc(cA(F())+mAc(F()))' },
  { label: '2 ante + divisorio verticale (P)',          abbr: 'Tc(mAc(F())+P+cAm(F()))' },
  { label: '2 aree + divisorio orizzontale (T)',        abbr: 'Tc(F()+T+F())' },
  { label: '3 aree + 2 divisori orizzontali (T)',       abbr: 'Tc(F()+T+F()+T+F())' },
  { label: 'Area fissa 80cm + anta variabile',          abbr: 'Tc(X(F())+P+80(mAc(F())))' },
  { label: 'Anta + divisorio P + vasistas',             abbr: 'Tc(mAc(F())+P+V(F()))' },
  { label: 'Anta, T, vasistas, T, anta',                abbr: 'Tc(cA(F())+T+V(F())+T+mAc(F()))' },
  { label: 'Fisso 100cm + T + anta variabile',          abbr: 'Tc(100(F())+T+mAc(F()))' },
  { label: 'Anta (telaio Ta) con maniglia',             abbr: 'Ta(mAc(F()))' },
  { label: 'Gruppo 2 ante variabili + area fissa 55cm', abbr: 'Tc(X(cA(F())+mAc(F()))+P+55())' },
  { label: 'Gruppo ante + gruppo con proprio divisorio', abbr: 'Tc(X(cA(F())+mAc(F()))+P+X(F()+P+40()))' },
  { label: 'Parentesi miste (), [], {} — stesso disegno',abbr: 'Tc[X(cA{F()}+mAc[F{}])+P+X{F[]+P+40{}}]' },
  { label: 'Area 33% + anta variabile + anta variabile', abbr: 'Tc(33%(F())+P+cA(F())+P+mAc(F()))' },
  { label: 'Aree 15% + 20% fisse, resto ad anta variabile', abbr: 'Tc(15%(F())+P+mAc(F())+P+20%(F()))' },
  { label: 'Percentuale verticale dentro un\'anta (T interno)', abbr: 'Tc(cA(F())+mAc(X()+T+33%(F()))+P+33%(F()))' },
  { label: 'Divisorio P con spessore custom 40mm (indipendente dal profilo)', abbr: 'Tc(cA(F())+P40+mAc(F()))' },
  { label: 'Divisorio T con spessore custom 60mm + divisorio P normale', abbr: 'Tc(cA(F())+T60+mAc(F())+P+V(F()))' },
  { label: '2 ante con zoccolo (Z), spessore default = profilo', abbr: 'Tc(CZ(F())+MZC(F()))' },
  { label: 'Anta con zoccolo custom 120mm', abbr: 'Tc(cZ120m(F()))' },
]

const lbl: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: '#555',
  textTransform: 'uppercase', letterSpacing: '0.05em',
  display: 'block', marginBottom: 4,
}
const inputS: React.CSSProperties = {
  width: '100%', padding: '8px 10px', fontSize: 13,
  border: '1px solid #ccc', borderRadius: 6, boxSizing: 'border-box',
}
const fieldS: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 0 }

export default function TestAnteprimeClient() {
  const [abbr, setAbbr] = useState('Tc(mAc(F()))')
  const [tipoInfisso, setTipoInfisso] = useState<'finestra' | 'porta'>('finestra')
  const [larghezza, setLarghezza] = useState(120)
  const [altezza, setAltezza] = useState(150)
  const [profiloMm, setProfiloMm] = useState(80)
  const [barColor, setBarColor] = useState('#d8d4cc')
  const [barColorAcc, setBarColorAcc] = useState('#d8d4cc')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const copia = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(i => (i === idx ? null : i)), 1200)
    })
  }

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 320, flexShrink: 0 }}>
        <div style={fieldS}>
          <label style={lbl}>Abbr</label>
          <input style={inputS} value={abbr} onChange={e => setAbbr(e.target.value)} placeholder="es. Tc(mAc(F()))" />
        </div>

        <div style={fieldS}>
          <label style={lbl}>Tipo</label>
          <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: 6, overflow: 'hidden' }}>
            {(['finestra', 'porta'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTipoInfisso(t)}
                style={{
                  flex: 1, padding: '8px 10px', fontSize: 13, border: 'none', cursor: 'pointer',
                  background: tipoInfisso === t ? '#333' : '#fff',
                  color: tipoInfisso === t ? '#fff' : '#333',
                }}
              >
                {t === 'finestra' ? 'Finestra' : 'Porta'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ ...fieldS, flex: 1 }}>
            <label style={lbl}>Larghezza (cm)</label>
            <input style={inputS} type="number" value={larghezza} onChange={e => setLarghezza(Number(e.target.value) || 0)} />
          </div>
          <div style={{ ...fieldS, flex: 1 }}>
            <label style={lbl}>Altezza (cm)</label>
            <input style={inputS} type="number" value={altezza} onChange={e => setAltezza(Number(e.target.value) || 0)} />
          </div>
        </div>

        <div style={fieldS}>
          <label style={lbl}>Profilo (mm)</label>
          <input style={inputS} type="number" value={profiloMm} onChange={e => setProfiloMm(Number(e.target.value) || 0)} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ ...fieldS, flex: 1 }}>
            <label style={lbl}>Colore barra</label>
            <input style={{ ...inputS, padding: 4, height: 34 }} type="color" value={barColor} onChange={e => setBarColor(e.target.value)} />
          </div>
          <div style={{ ...fieldS, flex: 1 }}>
            <label style={lbl}>Colore accessori</label>
            <input style={{ ...inputS, padding: 4, height: 34 }} type="color" value={barColorAcc} onChange={e => setBarColorAcc(e.target.value)} />
          </div>
        </div>

        <div style={fieldS}>
          <label style={lbl}>Esempi Abbr</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ESEMPI_ABBR.map((ex, idx) => (
              <div
                key={ex.abbr}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  border: '1px solid #e0e0e0', borderRadius: 6, padding: '4px 6px',
                  background: abbr === ex.abbr ? '#f3f3f3' : '#fff',
                }}
              >
                <button
                  type="button"
                  onClick={() => setAbbr(ex.abbr)}
                  title={ex.label}
                  style={{
                    flex: 1, minWidth: 0, textAlign: 'left', background: 'none', border: 'none',
                    cursor: 'pointer', padding: 0,
                  }}
                >
                  <div style={{ fontSize: 10, color: '#888' }}>{ex.label}</div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.abbr}</div>
                </button>
                <button
                  type="button"
                  onClick={() => copia(ex.abbr, idx)}
                  style={{
                    fontSize: 11, padding: '4px 8px', borderRadius: 4, flexShrink: 0,
                    border: '1px solid #ccc', background: copiedIdx === idx ? '#dff0d8' : '#fafafa',
                    cursor: 'pointer',
                  }}
                >
                  {copiedIdx === idx ? 'Copiato' : 'Copia'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        flex: 1, minWidth: 320, background: '#fff', border: '1px solid #ddd',
        borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: 700 }}>
          {mounted ? (
            <PreviewInfisso
              larghezza_cm={larghezza}
              altezza_cm={altezza}
              colore=""
              descrizione=""
              tipo_prodotto={tipoInfisso === 'porta' ? 'Porta' : 'Finestra'}
              n_ante={1}
              abbr={abbr}
              profilo_mm={profiloMm}
              bar_color={barColor}
              bar_color_acc={barColorAcc}
              maxHeight={600}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#888', fontSize: 13 }}>Caricamento anteprima…</div>
          )}
        </div>
      </div>
    </div>
  )
}
