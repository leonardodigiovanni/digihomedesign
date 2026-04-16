import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Condizioni di Vendita — Digi Home Design Palermo',
  description: 'Condizioni generali di vendita e fornitura di Digi Home Design: modalità di pagamento, garanzie, tempi di consegna e politica di reso.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/condizioni-di-vendita' },
}

export default function Page() {
  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Condizioni di Vendita
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Condizioni di Vendita</h1>
      <p>Le presenti condizioni generali di vendita disciplinano i rapporti tra Digi Home Design e i propri clienti in merito alla fornitura di prodotti e servizi. L&apos;accettazione del preventivo implica la piena accettazione delle condizioni qui riportate.</p>
      <p style={{ marginTop: 12 }}>I prodotti su misura (infissi, serramenti, mobili, strutture metalliche) non sono soggetti a diritto di recesso ai sensi dell&apos;art. 59 del Codice del Consumo in quanto realizzati su specifiche del cliente. Le garanzie sui prodotti sono quelle previste dalla normativa vigente (D.Lgs. 206/2005).</p>
      <p style={{ marginTop: 12 }}>Per informazioni dettagliate sulle modalità di pagamento, acconti e saldo, contattaci o consulta il contratto allegato al preventivo.</p>
      <Link href="/brand" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Brand</Link>
    </div>
  )
}
