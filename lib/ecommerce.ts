export type ArticoloEcommerce = {
  id: number
  categoria: string
  descrizione: string
  produttore: string
  serie?: string | null
  unita: string
  prezzo_vendita: number
  prezzo_promo?: number | null
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
