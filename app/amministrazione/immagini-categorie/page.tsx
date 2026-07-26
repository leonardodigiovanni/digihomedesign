import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { ensureShopPercorsiTables } from '@/lib/shop-percorsi'
import { ensurePromoTables } from '@/lib/promo'
import { ensurePercorsiTables } from '@/lib/percorsi'
import { ensureCategoriaImmaginiTables, pulisciImmaginiOrfane, getCategorieConImmagine, getCoppieConImmagine } from '@/lib/categoria-immagini'
import ImmaginiCategorieClient from './immagini-categorie-client'

export default async function Page() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')

  const db = await getConnection()
  let shopCategorie, shopSottocategorie, promoCategorie, promoSottocategorie, catalogiCategorie, catalogiSottocategorie
  try {
    await ensureShopPercorsiTables(db)
    await ensurePromoTables(db)
    await ensurePercorsiTables(db)
    await ensureCategoriaImmaginiTables(db)
    await pulisciImmaginiOrfane(db)
    shopCategorie      = await getCategorieConImmagine(db, 'shop')
    shopSottocategorie = await getCoppieConImmagine(db, 'shop')
    promoCategorie      = await getCategorieConImmagine(db, 'promo')
    promoSottocategorie = await getCoppieConImmagine(db, 'promo')
    catalogiCategorie      = await getCategorieConImmagine(db, 'cataloghi')
    catalogiSottocategorie = await getCoppieConImmagine(db, 'cataloghi', true)
  } finally {
    await db.end()
  }

  return (
    <div className="fs-15" style={{ padding: '0 4px 64px', color: '#444', lineHeight: 1.8 }}>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Immagini categorie e promo</h1>
      <p className="testo-articoli" style={{ marginBottom: 16 }}>
        Un&apos;immagine per ogni categoria (riquadro di primo livello, es. &ldquo;Inverno&rdquo; su /shop) e una per ogni coppia categoria/sottocategoria (riquadro di secondo livello, es. &ldquo;Divani&rdquo; su /shop/inverno, o &ldquo;Generale&rdquo; per i cataloghi senza sottocategoria) — condivisa da tutte le sottocategorie della stessa categoria, non duplicata per coppia. Le voci non più in uso vengono ripulite automaticamente, insieme alle immagini associate.
      </p>
      <ImmaginiCategorieClient
        shopCategorie={shopCategorie} shopSottocategorie={shopSottocategorie}
        promoCategorie={promoCategorie} promoSottocategorie={promoSottocategorie}
        catalogiCategorie={catalogiCategorie} catalogiSottocategorie={catalogiSottocategorie}
      />
    </div>
  )
}
