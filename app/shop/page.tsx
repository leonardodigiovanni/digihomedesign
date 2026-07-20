import type { Metadata } from 'next'
import { ECOMMERCE_MACRO_SEZIONI } from '@/lib/ecommerce'
import EcommerceHub from '@/components/ecommerce-hub'

export const metadata: Metadata = {
  title: 'Shop (test)',
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Shop (test)</h1>
      <p className="testo-articoli" style={{ margin: '0 0 16px' }}>
        Pagina di prova. Scegli una categoria per vedere i prodotti acquistabili.
      </p>

      <EcommerceHub sezioni={ECOMMERCE_MACRO_SEZIONI} />
    </div>
  )
}
