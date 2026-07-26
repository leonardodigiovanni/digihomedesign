'use client'

import type { CategoriaCard } from './page'
import { CategoryTile, CATEGORY_TILE_WIDTH } from '@/components/category-tile'

export function CatalogoGrid({ categorie, basePath = '/cataloghi' }: { categorie: CategoriaCard[]; basePath?: string; isApp?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, ${CATEGORY_TILE_WIDTH}px)`, gap: 12, marginBottom: 12, padding: '0 4px' }}>
      {categorie.map(c => (
        <CategoryTile key={c.id} href={`${basePath}/${c.slug}`} nome={c.nome} immagine={c.immagine} />
      ))}
    </div>
  )
}
