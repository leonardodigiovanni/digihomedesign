import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { ensureShopPercorsiTables } from '@/lib/shop-percorsi'
import { resolveCategoria, getSottocategorie } from '@/lib/categorie-percorsi'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { CategoryTile, CATEGORY_TILE_WIDTH } from '@/components/category-tile'

type Props = { params: Promise<{ categoria: string }> }

async function getDati(slug: string) {
  const db = await getConnection()
  try {
    await ensureShopPercorsiTables(db)
    const categoria = await resolveCategoria(db, 'shop_percorsi', slug)
    if (!categoria) return null
    const sottocategorie = await getSottocategorie(db, 'shop_percorsi', categoria)
    return { categoria, sottocategorie }
  } finally {
    await db.end()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params
  const dati = await getDati(categoria)
  return { title: dati ? `${dati.categoria} — Shop On Line` : 'Categoria non trovata' }
}

export default async function Page({ params }: Props) {
  const { categoria: slug } = await params
  const dati = await getDati(slug)
  if (!dati) notFound()
  const { categoria, sottocategorie } = dati

  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/shop" style={{ color: '#888', textDecoration: 'underline' }}>Shop On Line</Link> / {categoria}<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>{categoria}</h1>

      {sottocategorie.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 16px', textAlign: 'center' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Nessuna sottocategoria disponibile.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, ${CATEGORY_TILE_WIDTH}px)`, gap: 12, marginBottom: 8 }}>
          {sottocategorie.map(s => (
            <CategoryTile key={s.slug} href={`/shop/${slug}/${s.slug}`} nome={s.nome} numArticoli={s.numArticoli} immagine={s.immagine} />
          ))}
        </div>
      )}

      <StickyBottomBarContent>
        <Link href="/shop" className="btn-black fs-12">← Shop On Line</Link>
      </StickyBottomBarContent>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo elenco sottocategorie shop</p>
    </div>
  )
}
