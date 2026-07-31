import Link from 'next/link'

// Immagine mostrata quando la coppia categoria/sottocategoria non ha ancora
// un'immagine associata in "Immagini categorie e promo" (amministrazione).
export const CATEGORY_TILE_PLACEHOLDER = '/images/manutenzione/sito_manutenzione.webp'

export const CATEGORY_TILE_WIDTH = 220

export function CategoryTile({ href, nome, numArticoli, unita = ['articolo', 'articoli'], suffisso = '', immagine }: { href: string; nome: string; numArticoli?: number; unita?: [string, string]; suffisso?: string; immagine?: string | null }) {
  return (
    <Link href={href} style={{
      width: CATEGORY_TILE_WIDTH, display: 'flex', flexDirection: 'column',
      background: '#fff', border: '1px solid #e3e3e3', borderRadius: 8,
      overflow: 'hidden', textDecoration: 'none', color: '#1a1a1a',
    }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#f7f7f7' }}>
        {/* Immagine caricata dall'admin (blob remoto) o placeholder locale: <img> semplice,
            non next/image, stessa convenzione già usata per foto_url in ProductCard. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={immagine || CATEGORY_TILE_PLACEHOLDER} alt={nome} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, color: '#0f1111' }}>{nome}</span>
        {numArticoli != null && (
          <span style={{ fontSize: 12, color: '#888' }}>{numArticoli} {numArticoli === 1 ? unita[0] : unita[1]}{suffisso}</span>
        )}
      </div>
    </Link>
  )
}
