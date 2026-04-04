import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import RegistrationFlow from './registration-flow'

export default async function RegistrazionePage() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_user')?.value) {
    redirect('/')
  }

  return <RegistrationFlow />
}
