import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { readSettings } from '@/lib/settings'
import SettingsForm from './settings-form'

const testPages = [
  { label: 'Test Sfondo Gold (A/B/C)',   href: '/test-gold'   },
  { label: 'Test Sfondo Silver (A/B/C)', href: '/test-silver' },
  { label: 'Test Sfondo RGB (A/B/C)',    href: '/test-rgb'    },
]

export default async function Page() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')

  const settings = readSettings()

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Settings</h2>

      {/* Pannello pagine di test */}
      <div style={{
        background: '#1a1a2e',
        border: '1px solid #333',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 32,
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          Pagine di test (solo admin)
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {testPages.map(({ label, href }) => (
            <Link key={href} href={href} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              background: '#2a2a3e',
              border: '1px solid #444',
              borderRadius: 6,
              color: '#c8960c',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'background 0.15s, border-color 0.15s',
            }}>
              🔧 {label}
            </Link>
          ))}
        </div>
      </div>
      <SettingsForm
        inactivityMinutes={settings.inactivityMinutes}
        countdownSeconds={settings.countdownSeconds}
        headerBg={settings.headerBg}
        headerBgMode={settings.headerBgMode}
        footerBg={settings.footerBg}
        footerBgMode={settings.footerBgMode}
        pageBg={settings.pageBg}
        pageBgMode={settings.pageBgMode}
        disabledPages={settings.disabledPages}
        rolePermissions={settings.rolePermissions}
        registrazioniDisabilitate={settings.registrazioniDisabilitate}
        loginClientiDisabilitato={settings.loginClientiDisabilitato}
        loginDipendentiDisabilitato={settings.loginDipendentiDisabilitato}
      />
    </div>
  )
}
