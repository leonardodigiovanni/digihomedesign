import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { readSettings } from '@/lib/settings'
import SettingsForm from './settings-form'
import ManutenzioneToggle from './manutenzione-toggle'
import BannerPanel from './banner-panel'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impostazioni',
}

const testPages = [
  { label: 'Test Sfondo Gold (A/B/C)',   href: '/test-gold',   icon: '🎨' },
  { label: 'Test Sfondo Silver (A/B/C)', href: '/test-silver', icon: '🎨' },
  { label: 'Test Sfondo RGB (A/B/C)',    href: '/test-rgb',    icon: '🎨' },
  { label: 'Volantino',                  href: '/volantino',   icon: '📄' },
]

export default async function Page() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')

  const settings = readSettings()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Impostazioni</h2>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 auto' }}>
          <ManutenzioneToggle manutenzione={settings.manutenzione} />
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <BannerPanel abilitato={settings.bannerAbilitato} circolare={settings.bannerCircolare} testo={settings.bannerTesto} />
        </div>
      </div>

      {/* Pannello pagine di test */}
      <div style={{
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 10,
        padding: '24px 28px 28px',
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 12px' }}>Pagine di Test</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {testPages.map(({ label, href, icon }) => (
            <Link key={href} href={href} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 33,
              boxSizing: 'border-box',
              padding: '0 14px',
              background: '#2a2a3e',
              border: '1px solid #444',
              borderRadius: 6,
              color: '#c8960c',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'background 0.15s, border-color 0.15s',
            }}>
              {icon} {label}
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
