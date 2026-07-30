import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { ensureShopPercorsiTables } from '@/lib/shop-percorsi'
import { resolveCategoria, resolveSottocategoria, percorsoValido, primoPercorso } from '@/lib/categorie-percorsi'
import { toEcommerceSlug, type ArticoloEcommerce } from '@/lib/ecommerce'
import ProdottoDettaglio from '@/components/prodotto-dettaglio'
import ShortcutStar from '@/components/shortcut-star'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'

type Props = { params: Promise<{ categoria: string; sottocategoria: string; id: string }> }

async function getDati(categoriaSlug: string, sottocategoriaSlug: string, id: number) {
  const db = await getConnection()
  try {
    await ensureShopPercorsiTables(db)
    const categoria = await resolveCategoria(db, 'shop_percorsi', categoriaSlug)
    if (!categoria) return null
    const sottocategoria = await resolveSottocategoria(db, 'shop_percorsi', categoria, sottocategoriaSlug)
    if (!sottocategoria) return null
    if (!(await percorsoValido(db, 'shop_percorsi', id, categoria, sottocategoria))) return null

    const [rows] = await db.query(
      `SELECT id, categoria, descrizione, produttore, serie, unita, prezzo_vendita, prezzo_promo, max_acquistabile, foto_url, richiede_tipo_colore
       FROM listini WHERE disponibile = 1 AND acquistabile = 1 AND id = ? LIMIT 1`,
      [id]
    )
    const articolo = (rows as ArticoloEcommerce[])[0]
    if (!articolo) return null

    const primo = await primoPercorso(db, 'shop_percorsi', id)
    const canonical = primo
      ? `https://www.digi-home-design.com/shop/${toEcommerceSlug(primo.categoria)}/${toEcommerceSlug(primo.sottocategoria)}/${id}`
      : `https://www.digi-home-design.com/shop/${categoriaSlug}/${sottocategoriaSlug}/${id}`

    return { categoria, sottocategoria, articolo, canonical }
  } finally {
    await db.end()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, sottocategoria, id } = await params
  const dati = await getDati(categoria, sottocategoria, parseInt(id))
  if (!dati) return { title: 'Prodotto non trovato' }
  return {
    title: `${dati.articolo.descrizione} — Shop On Line`,
    alternates: { canonical: dati.canonical },
  }
}

export default async function Page({ params }: Props) {
  const { categoria: categoriaSlug, sottocategoria: sottocategoriaSlug, id } = await params
  const dati = await getDati(categoriaSlug, sottocategoriaSlug, parseInt(id))
  if (!dati) notFound()
  const { categoria, sottocategoria, articolo } = dati

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/shop" style={{ color: '#888', textDecoration: 'underline' }}>Shop On Line</Link>
        {' / '}
        <Link href={`/shop/${categoriaSlug}`} style={{ color: '#888', textDecoration: 'underline' }}>{categoria}</Link>
        {' / '}
        <Link href={`/shop/${categoriaSlug}/${sottocategoriaSlug}`} style={{ color: '#888', textDecoration: 'underline' }}>{sottocategoria}</Link>
        {' / '}{articolo.descrizione}<ShortcutStar />
      </p>

      <ProdottoDettaglio articolo={articolo} />

      <StickyBottomBarContent>
        <Link href={`/shop/${categoriaSlug}/${sottocategoriaSlug}`} className="btn-black fs-12" style={{ height: 42, padding: '0 20px', borderRadius: 21, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          ← Torna a {sottocategoria}
        </Link>
      </StickyBottomBarContent>
    </div>
  )
}
