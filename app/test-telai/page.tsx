import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// 1 SVG unit = 4 mm  →  80mm profilo = 20 SVG units
const SCALE = 4   // mm per SVG unit
const P = 80 / SCALE  // = 20

const BAR_COLOR = '#b0aca6'   // placeholder — verrà dal colore articolo nel listino
const STROKE    = '#222'
const SW        = 0.7

function Tc({ Wmm, Hmm, label }: { Wmm: number; Hmm: number; label?: string }) {
  const W = Wmm / SCALE
  const H = Hmm / SCALE
  const pad = 16
  const vW = W + pad * 2
  const vH = H + pad * 2 + 22
  const ox = pad, oy = pad
  return (
    <svg viewBox={`0 0 ${vW} ${vH}`} width={vW} height={vH} style={{ display: 'block' }}>
      <text x={vW / 2} y={vH - 5} textAnchor="middle" fontSize={9} fill="#555" fontFamily="monospace">
        Tc()  {Wmm}×{Hmm} mm
      </text>
      {/* Sopra */}
      <polygon
        points={`${ox},${oy} ${ox+W},${oy} ${ox+W-P},${oy+P} ${ox+P},${oy+P}`}
        fill={BAR_COLOR} stroke={STROKE} strokeWidth={SW}/>
      {/* Destra */}
      <polygon
        points={`${ox+W},${oy} ${ox+W},${oy+H} ${ox+W-P},${oy+H-P} ${ox+W-P},${oy+P}`}
        fill={BAR_COLOR} stroke={STROKE} strokeWidth={SW}/>
      {/* Sotto */}
      <polygon
        points={`${ox},${oy+H} ${ox+W},${oy+H} ${ox+W-P},${oy+H-P} ${ox+P},${oy+H-P}`}
        fill={BAR_COLOR} stroke={STROKE} strokeWidth={SW}/>
      {/* Sinistra */}
      <polygon
        points={`${ox},${oy} ${ox+P},${oy+P} ${ox+P},${oy+H-P} ${ox},${oy+H}`}
        fill={BAR_COLOR} stroke={STROKE} strokeWidth={SW}/>
    </svg>
  )
}

function Ta({ Wmm, Hmm, label }: { Wmm: number; Hmm: number; label?: string }) {
  const W = Wmm / SCALE
  const H = Hmm / SCALE
  const pad = 16
  const vW = W + pad * 2
  const vH = H + pad * 2 + 22
  const ox = pad, oy = pad
  return (
    <svg viewBox={`0 0 ${vW} ${vH}`} width={vW} height={vH} style={{ display: 'block' }}>
      <text x={vW / 2} y={vH - 5} textAnchor="middle" fontSize={9} fill="#555" fontFamily="monospace">
        Ta()  {Wmm}×{Hmm} mm
      </text>
      {/* Sopra */}
      <polygon
        points={`${ox},${oy} ${ox+W},${oy} ${ox+W-P},${oy+P} ${ox+P},${oy+P}`}
        fill={BAR_COLOR} stroke={STROKE} strokeWidth={SW}/>
      {/* Destra — taglio retto in basso */}
      <polygon
        points={`${ox+W},${oy} ${ox+W},${oy+H} ${ox+W-P},${oy+H} ${ox+W-P},${oy+P}`}
        fill={BAR_COLOR} stroke={STROKE} strokeWidth={SW}/>
      {/* Sinistra — taglio retto in basso */}
      <polygon
        points={`${ox},${oy} ${ox+P},${oy+P} ${ox+P},${oy+H} ${ox},${oy+H}`}
        fill={BAR_COLOR} stroke={STROKE} strokeWidth={SW}/>
    </svg>
  )
}

export default async function TestTelaiPage() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') redirect('/')

  // Dimensioni reali in mm
  const finestre = [
    { Wmm: 600, Hmm: 900  },
    { Wmm: 900, Hmm: 1200 },
    { Wmm: 1200, Hmm: 1500 },
  ]
  const porte = [
    { Wmm: 800,  Hmm: 2100 },
    { Wmm: 1200, Hmm: 2200 },
    { Wmm: 1500, Hmm: 2400 },
  ]

  return (
    <div style={{ padding: '40px 32px', background: '#f7f6f3', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Test telai — Tc() e Ta()</h1>
      <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
        Scala 1 SVG unit = {SCALE} mm — Profilo P = 80 mm = {P} SVG units — Colore placeholder, verrà da listino
      </p>
      <p style={{ fontSize: 12, color: '#888', marginBottom: 40 }}>
        Interno vuoto. Ta = telaio aperto (no barra in basso, tagli retti ai piedi dei montanti).
      </p>

      <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, color: '#333' }}>Tc — Telaio Chiuso</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-end', marginBottom: 60 }}>
        {finestre.map((c, i) => <Tc key={i} {...c}/>)}
        {porte.map((c, i)    => <Tc key={`p${i}`} {...c}/>)}
      </div>

      <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, color: '#333' }}>Ta — Telaio Aperto</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-end' }}>
        {finestre.map((c, i) => <Ta key={i} {...c}/>)}
        {porte.map((c, i)    => <Ta key={`p${i}`} {...c}/>)}
      </div>
    </div>
  )
}
