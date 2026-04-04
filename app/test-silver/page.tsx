import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function TestSilverPage() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') redirect('/')

  return (
    <>
      <h1 style={{ marginBottom: 8, fontSize: 22, fontWeight: 700 }}>Test Effetti Argento</h1>
      <p style={{ marginBottom: 32, fontSize: 13, color: '#666' }}>
        Velocità shimmer: variabile <code>--silver-shimmer-speed</code> in <code>globals.css</code> (default: 25s — più alto = più lento)
      </p>

      {/* A */}
      <section style={{ marginBottom: 36 }}>
        <p style={{ marginBottom: 10, fontWeight: 600, fontSize: 15 }}>A — Gradiente argento statico</p>
        <div className="class_silver_A" style={{ height: 150, borderRadius: 12, border: '1px solid #aaa' }} />
        <code style={{ fontSize: 12, color: '#888', marginTop: 6, display: 'block' }}>
          {'<div className="class_silver_A">'}
        </code>
      </section>

      {/* B */}
      <section style={{ marginBottom: 36 }}>
        <p style={{ marginBottom: 10, fontWeight: 600, fontSize: 15 }}>B — Argento con shimmer animato</p>
        <div className="class_silver_B" style={{ height: 150, borderRadius: 12, border: '1px solid #aaa' }} />
        <code style={{ fontSize: 12, color: '#888', marginTop: 6, display: 'block' }}>
          {'<div className="class_silver_B">'}
        </code>
      </section>

      {/* C */}
      <section style={{ marginBottom: 36 }}>
        <p style={{ marginBottom: 10, fontWeight: 600, fontSize: 15 }}>C — Argento spazzolato + riflesso radiale + shimmer</p>
        <div className="class_silver_C" style={{ height: 150, borderRadius: 12, border: '1px solid #bbb' }} />
        <code style={{ fontSize: 12, color: '#888', marginTop: 6, display: 'block' }}>
          {'<div className="class_silver_C">'}
        </code>
      </section>
    </>
  )
}
