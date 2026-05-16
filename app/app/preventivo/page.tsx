import Link from 'next/link'
import Image from 'next/image'

export default function AppPreventivoPage() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <Image src="/images/cta/preventivo-online-t.png" alt="Preventivo" width={100} height={100} style={{ objectFit: 'contain', marginBottom: 16 }} />
      <p className="app-card-title" style={{ fontSize: 18, marginBottom: 8 }}>Preventivo Online</p>
      <p className="app-card-body" style={{ marginBottom: 28 }}>Sezione in arrivo. Presto potrai calcolare il tuo preventivo direttamente dall&apos;app.</p>
      <Link href="/app" className="app-btn">Torna alla Home</Link>
    </div>
  )
}
