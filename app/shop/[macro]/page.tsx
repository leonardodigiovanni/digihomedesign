import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { getMacroSezione, type ArticoloEcommerce } from '@/lib/ecommerce'
import EcommerceCatalog from '@/components/ecommerce-catalog'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'

type Props = { params: Promise<{ macro: string }> }

async function getArticoliAcquistabili(): Promise<ArticoloEcommerce[]> {
  const db = await getConnection()
  try {
    const [rows] = await db.query(
      `SELECT id, categoria, descrizione, produttore, serie, unita, prezzo_vendita, max_acquistabile, foto_url, richiede_tipo_colore
       FROM listini
       WHERE disponibile = 1 AND acquistabile = 1
       ORDER BY descrizione ASC`
    )
    return rows as ArticoloEcommerce[]
  } finally {
    await db.end()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { macro } = await params
  const sezione = getMacroSezione(macro)
  return { title: sezione ? `${sezione.nome} — Shop (test)` : 'Sezione non trovata', robots: { index: false, follow: false } }
}

export default async function Page({ params }: Props) {
  const { macro } = await params
  const sezione = getMacroSezione(macro)
  if (!sezione) notFound()

  // Per ora un'unica macro-sezione mostra tutti i prodotti acquistabili: la
  // vera suddivisione per reparto sarà rivista in seguito.
  const articoli = await getArticoliAcquistabili()

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/shop" style={{ color: '#888', textDecoration: 'underline' }}>Shop (test)</Link> / {sezione.nome}
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 12 }}>{sezione.nome}</h1>

      <EcommerceCatalog articoli={articoli} macro={macro} />

      <StickyBottomBarContent>
        <Link href="/shop" className="btn-black fs-12">← Torna a Shop</Link>
      </StickyBottomBarContent>
    </div>
  )
}
