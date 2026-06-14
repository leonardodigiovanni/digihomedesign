import { cookies } from 'next/headers'
import HomeCards from './home-cards'
import { readSettings } from '@/lib/settings'

export default async function AppHomePage() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null
  const { manutenzione } = await readSettings()
  return <HomeCards loggedIn={!!username} manutenzione={manutenzione} />
}
