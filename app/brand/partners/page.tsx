import Link from 'next/link'
import PartnersBlock from '@/components/partners-block'
import type { Metadata } from 'next'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Partners — Digi Home Design Palermo',
  description: 'I partner e fornitori selezionati di Digi Home Design: marchi di qualità con cui collaboriamo per garantire materiali e prodotti al top del mercato.',
  alternates: { canonical: 'https://www.digi-home-design.com/chi-siamo/partners' },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/chi-siamo" style={{ color: '#888', textDecoration: 'underline' }}>Chi Siamo</Link> / Partners<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Partners</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Collaboriamo con fornitori e produttori selezionati per garantire ai nostri clienti materiali di qualità certificata, consegne affidabili e assistenza post-vendita. Ogni partner è scelto sulla base di criteri di qualità, affidabilità e compatibilità con i nostri standard di lavoro.</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>Le partnership ci consentono di offrire prezzi competitivi su un&apos;ampia gamma di prodotti, dalla componentistica impiantistica agli infissi di fascia alta.</p>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <PartnersBlock />
      </div>
      <StickyBottomBarContent>
        <Link href="/chi-siamo" className="btn-black fs-12">← Torna a Chi Siamo</Link>
      </StickyBottomBarContent>
    </div>
  )
}
