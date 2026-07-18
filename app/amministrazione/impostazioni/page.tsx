import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { readSettings } from '@/lib/settings'
import { getVisitStats, getShortcutStats } from '@/lib/page-visits-db'
import SettingsForm from './settings-form'
import ManutenzioneToggle from './manutenzione-toggle'
import BannerPanel from './banner-panel'
import ShortcutStar from '@/components/shortcut-star'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impostazioni',
}

const testPages = [
  { label: 'Test Sfondo Gold (A/B/C)',   href: '/test-gold'   },
  { label: 'Test Sfondo Silver (A/B/C)', href: '/test-silver' },
  { label: 'Test Sfondo RGB (A/B/C)',    href: '/test-rgb'    },
  { label: 'Volantino',                  href: '/volantino'   },
]

export default async function Page() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')

  const settings = await readSettings()
  const [visitStats, shortcutStats] = await Promise.all([getVisitStats(), getShortcutStats()])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Impostazioni<ShortcutStar href="/amministrazione/impostazioni" small /></h2>

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
        border: '2px solid #c8960c',
        borderRadius: 10,
        padding: '24px 28px 28px',
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 12px' }}>Pagine di Test</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {testPages.map(({ label, href }) => (
            <Link key={href} href={href} className="btn-black" style={{
              padding: '0 14px',
              fontWeight: 600,
            }}>
              {label}
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
        visitStats={visitStats}
        shortcutStats={shortcutStats}
        rolePermissions={settings.rolePermissions}
        registrazioniDisabilitate={settings.registrazioniDisabilitate}
        loginClientiDisabilitato={settings.loginClientiDisabilitato}
        loginDipendentiDisabilitato={settings.loginDipendentiDisabilitato}
      />
    </div>
  )
}
