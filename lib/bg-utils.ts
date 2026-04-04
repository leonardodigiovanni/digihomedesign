/** Funzioni pure per calcolare sfondi RGB-dinamici (usabili server e client) */

function hex2(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
}

function darken(r: number, g: number, b: number, f: number): string {
  return `#${hex2(r * f)}${hex2(g * f)}${hex2(b * f)}`
}

function lighten(r: number, g: number, b: number, t: number): string {
  return `#${hex2(r + (255 - r) * t)}${hex2(g + (255 - g) * t)}${hex2(b + (255 - b) * t)}`
}

/** Gradiente metallico a partire da r,g,b */
export function rgbGradient(r: number, g: number, b: number): string {
  const dark   = darken(r, g, b, 0.40)
  const mid    = darken(r, g, b, 0.68)
  const base   = `#${hex2(r)}${hex2(g)}${hex2(b)}`
  const light  = lighten(r, g, b, 0.50)
  const vLight = lighten(r, g, b, 0.85)
  return `linear-gradient(135deg, ${dark} 0%, ${mid} 18%, ${base} 35%, ${light} 45%, ${vLight} 50%, ${light} 55%, ${base} 65%, ${mid} 82%, ${dark} 100%)`
}

/** Gradiente metallico invertito (chiaro→scuro→chiaro) */
export function rgbGradientInv(r: number, g: number, b: number): string {
  const dark   = darken(r, g, b, 0.40)
  const mid    = darken(r, g, b, 0.68)
  const base   = `#${hex2(r)}${hex2(g)}${hex2(b)}`
  const light  = lighten(r, g, b, 0.50)
  const vLight = lighten(r, g, b, 0.85)
  return `linear-gradient(135deg, ${vLight} 0%, ${light} 18%, ${base} 35%, ${mid} 45%, ${dark} 50%, ${mid} 55%, ${base} 65%, ${light} 82%, ${vLight} 100%)`
}

/** Gradiente con texture spazzolata (per effetto C) */
export function rgbBrushedBackground(r: number, g: number, b: number): string {
  return [
    'repeating-linear-gradient(60deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 6px)',
    rgbGradient(r, g, b),
  ].join(', ')
}

/** Gradiente spazzolato invertito (per effetto C inv) */
export function rgbBrushedBackgroundInv(r: number, g: number, b: number): string {
  return [
    'repeating-linear-gradient(60deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 6px)',
    rgbGradientInv(r, g, b),
  ].join(', ')
}

/** Box-shadow per effetti RGB */
export function rgbBoxShadow(r: number, g: number, b: number): string {
  return `0 4px 24px rgba(${r},${g},${b},0.4), inset 0 1px 0 rgba(255,255,255,0.5)`
}

/** Border color (versione scura del colore base) */
export function rgbBorderColor(r: number, g: number, b: number): string {
  return darken(r, g, b, 0.6)
}

/** Luminanza percepita [0..1] */
export function rgbLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

/** Colori testo ottimali in base alla luminanza del colore scelto */
export function rgbTextColors(r: number, g: number, b: number) {
  const isLight = rgbLuminance(r, g, b) > 0.55
  return {
    label: isLight ? '#111' : '#fff',
    value: isLight ? '#444' : '#ddd',
    title: isLight ? '#000' : '#fff',
    sep:   isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)',
  }
}
