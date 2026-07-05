'use client'

export default function CookiePrefsLink() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-banner'))}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 10, color: '#666',
        textDecoration: 'underline', padding: 0,
      }}
    >
      Gestisci preferenze cookie
    </button>
  )
}
