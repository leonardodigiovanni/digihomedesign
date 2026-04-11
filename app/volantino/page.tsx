import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import VolantinoClient from './volantino-client'

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') redirect('/')

  const settings = readSettings()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Volantino</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Anteprima e export A4</p>
      </div>
      <VolantinoClient
        headerBg={settings.headerBg}
        headerBgMode={settings.headerBgMode}
        pageBg={settings.pageBg}
        pageBgMode={settings.pageBgMode}
        footerBg={settings.footerBg}
        footerBgMode={settings.footerBgMode}
      />
    </div>
  )
}
