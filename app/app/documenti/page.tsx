import Link from 'next/link'

export default function AppDocumentiPage() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <p style={{ fontSize: 48, margin: '0 0 16px' }}>📁</p>
      <p className="app-card-title" style={{ fontSize: 18, marginBottom: 8 }}>Documenti</p>
      <p className="app-card-body" style={{ marginBottom: 28 }}>Sezione in arrivo. Troverai qui fatture, contratti e tutta la documentazione dei tuoi interventi.</p>
      <Link href="/app" className="app-btn">Torna alla Home</Link>
    </div>
  )
}
