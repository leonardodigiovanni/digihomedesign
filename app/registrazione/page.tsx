import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import RegistrationFlow from './registration-flow'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registrazione',
}

export default async function RegistrazionePage() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_user')?.value) redirect('/')

  const { registrazioniDisabilitate } = readSettings()
  if (registrazioniDisabilitate) redirect('/')

  return <RegistrationFlow />
}
