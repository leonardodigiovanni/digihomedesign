export type ArticoloEcommerce = {
  id: number
  categoria: string
  descrizione: string
  produttore: string
  serie?: string | null
  unita: string
  prezzo_vendita: number
  max_acquistabile: number | null
  foto_url: string | null
  richiede_tipo_colore: number
}

export type UnitaMode = 'pz' | 'kg' | 't' | 'ml' | 'mq'

export function getUnitaMode(unita: string): UnitaMode {
  const u = unita.toLowerCase()
  if (u === 'kg') return 'kg'
  if (u === 't') return 't'
  if (u === 'ml' || u === 'm' || u === 'mt') return 'ml'
  if (u === 'm²' || u === 'mq' || u === 'm2') return 'mq'
  return 'pz'
}

export function formatPrezzo(a: ArticoloEcommerce): string {
  if (!a.prezzo_vendita) return ''
  const unitaLabel = getUnitaMode(a.unita) === 'pz' ? '' : ` al ${a.unita}`
  return `€ ${Number(a.prezzo_vendita).toFixed(2)}${unitaLabel}`
}

export function toEcommerceSlug(categoria: string): string {
  return categoria
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Macro-sezioni dello shop (hub /shop). Per ora unica sezione "arredi" che
// raggruppa tutti i prodotti acquistabili — la vera categorizzazione (per reparto,
// offerte, combo, ecc.) va ancora decisa e sarà rivista.
export type MacroSezione = { slug: string; nome: string; descrizione: string }

export const ECOMMERCE_MACRO_SEZIONI: MacroSezione[] = [
  { slug: 'arredi', nome: 'Arredi', descrizione: 'Quadri, divani e complementi d\'arredo pronti per essere spediti a casa tua.' },
]

export function getMacroSezione(slug: string): MacroSezione | undefined {
  return ECOMMERCE_MACRO_SEZIONI.find(m => m.slug === slug)
}
