import Link from 'next/link'
import type { Metadata } from 'next'
import { getConnection } from '@/lib/db'
import { ensurePromoTables } from '@/lib/promo'
import { getCategorieTopLevel } from '@/lib/categorie-percorsi'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { CategoryTile, CATEGORY_TILE_WIDTH } from '@/components/category-tile'
import { readSettings } from '@/lib/settings'
import { getStandaloneNeighbors } from '@/lib/nav-config'

export const metadata: Metadata = {
  title: 'Promozioni',
  description: 'Le nostre promozioni in corso: articoli e categorie in offerta.',
  alternates: { canonical: 'https://www.digi-home-design.com/promozioni' },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getStandaloneNeighbors(42, disabledPages)
  const db = await getConnection()
  let categorie: Awaited<ReturnType<typeof getCategorieTopLevel>>
  try {
    await ensurePromoTables(db)
    categorie = await getCategorieTopLevel(db, 'promo_percorsi')
  } finally {
    await db.end()
  }

  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Promozioni<ShortcutStar />
      </p>
      {categorie.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 16px', textAlign: 'center' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Nessuna promozione attiva al momento.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, ${CATEGORY_TILE_WIDTH}px)`, gap: 12, marginBottom: 8 }}>
          {categorie.map(c => (
            <CategoryTile key={c.slug} href={`/promozioni/${c.slug}`} nome={c.nome} numArticoli={c.numArticoli} suffisso=" in promozione" immagine={c.immagine} />
          ))}
        </div>
      )}

      <StickyBottomBarContent>
        <Link href="/" className="btn-black fs-12">← Home</Link>
        {prev && <Link href={prev.href} className="btn-gold fs-12">← {prev.label}</Link>}
        {next && <Link href={next.href} className="btn-gold fs-12">{next.label} →</Link>}
      </StickyBottomBarContent>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo indice promozioni</p>
    </div>
  )
}
