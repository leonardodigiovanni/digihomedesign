import { cookies } from 'next/headers'
import Link from 'next/link'
import ContattoForm from './contatto-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contatti — Digi Home Design Palermo',
  description: 'Contatta Digi Home Design a Palermo: telefono, email, indirizzo e modulo di contatto per preventivi e informazioni sui nostri servizi.',
  alternates: { canonical: 'https://www.digi-home-design.com/brand/contatti' },
}

export default async function Page() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null
  const role     = cookieStore.get('session_role')?.value ?? null

  return (
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Contatti
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Contatti</h1>
      <p>Siamo a disposizione per sopralluoghi gratuiti, preventivi e informazioni su tutti i nostri servizi. Contattaci telefonicamente, via email o compila il modulo — ti risponderemo entro 24 ore.</p>
      <p style={{ marginTop: 12 }}>Operiamo a Palermo e in tutta la provincia. Per interventi urgenti siamo raggiungibili anche fuori orario.</p>

      {/* Recapiti */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16,
        margin: '32px 0 0',
      }}>
        {[
          { icon: '📞', label: 'Telefono',  valore: '+39 351 871 6731',               href: 'tel:+393518716731'              },
          { icon: '✉️', label: 'Email',     valore: 'info@digi-home-design.com',      href: 'mailto:info@digi-home-design.com'},
          { icon: '🕐', label: 'Orari',     valore: 'Lun–Ven 9:00–18:00',            href: undefined                        },
        ].map(r => (
          <div key={r.label} style={{
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: 10,
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}>
            <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.3 }}>{r.icon}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#999', marginBottom: 3 }}>
                {r.label}
              </div>
              {r.href ? (
                <a href={r.href} style={{ fontSize: 14, color: '#1a1a1a', textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {r.valore}
                </a>
              ) : (
                <span style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 500, whiteSpace: 'nowrap' }}>{r.valore}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <ContattoForm username={username} role={role} />

      <Link href="/brand" style={{ display: 'inline-block', marginTop: 40, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Brand</Link>
    </div>
  )
}
