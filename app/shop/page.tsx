import Link from 'next/link'
import type { Metadata } from 'next'
import { getConnection } from '@/lib/db'
import { ensureShopPercorsiTables } from '@/lib/shop-percorsi'
import { getCategorieTopLevel } from '@/lib/categorie-percorsi'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { CategoryTile, CATEGORY_TILE_WIDTH } from '@/components/category-tile'
import { readSettings } from '@/lib/settings'
import { getStandaloneNeighbors } from '@/lib/nav-config'
import NavDropdownTriggerButton from '@/components/nav-dropdown-trigger-button'

export const metadata: Metadata = {
  title: 'Shop On Line',
  description: 'Acquista online: articoli disponibili organizzati per categoria.',
  alternates: { canonical: 'https://www.digi-home-design.com/shop' },
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getStandaloneNeighbors(41, disabledPages)
  const db = await getConnection()
  let categorie: Awaited<ReturnType<typeof getCategorieTopLevel>>
  try {
    await ensureShopPercorsiTables(db)
    categorie = await getCategorieTopLevel(db, 'shop_percorsi')
  } finally {
    await db.end()
  }

  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Shop On Line<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>Shop On Line</h1>
      <p className="testo-articoli" style={{ marginBottom: 16 }}>
        Scegli una categoria per vedere i prodotti acquistabili.
      </p>

      {categorie.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 16px', textAlign: 'center' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Nessuna categoria disponibile al momento.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, ${CATEGORY_TILE_WIDTH}px)`, gap: 12, marginBottom: 8 }}>
          {categorie.map(c => (
            <CategoryTile key={c.slug} href={`/shop/${c.slug}`} nome={c.nome} numArticoli={c.numArticoli} immagine={c.immagine} />
          ))}
        </div>
      )}

      <StickyBottomBarContent>
        <Link href="/" className="btn-black fs-12">← Home</Link>
        {prev ? <Link href={prev.href} className="btn-gold fs-12">← {prev.label}</Link> : <NavDropdownTriggerButton dropdownId="ristrutturazioni" label="← Ristrutturazioni Chiavi in Mano" />}
        {next && <Link href={next.href} className="btn-gold fs-12">{next.label} →</Link>}
      </StickyBottomBarContent>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo indice shop</p>
    </div>
  )
}
