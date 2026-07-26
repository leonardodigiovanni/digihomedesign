import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { ensurePromoTables } from '@/lib/promo'
import { resolveCategoria, resolveSottocategoria } from '@/lib/categorie-percorsi'
import { type ArticoloEcommerce } from '@/lib/ecommerce'
import EcommerceShop from '@/components/ecommerce-shop'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

type Props = { params: Promise<{ categoria: string; sottocategoria: string }> }

async function getDati(categoriaSlug: string, sottocategoriaSlug: string) {
  const db = await getConnection()
  try {
    await ensurePromoTables(db)
    const categoria = await resolveCategoria(db, 'promo_percorsi', categoriaSlug)
    if (!categoria) return null
    const sottocategoria = await resolveSottocategoria(db, 'promo_percorsi', categoria, sottocategoriaSlug)
    if (!sottocategoria) return null
    // fine_promozione scaduta => l'articolo esce dalle pagine promo (resta comunque nello shop normale)
    const [rows] = await db.query(
      `SELECT l.id, l.categoria, l.descrizione, l.produttore, l.serie, l.unita,
              l.prezzo_vendita, l.prezzo_promo, l.max_acquistabile, l.foto_url, l.richiede_tipo_colore
       FROM listini l
       JOIN promo_percorsi pp ON pp.listino_id = l.id
       WHERE pp.categoria = ? AND pp.sottocategoria = ? AND l.disponibile = 1 AND l.acquistabile = 1
         AND (l.fine_promozione IS NULL OR l.fine_promozione >= CURDATE())
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
  return { title: dati ? `${dati.sottocategoria} — ${dati.categoria} — Promozioni` : 'Promozione non trovata' }
}

export default async function Page({ params }: Props) {
  const { categoria: categoriaSlug, sottocategoria: sottocategoriaSlug } = await params
  const dati = await getDati(categoriaSlug, sottocategoriaSlug)
  if (!dati) notFound()
  const { categoria, sottocategoria, articoli } = dati

  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/promozioni" style={{ color: '#888', textDecoration: 'underline' }}>Promozioni</Link>
        {' / '}
        <Link href={`/promozioni/${categoriaSlug}`} style={{ color: '#888', textDecoration: 'underline' }}>{categoria}</Link>
        {' / '}{sottocategoria}<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>{sottocategoria}</h1>

      <EcommerceShop articoli={articoli} hrefBase={`/promozioni/${categoriaSlug}/${sottocategoriaSlug}`} emptyLabel="Nessun articolo disponibile in questa promozione al momento." />

      <StickyBottomBarContent>
        <Link href={`/promozioni/${categoriaSlug}`} className="btn-black fs-12">← {categoria}</Link>
      </StickyBottomBarContent>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo griglia prodotti promo</p>
    </div>
  )
}
