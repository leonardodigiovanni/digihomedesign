import InfoCard from '@/app/app/info-card'

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

function IconWhatsApp() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.523 3.656 1.432 5.168L2 22l4.98-1.404A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm0 18a7.953 7.953 0 0 1-4.078-1.117l-.292-.174-3.057.862.822-3.001-.19-.308A7.953 7.953 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8Zm4.362-5.996c-.238-.119-1.407-.694-1.625-.773-.218-.079-.376-.119-.535.119-.158.238-.614.773-.752.931-.139.158-.277.178-.515.059-.238-.119-1.005-.371-1.914-1.181-.707-.631-1.185-1.411-1.323-1.649-.139-.238-.015-.366.104-.485.107-.107.238-.277.357-.416.119-.139.158-.238.238-.396.079-.158.04-.297-.02-.416-.059-.119-.535-1.29-.733-1.766-.193-.464-.389-.401-.535-.409l-.456-.008c-.158 0-.416.059-.634.297-.218.238-.832.813-.832 1.983s.852 2.3.97 2.459c.119.158 1.677 2.561 4.063 3.591.568.245 1.011.391 1.357.5.57.181 1.089.156 1.499.095.457-.068 1.407-.575 1.606-1.131.198-.556.198-1.033.139-1.131-.059-.099-.218-.158-.456-.277Z"/>
    </svg>
  )
}

function IconTelegram() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13" stroke="#229ED9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#229ED9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.271h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z"/>
    </svg>
  )
}

// function IconInstagram() { ... } // commentato temporaneamente

function IconTikTok() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.8 1.54V6.78a4.85 4.85 0 0 1-1.03-.09z"/>
    </svg>
  )
}

const PHONE = '+39 3518716731'
const PHONE_HREF = 'tel:+393518716731'
const EMAIL = 'info@digi-home-design.com'
const EMAIL_HREF = 'mailto:info@digi-home-design.com'

const socials = [
  { label: 'WhatsApp',  account: 'wa.me/393518716731',              href: 'https://wa.me/393518716731',                   icon: <IconWhatsApp /> },
  { label: 'Telegram',  account: 't.me/digihomedesign',             href: 'https://t.me/digihomedesign',                  icon: <IconTelegram /> },
  // { label: 'Instagram', account: '@digihomedesign',              href: 'https://www.instagram.com/digihomedesign',     icon: <IconInstagram /> },
  { label: 'Facebook',  account: 'digihomedesign',                  href: 'https://www.facebook.com/digihomedesign',      icon: <IconFacebook /> },
  { label: 'TikTok',    account: '@digihomedesign',                 href: 'https://www.tiktok.com/@digihomedesign',       icon: <IconTikTok /> },
]

const ROW_H = 82

const rows: { label: string; sub: string; href: string; icon: React.ReactNode }[] = [
  { label: 'Telefono',  sub: PHONE, href: PHONE_HREF,  icon: <IconPhone /> },
  { label: 'Email',     sub: EMAIL, href: EMAIL_HREF,  icon: <IconMail /> },
  ...socials.map(s => ({ label: s.label, sub: s.account, href: s.href, icon: s.icon })),
]

export default function AppContattiPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 3, marginRight: 3 }}>
      <InfoCard titolo="Contatti" corpo="Trova i nostri recapiti, scrivici o richiedi un appuntamento direttamente da qui." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map(({ label, sub, href, icon }) => (
          <div
            key={label}
            className="sfondo-riquadri-app"
            style={{
              border: '1px solid #222',
              borderRadius: 8,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{label}</p>
              <p style={{ margin: 0, fontSize: 14, color: '#888', wordBreak: 'break-all' }}>{sub}</p>
            </div>
            <div style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{ display: 'flex' }}>
                  {icon}
                </a>
              ) : (
                <span style={{ display: 'flex' }}>{icon}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


