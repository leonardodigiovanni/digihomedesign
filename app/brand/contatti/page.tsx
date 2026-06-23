import { cookies } from 'next/headers'
import Link from 'next/link'
import ContattoForm from './contatto-form'
import type { Metadata } from 'next'

function IconPhone() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#22c55e"/>
      <path fill="#fff" d="M17.45 14.89c-.28-.14-1.65-.82-1.91-.91-.26-.09-.44-.14-.63.14s-.72.91-.88 1.09c-.16.18-.33.2-.61.07a7.67 7.67 0 0 1-2.25-1.39 7.53 7.53 0 0 1-1.56-1.94c-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.23-.55-.46-.47-.63-.48H8.6c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34s1 2.71 1.14 2.9c.14.18 1.97 3.01 4.77 4.22.67.29 1.19.46 1.6.59.67.21 1.28.18 1.76.11.54-.08 1.65-.67 1.89-1.33.23-.65.23-1.21.16-1.33-.07-.12-.26-.19-.54-.33Z"/>
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#3b82f6"/>
      <path fill="#fff" d="M5 8.5A1.5 1.5 0 0 1 6.5 7h11A1.5 1.5 0 0 1 19 8.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 15.5v-7Zm1.5-.5a.5.5 0 0 0-.5.5v.67l6 3.75 6-3.75V8.5a.5.5 0 0 0-.5-.5h-11ZM18 10.33l-5.45 3.41a1 1 0 0 1-1.1 0L6 10.33V15.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-5.17Z"/>
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#f59e0b"/>
      <path fill="#fff" d="M12 6a6 6 0 1 0 0 12A6 6 0 0 0 12 6Zm0 1a5 5 0 1 1 0 10A5 5 0 0 1 12 7Zm-.5 2v3.28l2.36 2.36.7-.7-2.06-2.06V9h-1Z"/>
    </svg>
  )
}

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
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/brand" style={{ color: '#888', textDecoration: 'underline' }}>Brand</Link> / Contatti
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Contatti</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 0 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ margin: 0, textAlign: 'justify' }}>Siamo a disposizione per sopralluoghi gratuiti, preventivi e informazioni su tutti i nostri servizi. Contattaci telefonicamente, via email o compila il modulo — ti risponderemo entro 24 ore.</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <p className="testo-articoli" style={{ margin: 0, textAlign: 'justify' }}>Operiamo direttamente a Palermo e in tutta la Provincia e nel resto della Sicilia. Potremmo affidarci alla nostra rete di selezionati e fidati collaboratori per gestire distanze maggiori.</p>
        </div>
      </div>

      {/* Recapiti */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        margin: '32px 0 0',
      }}>
        {[
          { icon: <IconPhone />, label: 'Telefono',  valore: '+39 351 871 6731',               href: 'tel:+393518716731',               grow: 1 },
          { icon: <IconMail />,  label: 'Email',     valore: 'info@digi-home-design.com',      href: 'mailto:info@digi-home-design.com', grow: 2 },
          { icon: <IconClock />, label: 'Orari',     valore: 'Lun–Ven 9:00–18:00',            href: undefined,                         grow: 1 },
        ].map(r => (
          <div key={r.label} style={{
            flex: `${r.grow} 1 160px`,
            background: '#fff',
            border: '1px solid #c8960c',
            borderRadius: 10,
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ flexShrink: 0, display: 'flex' }}>{r.icon}</span>
            <div>
              {r.href ? (
                <a href={r.href} className="testo-articoli" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  {r.valore}
                </a>
              ) : (
                <span className="testo-articoli" style={{ whiteSpace: 'nowrap' }}>{r.valore}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <ContattoForm username={username} role={role} />

      <Link href="/brand" className="btn-black fs-12" style={{ marginTop: 32 }}>← Torna a Brand</Link>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>pagina revisionata</p>
    </div>
  )
}
