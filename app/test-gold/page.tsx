import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function TestGoldPage() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') redirect('/')

  return (
    <>
      <h1 style={{ marginBottom: 8, fontSize: 22, fontWeight: 700 }}>Test Effetti Oro</h1>
      <p style={{ marginBottom: 32, fontSize: 13, color: '#666' }}>
        Velocità shimmer: variabile <code>--gold-shimmer-speed</code> in <code>globals.css</code> (default: 5s — più alto = più lento)
      </p>

      {/* A */}
      <section style={{ marginBottom: 36 }}>
        <p style={{ marginBottom: 10, fontWeight: 600, fontSize: 15 }}>A — Gradiente oro statico</p>
        <div className="class_gold_A" style={{ height: 150, borderRadius: 12, border: '1px solid #c8960c' }} />
        <code style={{ fontSize: 12, color: '#888', marginTop: 6, display: 'block' }}>
          {'<div className="class_gold_A">'}
        </code>
      </section>

      {/* B */}
      <section style={{ marginBottom: 36 }}>
        <p style={{ marginBottom: 10, fontWeight: 600, fontSize: 15 }}>B — Oro con shimmer animato</p>
        <div className="class_gold_B" style={{ height: 150, borderRadius: 12, border: '1px solid #c8960c' }} />
        <code style={{ fontSize: 12, color: '#888', marginTop: 6, display: 'block' }}>
          {'<div className="class_gold_B">'}
        </code>
      </section>

      {/* C */}
      <section style={{ marginBottom: 36 }}>
        <p style={{ marginBottom: 10, fontWeight: 600, fontSize: 15 }}>C — Oro spazzolato + riflesso radiale + shimmer</p>
        <div className="class_gold_C" style={{ height: 150, borderRadius: 12, border: '1px solid #daa520' }} />
        <code style={{ fontSize: 12, color: '#888', marginTop: 6, display: 'block' }}>
          {'<div className="class_gold_C">'}
        </code>
      </section>
    </>
  )
}
