import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { getMacroSezione, type ArticoloEcommerce } from '@/lib/ecommerce'
import { PrezzoAmazon } from '@/components/ecommerce-shop'
import EcommerceAddToCartForm from '@/components/ecommerce-add-to-cart-form'

type Props = { params: Promise<{ macro: string; id: string }> }

async function getArticolo(id: number): Promise<ArticoloEcommerce | null> {
  const db = await getConnection()
  try {
    const [rows] = await db.query(
      `SELECT id, categoria, descrizione, produttore, serie, unita, prezzo_vendita, max_acquistabile, foto_url, richiede_tipo_colore
       FROM listini
       WHERE disponibile = 1 AND acquistabile = 1 AND id = ?
       LIMIT 1`,
      [id]
    )
    const list = rows as ArticoloEcommerce[]
    return list[0] ?? null
  } finally {
    await db.end()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const articolo = await getArticolo(parseInt(id))
  return { title: articolo ? `${articolo.descrizione} — Shop (test)` : 'Prodotto non trovato', robots: { index: false, follow: false } }
}

export default async function Page({ params }: Props) {
  const { macro, id } = await params
  const sezione = getMacroSezione(macro)
  if (!sezione) notFound()

  const articolo = await getArticolo(parseInt(id))
  if (!articolo) notFound()

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/shop" style={{ color: '#888', textDecoration: 'underline' }}>Shop (test)</Link>
        {' / '}
        <Link href={`/shop/${macro}`} style={{ color: '#888', textDecoration: 'underline' }}>{sezione.nome}</Link>
        {' / '}{articolo.descrizione}
      </p>

      <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {articolo.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={articolo.foto_url.startsWith('/') ? articolo.foto_url : `/${articolo.foto_url}`}
              alt={articolo.descrizione}
              style={{ width: 280, aspectRatio: '1 / 1', objectFit: 'contain', borderRadius: 10, background: '#f7f7f7', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 280, aspectRatio: '1 / 1', borderRadius: 10, background: '#f7f7f7', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 13 }}>
              Nessuna foto
            </div>
          )}

          <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h1 className="effetto-3d fs-24" style={{ fontWeight: 700, margin: 0 }}>{articolo.descrizione}</h1>
            {articolo.produttore && <p className="testo-articoli" style={{ margin: 0, color: '#888' }}>{articolo.produttore}</p>}
            <PrezzoAmazon articolo={articolo} />

            <div style={{ marginTop: 8 }}>
              <EcommerceAddToCartForm articolo={articolo} />
            </div>
          </div>
        </div>
      </div>

      <p style={{ marginTop: 16 }}>
        <Link href={`/shop/${macro}`} className="btn-black fs-12" style={{ height: 42, padding: '0 20px', borderRadius: 21, display: 'inline-flex', alignItems: 'center', textDecoration: 'none', fontFamily: 'monospace' }}>
          ← Torna a {sezione.nome}
        </Link>
      </p>
    </div>
  )
}
