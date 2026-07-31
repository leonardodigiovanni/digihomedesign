'use client'
import { useState, useRef } from 'react'
import SelectLookup from '@/components/select-lookup'
import ShortcutStar from '@/components/shortcut-star'

// ─── Types ────────────────────────────────────────────────────────────────────

type Zone = { name: string; x: number; y: number; w: number; h: number }

type FrameElem = {
  id: number
  type: 'telaio' | 'laterale_fisso'
  zone: string
  x: number; y: number; w: number; h: number  // coordinate SVG (mm A4)
  spessore: number                              // spessore in mm SVG
  aperto: boolean
  innerZone?: string
}

type DivElem = {
  id: number
  type: 'divisione'
  zone: string
  nAree: number
  orientamento: 'verticale' | 'orizzontale'
  childZones: string[]
}

type AreaElem = {
  id: number
  type: 'area'
  zone: string   // zona contenitore (parent)
  childZone: string
}

type SplitElem = {
  id: number
  type: 'split'
  zone: string
  orientamento: 'verticale' | 'orizzontale'
  distanza: number   // SVG mm dal bordo sinistro/superiore della zona
  childZones: [string, string]
}

type PilastrinoElem = {
  id: number
  type: 'pilastrino'
  zone: string
  lato: 'sinistra' | 'destra'
  spessore: number   // SVG mm
  childZone: string  // zona rimanente
}

type TraversaElem = {
  id: number
  type: 'traversa'
  zone: string
  lato: 'alto' | 'basso'
  spessore: number   // SVG mm
  childZone: string
}

type VetroElem = {
  id: number
  type: 'vetro'
  zone: string
}

type PannelloElem = {
  id: number
  type: 'pannello'
  zone: string
}

type AntaElem = {
  id: number
  type: 'anta'
  zone: string
  lato: 'sinistra' | 'destra'
  nCerniere: number
  spessore: number     // SVG mm
  hingeH: number       // SVG mm — altezza di ogni foglia
  hingeW: number       // SVG mm — larghezza totale (attraversa il bordo zona)
  hingeGap: number     // SVG mm — sovrapposizione tra le due foglie al centro
  hingeOffset: number  // SVG mm — distanza dal bordo sup/inf della zona alla prima/ultima cerniera
  maniglia: boolean
}

type VasistasElem = {
  id: number
  type: 'vasistas'
  zone: string
  nCerniere: number
  spessore: number
  hingeDepth: number   // SVG mm — profondità di ogni foglia (direzione Y, perp. al bordo inf.)
  hingeLen: number     // SVG mm — lunghezza della cerniera lungo il bordo inferiore (X)
  hingeGap: number     // SVG mm — sovrapposizione al perno
  hingeOffset: number  // SVG mm — distanza dal bordo sin/dx della zona alla prima/ultima cerniera
  mw: number           // SVG mm — larghezza maniglia (3cm)
  mh: number           // SVG mm — altezza maniglia (8cm)
}

type OrtogonaleElem = {
  id: number
  type: 'ortogonale'
  zone: string
  lato: 'sinistra' | 'destra' | 'alto' | 'basso'
  larghezza: number   // SVG mm già scalato
  spessore: number    // SVG mm già scalato
  innerZone: string   // nome zona logica (O1, O2, ...)
}

type DrawElem = FrameElem | DivElem | AreaElem | SplitElem | PilastrinoElem | TraversaElem | VetroElem | PannelloElem | AntaElem | VasistasElem | OrtogonaleElem
type ModalType = 'none' | 'telaio' | 'divisione' | 'laterale_fisso' | 'area' | 'split' | 'pilastrino' | 'traversa' | 'vetro' | 'pannello' | 'anta' | 'vasistas' | 'ortogonale' | 'rimuovi_area' | 'unisci_aree'

// A4 in mm (coordinate space SVG)
const A4 = { portrait: { w: 210, h: 297 }, landscape: { w: 297, h: 210 } }
const MARGIN = 10  // mm di margine attorno al telaio nel foglio
const CANVAS_MAX_W = 900
const CANVAS_MAX_H = 1100

// ─── Ortogonale helpers ───────────────────────────────────────────────────────

function ortMatrix(lato: string, az: Zone): string {
  const f = (n: number) => parseFloat(n.toFixed(4))
  switch (lato) {
    case 'destra':   { const ox = az.x + az.w; return `matrix(${f(-0.7)},${f(0.7)},0,1,${f(1.7*ox)},${f(-0.7*ox)})` }
    case 'sinistra': { const ox = az.x;         return `matrix(${f(0.7)},${f(-0.7)},0,1,${f(0.3*ox)},${f(0.7*ox)})` }
    case 'alto':     { const oy = az.y;         return `matrix(1,0,${f(0.7)},${f(-0.7)},${f(-0.7*oy)},${f(1.7*oy)})` }
    case 'basso':    { const oy = az.y + az.h;  return `matrix(1,0,${f(-0.7)},${f(0.7)},${f(0.7*oy)},${f(0.3*oy)})` }
    default: return ''
  }
}

function nextOName(currentZones: Zone[]): string {
  return `O${currentZones.filter(z => z.name.startsWith('O')).length + 1}`
}

function elemZone(e: DrawElem): string | null {
  if (e.type === 'telaio' || e.type === 'laterale_fisso') return (e as FrameElem).zone
  if (e.type === 'divisione')  return (e as DivElem).zone
  if (e.type === 'split')      return (e as SplitElem).zone
  if (e.type === 'pilastrino') return (e as PilastrinoElem).zone
  if (e.type === 'traversa')   return (e as TraversaElem).zone
  if (e.type === 'vetro')      return (e as VetroElem).zone
  if (e.type === 'pannello')   return (e as PannelloElem).zone
  if (e.type === 'anta')       return (e as AntaElem).zone
  if (e.type === 'vasistas')   return (e as VasistasElem).zone
  return null
}

// ─── SVG sub-components ───────────────────────────────────────────────────────

function FrameShape({ elem, sw }: { elem: FrameElem; sw: number }) {
  const { x: ex, y: ey, w: ew, h: eh, spessore: sp } = elem
  const ix = ex + sp, iy = ey + sp
  const iw = Math.max(0, ew - sp * 2)
  const ih = Math.max(0, eh - sp * 2)

  if (elem.aperto) {
    // 3 lati: sopra, sinistra, destra — angoli a 45° solo in alto, basso retto
    return (
      <g>
        {/* Riempimento crema: barra superiore + barra sinistra + barra destra */}
        <rect x={ex} y={ey} width={ew} height={sp} fill="#f5f2ee" />
        <rect x={ex} y={ey} width={sp} height={eh} fill="#f5f2ee" />
        <rect x={ex + ew - sp} y={ey} width={sp} height={eh} fill="#f5f2ee" />
        {/* Perimetro esterno ⊓ */}
        <path d={`M ${ex},${ey + eh} V ${ey} H ${ex + ew} V ${ey + eh}`}
          fill="none" stroke="#111" strokeWidth={sw} />
        {/* Terminazioni rette in basso */}
        <line x1={ex} y1={ey + eh} x2={ix} y2={ey + eh} stroke="#111" strokeWidth={sw} />
        <line x1={ix + iw} y1={ey + eh} x2={ex + ew} y2={ey + eh} stroke="#111" strokeWidth={sw} />
        {/* Perimetro interno ⊓ */}
        <path d={`M ${ix},${ey + eh} V ${iy} H ${ix + iw} V ${ey + eh}`}
          fill="none" stroke="#111" strokeWidth={sw} />
        {/* Tagli a 45° — solo angoli superiori */}
        <line x1={ix} y1={iy} x2={ex} y2={ey} stroke="#111" strokeWidth={sw} />
        <line x1={ix + iw} y1={iy} x2={ex + ew} y2={ey} stroke="#111" strokeWidth={sw} />
      </g>
    )
  }

  // Telaio chiuso — 4 lati, 4 angoli a 45°
  return (
    <g>
      {/* Riempimento crema solo nelle barre (area tra perimetro esterno e interno) */}
      <path
        d={`M ${ex},${ey} h ${ew} v ${eh} h ${-ew} Z M ${ix},${iy} h ${iw} v ${ih} h ${-iw} Z`}
        fill="#f5f2ee" fillRule="evenodd"
      />
      {/* Perimetro esterno */}
      <rect x={ex} y={ey} width={ew} height={eh} fill="none" stroke="#111" strokeWidth={sw} />
      {/* Perimetro interno */}
      <rect x={ix} y={iy} width={iw} height={ih} fill="none" stroke="#111" strokeWidth={sw} />
      {/* Tagli a 45° — tutti e 4 gli angoli */}
      <line x1={ix}      y1={iy}      x2={ex}      y2={ey}      stroke="#111" strokeWidth={sw} />
      <line x1={ix + iw} y1={iy}      x2={ex + ew} y2={ey}      stroke="#111" strokeWidth={sw} />
      <line x1={ix}      y1={iy + ih} x2={ex}      y2={ey + eh} stroke="#111" strokeWidth={sw} />
      <line x1={ix + iw} y1={iy + ih} x2={ex + ew} y2={ey + eh} stroke="#111" strokeWidth={sw} />
      {/* Vetro per laterale fisso */}
      {elem.type === 'laterale_fisso' && iw > 0 && ih > 0 && (
        <rect x={ix} y={iy} width={iw} height={ih} fill="#cfeeff" stroke="#111" strokeWidth={sw * 0.7} />
      )}
    </g>
  )
}

function DivShape({ elem: _elem, zones: _zones, sw: _sw }: { elem: DivElem; zones: Zone[]; sw: number }) {
  return null
}

function SplitShape({ elem: _elem, zones: _zones, sw: _sw }: { elem: SplitElem; zones: Zone[]; sw: number }) {
  return null
}

function PilastrinoShape({ elem, zones, sw }: { elem: PilastrinoElem; zones: Zone[]; sw: number }) {
  const zone = zones.find(z => z.name === elem.zone)
  if (!zone) return null
  const x = elem.lato === 'destra' ? zone.x + zone.w - elem.spessore : zone.x
  return (
    <rect x={x} y={zone.y} width={elem.spessore} height={zone.h}
      fill="#f5f2ee" stroke="#111" strokeWidth={sw} />
  )
}

function TraversaShape({ elem, zones, sw }: { elem: TraversaElem; zones: Zone[]; sw: number }) {
  const zone = zones.find(z => z.name === elem.zone)
  if (!zone) return null
  const y = elem.lato === 'basso' ? zone.y + zone.h - elem.spessore : zone.y
  return (
    <rect x={zone.x} y={y} width={zone.w} height={elem.spessore}
      fill="#f5f2ee" stroke="#111" strokeWidth={sw} />
  )
}

function VetroShape({ elem, zones, sw }: { elem: VetroElem; zones: Zone[]; sw: number }) {
  const zone = zones.find(z => z.name === elem.zone)
  if (!zone) return null
  return (
    <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h}
      fill="#cfeeff" stroke="#111" strokeWidth={sw * 0.7} />
  )
}

function PannelloShape({ elem, zones, sw }: { elem: PannelloElem; zones: Zone[]; sw: number }) {
  const zone = zones.find(z => z.name === elem.zone)
  if (!zone) return null
  return (
    <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h}
      fill="#f0ece3" stroke="#111" strokeWidth={sw * 0.7} />
  )
}

function AntaShape({ elem, zones, sw }: { elem: AntaElem; zones: Zone[]; sw: number }) {
  const zone = zones.find(z => z.name === elem.zone)
  if (!zone) return null

  const sp = elem.spessore
  const ix = zone.x + sp, iy = zone.y + sp
  const iw = Math.max(0, zone.w - sp * 2)
  const ih = Math.max(0, zone.h - sp * 2)

  const { hingeH, hingeW, hingeGap, hingeOffset, nCerniere, lato, maniglia } = elem

  // Centro orizzontale della cerniera: sul bordo della zona
  const c  = lato === 'sinistra' ? zone.x : zone.x + zone.w
  const hx = c - hingeW / 2   // rect centrato sul bordo

  // Posizioni Y delle cerniere:
  // top hinge: hingeOffset dal BORDO SUPERIORE della zona → centro a zone.y + hingeOffset
  // bottom hinge: hingeOffset dal BORDO INFERIORE → centro a zone.y + zone.h - hingeOffset
  // le due foglie si estendono VERSO L'INTERNO della zona a partire dal centro
  const topY    = zone.y + hingeOffset
  const bottomY = zone.y + zone.h - hingeOffset
  const hingeYs = nCerniere === 1
    ? [(topY + bottomY) / 2]
    : Array.from({ length: nCerniere }, (_, i) => topY + (bottomY - topY) * i / (nCerniere - 1))

  return (
    <g>
      {/* Barre anta — evenodd come telaio chiuso */}
      <path
        d={`M ${zone.x},${zone.y} h ${zone.w} v ${zone.h} h ${-zone.w} Z M ${ix},${iy} h ${iw} v ${ih} h ${-iw} Z`}
        fill="#f5f2ee" fillRule="evenodd"
      />
      <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} fill="none" stroke="#111" strokeWidth={sw} />
      <rect x={ix} y={iy} width={iw} height={ih} fill="none" stroke="#111" strokeWidth={sw} />
      {/* Tagli a 45° */}
      <line x1={ix}      y1={iy}      x2={zone.x}          y2={zone.y}          stroke="#111" strokeWidth={sw} />
      <line x1={ix + iw} y1={iy}      x2={zone.x + zone.w} y2={zone.y}          stroke="#111" strokeWidth={sw} />
      <line x1={ix}      y1={iy + ih} x2={zone.x}          y2={zone.y + zone.h} stroke="#111" strokeWidth={sw} />
      <line x1={ix + iw} y1={iy + ih} x2={zone.x + zone.w} y2={zone.y + zone.h} stroke="#111" strokeWidth={sw} />
      {/* Vetro */}
      {iw > 0 && ih > 0 && (
        <rect x={ix} y={iy} width={iw} height={ih} fill="#cfeeff" stroke="#111" strokeWidth={sw * 0.7} />
      )}
      {/* Maniglia: lato opposto alle cerniere, centrata sull'altezza dell'anta, sul centro della barra */}
      {maniglia && (() => {
        const mh = 160 * (hingeW / 30)   // 16cm reali, in scala (hingeW/30 = drawScale)
        const mw = 30  * (hingeW / 30)   // 3cm reali
        const barCx = lato === 'sinistra'
          ? zone.x + zone.w - sp / 2     // barra destra
          : zone.x + sp / 2              // barra sinistra
        const my = zone.y + zone.h / 2 - mh / 2
        return (
          <rect x={barCx - mw / 2} y={my} width={mw} height={mh}
            fill="#888" stroke="#333" strokeWidth={sw * 0.8} rx={mw * 0.15} />
        )
      })()}
      {/* Cerniere: foglia superiore va verso l'alto dal centro, foglia inferiore verso il basso */}
      {hingeYs.map((hy, i) => (
        <g key={i}>
          {/* Foglia superiore: da hy verso l'alto (zone.y) */}
          <rect x={hx} y={hy - hingeH} width={hingeW} height={hingeH + hingeGap}
            fill="#ccc8be" stroke="#444" strokeWidth={sw} />
          {/* Foglia inferiore: da hy verso il basso (zone.y+zone.h) */}
          <rect x={hx} y={hy - hingeGap} width={hingeW} height={hingeH + hingeGap}
            fill="#e0dbd0" stroke="#444" strokeWidth={sw} />
        </g>
      ))}
    </g>
  )
}

function VasistasShape({ elem, zones, sw }: { elem: VasistasElem; zones: Zone[]; sw: number }) {
  const zone = zones.find(z => z.name === elem.zone)
  if (!zone) return null

  const sp = elem.spessore
  const ix = zone.x + sp, iy = zone.y + sp
  const iw = Math.max(0, zone.w - sp * 2)
  const ih = Math.max(0, zone.h - sp * 2)

  const { hingeDepth, hingeLen, hingeGap, hingeOffset, nCerniere, mw, mh } = elem
  const c = zone.y + zone.h  // bordo inferiore = linea cerniere

  // Posizioni X delle cerniere lungo il bordo inferiore
  const leftX  = zone.x + hingeOffset
  const rightX = zone.x + zone.w - hingeOffset
  const hingeXs = nCerniere === 1
    ? [(leftX + rightX) / 2]
    : Array.from({ length: nCerniere }, (_, i) => leftX + (rightX - leftX) * i / (nCerniere - 1))

  return (
    <g>
      {/* Barre vasistas — evenodd */}
      <path
        d={`M ${zone.x},${zone.y} h ${zone.w} v ${zone.h} h ${-zone.w} Z M ${ix},${iy} h ${iw} v ${ih} h ${-iw} Z`}
        fill="#f5f2ee" fillRule="evenodd"
      />
      <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} fill="none" stroke="#111" strokeWidth={sw} />
      <rect x={ix} y={iy} width={iw} height={ih} fill="none" stroke="#111" strokeWidth={sw} />
      <line x1={ix}      y1={iy}      x2={zone.x}          y2={zone.y}          stroke="#111" strokeWidth={sw} />
      <line x1={ix + iw} y1={iy}      x2={zone.x + zone.w} y2={zone.y}          stroke="#111" strokeWidth={sw} />
      <line x1={ix}      y1={iy + ih} x2={zone.x}          y2={zone.y + zone.h} stroke="#111" strokeWidth={sw} />
      <line x1={ix + iw} y1={iy + ih} x2={zone.x + zone.w} y2={zone.y + zone.h} stroke="#111" strokeWidth={sw} />
      {/* Vetro */}
      {iw > 0 && ih > 0 && (
        <rect x={ix} y={iy} width={iw} height={ih} fill="#cfeeff" stroke="#111" strokeWidth={sw * 0.7} />
      )}
      {/* Cerniere sul bordo inferiore — due foglie orizzontali affiancate (8cm+8cm=16cm, h=3cm) */}
      {hingeXs.map((hx, i) => (
        <g key={i}>
          {/* Foglia sinistra (anta): da hx-hingeLen al perno */}
          <rect x={hx - hingeLen} y={c - hingeDepth / 2} width={hingeLen + hingeGap} height={hingeDepth}
            fill="#e0dbd0" stroke="#444" strokeWidth={sw} />
          {/* Foglia destra (telaio): dal perno a hx+hingeLen */}
          <rect x={hx - hingeGap} y={c - hingeDepth / 2} width={hingeLen + hingeGap} height={hingeDepth}
            fill="#ccc8be" stroke="#444" strokeWidth={sw} />
        </g>
      ))}
      {/* Maniglia in alto al centro — orizzontale (16cm × 3cm) */}
      <rect
        x={zone.x + zone.w / 2 - mh / 2}
        y={zone.y + sp / 2 - mw / 2}
        width={mh} height={mw}
        fill="#888" stroke="#333" strokeWidth={sw * 0.8} rx={mw * 0.15}
      />
    </g>
  )
}

function OrtogonaleShape({ elem, zones, sw }: { elem: OrtogonaleElem; zones: Zone[]; sw: number }) {
  const zone = zones.find(z => z.name === elem.zone)
  if (!zone) return null

  const d  = elem.larghezza * 0.7
  const sp = elem.spessore
  const { x, y, w, h } = zone

  let ptsR: [number, number][]  // Ox — ancorato al lato della zona

  switch (elem.lato) {
    case 'destra':   ptsR = [[x+w, y], [x+w-d, y+d], [x+w-d, y+h+d], [x+w, y+h]]; break
    case 'sinistra': ptsR = [[x,   y], [x-d,   y+d], [x-d,   y+h+d], [x,   y+h]]; break
    case 'alto':     ptsR = [[x, y],   [x-d,   y+d], [x+w-d, y+d],   [x+w, y]];   break
    case 'basso':    ptsR = [[x, y+h], [x-d, y+h+d], [x+w-d, y+h+d], [x+w, y+h]]; break
  }

  const s2 = (pts: [number, number][]) => pts.map(([px, py]) => `${px},${py}`).join(' ')

  // Rettangolo agganciato al lato lontano di Ox (spessore = elem.spessore)
  let rx = 0, ry = 0, rw = 0, rh = 0
  switch (elem.lato) {
    case 'destra':   rx = x+w-d-sp; ry = y+d;    rw = sp; rh = h; break
    case 'sinistra': rx = x-d-sp;   ry = y+d;    rw = sp; rh = h; break
    case 'alto':     rx = x-d;      ry = y+d-sp; rw = w;  rh = sp; break
    case 'basso':    rx = x-d;      ry = y+h+d;  rw = w;  rh = sp; break
  }

  // Faccia superiore: top di Ox + top del rettangolo + segmento di chiusura
  let capPts: [number, number][]
  switch (elem.lato) {
    case 'destra':   capPts = [[x+w,   y],    [x+w-d,   y+d],    [x+w-d-sp, y+d],    [x+w-sp,   y]];    break
    case 'sinistra': capPts = [[x,     y],    [x-d,     y+d],    [x-d-sp,   y+d],    [x-sp,     y]];    break
    case 'alto':     capPts = [[x,     y],    [x+w,     y],      [x+w-d,    y+d-sp], [x-d,      y+d-sp]]; break
    case 'basso':    capPts = [[x,     y+h],  [x+w,     y+h],    [x+w-d,    y+h+d+sp],[x-d,     y+h+d+sp]]; break
  }

  return (
    <g>
      <rect x={rx} y={ry} width={rw} height={rh} fill="#e0d9cc" stroke="#111" strokeWidth={sw} />
      <polygon points={s2(ptsR)} fill="#e0d9cc" stroke="#111" strokeWidth={sw} />
      <polygon points={s2(capPts)} fill="#e0d9cc" stroke="#111" strokeWidth={sw} />
    </g>
  )
}

const LABEL_FS = 4  // mm fissi — piccolo, angolo in alto a sinistra

function ZoneLabel({ zone, allZones: _allZones, sw }: { zone: Zone; allZones: Zone[]; sw: number }) {
  const dash = Math.min(zone.w, zone.h) * 0.05
  const pad  = 1  // mm fissi dal bordo (diagonale)

  return (
    <g data-zone-label="true">
      <rect
        x={zone.x + sw} y={zone.y + sw}
        width={zone.w - sw * 2} height={zone.h - sw * 2}
        fill="none" stroke="#dd0000" strokeWidth={sw * 0.9}
        strokeDasharray={`${dash} ${dash * 0.5}`}
      />
      <text
        x={zone.x + pad} y={zone.y + sw + LABEL_FS * 0.9}
        textAnchor="start"
        fill="#dd0000" fontSize={LABEL_FS} fontFamily="Arial,sans-serif"
        fontWeight="bold" opacity={0.8}
      >{zone.name}</text>
    </g>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DisegnoClient() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  // A1 sempre inizializzato come foglio A4
  const [zones, setZones] = useState<Zone[]>([{ name: 'A1', x: 0, y: 0, ...A4.portrait }])
  const [elems, setElems] = useState<DrawElem[]>([])
  const [nextZoneIdx, setNextZoneIdx] = useState(2)
  const [nextElemId, setNextElemId] = useState(1)
  // Scala disegno: mm_SVG / mm_reali (calcolata al primo telaio, usata per tutti)
  const [drawScale, setDrawScale] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'all' | 'drawing' | 'zones'>('all')
  const [modal, setModal] = useState<ModalType>('none')
  const [error, setError] = useState('')
  const [redoStack, setRedoStack] = useState<{ elem: DrawElem; zones: Zone[]; delta: number; scale: number | null }[]>([])
  const [bulkUndo, setBulkUndo] = useState<{ elems: DrawElem[]; zones: Zone[]; nextZoneIdx: number; nextElemId: number; scale: number | null } | null>(null)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [printPngUrl, setPrintPngUrl] = useState('')
  const [printTemplateHtml, setPrintTemplateHtml] = useState('')
  const [titoloPDF, setTitoloPDF] = useState('')

  const svgRef          = useRef<SVGSVGElement>(null)
  const printTemplateRef = useRef<HTMLDivElement>(null)

  const [tForm, setTForm] = useState({
    dove: 'A1', modo: 'centrato' as 'centrato' | 'coords' | 'esteso',
    ox: '0', oy: '0', h: '', l: '', spessore: '70', aperto: false,
  })
  const [dForm, setDForm] = useState({ zona: 'A2', nAree: '2', orientamento: 'verticale' as 'verticale' | 'orizzontale' })
  const [fForm, setFForm] = useState({ zona: '', spessore: '70' })
  const [aForm, setAForm] = useState({
    dove: 'A1', modo: 'center' as string,
    ox: '0', oy: '0', l: '', h: '',
  })
  const [sForm, setSForm] = useState({
    zona: 'A2', orientamento: 'verticale' as 'verticale' | 'orizzontale', distanza: '',
  })
  const [pForm, setPForm] = useState({
    zona: 'A2', lato: 'sinistra' as 'sinistra' | 'destra', spessore: '70',
  })
  const [trForm, setTrForm] = useState({
    zona: 'A2', lato: 'alto' as 'alto' | 'basso', spessore: '70',
  })
  const [vForm, setVForm] = useState({ zona: 'A2' })
  const [antaForm, setAntaForm] = useState({
    zona: 'A2', lato: 'sinistra' as 'sinistra' | 'destra', nCerniere: '2', spessore: '70', maniglia: false,
  })
  const [vasForm, setVasForm] = useState({ zona: 'A2', nCerniere: '2', spessore: '70' })
  const [pnForm, setPnForm] = useState({ zona: 'A2' })
  const [ortForm, setOrtForm] = useState({ zona: 'A2', lato: 'destra' as 'sinistra' | 'destra' | 'alto' | 'basso', larghezza: '', spessore: '' })
  const [raForm, setRaForm] = useState({ zona: '' })
  const [uForm, setUForm] = useState({ zona1: '', zona2: '' })

  const a1 = zones.find(z => z.name === 'A1')!
  const dispScale = Math.min(CANVAS_MAX_W / a1.w, CANVAS_MAX_H / a1.h)
  const svgW = Math.round(a1.w * dispScale)
  const svgH = Math.round(a1.h * dispScale)
  const sw   = 1.2 / dispScale  // ~1.2px su schermo

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  function lastInnerZone(es: DrawElem[]): string {
    for (let i = es.length - 1; i >= 0; i--) {
      const e = es[i]
      if (e.type === 'telaio' && (e as FrameElem).innerZone) return (e as FrameElem).innerZone!
    }
    return 'A2'
  }

  function lastChildZone(es: DrawElem[]): string {
    for (let i = es.length - 1; i >= 0; i--) {
      const e = es[i]
      if (e.type === 'divisione') return (e as DivElem).childZones[0]
    }
    return 'A3'
  }

  function zoneDimLabel(z: Zone): string {
    const getDirectChildren = (name: string): string[] => {
      const out: string[] = []
      for (const e of elems) {
        if (e.type === 'area'       && (e as AreaElem).zone === name)      out.push((e as AreaElem).childZone)
        else if (e.type === 'divisione'  && (e as DivElem).zone === name)  out.push(...(e as DivElem).childZones)
        else if (e.type === 'split' && (e as SplitElem).zone === name)     out.push(...(e as SplitElem).childZones)
        else if (e.type === 'pilastrino' && (e as PilastrinoElem).zone === name) out.push((e as PilastrinoElem).childZone)
        else if (e.type === 'traversa'   && (e as TraversaElem).zone === name)   out.push((e as TraversaElem).childZone)
      }
      return out
    }
    // Ricorsivo: restituisce le foglie terminali (zone non ulteriormente divise)
    const getLeaves = (name: string): string[] => {
      const ch = getDirectChildren(name)
      return ch.length === 0 ? [name] : ch.flatMap(getLeaves)
    }

    const leaves = getLeaves(z.name)
    const isSplit = leaves.length !== 1 || leaves[0] !== z.name

    if (drawScale) {
      const l = (z.w / drawScale / 10).toFixed(0)
      const h = (z.h / drawScale / 10).toFixed(0)
      if (isSplit) return `${z.name}  (L=${l} H=${h} cm)  =  ${leaves.join('+')}`
      return `${z.name}  (L=${l} cm, H=${h} cm)`
    }
    if (isSplit) return `${z.name}  (${Math.round(z.w)}×${Math.round(z.h)} mm)  =  ${leaves.join('+')}`
    return `${z.name}  (${Math.round(z.w)} × ${Math.round(z.h)} mm)`
  }

  function openModal(m: ModalType) {
    setError('')
    const first = zones[0]?.name ?? 'A1'
    if (m === 'area') setAForm(f => ({ ...f, dove: first }))
    if (m === 'telaio') setTForm(f => ({ ...f, dove: first }))
    if (m === 'split') setSForm(f => ({ ...f, zona: first, distanza: '' }))
    if (m === 'pilastrino') setPForm(f => ({ ...f, zona: first }))
    if (m === 'traversa') setTrForm(f => ({ ...f, zona: first }))
    if (m === 'vetro') setVForm({ zona: first })
    if (m === 'anta') setAntaForm(f => ({ ...f, zona: first }))
    if (m === 'vasistas') setVasForm(f => ({ ...f, zona: first }))
    if (m === 'pannello') setPnForm({ zona: first })
    if (m === 'ortogonale') setOrtForm(f => ({ ...f, zona: first }))
    if (m === 'rimuovi_area') {
      const nonA1 = zones.find(z => z.name !== 'A1')
      setRaForm({ zona: nonA1?.name ?? '' })
    }
    if (m === 'unisci_aree') {
      const nonA1 = zones.filter(z => z.name !== 'A1')
      setUForm({ zona1: nonA1[0]?.name ?? '', zona2: nonA1[1]?.name ?? '' })
    }
    if (m === 'divisione') {
      const inner = lastInnerZone(elems)
      setDForm(f => ({ ...f, zona: zones.find(z => z.name === inner) ? inner : first }))
    }
    if (m === 'laterale_fisso') {
      const child = lastChildZone(elems)
      setFForm(f => ({ ...f, zona: zones.find(z => z.name === child) ? child : first }))
    }
    setModal(m)
  }

  function changeOrientation(o: 'portrait' | 'landscape') {
    setOrientation(o)
    setZones([{ name: 'A1', x: 0, y: 0, ...A4[o] }])
    setElems([])
    setDrawScale(null)
  }

  // ─── Handlers ────────────────────────────────────────────────────────────────

  function handleAddTelaio() {
    setError('')
    const spReal = parseFloat(tForm.spessore)
    if (!spReal || spReal <= 0) { setError('Inserisci un valore valido per Spessore.'); return }

    const dove = tForm.dove.trim().toUpperCase() || 'A1'
    const pz = zones.find(z => z.name === dove)
    if (!pz) { setError(`Zona "${dove}" non trovata.`); return }

    let ex: number, ey: number, wSVG: number, hSVG: number, scale: number

    if (tForm.modo === 'esteso') {
      ex = pz.x; ey = pz.y
      wSVG = pz.w; hSVG = pz.h
      scale = drawScale ?? 1
      if (!drawScale) setDrawScale(1)
    } else {
      const hReal = parseFloat(tForm.h) * 10
      const lReal = parseFloat(tForm.l) * 10
      if (!hReal || !lReal || hReal <= 0 || lReal <= 0) {
        setError('Inserisci valori validi per H e L.')
        return
      }
      if (!drawScale) {
        const avW = pz.w - MARGIN * 2
        const avH = pz.h - MARGIN * 2
        scale = Math.min(avW / lReal, avH / hReal)
        setDrawScale(scale)
      } else {
        scale = drawScale
      }
      wSVG = lReal * scale
      hSVG = hReal * scale

      if (tForm.modo === 'centrato') {
        ex = pz.x + (pz.w - wSVG) / 2
        ey = pz.y + (pz.h - hSVG) / 2
      } else {
        ex = pz.x + parseFloat(tForm.ox) * 10 * scale
        ey = pz.y + parseFloat(tForm.oy) * 10 * scale
      }

      if (ex < pz.x || ey < pz.y || ex + wSVG > pz.x + pz.w + 0.01 || ey + hSVG > pz.y + pz.h + 0.01) {
        setError('Le dimensioni o la posizione del telaio eccedono la zona contenitore.')
        return
      }
    }

    const spSVG = spReal * scale
    if (spSVG * 2 >= Math.min(wSVG, hSVG)) {
      setError('Spessore troppo grande rispetto alle dimensioni.')
      return
    }

    const isOrtCtx = dove.startsWith('O')
    const innerName = isOrtCtx
      ? `O${zones.filter(z => z.name.startsWith('O')).length + 1}`
      : `A${nextZoneIdx}`
    const innerH = tForm.aperto ? hSVG - spSVG : hSVG - spSVG * 2
    const newInner: Zone = { name: innerName, x: ex + spSVG, y: ey + spSVG, w: wSVG - spSVG * 2, h: innerH }
    const newElem: FrameElem = {
      id: nextElemId, type: 'telaio', zone: dove,
      x: ex, y: ey, w: wSVG, h: hSVG, spessore: spSVG,
      aperto: tForm.aperto, innerZone: innerName,
    }

    setZones([...zones, newInner])
    setElems([...elems, newElem])
    if (!isOrtCtx) setNextZoneIdx(nextZoneIdx + 1)
    setNextElemId(nextElemId + 1)
    setRedoStack([])
    setModal('none')
  }

  function handleDivide() {
    setError('')
    const n = parseInt(dForm.nAree)
    if (!n || n < 2 || n > 10) { setError('N aree: valore tra 2 e 10.'); return }
    const zonaNome = dForm.zona.trim().toUpperCase()
    const pz = zones.find(z => z.name === zonaNome)
    if (!pz) { setError(`Zona "${zonaNome}" non trovata.`); return }

    const isOrtCtx = zonaNome.startsWith('O')
    const childNames: string[] = []
    const childZones: Zone[] = []
    let aidx = nextZoneIdx
    let oBase = isOrtCtx ? zones.filter(z => z.name.startsWith('O')).length : 0

    for (let i = 0; i < n; i++) {
      let name: string
      if (isOrtCtx) {
        name = `O${oBase + i + 1}`
      } else {
        name = `A${aidx++}`
      }
      childNames.push(name)
      if (dForm.orientamento === 'orizzontale') {
        const ah = pz.h / n
        childZones.push({ name, x: pz.x, y: pz.y + ah * i, w: pz.w, h: ah })
      } else {
        const aw = pz.w / n
        childZones.push({ name, x: pz.x + aw * i, y: pz.y, w: aw, h: pz.h })
      }
    }

    setZones([...zones, ...childZones])
    setElems([...elems, { id: nextElemId, type: 'divisione', zone: zonaNome, nAree: n, orientamento: dForm.orientamento, childZones: childNames }])
    if (!isOrtCtx) setNextZoneIdx(aidx)
    setNextElemId(nextElemId + 1)
    setRedoStack([])
    setModal('none')
  }

  function handleAddFisso() {
    setError('')
    const spReal = parseFloat(fForm.spessore)
    if (!spReal || spReal <= 0) { setError('Spessore non valido.'); return }
    const zonaNome = fForm.zona.trim().toUpperCase()
    const zone = zones.find(z => z.name === zonaNome)
    if (!zone) { setError(`Zona "${zonaNome}" non trovata.`); return }

    const spSVG = spReal * (drawScale ?? 1)
    if (spSVG * 2 >= Math.min(zone.w, zone.h)) { setError('Spessore troppo grande per questa zona.'); return }

    setElems([...elems, {
      id: nextElemId, type: 'laterale_fisso', zone: zonaNome,
      x: zone.x, y: zone.y, w: zone.w, h: zone.h, spessore: spSVG, aperto: false,
    }])
    setNextElemId(nextElemId + 1)
    setRedoStack([])
    setModal('none')
  }

  function handleAddArea() {
    setError('')
    const dove = aForm.dove.trim().toUpperCase() || 'A1'
    const pz = zones.find(z => z.name === dove)
    if (!pz) { setError(`Zona "${dove}" non trovata.`); return }

    let ex: number, ey: number, wSVG: number, hSVG: number, scale: number

    const colonIdx = aForm.modo.indexOf(':')
    if (colonIdx !== -1) {
      // Modalità relativa: "sopra:A7", "sotto:A7", "sinistra:A7", "destra:A7"
      if (!drawScale) { setError('Aggiungi prima un telaio o un\'area per definire la scala.'); return }
      scale = drawScale
      const pos    = aForm.modo.slice(0, colonIdx)
      const rifName = aForm.modo.slice(colonIdx + 1)
      const rif = zones.find(z => z.name === rifName)
      if (!rif) { setError(`Zona di riferimento "${rifName}" non trovata.`); return }

      const isVert = pos === 'sopra' || pos === 'sotto'
      const dimReal = parseFloat(isVert ? aForm.h : aForm.l) * 10
      if (!dimReal || dimReal <= 0) { setError(`Inserisci ${isVert ? 'H' : 'L'} valida.`); return }
      const dimSVG = dimReal * scale

      if (pos === 'sopra')    { wSVG = rif.w; hSVG = dimSVG; ex = rif.x; ey = rif.y - dimSVG }
      else if (pos === 'sotto')    { wSVG = rif.w; hSVG = dimSVG; ex = rif.x; ey = rif.y + rif.h }
      else if (pos === 'sinistra') { wSVG = dimSVG; hSVG = rif.h; ex = rif.x - dimSVG; ey = rif.y }
      else                         { wSVG = dimSVG; hSVG = rif.h; ex = rif.x + rif.w;  ey = rif.y }
    } else {
      // Modalità standard: centrato o coordinate
      const lReal = parseFloat(aForm.l) * 10
      const hReal = parseFloat(aForm.h) * 10
      if (!lReal || !hReal || lReal <= 0 || hReal <= 0) { setError('Inserisci L e H validi.'); return }

      if (!drawScale) {
        const avW = pz.w - MARGIN * 2
        const avH = pz.h - MARGIN * 2
        scale = Math.min(avW / lReal, avH / hReal)
        setDrawScale(scale)
      } else {
        scale = drawScale
      }
      wSVG = lReal * scale
      hSVG = hReal * scale
      if (aForm.modo === 'center') {
        ex = pz.x + (pz.w - wSVG) / 2
        ey = pz.y + (pz.h - hSVG) / 2
      } else {
        ex = pz.x + parseFloat(aForm.ox) * 10 * scale
        ey = pz.y + parseFloat(aForm.oy) * 10 * scale
      }
    }

    if (ex! < pz.x || ey! < pz.y || ex! + wSVG! > pz.x + pz.w + 0.01 || ey! + hSVG! > pz.y + pz.h + 0.01) {
      setError('La sottoarea non entra nella zona contenitore.')
      return
    }

    const childName = `A${nextZoneIdx}`
    setZones([...zones, { name: childName, x: ex!, y: ey!, w: wSVG!, h: hSVG! }])
    setElems([...elems, { id: nextElemId, type: 'area', zone: dove, childZone: childName } as AreaElem])
    setNextZoneIdx(nextZoneIdx + 1)
    setNextElemId(nextElemId + 1)
    setRedoStack([])
    setModal('none')
  }

  function handleSplit() {
    setError('')
    if (!drawScale) { setError('Aggiungi prima un telaio o un\'area per definire la scala.'); return }
    const distCm = parseFloat(sForm.distanza)
    if (!distCm || distCm <= 0) { setError('Inserisci una distanza valida.'); return }
    const zonaNome = sForm.zona.trim().toUpperCase()
    const pz = zones.find(z => z.name === zonaNome)
    if (!pz) { setError(`Zona "${zonaNome}" non trovata.`); return }

    const distSVG = distCm * 10 * drawScale
    const isVert = sForm.orientamento === 'verticale'
    const maxDim = isVert ? pz.w : pz.h
    if (distSVG <= 0 || distSVG >= maxDim) {
      const maxCm = (maxDim / drawScale / 10).toFixed(1)
      setError(`La distanza deve essere tra 0 e ${maxCm} cm.`)
      return
    }

    const isOrtCtx = zonaNome.startsWith('O')
    const oBase = isOrtCtx ? zones.filter(z => z.name.startsWith('O')).length : 0
    const name1 = isOrtCtx ? `O${oBase + 1}` : `A${nextZoneIdx}`
    const name2 = isOrtCtx ? `O${oBase + 2}` : `A${nextZoneIdx + 1}`
    const zone1: Zone = isVert
      ? { name: name1, x: pz.x,            y: pz.y, w: distSVG,        h: pz.h }
      : { name: name1, x: pz.x, y: pz.y,            w: pz.w, h: distSVG        }
    const zone2: Zone = isVert
      ? { name: name2, x: pz.x + distSVG,  y: pz.y, w: pz.w - distSVG, h: pz.h }
      : { name: name2, x: pz.x, y: pz.y + distSVG,  w: pz.w, h: pz.h - distSVG }

    setZones([...zones, zone1, zone2])
    setElems([...elems, {
      id: nextElemId, type: 'split', zone: zonaNome,
      orientamento: sForm.orientamento, distanza: distSVG,
      childZones: [name1, name2],
    } as SplitElem])
    if (!isOrtCtx) setNextZoneIdx(nextZoneIdx + 2)
    setNextElemId(nextElemId + 1)
    setRedoStack([])
    setModal('none')
  }

  function handleAddPilastrino() {
    setError('')
    if (!drawScale) { setError('Aggiungi prima un telaio o un\'area per definire la scala.'); return }
    const spReal = parseFloat(pForm.spessore)
    if (!spReal || spReal <= 0) { setError('Spessore non valido.'); return }
    const zonaNome = pForm.zona.trim().toUpperCase()
    const pz = zones.find(z => z.name === zonaNome)
    if (!pz) { setError(`Zona "${zonaNome}" non trovata.`); return }

    const spSVG = spReal * drawScale
    if (spSVG >= pz.w) {
      setError(`Spessore troppo grande: la zona è larga ${(pz.w / drawScale).toFixed(0)} mm.`)
      return
    }

    const isOrtCtxP = zonaNome.startsWith('O')
    const childName = isOrtCtxP ? nextOName(zones) : `A${nextZoneIdx}`
    const childZone: Zone = pForm.lato === 'sinistra'
      ? { name: childName, x: pz.x + spSVG, y: pz.y, w: pz.w - spSVG, h: pz.h }
      : { name: childName, x: pz.x,          y: pz.y, w: pz.w - spSVG, h: pz.h }

    setZones([...zones, childZone])
    setElems([...elems, {
      id: nextElemId, type: 'pilastrino', zone: zonaNome,
      lato: pForm.lato, spessore: spSVG, childZone: childName,
    } as PilastrinoElem])
    if (!isOrtCtxP) setNextZoneIdx(nextZoneIdx + 1)
    setNextElemId(nextElemId + 1)
    setRedoStack([])
    setModal('none')
  }

  function handleAddAnta() {
    setError('')
    if (!drawScale) { setError('Aggiungi prima un telaio o un\'area per definire la scala.'); return }
    const nCerniere = parseInt(antaForm.nCerniere)
    if (!nCerniere || nCerniere < 1 || nCerniere > 10) { setError('N cerniere: valore tra 1 e 10.'); return }
    const spReal = parseFloat(antaForm.spessore)
    if (!spReal || spReal <= 0) { setError('Spessore non valido.'); return }
    const zonaNome = antaForm.zona.trim().toUpperCase()
    const zone = zones.find(z => z.name === zonaNome)
    if (!zone) { setError(`Zona "${zonaNome}" non trovata.`); return }
    const spSVG = spReal * drawScale
    if (spSVG * 2 >= Math.min(zone.w, zone.h)) { setError('Spessore troppo grande per questa zona.'); return }
    // dimensioni cerniera in scala reale: larghezza 30mm, ogni foglia 80mm
    const hingeH   = 80 * drawScale   // 8cm per foglia
    const hingeW   = 30 * drawScale   // 3cm larghezza totale
    const hingeGap = 5  * drawScale   // sovrapposizione al perno (~5mm)
    // posizione verticale: 25cm reali dal bordo, tradotto in proporzione
    const preferred = drawScale ? 340 * drawScale : zone.h * 0.24
    // il centro della cerniera deve stare almeno hingeH dentro la zona
    const hingeOffset = Math.min(Math.max(preferred, hingeH), zone.h * 0.55)
    setElems([...elems, {
      id: nextElemId, type: 'anta', zone: zonaNome,
      lato: antaForm.lato, nCerniere, spessore: spSVG,
      hingeH, hingeW, hingeGap, hingeOffset, maniglia: antaForm.maniglia,
    } as AntaElem])
    setNextElemId(nextElemId + 1)
    setRedoStack([])
    setModal('none')
  }

  function handleAddVasistas() {
    setError('')
    if (!drawScale) { setError('Aggiungi prima un telaio o un\'area per definire la scala.'); return }
    const nCerniere = parseInt(vasForm.nCerniere)
    if (!nCerniere || nCerniere < 1 || nCerniere > 10) { setError('N cerniere: valore tra 1 e 10.'); return }
    const spReal = parseFloat(vasForm.spessore)
    if (!spReal || spReal <= 0) { setError('Spessore non valido.'); return }
    const zonaNome = vasForm.zona.trim().toUpperCase()
    const zone = zones.find(z => z.name === zonaNome)
    if (!zone) { setError(`Zona "${zonaNome}" non trovata.`); return }
    const spSVG = spReal * drawScale
    if (spSVG * 2 >= Math.min(zone.w, zone.h)) { setError('Spessore troppo grande per questa zona.'); return }

    const hingeDepth = 30 * drawScale   // 3cm profondità foglia
    const hingeLen   = 80 * drawScale   // 8cm lunghezza cerniera
    const hingeGap   = 5  * drawScale
    const preferred  = 340 * drawScale
    const hingeOffset = Math.min(Math.max(preferred, hingeLen), zone.w * 0.45)

    setElems([...elems, {
      id: nextElemId, type: 'vasistas', zone: zonaNome,
      nCerniere, spessore: spSVG, hingeDepth, hingeLen, hingeGap, hingeOffset,
      mw: 30 * drawScale, mh: 80 * drawScale,
    } as VasistasElem])
    setNextElemId(nextElemId + 1)
    setRedoStack([])
    setModal('none')
  }

  function handleAddVetro() {
    setError('')
    const zonaNome = vForm.zona.trim().toUpperCase()
    if (!zones.find(z => z.name === zonaNome)) { setError(`Zona "${zonaNome}" non trovata.`); return }
    setElems([...elems, { id: nextElemId, type: 'vetro', zone: zonaNome } as VetroElem])
    setNextElemId(nextElemId + 1)
    setRedoStack([])
    setModal('none')
  }

  function handleAddPannello() {
    setError('')
    const zonaNome = pnForm.zona.trim().toUpperCase()
    if (!zones.find(z => z.name === zonaNome)) { setError(`Zona "${zonaNome}" non trovata.`); return }
    setElems([...elems, { id: nextElemId, type: 'pannello', zone: zonaNome } as PannelloElem])
    setNextElemId(nextElemId + 1)
    setRedoStack([])
    setModal('none')
  }

  function handleAddOrtogonale() {
    setError('')
    if (!drawScale) { setError('Aggiungi prima un telaio o un\'area per definire la scala.'); return }
    const largCm = parseFloat(ortForm.larghezza)
    if (!largCm || largCm <= 0) { setError('Inserisci una larghezza valida.'); return }
    const spMm = parseFloat(ortForm.spessore)
    if (!spMm || spMm <= 0) { setError('Inserisci uno spessore valido.'); return }
    const zonaNome = ortForm.zona.trim().toUpperCase()
    const az = zones.find(z => z.name === zonaNome)
    if (!az) { setError(`Zona "${zonaNome}" non trovata.`); return }

    const largSVG = largCm * 10 * drawScale
    const spessoreSVG = spMm * drawScale

    // Verifica che tutta la geometria ricada dentro il foglio A1
    const a1 = zones.find(z => z.name === 'A1')!
    const d = largSVG * 0.7
    const { x: ax, y: ay, w: aw, h: ah } = az
    let bMinX: number, bMaxX: number, bMinY: number, bMaxY: number
    switch (ortForm.lato) {
      case 'destra':   bMinX = ax+aw-d-spessoreSVG; bMaxX = ax+aw;    bMinY = ay;           bMaxY = ay+ah+d; break
      case 'sinistra': bMinX = ax-d-spessoreSVG;    bMaxX = ax;        bMinY = ay;           bMaxY = ay+ah+d; break
      case 'alto':     bMinX = ax-d;                bMaxX = ax+aw;     bMinY = ay+d-spessoreSVG; bMaxY = ay+d; break
      case 'basso':    bMinX = ax-d;                bMaxX = ax+aw;     bMinY = ay+ah;        bMaxY = ay+ah+d+spessoreSVG; break
    }
    if (bMinX! < -0.01 || bMaxX! > a1.w + 0.01 || bMinY! < -0.01 || bMaxY! > a1.h + 0.01) {
      setError('L\'area ortogonale esce dai bordi del foglio.'); return
    }

    const innerName = nextOName(zones)

    let ic = { x: 0, y: 0, w: 0, h: 0 }
    switch (ortForm.lato) {
      case 'destra':   ic = { x: az.x + az.w,    y: az.y,           w: largSVG, h: az.h   }; break
      case 'sinistra': ic = { x: az.x - largSVG, y: az.y,           w: largSVG, h: az.h   }; break
      case 'alto':     ic = { x: az.x,            y: az.y - largSVG, w: az.w,   h: largSVG }; break
      case 'basso':    ic = { x: az.x,            y: az.y + az.h,    w: az.w,   h: largSVG }; break
    }

    setZones([...zones, { name: innerName, ...ic }])
    setElems([...elems, { id: nextElemId, type: 'ortogonale', zone: zonaNome, lato: ortForm.lato, larghezza: largSVG, spessore: spessoreSVG, innerZone: innerName } as OrtogonaleElem])
    setNextElemId(nextElemId + 1)
    setRedoStack([])
    setModal('none')
  }

  function handleRimuoviArea() {
    setError('')
    const zonaNome = raForm.zona.trim().toUpperCase()
    if (!zonaNome) { setError('Seleziona una zona da rimuovere.'); return }
    if (zonaNome === 'A1') { setError('Non puoi rimuovere la zona A1 (foglio principale).'); return }
    if (!zones.find(z => z.name === zonaNome)) { setError(`Zona "${zonaNome}" non trovata.`); return }

    const getChildZones = (e: DrawElem): string[] => {
      if (e.type === 'area')       return [(e as AreaElem).childZone]
      if (e.type === 'divisione')  return [...(e as DivElem).childZones]
      if (e.type === 'split')      return [...(e as SplitElem).childZones]
      if (e.type === 'pilastrino') return [(e as PilastrinoElem).childZone]
      if (e.type === 'traversa')   return [(e as TraversaElem).childZone]
      if (e.type === 'telaio' && (e as FrameElem).innerZone) return [(e as FrameElem).innerZone!]
      if (e.type === 'ortogonale') return [(e as OrtogonaleElem).innerZone]
      return []
    }
    const getParentZone = (e: DrawElem): string | null => {
      if ('zone' in e) return (e as unknown as { zone: string }).zone
      return null
    }

    // Fase 1 — propagazione verso l'alto
    // Segna i creator dei fratelli (skipCreators: i loro altri figli restano vivi nel BFS)
    // Propaga al genitore SOLO se la zona ha almeno un fratello sopravvissuto
    const toRemove = new Set<string>([zonaNome])
    const skipCreators = new Set<number>()
    const creatorsToRemove = new Set<number>()  // creator sempre rimossi (anche senza propagazione)

    let zoneToCheck = zonaNome
    while (true) {
      const creator = elems.find(e => getChildZones(e).includes(zoneToCheck))
      if (!creator) break

      creatorsToRemove.add(creator.id)
      skipCreators.add(creator.id)

      // Fratelli = altri figli del creatore non già destinati alla rimozione
      const siblings = getChildZones(creator).filter(c => c !== zoneToCheck && !toRemove.has(c))
      if (siblings.length === 0) break  // figlia unica → il padre sopravvive

      const parentZone = getParentZone(creator)
      if (!parentZone || parentZone === 'A1') break  // A1 non viene mai toccato
      toRemove.add(parentZone)
      zoneToCheck = parentZone
    }

    // Fase 2 — BFS verso il basso: espande discendenti saltando i creatori di fratelli
    let changed = true
    while (changed) {
      changed = false
      for (const e of elems) {
        if (skipCreators.has(e.id)) continue
        const pz = getParentZone(e)
        if (pz && toRemove.has(pz)) {
          for (const c of getChildZones(e)) {
            if (!toRemove.has(c)) { toRemove.add(c); changed = true }
          }
        }
      }
    }

    const newZones = zones.filter(z => !toRemove.has(z.name))
    const newElems = elems.filter(e => {
      if (creatorsToRemove.has(e.id)) return false  // creator element → sempre rimosso
      const pz = getParentZone(e)
      if (pz && toRemove.has(pz)) return false       // elemento in zona rimossa
      if (!pz) {                                      // AreaElem: controlla childZone
        for (const c of getChildZones(e)) {
          if (toRemove.has(c)) return false
        }
      }
      return true
    })

    setBulkUndo({ elems, zones, nextZoneIdx, nextElemId, scale: drawScale })
    setZones(newZones)
    setElems(newElems)
    setRedoStack([])
    setModal('none')
  }

  function handleUnisciAree() {
    setError('')
    const n1 = uForm.zona1.trim().toUpperCase()
    const n2 = uForm.zona2.trim().toUpperCase()
    if (!n1 || !n2) { setError('Seleziona entrambe le zone.'); return }
    if (n1 === n2)  { setError('Seleziona due zone diverse.'); return }

    const z1 = zones.find(z => z.name === n1)
    const z2 = zones.find(z => z.name === n2)
    if (!z1) { setError(`Zona "${n1}" non trovata.`); return }
    if (!z2) { setError(`Zona "${n2}" non trovata.`); return }

    // Controllo vuoto: nessun elemento ha zone===n1 o zone===n2
    const hasElemIn = (name: string) => elems.some(e => 'zone' in e && (e as unknown as { zone: string }).zone === name)
    if (hasElemIn(n1)) { setError(`${n1} non è vuota (contiene figli o elementi disegno).`); return }
    if (hasElemIn(n2)) { setError(`${n2} non è vuota (contiene figli o elementi disegno).`); return }

    // Controllo adiacenza: devono formare un rettangolo
    const EPS = 0.5
    let mx: number, my: number, mw: number, mh: number, ok = false
    if (Math.abs(z1.x + z1.w - z2.x) < EPS && Math.abs(z1.y - z2.y) < EPS && Math.abs(z1.h - z2.h) < EPS) {
      mx = z1.x; my = z1.y; mw = z1.w + z2.w; mh = z1.h; ok = true
    } else if (Math.abs(z2.x + z2.w - z1.x) < EPS && Math.abs(z1.y - z2.y) < EPS && Math.abs(z1.h - z2.h) < EPS) {
      mx = z2.x; my = z1.y; mw = z1.w + z2.w; mh = z1.h; ok = true
    } else if (Math.abs(z1.y + z1.h - z2.y) < EPS && Math.abs(z1.x - z2.x) < EPS && Math.abs(z1.w - z2.w) < EPS) {
      mx = z1.x; my = z1.y; mw = z1.w; mh = z1.h + z2.h; ok = true
    } else if (Math.abs(z2.y + z2.h - z1.y) < EPS && Math.abs(z1.x - z2.x) < EPS && Math.abs(z1.w - z2.w) < EPS) {
      mx = z1.x; my = z2.y; mw = z1.w; mh = z1.h + z2.h; ok = true
    }
    if (!ok) { setError('Le zone non sono adiacenti o non formano un rettangolo.'); return }

    const getChildZones = (e: DrawElem): string[] => {
      if (e.type === 'area')       return [(e as AreaElem).childZone]
      if (e.type === 'divisione')  return [...(e as DivElem).childZones]
      if (e.type === 'split')      return [...(e as SplitElem).childZones]
      if (e.type === 'pilastrino') return [(e as PilastrinoElem).childZone]
      if (e.type === 'traversa')   return [(e as TraversaElem).childZone]
      if (e.type === 'telaio' && (e as FrameElem).innerZone) return [(e as FrameElem).innerZone!]
      if (e.type === 'ortogonale') return [(e as OrtogonaleElem).innerZone]
      return []
    }
    const getParentZone = (e: DrawElem): string | null => {
      if ('zone' in e) return (e as unknown as { zone: string }).zone
      return null
    }

    const creator1 = elems.find(e => getChildZones(e).includes(n1))
    const creator2 = elems.find(e => getChildZones(e).includes(n2))

    if (creator1 && creator2 && creator1.id === creator2.id) {
      // ── Fratelli: stesso creator ─ aggiorna il creator togliendo n2 ──────────
      const c = creator1
      const newZones = zones
        .filter(z => z.name !== n2)
        .map(z => z.name === n1 ? { ...z, x: mx!, y: my!, w: mw!, h: mh! } : z)
      let newElems: DrawElem[]
      if (c.type === 'divisione') {
        const div = c as DivElem
        const newChild = div.childZones.filter(cn => cn !== n2)
        newElems = newChild.length <= 1
          ? elems.filter(e => e.id !== c.id)
          : elems.map(e => e.id === c.id ? { ...div, childZones: newChild, nAree: newChild.length } : e)
      } else {
        // SplitElem (2 figli) — entrambi fusi, creator rimosso
        newElems = elems.filter(e => e.id !== c.id)
      }
      setBulkUndo({ elems, zones, nextZoneIdx, nextElemId, scale: drawScale })
      setZones(newZones)
      setElems(newElems)
      setRedoStack([])
      setModal('none')
      return
    }

    // ── Non fratelli: propagazione upward+downward per entrambe le zone ────────
    // toRemove parte con entrambe; n1 sopravvive ridimensionata, n2 sparisce
    const toRemove = new Set<string>([n1, n2])
    const creatorsToRemove = new Set<number>()
    const skipCreators = new Set<number>()

    const propagateUp = (startZone: string) => {
      let zoneToCheck = startZone
      while (true) {
        const creator = elems.find(e => getChildZones(e).includes(zoneToCheck))
        if (!creator) break
        creatorsToRemove.add(creator.id)
        skipCreators.add(creator.id)
        // Fratelli sopravvissuti = figli del creator non già in toRemove
        const siblings = getChildZones(creator).filter(c => c !== zoneToCheck && !toRemove.has(c))
        if (siblings.length === 0) break  // figlio unico → il padre sopravvive
        const parentZone = getParentZone(creator)
        if (!parentZone || parentZone === 'A1') break
        toRemove.add(parentZone)
        zoneToCheck = parentZone
      }
    }

    // Prima n1, poi n2: così n2 vede toRemove già aggiornato da n1
    propagateUp(n1)
    propagateUp(n2)

    // BFS verso il basso: espande discendenti saltando skipCreators
    let changed = true
    while (changed) {
      changed = false
      for (const e of elems) {
        if (skipCreators.has(e.id)) continue
        const pz = getParentZone(e)
        if (pz && toRemove.has(pz)) {
          for (const c of getChildZones(e)) {
            if (!toRemove.has(c)) { toRemove.add(c); changed = true }
          }
        }
      }
    }

    // n1 sopravvive ridimensionata; n2 e tutto il resto in toRemove sparisce
    const newZones = zones
      .filter(z => !toRemove.has(z.name) || z.name === n1)
      .map(z => z.name === n1 ? { ...z, x: mx!, y: my!, w: mw!, h: mh! } : z)

    const newElems = elems.filter(e => {
      if (creatorsToRemove.has(e.id)) return false
      const pz = getParentZone(e)
      if (pz && toRemove.has(pz) && pz !== n1) return false
      if (!pz) {
        for (const c of getChildZones(e)) {
          if (toRemove.has(c) && c !== n1) return false
        }
      }
      return true
    })

    setBulkUndo({ elems, zones, nextZoneIdx, nextElemId, scale: drawScale })
    setZones(newZones)
    setElems(newElems)
    setRedoStack([])
    setModal('none')
  }

  function handleAddTraversa() {
    setError('')
    if (!drawScale) { setError('Aggiungi prima un telaio o un\'area per definire la scala.'); return }
    const spReal = parseFloat(trForm.spessore)
    if (!spReal || spReal <= 0) { setError('Spessore non valido.'); return }
    const zonaNome = trForm.zona.trim().toUpperCase()
    const pz = zones.find(z => z.name === zonaNome)
    if (!pz) { setError(`Zona "${zonaNome}" non trovata.`); return }

    const spSVG = spReal * drawScale
    if (spSVG >= pz.h) {
      setError(`Spessore troppo grande: la zona è alta ${(pz.h / drawScale).toFixed(0)} mm.`)
      return
    }

    const isOrtCtxT = zonaNome.startsWith('O')
    const childName = isOrtCtxT ? nextOName(zones) : `A${nextZoneIdx}`
    const childZone: Zone = trForm.lato === 'alto'
      ? { name: childName, x: pz.x, y: pz.y + spSVG, w: pz.w, h: pz.h - spSVG }
      : { name: childName, x: pz.x, y: pz.y,          w: pz.w, h: pz.h - spSVG }

    setZones([...zones, childZone])
    setElems([...elems, {
      id: nextElemId, type: 'traversa', zone: zonaNome,
      lato: trForm.lato, spessore: spSVG, childZone: childName,
    } as TraversaElem])
    if (!isOrtCtxT) setNextZoneIdx(nextZoneIdx + 1)
    setNextElemId(nextElemId + 1)
    setRedoStack([])
    setModal('none')
  }

  function handleUndo() {
    if (!elems.length && !bulkUndo) return

    // Ripristina rimozione massiva se nextElemId invariato da allora
    if (bulkUndo && nextElemId === bulkUndo.nextElemId) {
      setElems(bulkUndo.elems)
      setZones(bulkUndo.zones)
      setNextZoneIdx(bulkUndo.nextZoneIdx)
      setNextElemId(bulkUndo.nextElemId)
      if (bulkUndo.scale !== null) setDrawScale(bulkUndo.scale)
      setBulkUndo(null)
      setRedoStack([])
      return
    }

    if (!elems.length) return
    const last = elems[elems.length - 1]
    let newZones = [...zones]
    let delta = 0
    let removedZones: Zone[] = []
    let newScale = drawScale

    if (last.type === 'telaio') {
      const fe = last as FrameElem
      if (fe.innerZone) {
        removedZones = newZones.filter(z => z.name === fe.innerZone)
        newZones = newZones.filter(z => z.name !== fe.innerZone)
        delta = fe.innerZone.startsWith('O') ? 0 : 1
      }
      const prevScaleSetters = elems.slice(0, -1).filter(e => e.type === 'telaio' || e.type === 'area')
      if (prevScaleSetters.length === 0) { newScale = null; setDrawScale(null) }
    } else if (last.type === 'area') {
      const ae = last as AreaElem
      removedZones = newZones.filter(z => z.name === ae.childZone)
      newZones = newZones.filter(z => z.name !== ae.childZone)
      delta = 1
      const prevScaleSetters = elems.slice(0, -1).filter(e => e.type === 'telaio' || e.type === 'area')
      if (prevScaleSetters.length === 0) { newScale = null; setDrawScale(null) }
    } else if (last.type === 'divisione') {
      const de = last as DivElem
      removedZones = newZones.filter(z => de.childZones.includes(z.name))
      newZones = newZones.filter(z => !de.childZones.includes(z.name))
      delta = de.childZones.some(z => z.startsWith('O')) ? 0 : de.nAree
    } else if (last.type === 'split') {
      const se = last as SplitElem
      removedZones = newZones.filter(z => se.childZones.includes(z.name))
      newZones = newZones.filter(z => !se.childZones.includes(z.name))
      delta = se.childZones.some(z => z.startsWith('O')) ? 0 : 2
    } else if (last.type === 'pilastrino') {
      const pe = last as PilastrinoElem
      removedZones = newZones.filter(z => z.name === pe.childZone)
      newZones = newZones.filter(z => z.name !== pe.childZone)
      delta = pe.childZone.startsWith('O') ? 0 : 1
    } else if (last.type === 'traversa') {
      const te = last as TraversaElem
      removedZones = newZones.filter(z => z.name === te.childZone)
      newZones = newZones.filter(z => z.name !== te.childZone)
      delta = te.childZone.startsWith('O') ? 0 : 1
    } else if (last.type === 'ortogonale') {
      const oe = last as OrtogonaleElem
      removedZones = newZones.filter(z => z.name === oe.innerZone)
      newZones = newZones.filter(z => z.name !== oe.innerZone)
      delta = 0
    }

    setRedoStack(r => [...r, { elem: last, zones: removedZones, delta, scale: drawScale }])
    setElems(elems.slice(0, -1))
    setZones(newZones)
    setNextZoneIdx(Math.max(2, nextZoneIdx - delta))
    setNextElemId(Math.max(1, nextElemId - 1))
  }

  function handleRedo() {
    if (!redoStack.length) return
    const entry = redoStack[redoStack.length - 1]
    setRedoStack(r => r.slice(0, -1))
    setElems(e => [...e, entry.elem])
    setZones(z => [...z, ...entry.zones])
    if (entry.scale !== null) setDrawScale(entry.scale)
    setNextZoneIdx(i => i + entry.delta)
    setNextElemId(i => i + 1)
  }

  function handleReset() {
    setZones([{ name: 'A1', x: 0, y: 0, ...A4[orientation] }])
    setElems([]); setNextZoneIdx(2); setNextElemId(1)
    setDrawScale(null); setRedoStack([]); setBulkUndo(null); setError('')
  }

  // ─── Styles ───────────────────────────────────────────────────────────────────

  const btn: React.CSSProperties = {
    padding: '7px 13px', border: '1px solid #1a3a5c', borderRadius: '5px',
    background: '#1a3a5c', color: '#fff', cursor: 'pointer',
    fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap',
  }
  const btnSec: React.CSSProperties = { ...btn, background: '#fff', color: '#1a3a5c' }
  const btnOn:  React.CSSProperties = { ...btn, background: '#2558a8', border: '1px solid #2558a8' }
  const inp: React.CSSProperties = {
    border: '1px solid #ccc', borderRadius: '4px', padding: '6px 8px',
    fontSize: '13px', width: '100%', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: '11px', color: '#666',
    marginTop: '10px', marginBottom: '2px',
  }

  const scalaLabel = drawScale
    ? `1:${Math.round(1 / drawScale * 10)}`
    : ''

  // ─── PDF export ──────────────────────────────────────────────────────────────

  async function serializeSvgToPng(svgEl: SVGSVGElement): Promise<string> {
    const { width, height } = svgEl.getBoundingClientRect()
    const scale = 3
    // Clona e rimuove le zone label (rosso) prima di serializzare
    const clone = svgEl.cloneNode(true) as SVGSVGElement
    clone.querySelectorAll('[data-zone-label]').forEach(el => el.remove())
    const svgData = new XMLSerializer().serializeToString(clone)
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      canvas.width  = width  * scale
      canvas.height = height * scale
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      img.onload = () => {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = reject
      img.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgData)}`
    })
  }

  async function handleExportPDF() {
    if (!svgRef.current || elems.length === 0) return
    setLoadingPdf(true)
    try {
      const isLandscape = orientation === 'landscape'
      const tW = isLandscape ? 1123 : 794
      const tH = isLandscape ? 794  : 1123

      // Fetch template dal DB
      let templateHtml = ''
      try {
        const res = await fetch(`/api/disegno-template?orientamento=${orientation}`)
        if (res.ok) templateHtml = (await res.json()).html ?? ''
      } catch { /* usa template di fallback */ }

      const pngUrl = await serializeSvgToPng(svgRef.current)

      // Sostituisce placeholder nel template
      const maxImgH = tH - 170
      const titleDiv = titoloPDF.trim()
        ? `<div style="font-size:13px;font-weight:bold;color:#1a3a5c;margin-bottom:10px;">${titoloPDF.trim()}</div>`
        : ''
      const svgImg = `<img src="${pngUrl}" style="max-width:100%;max-height:${maxImgH}px;display:block;border:1px solid #ccc;" />`
      const filled = templateHtml
        .replace('{{titolo}}', titleDiv)
        .replace('{{svg}}',    svgImg)
        .replace('{{data}}',   new Date().toLocaleDateString('it-IT'))
        .replace('{{W}}',      String(tW))
        .replace('{{H}}',      String(tH))

      setPrintPngUrl(pngUrl)
      setPrintTemplateHtml(filled)
      await new Promise(r => setTimeout(r, 180))

      const html2canvas = (await import('html2canvas')).default
      const { jsPDF }   = await import('jspdf')

      const canvas = await html2canvas(printTemplateRef.current!, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: '#ffffff', logging: false,
      })

      const pdf = new jsPDF({ orientation: isLandscape ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' })
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = pdf.internal.pageSize.getHeight()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, pdfH)
      pdf.save('disegno-infisso.pdf')
    } finally {
      setLoadingPdf(false)
      setPrintPngUrl('')
      setPrintTemplateHtml('')
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  const sectionTitle: React.CSSProperties = {
    fontSize: '10px', fontWeight: 'bold', color: '#999',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    marginBottom: '6px', marginTop: '18px',
  }
  const btnFull: React.CSSProperties = { ...btn, width: '100%', textAlign: 'left', marginBottom: '4px' }
  const btnSecFull: React.CSSProperties = { ...btnSec, width: '100%', textAlign: 'left', marginBottom: '4px' }

  // Figli diretti della zona contenitore selezionata nel modal +SottoArea
  const areaDirectChildren: string[] = (() => {
    const dove = aForm.dove.trim().toUpperCase() || 'A1'
    const out: string[] = []
    for (const e of elems) {
      if (e.type === 'area'       && (e as AreaElem).zone === dove)      out.push((e as AreaElem).childZone)
      else if (e.type === 'divisione'  && (e as DivElem).zone === dove)  out.push(...(e as DivElem).childZones)
      else if (e.type === 'split' && (e as SplitElem).zone === dove)     out.push(...(e as SplitElem).childZones)
      else if (e.type === 'pilastrino' && (e as PilastrinoElem).zone === dove) out.push((e as PilastrinoElem).childZone)
      else if (e.type === 'traversa'   && (e as TraversaElem).zone === dove)   out.push((e as TraversaElem).childZone)
    }
    return out
  })()

  return (
    <div style={{ padding: '24px 32px', fontFamily: 'Arial,sans-serif', minHeight: '100vh', background: '#f4f4f6' }}>
      <h2 style={{ fontSize: '18px', color: '#1a3a5c', marginBottom: '20px' }}>Editor Disegno<ShortcutStar href="/disegno" small /></h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── Titolo PDF + bottone export ── */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            value={titoloPDF}
            onChange={e => setTitoloPDF(e.target.value)}
            placeholder="Titolo / descrizione (appare nel PDF sopra il disegno)"
            style={{
              padding: '7px 12px', border: '1px solid #ccc', borderRadius: '6px',
              fontSize: '13px', fontFamily: 'Arial,sans-serif', width: '420px',
            }}
          />
          <button
            onClick={handleExportPDF}
            disabled={loadingPdf || elems.length === 0}
            className="btn-black"
            style={{ opacity: elems.length === 0 ? 0.4 : 1, whiteSpace: 'nowrap', padding: '7px 13px', fontSize: '12px', fontWeight: 'bold' }}
          >
            {loadingPdf ? 'Generazione...' : '⬇ Esporta PDF'}
          </button>
        </div>

        {/* ── Canvas ── */}
        <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
        <div style={{
          background: '#c8cdd8', padding: '24px', borderRadius: '8px',
          display: 'inline-block', boxShadow: '0 3px 14px rgba(0,0,0,0.25)', flexShrink: 0,
        }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${a1.w} ${a1.h}`}
            width={svgW}
            height={svgH}
            style={{ display: 'block', background: '#fff', boxShadow: '0 0 0 1px #aaa' }}
          >
            {(() => {
              // Build per-ortogonale owned-zone sets (propagated through splits/divs/etc.)
              const ortElemZones = new Map<number, Set<string>>()
              for (const e of elems) {
                if (e.type === 'ortogonale') {
                  const oe = e as OrtogonaleElem
                  ortElemZones.set(oe.id, new Set(oe.innerZone ? [oe.innerZone] : []))
                }
              }
              let changed = true
              while (changed) {
                changed = false
                for (const [, owned] of ortElemZones) {
                  for (const e of elems) {
                    const check = (pz: string, children: string[]) => {
                      if (owned.has(pz)) children.forEach(cz => { if (!owned.has(cz)) { owned.add(cz); changed = true } })
                    }
                    if (e.type === 'divisione')  check((e as DivElem).zone, (e as DivElem).childZones)
                    else if (e.type === 'split') check((e as SplitElem).zone, [...(e as SplitElem).childZones])
                    else if (e.type === 'pilastrino') check((e as PilastrinoElem).zone, [(e as PilastrinoElem).childZone])
                    else if (e.type === 'traversa')   check((e as TraversaElem).zone,   [(e as TraversaElem).childZone])
                    else if (e.type === 'telaio' && (e as FrameElem).innerZone) check((e as FrameElem).zone, [(e as FrameElem).innerZone!])
                  }
                }
              }
              const allOrtZones = new Set([...ortElemZones.values()].flatMap(s => [...s]))

              const shapeOf = (e: DrawElem) => {
                if (e.type === 'telaio' || e.type === 'laterale_fisso') return <FrameShape key={e.id} elem={e as FrameElem} sw={sw} />
                if (e.type === 'divisione')  return <DivShape key={e.id} elem={e as DivElem} zones={zones} sw={sw} />
                if (e.type === 'split')      return <SplitShape key={e.id} elem={e as SplitElem} zones={zones} sw={sw} />
                if (e.type === 'pilastrino') return <PilastrinoShape key={e.id} elem={e as PilastrinoElem} zones={zones} sw={sw} />
                if (e.type === 'traversa')   return <TraversaShape key={e.id} elem={e as TraversaElem} zones={zones} sw={sw} />
                if (e.type === 'vetro')      return <VetroShape key={e.id} elem={e as VetroElem} zones={zones} sw={sw} />
                if (e.type === 'pannello')   return <PannelloShape key={e.id} elem={e as PannelloElem} zones={zones} sw={sw} />
                if (e.type === 'anta')       return <AntaShape key={e.id} elem={e as AntaElem} zones={zones} sw={sw} />
                if (e.type === 'vasistas')   return <VasistasShape key={e.id} elem={e as VasistasElem} zones={zones} sw={sw} />
                return null
              }

              const splitZones = new Set([
                ...elems.filter(e => e.type === 'divisione').map(e => (e as DivElem).zone),
                ...elems.filter(e => e.type === 'split').map(e => (e as SplitElem).zone),
                ...elems.filter(e => e.type === 'pilastrino').map(e => (e as PilastrinoElem).zone),
                ...elems.filter(e => e.type === 'traversa').map(e => (e as TraversaElem).zone),
              ])

              return (
                <>
                  {/* Pass 1: elementi regolari non dentro zone ortogonali */}
                  {viewMode !== 'zones' && elems.filter(e => e.type !== 'ortogonale' && !allOrtZones.has(elemZone(e) ?? '')).map(shapeOf)}

                  {/* Pass 2: ogni ortogonale — sfondo parallelogramma + elementi contenuti trasformati */}
                  {elems.filter(e => e.type === 'ortogonale').map((elem, idx) => {
                    const oe = elem as OrtogonaleElem
                    const az = zones.find(z => z.name === oe.zone)
                    const transform = az ? ortMatrix(oe.lato, az) : ''
                    const owned = ortElemZones.get(oe.id) ?? new Set<string>()
                    const contained = elems.filter(e => e.type !== 'ortogonale' && owned.has(elemZone(e) ?? ''))
                    const ownedLabels = viewMode !== 'drawing' ? zones.filter(z => owned.has(z.name) && !splitZones.has(z.name)) : []
                    return (
                      <g key={oe.id}>
                        {viewMode !== 'zones' && <OrtogonaleShape elem={oe} zones={zones} sw={sw} />}
                        {viewMode !== 'zones' && transform && (
                          <g transform={transform}>
                            {contained.map(shapeOf)}
                          </g>
                        )}
                        {ownedLabels.map(z => <ZoneLabel key={`lbl-${z.name}`} zone={z} allZones={zones} sw={sw} />)}
                      </g>
                    )
                  })}

                  {/* Zone labels — escluse O-zone e zone già splittate */}
                  {viewMode !== 'drawing' && zones
                    .filter(z => !splitZones.has(z.name) && !allOrtZones.has(z.name))
                    .map(z => <ZoneLabel key={z.name} zone={z} allZones={zones} sw={sw} />)
                  }
                </>
              )
            })()}
            {elems.length === 0 && (
              <text x={a1.w / 2} y={a1.h / 2} textAnchor="middle" dominantBaseline="middle"
                fontSize={8} fill="#bbb" fontFamily="Arial,sans-serif">
                Aggiungi un telaio per iniziare
              </text>
            )}
          </svg>
          <div style={{ textAlign: 'center', fontSize: '10px', color: '#666', marginTop: '8px' }}>
            Foglio A4 ({a1.w}&#215;{a1.h} mm)
            {scalaLabel && <span style={{ marginLeft: 8, color: '#1a3a5c', fontWeight: 'bold' }}>scala {scalaLabel}</span>}
          </div>
        </div>
        </div>{/* fine scroll wrapper */}

        {/* ── Pannello bottoni ── */}
        <div style={{
          background: '#fff', borderRadius: '8px', padding: '14px 18px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
          display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start',
        }}>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={sectionTitle}>Costruzione</div>
            <button onClick={() => openModal('area')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>+ SottoArea</button>
            <button onClick={() => openModal('ortogonale')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>+ Area Ortogonale</button>
            <button onClick={() => openModal('divisione')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>&#247; Dividi in N SottoAree</button>
            <button onClick={() => openModal('split')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>&#247; Separa SottoArea</button>
            <button onClick={() => openModal('rimuovi_area')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>&#8722; Rimuovi Area</button>
            <button onClick={() => openModal('unisci_aree')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>+ Unisci Aree</button>
            <button onClick={() => openModal('telaio')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>+ Telaio</button>
            <button onClick={() => openModal('pilastrino')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>+ Pilastrino</button>
            <button onClick={() => openModal('traversa')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>+ Traversa</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={sectionTitle}>&nbsp;</div>
            <button onClick={() => openModal('anta')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>+ Anta Battente</button>
            <button onClick={() => openModal('laterale_fisso')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>+ Anta Fissa</button>
            <button onClick={() => openModal('vasistas')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>+ Vasistas</button>
            <button onClick={() => openModal('vetro')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>+ Vetro</button>
            <button onClick={() => openModal('pannello')} className="btn-black" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>+ Pannello</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={sectionTitle}>Modifica</div>
            <button onClick={handleUndo} className="btn-red" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px', opacity: (elems.length || bulkUndo) ? 1 : 0.4 }} disabled={!elems.length && !bulkUndo}>
              &#8617; Annulla
            </button>
            <button onClick={handleRedo} className="btn-green" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px', opacity: redoStack.length ? 1 : 0.4 }} disabled={!redoStack.length}>
              &#8618; Ripristina
            </button>
            <button onClick={handleReset} className="btn-red" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>
              &#215; Reset
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={sectionTitle}>Visualizza</div>
            <button onClick={() => setViewMode(m => m === 'all' ? 'drawing' : m === 'drawing' ? 'zones' : 'all')} className="btn-blue" style={{ width: '100%', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}>
              {viewMode === 'all' ? 'Disegno + Zone' : viewMode === 'drawing' ? 'Solo Disegno' : 'Solo Zone'}
            </button>
            <button
              onClick={() => changeOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
              className="btn-blue"
              style={{ minWidth: '160px', textAlign: 'left', marginBottom: '4px', padding: '7px 13px', fontSize: '12px' }}
            >
              {orientation === 'portrait' ? '↔ Passa a Orizzontale' : '↕ Passa a Verticale'}
            </button>
          </div>
        </div>

      </div>

      {/* Modals */}
      {modal !== 'none' && (
        <div
          onMouseDown={e => { if (e.target === e.currentTarget) { setModal('none'); setError('') } }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.48)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onMouseDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
            style={{
              background: '#fff', padding: '28px 28px 24px', borderRadius: '10px',
              width: '340px', boxShadow: '0 6px 28px rgba(0,0,0,0.3)',
            }}
          >

            {modal === 'area' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>+ SottoArea</h3>
                <label style={lbl}>Zona contenitore</label>
                <SelectLookup style={inp} value={aForm.dove}
                  onChange={newDove => {
                    const colonIdx = aForm.modo.indexOf(':')
                    if (colonIdx !== -1) {
                      const rifName = aForm.modo.slice(colonIdx + 1)
                      const newDc: string[] = []
                      for (const el of elems) {
                        if (el.type === 'divisione'  && (el as DivElem).zone === newDove)       newDc.push(...(el as DivElem).childZones)
                        else if (el.type === 'split' && (el as SplitElem).zone === newDove)     newDc.push(...(el as SplitElem).childZones)
                        else if (el.type === 'pilastrino' && (el as PilastrinoElem).zone === newDove) newDc.push((el as PilastrinoElem).childZone)
                        else if (el.type === 'traversa'   && (el as TraversaElem).zone === newDove)   newDc.push((el as TraversaElem).childZone)
                      }
                      if (!newDc.includes(rifName)) {
                        setAForm(f => ({ ...f, dove: newDove, modo: 'center' }))
                        return
                      }
                    }
                    setAForm(f => ({ ...f, dove: newDove }))
                  }}
                  options={zones.map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <label style={lbl}>Ancoraggio</label>
                <SelectLookup style={inp} value={aForm.modo}
                  onChange={v => setAForm(f => ({ ...f, modo: v }))}
                  options={[
                    { value: 'center', label: 'Centrato' },
                    { value: 'coords', label: 'Da coordinate (x cm, y cm)' },
                    ...areaDirectChildren.flatMap(ch => [
                      { value: `sopra:${ch}`, label: `Sopra ${ch}` },
                      { value: `sotto:${ch}`, label: `Sotto ${ch}` },
                      { value: `sinistra:${ch}`, label: `A sinistra di ${ch}` },
                      { value: `destra:${ch}`, label: `A destra di ${ch}` },
                    ]),
                  ]} />
                {aForm.modo === 'coords' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={lbl}>X offset (cm)</label>
                      <input style={inp} type="number" value={aForm.ox}
                        onChange={e => setAForm(f => ({ ...f, ox: e.target.value }))} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={lbl}>Y offset (cm)</label>
                      <input style={inp} type="number" value={aForm.oy}
                        onChange={e => setAForm(f => ({ ...f, oy: e.target.value }))} />
                    </div>
                  </div>
                )}
                {(() => {
                  const isRelativo = aForm.modo.includes(':')
                  const isVert = aForm.modo.startsWith('sopra') || aForm.modo.startsWith('sotto')
                  if (!isRelativo) return (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={lbl}>Larghezza L (cm)</label>
                        <input style={inp} type="number" value={aForm.l}
                          onChange={e => setAForm(f => ({ ...f, l: e.target.value }))} placeholder="es. 40" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={lbl}>Altezza H (cm)</label>
                        <input style={inp} type="number" value={aForm.h}
                          onChange={e => setAForm(f => ({ ...f, h: e.target.value }))} placeholder="es. 20" />
                      </div>
                    </div>
                  )
                  if (isVert) return (
                    <div>
                      <label style={lbl}>Altezza H (cm)</label>
                      <input style={inp} type="number" value={aForm.h}
                        onChange={e => setAForm(f => ({ ...f, h: e.target.value }))} placeholder="es. 20" />
                    </div>
                  )
                  return (
                    <div>
                      <label style={lbl}>Larghezza L (cm)</label>
                      <input style={inp} type="number" value={aForm.l}
                        onChange={e => setAForm(f => ({ ...f, l: e.target.value }))} placeholder="es. 40" />
                    </div>
                  )
                })()}
                <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', lineHeight: 1.5 }}>
                  Crea una zona costruttiva (bordo rosso tratteggiato). Sparisce al rendering finale.
                </p>
              </>
            )}

            {modal === 'telaio' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>Aggiungi Telaio</h3>
                <label style={lbl}>Zona (dove)</label>
                <SelectLookup style={inp} value={tForm.dove}
                  onChange={v => setTForm(f => ({ ...f, dove: v }))}
                  options={zones.map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <label style={lbl}>Modo posizionamento</label>
                <SelectLookup style={inp} value={tForm.modo}
                  onChange={v => setTForm(f => ({ ...f, modo: v as 'centrato' | 'coords' | 'esteso' }))}
                  options={[{ value: 'centrato', label: 'Centrato' }, { value: 'coords', label: 'Da coordinate [x, y]' }, { value: 'esteso', label: 'Esteso (copre tutta la zona)' }]} />
                {tForm.modo === 'coords' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={lbl}>X offset (cm)</label>
                      <input style={inp} type="number" value={tForm.ox}
                        onChange={e => setTForm(f => ({ ...f, ox: e.target.value }))} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={lbl}>Y offset (cm)</label>
                      <input style={inp} type="number" value={tForm.oy}
                        onChange={e => setTForm(f => ({ ...f, oy: e.target.value }))} />
                    </div>
                  </div>
                )}
                {tForm.modo !== 'esteso' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={lbl}>Altezza H (cm)</label>
                      <input style={inp} type="number" value={tForm.h}
                        onChange={e => setTForm(f => ({ ...f, h: e.target.value }))} placeholder="es. 200" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={lbl}>Larghezza L (cm)</label>
                      <input style={inp} type="number" value={tForm.l}
                        onChange={e => setTForm(f => ({ ...f, l: e.target.value }))} placeholder="es. 130" />
                    </div>
                  </div>
                )}
                <label style={lbl}>Spessore profilo (mm)</label>
                <input style={inp} type="number" value={tForm.spessore}
                  onChange={e => setTForm(f => ({ ...f, spessore: e.target.value }))} placeholder="es. 70" />
                <label style={lbl}>Tipo apertura</label>
                <SelectLookup style={inp} value={tForm.aperto ? 'aperto' : 'chiuso'}
                  onChange={v => setTForm(f => ({ ...f, aperto: v === 'aperto' }))}
                  options={[{ value: 'chiuso', label: 'Chiuso (fisso)' }, { value: 'aperto', label: 'Aperto (apribile)' }]} />
              </>
            )}

            {modal === 'divisione' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>Dividi in parti uguali</h3>
                <label style={lbl}>Zona da dividere</label>
                <SelectLookup style={inp} value={dForm.zona}
                  onChange={v => setDForm(f => ({ ...f, zona: v }))}
                  options={zones.map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <label style={lbl}>Orientamento</label>
                <SelectLookup style={inp} value={dForm.orientamento}
                  onChange={v => setDForm(f => ({ ...f, orientamento: v as 'verticale' | 'orizzontale' }))}
                  options={[{ value: 'verticale', label: 'Verticale (divide in colonne)' }, { value: 'orizzontale', label: 'Orizzontale (divide in righe)' }]} />
                <label style={lbl}>Numero di aree</label>
                <input style={inp} type="number" min="2" max="10" value={dForm.nAree}
                  onChange={e => setDForm(f => ({ ...f, nAree: e.target.value }))} placeholder="es. 2" />
                <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', lineHeight: 1.5 }}>
                  Crea N zone uguali dentro la zona indicata.
                </p>
              </>
            )}

            {modal === 'split' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>Dividi Area</h3>
                <label style={lbl}>Zona da dividere</label>
                <SelectLookup style={inp} value={sForm.zona}
                  onChange={v => setSForm(f => ({ ...f, zona: v }))}
                  options={zones.map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <label style={lbl}>Orientamento taglio</label>
                <SelectLookup style={inp} value={sForm.orientamento}
                  onChange={v => setSForm(f => ({ ...f, orientamento: v as 'verticale' | 'orizzontale' }))}
                  options={[{ value: 'verticale', label: 'Verticale (taglia in larghezza)' }, { value: 'orizzontale', label: 'Orizzontale (taglia in altezza)' }]} />
                <label style={lbl}>
                  {sForm.orientamento === 'verticale' ? 'Distanza dal bordo sinistro (cm)' : 'Distanza dal bordo superiore (cm)'}
                </label>
                <input style={inp} type="number" value={sForm.distanza}
                  onChange={e => setSForm(f => ({ ...f, distanza: e.target.value }))}
                  placeholder="es. 30" />
                <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', lineHeight: 1.5 }}>
                  Crea due aree: la prima fino alla distanza indicata, la seconda occupa il resto.
                </p>
              </>
            )}

            {modal === 'anta' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>+ Anta</h3>
                <label style={lbl}>Zona</label>
                <SelectLookup style={inp} value={antaForm.zona}
                  onChange={v => setAntaForm(f => ({ ...f, zona: v }))}
                  options={zones.map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <label style={lbl}>Lato cerniere</label>
                <SelectLookup style={inp} value={antaForm.lato}
                  onChange={v => setAntaForm(f => ({ ...f, lato: v as 'sinistra' | 'destra' }))}
                  options={[{ value: 'sinistra', label: 'Sinistra' }, { value: 'destra', label: 'Destra' }]} />
                <label style={lbl}>Numero cerniere</label>
                <input style={inp} type="number" min="1" max="10" value={antaForm.nCerniere}
                  onChange={e => setAntaForm(f => ({ ...f, nCerniere: e.target.value }))}
                  placeholder="es. 3" />
                <label style={lbl}>Spessore profilo (mm)</label>
                <input style={inp} type="number" value={antaForm.spessore}
                  onChange={e => setAntaForm(f => ({ ...f, spessore: e.target.value }))}
                  placeholder="es. 70" />
                <label style={lbl}>Maniglia</label>
                <SelectLookup style={inp} value={antaForm.maniglia ? 'si' : 'no'}
                  onChange={v => setAntaForm(f => ({ ...f, maniglia: v === 'si' }))}
                  options={[{ value: 'no', label: 'No' }, { value: 'si', label: 'Sì' }]} />
              </>
            )}

            {modal === 'vasistas' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>+ Vasistas</h3>
                <label style={lbl}>Zona</label>
                <SelectLookup style={inp} value={vasForm.zona}
                  onChange={v => setVasForm(f => ({ ...f, zona: v }))}
                  options={zones.map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <label style={lbl}>Numero cerniere</label>
                <input style={inp} type="number" min="1" max="10" value={vasForm.nCerniere}
                  onChange={e => setVasForm(f => ({ ...f, nCerniere: e.target.value }))}
                  placeholder="es. 2" />
                <label style={lbl}>Spessore profilo (mm)</label>
                <input style={inp} type="number" value={vasForm.spessore}
                  onChange={e => setVasForm(f => ({ ...f, spessore: e.target.value }))}
                  placeholder="es. 70" />
                <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', lineHeight: 1.5 }}>
                  Cerniere sul bordo inferiore. Maniglia sempre presente in alto al centro.
                </p>
              </>
            )}

            {modal === 'vetro' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>+ Vetro</h3>
                <label style={lbl}>Zona</label>
                <SelectLookup style={inp} value={vForm.zona}
                  onChange={v => setVForm({ zona: v })}
                  options={zones.map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
              </>
            )}

            {modal === 'pannello' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>+ Pannello</h3>
                <label style={lbl}>Zona</label>
                <SelectLookup style={inp} value={pnForm.zona}
                  onChange={v => setPnForm({ zona: v })}
                  options={zones.map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', lineHeight: 1.5 }}>
                  Pannello oscurante (colore beige). Nessuna trasparenza.
                </p>
              </>
            )}

            {modal === 'ortogonale' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>+ Area Ortogonale</h3>
                <label style={lbl}>Zona di ancoraggio</label>
                <SelectLookup style={inp} value={ortForm.zona}
                  onChange={v => setOrtForm(f => ({ ...f, zona: v }))}
                  options={zones.map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <label style={lbl}>Lato di ancoraggio</label>
                <SelectLookup style={inp} value={ortForm.lato}
                  onChange={v => setOrtForm(f => ({ ...f, lato: v as 'sinistra' | 'destra' | 'alto' | 'basso' }))}
                  options={[{ value: 'destra', label: 'Destra' }, { value: 'sinistra', label: 'Sinistra' }, { value: 'alto', label: 'Alto' }, { value: 'basso', label: 'Basso' }]} />
                <label style={lbl}>Larghezza (cm)</label>
                <input style={inp} type="number" value={ortForm.larghezza}
                  onChange={e => setOrtForm(f => ({ ...f, larghezza: e.target.value }))}
                  placeholder="es. 30" />
                <label style={lbl}>Spessore (mm)</label>
                <input style={inp} type="number" value={ortForm.spessore}
                  onChange={e => setOrtForm(f => ({ ...f, spessore: e.target.value }))}
                  placeholder="es. 70" />
                <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', lineHeight: 1.5 }}>
                  Due parallelogrammi: cap spessore (grigio, coprente) + faccia Ox (crema, in primo piano).
                </p>
              </>
            )}

            {modal === 'rimuovi_area' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>Rimuovi Area</h3>
                <label style={lbl}>Zona da rimuovere</label>
                <SelectLookup style={inp} value={raForm.zona}
                  onChange={v => setRaForm({ zona: v })}
                  options={zones.filter(z => z.name !== 'A1').map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', lineHeight: 1.5 }}>
                  Rimuove la zona selezionata e tutti gli elementi di disegno al suo interno (ricorsivo). Azione irreversibile.
                </p>
              </>
            )}

            {modal === 'unisci_aree' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>+ Unisci Aree</h3>
                <label style={lbl}>Prima zona</label>
                <SelectLookup style={inp} value={uForm.zona1}
                  onChange={v => setUForm(f => ({ ...f, zona1: v }))}
                  options={zones.filter(z => z.name !== 'A1').map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <label style={lbl}>Seconda zona</label>
                <SelectLookup style={inp} value={uForm.zona2}
                  onChange={v => setUForm(f => ({ ...f, zona2: v }))}
                  options={zones.filter(z => z.name !== 'A1').map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', lineHeight: 1.5 }}>
                  Le due zone devono essere vuote (nessun figlio né disegno) e condividere un lato intero.
                  Il risultato mantiene il nome della prima zona.
                </p>
              </>
            )}

            {modal === 'traversa' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>+ Traversa</h3>
                <label style={lbl}>Zona</label>
                <SelectLookup style={inp} value={trForm.zona}
                  onChange={v => setTrForm(f => ({ ...f, zona: v }))}
                  options={zones.map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <label style={lbl}>Lato di appoggio</label>
                <SelectLookup style={inp} value={trForm.lato}
                  onChange={v => setTrForm(f => ({ ...f, lato: v as 'alto' | 'basso' }))}
                  options={[{ value: 'alto', label: 'Alto' }, { value: 'basso', label: 'Basso' }]} />
                <label style={lbl}>Spessore (mm)</label>
                <input style={inp} type="number" value={trForm.spessore}
                  onChange={e => setTrForm(f => ({ ...f, spessore: e.target.value }))}
                  placeholder="es. 70" />
                <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', lineHeight: 1.5 }}>
                  Barra orizzontale sul lato indicato. La parte rimanente diventa la nuova area.
                </p>
              </>
            )}

            {modal === 'pilastrino' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>Aggiungi Pilastrino</h3>
                <label style={lbl}>Zona</label>
                <SelectLookup style={inp} value={pForm.zona}
                  onChange={v => setPForm(f => ({ ...f, zona: v }))}
                  options={zones.map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <label style={lbl}>Lato di appoggio</label>
                <SelectLookup style={inp} value={pForm.lato}
                  onChange={v => setPForm(f => ({ ...f, lato: v as 'sinistra' | 'destra' }))}
                  options={[{ value: 'sinistra', label: 'Sinistra' }, { value: 'destra', label: 'Destra' }]} />
                <label style={lbl}>Spessore (mm)</label>
                <input style={inp} type="number" value={pForm.spessore}
                  onChange={e => setPForm(f => ({ ...f, spessore: e.target.value }))}
                  placeholder="es. 70" />
                <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', lineHeight: 1.5 }}>
                  Barra verticale sul lato indicato. La parte rimanente diventa la nuova area.
                </p>
              </>
            )}

            {modal === 'laterale_fisso' && (
              <>
                <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a3a5c' }}>Laterale Fisso</h3>
                <label style={lbl}>Zona</label>
                <SelectLookup style={inp} value={fForm.zona}
                  onChange={v => setFForm(f => ({ ...f, zona: v }))}
                  options={zones.map(z => ({ value: z.name, label: zoneDimLabel(z) }))} />
                <label style={lbl}>Spessore profilo (mm)</label>
                <input style={inp} type="number" value={fForm.spessore}
                  onChange={e => setFForm(f => ({ ...f, spessore: e.target.value }))} placeholder="es. 70" />
                <p style={{ fontSize: '11px', color: '#888', marginTop: '8px', lineHeight: 1.5 }}>
                  Modalità esteso — copre tutta la zona con profilo + vetro. Nessuna cerniera.
                </p>
              </>
            )}

            {error && (
              <p style={{ color: '#b00', fontSize: '12px', marginTop: '10px', marginBottom: 0 }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setModal('none'); setError('') }} className="btn-red" style={{ padding: '7px 16px', fontSize: '12px' }}>Annulla</button>
              <button
                onClick={modal === 'area' ? handleAddArea : modal === 'telaio' ? handleAddTelaio : modal === 'divisione' ? handleDivide : modal === 'split' ? handleSplit : modal === 'pilastrino' ? handleAddPilastrino : modal === 'traversa' ? handleAddTraversa : modal === 'vetro' ? handleAddVetro : modal === 'pannello' ? handleAddPannello : modal === 'anta' ? handleAddAnta : modal === 'vasistas' ? handleAddVasistas : modal === 'ortogonale' ? handleAddOrtogonale : modal === 'rimuovi_area' ? handleRimuoviArea : modal === 'unisci_aree' ? handleUnisciAree : handleAddFisso}
                className="btn-green"
                style={{ padding: '7px 16px', fontSize: '12px' }}
              >{modal === 'rimuovi_area' ? 'Rimuovi' : modal === 'unisci_aree' ? 'Unisci' : 'Aggiungi'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Template stampa A4 (off-screen, montato solo durante export PDF) ── */}
      {printPngUrl && (() => {
        const isLandscape = orientation === 'landscape'
        const tW = isLandscape ? 1123 : 794
        const tH = isLandscape ? 794  : 1123

        // Se c'è un template dal DB usa dangerouslySetInnerHTML, altrimenti fallback hardcoded
        if (printTemplateHtml) {
          return (
            <div ref={printTemplateRef} style={{
              position: 'fixed', top: '-9999px', left: '-9999px',
              width: `${tW}px`, height: `${tH}px`,
            }} dangerouslySetInnerHTML={{ __html: printTemplateHtml }} />
          )
        }

        const maxImgH = tH - 170
        return (
          <div ref={printTemplateRef} style={{
            position: 'fixed', top: '-9999px', left: '-9999px',
            width: `${tW}px`, height: `${tH}px`,
            background: '#fff', fontFamily: 'Arial,Helvetica,sans-serif',
            padding: '36px 44px 50px', boxSizing: 'border-box', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/header/DIGIHOMEDESIGN.webp" alt="Logo" style={{ height: '40px', display: 'block' }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/volantino/nome_tr.webp" alt="" style={{ height: '40px', display: 'block' }} />
            </div>
            <hr style={{ border: 'none', borderTop: '2px solid #1a3a5c', margin: '0 0 10px' }} />
            <div style={{ textAlign: 'right', fontSize: '10px', color: '#666', marginBottom: '8px' }}>{new Date().toLocaleDateString('it-IT')}</div>
            {titoloPDF.trim() && (
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a3a5c', marginBottom: '10px' }}>{titoloPDF.trim()}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={printPngUrl} alt="Disegno" style={{ maxWidth: '100%', maxHeight: `${maxImgH}px`, display: 'block', border: '1px solid #ccc' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '16px', left: '44px', right: '44px', borderTop: '1px solid #ddd', paddingTop: '5px', fontSize: '8px', color: '#aaa' }}>
              Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com
            </div>
          </div>
        )
      })()}
    </div>
  )
}
