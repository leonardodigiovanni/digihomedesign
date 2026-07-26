import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { ensureShopPercorsiTables } from '@/lib/shop-percorsi'
import { resolveCategoria, resolveSottocategoria } from '@/lib/categorie-percorsi'
import { type ArticoloEcommerce } from '@/lib/ecommerce'
import EcommerceShop from '@/components/ecommerce-shop'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

type Props = { params: Promise<{ categoria: string; sottocategoria: string }> }

async function getDati(categoriaSlug: string, sottocategoriaSlug: string) {
  const db = await getConnection()
  try {
    await ensureShopPercorsiTables(db)
    const categoria = await resolveCategoria(db, 'shop_percorsi', categoriaSlug)
    if (!categoria) return null
    const sottocategoria = await resolveSottocategoria(db, 'shop_percorsi', categoria, sottocategoriaSlug)
    if (!sottocategoria) return null
    const [rows] = await db.query(
      `SELECT l.id, l.categoria, l.descrizione, l.produttore, l.serie, l.unita,
              l.prezzo_vendita, l.prezzo_promo, l.max_acquistabile, l.foto_url, l.richiede_tipo_colore
       FROM listini l
       JOIN shop_percorsi sp ON sp.listino_id = l.id
       WHERE sp.categoria = ? AND sp.sottocategoria = ? AND l.disponibile = 1 AND l.acquistabile = 1
       ORDER BY l.descrizione ASC`,
      [categoria, sottocategoria]
    )
    return { categoria, sottocategoria, articoli: rows as ArticoloEcommerce[] }
  } finally {
    await db.end()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, sottocategoria } = await params
  const dati = await getDati(categoria, sottocategoria)
  return { title: dati ? `${dati.sottocategoria} — ${dati.categoria} — Shop On Line` : 'Sottocategoria non trovata' }
}

export default async function Page({ params }: Props) {
  const { categoria: categoriaSlug, sottocategoria: sottocategoriaSlug } = await params
  const dati = await getDati(categoriaSlug, sottocategoriaSlug)
  if (!dati) notFound()
  const { categoria, sottocategoria, articoli } = dati

  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/shop" style={{ color: '#888', textDecoration: 'underline' }}>Shop On Line</Link>
        {' / '}
        <Link href={`/shop/${categoriaSlug}`} style={{ color: '#888', textDecoration: 'underline' }}>{categoria}</Link>
        {' / '}{sottocategoria}<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>{sottocategoria}</h1>

      <EcommerceShop articoli={articoli} hrefBase={`/shop/${categoriaSlug}/${sottocategoriaSlug}`} />

      <StickyBottomBarContent>
        <Link href={`/shop/${categoriaSlug}`} className="btn-black fs-12">← {categoria}</Link>
      </StickyBottomBarContent>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo griglia prodotti shop</p>
    </div>
  )
}
