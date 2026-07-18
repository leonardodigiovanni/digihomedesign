// Pagine escluse in blocco dal sistema scorciatoie (stellina, doppio click,
// popup dopo 2 minuti): qualunque pagina con uno di questi segmenti nell'URL,
// presenti o future — non solo le 3 note oggi. Basta il segmento giusto nel
// path, non serve enumerare ogni singola pagina.
const EXCLUDED_SEGMENTS = ['stampa', 'task', 'pagamento']

export function isExcludedFromShortcuts(pathname: string): boolean {
  const pathOnly = pathname.split('?')[0]
  const segments = pathOnly.split('/').filter(Boolean)
  return segments.some(s => EXCLUDED_SEGMENTS.includes(s.toLowerCase()))
}
