/** Funzioni pure per calcolare sfondi RGB-dinamici (usabili server e client) */

function hex2(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
}

function darken(r: number, g: number, b: number, f: number): string {
  return `#${hex2(r * f)}${hex2(g * f)}${hex2(b * f)}`
}

/** Tinta piatta a partire da r,g,b (nessun gradiente, nessuna spazzolatura) */
function flat(r: number, g: number, b: number): string {
  return `#${hex2(r)}${hex2(g)}${hex2(b)}`
}

/** @deprecated tinta piatta, mantenuta per compatibilità firma */
export function rgbGradient(r: number, g: number, b: number): string {
  return flat(r, g, b)
}

/** @deprecated tinta piatta, mantenuta per compatibilità firma */
export function rgbGradientInv(r: number, g: number, b: number): string {
  return flat(r, g, b)
}

/** @deprecated tinta piatta, mantenuta per compatibilità firma */
export function rgbBrushedBackground(r: number, g: number, b: number): string {
  return flat(r, g, b)
}

/** @deprecated tinta piatta, mantenuta per compatibilità firma */
export function rgbBrushedBackgroundInv(r: number, g: number, b: number): string {
  return flat(r, g, b)
}

/** @deprecated tinta piatta, mantenuta per compatibilità firma */
export function rgbGradientDark(r: number, g: number, b: number): string {
  return flat(r, g, b)
}

/** @deprecated tinta piatta, mantenuta per compatibilità firma */
export function rgbGradientDarkInv(r: number, g: number, b: number): string {
  return flat(r, g, b)
}

/** @deprecated tinta piatta, mantenuta per compatibilità firma */
export function rgbBrushedBackgroundDark(r: number, g: number, b: number): string {
  return flat(r, g, b)
}

/** @deprecated tinta piatta, mantenuta per compatibilità firma */
export function rgbBrushedBackgroundDarkInv(r: number, g: number, b: number): string {
  return flat(r, g, b)
}

/** Box-shadow per effetti RGB — solo ombra esterna, nessun lucido inset */
export function rgbBoxShadow(r: number, g: number, b: number): string {
  return `0 4px 24px rgba(${r},${g},${b},0.4)`
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
