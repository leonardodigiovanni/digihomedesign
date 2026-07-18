/** "/brand/cataloghi" → "Cataloghi"; "/metallurgia/porte-blindate" → "Porte Blindate" */
export function nameFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const last = segments[segments.length - 1] ?? ''
  const words = last.split('-').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1))
  return words.join(' ')
}

/** "/brand/cataloghi" → "Vai a Cataloghi" */
export function labelFromPathname(pathname: string): string {
  return `Vai a ${nameFromPathname(pathname)}`
}
