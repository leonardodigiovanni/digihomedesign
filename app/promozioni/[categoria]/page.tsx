import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { ensurePromoTables } from '@/lib/promo'
import { resolveCategoria, getSottocategorie } from '@/lib/categorie-percorsi'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { CategoryTile, CATEGORY_TILE_WIDTH } from '@/components/category-tile'

type Props = { params: Promise<{ categoria: string }> }

async function getDati(slug: string) {
  const db = await getConnection()
  try {
    await ensurePromoTables(db)
    const categoria = await resolveCategoria(db, 'promo_percorsi', slug)
    if (!categoria) return null
    const sottocategorie = await getSottocategorie(db, 'promo_percorsi', categoria)
    return { categoria, sottocategorie }
  } finally {
    await db.end()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params
  const dati = await getDati(categoria)
  return { title: dati ? `${dati.categoria} — Promozioni` : 'Promozione non trovata' }
}

export default async function Page({ params }: Props) {
  const { categoria: slug } = await params
  const dati = await getDati(slug)
  if (!dati) notFound()
  const { categoria, sottocategorie } = dati

  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/promozioni" style={{ color: '#888', textDecoration: 'underline' }}>Promozioni</Link> / {categoria}<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>{categoria}</h1>

      {sottocategorie.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 16px', textAlign: 'center' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Nessuna sottocategoria disponibile.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, ${CATEGORY_TILE_WIDTH}px)`, gap: 12, marginBottom: 8 }}>
          {sottocategorie.map(s => (
            <CategoryTile key={s.slug} href={`/promozioni/${slug}/${s.slug}`} nome={s.nome} numArticoli={s.numArticoli} suffisso=" in promozione" immagine={s.immagine} />
          ))}
        </div>
      )}

      <StickyBottomBarContent>
        <Link href="/promozioni" className="btn-black fs-12">← Promozioni</Link>
      </StickyBottomBarContent>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo elenco sottocategorie promo</p>
    </div>
  )
}
