import { type ArticoloEcommerce } from '@/lib/ecommerce'
import { PrezzoAmazon } from '@/components/ecommerce-shop'
import EcommerceAddToCartForm from '@/components/ecommerce-add-to-cart-form'

// Markup condiviso della pagina dettaglio prodotto, usato sia da /shop/.../[id]
// che da /promozioni/.../[id]: stesso articolo (stessa riga di `listini`),
// stesso prezzo (doppio se in promo), stesso form di aggiunta al carrello —
// cambia solo il percorso/breadcrumb con cui ci si arriva.
export default function ProdottoDettaglio({ articolo }: { articolo: ArticoloEcommerce }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 4px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {articolo.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={articolo.foto_url.startsWith('http') ? articolo.foto_url : articolo.foto_url.startsWith('/') ? articolo.foto_url : `/${articolo.foto_url}`}
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
  )
}
