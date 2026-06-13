import { cookies } from 'next/headers'
import HomeCards from './home-cards'

export default async function AppHomePage() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value ?? null
  return <HomeCards loggedIn={!!username} />
}
