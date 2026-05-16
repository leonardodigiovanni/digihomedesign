import Link from 'next/link'
import Image from 'next/image'

export default function AppCantierePage() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <Image src="/images/cta/cantieri-online-t.png" alt="Cantiere" width={100} height={100} style={{ objectFit: 'contain', marginBottom: 16 }} />
      <p className="app-card-title" style={{ fontSize: 18, marginBottom: 8 }}>Cantiere Online</p>
      <p className="app-card-body" style={{ marginBottom: 28 }}>Sezione in arrivo. Potrai seguire i tuoi lavori in tempo reale con foto e aggiornamenti giornalieri.</p>
      <Link href="/app" className="app-btn">Torna alla Home</Link>
    </div>
  )
}
