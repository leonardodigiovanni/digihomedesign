import { cookies } from 'next/headers'
import HomeCards from './home-cards'
import { readSettings } from '@/lib/settings'

export default async function AppHomePage() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null
  const { manutenzione } = await readSettings()
  return (
    <div style={{ marginLeft: 3, marginRight: 3 }}>
      <HomeCards loggedIn={!!username} manutenzione={manutenzione} />
    </div>
  )
}
