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
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Condizioni di Vendita</h1>
      <p>Le presenti condizioni generali di vendita disciplinano i rapporti tra Digi Home Design e i propri clienti in merito alla fornitura di prodotti e servizi. L&apos;accettazione del preventivo implica la piena accettazione delle condizioni qui riportate.</p>
      <p style={{ marginTop: 12 }}>I prodotti su misura (infissi, serramenti, mobili, strutture metalliche) non sono soggetti a diritto di recesso ai sensi dell&apos;art. 59 del Codice del Consumo in quanto realizzati su specifiche del cliente. Le garanzie sui prodotti sono quelle previste dalla normativa vigente (D.Lgs. 206/2005).</p>
      <p style={{ marginTop: 12 }}>Per informazioni dettagliate sulle modalità di pagamento, acconti e saldo, contattaci o consulta il contratto allegato al preventivo.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
        {[
          { label: 'Condizioni Generali di Vendita',      file: 'condizioni-generali-di-vendita.pdf'     },
          { label: 'Condizioni Generali del Preventivo',  file: 'condizioni-generali-del-preventivo.pdf' },
        ].map(d => (
          <a
            key={d.file}
            href={`/docs/${d.file}`}
            download
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px',
              background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8,
              textDecoration: 'none', color: '#1a1a1a', fontSize: 14, fontWeight: 500,
            }}
          >
            <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <rect width="28" height="34" rx="3" fill="#e53935"/>
              <path d="M17 0 L17 8 L28 8 Z" fill="#b71c1c"/>
              <text x="14" y="24" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="system-ui,sans-serif">PDF</text>
            </svg>
            {d.label}
            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#888' }}>Scarica</span>
          </a>
        ))}
      </div>

      <Link href="/brand" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Brand</Link>
    </div>
  )
}
